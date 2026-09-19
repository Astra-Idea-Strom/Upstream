---
name: planning
description: >-
  Structured internal task planning, mental scratchpad formulation, goal setting,
  re-plan triggers, and contingency rollbacks. Use when initiating complex multi-step tasks,
  scoping architectural implementations, handling plan deviations, or preparing implementation
  plans for user review. Not for decomposing features into code milestones (that is problem-decomposition)
  or architecture trade-offs (that is decision-making).
---

# Planning: Task Formulation, Review Gates & Contingency Protocols

## 1. Planning vs Problem Decomposition

- **Planning (`planning`)**: Strategic framing. Answers *what* system outcome is required, *why* constraints apply, which assumptions are made, and establishes the user approval gate.
- **Problem Decomposition (`problem-decomposition`)**: Tactical execution. Answers *how* to break an approved plan into ordered, atomic code milestones and vertical slices.

---

## 2. Structured Task Representation (Mental Scratchpad)

Before modifying code on non-trivial tasks, formulate this internal specification:

```text
GOAL:         Implement Redis-backed sliding window rate limiting on /api/login to block brute-force attacks.
REQUIREMENTS: - Max 5 attempts per IP per 15 minutes.
              - Reset window on successful login.
              - Return HTTP 429 with Retry-After header on lockout.
CONSTRAINTS:  - Must use existing ioredis instance.
              - In-memory fallback if Redis is unreachable.
              - Zero changes to existing passport.js user serialization.
CONTEXT:      - src/routes/auth.ts
              - src/lib/redis.ts
              - tests/auth.test.ts
UNKNOWN:      - Does reverse proxy set X-Forwarded-For or CF-Connecting-IP? (Will verify via config).
ASSUMPTIONS:  - Client IP is extracted via req.ip with trust proxy enabled.
CAPABILITIES: - backend-engineering, caching, backend-security
SKILLS:       - backend/backend-engineering, backend/caching, backend/backend-security
ACCEPTANCE:   - npm test -- tests/auth.test.ts passes with 100% assertions green.
```

---

## 3. When to Plan vs When to Skip

### Skip Formal Planning (Direct Execution)
- Minor bug fixes (< 20 lines of code).
- Typo corrections, documentation updates, or adding single test cases.
- Investigatory questions ("where is user authentication handled?").

### Require Formal Plan & User Review
- Architectural modifications impacting multiple directories.
- Database schema migrations or destructive storage alterations.
- Introducing new third-party dependencies or altering API contracts.
- High-risk security modifications (authentication, authorization, encryption).

---

## 4. Re-Plan Triggers & Contingency Rollbacks

### When to Halt and Re-Plan
1. **Verification Failure**: Local tests fail twice consecutively with identical root errors.
2. **Hidden Dependency**: Code inspection reveals an unstated dependency or architectural obstacle.
3. **Requirement Contradiction**: Implementing step 2 reveals an incompatibility with step 1.

### Contingency Rollback Protocol
- Always maintain clean git working trees before starting a planned task (`git status`).
- If re-planning requires discarding an aborted approach, execute atomic rollback (`git checkout -- <file>`) before drafting the revised plan.
- Inform the user immediately of the discovery, root cause, and proposed alternative.

---

## 5. Verification Checklist

- [ ] Plan explicitly bounds target files and affected services.
- [ ] Explicit empirical verification command is stated (e.g. `npm test`, `pytest`).
- [ ] All unverified assumptions are flagged with `[ASSUMPTION]` and tested early.
- [ ] User review gate is triggered before code modification when in planning mode.
