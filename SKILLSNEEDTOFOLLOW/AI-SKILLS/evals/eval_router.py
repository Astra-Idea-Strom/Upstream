#!/usr/bin/env python3
"""
eval_router.py — measures what the old 15-case test suite could not:
precision, recall, forbidden-activation rate, abstention accuracy, and the
actual context cost in tokens.

    python evals/eval_router.py                       # score router v3
    python evals/eval_router.py --baseline            # score the old router
    python evals/eval_router.py --fail-under 0.75     # use as a CI gate
"""
from __future__ import annotations

import argparse
import json
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

DATASET = Path(__file__).resolve().parent / "router_eval.jsonl"


def load_cases(path: Path) -> list[dict]:
    return [json.loads(l) for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]


def run_v3(q: str, budget: int) -> tuple[list[str], int]:
    import route3
    d = route3.route(q, budget=budget)
    return [s["name"] for s in d["skills"]], d["tokens"]


def run_v2(q: str, _budget: int) -> tuple[list[str], int]:
    sys.path.insert(0, str(ROOT / "evals" / "baseline"))
    import route_v2 as legacy
    d = legacy.route_skills(q)
    names = [s["name"] for s in d["skills"]]
    # legacy has no cost model; charge the real SKILL.md size so the comparison
    # is like-for-like.
    total = 0
    for s in d["skills"]:
        p = s["path"]
        if p.endswith("/"):
            f = ROOT / p / "SKILL.md"
        elif p.endswith(".md"):
            f = ROOT / p
        else:
            f = ROOT / p / "SKILL.md"
        total += (f.stat().st_size // 4) if f.is_file() else 400
    return names, total


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", action="store_true", help="evaluate legacy evals/baseline/route_v2.py")
    ap.add_argument("--budget", type=int, default=5000)
    ap.add_argument("--dataset", default=None, help="custom dataset path")
    ap.add_argument("--heldout", action="store_true", help="evaluate on evals/router_heldout.jsonl")
    ap.add_argument("--fail-under", type=float, default=None, help="min F1 to exit 0")
    ap.add_argument("--show-failures", action="store_true")
    a = ap.parse_args()

    if a.heldout:
        dataset_path = ROOT / "evals" / "router_heldout.jsonl"
    elif a.dataset:
        dataset_path = Path(a.dataset)
    else:
        dev_file = ROOT / "evals" / "router_dev.jsonl"
        dataset_path = dev_file if dev_file.is_file() else (ROOT / "evals" / "router_eval.jsonl")

    cases = load_cases(dataset_path)
    runner = run_v2 if a.baseline else run_v3

    precs, recs, costs, sizes = [], [], [], []
    forbidden_hits = exact_abstain = abstain_total = 0
    lead_correct = lead_total = 0
    failures = []

    for c in cases:
        sel, cost = runner(c["q"], a.budget)
        must, forbid = set(c["must"]), set(c["forbid"])
        sel_set = set(sel)

        if must:
            rec = len(must & sel_set) / len(must)
            # precision is measured against "skills that were asked for",
            # tolerating hard dependencies is intentional: we count any
            # selected skill not in `must` as a cost, which is the honest view.
            prec = len(must & sel_set) / max(1, len(sel_set))
            recs.append(rec)
            precs.append(prec)
            lead_total += 1
            if sel and sel[0] in must:
                lead_correct += 1
        else:
            abstain_total += 1
            if not sel_set:
                exact_abstain += 1

        if forbid & sel_set:
            forbidden_hits += 1
            failures.append((c["id"], c["q"], "FORBIDDEN", sorted(forbid & sel_set)))
        elif must and not (must & sel_set):
            failures.append((c["id"], c["q"], "MISS", sorted(must)))
        elif not must and sel_set:
            failures.append((c["id"], c["q"], "OVER-ACTIVATION", sel))

        costs.append(cost)
        sizes.append(len(sel))

    p = statistics.mean(precs) if precs else 0.0
    r = statistics.mean(recs) if recs else 0.0
    f1 = 2 * p * r / (p + r) if (p + r) else 0.0

    label = "legacy route_v2.py" if a.baseline else "router v3"
    print(f"\n=== {label} — {len(cases)} unseen prompts ===")
    print(f"  precision (macro)       : {p:.3f}")
    print(f"  recall (macro)          : {r:.3f}")
    print(f"  F1                      : {f1:.3f}")
    print(f"  lead-skill accuracy     : {lead_correct}/{lead_total} "
          f"({lead_correct/max(1,lead_total):.3f})")
    print(f"  forbidden activations   : {forbidden_hits}/{len(cases)} "
          f"({forbidden_hits/len(cases):.3f})")
    print(f"  correct abstentions     : {exact_abstain}/{abstain_total}")
    print(f"  skills per query (mean) : {statistics.mean(sizes):.2f} "
          f"(median {statistics.median(sizes):.0f}, max {max(sizes)})")
    print(f"  context cost (mean)     : {statistics.mean(costs):.0f} tokens")
    print(f"  context cost (p95)      : {sorted(costs)[int(0.95*len(costs))-1]} tokens")
    print(f"  total cost, whole suite : {sum(costs):,} tokens")

    if a.show_failures and failures:
        print(f"\n  {len(failures)} failing cases:")
        for fid, q, kind, detail in failures:
            print(f"    [{fid:>3}] {kind:<16} {q[:58]:<58} {detail}")

    if a.fail_under is not None and f1 < a.fail_under:
        print(f"\n[FAIL] F1 {f1:.3f} < {a.fail_under}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
