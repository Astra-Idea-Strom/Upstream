---
name: debugging
description: >-
  Evidence-based 4-phase systematic debugging: observe, diagnose root cause,
  apply a surgical fix, retest. Prohibits random patching. Use when something
  is broken, crashing, erroring, failing a test, or behaving differently than
  expected — not when adding new functionality.
---

# Debugging: 4-Phase Evidence-Based Systematic Troubleshooting

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 0. Activation Boundary
**Use for:** reproducing a failure, isolating a root cause, applying a minimal fix, proving the fix.
**Do not use for:** improving code that already works (`refactoring`), reviewing a change before merge (`code-review`), or writing new tests (`unit-testing`).
**Not triggered by:** "fix the spacing", "fix the wording", "fix the naming" — those are design and refactoring requests.

## 1. The 4-Phase Debugging Methodology

Random trial-and-error editing is strictly prohibited. Follow the 4-phase systematic protocol:

```text
PHASE 1: OBSERVE
  • Capture exact error message, stack trace, exit code, and HTTP status.
  • Reproduce failure consistently with the smallest possible test or curl command.
  • Inspect recent file diffs and environment changes.

PHASE 2: DIAGNOSE (Root Cause Isolation)
  • Formulate an explicit testable hypothesis: "Function X fails because argument Y is undefined when Z occurs."
  • Verify the hypothesis using targeted log outputs or breakpoints.
  • Trace data flow backwards from the point of failure to the point of origin.

PHASE 3: SURGICAL FIX
  • Apply the minimal appropriate fix that addresses the root cause directly.
  • Do NOT apply speculative defensive guards that merely hide the error (e.g. wrapping everything in `try/catch` with empty catch blocks).
  • Preserve all existing unrelated comments, logic, and conventions.

PHASE 4: RETEST & REGRESSION CHECK
  • Re-run the reproduction step to prove the failure is resolved.
  • Run the full test suite to guarantee zero regression in adjacent modules.
```

---

## 2. Root Cause Classification Matrix

When diagnosing a failure, classify the root cause into one of these distinct categories:

1. **Null/Undefined Dereference**: Accessing property on uninitialized or missing state. Fix by adding proper default values or type narrowing.
2. **Asynchronous Race Condition**: Unhandled promises, missing `await`, or state updates after unmount.
3. **Type Mismatch / Serialization**: Passing string instead of integer, or date object serialized incorrectly over JSON.
4. **Environment / Configuration**: Missing `.env` variable, port conflict, or incorrect database URL.
5. **Dependency / Version Mismatch**: Breaking API change across package versions or peer dependency conflicts.

---

## 3. Anti-Patterns
- **Shotgun Debugging**: Modifying 5 different files simultaneously in hopes that something compiles.
- **Symptom Masking**: Adding `|| ""` or `catch (e) {}` without fixing why the data was missing in the first place.
- **Blaming the Environment**: Assuming the compiler or framework is broken before verifying your own code.

---

## 4. Verification Check
- Did I reproduce the error before modifying any code?
- Does the fix eliminate the root cause rather than swallow an exception?
- Have all automated regression tests passed?
