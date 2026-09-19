---
name: requirements-analysis
description: >-
  Requirements elicitation, constraint identification, acceptance criteria definition, and edge-case discovery. Use when scoping features, analyzing product specs, discovering technical edge cases, or defining user stories. Not for internal task planning or code milestone sequencing (that is planning or problem-decomposition).
---

# Requirements Analysis: Specification & Clarification Discipline

## 1. Requirement Taxonomy
For any non-trivial engineering task, categorize requirements into five concrete buckets:

1. **Functional Requirements (FR)**: What the system must do (e.g. "User can drag-and-drop a PDF, and system parses text within 3 seconds").
2. **Non-Functional Requirements (NFR)**: Quality attributes:
   - Performance: Latency thresholds (p95 < 200ms), asset sizes (< 200KB JS bundle).
   - Accessibility: WCAG 2.2 AA conformance, keyboard navigation.
   - Reliability: Offline fallbacks, graceful degradation.
3. **Platform & Environment Constraints**: Node vs Python runtime, browser target, mobile screen width, memory constraints.
4. **Cost & Resource Constraints**: Zero-cost free tier vs paid APIs, local computation vs cloud serverless.
5. **Acceptance Criteria (AC)**: The exact empirical checklist defining completion.

---

## 2. Minimal-Necessary Clarification Rule

Do not ask questions merely because an ambient detail is missing. Apply the decision matrix:

```text
Is missing information critical?
  │
  ├── NO → Safe assumption exists:
  │        • Make reasonable assumption using standard conventions.
  │        • Record assumption concisely in internal context.
  │        • Proceed immediately.
  │
  └── YES → Answers would cause fundamental architectural divergence OR irreversible risk:
           • Ask a SINGLE, focused multiple-choice question.
           • Always propose the recommended option first with technical justification.
           • Never ask open-ended questions when choices can be structured.
```

### Examples of Safe Assumptions vs Mandatory Clarification
- **Safe Assumption**: User asks for "database for user notes" -> Assume SQLite for local development or PostgreSQL for production SaaS. Do not ask.
- **Safe Assumption**: User asks for "modern React UI" -> Assume Tailwind CSS + TypeScript. Do not ask.
- **Mandatory Clarification**: User asks for "deploy to production cloud" with paid cloud credentials -> Clarify target platform (Vercel vs AWS) to prevent accidental billing.

---

## 3. Anti-Patterns
- **Analysis Paralysis**: Generating a 10-page specification document for a 50-line utility script.
- **Question Spam**: Bombarding the user with trivial configuration questions that have standard defaults.
- **Hidden Assumptions**: Making radical architectural choices (e.g. switching relational schema to NoSQL) without noting it.

---

## 4. Verification Check
- Are functional requirements separated from non-functional constraints?
- Is there a clear, testable acceptance criteria list?
- Did I minimize user friction by assuming standard industry defaults?
