---
name: security-testing
description: >-
  Automated security testing: DAST scans, OWASP ZAP, dependency vulnerability scanning, and fuzz testing. Use when automating security regression scans, executing fuzz testing on endpoints, or running DAST pipelines in CI. Not for manual code review or architectural threat modeling (that is security-review or threat-modeling).
---

# Security Testing: SAST, DAST, Fuzzing & Header Verification

> **Source Attribution**: Adapted and evolved from Trail of Bits `skills` repository (Apache-2.0).

## 1. Core Security Testing Invariants

1. **Shift Left with Automated SAST**: Run static analysis on every pull request to detect SQL injection, unescaped templates, hardcoded secrets, and unsafe deserialization before code is merged.
2. **Automated Header Compliance**: Test HTTP responses for mandatory protective headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options`.
3. **DAST Vulnerability Baseline**: Run automated web application scanners (e.g. OWASP ZAP baseline) against staging builds to catch runtime exposure and misconfigurations.
4. **Fuzzing Critical Decoders**: Subject input parsers (JSON, XML, binary files, query strings) to mutated inputs to discover crashes, buffer overruns, or unhandled exceptions.

---

## 2. Key Implementation Patterns

### A. Semgrep SAST Rule Configuration
Run Semgrep in CI to detect dangerous patterns across JavaScript, TypeScript, and Python:
```bash
# Scan repository using OWASP Top 10 rule registry
semgrep scan --config auto --error
```

Example custom rule to forbid raw SQL template literals:
```yaml
rules:
  - id: forbid-raw-sql-concatenation
    pattern-either:
      - pattern: db.query(`... ${$VAR} ...`)
      - pattern: db.execute(`... ${$VAR} ...`)
    message: "Raw SQL query interpolation detected. Use parameterized queries instead."
    languages: [javascript, typescript]
    severity: ERROR
```

### B. Automated Security Headers Verification
```typescript
import request from "supertest";
import { app } from "../src/app";

describe("Security Headers Baseline", () => {
  it("enforces mandatory security headers on all responses", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("DENY");
    expect(res.headers["strict-transport-security"]).toMatch(/max-age=\d+/);
    expect(res.headers["content-security-policy"]).toBeDefined();
    // Invariant: X-Powered-By must be suppressed
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
```

---

## 3. Anti-Patterns to Avoid

- **Disabling SAST Scanners on Warnings**: Suppressing scanner alerts with inline ignore comments without documenting verified false-positive justifications.
- **Ignoring Information Leakage in Headers**: Allowing `Server: Apache/2.4.41` or `X-Powered-By: Express` to reveal technology stack details to attackers.
- **Testing Only Authenticated Happy Paths**: Failing to fuzz unauthenticated endpoints with unexpected payloads, gigantic payloads, or malformed UTF-8.

---

## 4. Verification Checklist

- [ ] SAST scanner (Semgrep / Bandit) runs in CI and passes without high/critical findings.
- [ ] Automated header assertions verify HSTS, CSP, and `nosniff`.
- [ ] Dependency CVE scans (`npm audit` / `pip-audit`) return zero critical vulnerabilities.
- [ ] Server headers (`X-Powered-By`) are completely suppressed.
