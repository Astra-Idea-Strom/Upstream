---
name: visual-design
description: >-
  Visual aesthetics: color harmony, typography pairing, whitespace distribution, layout balance, and brand consistency. Use when improving visual appeal, choosing complementary color palettes, balancing whitespace, or refining interface aesthetics. Not for token code implementation or accessible headless components (that is design-systems).
---

# Visual Design: Hierarchy, Composition & Spatial Optics

## 1. Principles of Visual Hierarchy

Visual hierarchy directs the user's eye to information in order of importance:

1. **Size & Scale**: Primary headings (H1) must be distinctly larger than body copy, but proportional to viewport size via `clamp()`.
2. **Weight & Contrast**: Use bold weights (`font-semibold` / `font-bold`) sparingly for primary anchors. De-emphasize secondary metadata with subdued colors (e.g. `text-muted-foreground` or `zinc-500`).
3. **Spatial Proximity (Gestalt Law of Proximity)**: Elements belonging together must be spaced closer than unrelated elements (e.g. a label should be closer to its input than to the preceding form field).

---

## 2. Color Systems & Harmony

- **The 60-30-10 Rule**:
  - **60% Dominant Background**: Neutral canvas (white, off-white, dark zinc).
  - **30% Secondary Structural**: Cards, borders, sidebars, muted text (`zinc-100` / `zinc-800`).
  - **10% Accent / Interactive**: Primary buttons, links, active state indicators.
- **Accessible Contrast Ratios**:
  - Normal text (< 18.5px regular): >= 4.5:1 against background.
  - Large text (>= 24px regular or >= 18.5px bold): >= 3:1.
  - UI boundaries & icons: >= 3:1.

---

## 3. Optical Alignment vs Mathematical Alignment

- **Play Buttons in Circles**: Triangle icons mathematically centered appear pushed to the left. Shift the triangle optically ~2px to the right to achieve visual equilibrium.
- **Pill Badges & Caps Text**: All-caps text (`uppercase`) has no descenders. Reduce bottom padding slightly so text does not appear sunken.
- **Card Borders vs Backgrounds**: On dark backgrounds, pure black borders are invisible. Use subtle translucent white borders (e.g. `border-white/10`) with subtle elevation.

---

## 4. Anti-Patterns
- **The Rainbow Palette**: Using 6 distinct vibrant colors on a single page with no semantic meaning.
- **Equal-Weight Chaos**: Making headings, labels, body text, and badges all the same size and weight, forcing users to read everything to find anything.
- **Muddy Low-Contrast Text**: Using light gray text on white backgrounds (`#999999` on `#FFFFFF` fails WCAG AA).

---

## 5. Verification Check
- Is the primary call-to-action immediately obvious within 3 seconds of scanning?
- Does all text meet WCAG 2.2 AA contrast standards?
- Is spacing consistent using a disciplined 4pt/8pt rhythm?
