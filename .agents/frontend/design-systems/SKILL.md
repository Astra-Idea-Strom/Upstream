---
name: design-systems
description: >-
  Design tokens (color, typography scale, spacing, elevation, motion), reusable accessible
  component libraries, Radix primitives, and Tailwind integration. Use when designing design
  token hierarchies, building reusable component primitives, configuring Tailwind theme scales,
  or enforcing dark-mode contrast. Not for high-level UX layout or brand identity (that is ui-ux or visual-design).
---

# Design Systems: Token Architecture, Primitives & Theme Engineering

## 1. Token Taxonomy & Hierarchy

Design tokens represent the atomic visual decisions of an interface. Structure tokens in three tiers:

```text
Global Raw Tokens (Primitives)
  ├── colors.blue.500: #3b82f6
  ├── font-size.base: 1rem (16px)
  └── duration.200: 200ms
          │
          ▼
Semantic Contextual Tokens (Intent)
  ├── color.background.primary: var(--colors-blue-500)
  ├── text.body.default: var(--font-size-base)
  └── elevation.card: 0 4px 6px -1px rgb(0 0 0 / 0.1)
          │
          ▼
Component Tokens (Scoped)
  ├── button.primary.bg: var(--color-background-primary)
  └── dialog.shadow: var(--elevation-card)
```

---

## 2. Complete Token Scales

### A. Typography Modular Scale (Major Third - 1.25)
- `text-xs`: `0.75rem` / line-height `1rem`
- `text-sm`: `0.875rem` / line-height `1.25rem`
- `text-base`: `1.000rem` / line-height `1.5rem`
- `text-lg`: `1.125rem` / line-height `1.75rem`
- `text-xl`: `1.250rem` / line-height `1.75rem`
- `text-2xl`: `1.500rem` / line-height `2rem`

### B. Elevation (Shadow) Tokens
- `elevation-1` (Subtle): `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- `elevation-2` (Cards): `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- `elevation-3` (Dropdowns / Popovers): `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- `elevation-4` (Modals / Dialogs): `0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

### C. Z-Index Scale (Strict Semantics)
- `z-base`: `0`
- `z-dropdown`: `1000`
- `z-sticky`: `1100`
- `z-overlay`: `1200`
- `z-modal`: `1300`
- `z-toast`: `1500`
- `z-tooltip`: `1600`

### D. Motion Tokens with Accessibility
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
}

/* Enforce WCAG reduced motion compliance */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3. Tailwind CSS & Token Integration

Map semantic tokens into Tailwind configuration (`tailwind.config.ts`):

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      boxShadow: {
        "elevation-card": "var(--elevation-2)",
        "elevation-modal": "var(--elevation-4)",
      },
    },
  },
} satisfies Config;
```

---

## 4. Headless Accessible Primitives & Dark Mode Contrast

1. **Headless Foundation**: Always build interactive controls (dialogs, comboboxes, menus) on top of accessible headless primitives (Radix UI or React Aria) to ensure keyboard trapping and ARIA attributes.
2. **WCAG 2.2 Contrast Verification**:
   - Normal text: Minimum contrast ratio of 4.5:1 against background.
   - Large text (>= 18pt or 14pt bold) and active UI borders: Minimum 3.0:1 contrast ratio.
3. **Token Deprecation Policy**:
   - Never remove tokens abruptly. Retain deprecated tokens as aliases pointing to new tokens with `@deprecated` comments for at least one major release.

---

## 5. Verification Checklist

- [ ] All interactive tokens have tested light and dark mode color variants.
- [ ] Contrast ratios meet WCAG 2.2 AA (4.5:1 text, 3:1 graphical elements).
- [ ] `prefers-reduced-motion` suppresses all animations and smooth scrolling.
- [ ] Z-indices reference semantic token constants rather than arbitrary integers (`9999`).
