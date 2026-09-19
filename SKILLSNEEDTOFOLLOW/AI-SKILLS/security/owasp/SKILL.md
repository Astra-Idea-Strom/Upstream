---
name: owasp
description: >-
  OWASP Top 10 web vulnerabilities: SQLi, XSS, CSRF, broken access control, SSRF, and security misconfigurations. Use when auditing web applications against OWASP Top 10 risks, validating security controls, or reviewing code for web attack vectors. Not for AI-specific prompt attacks or infrastructure cloud IAM (that is ai-security or cloud).
---

# OWASP: Top 10 Web Application Security Remediation

> **Standard**: OWASP Top 10 (2021/2025 aligned)  
> **Source Attribution**: Adapted from `vudovn/antigravity-kit` vulnerability-scanner (MIT).

---

## 1. OWASP Top 10 Remediation Matrix

| OWASP Vulnerability | Primary Attack Vector | Concrete Engineering Remediation |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | IDOR, bypassing URL access rules, horizontal privilege escalation. | Enforce server-side ownership checks on every request. Deny by default. Use non-sequential IDs (UUIDv4/CUID). |
| **A02: Cryptographic Failures** | Plaintext password storage, weak hashing (MD5/SHA1), unencrypted sensitive PII. | Argon2id/bcrypt for passwords. TLS 1.3 for transit. AES-256-GCM for sensitive data at rest. |
| **A03: Injection** | SQL, NoSQL, OS Command, LDAP injection via untrusted parameters. | Strict parameterized queries, ORMs, schema whitelisting, avoid shell interpolation. |
| **A04: Insecure Design** | Architectural flaws, missing business logic rate limits, credential recovery flaws. | Threat modeling (STRIDE), password reset token hashing with short TTLs. |
| **A05: Security Misconfiguration** | Default passwords, debug mode enabled in production, overly permissive CORS. | Disable stack traces in production, lock CORS origins, configure Helmet security headers. |
| **A06: Vulnerable Dependencies** | Outdated or compromised npm/pip packages. | Automated dependency scanning (`npm audit`), version pinning, lockfile verification. |
| **A07: Identification & Auth Failures** | Credential stuffing, weak passwords, session fixation, unrevoked JWTs. | Multi-factor authentication (MFA), account lockout / exponential rate limiting, HttpOnly session cookies. |
| **A08: Software & Data Integrity Failures**| Untrusted CI/CD pipelines, deserialization vulnerabilities, unverified CDN scripts. | Subresource Integrity (SRI) hashes on external scripts, signed commits, avoid unsafe deserialization (`pickle`, `eval`). |
| **A09: Security Logging Failures** | Unlogged security breaches, log injection, credential leakage into logs. | Structured JSON logs with correlation IDs, masking sensitive fields (`Bearer [REDACTED]`), central monitoring. |
| **A10: Server-Side Request Forgery (SSRF)**| Forcing server to fetch internal network assets or AWS metadata (`169.254.169.254`). | Strict URL protocol and domain whitelisting. Block private IP ranges (`10.0.0.0/8`, `127.0.0.1`). |

---

## 2. File Upload Hardening Protocol

File uploads are a frequent vector for remote code execution:
1. **MIME-Type & Magic Byte Verification**: Never trust the client-provided `Content-Type` header or file extension. Inspect magic bytes using libraries like `file-type`.
2. **Rename Uploaded Files**: Generate random UUIDs for stored files (`abc-123.jpg`). Never use the user's uploaded filename directly on the filesystem.
3. **Execute Storage Outside Web Root**: Store uploaded files in an S3 bucket or isolated non-executable directory with no script execution permissions.

---

## 3. Anti-Patterns
- **The "Admin" Parameter**: Trusting `{ isAdmin: true }` sent in the request body from a user.
- **Wildcard CORS with Credentials**: `Access-Control-Allow-Origin: *` with `Allow-Credentials: true`.
- **Deserializing Untrusted Payloads**: Calling Python `pickle.loads()` or JavaScript `eval()` on user-supplied strings.

---

## 4. Verification Check
- Are all top 10 categories addressed in the system architecture?
- Are file uploads inspected for magic bytes and renamed with UUIDs?
- Does the security audit script confirm zero critical vulnerabilities?
