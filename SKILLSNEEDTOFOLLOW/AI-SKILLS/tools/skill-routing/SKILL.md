---
name: skill-routing
description: >-
  Deterministic two-stage skill router: index shards, BM25 lexical scoring, intent classification, and overlays. Use when selecting optimal skills for a user prompt, computing lexical match scores, or tuning routing overlays. Not for general skill creation or file formatting (that is skill-authoring or skill-adaptation).
---

# Skill Routing: Intent Resolution, Priority Arbitration & Progressive Disclosure

## 1. Core Routing Invariants

1. **Zero-Manifest Runtime**: The v3 router queries compact precomputed indices (`index/router-card.json`, `index/cards/<category>.json`, `index/graph.json`, `index/bm25.json`) rather than loading monolithic manifest JSON into agent context.
2. **Hybrid Multi-Ranker Fusion**: Combines precomputed BM25 scoring with exact phrase/alias matching via Reciprocal Rank Fusion (k=60), absolute score floors (`MIN_LEXICAL = 4.2`), and calibrated elbow cuts (`REL_ELBOW = 0.62`).
3. **Explicit Negative Triggers & Intent Gating**: Hard vetoes suppress catastrophic false positives (e.g., vetoing `deployment` on variable renames), while intent gates (`never_auto`, `review_only`, `test_intent_only`) prevent ambient meta-skills from polluting active context.
4. **Dynamic Calibrated Bounds (0..N Skills within Token Budget)**: Router output is bounded by an explicit token knapsack (default 5,000 tokens, hard cap 6). Returns 0 skills cleanly when answering from base capability; avoids arbitrary fixed 2-8 bounds.
5. **Deterministic Graph Resolution**: Automatically resolves mandatory dependencies (`requires`), demotes superseded parents when specialized child skills match (`specializes`), resolves alternatives (`alternative_to`), and enforces mutual exclusion (`conflicts`).

---

## 2. Key Implementation Patterns

### A. Progressive Disclosure Routing (`tools/route3.py`)
```bash
# Query the router to obtain the minimum sufficient skill set and leading skill
python tools/route3.py "Build a resilient Stripe checkout webhook with HMAC verification"

# Output relative SKILL.md file paths directly for agent inspection
python tools/route3.py --paths "Build a resilient Stripe checkout webhook with HMAC verification"

# Emit machine-readable routing decision JSON with custom token budget
python tools/route3.py --json --budget 4000 "fix this crash and make it not happen again"

# Inspect ranker contributions, gate decisions, and graph traversal trace
python tools/route3.py --explain "make the dashboard work on phones"

# Force inclusion of a never_auto meta-skill
python tools/route3.py --force skill-evaluation "evaluate our router against the golden set"
```

### B. Index Generation and Verification (`tools/build_index.py`)
Whenever skills are added, modified, or re-categorized in `skills-index.json`:
```bash
# Rebuild index shards, router card, graph, and BM25 precomputed stats
python tools/build_index.py

# Verify index freshness against source sha256 fingerprint in CI
python tools/build_index.py --check
```

### C. Execution Phasing Protocol
Multi-skill workflows execute in structured phases determined by the router decision:
- **Phase 1 (Lead Skill)**: Immediate primary objective (e.g. `debugging`).
- **Phase 2 (Supporting Skill)**: Structural containment and resilience (e.g. `error-handling`).
- **Phase 3 (Verification Skill)**: Automated regression testing (e.g. `unit-testing`).

---

## 3. Anti-Patterns to Avoid

- **Greedy Whole-Corpus Loading**: Loading all 91 skill markdown files into initial agent context, exhausting token budgets on unused instructions.
- **Stopword Trigger Contamination**: Triggering skills on non-content function words (`this`, `make`, `is`) rather than domain-bearing terms.
- **Unphased Conflation**: Applying defensive guards or refactoring while an active crash is still unisolated.
- **Hardcoded 2-8 Bounds**: Forcing irrelevant skills onto trivial questions or failing to abstain on general knowledge questions.

---

## 4. Verification Commands

```bash
# Run unseen prompt evaluation harness
python evals/eval_router.py --show-failures --fail-under 0.80

# Verify index freshness and skill schema integrity
python tools/build_index.py --check
python tools/skill-validation/validate_skills.py
```