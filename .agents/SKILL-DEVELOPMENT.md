# SKILL-DEVELOPMENT.MD: Engineering Lifecycle Guide for AI Skills



> **Standard**: Google Antigravity Agent Skills & Open Agent Skills (`agentskills.io`)  
> **Scope**: Specification for researching, authoring, adapting, verifying, versioning, and maintaining high-quality agent skills.

---

## 1. Skill Acquisition Hierarchy

Never write a skill from raw memory without consulting verified sources. Follow this strict priority:

$$\text{Existing High-Quality Skill} \longrightarrow \text{Adapt Existing Skill} \longrightarrow \text{Combine Compatible Skills} \longrightarrow \text{Author New Skill from Grounded Research}$$

### Third-Party Skill Adaptation Rules
When importing or adapting external community skills:
1. **Preserve Provenance**: Retain author credits, original repository URL, and license (MIT, Apache-2.0, BSD).
2. **Eliminate Fluff & AI Slop**: Remove conversational filler, generic advice, and bloated prompt templates.
3. **Harmonize Schema**: Ensure YAML frontmatter strictly matches Antigravity / Open Skills standard (`name`, `description`).
4. **Project-Independent Improvements**: Upgrade with modern standards (e.g., WCAG 2.2, modern CSS clamp, TypeScript strictness).
5. **Document Modifications**: Record all adaptations and improvements in `skills-index.json`.

---

## 2. Directory Layout & Structure

Every skill resides in its own isolated directory:

```text
category/skill-name/
├── SKILL.md              # Mandatory: Core instructions & decision rules
├── scripts/              # Optional: Validated automation scripts
├── examples/             # Optional: Concrete, production-grade code examples
├── resources/            # Optional: Templates, starter configs, boilerplate
└── references/           # Optional: Deep architectural manuals, specs
```

### Main Instruction File Specification (`SKILL.md`)
The `SKILL.md` file must lead with valid YAML frontmatter:

```markdown
---
name: skill-name-lowercase-hyphenated
description: >-
  Actionable description explaining WHAT this skill provides and EXACTLY WHEN
  the agent must activate it. Include primary triggers, technologies, and context.
---

# Skill Title

## Overview & Activation Triggers
...

## Decision Criteria & Architecture Workflow
...

## Concrete Patterns & Best Practices
...

## Anti-Patterns to Avoid
...

## Verification & Self-Check Steps
...
```

---

## 3. Quality Standards & Anti-Vagueness Mandate

Vague instructions (e.g., *"Write clean, maintainable code"*, *"Make the UI pretty"*, *"Follow security best practices"*) are **strictly prohibited**.

Every skill must provide:
1. **Definitive Decision Criteria**: Precise rules for selecting between alternative approaches (e.g., when to choose Server Components vs Client Components, when to use WebSockets vs SSE).
2. **Step-by-Step Workflows**: Numbered procedural checklists the agent can execute sequentially.
3. **Concrete Code Patterns**: Minimal, idiomatic code snippets illustrating the target implementation.
4. **Anti-Patterns & Bad Smells**: Explicitly named mistakes commonly made by developers or LLMs, with clear corrections.
5. **Verification Steps**: Specific commands, tests, or assertions to prove the implementation works.

---

## 4. The Human Review Escalation Protocol

If a skill is required for an ambiguous, rapidly shifting, or safety-critical technology, and official documentation or reliable sources cannot be verified:

> [!CAUTION]
> **DO NOT generate a low-quality, speculative, or hallucinated skill.**

Instead:
1. Halt automated generation.
2. Create an entry in [tools/skill-discovery/NEEDS-HUMAN-REVIEW.md](file:///c:/Users/Techie/OneDrive/Desktop/Documents/IdeaStrom/AI-SKILLS/tools/skill-discovery/NEEDS-HUMAN-REVIEW.md).
3. Document:
   - Skill name & category
   - Business/technical purpose
   - Exact research findings and citations explored
   - Ambiguities and unresolved questions
   - Recommended authoritative sources
   - Suggested scope for human or Claude-level review.

---

## 5. Skill Registry Synchronization

Whenever a skill is added, updated, or deprecated:
1. Update `skills-index.json` with all required fields (`name`, `category`, `path`, `description`, `triggers`, `capabilities`, `requires`, `complements`, `conflicts` [empty array `[]` if none], `priority`, `security_sensitive`, `license`, `maintenance_status`).
2. Verify cross-references in `MASTER-SKILLS.md` and `SKILL-SELECTION.md`.
3. Run the automated verification script:
   ```powershell
   python tools/skill-validation/validate_skills.py
   ```
