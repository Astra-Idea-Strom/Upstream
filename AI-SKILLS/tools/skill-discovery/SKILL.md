---
name: skill-discovery
description: >-
  Skill library discovery: searching skills by capability, evaluating skill relevance, and inspecting skill descriptions. Use when finding appropriate skills for a user request, exploring available skill modules, or browsing skill domains. Not for deterministic runtime router scoring (that is skill-routing).
---

# Skill Discovery: Research, Candidate Curation & Escalation Management

## 1. Core Discovery Invariants

1. **Check Existing Registry First**: Before searching external repositories for a capability, search `skills-index.json` to verify whether the capability or a close complement already exists in the 82-skill matrix.
2. **Standardized External Sources**: Only source external skills from trusted repositories with explicit open-source licenses (MIT, Apache-2.0, BSD):
   - GitHub community repositories
   - Official Antigravity skills library (`builtin/skills`)
   - Standard specification registries (`agentskills.io`)
3. **Escalate Unverified / High-Risk Capabilities**: If a discovered skill touches root security, financial transaction execution, or health advice, it must be staged in `NEEDS-HUMAN-REVIEW.md` rather than installed directly.
4. **Attribution & Provenance Preservation**: Every discovered candidate must retain its upstream repository URL, author attribution, commit hash, and license type.

---

## 2. Discovery & Curation Workflow

### A. Discovery Decision Flowchart
```
User Prompt requires unfamiliar capability
   │
   ▼
Search `skills-index.json` (triggers & capabilities)
   │
   ├─► Match Found: Route to existing skill
   │
   └─► No Match: Initiate External Discovery
         │
         ▼
       Search GitHub / community registries for AGENT SKILL.md
         │
         ├─► Permissive License (MIT/Apache) + Clear Scope
         │     │
         │     ▼
         │   Run Security Audit (`tools/skill-auditing`)
         │
         └─► Ambiguous / Proprietary / High Risk
               │
               ▼
             Append to `tools/skill-discovery/NEEDS-HUMAN-REVIEW.md`
```

### B. Registering Candidates in `NEEDS-HUMAN-REVIEW.md`
When an ambiguous external capability is found, document it in `tools/skill-discovery/NEEDS-HUMAN-REVIEW.md` using this format:
```markdown
### Candidate: [Skill Name]
- **Source URL**: `https://github.com/...`
- **License**: MIT / Apache-2.0 / Unspecified
- **Discovered Date**: 2026-09-18
- **Proposed Capabilities**:
  - `capability-one`
- **Reason for Escalation**: [Security risk / redundant with existing skill / needs licensing clarification]
- **Status**: PENDING_HUMAN_REVIEW
```

---

## 3. Anti-Patterns to Avoid

- **Installing Unchecked Community Code**: Downloading and running third-party skill scripts directly without auditing their contents.
- **Skill Bloat**: Creating a new skill for every tiny one-off script, fragmenting the skill router.
- **Dropping Upstream Attribution**: Copying community code into `SKILL.md` without citing original author and license terms.

---

## 4. Verification Checklist

- [ ] New capabilities are checked against `skills-index.json` for overlap.
- [ ] Upstream license is verified as OSI-compliant.
- [ ] High-risk or ambiguous candidates are logged in `NEEDS-HUMAN-REVIEW.md`.
- [ ] Staged candidates pass to `skill-auditing` before any workspace installation.
