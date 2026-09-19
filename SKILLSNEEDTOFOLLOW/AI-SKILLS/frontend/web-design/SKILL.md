---
name: web-design
description: >-
  Web design fundamentals: page structure, semantic HTML5, viewport scaling, hero sections, and navigation patterns. Use when structuring marketing websites, designing landing page layouts, organizing website navigation, or crafting header/footer sections. Not for complex React state or backend services (that is frontend-engineering or backend-engineering).
---

# Web Design: Typographic Systems, Spatial Grids & Composition

> **Source Attribution**: Synthesizes Robert Bringhurst's *The Elements of Typographic Style* and Simon Gonzalez's `web-typography-skill` (Apache-2.0).

---

## 1. The Typographic Decision Sequence

Make typographic decisions top-down in strict sequential order:

```text
1. FONT SELECTION      → Default to fast high-quality system font stack unless brand demands custom web font.
2. BASE SIZE & MEASURE → Body >= 1rem (16px). Constrain measure to 45–75 characters (max-w-[65ch]).
3. TYPE SCALE          → Choose one modular ratio (1.200 Minor Third or 1.250 Major Third). Never hand-pick random px.
4. VERTICAL RHYTHM     → Line-height unitless 1.5–1.6 for body; tighter 1.15–1.25 for large display titles.
5. HEADING WRAP        → Apply `text-wrap: balance` on headings to prevent single dangling words (widows).
6. PERFORMANCE         → Metric-matched fallback fonts to eliminate layout shift (CLS).
```

---

## 2. Typographic Scales & Non-Negotiables

### The Modular Scale (Major Third: 1.250)
- **Caption / Metadata**: `0.8rem` (12.8px) - `text-xs`
- **Body / Standard**: `1.0rem` (16px) - `text-base`
- **Subheading / H4**: `1.25rem` (20px) - `text-xl`
- **Section Heading / H3**: `1.563rem` (25px) - `text-2xl`
- **Page Heading / H2**: `1.953rem` (31px) - `text-3xl`
- **Display / H1**: `clamp(2.25rem, 1.8rem + 2vw, 3.5rem)`

### The Non-Negotiable Typographic Rules
1. **Size Body Text in `rem`, Never `px`**: Pixel sizes override user browser zoom settings, failing WCAG 1.4.4.
2. **Line-Height Must Be Unitless**: `line-height: 1.5` recomputes proportionally across all inherited child elements. `line-height: 24px` breaks on larger children.
3. **Constrain the Measure**: Lines wider than 75 characters cause reading fatigue as the eye loses its place during the return sweep. Enforce `max-width: 65ch` on all text containers.
4. **Never Justify Web Body Text**: `text-align: justify` without hyphenation engines creates unsightly "rivers" of whitespace. Use left-aligned, ragged right.
5. **Tabular Numerals for Data**: Always apply `font-variant-numeric: tabular-nums` to numbers in tables, countdowns, and financial figures so columns align vertically.

---

## 3. Spatial Grids: The 4pt / 8pt Spatial Rhythm

Every spacing decision (padding, margin, gap) must be a multiple of **4px / 8px**:

```text
4px  (0.25rem) - p-1 / gap-1   → Micro gaps between icons and labels
8px  (0.5rem)  - p-2 / gap-2   → Inner padding for badges and small buttons
16px (1.0rem)  - p-4 / gap-4   → Standard card padding and element separation
24px (1.5rem)  - p-6 / gap-6   → Major component gutters and grid gaps
32px (2.0rem)  - p-8 / gap-8   → Section margins
48px (3.0rem)  - p-12 / gap-12 → Page section separation
```

---

## 4. Anti-Patterns
- **The Widowed Heading**: A 3-line heading where the final line contains only one lonely word. Fix with `text-wrap: balance`.
- **The Wall of Text**: A 1,000-word essay spanning 1,400 pixels across an ultra-wide monitor with zero line breaks.
- **Random Spacing**: Inlining `margin-top: 19px` and `padding: 13px` breaking the spatial grid.

---

## 5. Verification Check
- Is line length constrained between 45 and 75 characters for all readable prose?
- Are all line-height values unitless?
- Does every number column in data tables use tabular figures?
