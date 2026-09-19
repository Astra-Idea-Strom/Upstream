#!/usr/bin/env python3
"""
route3.py — AI-SKILLS Router v3.

Pipeline (all stages are optional-free, stdlib only):

  query
    -> normalise + tokenize
    -> [R1] BM25 over precomputed corpus stats        (index/bm25.json)
    -> [R2] phrase/alias exact-match ranker
    -> [R3] dense cosine ranker                       (index/embeddings.json, optional)
    -> RRF fusion (k=60) of whichever rankers exist
    -> negative-trigger veto
    -> intent gates (a skill with a gate must have its gate fire)
    -> calibrated cut  => 0..N candidates, never a fixed floor
    -> graph resolution (specializes / alternative_to / conflicts / requires)
    -> token-budget knapsack
    -> emit paths + a cost report

Exit code is 0 even when zero skills are selected: "no skill needed" is a
legitimate answer, not an error.

    python tools/route3.py "fix the 500 on POST /orders"
    python tools/route3.py --json --budget 4000 "audit our session handling"
    python tools/route3.py --explain "make the dashboard work on phones"
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDX = ROOT / "index"

# ---------------------------------------------------------------- constants
K1, B = 1.2, 0.75          # BM25
RRF_K = 60                 # Cormack et al. 2009; optimum is flat over k in [20,100]
MIN_LEXICAL = 4.2          # absolute BM25 floor: below this a "match" is vocabulary noise
ABS_FLOOR = 0.34           # fraction of the top *raw* score below which a skill is noise
REL_ELBOW = 0.62           # a >38% drop from the previous kept skill ends the list
DEFAULT_BUDGET = 5000      # tokens of SKILL.md the router is allowed to spend
HARD_CAP = 5               # safety rail, not a target

STOP = frozenset("""a an the this that these those there here is are was were be been being am
to for in on at of with by from into about as out up over and or but if then than so not no do
does did done can could should would will shall may might must i we you me us my our your their
its it what how when which who why whose please help need needs want wants make makes get gets
let some any all more most very have has had just like also too now my mine""".split())

WORD_RE = re.compile(r"[a-z0-9][a-z0-9+.#/_-]*")

# Pure-knowledge questions are answered from base capability. A skill library is
# for *doing engineering work*, not for defining terms, so abstain outright.
ABSTAIN_RE = re.compile(
    r"^\s*(what (is|are|was|were|does|time)|who (is|was)|when (is|was|did)|where is"
    r"|explain (what|who|why|the (concept|difference))|tell me about"
    r"|write (me )?(a )?(haiku|poem|song|limerick|story)|thanks|thank you|nice|cool)\b")

# ------------------------------------------------------------------- gates
# Gates never *add* a skill. They only decide whether a gated skill is allowed
# to survive. That is the whole point: one regex getting stale can cost recall
# on one skill, it can no longer inject four unrelated ones.
GATE_PREDICATES: dict[str, re.Pattern] = {
    "ambiguous_only": re.compile(
        r"\b(make it (better|nicer|good|professional|pop)|looks? (bad|off|ugly|cheap|dated)"
        r"|feels? off|don.?t know what.?s wrong|something.s wrong|just fix it"
        r"|something like|not sure|figure out what|clean(er)? up the (ux|ui|app)"
        r"|whatever(’|')?s needed|do what(’|')?s right)\b"),
    "multi_step_only": re.compile(
        r"\b(plan|roadmap|milestones?|phases?|break (it|this) down|step by step|end.to.end"
        r"|from scratch|greenfield|build (a|an|the) (whole|entire|full))\b"),
    "tradeoff_only": re.compile(
        r"\b(should (we|i)|which (one|is better|database|store|framework)|trade.?offs?|pros and cons|adr|decide between"
        r"|\bvs\.?\b|compare)\b"),
    "review_only": re.compile(
        r"\b(review|critique|feedback on|is this (good|ok|idiomatic|safe)|pr\b|pull request"
        r"|(safe|before) (i|we|to) merge|smells?)\b"),
    "test_intent_only": re.compile(
        r"\b(test|tests|testing|spec|coverage|tdd|assert|mock|fixture|regress|ci fail"
        r"|prove it works|make sure it (doesn.t break|keeps working))\b"),
    "security_intent_only": re.compile(
        r"\b(secure|security|harden|vulnerab|exploit|attack|audit|pentest|owasp|cve|breach"
        r"|leak|injection|csrf|xss|auth bypass|threat|compliance|penetration|safe to merge)\b"),
    "design_intent_only": re.compile(
        r"\b(design|architect|architecture|model the|before we build|greenfield|new system)\b"),
    "never_auto": re.compile(r"(?!x)x"),        # only reachable via --force
    "always_if_matched": re.compile(r".*"),     # e.g. safety-critical domains
    "backend_parent_only": re.compile(r"(?!x)x"),
    "frontend_parent_only": re.compile(r"(?!x)x"),
    "ai_parent_only": re.compile(r"(?!x)x"),
    "none": re.compile(r".*"),
}


def tokenize(text: str) -> list[str]:
    out: list[str] = []
    for w in WORD_RE.findall(text.lower()):
        if w in STOP or len(w) < 2:
            continue
        out.append(w)
        if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
            out.append(w[:-1])
        if "-" in w:
            out.extend(p for p in w.split("-") if p and p not in STOP and len(p) > 2)
    return out


def load() -> tuple[dict, dict, dict | None]:
    graph = json.loads((IDX / "graph.json").read_text(encoding="utf-8"))
    bm25 = json.loads((IDX / "bm25.json").read_text(encoding="utf-8"))
    emb_path = IDX / "embeddings.json"
    emb = json.loads(emb_path.read_text(encoding="utf-8")) if emb_path.is_file() else None
    return graph, bm25, emb


# ----------------------------------------------------------------- rankers
def rank_bm25(q_tokens: list[str], bm25: dict) -> list[tuple[str, float]]:
    idf, tf, dl = bm25["idf"], bm25["tf"], bm25["doc_len"]
    avg = bm25["avg_len"]
    scores: dict[str, float] = {}
    for name, freqs in tf.items():
        s = 0.0
        length = dl[name]
        for t in q_tokens:
            f = freqs.get(t)
            if not f:
                continue
            s += idf.get(t, 0.0) * (f * (K1 + 1)) / (f + K1 * (1 - B + B * length / avg))
        if s > 0:
            scores[name] = s
    return sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))


def rank_phrases(query: str, graph: dict, shards_dir: Path) -> list[tuple[str, float]]:
    """Exact multi-word alias/trigger containment. Cheap, high-precision."""
    q = f" {re.sub(r'[^a-z0-9 /.+#-]', ' ', query.lower())} "
    q = re.sub(r"\s+", " ", q)
    scores: dict[str, float] = {}
    for name, g in graph.items():
        for key in g.get("aliases", []):
            k = key.lower().strip()
            if len(k) < 3:
                continue
            if f" {k} " in q or (" " in k and k in q):
                weight = 2.0 + 0.5 * k.count(" ")
                scores[name] = scores.get(name, 0.0) + weight
    if shards_dir.is_dir():
        for cat_file in sorted(shards_dir.glob("*.json")):
            shard = json.loads(cat_file.read_text(encoding="utf-8"))
            for entry in shard.get("skills", []):
                n = entry["name"]
                for key in entry.get("keys", []):
                    k = key.lower().strip()
                    if len(k) < 3 or k in [a.lower() for a in graph.get(n, {}).get("aliases", [])]:
                        continue
                    if f" {k} " in q or (" " in k and k in q):
                        weight = 2.0 + 0.5 * k.count(" ")
                        scores[n] = max(scores.get(n, 0.0), weight)
    return sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))


def rank_dense(query: str, emb: dict) -> list[tuple[str, float]]:
    """Cosine over precomputed unit vectors. `emb` maps skill -> list[float]
    and must contain a 'query_vectors' cache or an inference hook; when neither
    is present we degrade silently to lexical-only."""
    qv = emb.get("query_vectors", {}).get(query.strip().lower())
    if not qv:
        return []
    out = []
    for name, vec in emb["vectors"].items():
        dot = sum(a * b for a, b in zip(qv, vec))
        out.append((name, dot))
    return sorted(out, key=lambda kv: (-kv[1], kv[0]))


def rrf(rank_lists: list[list[tuple[str, float]]], weights: list[float]) -> dict[str, float]:
    fused: dict[str, float] = {}
    for lst, w in zip(rank_lists, weights):
        for pos, (name, _score) in enumerate(lst, start=1):
            fused[name] = fused.get(name, 0.0) + w / (RRF_K + pos)
    return fused


# ------------------------------------------------------------------ router
def route(query: str, budget: int = DEFAULT_BUDGET, hard_cap: int = HARD_CAP,
          force: tuple[str, ...] = (), explain: bool = False) -> dict:
    graph, bm25, emb = load()
    trace: list[str] = []
    q_tokens = tokenize(query)
    q_low = query.lower()

    if ABSTAIN_RE.search(q_low) and not force:
        return {"query": query, "lead": None, "skills": [], "tokens": 0, "budget": budget,
                "note": "Knowledge/creative question, not an engineering task. "
                        "Answer from base capability; load nothing.",
                "trace": ["abstain: knowledge-question pattern"] if explain else None}

    lex = rank_bm25(q_tokens, bm25)
    phr = rank_phrases(query, graph, IDX / "cards")
    den = rank_dense(query, emb) if emb else []

    lists, weights, used = [], [], []
    if lex:
        lists.append(lex); weights.append(1.0); used.append("bm25")
    if phr:
        lists.append(phr); weights.append(1.4); used.append("phrase")
    if den:
        lists.append(den); weights.append(1.6); used.append("dense")
    fused = rrf(lists, weights) if lists else {}

    # RRF fixes *ordering* across incomparable scales, but it discards magnitude
    # -- with a single ranker every rank-1 result scores 1/(k+1) whether it was a
    # bullseye or a stray token hit. So we keep a separate calibrated strength
    # signal and use it for the relevance floor.
    raw = {n: sc for n, sc in lex}
    for n, sc in phr:
        raw[n] = raw.get(n, 0.0) + 3.0 * sc      # a literal alias hit is worth real BM25 mass
    weak = [n for n, sc in raw.items() if sc < MIN_LEXICAL]
    for n in weak:
        fused.pop(n, None)
        raw.pop(n, None)
    trace.append(f"rankers={used or ['none']} candidates={len(fused)} "
                 f"(dropped {len(weak)} below absolute floor {MIN_LEXICAL})")

    # --- negative triggers: hard veto -----------------------------------
    vetoed = []
    for name in list(fused):
        for neg in graph[name].get("negative_triggers", []):
            if neg.lower() in q_low:
                vetoed.append(f"{name} (neg:'{neg}')")
                fused.pop(name, None)
                break
    if vetoed:
        trace.append("vetoed: " + ", ".join(vetoed))

    # --- gates -----------------------------------------------------------
    gated_out = []
    direct_hits = {n for n, _ in phr}
    for name in list(fused):
        gate = graph[name].get("gate", "none")
        if gate == "none" or name in force:
            continue
        # Category roots (backend-engineering, frontend-engineering, llm) are
        # suppressed as ambient noise but admitted when the user names their
        # technology directly ("react", "express", "streaming completion").
        if gate.endswith("_parent_only"):
            if name in direct_hits:
                continue
            gated_out.append(f"{name}({gate})")
            fused.pop(name, None)
            continue
        pred = GATE_PREDICATES.get(gate, GATE_PREDICATES["none"])
        if not pred.search(q_low):
            gated_out.append(f"{name}({gate})")
            fused.pop(name, None)
    if gated_out:
        trace.append("gate-blocked: " + ", ".join(gated_out))

    if not fused:
        return {"query": query, "skills": [], "lead": None, "tokens": 0,
                "note": "No skill scored above the relevance floor. Proceed with "
                        "base capability; do not load anything.",
                "trace": trace if explain else None}

    # order by fused rank, cut by calibrated strength
    ordered = sorted(fused.items(), key=lambda kv: (-(kv[1] + 1e-6 * raw.get(kv[0], 0)), kv[0]))
    top = max(raw.values()) if raw else 0.0

    # --- calibrated cut: 0..N, no artificial minimum ---------------------
    kept: list[tuple[str, float]] = []
    prev = None
    for name, _fused_score in ordered:
        strength = raw.get(name, 0.0)
        if strength < ABS_FLOOR * top:
            break
        if prev is not None and strength < REL_ELBOW * prev:
            break
        kept.append((name, strength))
        prev = strength
        if len(kept) >= hard_cap + 2:
            break
    trace.append(f"cut: {len(ordered)} -> {len(kept)} (top={top:.4f}, floor={ABS_FLOOR*top:.4f})")

    scores = dict(kept)
    selected = [n for n, _ in kept]

    # --- specialisation: child preempts parent ---------------------------
    for name in list(selected):
        for parent in graph[name].get("specializes", []):
            if parent in selected and scores[parent] < scores[name] * 1.15:
                selected.remove(parent)
                trace.append(f"specialises: {name} preempts {parent}")

    # --- alternatives: keep the better of a mutually-exclusive pair ------
    for name in list(selected):
        for alt in graph[name].get("alternative_to", []):
            if name in selected and alt in selected:
                loser = alt if scores[name] >= scores.get(alt, 0) else name
                selected.remove(loser)
                trace.append(f"alternative: dropped {loser}")

    # --- conflicts: now automatically enforced ---------------------------
    for name in list(selected):
        for bad in graph[name].get("conflicts", []):
            if name in selected and bad in selected:
                loser = bad if scores[name] >= scores.get(bad, 0) else name
                selected.remove(loser)
                trace.append(f"conflict: {name} vs {bad} -> dropped {loser}")

    lead = selected[0] if selected else None

    # --- hard requires, from the lead only -------------------------------
    deps: list[str] = []
    frontier = [lead] if lead else []
    seen = set(selected)
    while frontier:
        cur = frontier.pop()
        for req in graph[cur].get("requires", []):
            if req not in seen:
                seen.add(req); deps.append(req); frontier.append(req)
    if deps:
        trace.append("hard deps: " + ", ".join(deps))

    # --- budget knapsack --------------------------------------------------
    def cost(n: str) -> int:
        return max(1, graph[n].get("activation_cost", 400))

    final: list[str] = []
    spent = 0
    for n in ([lead] if lead else []) + deps:
        if n and n not in final:
            final.append(n); spent += cost(n)
    rest = sorted((n for n in selected if n not in final),
                  key=lambda n: -(scores.get(n, 0) / cost(n)))
    if lead and scores.get(lead, 0) > 0:
        lead_score = scores[lead]
        rest = [n for n in rest if scores.get(n, 0) >= 0.25 * lead_score]
    for n in rest:
        if len(final) >= hard_cap:
            trace.append(f"cap: dropped {n}"); continue
        if spent + cost(n) > budget:
            trace.append(f"budget: dropped {n} (+{cost(n)} > {budget - spent} left)")
            continue
        final.append(n); spent += cost(n)

    if not final:
        return {"query": query, "lead": None, "skills": [], "tokens": 0,
                "budget": budget,
                "note": "Candidates existed but none cleared the relevance floor. "
                        "Proceed with base capability.",
                "trace": trace if explain else None}

    out = []
    for n in final:
        g = graph[n]
        out.append({
            "name": n,
            "category": g["category"],
            "role": g.get("role", "lead"),
            "priority": g.get("priority", "normal"),
            "security_sensitive": n in graph and g.get("category") == "security",
            "reason": "lead" if n == lead else ("required-by-lead" if n in deps else "supporting"),
            "score": round(scores.get(n, 0.0), 5),
            "tokens": cost(n),
            "path": f"{g['path']}SKILL.md",
        })

    return {
        "query": query,
        "lead": lead,
        "skills": out,
        "tokens": spent,
        "budget": budget,
        "note": None,
        "trace": trace if explain else None,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="AI-SKILLS Router v3")
    ap.add_argument("query", nargs="*")
    ap.add_argument("--budget", type=int, default=DEFAULT_BUDGET)
    ap.add_argument("--max", "--cap", dest="cap", type=int, default=HARD_CAP)
    ap.add_argument("--force", action="append", default=[])
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--paths", action="store_true")
    ap.add_argument("--explain", action="store_true")
    a = ap.parse_args()

    q = " ".join(a.query).strip()
    if not q:
        ap.print_help(); return 1

    d = route(q, budget=a.budget, hard_cap=a.cap, force=tuple(a.force), explain=a.explain)

    if a.json:
        print(json.dumps(d, indent=2)); return 0
    if a.paths:
        for s in d["skills"]:
            print(s["path"])
        return 0

    print(f'\nQuery: "{q}"')
    if not d["skills"]:
        print(f"-> 0 skills. {d['note']}")
    else:
        print(f"-> {len(d['skills'])} skills, ~{d['tokens']} tokens "
              f"({d['tokens']*100//max(1,d['budget'])}% of budget)")
        for i, s in enumerate(d["skills"], 1):
            tag = "LEAD" if s["reason"] == "lead" else s["reason"]
            print(f"  {i}. {s['name']:<26} [{tag}] {s['tokens']:>5}t  {s['path']}")
    if d.get("trace"):
        print("  trace:")
        for t in d["trace"]:
            print("    -", t)
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
