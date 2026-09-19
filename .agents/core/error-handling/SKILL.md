---
name: error-handling
description: >-
  Resilient error handling: typed domain errors, centralized error middleware, retry with exponential backoff, and circuit breakers. Use when designing error hierarchies, catching unhandled rejections, configuring API error responses, or building fault-tolerant services. Not for frontend visual error states (that is frontend-engineering or ui-ux).
---

# Error Handling: Failure Containment, Resilience Patterns & Structured Logging

> **Source Attribution**: Adapted and evolved from affaan-m's `everything-claude-code` (MIT).

## 1. Custom Error Class Hierarchies

Typed errors enable targeted `catch` blocks and machine-readable classification:

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus = 500,
    public readonly isOperational = true
  ) { super(message); this.name = this.constructor.name; }
}
class ValidationError extends AppError {
  constructor(msg: string) { super(msg, "VALIDATION_ERROR", 400); }
}
class ExternalServiceError extends AppError {
  constructor(service: string) { super(`${service} unavailable`, "EXTERNAL_SERVICE_ERROR", 502); }
}
```

---

## 2. Try/Catch Boundary Placement

Boundaries belong at **integration seams**, not around entire business logic functions:

1. **HTTP handler level** — catch all errors; translate to status codes; never expose raw stack traces.
2. **External I/O** (DB, network, filesystem) — wrap individual calls, not the whole service function.
3. **Background job / queue consumer** — each job needs its own boundary; one failure must not crash the worker.
4. Never catch inside a function that is already inside a `catch` — this creates silent swallowing.

---

## 3. Retry / Backoff

Only retry **transient and idempotent** failures. Never retry `ValidationError` or permanent failures.

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3, baseMs = 200): Promise<T> {
  let last: Error;
  for (let i = 1; i <= maxAttempts; i++) {
    try { return await fn(); }
    catch (err) {
      if (err instanceof ValidationError) throw err;  // non-retryable
      last = err as Error;
      if (i < maxAttempts)
        await sleep(Math.min(baseMs * 2 ** (i - 1), 5000) + Math.random() * 100); // jitter
    }
  }
  throw last!;
}
```

---

## 4. Circuit Breaker

Fast-fails calls to a repeatedly-failing dependency to prevent cascading failures.

States: **CLOSED** → **OPEN** (fast-fail after failure threshold) → **HALF-OPEN** (one probe) → back to CLOSED or OPEN.

Use `opossum` (Node.js) or `resilience4j` (JVM). Configure: failure rate %, reset timeout, slow-call threshold.

---

## 5. UI Error Boundaries

Wrap independent sections — not the whole application — so one crash is contained:

```tsx
<ErrorBoundary fallback={<SectionError name="Dashboard" />}>
  <DashboardWidget />   {/* crash here stays here */}
</ErrorBoundary>
```

`componentDidCatch` must log the error with a correlation ID.

---

## 6. Structured Error Logging

**Log**: error class, `code`, correlation/request ID, stack (server-side only), affected resource ID.
**Never log**: passwords, tokens, API keys, raw PII (name + email + address together), session cookies.

```typescript
logger.error({
  err: { name: err.name, code: err.code, message: err.message, stack: err.stack },
  requestId: ctx.requestId,
  userId: ctx.userId,        // pseudonymous ID — OK
}, "Order processing failed");
```

---

## 7. Anti-Patterns
- **The Silent Swallow**: `catch (e) {}` or `except: pass`. The failure still happened; you have only deleted the evidence.
- **Retry Without Idempotency**: retrying a non-idempotent write duplicates charges, emails and orders. An idempotency key is part of the retry, not an optional extra.
- **Retry Without Backoff or Cap**: immediate infinite retries convert a slow dependency into a self-inflicted denial of service.
- **Blanket try/catch Around a Whole Handler**: hides which of eight operations failed, making the 4-phase debugging protocol impossible.
- **Errors as Strings**: `throw "failed"` loses the stack, the cause chain and the type.
- **Retrying 4xx**: a 400 will be a 400 forever. Retry timeouts, 429s and 5xx; fail fast on client errors.
- **No Timeout**: a call with no timeout is an unbounded resource lease. Every outbound call needs one.

---

## 8. Verification Check
- Does every outbound call have a timeout, a bounded retry policy and a fallback?
- Is every retried write idempotent, with a key that survives a restart?
- Does the caught error preserve the cause chain and reach a log with enough context to reproduce it?
- Would a reader of the code know which operation failed?