---
name: database
description: >-
  Connection pools, migrations, ORM behaviour, transaction boundaries. Use when
  changing schema, running migrations, or diagnosing connection and transaction
  problems — not for writing queries (sql) or designing schemas (data-modeling).
---

# Database Engineering: Connection Pools, Transactions & ORM Architecture

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 0. Activation Boundary
**Use for:** migrations, connection pooling, transaction boundaries, ORM behaviour, locking.
**Do not use for:** writing queries (`sql`, `postgresql`), designing entities (`data-modeling`), or caching results (`caching`).
**Not triggered by:** "database" appearing incidentally in a security or infrastructure request.

## 1. Connection Pooling Discipline

Database connections are expensive resources. Never open and close a new connection per incoming HTTP request:
- Use a managed connection pool (e.g. `pg.Pool` or Prisma/Drizzle connection pooling).
- **Pool Sizing Formula**:
  `Pool Size ≈ (CPU Cores * 2) + Effective Spindle / SSD Count`
  *For a typical 4-core server, a pool size of 10–20 connections is optimal. Setting pool size to 500 crashes PostgreSQL with memory overhead.*
- Always configure connection timeouts (`connectionTimeoutMillis: 5000`) and idle timeouts.

---

## 2. ACID Transactions & Atomic Operations

When an operation mutates multiple tables (e.g. deducting money and creating an order), wrap the sequence in a strict database transaction:

```typescript
// Prisma Atomic Transaction Pattern
await prisma.$transaction(async (tx) => {
  // 1. Decrement inventory
  const item = await tx.inventory.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  });

  if (item.stock < 0) {
    throw new Error("Insufficient stock; rolling back transaction.");
  }

  // 2. Create order record
  return tx.order.create({
    data: { userId, productId, quantity, totalAmount },
  });
});
```

---

## 3. Safe Schema Migration Workflows
1. **Zero-Downtime Rule**: Never drop a column in the same release that stops reading from it.
   - Step 1: Add new nullable column.
   - Step 2: Deploy code writing to both old and new columns.
   - Step 3: Backfill data from old to new.
   - Step 4: Deploy code reading exclusively from new column.
   - Step 5: Drop old column.
2. **Version Control**: Every migration must be an immutable, numbered file in version control (e.g. `prisma/migrations/`).

---

## 4. Anti-Patterns
- **N+1 Query Loops**: Executing a database query inside an `array.forEach` loop instead of using `WHERE id IN (...)` or an ORM `include`.
- **Unindexed Foreign Keys**: Forgetting to add indexes on columns used in `JOIN` conditions or foreign keys.
- **Transactions Left Hanging**: Catching an error inside a transaction without executing an explicit `ROLLBACK`.

---

## 5. Verification Check
- Are multi-step business mutations wrapped in transactions?
- Does the connection pool handle errors without crashing the server process?
- Are migrations reversible and tested against a staging database?
