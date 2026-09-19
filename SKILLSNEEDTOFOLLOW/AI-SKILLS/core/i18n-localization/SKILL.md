---
name: i18n-localization
description: >-
  Internationalisation and localisation: locale-aware dates, numbers, currency
  and plurals, message catalogues, ICU MessageFormat, timezone correctness,
  RTL layout and locale-sensitive sorting. Use when users in different countries
  see wrong dates, numbers or currency, when adding a second language, or when
  text expansion and right-to-left scripts break the layout.
---

# i18n & Localisation: Locale Correctness

## 0. Activation Boundary
**Use for:** locale-dependent formatting, translation infrastructure, RTL and
text-expansion layout, timezone storage and display.
**Do not use for:** general typography (use `web-design`), accessibility (use
`accessibility`), or database timezone column types alone (use `data-modeling`).

## 1. The rule that prevents most bugs
> Store in UTC and in a canonical unit. Format at the edge, per request locale.

Never persist a formatted string. `"03/04/2026"` is unrecoverable — it is
4 March in London and 3 April in New York.

## 2. Formatting
```js
// Dates: never hand-roll, never assume the server locale.
new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: userTz })
  .format(instant);

// Currency: the amount is minor units + an ISO code; the symbol and the
// position are locale-derived, never hardcoded.
new Intl.NumberFormat(locale, { style: "currency", currency: "INR" })
  .format(cents / 100);            // → ₹1,23,456.78 in en-IN (2-2-3 grouping)

// Plurals: never `count === 1 ? "item" : "items"`. Arabic has six categories.
new Intl.PluralRules(locale).select(count);   // zero|one|two|few|many|other

// Sorting: never String.prototype.localeCompare()-free sorts on user text.
new Intl.Collator(locale, { sensitivity: "base" }).compare(a, b);
```

## 3. Message catalogues
- Key by **meaning**, not by English text: `checkout.button.submit`, not
  `"Place order"` — the source string changes, the key must not.
- Use ICU MessageFormat for interpolation, plurals and gender. Never concatenate
  translated fragments; word order is not universal.
- Ship context notes to translators. `"Open"` is a verb or an adjective.

## 4. Layout consequences
- Budget **+30–35 % text expansion** for German/Finnish; CJK contracts.
  Fixed-width buttons break first.
- RTL: use CSS logical properties (`margin-inline-start`, `padding-block`) and
  `dir="rtl"`; `left`/`right` will strand your layout.
- Never build a sentence from concatenated UI fragments.

## 5. Timezones
- Store instants as UTC; store the user's **IANA zone name** (`Asia/Kolkata`),
  not a UTC offset — offsets change with DST and by legislation.
- "Today" is a locale-and-timezone question. Compute date boundaries in the
  user's zone, not the server's.

## 6. Anti-Patterns
- **Locale from the browser language alone** — language ≠ region. `en` says
  nothing about date order or currency.
- **Hardcoded `$`, `,` and `MM/DD/YYYY`.**
- **Storing formatted strings or local times.**
- **Assuming one plural form, one text direction, or a single-byte alphabet.**

## 7. Verification Check
- Does anything formatted for display get persisted? (It must not.)
- Is every date rendered with an explicit timezone and locale?
- Does the layout survive +35 % text and `dir="rtl"`?
- Are plurals resolved with `Intl.PluralRules` rather than a ternary?
