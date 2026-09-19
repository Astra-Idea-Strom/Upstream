---
name: animation-motion
description: >-
  Web animations: CSS transitions, keyframes, spring physics, Framer Motion, and prefers-reduced-motion accessibility. Use when building UI animations, configuring page transitions, animating layout changes, or enforcing reduced-motion modes. Not for static CSS styling or layout grids (that is advanced-css or responsive-design).
---

# Animation & Motion: Purposeful Interaction & Physics-Based Transitions

## 1. Principles of Purposeful Motion

Motion in software interfaces serves communication, orientation, and feedback. It is never decorative theatre:

1. **Duration Rules**:
   - Micro-interactions (hover, click feedback): **100ms–150ms**.
   - UI Transitions (dropdowns, drawers, dialog fades): **200ms–300ms**.
   - Full page transitions: Maximum **350ms**. Anything longer feels sluggish.
2. **Easing Disciplines**:
   - Entering elements: Decelerating curve (`ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`).
   - Exiting elements: Accelerating curve (`ease-in` or `cubic-bezier(0.7, 0, 0.84, 0)`).
   - Linear curves are strictly for continuous progress bars or loading spinners.

---

## 2. Accessibility: `prefers-reduced-motion`

Respecting users with vestibular disorders or motion sensitivity is a mandatory legal and ethical requirement (WCAG 2.3.3):

```css
/* CSS Reduced Motion Reset */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In Framer Motion:
```tsx
import { motion, useReducedMotion } from "framer-motion";

export function AccessibleModal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : 4 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 3. High-Craft Micro-Interactions

- **Button Press Physics**: Use subtle scale compression on active state:
  ```css
  .btn-interactive {
    transition: transform 100ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms ease;
  }
  .btn-interactive:active {
    transform: scale(0.98);
  }
  ```
- **List Layout Transitions**: Use Framer Motion's `layout` prop for smooth repositioning when items are reordered or deleted, avoiding harsh jumps.

---

## 4. Anti-Patterns
- **The Bouncy Carnival**: Adding spring physics with high bounciness (`damping: 5`) to serious productivity forms.
- **Dizzying Parallax**: Moving background layers at radically different speeds during normal page scroll.
- **Blocking Interactions**: Forcing the user to wait for a 1.5-second celebratory animation before allowing them to click the next button.

---

## 5. Verification Check
- Are all animations disabled or reduced when `prefers-reduced-motion` is simulated in browser devtools?
- Do all dialog and drawer transitions complete within 300ms?
- Do interactive feedback states feel snappy and immediate?
