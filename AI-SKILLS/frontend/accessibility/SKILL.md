---
name: accessibility
description: >-
  WCAG 2.2 AA engineering: semantic HTML, ARIA, keyboard navigation, focus
  management (native dialog, focus trap), the 2.2 criteria at levels A and AA,
  forms, motion, screen-reader checks. Use when building or auditing accessible
  UI: dialogs, forms, focus, contrast, target size, drag interactions. Not for
  setting up automated a11y tests (that is accessibility-testing).
---

# Accessibility (a11y): WCAG 2.2 AA Engineering Compliance

## 1. The POUR Principles & Non-Negotiables

1. **Perceivable**: informational images get `alt="..."`, decorative ones `alt=""`. Text contrast is at least 4.5:1 (3:1 for large text, and for UI component borders and states).
2. **Operable**: everything works by keyboard alone (Tab, Shift+Tab, Enter, Space, Esc). Never remove the focus indicator (`outline: none` without a replacement).
3. **Understandable**: inputs have a real `<label for>` or `aria-labelledby`; navigation order is predictable.
4. **Robust**: use native elements (`<button type="button">`, `<nav>`, `<main>`), never `<div onClick>`. Parsing (4.1.1) was removed in WCAG 2.2; do not report it as a failure.

---

## 2. New in WCAG 2.2 (required for AA conformance)

| SC | Level | Rule of thumb |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | A focused item is never fully hidden by sticky headers, banners or chat widgets |
| 2.5.7 Dragging Movements | AA | Every drag has a single-pointer alternative (buttons, tap-to-place) |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets are at least 24 by 24 CSS px, or spaced so 24 px circles centered on undersized targets do not touch another target |
| 3.3.8 Accessible Authentication (Minimum) | AA | No memory or transcription test; allow paste, password managers, passkeys |
| 3.2.6 Consistent Help | A | Help links or chat appear in the same place on every page |
| 3.3.7 Redundant Entry | A | Do not ask again for data already given in the same flow; prefill it |

```css
html { scroll-padding-top: 5rem; }              /* keeps focused items below a sticky header */
button, [role="button"], a.icon-link { min-width: 24px; min-height: 24px; }
```

---

## 3. Focus management

Prefer the native `<dialog>`: `showModal()` makes the rest of the page inert, closes on Esc, and returns focus to the trigger.

```html
<button type="button" id="open-dlg">Edit profile</button>
<dialog id="dlg" aria-labelledby="dlg-title">
  <h2 id="dlg-title">Edit profile</h2>
  <form method="dialog">
    <label for="name">Name</label>
    <input id="name" autocomplete="name" autofocus>
    <button value="cancel">Cancel</button>
    <button value="save">Save</button>
  </form>
</dialog>
<script>
  const dlg = document.getElementById("dlg");
  document.getElementById("open-dlg").addEventListener("click", () => dlg.showModal());
</script>
```

For a custom widget, set `inert` on the rest of the page and trap focus yourself: move focus in on open, wrap Tab and Shift+Tab, close on Esc, restore focus on close.

```js
function trapFocus(container, onEscape) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  const previous = document.activeElement;
  container.querySelector(sel)?.focus();
  function onKey(e) {
    if (e.key === "Escape") return onEscape();
    if (e.key !== "Tab") return;
    const list = [...container.querySelectorAll(sel)];
    if (!list.length) return e.preventDefault();
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container.addEventListener("keydown", onKey);
  return () => { container.removeEventListener("keydown", onKey); previous?.focus(); }; // call on close
}
```

Give every page a skip link, visible on focus:

```html
<a class="skip-link" href="#main">Skip to main content</a>
<style>.skip-link { position: absolute; left: -999px; } .skip-link:focus { left: 1rem; top: 1rem; }</style>
```

---

## 4. ARIA, forms and motion

- **First rule of ARIA**: do not use ARIA where a native element already does the job.
- Icon-only buttons need a name: `<button type="button" aria-label="Close"><CloseIcon aria-hidden="true" /></button>`.
- Announce updates with `aria-live="polite"`; use `role="alert"` for errors that need immediate attention.
- Form errors: mark the field and link its message.

```html
<input id="email" type="email" autocomplete="email" aria-invalid="true" aria-describedby="email-err">
<p id="email-err">Enter an email address such as name@example.com.</p>
```

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

---

## 5. Manual screen-reader checks

Automated tools find only part of the problems. Before release, walk the main flow with NVDA (Windows), VoiceOver (macOS, iOS) and TalkBack (Android): headings and landmarks list correctly, fields announce their label and error, dialogs announce their title and return focus, and live regions speak once. Setup and tooling live in `testing/accessibility-testing`.

---

## 6. Anti-Patterns
- **Clickable div**: invisible to keyboards and screen readers.
- **Removed outline**: `*:focus { outline: none; }`.
- **Generic links**: "Click here" instead of "Read our refund policy".
- **Drag-only or hover-only** interactions, and password fields that block paste.

---

## 7. Verification Check
- Can the whole flow be completed by keyboard, with focus always visible and never covered?
- Do all six 2.2 criteria above pass?
- Does every input have a label, and every error a linked message?
- Have axe-core or Lighthouse run clean, plus one manual screen-reader pass?
