---
name: security-review
description: >-
  Security code review: manual threat inspection, privilege escalation audit, vulnerability triage, and pre-merge security checks. Use when performing peer security reviews, identifying security flaws before production, or triaging vulnerability reports. Not for automated test execution or continuous integration gates (that is security-testing or ci-cd).
---

# Security Review: Pre-Merge Gate, Escalation Triggers & Reject Criteria

> **Source Attribution**: Adapted and evolved from affaan-m's `everything-claude-code` (MIT).

## 0. Activation Boundary
**Use for:** reviewing existing code or configuration for security defects.
**Do not use for:** designing controls before code exists (`threat-modeling`), or general code quality (`code-review`).
**Not triggered by:** "audit" in a non-security sense — "audit our dependencies" is `dependency-security`, "audit log" is `observability`.

## 1. Pre-Merge Security Checklist

Run this checklist on every diff before approving a PR. Each item is a binary PASS/FAIL.

| Area | PASS Criterion | Automatic FAIL — Block Merge |
| :--- | :--- | :--- |
| **Secrets** | All credentials sourced from env vars; `.env*` in `.gitignore`. | Any hardcoded token, API key, or password literal in diff. |
| **AuthZ** | Server-side ownership check on every mutating endpoint. | Trust based on client-supplied role (`isAdmin: true` in body). |
| **Input** | Schema validation (Zod/Pydantic) on all external inputs. | Raw user data interpolated into queries, filenames, or shell args. |
| **Error exposure** | Error responses omit stack traces and internal paths. | Stack trace, DB connection string, or internal path leaked in response. |
| **Dependency change** | New package has known license; `npm audit` / `pip audit` passes. | Package with known critical CVE introduced without justification. |
| **Logging** | Sensitive fields (passwords, tokens, PII) masked in logs. | Credential or PII written to log output. |
| **Cryptography** | Passwords hashed with Argon2id/bcrypt; no MD5/SHA1 for secrets. | MD5 or SHA1 used for password hashing or HMAC. |

---

## 2. Hard-Reject on Sight

Stop the review and block merge immediately if you see any of the following:

1. **Credential Literal in Source**: Any secret pattern (e.g. `sk-...`, `password = "abc"`) in non-test production code.
2. **Disabled Auth Middleware**: A route handler with `skipAuth`, `allowUnauthenticated`, or commented-out auth guard in production.
3. **`eval()` on External Data**: Calling `eval()`, `Function()`, Python `exec()`, or `pickle.loads()` with user-supplied content.
4. **Unconditional Privilege Elevation**: Any logic that grants admin/elevated role without server-side identity verification.
5. **Disabled TLS Verification**: `rejectUnauthorized: false`, `verify=False` in production network calls.

---

## 3. Escalation Triggers — When to Request a Full Threat Model

Escalate to a full STRIDE analysis (see `threat-modeling`) when the PR introduces or modifies:

- **New auth or session mechanism** (new login flow, token issuance, OAuth integration).
- **Multi-tenant data access** (shared database with tenant isolation logic changed).
- **File upload or execution path** (code that stores, processes, or executes uploaded content).
- **External webhook receiver** (endpoint that accepts and processes inbound HTTP from third parties).
- **Payment or PII handling** (new storage or transmission of card data, SSN, or health records).
- **Infrastructure-as-code** (IAM policy, security group, or network ACL modification).

Escalation means: **do not merge until threat-modeling review is complete**.

---

## 4. Anti-Patterns

- **Security Theater Approval**: Checking only the happy path without scanning the diff for hard-reject patterns.
- **Treating Unit Tests as Security Proof**: A green test suite does not confirm absence of privilege escalation bugs.
- **Deferring Escalation**: Merging a multi-tenant change with "we'll threat model it in a follow-up PR".

---

## 5. Verification Commands

```bash
# Check for high/critical CVEs introduced by new dependencies
npm audit --audit-level=high
pip-audit --desc

# Scan diff for secret patterns (run at repo root)
git diff HEAD~1 | grep -iE "(password|api_key|secret|token)\s*=\s*['\"][^'\"]{8,}"
```