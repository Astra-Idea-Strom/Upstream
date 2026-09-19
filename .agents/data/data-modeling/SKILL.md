---
name: data-modeling
description: >-
  Relational and document data modeling: entity-relationship diagrams, normalization, foreign keys, and schema design. Use when designing database schemas, normalizing relational entities, modeling table relationships, or selecting data types. Not for query optimization or execution plan analysis (that is sql or postgresql).
---

# Data Modeling: Entity-Relationship Architecture & Normalization

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 1. Normalization & Normal Forms (3NF Standard)

Design relational database schemas to **3rd Normal Form (3NF)** before considering deliberate denormalization:

1. **1NF (Atomic Values)**: Each column contains only indivisible single values (no comma-separated strings or raw lists in a scalar field).
2. **2NF (Full Functional Dependency)**: Every non-key column depends on the *entire* primary key, not a partial composite key.
3. **3NF (No Transitive Dependency)**: Non-key columns depend *only* on the primary key, not on other non-key columns (e.g. store `author_id`, not `author_id` and `author_name` together in the `posts` table).

---

## 2. Cardinality & Relationship Mapping

```text
1. ONE-TO-ONE (1:1):
   • Example: User ↔ UserProfile
   • Implementation: Foreign key on UserProfile with a UNIQUE constraint (`user_id UUID UNIQUE REFERENCES users(id)`).

2. ONE-TO-MANY (1:N):
   • Example: Author ↔ Books
   • Implementation: Foreign key on the "many" side (`books.author_id REFERENCES authors(id)`).

3. MANY-TO-MANY (N:M):
   • Example: Students ↔ Courses
   • Implementation: Dedicated Junction / Join Table (`student_courses` with composite primary key `(student_id, course_id)`).
```

---

## 3. Soft Deletes vs Hard Deletes

- **Hard Deletes (`DELETE FROM ...`)**: Permanently removes the row. Use for GDPR right-to-be-forgotten requests or transient cache rows.
- **Soft Deletes (`deleted_at TIMESTAMPTZ NULL`)**: Retains historical data, audit trails, and foreign key references:
  - Enforce `WHERE deleted_at IS NULL` on all active queries.
  - Caution: Soft deletes break standard `UNIQUE` constraints (e.g. creating an account with a previously soft-deleted email). Use partial unique indexes:
    `CREATE UNIQUE INDEX uq_user_email ON users (email) WHERE deleted_at IS NULL;`

---

## 4. Anti-Patterns
- **The CSV Column**: Storing `tags = "react,css,redux"` in a text field instead of a normalized `tags` table with a junction table.
- **Float for Currency**: Storing money in `FLOAT` or `REAL` types, causing floating-point rounding errors (0.1 + 0.2 = 0.30000000000000004). Always use `INTEGER` (storing cents) or `NUMERIC(12, 2)`.
- **Missing Cascade Rules**: Failing to specify `ON DELETE CASCADE` or `ON DELETE RESTRICT` on foreign keys.

---

## 5. Verification Check
- Are all entities in 3NF unless explicit performance testing justified denormalization?
- Are junction tables indexed on both foreign keys?
- Are partial unique indexes defined for soft-deletable entities?
