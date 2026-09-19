# Standardized Task Evaluation Rubric

Each solution is scored on 5 dimensions from 0 to 2 (maximum 10 points per task):

| Dimension | 0 (Deficient) | 1 (Adequate) | 2 (Exemplary) |
| :--- | :--- | :--- | :--- |
| **1. Correctness & Edge Cases** | Fails happy path or crashes on valid edge cases; unhandled null/undefined. | Happy path passes; some subtle edge cases (e.g. concurrency, overflow) overlooked. | Fully robust on happy path and edge cases; verified bounds and error conditions. |
| **2. Defensive Security** | Contains OWASP vulnerabilities (SQLi, XSS, insecure deserialization, secret leaks). | Sanitizes inputs but misses defense-in-depth (e.g. missing CSP, weak crypto, no rate limit). | Zero-trust input handling, parameterized queries, constant-time compare, strict CORS/CSP. |
| **3. Automated Tests** | No tests provided or tests merely assert truthy without verifying behavior. | Basic happy path unit test included; missing negative test cases or mocks. | Comprehensive unit/integration tests with realistic fixtures, edge cases, and assertions. |
| **4. Idiomatic Conventions** | Outdated patterns (e.g. var, raw callbacks, clunky styling, non-standard HTTP codes). | Modern language syntax used; mostly idiomatic but minor stylistic or structural smells. | Pristine modern idiomatic design; clean modularization; proper status codes and typings. |
| **5. Diff Economy & Scope** | Massive unsolicited refactor, irrelevant file touch, gratuitous commentary. | Mostly focused change with slight extraneous formatting or boilerplate. | Surgical, minimal changes strictly addressing requirements without collateral noise. |

---

### Total Score Summary
- **0 - 4**: Poor / Inadequate
- **5 - 7**: Acceptable baseline
- **8 - 10**: Production-ready / High quality
