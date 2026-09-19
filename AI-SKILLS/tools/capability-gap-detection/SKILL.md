---
name: capability-gap-detection
description: >-
  Detect and triage missing capabilities in a skill library instead of adding
  skills speculatively: gap signals from routing failures, the evidence bar for
  a new skill, extend-vs-create decisions and the retire path. Use when routing
  scatters across unrelated skills, when tempted to add skills in bulk, or when
  deciding whether a request needs a new skill or a wider alias list.
---

# Capability Gap Detection: Evidence-Gated Library Growth

## 0. Activation Boundary
**Use for:** deciding *whether* a skill should exist.
**Do not use for:** writing one once decided (use `skill-authoring`), or for
finding third-party skills (use `skill-discovery`).

## 1. The four gap signals
A capability gap is **detected**, never assumed. Ranked by strength:

1. **Scatter** — a real request routes to 4+ weakly-scoring skills from unrelated
   categories. The retriever is telling you nothing owns this concept.
   *Observed: "users in india see dates in the wrong format" → authorization,
   authentication, ui-ux, prompt-engineering, e2e-testing. Nothing owns i18n.*
2. **Abstention on a real task** — router returns zero skills for a request that
   clearly is engineering work.
3. **Chronic co-activation** — two skills always appear together and each is
   used for half its content. Signals a bad seam, usually a merge, not a new skill.
4. **Implementation stall** — mid-task, the agent needed guidance no loaded skill
   contained and had to improvise. Log it; three occurrences is a gap.

## 2. The evidence bar
Do not create a skill until **all** hold:
- [ ] ≥3 distinct real requests hit the gap (not 3 rephrasings of one).
- [ ] No existing skill covers >60 % of it — otherwise extend that skill.
- [ ] It has a defensible activation boundary (you can write the `not_for` list).
- [ ] It survives the negation test: naming a request that must *not* trigger it.
- [ ] Its aliases do not collide with an existing skill's top-scoring vocabulary.

## 3. Extend vs create
| Symptom | Action |
| :--- | :--- |
| Right skill retrieved, wrong vocabulary | Add `aliases[]`. **No new skill.** |
| Right skill retrieved, missing content | Extend the `SKILL.md`. **No new skill.** |
| Right skill retrieved, wrong for a sub-case | Add a `specializes` child skill. |
| Nothing retrieved; scatter across categories | **New skill.** |
| Two skills always co-fire and half-used | Merge, or split along the real seam. |

Most apparent gaps are alias gaps. Adding vocabulary is one line of data;
adding a skill is permanent surface area and permanent routing collision risk.

## 4. The growth loop
```text
run eval ──► failures ──► classify (alias | content | boundary | genuine gap)
   ▲                                              │
   └──── re-run eval, require F1 ↑ and cost ↔ ◄───┘
```
Every new skill must be added **with** its eval cases in the same commit, and the
suite must not regress. A skill that does not improve a measured number is
context debt.

## 5. Retirement
A skill that has not been the lead for any eval case or any real session in 90
days is a retirement candidate. Libraries are pruned, not only grown — every
resident skill widens the collision surface for every future query.

## 6. Anti-Patterns
- **Speculative breadth** — "we should probably have a Kubernetes skill."
- **Category symmetry** — adding a skill so a category looks complete.
- **One-request skills** — created from a single unusual request.
- **Gap-by-vibes** — no failing eval case attached to the proposal.

## 7. Verification Check
- Which failing eval case does this skill fix?
- Which existing skill did I try to extend first, and why did it not work?
- What must *not* trigger it?
- Did the suite improve after adding it?
