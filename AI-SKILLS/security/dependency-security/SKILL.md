---
name: dependency-security
description: >-
  Software supply chain security: npm audit, vulnerability scanning, lockfile integrity, and dependency pinning. Use when auditing npm/pip dependencies, remediating known CVE vulnerabilities, locking dependency versions, or securing build pipelines. Not for application source code review or secrets management (that is secure-coding or secrets-management).
---

# Dependency Security: Supply Chain Hardening & CVE Mitigation

> **Source Attribution**: Adapted and evolved from Trail of Bits `skills` repository (Apache-2.0).

## 1. Supply Chain Invariants

1. **Deterministic Lockfiles**: Never deploy without a verified lockfile (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`). Lockfiles guarantee identical dependency graphs across environments.
2. **Strict Script Execution Gates**: Disallow arbitrary postinstall lifecycle scripts during dependency installation in untrusted environments using `--ignore-scripts`.
3. **Zero Critical/High CVE Tolerance**: Every build pipeline must fail when unpatched vulnerabilities at or above CVSS 7.0 (High/Critical) exist in the dependency tree.
4. **Minimal Dependency Posture**: Do not import third-party packages for trivial tasks (e.g. `is-odd`, `left-pad`, trivial string formatting). Leverage the language standard library.

---

## 2. Key Hardening Procedures

### A. npm / Node.js Dependency Policy
Configure `.npmrc` to enforce exact version pinning and audit checks:
```ini
save-exact=true
package-lock=true
audit=true
```

Installation command in CI:
```bash
# Clean install honoring exact lockfile without mutation
npm ci --ignore-scripts
```

### B. Automated Vulnerability Scanning
Integrate vulnerability audits into every CI pipeline:
```bash
# Node.js
npm audit --audit-level=high

# Python
pip-audit -r requirements.txt

# Rust
cargo audit
```

### C. Typosquatting & Malicious Package Verification
Before adding a new dependency:
1. Check package download counts, release history, and maintenance activity.
2. Verify package name against official documentation to prevent typosquatting (e.g., `reqeusts` instead of `requests`).
3. Inspect `package.json` for suspicious lifecycle hooks (`preinstall`, `postinstall`) that execute network calls or shell scripts.

---

## 3. Anti-Patterns to Avoid

- **Wildcard or Floating Version Ranges**: Using `*`, `x`, or unpinned ranges in production dependencies leads to unexpected breaking changes and supply chain injection.
- **Ignoring Lockfile Changes in Code Review**: Blindly committing regenerated lockfiles without verifying why dependencies or checksums changed.
- **Running `npm install` with Root Privileges**: Executing package managers as `root` inside Docker containers allows compromised packages to write to system binaries.
- **Installing Abandoned Unmaintained Libraries**: Adopting packages with zero commits in 3+ years and open security issues.

---

## 4. Verification Checklist

- [ ] All production dependencies are pinned to exact versions.
- [ ] Lockfiles are committed and strictly enforced via `npm ci` or equivalent.
- [ ] Dependency scanning (`npm audit` / `pip-audit` / Trivy) runs in CI.
- [ ] Docker builds run dependency installations with `--no-cache` and non-root users.
