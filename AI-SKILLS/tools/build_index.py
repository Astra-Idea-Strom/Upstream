#!/usr/bin/env python3
"""
build_index.py — AI-SKILLS Router v3 index builder.

Reads the authoritative `skills-index.json` (+ optional `tools/overlays.json`)
and emits the tiered runtime artifacts the router actually loads:

  index/router-card.json        Tier 0  — category map only (~1-2 KB)
  index/cards/<category>.json   Tier 1  — compact skill cards, one file per category
  index/bm25.json               Tier 2  — corpus statistics for lexical scoring
  index/graph.json              Tier 3  — requires / specializes / conflicts / alternatives

Nothing here needs third-party packages. Embeddings are optional and only
read if `index/embeddings.json` already exists (see build_embeddings.py).

Usage:
    python tools/build_index.py            # build everything
    python tools/build_index.py --check    # verify artifacts are in sync, exit 1 if stale
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

ROOT = Path(__file__).resolve().parent.parent
INDEX_SRC = ROOT / "skills-index.json"
OVERLAYS = ROOT / "tools" / "overlays.json"
OUT = ROOT / "index"
CARDS = OUT / "cards"


def extract_skill_description(skill_path: Path) -> str | None:
    """Read authoritative description from SKILL.md frontmatter."""
    if not skill_path.is_file():
        return None
    text = skill_path.read_text(encoding="utf-8")
    m = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.DOTALL)
    if not m:
        return None
    fm_text = m.group(1)
    if yaml is not None:
        try:
            data = yaml.safe_load(fm_text)
            if isinstance(data, dict) and "description" in data:
                return str(data["description"]).strip()
        except Exception:
            pass
    dm = re.search(r"^description:\s*(.*?)$", fm_text, re.MULTILINE)
    if not dm:
        return None
    v = dm.group(1).strip()
    if v in (">-", ">", "|", "|-", ""):
        lines = []
        for line in fm_text[dm.end():].splitlines():
            if line.startswith("  ") or line.startswith("\t"):
                lines.append(line.strip())
            elif not line.strip() and lines:
                lines.append("")
            else:
                break
        return re.sub(r"\s+", " ", " ".join(lines)).strip()
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        return v[1:-1].strip()
    return v

# Tokens are estimated at 4 chars/token. Replace with a real tokenizer if one
# is available; the router only needs relative magnitudes to budget correctly.
CHARS_PER_TOKEN = 4

STOP = frozenset("""a an the this that these those there here is are was were be been being am
to for in on at of with by from into about as out up over and or but if then than so not no do
does did done can could should would will shall may might must i we you me us my our your their
its it what how when which who why whose please help need needs want wants make makes get gets
let some any all more most very have has had just like also too now""".split())

WORD_RE = re.compile(r"[a-z0-9][a-z0-9+.#/_-]*")


def tokenize(text: str) -> list[str]:
    """Lowercase, split, drop stopwords, and add a crude singular form."""
    out: list[str] = []
    for w in WORD_RE.findall(text.lower()):
        if w in STOP or len(w) < 2:
            continue
        out.append(w)
        if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
            out.append(w[:-1])
        # split hyphenated compounds so "api-security" also matches "security"
        if "-" in w:
            out.extend(p for p in w.split("-") if p and p not in STOP and len(p) > 2)
    return out


def measure_tokens(path: Path) -> int:
    try:
        return max(1, path.stat().st_size // CHARS_PER_TOKEN)
    except OSError:
        return 0


def build_card(skill: dict, overlay: dict) -> dict:
    """Auto-migrate a v2 index entry into a v3 routing card."""
    name = skill["name"]
    skill_md = ROOT / skill["path"] / "SKILL.md"
    ov = overlay.get(name, {})

    hard_requires = list(skill.get("requires", []))
    soft_requires = list(ov.get("requires_soft", []))
    # A parent that is merely the category root is a *soft* dependency: useful
    # context, not a correctness requirement. Overlay `gate: *_parent_only`
    # skills are exactly those roots, so demote edges pointing at them later.

    return {
        "name": name,
        "category": skill["category"],
        "path": skill["path"],
        # `summary` is the only free text the router ever puts in an LLM prompt.
        "summary": skill["description"].strip().replace("\n", " ")[:220],
        "triggers": skill.get("triggers", []),
        "capabilities": skill.get("capabilities", []),
        "aliases": ov.get("aliases", []),
        "example_queries": ov.get("example_queries", []),
        "negative_triggers": ov.get("negative_triggers", []),
        "role": ov.get("role", "lead"),
        "gate": ov.get("gate", "none"),
        "requires": hard_requires,
        "requires_soft": soft_requires,
        "specializes": ov.get("specializes", []),
        "alternative_to": ov.get("alternative_to", []),
        "complements": skill.get("complements", []),
        "conflicts": skill.get("conflicts", []),
        "priority": skill.get("priority", "normal"),
        "security_sensitive": skill.get("security_sensitive", False),
        "activation_cost": measure_tokens(skill_md),
    }


def retrieval_document(card: dict) -> str:
    """The text BM25 indexes. Name/alias fields are repeated to weight them."""
    parts = [
        card["name"], card["name"], card["name"],
        card["name"].replace("-", " "),
        " ".join(card["aliases"]), " ".join(card["aliases"]),
        " ".join(card["triggers"]), " ".join(card["triggers"]),
        " ".join(card["capabilities"]),
        " ".join(card["example_queries"]),
        card["summary"],
        card["category"],
    ]
    return " ".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="verify freshness only")
    args = ap.parse_args()

    src = json.loads(INDEX_SRC.read_text(encoding="utf-8"))
    skills = src["skills"]

    # Synchronize authoritative frontmatter descriptions into skills-index.json (R9 / I-02)
    changed = False
    if src.get("total_skills") != len(skills):
        src["total_skills"] = len(skills)
        changed = True

    for s in skills:
        skill_file = ROOT / s["path"] / "SKILL.md"
        desc = extract_skill_description(skill_file)
        if desc and desc != s.get("description"):
            s["description"] = desc
            changed = True

    if changed and not args.check:
        src["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        INDEX_SRC.write_text(json.dumps(src, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    overlay = json.loads(OVERLAYS.read_text(encoding="utf-8")) if OVERLAYS.is_file() else {}
    overlay = {k: v for k, v in overlay.items() if not k.startswith("_")}
    cards = [build_card(s, overlay) for s in skills]
    by_name = {c["name"]: c for c in cards}

    # ---- demote category-root `requires` edges to soft ------------------
    roots = {c["name"] for c in cards if c["gate"].endswith("_parent_only")}
    for c in cards:
        removed = set(overlay.get(c["name"], {}).get("requires_remove", []))
        hard = [r for r in c["requires"] if r not in roots and r not in removed]
        soft = [r for r in c["requires"] if r in roots] + c["requires_soft"]
        c["requires"], c["requires_soft"] = hard, sorted(set(soft))

    # ---- referential integrity -----------------------------------------
    problems = []
    for c in cards:
        for field in ("requires", "requires_soft", "specializes", "alternative_to",
                      "complements", "conflicts"):
            for ref in c[field]:
                if ref not in by_name:
                    problems.append(f"{c['name']}.{field} -> unknown skill '{ref}'")
        if not (ROOT / c["path"] / "SKILL.md").is_file():
            problems.append(f"{c['name']}: missing {c['path']}SKILL.md")
    if problems:
        print("[FAIL] index integrity:", file=sys.stderr)
        for p in problems:
            print("  -", p, file=sys.stderr)
        return 1

    if args.check:
        if src.get("total_skills") != len(skills):
            print(f"[FAIL] total_skills ({src.get('total_skills')}) != len(skills) ({len(skills)})", file=sys.stderr)
            return 1
        divergent = []
        for s in skills:
            skill_file = ROOT / s["path"] / "SKILL.md"
            desc = extract_skill_description(skill_file)
            if desc and desc != s.get("description"):
                divergent.append(s["name"])
        if divergent:
            print(f"[FAIL] {len(divergent)} descriptions diverge from SKILL.md: {divergent[:5]}", file=sys.stderr)
            return 1
        fingerprint = hashlib.sha256(INDEX_SRC.read_bytes()).hexdigest()[:16]
        build_file = OUT / "BUILD"
        if not build_file.is_file():
            print("[FAIL] index/BUILD missing", file=sys.stderr)
            return 1
        if build_file.read_text(encoding="utf-8").strip() != fingerprint:
            print("[FAIL] index is stale relative to skills-index.json", file=sys.stderr)
            return 1
        print("[OK] index is up to date")
        return 0

    # ---- BM25 corpus statistics ----------------------------------------
    docs = {c["name"]: tokenize(retrieval_document(c)) for c in cards}
    df: Counter = Counter()
    for toks in docs.values():
        df.update(set(toks))
    n_docs = len(docs)
    bm25 = {
        "n_docs": n_docs,
        "avg_len": sum(len(t) for t in docs.values()) / max(1, n_docs),
        "idf": {t: math.log(1 + (n_docs - c + 0.5) / (c + 0.5)) for t, c in df.items()},
        "tf": {name: dict(Counter(toks)) for name, toks in docs.items()},
        "doc_len": {name: len(toks) for name, toks in docs.items()},
    }

    # ---- shards ---------------------------------------------------------
    by_cat: dict[str, list[dict]] = {}
    for c in cards:
        by_cat.setdefault(c["category"], []).append(c)

    OUT.mkdir(exist_ok=True)
    CARDS.mkdir(exist_ok=True)

    router_card = {
        "version": "3.0.0",
        "total_skills": len(cards),
        "contract": "Load Tier 0 only. Open at most 2 category shards. Never load "
                    "skills-index.json at runtime.",
        "categories": [],
    }
    for cat in sorted(by_cat):
        group = sorted(by_cat[cat], key=lambda c: c["name"])
        shard_path = CARDS / f"{cat}.json"
        # Slim shard: this is what a *human or LLM* reads when no code
        # execution is available. Full metadata lives in graph.json/bm25.json,
        # which only the Python router ever opens.
        shard = {"category": cat, "skills": [
            {"name": c["name"],
             "use_when": c["summary"][:150],
             "keys": (c["aliases"] or c["triggers"])[:20],
             "not_for": c["negative_triggers"][:3],
             "cost": c["activation_cost"]}
            for c in group
        ]}
        shard_path.write_text(json.dumps(shard, indent=1, ensure_ascii=False), encoding="utf-8")
        # Tier-0 keywords: the discriminating vocabulary of the category
        kw: Counter = Counter()
        for c in group:
            kw.update(tokenize(" ".join(c["aliases"] + c["capabilities"] + [c["name"]])))
        router_card["categories"].append({
            "category": cat,
            "skills": len(group),
            "shard": f"index/cards/{cat}.json",
            "shard_tokens": measure_tokens(shard_path),
            "keywords": [w for w, _ in kw.most_common(14)],
            "names": [c["name"] for c in group],
        })

    (OUT / "router-card.json").write_text(
        json.dumps(router_card, indent=1, ensure_ascii=False), encoding="utf-8")
    (OUT / "bm25.json").write_text(json.dumps(bm25), encoding="utf-8")

    graph = {c["name"]: {k: c[k] for k in
                         ("requires", "requires_soft", "specializes", "alternative_to",
                          "conflicts", "complements", "role", "gate", "priority",
                          "activation_cost", "category", "path", "negative_triggers", "aliases")}
             for c in cards}
    (OUT / "graph.json").write_text(json.dumps(graph), encoding="utf-8")

    fingerprint = hashlib.sha256(INDEX_SRC.read_bytes()).hexdigest()[:16]
    (OUT / "BUILD").write_text(fingerprint, encoding="utf-8")

    t0 = measure_tokens(OUT / "router-card.json")
    shard_avg = sum(cat["shard_tokens"] for cat in router_card["categories"]) / len(router_card["categories"])
    print(f"[OK] {len(cards)} skills -> {len(by_cat)} shards")
    print(f"     Tier 0 router-card : ~{t0} tokens")
    print(f"     Tier 1 shard (avg) : ~{shard_avg:.0f} tokens")
    print(f"     agent-native worst case (Tier0 + 2 shards): ~{t0 + 2 * shard_avg:.0f} tokens")
    return 0


if __name__ == "__main__":
    sys.exit(main())
