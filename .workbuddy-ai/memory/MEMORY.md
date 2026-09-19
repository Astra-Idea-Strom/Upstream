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
- **One progress surface only** — the top-bar `StepRail` + bottom hairline.
  Do not add a second counter, run log, or "Next · X" pill anywhere.
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
