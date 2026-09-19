---
name: skill-validation
description: >-
  Repository skill validation: frontmatter verification, index parity, broken link detection, and schema compliance. Use when validating the AI-SKILLS library, checking index consistency, enforcing file size targets, or running automated CI checks. Not for security vetting of foreign skills (that is skill-auditing).
---

# Skill Validation: Frontmatter Schema, Path Integrity & Benchmark Testing

## 1. Core Validation Invariants

1. **Strict YAML Frontmatter Schema**: Every `SKILL.md` file must open with valid YAML frontmatter containing non-empty `name` (matching the parent folder name) and a concise `description` attribute.
2. **Path & Registry Synchronization**: Every entry in `skills-index.json` must resolve to an existing directory and `SKILL.md` file on the filesystem. No orphaned files and no phantom registry entries.
3. **Deterministic Router Selection**: The skill router test suite (`test_router.py`) must pass 100% of benchmark queries across categories, ensuring the minimum sufficient skill set (2–8 skills) is selected without hallucinated additions.
4. **CI Enforcement**: Validation scripts must run in CI and return exit code 0; any schema violation or broken cross-reference fails the build immediately.

---

## 2. Key Implementation Patterns

### A. Python Validation Protocol (`validate_skills.py`)
```python
import json
import re
import sys
from pathlib import Path

def validate_skill_file(skill_path: Path) -> tuple[bool, str]:
    if not skill_path.exists():
        return False, f"File not found: {skill_path}"

    content = skill_path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return False, f"Missing YAML frontmatter in {skill_path}"

    frontmatter = match.group(1)
    if "name:" not in frontmatter:
        return False, f"Missing 'name' attribute in frontmatter of {skill_path}"
    if "description:" not in frontmatter:
        return False, f"Missing 'description' attribute in frontmatter of {skill_path}"

    return True, "OK"
```

### B. Router Verification Test Protocol (`test_router.py`)
Ensure that given any natural language user prompt:
1. Triggers are extracted and scored.
2. Capability graph dependencies (`requires`) are resolved.
3. Total selected skills fall within the 2–8 skill budget.
4. Conflicting or superfluous skills are rejected.

---

## 3. Anti-Patterns to Avoid

- **Mismatch Between Folder Name and `name` in YAML**: Naming the folder `api-design` while frontmatter states `name: rest-api`, confusing discovery indexing.
- **Divergence Between `skills-index.json` and Disk**: Adding a skill to the filesystem but forgetting to register triggers and capabilities in the central index.
- **Unverified Markdown Code Blocks**: Including syntax errors inside code examples within the `SKILL.md` documentation.

---

## 4. Verification Commands

```bash
# Validate all 82 skills against schema and path rules
python tools/skill-validation/validate_skills.py

# Run deterministic router benchmark suite
python tools/skill-validation/test_router.py
```
