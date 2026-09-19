---
name: deployment
description: >-
  Application deployment: zero-downtime releases, blue-green deployments, health checks, rollback automation, and environments. Use when releasing applications to production, configuring zero-downtime updates, setting up health checks, or executing rollbacks. Not for CI test pipelines or cloud resource declarations (that is ci-cd or cloud).
---

# Deployment: Platform Hosting, Zero-Downtime Releases & Production Readiness

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 1. Core Deployment Invariants

1. **Zero-Downtime Deployments**: New application versions must spin up and pass healthchecks before traffic is shifted away from previous instances (rolling or blue-green updates).
2. **Pre-Deploy Database Migration Gates**: Database schema migrations must run in a pre-deployment step and be backward-compatible with the currently running application version.
3. **Immutable Builds**: The exact binary or container image validated in staging must be what deploys to production—never recompile with different dependencies.
4. **Automated SSL/TLS & DNS Termination**: All public traffic must enforce HTTPS with TLS 1.3/1.2; plaintext HTTP must permanently redirect (301) to HTTPS.

---

## 2. Key Implementation Patterns

### A. Backward-Compatible Migration Strategy
Never make breaking schema changes in a single deploy. Use the Expand-Contract pattern:
1. **Phase 1 (Expand)**: Add new column as nullable or with default (e.g. `full_name`). Deploy code that writes to both old and new columns.
2. **Phase 2 (Backfill)**: Run background migration script to populate `full_name` from `first_name` + `last_name`.
3. **Phase 3 (Contract)**: Deploy code reading exclusively from `full_name`. Remove old column in subsequent release.

### B. Platform Hosting Matrix

| Platform | Best For | Deploy Command / Strategy |
| :--- | :--- | :--- |
| **Vercel** | Next.js, frontend SPAs, Edge functions | Git push connected branch or `vercel --prod` |
| **Railway** | Full-stack apps, PostgreSQL + Redis combos | Nixpacks/Dockerfile via Railway Git webhook |
| **Fly.io** | Distributed Docker containers, WebSockets | `fly deploy --remote-only` |
| **AWS ECS / App Runner** | Enterprise container services, high volume | CloudFormation / Terraform + ECR push |

### C. Pre-Flight Production Checklist
Before triggering production deployment:
- [ ] Database migrations tested against a restored staging snapshot.
- [ ] Required production environment variables set in hosting dashboard.
- [ ] Smoke test script prepared for post-deploy verification.
- [ ] Rollback strategy identified (e.g. one-click revert to prior deployment ID).

---

## 3. Anti-Patterns to Avoid

- **Deploying on Friday Afternoon**: Releasing major unmonitored updates before weekends or holidays.
- **Manual SSH Production Tweaks**: Editing files or environment variables directly on live servers without committing to version control.
- **Breaking Database Column Renames**: Renaming columns synchronously, causing running instances to crash on unknown column queries during deployment.

---

## 4. Post-Deployment Verification

```bash
# Automated smoke test probing health and version endpoints
curl -f -s -o /dev/null -w "%{http_code}\n" https://app.example.com/health
# Expected: 200

# Inspect response headers for TLS and security
curl -I https://app.example.com
```
