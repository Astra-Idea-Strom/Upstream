---
name: e2e-testing
description: >-
  End-to-end browser testing: Playwright, Cypress, user flow automation, visual regression, and cross-browser testing. Use when automating full browser workflows, testing multi-page checkout flows, taking regression screenshots, or verifying UI interactions. Not for isolated unit tests or backend API contracts (that is unit-testing or api-testing).
---

# End-to-End Testing: Browser Automation & User Journey Verification

## 1. Core E2E Testing Invariants

1. **Test User-Visible Behavior, Not DOM Internals**: Locate elements using accessible locators (`getByRole`, `getByLabel`, `getByText`) rather than fragile CSS selectors or XPath.
2. **Page Object Model (POM) Discipline**: Encapsulate UI interactions and page locators inside reusable Page Object classes to isolate tests from markup refactors.
3. **Zero Arbitrary Sleeps**: Never use `page.waitForTimeout(5000)`. Always leverage Playwright's built-in auto-waiting or explicit state assertions (`toBeVisible()`, `toHaveURL()`).
4. **Focus on High-Value Critical Paths**: Prioritize revenue-critical user flows (registration, checkout, core interactive editor) rather than trivial static content verification.

---

## 2. Key Implementation Patterns

### A. Playwright Page Object Model (POM)
```typescript
// tests/pages/login.page.ts
import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email address");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: /sign in/i });
    this.errorMessage = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }
}
```

### B. User Flow Test Specification
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Authentication Journey", () => {
  test("user can log in and view dashboard", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("user@example.com", "CorrectPassword123!");

    // Auto-waits for navigation and DOM stability
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });

  test("displays error message on invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("user@example.com", "WrongPassword!");

    await expect(loginPage.errorMessage).toContainText("Invalid email or password");
  });
});
```

---

## 3. Anti-Patterns to Avoid

- **Brittle Locators**: Using selectors like `div.sc-bdVaJa > div:nth-child(3) > button` which break upon any CSS framework update or layout tweak.
- **Testing Every Combination in E2E**: Running thousands of slow browser tests for form validation matrixes that belong in fast unit tests.
- **Unseeded or Polluted Database State**: Relying on preexisting database data that may be deleted or modified by concurrent test runners.

---

## 4. Verification Commands

```bash
# Run all Playwright tests headlessly
npx playwright test

# Debug tests with Playwright UI inspector
npx playwright test --ui

# Show HTML test report
npx playwright show-report
```
