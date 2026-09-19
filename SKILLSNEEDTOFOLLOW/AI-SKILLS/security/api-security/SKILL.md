---
name: api-security
description: >-
  OWASP API Top 10: BOLA, broken auth, resource consumption, SSRF, HMAC webhook
  verification, rate limiting, CORS. Use when hardening an API, rate-limiting,
  verifying webhooks, or responding to an API vulnerability.
---

# API Security: OWASP API Top 10 & Boundary Defenses

## 1. Core Threat Invariants & Defenses

Modern web services fail most frequently at API boundaries. Enforce these invariants across all endpoints:

1. **Every Object Access Must Validate Ownership (BOLA / IDOR Defense)**: Never fetch an object by primary key alone without scoping to the authenticated caller's identity or tenant.
2. **Strict Property Whitelisting (BOPLA Defense)**: Never use mass assignment (e.g. `req.body` directly into database ORM). Always parse through explicit DTO schemas with strip-unknown or strict mode enabled.
3. **Bounded Resource Consumption**: All list/search queries must enforce hard pagination caps (`max_limit = 100`) and tiered rate limiting.
4. **Cryptographic Webhook Signatures**: Inbound webhooks must be verified using HMAC-SHA256 signatures with constant-time equality checks before processing.

---

## 2. Key Implementation Patterns

### A. Broken Object Level Authorization (BOLA) Prevention
```typescript
// VULNERABLE: Direct lookup allows attacker to fetch any user's invoice
// const invoice = await db.invoices.findById(req.params.id);

// SECURE: Tenant and user ownership scoped into query
export async function getInvoice(userId: string, invoiceId: string) {
  const invoice = await db.invoices.findOne({
    where: {
      id: invoiceId,
      ownerId: userId // Enforces access boundary at database level
    }
  });

  if (!invoice) {
    // Return 404 rather than 403 to prevent enumeration/timing attacks
    throw new NotFoundError("Invoice not found");
  }

  return invoice;
}
```

### B. HMAC-SHA256 Webhook Verification
```typescript
import crypto from "crypto";

export function verifyWebhookSignature(
  rawPayload: string | Buffer,
  signatureHeader: string,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawPayload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const providedBuffer = Buffer.from(signatureHeader, "utf8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  // Constant-time comparison prevents timing attacks
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}
```

### C. Server-Side Request Forgery (SSRF) Defense
When fetching remote URLs on behalf of users (e.g. webhooks, link previews):
```typescript
import ipaddr from "ipaddr.js";
import dns from "dns/promises";

export async function validateOutboundUrl(targetUrl: string): Promise<string> {
  const parsed = new URL(targetUrl);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Invalid protocol: only HTTP/HTTPS allowed");
  }

  const addresses = await dns.resolve4(parsed.hostname);
  for (const ip of addresses) {
    const addr = ipaddr.parse(ip);
    // Block loopback (127.0.0.1), private (10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12),
    // carrier-grade NAT, link-local, and cloud metadata (169.254.169.254)
    if (addr.range() !== "unicast") {
      throw new Error(`SSRF blocked: host resolves to restricted IP ${ip}`);
    }
  }

  return targetUrl;
}
```

---

## 3. Anti-Patterns to Avoid

- **Mass Assignment ORM Updates**: Using `User.update(req.body)` allows malicious actors to inject `role: 'admin'` or `is_verified: true`.
- **Unbounded Collections**: Endpoints without `limit` clauses allow queries like `GET /api/events` returning 500,000 rows, exhausting memory.
- **Leaking Internal Stack Traces**: Returning raw DB errors or stack dumps exposes database schema and internal file paths.
- **Relying on Client-Side Auth Checks**: Hiding buttons in frontend UI without checking permissions in backend API endpoints.

---

## 4. Verification & Testing

1. Run automated API security test suites:
   ```bash
   npx zap-cli quick-scan --self-contained --start-options "-config api.disablekey=true" http://localhost:3000/api
   ```
2. Unit test BOLA boundaries:
   ```typescript
   test("user cannot fetch invoice belonging to another user", async () => {
     const res = await request(app)
       .get(`/api/invoices/${otherUserInvoiceId}`)
       .set("Authorization", `Bearer ${userToken}`);
     expect(res.status).toBe(404);
   });
   ```
