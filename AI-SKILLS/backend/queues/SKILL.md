---
name: queues
description: >-
  Asynchronous job processing: BullMQ, Redis streams, Celery, worker concurrency, and dead-letter queues. Use when offloading long-running jobs, processing background tasks, retrying failed operations, or designing worker pipelines. Not for synchronous REST endpoints or in-memory caches (that is backend-engineering or caching).
---

# Queues: Background Job Processing, Retries & Dead Letter Queues (DLQ)

## 1. When to Use Background Queues

Never perform long-running, IO-heavy, or non-critical operations inside the synchronous HTTP request-response cycle:
- **Offload Immediately**: Sending emails, generating PDF reports, video transcoding, calling slow AI APIs, web scraping, and third-party webhook dispatching.
- Return `202 Accepted` with a job ID to the client, allowing the frontend to poll status or listen via WebSockets.

---

## 2. BullMQ (Redis-Backed) Production Architecture

```typescript
// Producer: Enqueue Job
import { Queue, Worker } from "bullmq";

export const emailQueue = new Queue("email-notifications", {
  connection: { host: "localhost", port: 6379 },
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: "exponential",
      delay: 2000, // 2s, 4s, 8s, 16s
    },
    removeOnComplete: 1000, // Keep last 1000 completed jobs
    removeOnFail: 5000,     // Retain failed jobs for dead-letter analysis
  },
});

// Consumer / Worker: Process Job with Idempotency
const worker = new Worker("email-notifications", async (job) => {
  console.log(`Processing email job ${job.id} for user ${job.data.userId}`);
  
  // Idempotency check: verify job hasn't already executed
  const alreadySent = await checkSentStatus(job.data.idempotencyKey);
  if (alreadySent) return;

  await sendTransactionalEmail(job.data);
  await markSentStatus(job.data.idempotencyKey);
}, { connection: { host: "localhost", port: 6379 }, concurrency: 5 });

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
```

---

## 3. The Dead Letter Queue (DLQ) Strategy

When a job exhausts all 4 retry attempts without success:
1. Move the failed payload to a Dead Letter Queue (`email-notifications:dead-letter`).
2. Trigger an alert to engineering via Slack/Sentry.
3. Keep the payload intact for manual replay once the underlying bug or third-party outage is resolved.

---

## 4. Anti-Patterns
- **Non-Idempotent Workers**: If a worker crashes mid-execution and the queue retries the job, a non-idempotent worker might charge a customer twice.
- **Passing Giant In-Memory Objects**: Enqueueing a 50MB raw video buffer inside a Redis queue payload. Upload to S3/disk first; pass only the S3 URL in the job data.
- **Missing Concurrency Limits**: Running 100 concurrent workers that overwhelm the database connection pool.

---

## 5. Verification Check
- Are slow external tasks offloaded to background workers?
- Are retry policies configured with exponential backoff and jitter?
- Is worker execution strictly idempotent?
