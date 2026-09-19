---
name: decision-making
description: >-
  Architectural decision records (ADR), weighted decision matrices, trade-off analysis,
  and one-way vs two-way decision frameworks. Use when choosing between databases, frameworks,
  or cloud architectures (e.g. X or Y, which database, should we use), evaluating irreversible
  trade-offs, or documenting technical rationale. Not for scheduling task sequences
  (that is planning or problem-decomposition).
---

# Decision-Making: Architectural Records, Trade-Offs & Decision Matrices

## 1. Type 1 (One-Way) vs Type 2 (Two-Way) Decisions

Evaluate decisions using the reversibility principle:

| Dimension | Type 1: Irreversible (One-Way Door) | Type 2: Reversible (Two-Way Door) |
| :--- | :--- | :--- |
| **Examples** | Primary database selection, public API breaking change, auth architecture. | Internal UI library choice, caching TTL, CSS utility framework. |
| **Velocity** | Deliberate, thorough, formal ADR required, extensive team review. | High speed, rapid prototyping, minimal formal ceremony. |
| **Reversal Cost** | Weeks/months of data migration and downtime risk. | Hours/days of localized code refactoring. |

---

## 2. Architecture Decision Records (ADR)

Document non-trivial architectural decisions with persistent context and rationale:

### Worked ADR Example: Event Logging Storage Engine

```markdown
# ADR-004: Storage Engine Selection for User Audit & Event Logs

## Context & Problem Statement
The application requires persisting 5,000 security audit events per second. Events have variable metadata payloads (JSON). Queries require time-range filtering and user-id lookups. We must decide between PostgreSQL and MongoDB.

## Decision Drivers
- Write throughput >= 5,000 events/sec.
- Query flexibility over semi-structured payload attributes.
- Operational overhead on the existing engineering team.
- Cost of additional cloud infrastructure.

## Considered Options
1. PostgreSQL with JSONB columns and BRIN indexing.
2. MongoDB Atlas managed cluster.

## Weighted Decision Matrix

| Criteria (Weight 1-5) | PostgreSQL (JSONB + BRIN) | MongoDB Atlas |
| :--- | :--- | :--- |
| Write Performance (5) | 4/5 (High with unlogged/batch) | 5/5 (Native append optimized) |
| Query Flexibility (4) | 5/5 (Full relational + JSONB) | 4/5 (Rich aggregation pipeline) |
| Operational Overhead (5)| 5/5 (Existing Postgres cluster) | 2/5 (New service to monitor) |
| Infrastructure Cost (3) | 5/5 ($0 added monthly cost) | 2/5 (Additional cluster billing) |
| **Weighted Total** | **45** | **33** |

## Decision Outcome
Chosen: **PostgreSQL (JSONB with BRIN Indexing)**.
Rationale: Our existing PostgreSQL infrastructure easily handles 5,000 inserts/sec with partitioned tables and BRIN indexing on `created_at`. Adding MongoDB would introduce significant operational overhead and secondary auth/backup requirements without substantial performance gains.

## Consequences
- **Positive**: Zero new database infrastructure; leveraged existing backup and monitoring pipelines.
- **Negative/Trade-off**: Requires explicit table partitioning by month to maintain write speed at scale.
```

---

## 3. When an ADR is Worth Writing

Write a formal ADR when a technical choice:
- Costs > 2 developer weeks to reverse.
- Alters public API contracts or security boundaries.
- Introduces or deprecates a core infrastructure dependency.
- Involves divergent opinions across team members on critical architecture.

---

## 4. Deliberate 5-Point Action Check

Before executing any major architectural modification, verify:
1. **INTENT**: What concrete system outcome does this decision achieve?
2. **EVIDENCE**: What empirical benchmark or constraint proves this is the right choice?
3. **SCOPE**: Is this the minimal architectural change required?
4. **RISK**: What is the worst-case failure mode and rollback strategy?
5. **VERIFICATION**: How will we empirically measure success in production?

---

## 5. Verification Checklist

- [ ] Decision type (Type 1 vs Type 2) is explicitly identified.
- [ ] Trade-offs are evaluated against at least two viable alternatives.
- [ ] Weighted criteria reflect concrete business and engineering priorities.
- [ ] Negative consequences and mitigations are honestly documented.
