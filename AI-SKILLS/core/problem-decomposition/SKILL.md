---
name: problem-decomposition
description: >-
  Decomposing complex systems into atomic, testable milestones, vertical slices,
  and dependency-ordered execution paths. Use when breaking down multi-component features,
  managing technical dependencies, scheduling critical paths, or structuring engineering work.
  Not for high-level project goals or architectural decisions (that is planning or decision-making).
---

# Problem Decomposition: Divide & Conquer Systems Engineering

## 1. The Proportionality Principle & Decomposition Scope

Decomposition must scale proportionally with problem complexity:
- **Small (< 100 LOC)**: Single atomic step. Skip formal decomposition.
- **Medium (100–500 LOC)**: 2–3 milestones (e.g., schema migration -> endpoint -> UI).
- **Large (> 500 LOC or Multi-Service)**: Structured sequential milestones with explicit dependency graphs and independent verification gates.

---

## 2. Vertical Slices vs Horizontal Layers

Choose the decomposition strategy based on integration risk and feedback velocity:

### Horizontal Layering (Component-First)
Decomposes by technical tier: Database -> Business Logic Service -> REST/GraphQL API -> User Interface.
- **When to Use**: Greenfield infrastructure, shared foundational libraries, core data schemas where UI is undefined.
- **Trade-off**: Delays end-to-end feedback until the final presentation layer is wired.

### Vertical Slices (Feature-First)
Decomposes by complete, narrow user journeys spanning all layers simultaneously.
- **When to Use**: User-facing features, agile iterations, rapid customer validation.
- **Trade-off**: Requires touching multiple architectural layers in every milestone, but delivers shippable value immediately.

---

## 3. Worked Example: Decomposing Stripe Checkout

Realistic decomposition of adding Stripe subscription checkout into 4 atomic, verified milestones:

```text
Milestone 1: Webhook & Customer Data Layer (Foundation)
  ├── Task 1.1: Add stripe_customer_id & subscription_status to users table
  ├── Task 1.2: Implement raw-body Stripe webhook handler (/api/webhooks/stripe)
  └── Acceptance: Unit tests verify webhook signature validation & DB user record updates.

Milestone 2: Billing Service & Checkout Session API (Core Logic)
  ├── Task 2.1: Wrap Stripe SDK in BillingService with idempotent customer creation
  ├── Task 2.2: POST /api/billing/create-checkout-session returning Stripe redirect URL
  └── Acceptance: Integration test simulates valid session creation with mocked Stripe API.

Milestone 3: Pricing Table & Checkout UI (Presentation & Wiring)
  ├── Task 3.1: PricingTable component rendering subscription tiers & billing intervals
  ├── Task 3.2: Checkout button triggering API session call and handling redirect states
  └── Acceptance: E2E test clicks "Upgrade", verifies redirect to checkout URL and loading spinner.

Milestone 4: Post-Checkout Fulfillment & Error Recovery (Resilience)
  ├── Task 4.1: Customer portal redirect for managing active subscriptions
  ├── Task 4.2: Handling failed payment webhooks with automated notification emails
  └── Acceptance: Webhook test fires invoice.payment_failed and confirms email job queued.
```

---

## 4. Dependency Graph & Critical Path Scheduling

1. **Identify Precedents**: A task cannot start until its prerequisite data contracts or types exist.
2. **Determine Critical Path**: The longest sequence of dependent activities. For Stripe checkout: Schema -> Webhook Handler -> Checkout API -> UI.
3. **Parallelization Rules**: Parallelize only when interfaces are locked:
   - While Engineer A implements the Stripe API wrapper, Engineer B builds the frontend Pricing UI against a mock schema.

---

## 5. Definition of Done (DoD) per Milestone

Never advance to Milestone N+1 until Milestone N satisfies its DoD:
- [ ] Code compiles and passes linter with zero warnings.
- [ ] Unit and integration tests for the milestone pass locally and in CI.
- [ ] Error states (network timeout, invalid payload, unauthorized) are explicitly handled.
- [ ] Intermediate state does not break existing application behavior.

---

## 6. Anti-Patterns to Avoid

- **The Big Bang**: Editing 20 files across 3 layers before running or compiling code once.
- **Dangling Milestones**: Creating API endpoints that have no corresponding consumers or tests.
- **Over-Decomposition**: Creating formal milestones for trivial one-line helper functions.
- **Coupled Rollbacks**: Designing milestones where a failure in step 3 requires manual rollback of step 1.
