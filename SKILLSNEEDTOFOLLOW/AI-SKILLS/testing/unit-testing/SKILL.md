---
name: unit-testing
description: >-
  Test structure, isolation, mocking boundaries, coverage that means something.
  Use when writing, fixing or designing tests — not as a default add-on to
  unrelated work.
---

# Unit Testing: TDD, Boundary Isolation & Edge Case Coverage

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 0. Activation Boundary
**Use for:** writing, structuring or fixing tests and their isolation boundaries.
**Do not use for:** diagnosing a production failure (`debugging`) or verifying an HTTP contract (`api-testing`).
**Not triggered by:** a request to fix a bug. Tests may follow the fix; they are not the lead skill.

## 1. Core Testing Invariants

1. **AAA Pattern (Arrange, Act, Assert)**: Structure every test case with clear separation between setup, execution, and verification. Keep tests readable as executable specifications.
2. **Isolation & Determinism**: Unit tests must never depend on external network calls, real databases, or system clocks. All side effects must be mocked or injected.
3. **Test Behavior, Not Internal Implementation**: Assert on output contracts and observable states, not private method calls or ephemeral internal variables.
4. **Edge Case Exhaustion**: Always test boundary conditions: empty inputs, null/undefined, zero, negative numbers, maximum array bounds, and invalid formats.

---

## 2. Key Implementation Patterns

### A. TDD Red-Green-Refactor with Vitest
```typescript
import { describe, it, expect } from "vitest";

// 1. Specify desired behavior before implementation (RED)
describe("calculateDiscount", () => {
  it("applies 10% discount for orders over $100", () => {
    // Arrange
    const orderAmount = 150;
    const tier = "standard";

    // Act
    const result = calculateDiscount(orderAmount, tier);

    // Assert
    expect(result).toBe(135);
  });

  it("handles zero and negative amounts safely by throwing", () => {
    expect(() => calculateDiscount(-10, "standard")).toThrow(
      "Invalid order amount"
    );
  });

  it("handles boundary exact values", () => {
    expect(calculateDiscount(100, "standard")).toBe(100);
  });
});
```

### B. Pytest Fixtures & Parametrization
```python
import pytest
from src.pricing import calculate_tax

@pytest.mark.parametrize(
    "subtotal,state_code,expected_tax",
    [
        (100.0, "CA", 7.25),
        (100.0, "NY", 8.875),
        (100.0, "OR", 0.0), # No sales tax
        (0.0, "CA", 0.0),
    ]
)
def test_calculate_tax_by_state(subtotal, state_code, expected_tax):
    tax = calculate_tax(subtotal, state_code)
    assert tax == pytest.approx(expected_tax, rel=1e-2)

def test_calculate_tax_invalid_state():
    with pytest.raises(ValueError, match="Unknown state code"):
        calculate_tax(100.0, "INVALID")
```

### C. Mocking External Boundaries Cleanly
```typescript
import { vi, describe, it, expect, beforeEach } from "vitest";
import { NotificationService } from "./notification-service";
import { EmailProvider } from "./email-provider";

describe("NotificationService", () => {
  let mockEmailProvider: EmailProvider;
  let service: NotificationService;

  beforeEach(() => {
    mockEmailProvider = {
      send: vi.fn().mockResolvedValue({ messageId: "msg-123" })
    } as unknown as EmailProvider;
    service = new NotificationService(mockEmailProvider);
  });

  it("sends welcome email when user is created", async () => {
    await service.notifyUserWelcome("user@test.com", "Alex");

    expect(mockEmailProvider.send).toHaveBeenCalledTimes(1);
    expect(mockEmailProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@test.com",
        subject: expect.stringContaining("Welcome")
      })
    );
  });
});
```

---

## 3. Anti-Patterns to Avoid

- **Testing Mocks Instead of Logic**: Over-mocking until the test passes regardless of whether real business logic works.
- **Flaky Tests**: Tests relying on `setTimeout` or asynchronous race conditions rather than proper promise resolution or mock timers.
- **Giant Multi-Assert Tests**: Writing one 200-line test that checks 15 distinct behaviors, making failure diagnostics painful.
- **Ignoring Failures in CI**: Marking tests with `.skip` or `@pytest.mark.xfail` indefinitely rather than fixing regressions.

---

## 4. Verification Commands

```bash
# Run Vitest with coverage report
npx vitest run --coverage

# Run Pytest with coverage and stop on first failure
pytest -v -x --cov=src tests/
```
