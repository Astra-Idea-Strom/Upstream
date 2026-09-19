---
name: skill-evaluation
description: >-
  Build and run evaluation sets for skill routing and skill quality: labelled
  prompt sets with must/forbid targets, precision, recall, F1, lead accuracy,
  abstention rate and context-token cost, wired into CI as a gate. Use when
  changing a router, adding or editing skills, or when someone claims a routing
  change is an improvement without a number attached.
---

# Skill Evaluation: Measuring Routing Quality and Context Cost

## 0. Activation Boundary
**Use for:** measuring whether skill selection is correct and affordable.
**Do not use for:** evaluating model outputs or prompt quality (use
`ai-evaluation`), or functional test suites for application code (use
`unit-testing`).

## 1. Why hand-written expectations are not an eval set
A suite where you wrote both the prompt and the expected answer measures
*self-consistency*, not quality. Fifteen passing cases prove fifteen things.
An eval set must be:
- **Unseen** — written before the fix, or by someone who did not write the router.
- **Labelled both ways** — `must` (required) **and** `forbid` (must not appear).
- **Adversarial** — colloquial, misspelled, truncated, multi-intent.
- **Abstention-bearing** — 5–10 % of cases whose correct answer is *no skills*.

## 2. The label schema
```json
{"id": 17, "q": "the dashboard is unusable on a phone",
 "must": ["responsive-design"], "forbid": ["analytics", "queues"]}
```
`forbid` is the field that catches over-selection. Without it, a router that
returns all 86 skills scores perfect recall.

## 3. The metrics that matter
| Metric | Formula | Catches |
| :--- | :--- | :--- |
| Recall (macro) | mean(|must ∩ sel| / |must|) | missed skills |
| Precision (macro) | mean(|must ∩ sel| / |sel|) | over-selection |
| F1 | harmonic mean | the trade-off |
| Lead accuracy | sel[0] ∈ must | wrong primary intent |
| Forbidden-activation rate | cases where forbid ∩ sel ≠ ∅ | actively harmful picks |
| Abstention accuracy | empty-must cases answered with 0 skills | failure to say "no" |
| Context cost (mean, p95) | Σ tokens of loaded SKILL.md | the actual goal |

**Always report cost next to quality.** A router that gains 2 points of F1 by
loading 3 more skills has made the system worse.

## 4. Minimum sizes
- 100 prompts to detect a 10-point F1 change.
- 300+ before trusting a 2-point change.
- Re-label, never re-fit: if you edit the eval to make the router pass, you have
  deleted your only instrument.

## 5. CI wiring
```bash
python evals/eval_router.py --fail-under 0.80 --show-failures
```
Gate on **F1 and cost**, print the failing cases, and fail the build when the
generated index is stale relative to its source.

## 6. Anti-Patterns
- **Tuning on the eval set** — hold out 20 % or accept that you are overfitting.
- **Reporting only aggregates** — always print the failing case list.
- **Hiding known failures** — publish them with a diagnosis, as a backlog.
- **Testing the scoring function instead of the router** — reimplementing router
  logic inside the test is a fork, and forks drift.

## 7. Verification Check
- Does the suite contain cases whose correct answer is zero skills?
- Does it measure tokens as well as correctness?
- Were the prompts written before the change they are judging?
- Can it fail the build?
