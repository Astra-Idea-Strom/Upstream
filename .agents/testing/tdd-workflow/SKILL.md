---
name: tdd-workflow
description: >-
  Test-Driven Development (TDD): Red-Green-Refactor cycles, test-first design, minimal implementation, and unit test ergonomics. Use when developing features test-first, writing unit tests before code, or maintaining high test coverage during implementation. Not for performance load testing or end-to-end browser tests (that is performance-testing or e2e-testing).
---

# TDD Workflow: Red-Green-Refactor Sequencing & Cycle Discipline

> **Source Attribution**: Adapted and evolved from affaan-m's `everything-claude-code` (MIT).

## 1. The Three Laws of TDD

These rules govern the order of operations — violating any one breaks the cycle:

1. **Write a failing test first**: You may not write production code until you have a failing (RED) test that justifies it.
2. **Write the minimum code to pass**: Write only enough code to make the failing test pass. No more.
3. **Refactor only on GREEN**: You may not restructure code while any test is failing. Green bar is the prerequisite for cleanup.

---

## 2. The Red-Green-Refactor Cycle

```text
RED   → Write a test that describes desired behavior. Run it. It must FAIL.
        If it passes immediately, the test is wrong or already implemented.

GREEN → Write the simplest possible code that makes the test pass.
        Resist the urge to over-engineer. Hard-coding a return value is valid here.

REFACTOR → With all tests green, eliminate duplication, rename for clarity,
           extract abstractions. Run tests after every structural change.
           If any test goes RED during refactor, undo the last change immediately.
```

---

## 3. Cycle Gating Rules

| Gate | Condition | Action |
| :--- | :--- | :--- |
| **RED gate** | New test must fail before any production code is written. | If test is green before implementation: delete or fix the test. |
| **GREEN gate** | All tests — old AND new — must pass before refactoring begins. | If existing tests break on your new code, fix the regression first. |
| **REFACTOR gate** | No new behavior may be added during refactor. | If you discover missing coverage, exit refactor, write a new RED test. |
| **Commit gate** | Only commit on GREEN with all tests passing. | Never commit a partially-red test suite as "work in progress". |

---

## 4. Interaction with Existing Tests During the Cycle

- **Do not delete or skip existing tests** to make your new code pass. Existing tests define the regression baseline.
- If a new feature legitimately changes existing behavior, update the corresponding test in the same commit as the production code change — never in isolation.
- Run the full test suite at the end of each GREEN step, not just the new test, to catch regressions early.
- If the existing suite is slow, identify and run the affected subset; run the full suite before committing.

---

## 5. Anti-Patterns

- **Test-After Development**: Writing tests after implementation to hit a coverage metric — this is not TDD and provides no design feedback.
- **Skipping RED**: Writing the test and immediately making it pass in the same edit without seeing it fail first.
- **Refactoring on RED**: Restructuring while tests are failing, obscuring whether the refactor broke something or it was already broken.
- **Giant GREEN Jumps**: Writing 200 lines of code to pass one test instead of taking the smallest passing step.

---

## 6. Verification Commands

```bash
# Run tests in watch mode during the RED-GREEN cycle
npx vitest watch
pytest -v -x --tb=short

# Confirm full suite is green before committing
npx vitest run
pytest -v --tb=short
```