---
name: performance-testing
description: >-
  Performance and load testing: k6, Lighthouse, latency benchmarking, throughput measurement, and SLA evaluation. Use when load-testing APIs, benchmarking concurrent throughput, evaluating Lighthouse web performance, or checking latency SLAs. Not for unit testing or functional test assertions (that is unit-testing or integration-testing).
---

# Performance Testing: Load Testing, Latency SLAs & Throughput Benchmarking

## 1. Core Performance Invariants

1. **Measure Percentiles, Not Averages**: Mean response time hides severe tail latency. Enforce SLAs on p95 and p99 percentiles (e.g. `http_req_duration: ['p(95)<250', 'p(99)<500']`).
2. **Realistic Ramp-Up Profiles**: Model user behavior with staged ramps (smoke -> load -> stress -> soak) rather than instant unreal spikes, unless specifically testing auto-scaling triggers.
3. **Strict Error Rate Thresholds**: A high-throughput service failing 5% of requests is broken. Enforce hard limits on non-2xx responses (e.g. `http_req_failed: ['rate<0.01']`).
4. **Identify Bottleneck Types**: Distinguish between CPU saturation (tight loops, crypto), I/O wait (slow database queries, external APIs), and memory leaks (garbage collection pauses).

---

## 2. Key Implementation Patterns

### A. k6 Staged Load Test Script
```javascript
// load-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 },  // Ramp up to 50 concurrent virtual users
    { duration: "3m", target: 50 },  // Stay at 50 users (steady state)
    { duration: "1m", target: 150 }, // Stress test spike to 150 users
    { duration: "1m", target: 0 },   // Ramp down
  ],
  thresholds: {
    // 95% of requests must complete below 200ms
    http_req_duration: ["p(95)<200", "p(99)<400"],
    // Error rate must remain below 1%
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:3000";

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/products`);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "payload has items": (r) => JSON.parse(r.body).length > 0,
  });

  // Realistic user think time
  sleep(1);
}
```

### B. Quick Node.js Throughput Probing with Autocannon
```bash
# Benchmark local endpoint: 100 concurrent connections for 10 seconds
npx autocannon -c 100 -d 10 http://localhost:3000/api/v1/health
```

---

## 3. Anti-Patterns to Avoid

- **Testing Against Localhost Only**: Localhost eliminates realistic network latency, TLS handshakes, and packet routing delays.
- **Ignoring Database State Pre-seeding**: Testing an empty database table yields unrealistic millisecond latencies that fail as soon as millions of rows are stored.
- **No Resource Monitoring During Tests**: Running load tests without tracking CPU, memory, and database connection pool utilization simultaneously.

---

## 4. Verification Commands

```bash
# Execute k6 load test against target staging environment
k6 run -e TARGET_URL=https://staging.example.com load-test.js
```
