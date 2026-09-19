---
name: threat-modeling
description: >-
  STRIDE threat modeling: attack surface mapping, threat actor profiling, mitigation prioritization, and trust boundary analysis. Use when modeling threats for new architectures, analyzing trust boundaries, or evaluating system vulnerabilities before implementation. Not for real-time security incident response or live monitoring (that is monitoring).
---

# Threat Modeling: STRIDE Methodology & Attack Surface Mapping

> **Source Attribution**: Adapted from Trail of Bits security methodology (Apache-2.0).

---

## 1. The STRIDE Threat Classification Framework

Evaluate each component and data flow boundary against the six STRIDE threat categories:

| Threat Category | Property Violated | Definition & Typical Vector | Engineering Mitigation |
| :--- | :--- | :--- | :--- |
| **S - Spoofing** | Authenticity | An adversary pretends to be another valid user or system (stolen API key, session hijacking). | Strong authentication, short-lived tokens, mutual TLS (mTLS), strict password policies. |
| **T - Tampering** | Integrity | Unauthorized modification of data in transit or at rest (MITM attack, parameter tampering). | Digital signatures, HMAC message authentication, TLS 1.3, database write constraints. |
| **R - Repudiation** | Non-repudiation | A user denies performing an action, and the system cannot prove otherwise. | Immutable audit logs, structured event logging with user ID and timestamp, digital receipts. |
| **I - Information Disclosure**| Confidentiality | Sensitive data exposed to unauthorized parties (leaked DB backup, verbose error stack). | Encryption at rest (AES-256), encryption in transit, data redaction, principle of least privilege. |
| **D - Denial of Service** | Availability | Exhausting system resources to prevent legitimate user access (SYN flood, regex ReDoS). | Rate limiting, payload size caps, regex timeouts, connection pooling limits, CDN caching. |
| **E - Elevation of Privilege**| Authorization | A low-privileged user executes high-privilege operations (admin role bypass, IDOR). | Strict server-side RBAC/ABAC verification, tenant-scoped queries, parameter whitelisting. |

---

## 2. Attack Surface Mapping Workflow

1. **Draw the Data Flow Diagram (DFD)**:
   - Identify trust boundaries (e.g. Browser <-> Public API Gateway <-> Internal Microservices <-> Database).
2. **Analyze Each Boundary Crossing**:
   - Every crossing over a trust boundary requires authentication, validation, and encryption.
3. **Score Risk Using DREAD**:
   `Risk Score = (Damage + Reproducibility + Exploitability + Affected Users + Discoverability) / 5`
   - Prioritize mitigations for vulnerabilities scoring >= 7/10.

---

## 3. Anti-Patterns
- **The "Internal Network is Safe" Fallacy**: Assuming internal microservices don't need authentication because they sit behind a firewall.
- **Unbounded Regular Expressions (ReDoS)**: Writing complex regexes with nested quantifiers (e.g. `(a+)+$`) that freeze CPU threads when sent evil input.
- **Ignoring Audit Trails**: Failing to log security-sensitive events like password changes or administrative permission grants.

---

## 4. Verification Check
- Have all trust boundaries been audited with STRIDE?
- Are all security-sensitive actions recorded in tamper-resistant audit logs?
- Are regular expressions protected against exponential backtracking (ReDoS)?
