---
name: ui-ux
description: >-
  UI/UX design principles: user journey mapping, visual hierarchy, error state UX, cognitive load reduction, and wireframing. Use when planning user workflows, designing intuitive form interactions, improving visual ergonomics, or reducing user friction. Not for token definitions or low-level CSS layout (that is design-systems or advanced-css).
---

# UI/UX: User Experience Architecture & Heuristic Engineering

## 1. Core Heuristic Framework (Nielsen-Norman Aligned)

1. **Visibility of System Status**: Always provide immediate feedback for user actions (loading skeletons for data fetches, active states on navigation, disabled states during pending async requests).
2. **Match Between System and Real World**: Use user-centric language and intuitive mental models (e.g. "Trash / Archive" instead of "Soft Delete Entity").
3. **User Control and Freedom**: Provide clear "Undo", "Cancel", and exit paths for destructive or multi-step operations.
4. **Consistency and Standards**: Respect platform conventions (e.g. Esc closes modals; Enter submits forms; primary buttons are consistently positioned).
5. **Error Prevention & Recovery**:
   - Prevent errors by disabling impossible actions or using constrained inputs (date pickers instead of raw date strings).
   - Write clear, constructive error messages explaining what went wrong and how the user can resolve it.

---

## 2. The 4 Fundamental States of Every UI Component

Every data-driven component must explicitly design and handle four distinct states:

```text
1. INITIAL / EMPTY STATE:  Helpful onboarding message or call-to-action (e.g. "No notes yet. Create your first note").
2. LOADING STATE:          Content-shaped skeleton screen matching the layout (avoid jarring full-page spinners).
3. SUCCESS / DATA STATE:   Populated content with clear hierarchy and functional actions.
4. ERROR STATE:            Human-readable explanation with a "Retry" button and fallback path.
```

---

## 3. Information Architecture & Navigation

- **Max 7 Top-Level Items**: Do not overwhelm primary navigation bars. Group related items into structured submenus or drawers.
- **Breadcrumbs for Deep Hierarchies**: If the user is > 2 levels deep, provide clickable breadcrumbs for context.
- **Search & Filter Ergonomics**: Provide debounced real-time search (~300ms) with clear indicators of active filters and a one-click "Clear All Filters" button.

---

## 4. Anti-Patterns
- **The Empty Void**: Showing a blank white screen when a dataset contains zero items, confusing the user into thinking the app crashed.
- **Uninformative Modals**: Asking "Are you sure?" without specifying *what* will be deleted and whether the action is reversible.
- **Dead-End Error Screens**: Showing "Error 500: Internal Server Error" without a navigation link back to safety or a retry trigger.

---

## 5. Verification Check
- Does every data table/list have an intentional empty state and loading skeleton?
- Can users undo or cancel multi-step flows?
- Are destructive actions gated by an explicit confirmation dialog?
