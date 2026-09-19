---
name: backend-security
description: >-
  Server-side vulnerability defense: input sanitization, rate limiting, secure headers, CORS, and request validation. Use when hardening backend APIs, mitigating brute-force attacks, configuring Helmet security headers, or sanitizing payloads. Not for frontend DOM security or user authentication (that is frontend-security or authentication).
---

# Backend Security: Rate Limiting, SSRF Defense & Transport Hardening

## 1. Rate Limiting & Denial of Service Defense

Protect all public and resource-intensive endpoints from brute-force and scraping:

```typescript
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

// 1. Strict Auth Rate Limiter (Brute-Force Defense)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // Max 5 failed attempts per IP
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. General Public API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // Max 100 requests per minute
  standardHeaders: true,
});
```

---

## 2. Server-Side Request Forgery (SSRF) Prevention

When an application fetches a URL supplied by a user (e.g. web scraping, webhook test, avatar import):

```typescript
import ipaddr from "ipaddr.js";
import { URL } from "url";

export function validateSafeExternalUrl(inputUrl: string): boolean {
  const parsed = new URL(inputUrl);

  // 1. Enforce strict HTTP/HTTPS protocol
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Invalid protocol. Only HTTP and HTTPS are permitted.");
  }

  // 2. Resolve hostname and block private / loopback IP ranges
  const hostname = parsed.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    throw new Error("Access to localhost is forbidden.");
  }

  // Block cloud metadata endpoints
  if (hostname === "169.254.169.254") {
    throw new Error("Access to cloud metadata service is forbidden.");
  }

  return true;
}
```

---

## 3. CORS & Security Headers (Helmet)

- Configure `helmet()` to inject secure HTTP headers on every response.
- Configure strict CORS: Never use wildcard `*` with credentials enabled.

```typescript
import helmet from "helmet";
import cors from "cors";

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "https://myapp.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
```

---

## 4. Anti-Patterns
- **The 50MB Uncapped JSON Payload**: Allowing clients to send massive JSON bodies that freeze the V8 event loop during JSON parsing. Always configure: `express.json({ limit: "1mb" })`.
- **Blind Webhook Dispatcher**: Allowing users to configure webhooks pointing to `http://192.168.1.1/admin` to probe internal company networks.
- **Leaking Stack Traces in Production**: Exposing database connection strings or file system paths in error responses.

---

## 5. Verification Check
- Are rate limiters active on all authentication endpoints?
- Is private IP / localhost access blocked on any URL fetching utility?
- Are payload limits capped to 1MB or less?
