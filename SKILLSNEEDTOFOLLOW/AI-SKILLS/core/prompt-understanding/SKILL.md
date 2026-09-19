---
name: prompt-understanding
description: >-
  Intent classification, ambiguous user prompt interpretation, requirement extraction, and query disambiguation. Use when interpreting vague user requests, translating conversational input to requirements, or clarifying ambiguous goals. Not for formulating execution plans or optimizing tool prompts (that is planning or prompt-optimization).
---

# Prompt Understanding: Natural Language Intent Translation

## 0. Activation Boundary
**Use for:** genuinely ambiguous requests where the target is unclear ("make it better", "it feels off", "do what's right here").
**Do not use for:** any request that already names a concrete artefact and action. If the user said "add pagination to /products", the intent is not ambiguous.
**Not triggered by:** the mere presence of the words "make" or "fix".

## 1. Intent Extraction Matrix

Never force the user to rewrite requests into formal engineering prompts. Translate colloquial requests into internal engineering objectives:

| User Statement | Extracted Core Intent | Implicit Requirements & Guardrails |
| :--- | :--- | :--- |
| *"Make this page look better"* | Redesign visual layout, hierarchy, and density. | Audit typography scale, calibrate contrast, eliminate AI slop, retain all functional controls. |
| *"Add login"* | Implement end-to-end authentication flow. | Secure password hashing (Argon2id/bcrypt), HttpOnly session cookies, CSRF protection, rate limiting. |
| *"Make it work on mobile"* | Implement mobile-first responsive design. | Minimum 44px touch targets, fluid typography clamp(), viewport meta, zero horizontal overflow. |
| *"This isn't working, fix it"* | Capture error, isolate root cause, apply surgical patch. | Inspect stack trace, reproduce in test, check recent diffs, avoid speculative rewrites. |
| *"Make it professional"* | Polish UI/UX to enterprise product standards. | Align with restrained design tokens, WCAG 2.2 AA accessibility, clear states (loading/error/empty). |
| *"Add whatever security is needed"* | Harden attack surface proportionally. | Parameterized queries, input validation schemas, CSP headers, credential masking in logs. |

---

## 2. Intent Disambiguation Workflow

1. **Classify Request Scope**:
   - **Atomic**: Single file or styling tweak (e.g. "change button color"). Bypass heavy planning.
   - **Feature**: Component, API endpoint, or flow (e.g. "add export to CSV"). Apply lightweight task representation.
   - **Architectural**: Multi-tier system or full-stack application (e.g. "build student photo upload portal"). Apply full cognitive loop.
2. **Identify Primary User Archetype**:
   - Technical developer vs. business founder vs. non-technical end-user.
   - Tailor responses: concise code diffs for developers; clear milestone summaries for founders.
3. **Map to Required Capabilities**:
   - Convert extracted requirements directly to capability tags (e.g. `auth`, `file-upload`, `responsive-ui`).

---

## 3. Anti-Patterns
- **The Interrogation Trap**: Asking the user 5 questions before writing a single line of code when standard defaults exist.
- **The Prompt Lecturer**: Telling the user "You should prompt me with XYZ format". Accept whatever phrasing they provide.
- **Scope Creep**: Expanding "make this card look better" into an unprompted rewrite of the entire backend database.

---

## 4. Verification Check
- Can I state in one sentence what outcome the user wants to see?
- Have I separated explicit requests from safe implicit assumptions?
- Does the intended solution solve the user's actual problem without added fluff?
