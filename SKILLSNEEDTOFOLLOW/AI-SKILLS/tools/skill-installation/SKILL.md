---
name: skill-installation
description: >-
  Skill installation and deployment: placing skills in appropriate domain directories, configuring paths, and workspace linking. Use when installing validated skills into the library, updating folder structures, or linking skills to workspaces. Not for skill authoring or security auditing (that is skill-authoring or skill-auditing).
---

# Skill Installation: Workspace Mounting, Global Registry & Discovery Activation

## 1. Core Installation Invariants

1. **Workspace vs Global Scope**:
   - **Workspace Scope (`.agents/skills/` or `AI-SKILLS/`)**: Project-specific skills, domain packages, and proprietary team workflows. Preferred for repository portability.
   - **Global Scope (`~/.gemini/config/` or `builtin/skills`)**: Universal engineering standards, core cognitive loop, and tool harnesses accessible across all workspaces.
2. **Atomic Registration**: Installation is not complete until the skill is physically located in the discovery path AND successfully parsed by the runtime skill loader.
3. **No Hidden Overwrites**: If an existing skill shares the same name, installation must prompt or log an explicit warning rather than silently clobbering existing custom modifications.
4. **Symlink Portability**: On Windows and POSIX systems, prefer copying or directory junctions (`mklink /J`) with fallback to physical copies to avoid privilege elevation failures.

---

## 2. Key Implementation Patterns

### A. Workspace Installation Procedure (Antigravity Standard)
To install a skill into an active workspace:
```bash
# 1. Create target directory
mkdir -p .agents/skills/my-new-skill

# 2. Copy SKILL.md and assets
cp path/to/source/SKILL.md .agents/skills/my-new-skill/

# 3. Verify discovery recognition
python AI-SKILLS/tools/skill-validation/validate_skills.py .agents/skills/my-new-skill/SKILL.md
```

### B. Global Antigravity Registration (`~/.gemini/config/skills.json`)
```json
{
  "skills": [
    {
      "name": "human-ui-design",
      "path": "c:/Users/Techie/OneDrive/Desktop/Documents/IdeaStrom/AI-SKILLS/frontend/human-ui-design/SKILL.md",
      "enabled": true
    },
    {
      "name": "owasp",
      "path": "c:/Users/Techie/OneDrive/Desktop/Documents/IdeaStrom/AI-SKILLS/security/owasp/SKILL.md",
      "enabled": true
    }
  ]
}
```

---

## 3. Anti-Patterns to Avoid

- **Hardcoding Absolute OS Paths in Team Repositories**: Specifying machine-specific paths like `C:\Users\JohnDoe\...` inside shared `.agents/skills` configurations.
- **Unverified Post-Install State**: Assuming copying a file succeeded without validating its YAML frontmatter against the discovery engine.
- **Installing Broken Upstream Dependencies**: Installing a specialized skill without its required foundational skills (e.g. installing `threejs` without `frontend-engineering`).

---

## 4. Verification Checklist

- [ ] Skill directory contains valid `SKILL.md`.
- [ ] Frontmatter name matches directory basename.
- [ ] Skill appears in Antigravity `/` or agent capability discovery query.
- [ ] Dependencies declared under `requires` are present in the target environment.
