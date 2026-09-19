# Upstream — project notes

pnpm monorepo: `apps/client` (React 18 + Vite 6 + TS + Tailwind v3 + Zustand),
`apps/server` (Express), `packages/shared` (types). Branch in use: `dev/3-temp-ui`.

## Conventions Issac cares about
- **Preserve the visual theme.** `brand` purple + `coral`, glassmorphism,
  `Outfit` / `Plus Jakarta Sans` / `Playfair Display`, rounded-3xl cards.
  Never introduce an accent outside the palette (an off-theme `#F97356` orange
  had to be removed from the chat panel).
- **Consistency is the success criterion.** The reference bar is Replit /
  Lovable / Bolt. One chrome, one progress readout, one completion message.

## Architectural rules established
- **Derive, never duplicate.** Step definitions and progress live in
  `lib/steps.ts` + `hooks/useFlowProgress.ts`. Any surface that needs progress
  consumes the hook. Three surfaces each counting their own flag subset is the
  specific failure mode this guards against.
- **One catalogue per concept.** `lib/palettes.ts` holds the only palette list;
  `lib/dom.ts` holds the only DOM ids (`KIT_CARD_ID` is the html2canvas target
  and must stay stable).
- **Canvas card rule.** Every step renders through `StepSlot`:
  `pending` → `chooser` → `confirmed`. A step must never be blank.
- **Choosers only for user decisions.** `!isAutoPilot && (isActive || reopened)`.
  No timers driving card swaps.
- **Never pre-mark a selection** that the user has not confirmed — gate
  highlights on the `hasConfirmed*` flag, not on the store field, because
  preview fields always hold a value.
- **A component that paints its own surface cannot be nested in another tile.**
  `LogoArtwork` was the case in point: it baked in its own background, radius,
  padding and a fixed square, so every caller that wrapped it in a padded rounded
  box got a double-card edge plus clipped text. It now has a `variant="none"`
  mode that paints nothing and draws in `currentColor`, letting the container own
  the surface. Rule for any preview component: **either it is the tile, or it is
  transparent.**
- **Size tokens must be checked against their own box.** `LogoArtwork`'s `sm` was
  a 96px box with 48px of padding holding a 64px glyph — the glyph alone
  overflowed, so `sm` was broken everywhere. Padding, glyph and type now scale
  together per token (`sm` 96/12/40, `md` 160/16/64, `lg` 224/20/96,
  `xl` 288/24/128).
- **Show the set, don't hide it behind a switcher.** The logo card's
  Light/Dark/Brand and mockup tabs became two labelled rows (On surface / In
  use). A confirmed card is a rendering, not a control panel.
- **A control the user can see must do something.** Three lockup-editor controls
  were decorative: font/weight shown for an element that renders in a fixed
  face, a tab that gated nothing, and a colour silently overridden on dark
  surfaces. The rule now: the panel shows the properties of the selected
  element, and every control it shows works. Hide a control rather than show it
  disabled-by-design.
- **Never offer a colour that cannot be read.** A palette's `background` swatch
  is not an ink. `lib/color.ts` (`isLegible`, `MIN_TEXT_CONTRAST = 3`) gates the
  swatch row, and `setCanvaBgMode` re-inks when the surface changes underneath a
  chosen colour — otherwise state and render disagree. `lib/canvasSurfaces.ts`
  is the single definition of the four surfaces.
- **Destructive actions arm first.** Use `hooks/useArmedAction.ts`.
- **Assistant voice:** unboxed prose, no avatar; user turns are the only bubbles.
  No `[Robot]:` prefixes, no bracketed status codes in chat.

## UI copy rules (Issac's "minimal and neat" standard)
The interface must carry **no AI garnish, no duplicated readouts, no puffery**.
- **No AI iconography.** No robot (`Bot`), `Sparkles`, `Zap`/lightning or
  `WandSparkles`. Statuses are plain facts: Choose one / Confirmed / Selected /
  Locked / Applied / Ready to export.
- **No system-work gerunds.** Never "Synthesising", "Harmonising", "materialised".
  Use "Generating", "Building", "Drafting".
- **Never write "artefact" in UI copy** — say "card" or name the thing.
- **No fabricated data** — no invented metrics, scores, or status badges
  ("98% brief match", "Verified Live", "AI Synthesized" were all removed).
- **One progress surface only** — the canvas pane header's count (`Canvas · 2 of 5`)
  plus the hairline along the bottom edge of the top bar. Do not add a second
  counter, run log, or "Next · X" pill anywhere.
  **The top-bar `StepRail` was removed on Issac's instruction (15:32)** — five
  labelled ticks with green checks restated a flow the user is already walking
  through. `StepRail.tsx` now has no consumers.
- **Mockup content must be brand-agnostic** — drive it from `selectedName`, never
  hard-code one industry (coffee filler was showing on every brand's packaging).
- Marketing copy stays plain: no "Experience the future", "Instant Generation",
  "Idea to Identity Engine".

## Confirmed-card density rules (the canvas card house style)
A confirmed card should spend its pixels on content, not chrome.
- **No status pill on confirmed cards.** "Confirmed / Selected / Locked /
  Applied" restate the obvious. Only *choosing* cards carry a status
  ("Choose one"), because that one is an instruction.
- **The value is the headline.** No uppercase `tracking-wider` micro-labels above
  every field. `StepBadge` is a numbered dot + the step name in sentence case.
- **One quiet meta row for related values** (`Audience … Tone …`), not one
  bordered box with a label per field.
- **Delete icons that restate their button's text** (`RefreshCw` on "Change
  name", `Palette` on "Palette", `Smile` on the tone).
- **No explanations of explanations** — drop descriptions that describe a
  description.
- **Never fabricate content.** No invented taglines, meanings, metrics or
  statuses; seed from the real catalogue and stay honest when there is nothing
  to say (`Named by you.`).
- Exception: hex codes stay uppercase (`#7C3AED`) — that is convention.

## Toolchain gotchas
- lucide-react is **v1.47.0** (legacy naming) — `Wand2` / `Edit3` / `Code2` do
  not exist. Grep the `.d.ts` before using an icon.
- Playwright: managed node
  `~/.workbuddy-ai/binaries/node/versions/22.22.2-2/node.exe`, required from
  `AppData/Local/hermes/hermes-agent/node_modules/playwright`.
- Verify with `npx tsc --noEmit && npx vite build` in `apps/client`.

## Known debt
- 11 unreferenced legacy components remain in `apps/client/src/components/`
  (brand/ legacy set, studio/modals/*, ChatPane, BrandInputForm). They are named
  in `01_FILE_STRUCTURE.md` and `02_EXECUTION_PLAN.md`, which describe a planned
  architecture that was never built. Awaiting Issac's call on deletion.
