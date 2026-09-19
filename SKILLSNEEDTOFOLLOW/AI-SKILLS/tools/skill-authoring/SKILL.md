---
name: skill-authoring
description: >-
  Author spec-compliant Agent Skills: valid YAML frontmatter, a description
  written as the discovery trigger, three-tier progressive disclosure, activation
  boundaries and size limits. Use when creating a new SKILL.md, fixing a skill
  that never triggers or triggers too often, or reviewing skills before they
  enter a shared library.
---

# Skill Authoring: Spec Compliance and Discoverability

## 0. Activation Boundary
**Use for:** writing and fixing `SKILL.md` files.
**Do not use for:** deciding whether a skill should exist (use
`capability-gap-detection`) or measuring routing (use `skill-evaluation`).

## 1. Frontmatter is a contract, not a suggestion
```yaml
---
name: pdf-processing              # ≤64 chars, lowercase/digits/hyphens only
description: >-                   # ≤1024 chars, non-empty, no XML tags
  Extracts text and tables from PDF files, fills forms, merges documents.
  Use when working with PDF files or when the user mentions PDFs, forms,
  or document extraction.
---
```
- Reserved words (`claude`, `anthropic`) are rejected in `name`.
- **Unexpected keys are a hard error** outside Claude Code — the upload path, the
  Skills API and the packaging script all reject them. Routing metadata
  (aliases, negative triggers, costs) therefore belongs in a sidecar index, not
  in frontmatter.

## 2. The description is the only thing loaded at discovery time
Only the frontmatter is resident at startup — roughly 30–100 tokens per skill.
The body loads *after* the skill has already been chosen, so a `## When to Use`
section inside the body **contributes nothing to discovery**.

Every description must answer two questions:

| | Question | Example |
| :--- | :--- | :--- |
| **What** | What does it do, concretely? | "Extracts text and tables from PDF files, fills forms, merges documents." |
| **When** | What request should trigger it? | "Use when working with PDF files or when the user mentions PDFs, forms, or document extraction." |

**Bad:** `Helps with PDFs.` — no trigger vocabulary, no boundary.
**Bad:** `Comprehensive guide for X requiring detailed structure.` — buzzwords,
no concrete action, no trigger terms.

Write the trigger terms a *user* would type, not the terms an engineer would.
"make it work on phones" outranks "implements fluid breakpoint strategy".

## 3. Three-tier progressive disclosure
```text
Tier 1  frontmatter      always resident       ~30–100 tokens
Tier 2  SKILL.md body    loaded on trigger     <5,000 tokens, target <500 lines
Tier 3  references/ scripts/ assets/   loaded only when the body points to them
```
If a section is needed in fewer than one activation in three, it belongs in
`references/`. The context window is shared; every unnecessary line is taken
from the task.

## 4. Body structure that survives routing
```markdown
## 0. Activation Boundary     ← what this is for, and explicitly what it is NOT
## 1. <the decision or method>  ← tables and decision matrices over prose
## 2. <patterns / commands>
## N. Anti-Patterns           ← named failure modes, not warnings
## N+1. Verification Check    ← questions the agent answers before finishing
```
The Activation Boundary section is what keeps a skill honest once it is loaded,
and it is the natural place to derive `negative_triggers` from.

## 5. Sizing and freedom
Match specificity to fragility. Brittle, high-consequence procedures get exact
steps; robust creative work gets principles. Over-specifying resilient tasks
produces rigid, worse output; under-specifying fragile ones produces incidents.

## 6. Test it like code
Write 3–5 eval prompts per skill **before** finalising the description: two that
must trigger it, one that must not, one adjacent request that must trigger a
neighbouring skill instead. A skill that cannot be triggered has zero value
regardless of content quality.

## 7. Anti-Patterns
- **Description as a title** — "Database skill." Nothing to match against.
- **Trigger vocabulary only in the body** — invisible at discovery time.
- **Custom frontmatter keys** — hard error on the standard upload paths.
- **Prose dumps** — a 2,000-line skill is a prompt, not a skill.
- **Batch authoring** — writing ten skills without triggering any of them.

## 8. Verification Check
- Does the description state both what and when, in user vocabulary?
- Is the frontmatter within spec (name ≤64, description ≤1024, no extra keys)?
- Is there an explicit statement of what this skill is *not* for?
- Did I write at least one prompt that must **not** trigger it — and verify?
