---
name: skill-adaptation
description: >-
  Sanitizing, adapting, and formatting external skills into repository-compliant structure and frontmatter schema. Use when importing third-party skills, converting external skill manifests, documenting skill diffs, or standardizing skill files. Not for runtime skill routing or skill validation checks (that is skill-routing or skill-validation).
---

# Skill Adaptation: Sanitization, Upstream Attribution & Anti-Slop Refinement

## 1. Core Adaptation Invariants

1. **Preserve Upstream License & Attribution**: Never strip the original copyright notice, author credits, or license identifier from adapted community skills. Explicitly record the source URL and modification summary.
2. **Eliminate "AI Slop" & Generic Platitudes**: Replace vague advice (e.g. "write clean code", "be careful with inputs", "make it look nice") with concrete code examples, mathematical formulas, and deterministic rules.
3. **Enforce Structural Antigravity Standard**: Every adapted skill must be restructured into four mandatory sections:
   - Section 1: Core Invariants (Non-negotiable architectural axioms)
   - Section 2: Key Implementation Patterns (Concrete, copy-pasteable code)
   - Section 3: Anti-Patterns to Avoid (Concrete failure modes)
   - Section 4: Verification Checklist / Test Commands
4. **Strict Delimiter & Guardrail Hardening**: Ensure prompt instructions inside the adapted skill do not permit prompt injection or loose parameter handling.

---

## 2. Adaptation Procedure Step-by-Step

### A. Adaptation Pipeline
```
Third-Party Community Skill (GitHub / web)
   │
   ▼
1. Security Audit (`tools/skill-auditing`) ──► If dangerous: REJECT
   │
   ▼
2. Prune Fluff & Generic Platitudes
   - Delete conversational preamble
   - Replace abstract advice with TypeScript / Python examples
   │
   ▼
3. Restructure to Standard 4-Section Schema
   - Add standardized YAML frontmatter
   - Define concrete invariants, code patterns, and anti-patterns
   │
   ▼
4. Add Provenance & Attribution Header
   - Upstream repo link, license tag, and list of modifications
   │
   ▼
5. Validate Integrity (`tools/skill-validation`)
```

### B. Standard Attribution Block Format
Add this block immediately beneath the title of adapted skills:
```markdown
> [!NOTE]
> **Adapted Skill Provenance**:
> - **Original Author / Project**: [Upstream Repository or Author]
> - **Source URL**: `https://github.com/...`
> - **License**: MIT / Apache-2.0
> - **Modifications**: Added TypeScript schemas, eliminated vague prose, added automated verification checklist.
```

---

## 3. Anti-Patterns to Avoid

- **Unattributed Plagiarism**: Copying community skills into the system without citing original authors or licenses.
- **Surface-Level Formatting**: Changing the YAML frontmatter without improving weak, low-signal markdown content.
- **Retaining Dangerous or Outdated Snippets**: Preserving vulnerable patterns (e.g. `eval()`, raw SQL string templates) from legacy community repositories.

---

## 4. Verification Checklist

- [ ] Frontmatter contains valid `name` and `description`.
- [ ] Provenance block documents original source, author, and license.
- [ ] Contains concrete code snippets and zero generic filler sentences.
- [ ] Registered in `skills-index.json` with appropriate `source` tag (`adapted-*`).
