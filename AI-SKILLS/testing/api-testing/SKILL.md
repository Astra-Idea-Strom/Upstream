---
name: api-testing
description: >-
  API automated testing: Supertest, Postman/Newman, REST contract validation, status code checks, and payload assertion. Use when writing integration tests for HTTP endpoints, asserting response bodies, verifying API status codes, or mocking endpoints. Not for browser end-to-end user simulation (that is e2e-testing).
---

# API Testing: Contract Verification, Status Codes & HTTP Assertions

## 1. Core API Testing Invariants

1. **Verify HTTP Semantic Correctness**: Assert correct status codes for every scenario: `201 Created` with `Location` header, `400 Bad Request` for schema failures, `401 Unauthorized` for missing tokens, `403 Forbidden` for insufficient scope, `404 Not Found` for missing resources, `422 Unprocessable` for business logic conflicts, and `429 Too Many Requests` when rate limits trigger.
2. **Strict Response Schema Conformance**: Validate that returned payloads conform 100% to OpenAPI / JSON Schema contracts. Any unexpected extra properties or missing required fields constitute regressions.
3. **Security Header Verification**: Assert the presence of mandatory headers: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and appropriate `Content-Type: application/json`.

---

## 2. Key Implementation Patterns

### A. Supertest HTTP End-to-End Endpoint Testing
```typescript
import request from "supertest";
import { app } from "../src/app";
import { z } from "zod";

const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
  createdAt: z.string().datetime()
});

describe("POST /api/v1/users", () => {
  it("creates user and returns 201 with schema-conforming payload", async () => {
    const payload = { email: "newuser@example.com", password: "Password123!" };

    const res = await request(app)
      .post("/api/v1/users")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(201);

    // Validate payload contract strictly
    const parseResult = UserResponseSchema.safeParse(res.body);
    expect(parseResult.success).toBe(true);
    expect(res.body.email).toBe(payload.email);
    // Invariant: password must never be in response
    expect(res.body.password).toBeUndefined();
  });

  it("returns 400 Bad Request when email is invalid", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ email: "invalid-email-format", password: "pwd" })
      .expect(400);

    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});
```

### B. Authentication Header Verification
```typescript
describe("GET /api/v1/protected-resource", () => {
  it("returns 401 Unauthorized when Bearer token is missing", async () => {
    await request(app)
      .get("/api/v1/protected-resource")
      .expect(401);
  });

  it("returns 403 Forbidden when token has insufficient role scope", async () => {
    const userToken = createTestJwt({ role: "viewer" });
    await request(app)
      .get("/api/v1/protected-resource/admin-action")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);
  });
});
```

---

## 3. Anti-Patterns to Avoid

- **Asserting Only 200 OK**: Ignoring response body schema verification or failing to assert error response structures.
- **Relying on Fragile Hardcoded IDs**: Testing against database IDs that depend on run order instead of dynamically created fixture entities.
- **Neglecting Negative Status Paths**: Testing only the "happy path" and leaving 4xx/5xx error handling completely untested.

---

## 4. Verification Checklist

- [ ] Every API endpoint has test coverage for 2xx success and 4xx validation/auth failure cases.
- [ ] Response payloads are validated against Zod / JSON Schema.
- [ ] Authentication headers and RBAC boundaries are verified.
- [ ] API tests run in CI within seconds via Supertest without starting a real TCP socket.
