---
name: code-review
description: >-
  Quality checklists, static analysis and review heuristics for changes about to
  be merged. Use when reviewing a pull request, critiquing code, or gating a
  merge — not during an active incident.
---

# Code Review: Comprehensive Engineering Quality Checklist

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 0. Activation Boundary
**Use for:** reviewing a diff, PR or file that is about to be merged.
**Do not use for:** an active incident or a live bug (`debugging`), or restructuring code you own (`refactoring`).
**Not triggered by:** "review the requirements", "review the design" — those are `requirements-analysis` and `decision-making`.

## 1. The 6-Dimensional Review Checklist

Before declaring any code modification complete, perform this thorough audit:

### 1. Correctness & Business Logic
- [ ] Does the code accurately satisfy the user's explicit and implicit requirements?
- [ ] Are boundary conditions handled (e.g. empty arrays, null inputs, 0 values, maximum string lengths)?
- [ ] Are off-by-one errors eliminated in loops and slice operations?

### 2. Security & Data Integrity
- [ ] Are all inputs validated against strict schemas (Zod/Pydantic/Joi)?
- [ ] Are database queries parameterized to eliminate SQL injection?
- [ ] Are outputs sanitized to prevent XSS?
- [ ] Are authorization checks performed server-side for every privileged operation?
- [ ] Are secrets, tokens, or credentials absent from code and logs?

### 3. Error Handling & Resilience
- [ ] Are asynchronous rejections and promise failures caught and handled gracefully?
- [ ] Are error messages informative for developers without leaking sensitive internals to clients?
- [ ] Are network requests protected by reasonable timeouts?

### 4. Performance & Resource Consumption
- [ ] Are unnecessary re-renders avoided (proper dependency arrays, memoization where warranted)?
- [ ] Are database queries optimized (no N+1 query loops; appropriate indexes exist)?
- [ ] Are memory leaks prevented (event listeners and subscriptions cleaned up)?

### 5. UI/UX & Accessibility
- [ ] Is the interface usable via keyboard alone (Tab, Enter, Escape, Arrow keys)?
- [ ] Do interactive elements have accessible names and sufficient color contrast (>= 4.5:1)?
- [ ] Does the layout adapt gracefully to mobile viewports without horizontal scrolling?

### 6. Maintainability & Style
- [ ] Are variable and function names descriptive and intention-revealing?
- [ ] Is dead code, console debugging statements, or unused imports removed?
- [ ] Are existing codebase conventions and formatting respected?

---

## 2. Review Severity Rating
When identifying issues, tag each item appropriately:
- **`[CRITICAL]`**: Security vulnerability, data loss risk, or fatal crash. Must fix before proceeding.
- **`[WARNING]`**: Performance bottleneck, missing error boundary, or accessibility violation. Should fix.
- **`[SUGGESTION]`**: Minor readability improvement, stylistic consistency. Nice to have.

---

## 3. Anti-Patterns
- **Rubber-Stamp Review**: Glancing at code and saying "looks good" without checking edge cases or running tests.
- **Nitpicking Over Conventions**: Arguing about bracket spacing instead of reviewing security and architecture.

---

## 4. Verification Check
- Did I state what the change is trying to do before judging how it does it?
- Is every comment actionable, and does it distinguish blocking from optional?
- Did I check the tests as carefully as the implementation?
- Did I look for what is missing — error paths, migrations, docs — not only at what is present?
- Would I be able to revert this change safely from what the diff and its message tell me?

