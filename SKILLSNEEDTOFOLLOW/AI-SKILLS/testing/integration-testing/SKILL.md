---
name: integration-testing
description: >-
  Integration testing: multi-component interaction, database integration tests, testcontainers, and mock services. Use when testing service-to-database communication, verifying inter-module integration, or asserting subsystem boundaries. Not for isolated single-function tests or browser UI automation (that is unit-testing or e2e-testing).
---

# Integration Testing: Boundary Verification & Test Harnesses

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 1. Core Integration Invariants

1. **Test Real Interfaces Across Boundaries**: Verify that real subsystems (e.g. Service + Database ORM, or Controller + Router) interact correctly according to contract schemas.
2. **Hermetic Test Environments**: Never point integration tests to shared production or staging databases. Use ephemeral Docker containers (Testcontainers) or dedicated local test databases.
3. **Transactional Isolation**: Run individual tests within database transactions and roll them back on teardown, or truncate test tables between runs to eliminate state leakage.
4. **Network Interception for Third Parties**: Use Mock Service Worker (MSW) or WireMock to intercept external HTTP calls at the network level rather than mocking internal client classes.

---

## 2. Key Implementation Patterns

### A. Database Transaction Rollback Pattern
```typescript
import { db } from "../src/db";
import { UserService } from "../src/services/user-service";

describe("UserService Integration", () => {
  let userService: UserService;

  beforeEach(async () => {
    // Start isolated transaction
    await db.$executeRawUnsafe("BEGIN;");
    userService = new UserService(db);
  });

  afterEach(async () => {
    // Clean rollback ensures no database pollution
    await db.$executeRawUnsafe("ROLLBACK;");
  });

  it("creates user and persists initial preferences", async () => {
    const user = await userService.createUser({
      email: "integration@test.com",
      name: "Integration User"
    });

    const persisted = await db.users.findUnique({ where: { id: user.id } });
    expect(persisted).toBeDefined();
    expect(persisted?.email).toBe("integration@test.com");
  });
});
```

### B. Mock Service Worker (MSW) HTTP Interception
```typescript
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { PaymentGatewayClient } from "../src/clients/payment-gateway";

const server = setupServer(
  http.post("https://api.stripe.com/v1/charges", async ({ request }) => {
    return HttpResponse.json({
      id: "ch_test_mock_123",
      status: "succeeded",
      amount: 5000
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("processes charge through gateway client successfully", async () => {
  const client = new PaymentGatewayClient({ apiKey: "mock-key" });
  const charge = await client.charge({ amount: 5000, currency: "usd" });
  expect(charge.id).toBe("ch_test_mock_123");
  expect(charge.status).toBe("succeeded");
});
```

---

## 3. Anti-Patterns to Avoid

- **Shared Mutable State Across Tests**: Allowing Test A to insert a record that Test B expects to find. Leads to intermittent failures when tests run in parallel.
- **Calling Real External APIs (Stripe, OpenAI) in CI**: Incurs costs, causes rate-limiting failures, and creates flakiness on network outages.
- **Testing Entire Systems via UI Only**: Using slow E2E browser tests for behavior that can be validated faster and more reliably at the integration service layer.

---

## 4. Verification Checklist

- [ ] Integration tests run against an isolated test database.
- [ ] Database state is clean before and after each test suite.
- [ ] External HTTP dependencies are intercepted via MSW or equivalent.
- [ ] Integration tests execute cleanly in continuous integration pipelines.
