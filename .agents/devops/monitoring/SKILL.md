---
name: monitoring
description: >-
  Application monitoring, uptime monitoring, health check endpoints, alert thresholds, and incident notification routing. Use when setting up server health checks, tracking error rates, defining alerting rules, or integrating PagerDuty/Slack notifications. Not for distributed tracing or log aggregation (that is observability).
---

# Monitoring: Health Probes, Prometheus Metrics & Alerting Systems

## 1. Core Monitoring Invariants

1. **Differentiate Liveness from Readiness**:
   - **Liveness Probe (`/livez`)**: Verifies if the process is alive. If this fails, the orchestrator restarts the container. Never check external dependencies here.
   - **Readiness Probe (`/readyz`)**: Verifies if the application can accept traffic (database connection pool healthy, cache connected, migrations completed). If this fails, traffic stops routing to this instance.
2. **Four Golden Signals**: Actively monitor Latency, Traffic (requests/sec), Errors (rate of 5xx responses), and Saturation (CPU, RAM, connection pool capacity).
3. **Actionable Alert Rules**: Every triggered alert must have a clear runbook link and actionable remediation steps. Suppress flapping or noisy low-signal alerts.

---

## 2. Key Implementation Patterns

### A. Hardened Health Check Endpoints
```typescript
import { Router } from "express";
import { db } from "../db";
import { redis } from "../cache";

export const healthRouter = Router();

// Liveness: quick internal process check
healthRouter.get("/livez", (req, res) => {
  res.status(200).json({ status: "alive" });
});

// Readiness: verifies dependency availability
healthRouter.get("/readyz", async (req, res) => {
  try {
    // 1. Check database connectivity with timeout
    await Promise.race([
      db.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 2000))
    ]);

    // 2. Check Redis ping
    await redis.ping();

    res.status(200).json({ status: "ready", uptime: process.uptime() });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Service Unavailable"
    });
  }
});
```

### B. Prometheus Metrics Collection (prom-client)
```typescript
import client from "prom-client";

// Collect default Node.js runtime metrics (GC, memory, event loop lag)
client.collectDefaultMetrics();

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});
```

---

## 3. Anti-Patterns to Avoid

- **Checking Database in Liveness Probe**: When the database has a temporary spike or restart, all application containers fail liveness and restart in a cascade, making recovery impossible.
- **Alerting on Raw Error Counts Instead of Rates**: Alerting on "10 errors" triggers during high traffic (0.001% rate) and ignores low traffic failures (100% rate). Always alert on percentages/rates.
- **Alert Fatigue**: Flooding on-call engineers with dozens of informational Slack messages until critical alerts are muted.

---

## 4. Verification Checklist

- [ ] Separate `/livez` and `/readyz` endpoints implemented.
- [ ] Readiness endpoint returns 503 when primary database is unreachable.
- [ ] Core latency and error rate metrics exported at `/metrics`.
- [ ] Uptime monitor configured with external synthetic pings.
