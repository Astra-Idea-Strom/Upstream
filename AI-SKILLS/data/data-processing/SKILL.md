---
name: data-processing
description: >-
  Data pipelines: ETL workflows, chunked stream processing, deduplication, batch validation, and transformation. Use when processing bulk datasets, cleaning inconsistent inputs, transforming files between formats, or deduplicating records. Not for real-time WebSocket events or vector embeddings (that is realtime or embeddings).
---

# Data Processing: Stream Ingestion, ETL Pipelines & Batching

## 1. Stream Processing for Large Files

Never buffer entire large CSV, JSON, or media files into Node.js or Python memory at once. Use stream pipelines:

```typescript
// Node.js Stream Pipeline with CSV-Parse
import fs from "fs";
import { parse } from "csv-parse";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

async function processLargeCsv(filePath: string) {
  let batch: any[] = [];
  const BATCH_SIZE = 500;

  const batchTransformer = new Transform({
    objectMode: true,
    async transform(record, encoding, callback) {
      batch.push(record);
      if (batch.length >= BATCH_SIZE) {
        await insertBatchToDatabase(batch);
        batch = [];
      }
      callback();
    },
    async flush(callback) {
      if (batch.length > 0) {
        await insertBatchToDatabase(batch);
      }
      callback();
    },
  });

  await pipeline(
    fs.createReadStream(filePath),
    parse({ columns: true, trim: true, skip_empty_lines: true }),
    batchTransformer
  );
}
```

---

## 2. Schema Validation & Sanitization in Pipelines

Validate every row through strict schemas (Zod in TypeScript, Pydantic in Python) before persisting:
- Collect invalid records into an `errors.json` report containing row numbers and exact validation failure reasons.
- Never let a single bad row crash an entire multi-gigabyte ingestion pipeline.

---

## 3. Bulk Batch Insert Optimization

Never execute 10,000 individual `INSERT INTO` statements in a loop. Batch records into chunks of 500–1,000 items:

```sql
-- High-throughput bulk insert in PostgreSQL
INSERT INTO transactions (id, user_id, amount, created_at)
VALUES 
  ($1, $2, $3, $4),
  ($5, $6, $7, $8),
  ...
ON CONFLICT (id) DO NOTHING;
```

---

## 4. Anti-Patterns
- **`fs.readFileSync` on 500MB Files**: Crashing the V8 process with `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`.
- **Row-by-Row Unbatched Inserts**: Generating 10,000 separate network roundtrips to the database.
- **Silent Loss of Corrupted Rows**: Dropping invalid data rows without logging the errors for audit.

---

## 5. Verification Check
- Does memory consumption remain flat (< 150 MB) while processing a 1GB file stream?
- Are database writes grouped in batches of 500–1,000 items?
- Is an error summary generated for skipped or malformed rows?
