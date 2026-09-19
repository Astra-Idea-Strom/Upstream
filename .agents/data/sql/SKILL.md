---
name: sql
description: >-
  Relational query optimization, composite indexing rules, ACID transactions, isolation levels,
  EXPLAIN ANALYZE diagnosis, and keyset pagination. Use when writing complex SQL queries,
  diagnosing slow database performance, designing multi-column indexes, or managing transactional
  integrity. Not for NoSQL document stores or DynamoDB single-table design (that is nosql).
---

# SQL: Relational Query Optimization, Indexing & Transaction Architecture

## 1. Parameterized Queries & Injection Immunity

Never concatenate dynamic variables into SQL strings. Always pass arguments via driver parameterization:

```typescript
// Parameterized query in Node pg
import { Pool } from "pg";
const pool = new Pool();

export async function findActiveOrgUsers(orgId: string, status: string) {
  const query = `
    SELECT id, email, full_name, created_at
    FROM users
    WHERE organization_id = $1 AND status = $2
    ORDER BY created_at DESC LIMIT 50;
  `;
  const { rows } = await pool.query(query, [orgId, status]);
  return rows;
}
```

---

## 2. Composite Indexing & Leftmost Prefix Rules

Indexes transform sequential table scans (O(N)) into logarithmic B-Tree lookups (O(log N)).

### The Multicolumn Index Rule: Equality First, Then Range / Sort
When designing composite indexes for queries containing equality (`=`) and range/sort (`<`, `>`, `ORDER BY`):
1. **Equality Columns First**: Columns filtered by exact equality must occupy the leading positions.
2. **Range or Sort Column Second**: Only the first range column or matching sort order can use the index after equality.
3. **Cardinality Breaks Ties**: Column cardinality only breaks ties among equality columns; it never places a range column before an equality column.

```sql
-- Optimal composite index: [Equality] -> [Range/Sort]
-- Serves: WHERE tenant_id = 42 AND status = 'COMPLETED' AND created_at >= '2026-01-01'
CREATE INDEX idx_orders_tenant_status_date
ON orders (tenant_id, status, created_at DESC);
```

### Partial & Covering Indexes
- **Covering Index**: Include queried payload columns with `INCLUDE (total_amount)` to achieve an Index-Only Scan.
- **Partial Index**: Index only active rows to save memory:
```sql
CREATE INDEX idx_unprocessed_jobs ON queue_jobs (created_at) WHERE status = 'PENDING';
```

---

## 3. ACID Transactions & Isolation Levels

Transactions ensure atomic state transitions across multiple relational tables:

```sql
BEGIN;
-- Lock rows in deterministic order to avoid deadlocks
SELECT balance FROM accounts WHERE id = 101 FOR UPDATE;
SELECT balance FROM accounts WHERE id = 205 FOR UPDATE;

UPDATE accounts SET balance = balance - 500 WHERE id = 101;
UPDATE accounts SET balance = balance + 500 WHERE id = 205;
COMMIT;
```

### Isolation Levels:
- **READ COMMITTED** (Default): Each query sees a snapshot when that specific query began.
- **REPEATABLE READ**: Snapshot taken at transaction start. Prevents non-repeatable reads.
- **SERIALIZABLE**: Strict serial execution order; catches write-skew anomalies. Fails require client retry.
- **Transaction Discipline**: Keep transactions as short as possible. Never make external HTTP or AI API calls inside database transactions.

---

## 4. Query Diagnosis: EXPLAIN ANALYZE & N+1 Mitigation

Use `EXPLAIN (ANALYZE, BUFFERS)` to inspect physical execution plans:
```text
Index Scan using idx_orders_tenant_status_date on orders (cost=0.42..8.45 rows=1)
  Index Cond: ((tenant_id = 42) AND (status = 'COMPLETED') AND (created_at >= '2026-01-01'))
  Buffers: shared hit=4
Planning Time: 0.098 ms, Execution Time: 0.052 ms
```
- **Sequential Scan (Seq Scan)** on tables with > 10,000 rows indicates a missing index.
- **Buffers (shared hit)**: Data served from RAM cache; `shared read` indicates physical disk I/O.

### The N+1 Query Problem
Never query child records inside a parent loop. Use batch queries with `ANY($1)` or `JOIN`:
```typescript
// REMEDIATION: Batch query instead of 100 round-trips
const users = await db.query("SELECT * FROM users LIMIT 100");
const userIds = users.map(u => u.id);
const orders = await db.query("SELECT * FROM orders WHERE user_id = ANY($1)", [userIds]);
```

---

## 5. Keyset (Cursor) Pagination vs OFFSET

Traditional `OFFSET` scans and discards N rows, causing O(N) degradation on deep pages:
```sql
-- Keyset pagination uses constant-time index seek
SELECT id, created_at, title FROM articles
WHERE (created_at, id) < ($last_created_at, $last_id)
ORDER BY created_at DESC, id DESC LIMIT 20;
```

---

## 6. Anti-Patterns to Avoid

- **Raw String Interpolation**: String concatenation instead of driver parameter placeholders.
- **Inverted Index Order**: Placing range/sort columns ahead of equality columns.
- **Deep OFFSET Pagination**: Scanning hundreds of thousands of rows on deep pages.
- **Long-Running Open Transactions**: Holding database locks while awaiting network I/O.
- **N+1 ORM Loops**: Iterating collections in application loops without eager loading.

---

## 7. Verification Checklist

- [ ] All dynamic variables use driver parameter placeholders ($1, %s).
- [ ] Composite indexes place equality columns first, followed by range/sort attributes.
- [ ] Transactions are short and contain zero external network calls.
- [ ] Deep pagination uses keyset cursors rather than `OFFSET`.
- [ ] EXPLAIN ANALYZE confirms queries use Index Scans without unexpected Seq Scans.
