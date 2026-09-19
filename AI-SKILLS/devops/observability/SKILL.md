---
name: observability
description: >-
  Observability: OpenTelemetry, structured logging, distributed tracing, metrics collection, and Prometheus/Grafana. Use when instrumenting applications with OpenTelemetry, adding correlation IDs to logs, tracing distributed requests, or exposing metrics. Not for simple uptime checks or ping alerts (that is monitoring).
---

# Observability: Distributed Tracing, Structured Logging & Error Tracking

## 1. Core Observability Invariants

1. **Structured JSON Logs Everywhere**: Plain unstructured string messages (`console.log("user logged in")`) are strictly prohibited in production. Emit NDJSON objects with standardized fields (`timestamp`, `level`, `correlationId`, `service`, `message`).
2. **End-to-End Correlation ID Propagation**: Every inbound HTTP request or message queue job must carry or generate a unique correlation ID (`X-Correlation-ID`), propagated across all downstream calls and log lines.
3. **Distributed Context Tracing (OpenTelemetry)**: Track cross-service boundaries with trace and span IDs to pinpoint latency bottlenecks without guessing.
4. **Rich Error Context Without Secret Leaks**: Capture unhandled exceptions with full stack traces, release versions, and user breadcrumbs, while strictly scrubbing authorization headers and PII.

---

## 2. Key Implementation Patterns

### A. Correlation ID Middleware & Pino Structured Logging
```typescript
import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";
import pino from "pino";

// Context storage across async execution stack
export const requestContext = new AsyncLocalStorage<{ correlationId: string }>();

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    log(obj) {
      const store = requestContext.getStore();
      return store ? { ...obj, correlationId: store.correlationId } : obj;
    }
  }
});

export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.header("x-correlation-id") as string) || crypto.randomUUID();
  res.setHeader("x-correlation-id", correlationId);

  requestContext.run({ correlationId }, () => {
    logger.info({ path: req.path, method: req.method }, "Incoming HTTP Request");
    next();
  });
}
```

### B. Sentry Error Boundary with User Context
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Scrub sensitive headers
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
    }
    return event;
  }
});

export function recordException(err: unknown, user?: { id: string }) {
  Sentry.withScope((scope) => {
    if (user) scope.setUser({ id: user.id });
    const store = requestContext.getStore();
    if (store) scope.setTag("correlation_id", store.correlationId);
    Sentry.captureException(err);
  });
}
```

---

## 3. Anti-Patterns to Avoid

- **`console.log()` in Production**: Loses timestamps, formatting, severity levels, and causes severe event-loop blocking during high throughput.
- **Disconnected Log Lines**: Emitting logs across microservices with no shared correlation ID, rendering incident investigation nearly impossible.
- **Over-Sampling 100% Traces in High Volume**: Sending every trace to telemetry collectors when 1% or 5% sampling is sufficient, generating exorbitant cloud bills.

---

## 4. Verification Checklist

- [ ] All application logs output structured JSON with `correlationId`.
- [ ] Inbound requests propagate `X-Correlation-ID` header.
- [ ] Sentry captures unhandled errors and redacts credentials.
- [ ] OpenTelemetry tracer registers span durations for database queries and HTTP clients.
