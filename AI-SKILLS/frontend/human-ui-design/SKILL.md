---
name: human-ui-design
description: >-
  Anti-AI-slop visual judgement; bans gratuitous gradients, pill borders and
  default-template aesthetics. Use when a UI looks generic, templated,
  "AI-made", or the user says to make it look designed rather than merely
  functional.
---

# Human UI Design: The Anti-AI-Slop Engineering Framework

> **Objective**: Generate interfaces that feel designed by an experienced, thoughtful human product designer rather than an automated AI UI generator.  
> **Source Attribution**: Adapted and evolved from Leonxlnx's `taste-skill` (MIT).

---

## 1. The Anti-AI-Slop Catalog (What to Eliminate)

AI-generated interfaces suffer from predictable, repetitive design cliches. You must actively audit and eliminate every one of these artifacts:

| AI Slop Artifact | The Problem | The Human Replacement |
| :--- | :--- | :--- |
| **Gratuitous Gradients** | Multi-color purple-to-blue gradients slapped across every hero, button, and heading. | **Restrained Solid Canvas**: Clean neutral background with high-contrast, purposeful solid accent colors. |
| **Excessive Glassmorphism** | `backdrop-blur-md bg-white/10` on every single panel, causing illegibility. | **Opaque Defined Surfaces**: Solid crisp cards (`bg-white` or `bg-zinc-900`) with subtle translucent borders (`border-black/5` or `border-white/10`). |
| **Pill Cards & 24px Radii** | Enormous rounded corners (`rounded-3xl` / 24px) on data containers, eating inner padding. | **Disciplined Radii**: Controlled `rounded-md` (6px) or `rounded-lg` (8px). Reserve pills (`rounded-full`) solely for status badges. |
| **Muddy Heavy Shadows** | Giant fuzzy drop shadows (`shadow-2xl`) creating a muddy floating look. | **Subtle Multi-Layer Elevation**: Crisp 1px border combined with faint micro-shadow: `border border-zinc-200 shadow-sm`. |
| **The Generic Hero Template** | Centered badge ("✨ Announcing AI 2.0"), centered oversized heading, centered paragraph, twin centered buttons. | **Contextual Layout**: Asymmetric compositions, editorial split-screens, left-aligned typography, or dense functional tools. |
| **Meaningless Card Grids** | Dividing all information into identical 3-column card grids regardless of content type. | **Purposeful Data Shapes**: Tables for comparison, lists for chronological events, key-value stats for metrics, editorial text blocks for reading. |
| **Floating Decorative Blobs** | Blurred colored orbs floating aimlessly in the background. | **Zero Floating Blobs**: Let whitespace, typographic scale, and structural grid rhythm create interest. |
| **Dashboard Syndrome** | Turning simple consumer tools or forms into a complex multi-metric "SaaS Dashboard". | **Form-Follows-Function**: If the user needs a simple photo uploader, build a clean focused upload flow, not a 12-widget dashboard. |

---

## 2. Reading the Room: Context-Driven Aesthetics

Never force a single aesthetic (e.g. "Linear-style dark mode") onto every project. Infer the design language from the product and audience:

### Aesthetic Archetypes Matrix

```text
1. Minimalist Editorial (Writing, Portfolios, Publications, Research)
   • Monospaced or clean serif accents (Geist, Newsreader, Inter).
   • High text density, generous margin rhythm, stark black/white contrast, zero border-radius.
   • Thin crisp hairline borders (1px solid #e5e5e5).

2. Modern B2B SaaS (Developer Tools, Dashboards, Productivity)
   • Neutral zinc/slate backgrounds, restrained accent color (deep blue, emerald, or neutral).
   • Compact density (compact table rows, dense forms), subtle hover transitions, 6px border radii.
   • High scan-ability, monospaced tabular numerals (`font-variant-numeric: tabular-nums`).

3. Warm Consumer / Healthcare / Education (Wellness, Habit Trackers, Learning)
   • Calming warm tones (stone, cream, soft sage, muted terracotta).
   • Slightly softer radius (10px–12px), friendly legible sans-serif (Plus Jakarta Sans, Inter).
   • Generous line-height, empathetic error states, clear non-judgmental feedback.

4. High-Craft Technical / Terminal (Security, DevOps, Low-level tooling)
   • Monospaced primary typography (JetBrains Mono, Fira Code), dark slate canvas.
   • Data density, status indicators (emerald for healthy, amber for warning, crimson for error).
   • Keyboard shortcut visual badges (`<kbd>⌘K</kbd>`).
```

---

## 3. Human Design Pre-Flight Checklist

Before presenting any generated UI, verify each item:

- [ ] **Density Check**: Is the UI compact enough to be functional without forcing endless scrolling?
- [ ] **Typography Hierarchy**: Are there at most 3 font sizes visible in any single view?
- [ ] **Border Discipline**: Are all container borders crisp and subtle (1px, low opacity)?
- [ ] **Color Restraint**: Is 90% of the UI composed of neutral tones with at most one primary accent?
- [ ] **Micro-Interactions**: Do buttons have subtle state changes (`active:scale-[0.98]` or opacity shift) rather than bouncy theatrical animations?
- [ ] **Authentic Content**: Are placeholders realistic (e.g. realistic user names and dates instead of "Lorem Ipsum" or "John Doe")?

---

## 4. Anti-Patterns (the AI-slop signature)
- **The Purple Gradient Hero**: a violet-to-indigo diagonal gradient behind large centred text. Instantly identifies generated work.
- **Pill Everything**: `border-radius: 9999px` on buttons, badges, cards and inputs alike, so nothing has hierarchy.
- **Emoji as Iconography**: 🚀 ✨ 🎯 standing in for a designed icon set.
- **Uniform Card Grids**: every piece of content in an identically sized rounded card with an identical shadow, flattening all importance.
- **Glow Without Cause**: coloured box-shadows on elements that are not emitting light.
- **Centred Everything**: centre-aligned body text, centred forms, centred multi-line paragraphs — legibility sacrificed for symmetry.
- **The Three-Feature Triptych**: three equal columns with an icon, a bold noun phrase and two lines of filler.
- **Contrast Theatre**: `#6B7280` body text on `#F9FAFB` because it "looks refined" — it fails WCAG and it is hard to read.

---

## 5. Verification Check
- Could this design be mistaken for the default output of a generator?
- Does anything on the page earn its emphasis, or is everything emphasised equally?
- Is there a single deliberate typographic decision a designer would defend?
- Does removing every gradient, glow and pill make the page *worse*? If not, they were decoration.

