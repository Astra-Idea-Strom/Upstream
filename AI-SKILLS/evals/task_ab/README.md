# Task-Level A/B Evaluation Harness

## Purpose
Routing accuracy measures only whether the router selects the intended skill files. It does **not** prove that loading those skills actually improves the quality, correctness, security, or maintainability of generated code.

This harness measures end-to-end task performance under a double-blind, rubrics-based A/B methodology comparing:
- **Condition A (Baseline)**: Model generates solutions without skills loaded.
- **Condition B (Skill-Routed)**: Model generates solutions with skills dynamically routed via `tools/route3.py`.

---

## Evaluation Protocol

1. **Test Tasks**: 10 realistic coding tasks defined in `tasks.jsonl`, spanning Frontend, Backend, Security, Testing, and Data.
2. **Double-Blind Scoring**:
   - Outputs from Condition A and Condition B are randomized into Run 1 and Run 2.
   - Evaluator scores outputs against `rubric.md` without knowing which condition produced which output.
3. **Scoring Dimensions** (Each scored 0 to 2, total 10 points per task):
   - **Correctness & Edge Cases** (0-2)
   - **Defensive Security & Input Validation** (0-2)
   - **Automated Test Quality** (0-2)
   - **Idiomatic Conventions & Standards** (0-2)
   - **Diff Economy & Minimal Scope** (0-2)
4. **Recording**: Results are recorded in `RESULTS.md`.
