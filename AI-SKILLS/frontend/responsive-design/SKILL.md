---
name: responsive-design
description: >-
  Mobile-first layout, fluid clamp() scales, breakpoints and container-aware
  components. Use when something breaks on a phone or tablet, or when a layout
  must work across screen sizes.
---

# Responsive Design: Fluid Layouts & Mobile-First Engineering

## 1. The Mobile-First Discipline

Always construct interfaces starting with the mobile layout (320px–375px viewport), then progressively enhance for larger viewports:

```text
Default (Mobile):    Single-column stack, full-width cards, drawer navigation, touch targets >= 44px.
sm: (640px)          2-column grids for small cards, expanded padding.
md: (768px)          Sidebars, split-screen layouts, table views with scrolling wrappers.
lg: (1024px)         3-column grids, fixed side navigation, multi-panel workspaces.
xl: (1280px+)        Max container constraints (max-w-7xl mx-auto) to prevent uncomfortable wide lines.
```

---

## 2. Fluid Sizing with `clamp()`

Never resize text or spacing with abrupt, jumpy media queries when fluid scaling provides a smooth continuum:

```css
/* Fluid Typography: 1rem (16px) at 320px up to 1.25rem (20px) at 1200px */
font-size: clamp(1rem, 0.91rem + 0.45vw, 1.25rem);

/* Fluid Hero Heading: 2.25rem (36px) up to 4rem (64px) */
font-size: clamp(2.25rem, 1.61rem + 3.18vw, 4rem);

/* Fluid Page Padding */
padding-inline: clamp(1rem, 0.5rem + 2.5vw, 3rem);
```

*Note: Always include a `rem` term inside `clamp()` so user browser font-size zoom preferences are respected (WCAG 1.4.4).*

---

## 3. Touch Ergonomics & Touch Targets
- All interactive targets (buttons, links, tab items, checkboxes) must measure at least **44x44 px** of clickable area.
- Use CSS `min-h-[44px] min-w-[44px]` or pseudo-elements (`::after` hit-area expansion) for visually compact icons.
- Avoid hover-only essential actions on touch devices.

---

## 4. Anti-Patterns
- **The Desktop-First Downscale**: Writing desktop layouts first and hacking them with `max-width` queries to fit mobile.
- **Horizontal Overflow / Side Scroll**: Accidental fixed widths (`width: 500px`) causing mobile viewports to scroll horizontally.
- **Unconstrained Line Measure on Ultra-Wide**: Allowing text lines to span 2,000 pixels wide on desktop monitors.

---

## 5. Verification Check
- Does the layout reflow cleanly at 320px, 375px, 768px, 1024px, and 1440px?
- Is horizontal scroll eliminated at all widths?
- Are all mobile interactive elements >= 44px in touch area?
