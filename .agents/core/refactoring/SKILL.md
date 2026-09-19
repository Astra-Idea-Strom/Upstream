---
name: refactoring
description: >-
  Behavior-preserving clean code transformations: guard clauses, function extraction,
  value objects, and characterization testing. Use when cleaning legacy code, simplifying
  nested conditionals, eliminating primitive obsession, or applying the strangler pattern.
  Not for fixing functional bugs or introducing new features (that is debugging or backend-engineering).
---

# Refactoring: Behavior-Preserving Clean Code Transformations

## 1. Principles of Safe Refactoring

1. **Precondition**: Passing automated tests must exist before modifying code. If tests are absent, write characterization tests first.
2. **Atomicity**: Make one mechanical transformation at a time. Run tests after each transformation.
3. **Zero Feature Creep**: Never combine bug fixes, performance optimizations, or new features with refactoring commits.

---

## 2. Core Refactoring Patterns (With Before/After)

### A. Guard Clauses (Flattening Deep Nesting)

```typescript
// BEFORE: Deeply nested pyramid of doom
function processOrder(order: Order | null, user: User | null): Result {
  if (order !== null) {
    if (user !== null) {
      if (order.items.length > 0) {
        if (user.hasValidPaymentMethod) {
          return executePayment(order, user);
        } else {
          return Result.error("Payment method invalid");
        }
      } else {
        return Result.error("Empty order");
      }
    } else {
      return Result.error("User required");
    }
  } else {
    return Result.error("Order required");
  }
}

// AFTER: Guard clauses with early returns
function processOrder(order: Order | null, user: User | null): Result {
  if (!order) return Result.error("Order required");
  if (!user) return Result.error("User required");
  if (order.items.length === 0) return Result.error("Empty order");
  if (!user.hasValidPaymentMethod) return Result.error("Payment method invalid");

  return executePayment(order, user);
}
```

### B. Extract Function (Intent Over Implementation)

```typescript
// BEFORE: Function mixing business logic with low-level parsing
function notifySubscribers(users: User[], event: Event): void {
  for (const user of users) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(user.email);
    if (isValid && user.subscribedToAlerts && user.status === "ACTIVE") {
      sendEmail(user.email, event.title, event.body);
    }
  }
}

// AFTER: Extracted predicate clarifying intent
function isEligibleForAlert(user: User): boolean {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
  return isValidEmail && user.subscribedToAlerts && user.status === "ACTIVE";
}

function notifySubscribers(users: User[], event: Event): void {
  for (const user of users) {
    if (isEligibleForAlert(user)) {
      sendEmail(user.email, event.title, event.body);
    }
  }
}
```

### C. Value Objects (Eliminating Primitive Obsession)

```typescript
// BEFORE: Raw string email prone to invalid state
function register(rawEmail: string) {
  if (!rawEmail.includes("@")) throw new Error("Invalid email");
  saveToDb({ email: rawEmail.toLowerCase().trim() });
}

// AFTER: Immutable Value Object encapsulating invariants
class EmailAddress {
  private readonly value: string;

  constructor(candidate: string) {
    const trimmed = candidate.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new Error(`Invalid email address format: ${candidate}`);
    }
    this.value = trimmed;
  }

  toString(): string {
    return this.value;
  }
}
```

---

## 3. Characterization Testing (Golden Master)

When refactoring legacy code lacking tests, capture current behavior before touching code:

```typescript
// Characterization test locking in legacy behavior
describe("Legacy Pricing Engine Characterization", () => {
  it("preserves exact legacy outputs across representative input vectors", () => {
    expect(calculatePrice({ type: "STANDARD", qty: 1, coupon: null })).toEqual({ total: 100, tax: 10 });
    expect(calculatePrice({ type: "BULK", qty: 50, coupon: "SAVE10" })).toEqual({ total: 4050, tax: 405 });
    expect(calculatePrice({ type: "STANDARD", qty: 0, coupon: null })).toEqual({ total: 0, tax: 0 });
  });
});
```

---

## 4. Large-Scale Architecture Refactoring Strategies

1. **Strangler Fig Pattern**: Incrementally intercept calls to the legacy component and route them to the new implementation until the legacy code has zero callers and can be safely deleted.
2. **Branch by Abstraction**: Introduce an interface layer around the subsystem. Switch implementations via runtime configuration or feature flag without long-lived git branches.
3. **Function Length Smell**: The "over 30 lines" heuristic indicates potential multiple responsibilities, but is a diagnostic trigger for inspection, not an inflexible dogma.

---

## 5. Verification Checklist

- [ ] All existing automated tests run and pass without changes to test assertions.
- [ ] No behavioral regressions or altered error codes in public interfaces.
- [ ] Code complexity is measurably reduced (lower nesting depth, clearer naming).
- [ ] Refactoring commits contain zero feature additions or unrelated bug fixes.
