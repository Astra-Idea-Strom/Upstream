---
name: accessibility-testing
description: >-
  Accessibility testing: axe-core, Pa11y, screen-reader validation, WCAG 2.2 AA audit, and keyboard navigation testing. Use when verifying accessibility compliance, running automated axe audits, testing screen-reader announcements, or checking keyboard focus. Not for visual regression or functional API testing (that is e2e-testing or api-testing).
---

# Accessibility Testing: Automated Audits & WCAG Conformance

## 1. Core Accessibility Invariants

1. **Zero Critical/Serious axe-core Violations**: Every view must pass automated axe-core accessibility audits in CI with zero `critical` or `serious` violations.
2. **Keyboard-Only Operability**: Every interactive element (buttons, links, inputs, dropdowns, modals) must be reachable and operable using only `Tab`, `Enter`, `Space`, `Escape`, and arrow keys.
3. **Contrast Compliance (WCAG 2.2 AA)**: Text must achieve at least 4.5:1 contrast against its background (3:1 for large text >= 18pt or bold >= 14pt). Non-text UI components and focus rings must meet 3:1.
4. **Accessible Names & Labels**: Form controls must have associated `<label>` elements. Icon-only buttons must have `aria-label` or visually hidden screen reader text.

---

## 2. Key Implementation Patterns

### A. Playwright + axe-core Automated Audit
```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Audits", () => {
  test("homepage has no detectable a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Assert zero violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("dialog modal traps focus correctly", async ({ page }) => {
    await page.goto("/settings");
    await page.getByRole("button", { name: /delete account/i }).click();

    // Focus must be inside modal dialog
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Tab through modal and verify focus stays within
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    expect(focusedElement).toBeDefined();
  });
});
```

### B. Manual Keyboard Navigation Test Sequence
Execute this 5-point keyboard test on every UI feature:
1. **Tab traversal**: Press `Tab` through all interactive elements. Ensure focus order matches visual reading flow.
2. **Focus indicator**: Confirm every focused element has a visible, high-contrast focus outline (`outline: 2px solid var(--accent); outline-offset: 2px`).
3. **Modal traps**: Open a dialog; verify `Tab` cycles within the modal and cannot reach background elements.
4. **Escape key**: Press `Escape`; verify modal or dropdown closes and focus returns to triggering button.
5. **Space / Enter**: Activate buttons and links using only `Enter` or `Space`.

---

## 3. Anti-Patterns to Avoid

- **Suppressing Focus Outlines**: Writing `outline: none` or `*:focus { outline: 0 }` in CSS without custom replacement styling.
- **Relying Solely on Color**: Concurring state (success, error, danger) using color alone without accompanying icons or descriptive text.
- **Divs as Buttons**: Using `<div onClick={...}>` without `role="button"`, `tabIndex={0}`, and keyboard listeners.

---

## 4. Verification Checklist

- [ ] axe-core test suite passes cleanly with zero violations.
- [ ] Color contrast ratios checked via WebAIM or Lighthouse tools.
- [ ] All inputs have explicit `<label for="...">` associations.
- [ ] Page passes full navigation test using only keyboard controls.
