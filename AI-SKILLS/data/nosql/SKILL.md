---
name: nosql
description: >-
  Document and key-value store architecture: MongoDB, DynamoDB, Redis, flexible schemas,
  compound index optimization (ESR rule), access-pattern modeling, sharding, and consistency controls.
  Use when designing non-relational persistence, embedding vs referencing decisions, high-throughput
  key-value lookups, or DynamoDB single-table designs. Not for ACID relational transactions or complex
  multi-table SQL joins (that is sql or postgresql).
---

# NoSQL: Document Stores, Key-Value Persistence & Distributed Systems

## 1. When to Choose NoSQL vs Relational (SQL)

Apply NoSQL document or key-value stores when access patterns warrant horizontal partitioning or aggregate co-location:

### Choose NoSQL When:
- **Known Access Patterns**: Queries retrieve aggregates by partition keys rather than arbitrary multi-table ad-hoc joins.
- **Hierarchical Co-Location**: Entities and nested children are written and read together as a single atomic document.
- **High-Velocity Ingestion**: Write throughput demands horizontal partitioning across nodes by a shard key.
- **Polymorphic Schemas**: Dynamic product catalogs or event telemetry with fluctuating attributes.

### Stick with Relational (SQL) When:
- Financial ledgers, multi-entity accounting, and workflows requiring strict ACID guarantees across normalized tables.
- Ad-hoc business intelligence, unknown future reporting queries, or analytics requiring complex relational joins.

---

## 2. MongoDB Document Modeling & ESR Indexing

Design schemas for read/write access patterns rather than relational normalization.

### Embedded vs Referenced Patterns
```javascript
// Embedded Pattern: bounded children (< 100 items) read together
const order = {
  _id: ObjectId("65f1a2b3c4d5e6f7a8b9c0d1"),
  order_number: "ORD-2026-9812",
  customer_id: "CUST-4401",
  status: "PAID",
  created_at: ISODate("2026-09-19T06:00:00Z"),
  shipping_address: { street: "100 Market St", city: "SF", state: "CA" },
  items: [
    { sku: "KEY-01", title: "Keyboard", price: 12900, qty: 1 },
    { sku: "CBL-04", title: "USB-C Cable", price: 1900, qty: 2 }
  ],
  total_amount: 16700
};

// Referenced Pattern: unbounded children stored in separate collection
const review = {
  _id: ObjectId("65f1a2b3c4d5e6f7a8b9c0d2"),
  product_id: ObjectId("65f1a2b3c4d5e6f7a8b9c001"), // foreign reference
  author_id: "USER-102",
  rating: 5,
  comment: "Exceptional build quality.",
  created_at: ISODate("2026-09-19T06:15:00Z")
};
```

### The ESR Rule for Compound Indexes (Equality, Sort, Range)
1. **Equality (E)**: Filter fields with exact matches come first (`customer_id`, `status`).
2. **Sort (S)**: Sorting fields come second (`created_at`).
3. **Range (R)**: Inequality/range filter fields come last (`total_amount: { $gte: 5000 }`).

```javascript
// Query: find orders for CUST-4401, sorted by date desc, amount >= 5000
db.orders.find({
  customer_id: "CUST-4401",
  total_amount: { $gte: 5000 }
}).sort({ created_at: -1 });

// Optimal ESR Index: [Equality] -> [Sort] -> [Range]
db.orders.createIndex({ customer_id: 1, created_at: -1, total_amount: 1 });
```

---

## 3. DynamoDB Access-Pattern-First Design

Single-table design groups multiple entity types in one table using composite Partition Keys (PK) and Sort Keys (SK):

| Access Pattern | PK | SK | Notes |
| :--- | :--- | :--- | :--- |
| **Get User Profile** | `USER#<id>` | `PROFILE` | Direct GetItem |
| **List Orders by Customer** | `USER#<id>` | `ORDER#<date>#<id>` | Query with SK `begins_with("ORDER#")` |
| **Get Order Details** | `ORDER#<id>` | `METADATA` | Direct GetItem with line items |

> [!WARNING] Hot Partition Prevention
> Never use low-cardinality attributes (e.g. `status: "PENDING"`) or monotonically increasing dates as Partition Keys. High write bursts will throttle the single physical partition (1,000 WCU limit). Suffix PKs with synthetic partition salts (e.g. `PENDING#<hash % 10>`) if distributed queues are required.

---

## 4. Redis: In-Memory Key-Value Structures

Redis provides in-memory data structures with sub-millisecond latency.

- **Fast Key-Value Storage**: Session stores, sliding-window rate limiters (ZSET), and pub/sub messaging.
- **Caching**: For dedicated caching architectures, consult `backend/caching`.
- **When NOT to Use as Primary Store**: Datasets exceeding available RAM, or critical financial transactions requiring durable write-ahead logging without replication lag.

---

## 5. Shard Key Selection & Consistency Controls

- **Shard Key Selection**: Choose high-cardinality keys with even distribution (e.g. `tenant_id + uuid`). Never shard on monotonic timestamps (`created_at`)—writes will bottleneck on the single max active shard.
- **MongoDB Concerns**: Use `w: "majority"` and `j: true` on critical writes to ensure data commits to a majority of replicas and flushes to journal. Use `readConcern: "majority"` to prevent dirty reads.
- **DynamoDB Consistency**: Reads are eventually consistent by default; specify `ConsistentRead: true` when immediate read-after-write consistency is required.
- **Multi-Document Transactions**: Distributed transactions across shards incur 2PC coordination latency. If your domain requires continuous multi-document transactions, choose a relational database.

---

## 6. Anti-Patterns to Avoid

- **Relational Emulation**: Splitting documents across 10 collections and performing consecutive `$lookup` joins in application code.
- **Unbounded Document Growth**: Pushing infinite logs into an array inside one document until hitting MongoDB's 16MB limit.
- **Unindexed Scans**: Querying unindexed document keys causing `COLLSCAN` collection scans.
- **Volatile Redis as Sole Store**: Storing permanent user records only in RAM without durable database backup.

---

## 7. Verification Checklist

- [ ] Embedded arrays are strictly bounded (< 100 elements); unbounded children use references.
- [ ] Compound indexes strictly follow the ESR rule (Equality -> Sort -> Range).
- [ ] DynamoDB partition keys exhibit high cardinality to avoid physical partition throttling.
- [ ] Critical writes configure majority write concern and journal durability.
- [ ] No single document approaches size limits (16MB in MongoDB, 400KB in DynamoDB).
