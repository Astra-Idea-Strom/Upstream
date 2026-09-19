---
name: postgresql
description: >-
  PostgreSQL administration and advanced features: EXPLAIN ANALYZE, pgvector, partial indexes, row-level security (RLS), and JSONB. Use when tuning Postgres queries, configuring RLS security policies, managing Postgres connections, or utilizing JSONB indexing. Not for generic multi-engine SQL queries or NoSQL documents (that is sql or nosql).
---

# PostgreSQL: Advanced Features, JSONB, Full-Text Search & pgvector

## 1. JSONB & GIN Indexing

PostgreSQL's `JSONB` stores semi-structured documents with binary indexing:

```sql
-- Create table with JSONB column and GIN index
CREATE TABLE event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GIN index enables rapid JSON containment queries
CREATE INDEX idx_event_payload ON event_logs USING GIN (payload);

-- Query using containment operator (@>)
SELECT * FROM event_logs WHERE payload @> '{"action": "checkout", "currency": "USD"}';
```

---

## 2. Full-Text Search (tsvector & tsquery)

Built-in search engine capabilities without needing external Elasticsearch:

```sql
-- Add generated search vector column
ALTER TABLE articles
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || coalesce(content, ''))) STORED;

CREATE INDEX idx_articles_search ON articles USING GIN (search_vector);

-- Fast ranked full-text query
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'database & performance') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

---

## 3. Vector Embeddings with `pgvector`

Store and query semantic AI embeddings directly inside PostgreSQL:

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536) -- OpenAI text-embedding-3-small dimension
);

-- Create HNSW index for high-speed approximate nearest neighbor search
CREATE INDEX idx_chunks_embedding ON document_chunks 
USING hnsw (embedding vector_cosine_ops);

-- Find top 5 closest chunks using cosine distance (<=>)
SELECT content, 1 - (embedding <=> $target_embedding) AS similarity
FROM document_chunks
ORDER BY embedding <=> $target_embedding ASC
LIMIT 5;
```

---

## 4. Anti-Patterns
- **Using `JSON` instead of `JSONB`**: Storing raw JSON text instead of decomposed binary JSONB, preventing index lookups.
- **IVFFlat Without Building Centroids**: Creating an IVFFlat index on an empty table, yielding zero index efficiency. Prefer **HNSW** for pgvector.
- **Ignoring Vacuum & Autovacuum**: Disabling autovacuum on high-update tables, leading to severe table bloat.

---

## 5. Verification Check
- Are JSONB lookups backed by GIN indexes?
- Is pgvector configured with an HNSW index for fast semantic similarity?
- Does `EXPLAIN (ANALYZE, BUFFERS)` confirm query efficiency?
