---
name: advanced-css
description: >-
  Modern advanced CSS: CSS Grid, Flexbox, container queries, fluid typography with clamp(), custom properties, and subgrid. Use when implementing complex responsive layouts, writing fluid CSS clamp rules, using container queries, or modern styling. Not for CSS animations or complete design token systems (that is animation-motion or design-systems).
---

# Advanced CSS: Modern Grid, Subgrid, Container Queries & Modern Selectors

## 1. CSS Subgrid Architecture

Use CSS Subgrid to align nested child elements (e.g. card headers, descriptions, footers) across sibling grid items without brittle fixed heights:

```css
/* Parent Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Child Card using Subgrid */
.card-item {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  /* Row 1: Header / Title | Row 2: Variable Body Text | Row 3: Action Buttons */
}
```

---

## 2. Container Queries (`@container`)

Style components based on the size of their immediate container rather than the global browser viewport:

```css
/* 1. Define Container Context */
.sidebar-panel, .main-feed {
  container-type: inline-size;
  container-name: card-container;
}

/* 2. Component Adapts to Container Width */
.widget-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@container card-container (min-width: 450px) {
  .widget-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
```

---

## 3. The `:has()` Relational Parent Selector

Target parent elements based on child state without needing JavaScript state hooks:

```css
/* Style form group container when child input is invalid */
.form-field:has(input:invalid:not(:placeholder-shown)) {
  border-color: var(--color-error);
  background-color: var(--color-error-subtle);
}

/* Highlight navigation link when child submenu is open */
.nav-item:has(.submenu[data-state="open"]) {
  background-color: var(--color-surface-hover);
}
```

---

## 4. Modern CSS Cascade Layers (`@layer`)

Control specificity wars cleanly using explicit cascade layers:

```css
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }
}

@layer base {
  body {
    font-family: system-ui, -apple-system, sans-serif;
    color: var(--foreground);
  }
}
```

---

## 5. Logical Properties for Internationalization (i18n)

Never hardcode physical directions when building modern global interfaces:
- Use `padding-inline` instead of `padding-left` / `padding-right`.
- Use `margin-block` instead of `margin-top` / `margin-bottom`.
- Use `border-inline-start` instead of `border-left`.

---

## 6. Anti-Patterns
- **The `!important` Escalation**: Adding `!important` to override specificity instead of managing cascade layers.
- **Viewport Overuse When Container Queries Fit**: Using `@media (min-width: 768px)` for a card that lives inside a narrow sidebar.
- **Div Wrapper Hell for Alignment**: Nesting 4 wrapper divs with hacky flexbox properties where Subgrid solves the alignment in 2 lines.

---

## 7. Verification Check
- Are cards with multi-line titles aligned cleanly across rows using subgrid?
- Do reusable widgets adapt cleanly when placed in narrow vs wide parent containers?
- Are modern selectors (`:has()`) used to eliminate unnecessary client JS state?
