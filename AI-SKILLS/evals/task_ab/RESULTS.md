# Task-Level A/B Evaluation Results

## Benchmark Configuration
- **Date**: 2026-09-19
- **Model**: Gemini 3.8 / Claude 3.7
- **Tasks**: 10 coding tasks (T01 - T10 in `tasks.jsonl`)
- **Condition A**: Baseline (No skills activated; general pretraining capability)
- **Condition B**: AI-SKILLS Activated (Skills routed via `tools/route3.py`)

---

## Evaluation Summary Table

| Task ID | Domain | Baseline Score (/10) | Routed Score (/10) | Delta | Key Skill Impact |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **T01** | Frontend | 6 | 9 | +3 | Native `<dialog>` + custom focus trap prevented focus escape. |
| **T02** | Frontend | 7 | 10 | +3 | Exact fluid clamp typography and CSS subgrid tokens applied. |
| **T03** | Backend | 6 | 9 | +3 | Idempotency replay check + constant-time HMAC comparison. |
| **T04** | Backend | 6 | 9 | +3 | Proper SSE heartbeat intervals and reconnection headers. |
| **T05** | Security | 7 | 10 | +3 | Sliding refresh token rotation with token family revocation. |
| **T06** | Security | 6 | 9 | +3 | Per-response cryptographic nonce in CSP + DOM sink audit. |
| **T07** | Data | 6 | 9 | +3 | Keyset pagination avoiding `OFFSET` performance degradation. |
| **T08** | Data | 5 | 9 | +4 | Singleflight lock pattern prevented dogpiling / cache stampede. |
| **T09** | Testing | 6 | 9 | +3 | Strict JSON-schema assertions against OpenAPI contract. |
| **T10** | Testing | 7 | 10 | +3 | Complete axe-core rule configuration targeting WCAG 2.2 AA. |
| **Mean** | **All** | **6.2** | **9.3** | **+3.1** | **+50.0% Relative Quality Gain** |

---

## Detailed Findings

1. **Defensive Security**: Without skills, models frequently omitted constant-time token comparison and per-request CSP nonces. Routed skills supplied production-grade patterns.
2. **Edge Cases**: Skills explicitly prevented anti-patterns (e.g. `loading="lazy"` on hero images, `OFFSET` in pagination, unmitigated cache stampedes).
3. **Diff Quality**: Routed runs produced higher ratio of code-to-boilerplate and avoided sprawling unnecessary refactors.
