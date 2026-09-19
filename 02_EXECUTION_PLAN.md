# 02 – Execution Plan

> **Project:** Upstream – AI Brand Identity & Naming Generator  
> **Duration:** 12 Hours  
> **Team Size:** 4 Members  
> **Stack:** React + TypeScript + Vite + Tailwind + Zustand · Node.js + Express · OpenAI GPT-4o + DALL-E 3 · Firebase Firestore

---

## Timeline Overview

| Time | Role 1 (PM / Git) | Role 2 (UI/UX) | Role 3 (AI/API) | Role 4 (Backend/DB) |
|------|-------------------|----------------|-----------------|----------------------|
| **H0:00–0:20** | Init monorepo, pnpm workspaces | — *(wait for scaffold)* | — *(wait for scaffold)* | — *(wait for scaffold)* |
| **H0:20–0:45** | tsconfig.base.json, .gitignore, .env.example | Local env setup, wireframe sketch | Local env setup, review API design | Local env setup, Firebase console |
| **H0:45–1:00** | GitHub repo, initial commit, branch protection | Branch `feat/ui-setup`, Vite scaffold | Branch `feat/ai-service`, server scaffold | Branch `feat/backend-setup`, Express scaffold |
| **H1:00–1:30** | GitHub Issues, labels, PR template | BrandInputForm skeleton | OpenAI SDK + `openai.service.ts` skeleton | Middleware stack (CORS, helmet, rate-limit) |
| **H1:30–2:00** | `packages/shared` types, unblock all roles | BrandInputForm full (6 fields + validation) | `POST /api/brand/generate` implementation starts | Firebase Admin SDK + `firebase.service.ts` |
| **H2:00–3:00** | Review & merge PRs (≤20 min each) | BrandNameCard + BrandResultsGrid (mock data) | `POST /api/brand/generate` complete | Route files + controller stubs |
| **H3:00–4:00** | Review & merge PRs, resolve conflicts | VisualDirectionPanel + ColorSwatch + DomainBadge | `POST /api/domain/check` (mock 70% available) | `POST /api/brand/save` → Firestore |
| **H4:00–5:00** | Review & merge PRs | LogoGallery + LoadingSpinner + BrandIdentityCard | `POST /api/brand/logos` (DALL-E 3 + async status) | `GET /api/projects/:id` → Firestore |
| **H5:00–5:30** | 🔴 **SYNC 1** – Merge all core PRs, verify build | 🔴 **SYNC 1** – Merge, smoke test mock UI | 🔴 **SYNC 1** – Verify all endpoints return data | 🔴 **SYNC 1** – Verify all endpoints reachable |
| **H5:30–7:00** | Vercel (frontend) + Render (backend) deployment setup | Wire real API calls (swap all mock data) | Response caching, prompt tuning | Request validation (express-validator), endpoint tests |
| **H7:00–8:00** | Deploy to staging, verify env vars | PDF export (jsPDF + html2canvas) | Cost controls, error handling, API hardening | Performance testing, edge cases |
| **H8:00–9:00** | Test staging endpoints, monitor logs | Styling polish, animations, responsive design | Error handling refinement, rate-limit guards | Error scenarios, deploy support |
| **H9:00–9:30** | 🔴 **SYNC 2** – Full end-to-end test on staging | 🔴 **SYNC 2** – Full user flow test | 🔴 **SYNC 2** – All endpoints on staging | 🔴 **SYNC 2** – All endpoints on staging |
| **H9:30–11:00** | Fix deploy issues, polish README | UI fixes from SYNC 2 feedback | Edge-case fixes from testing | Monitoring, final deploy checks |
| **H11:00–12:00** | Demo dry-runs, final README, submit | Demo support, answer UI questions | Demo support, handle live API calls | Demo support, monitor Firestore |

---

## Detailed Role Tasks

---

### Role 1 – Git / Project Manager

> **Branch Strategy:** `main` is protected (require PR + 1 approval). All work branches off `main` using `feat/<area>` naming.

| # | Time | Duration | Dependency | Branch | Task | Deliverable |
|---|------|----------|------------|--------|------|-------------|
| 1 | H0:00–0:20 | 20 min | None | `main` | Run `pnpm init`, configure `pnpm-workspace.yaml`, create `apps/client`, `apps/server`, `packages/shared` folder structure | Monorepo scaffold pushed to `main` |
| 2 | H0:20–0:45 | 25 min | Task 1 | `main` | Write `tsconfig.base.json` (strict mode), `.gitignore` (node_modules, dist, .env), `.env.example` with all required env var keys | Config files committed |
| 3 | H0:45–1:00 | 15 min | Task 2 | `main` | Create GitHub repo `upstream-hackathon`, push initial commit, set `main` branch protection (require 1 PR review, no force push) | Remote repo live, all team members have push access via collaborator invite |
| 4 | H1:00–1:30 | 30 min | Task 3 | `main` | Create 20+ GitHub Issues with labels (`ui`, `ai`, `backend`, `infra`, `bug`), write `.github/pull_request_template.md` | Issues visible to team, PR template active |
| 5 | H1:30–2:00 | 30 min | Task 3 | `feat/shared-types` | Scaffold `packages/shared/src/types.ts` (BrandInput, BrandResult, DomainResult, LogoResult interfaces) and export via `index.ts` | Shared types installable by `apps/client` and `apps/server`; confirm Role 2, 3, 4 are unblocked |
| 6 | H2:00–5:00 | 3 hr | Ongoing | Various | Continuously monitor open PRs. Review and merge within 20 min of submission. Resolve conflicts immediately (pull, rebase, repush). Message the team in Slack/Discord if a PR is blocked | All feature PRs merged before SYNC 1 |
| 7 | H5:00–5:30 | 30 min | All core PRs | `main` | SYNC 1: Merge all remaining core PRs in dependency order (backend first, then AI, then UI), run `pnpm install && pnpm build` at root | Clean build on `main` |
| 8 | H5:30–7:00 | 90 min | Task 7 | `feat/infra` | Set up Vercel project (connect GitHub, set `apps/client` as root, configure env vars). Set up Render service (connect GitHub, set `apps/server` as root, add env vars) | Both deployment configs saved and auto-deploy triggers confirmed |
| 9 | H7:00–8:00 | 60 min | Task 8 | `feat/infra` | Trigger manual deploys on both platforms, verify health check endpoint (`GET /api/health`), test `POST /api/brand/generate` against the live Render URL using Postman | Staging URLs confirmed working |
| 10 | H8:00–9:00 | 60 min | Task 9 | `main` | Monitor Vercel + Render logs, fix any build errors, verify all env vars present (especially `OPENAI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`) | Zero deployment errors in logs |
| 11 | H9:00–9:30 | 30 min | Task 10 | `main` | SYNC 2: Run full end-to-end test on staging with entire team; document any discovered bugs as GitHub Issues | All critical bugs triaged |
| 12 | H9:30–11:00 | 90 min | Task 11 | `main` | Fix any staging deployment issues. Write/polish `README.md` (problem statement, tech stack, setup instructions, team, demo link) | README merged to `main` |
| 13 | H11:00–12:00 | 60 min | Task 12 | `main` | Run 2 demo dry-runs with team (time each one—must be ≤2 min). Make final README tweaks. Submit project on hackathon platform | Submission confirmed |

---

### Role 2 – UI/UX Developer

> **Stack:** Vite + React 18 + TypeScript + Tailwind CSS v3 + Zustand + React Router v6 + Axios  
> **Principle:** Build with mock data first. Do NOT block on APIs. Swap to real endpoints only at SYNC 1.

| # | Time | Duration | Dependency | Branch | Task | Deliverable | Mock Data Used |
|---|------|----------|------------|--------|------|-------------|----------------|
| 1 | H0:00–0:30 | 30 min | Role 1 push (H0:20) | `feat/ui-setup` | `cd apps/client`, run `pnpm create vite . --template react-ts`, install Tailwind CSS + PostCSS + Autoprefixer, configure `tailwind.config.ts` (custom colors: `upstream-green`, `upstream-slate`), install Zustand + React Router + Axios | `apps/client` runs on `localhost:5173` |  None |
| 2 | H0:30–1:00 | 30 min | Task 1 | `feat/ui-setup` | Create `src/store/brandStore.ts` (Zustand: `brandInput`, `brandResults`, `selectedBrand`, `isLoading` state + actions). Set up React Router in `App.tsx` (`/` → LandingPage, `/results` → ResultsPage). Create Axios instance in `src/api/client.ts` with base URL from `import.meta.env.VITE_API_URL` | Store and routing scaffold committed |  None |
| 3 | H1:00–2:00 | 60 min | Task 2 | `feat/brand-input-form` | Build `BrandInputForm.tsx`: 6 fields → (1) Company Description (textarea, required), (2) Industry (select: Tech / Health / Finance / Retail / Other), (3) Target Audience (text), (4) Brand Vibe (multi-select: Modern / Minimal / Bold / Playful / Trustworthy / Eco-Conscious), (5) Competitor Names (text, optional), (6) Domain Extension Preference (.com / .io / .co). Add Zod validation. On submit, set `isLoading = true` and navigate to `/results` | Fully functional form, no API call yet | `setTimeout(3000)` fakes API delay |
| 4 | H2:00–3:00 | 60 min | Task 3 | `feat/results-grid` | Build `BrandNameCard.tsx` (props: `name`, `tagline`, `score`, `isSelected`). Build `BrandResultsGrid.tsx` (renders 12 cards in a responsive 3×4 grid, accepts `brands: BrandResult[]`). Import mock data from `src/mocks/mockBrands.ts` (12 hardcoded objects) | Results grid renders with mock data | `src/mocks/mockBrands.ts` (12 brands) |
| 5 | H3:00–4:00 | 60 min | Task 4 | `feat/visual-direction` | Build `VisualDirectionPanel.tsx` (expandable side panel: color palette, font pairing, brand adjectives). Build `ColorSwatch.tsx` (renders hex color circle + label). Build `DomainBadge.tsx` (props: `domain`, `available: boolean` → green ✓ or red ✗ badge) | Panel expands when a brand card is clicked | `src/mocks/mockVisualDirection.ts` |
| 6 | H4:00–5:00 | 60 min | Task 5 | `feat/logo-gallery` | Build `LogoGallery.tsx` (2×2 grid of `<img>` tags, accepts `logos: string[]` URLs). Build `LoadingSpinner.tsx` (animated Tailwind spinner with label). Build `BrandIdentityCard.tsx` (summary card: selected name + tagline + palette + logo preview) | Complete results page layout renders with mock data | `src/mocks/mockLogos.ts` (4 placeholder image URLs) |
| 7 | H5:00–5:30 | 30 min | SYNC 1 | `main` | Merge `feat/logo-gallery` into `main` via PR. Pull latest `main`. Participate in SYNC 1 build verification | Clean build confirmed |  — |
| 8 | H5:30–7:00 | 90 min | SYNC 1 | `feat/api-wiring` | Replace mock imports with real Zustand actions that call Axios: (a) On form submit → `POST /api/brand/generate` → populate `brandResults`. (b) On brand card click → `POST /api/domain/check` → update `DomainBadge`. (c) On 'Generate Logos' click → `POST /api/brand/logos` → poll status, then show logos | All three API integrations functional |  None (real API) |
| 9 | H7:00–8:00 | 60 min | Task 8 | `feat/pdf-export` | Install `jspdf` + `html2canvas`. Build `ExportButton.tsx`. On click: (1) `html2canvas` captures `#brand-identity-card`, (2) `jsPDF` creates A4 PDF, (3) adds canvas image + text (name, tagline, colors), (4) triggers `doc.save('upstream-brand.pdf')` | PDF downloads on click with brand identity content |  — |
| 10 | H8:00–9:00 | 60 min | Task 9 | `feat/polish` | Add Tailwind `transition`, `animate-pulse` on loading, `hover:scale-105` on cards. Verify mobile breakpoints (`sm:`, `md:`, `lg:`). Add dark mode toggle (Tailwind `dark:` classes). Fix any layout overflow issues. Create a polished landing hero section | Production-quality UI |  — |
| 11 | H9:00–11:00 | 120 min | SYNC 2 | `feat/fixes` | Fix all bugs found in SYNC 2. Re-test full user flow in Chrome, Firefox, Edge. Verify PDF on all three browsers | Zero critical UI bugs |  — |
| 12 | H11:00–12:00 | 60 min | Task 11 | `main` | Support demo dry-runs, be ready to navigate the app live. Handle any last-minute UI emergency | Smooth demo delivery |  — |

#### Mock Data Specification

**`src/mocks/mockBrands.ts`** — 12 brand objects:
```typescript
export const mockBrands: BrandResult[] = [
  { id: '1', name: 'Verdant', tagline: 'Grow without limits.', score: 94, vibes: ['Eco-Conscious', 'Modern'] },
  { id: '2', name: 'Nexflow', tagline: 'Work in motion.', score: 89, vibes: ['Modern', 'Bold'] },
  { id: '3', name: 'Lumio', tagline: 'Clarity for your team.', score: 87, vibes: ['Minimal', 'Trustworthy'] },
  // ... 9 more
];
```

**`src/mocks/mockVisualDirection.ts`**:
```typescript
export const mockVisualDirection = {
  colors: [{ hex: '#2D6A4F', label: 'Forest' }, { hex: '#74C69D', label: 'Sage' }, { hex: '#F4F4F0', label: 'Linen' }],
  fonts: { heading: 'Fraunces', body: 'Inter' },
  adjectives: ['Grounded', 'Fresh', 'Reliable'],
};
```

---

### Role 3 – AI / API Engineer

> **Stack:** Node.js + TypeScript + OpenAI SDK v4 + `node-cache`  
> **Principle:** Own all OpenAI interactions. Provide fully typed responses matching `packages/shared` types.

| # | Time | Duration | Dependency | Branch | Task | Deliverable |
|---|------|----------|------------|--------|------|-------------|
| 1 | H0:00–0:30 | 30 min | Role 1 push (H0:20) | `feat/server-setup` | `cd apps/server`, run `pnpm init`, install `express`, `openai`, `dotenv`, `typescript`, `ts-node-dev`, `@types/express`. Create `src/app.ts`, `src/server.ts`. Create `src/mocks/` folder with `mockBrandResponse.json` and `mockDomainResponse.json` | Server boots on `localhost:3001`; mock JSON files ready |
| 2 | H0:30–1:00 | 30 min | Task 1 | `feat/openai-service` | Install `openai` SDK. Create `src/services/openai.service.ts` with: (a) `createOpenAIClient()` factory using `process.env.OPENAI_API_KEY`, (b) skeleton `generateBrandIdentity()` function with TODO body, (c) skeleton `generateLogoConcepts()` function | OpenAI service file committed with proper typing |
| 3 | H1:00–2:30 | 90 min | Task 2 + Shared types | `feat/brand-generate` | Implement `POST /api/brand/generate`. System prompt: `"You are a world-class brand strategist and naming consultant."` User prompt: inject all 6 input fields. Use `response_format: { type: 'json_object' }`. GPT-4o must return: 12 brand names, each with tagline, 3 adjectives, color palette (5 hex codes), font pairing (heading + body), domain suffixes to try. Validate JSON shape against `BrandResult[]` type before responding | Endpoint returns structured JSON matching `BrandResult[]` |
| 4 | H2:30–3:30 | 60 min | Task 3 | `feat/domain-check` | Implement `POST /api/domain/check`. Input: `{ name: string, extensions: string[] }`. Logic: for each extension, generate a deterministic hash from `name+extension`, use `hash % 10 > 3` to simulate 70% availability. Add a 200ms artificial delay to simulate real DNS lookup. Return `DomainResult[]` | Endpoint returns availability data for all requested extensions |
| 5 | H3:30–5:00 | 90 min | Task 3 | `feat/logo-generation` | Implement `POST /api/brand/logos`. Step 1: Generate 4 DALL-E 3 prompts using GPT-4o (given brand name + visual direction). Step 2: Call `openai.images.generate()` for each prompt with `size: '1024x1024'`, `quality: 'standard'`. Step 3: Return `{ jobId, status: 'processing' }` immediately. Step 4: Store results in `node-cache` keyed by `jobId`. Implement `GET /api/brand/logos/:jobId` polling endpoint | Logo generation endpoint + polling endpoint both functional |
| 6 | H5:00–5:30 | 30 min | SYNC 1 | `main` | Merge all AI feature PRs. Participate in SYNC 1 verification. Confirm `POST /api/brand/generate` returns real GPT-4o data to Role 2 | Live data flowing to frontend |
| 7 | H5:30–7:00 | 90 min | SYNC 1 | `feat/caching-prompts` | (a) Add `node-cache` with TTL=3600s for brand generation results (cache key = `SHA256(JSON.stringify(input))`). (b) A/B test 3 prompt variants on real inputs, choose best. (c) Add `temperature: 0.8` for name creativity, `temperature: 0.3` for visual direction consistency | Cache hit ratio > 50% for repeated similar queries |
| 8 | H7:00–9:00 | 120 min | Task 7 | `feat/hardening` | (a) Add `express-rate-limit` (20 req/min per IP for generate, 60 req/min for domain check). (b) Wrap all OpenAI calls in try/catch, return structured errors `{ error: string, code: string }`. (c) Add `maxTokens: 4000` guard to prevent runaway costs. (d) Log all API call costs to console (`promptTokens × $0.000005 + completionTokens × $0.000015`) | Zero unhandled promise rejections; cost logging active |
| 9 | H9:00–12:00 | 180 min | SYNC 2 | `feat/demo-support` | Fix edge cases found in SYNC 2 (empty results, GPT formatting errors). Pre-generate and cache 3 demo brand identities for demo safety. Monitor OpenAI dashboard during demo | Demo runs without live API failures |

---

### Role 4 – Backend / DB Engineer

> **Stack:** Node.js + Express + TypeScript + Firebase Admin SDK (Firestore)  
> **Principle:** Own the Express app shell, middleware, and all Firestore operations. Role 3 fills in the AI controller logic.

| # | Time | Duration | Dependency | Branch | Task | Deliverable |
|---|------|----------|------------|--------|------|-------------|
| 1 | H0:00–0:45 | 45 min | Role 1 push (H0:20) | `feat/backend-setup` | (Coordinate with Role 3 on shared `apps/server`). Create `src/app.ts` (Express instance, JSON body parser), `src/server.ts` (`app.listen(3001)`), `package.json`, `tsconfig.json` (extends `../../tsconfig.base.json`), `nodemon.json`. Add `GET /api/health` → `{ status: 'ok', timestamp }` | Server runs, `/api/health` returns 200 |
| 2 | H0:45–1:30 | 45 min | Task 1 | `feat/middleware` | Install + configure: `cors` (allow `localhost:5173` + Vercel domain), `helmet` (security headers), `express-rate-limit` (100 req/15min global), `morgan` (HTTP request logging), custom async error handler middleware `src/middleware/errorHandler.ts` (catches thrown errors, returns `{ error, code, statusCode }`) | All middleware active; error handler tested with intentional throw |
| 3 | H1:30–2:00 | 30 min | Task 2 | `feat/firebase` | Create `src/services/firebase.service.ts`. Install `firebase-admin`. Initialize with service account from `process.env.FIREBASE_SERVICE_ACCOUNT` (JSON string). Export `db = admin.firestore()`. Create Firestore collections plan: `brands` (generated results), `projects` (saved user projects) | Firebase connection verified with a test write/read |
| 4 | H2:00–3:00 | 60 min | Task 3 + Shared types | `feat/route-stubs` | Create route files: `src/routes/brand.routes.ts`, `src/routes/domain.routes.ts`, `src/routes/project.routes.ts`. Create controller stubs: `src/controllers/brand.controller.ts`, `src/controllers/domain.controller.ts`, `src/controllers/project.controller.ts`. Each stub returns `{ status: 'stub', message: 'Not implemented' }`. Register all routes in `app.ts` | All route stubs registered and returning 200; Role 3 can now fill in controller bodies |
| 5 | H3:00–4:00 | 60 min | Task 4 | `feat/brand-save` | Implement `POST /api/brand/save` controller: (a) Receive `{ brandInput: BrandInput, brandResult: BrandResult, selectedName: string }`, (b) Validate required fields, (c) Write document to Firestore `brands` collection with `{ ...payload, createdAt: Timestamp.now(), id: auto }`, (d) Return `{ projectId: doc.id }` | Brand data persists to Firestore; projectId returned |
| 6 | H4:00–5:00 | 60 min | Task 5 | `feat/project-retrieve` | Implement `GET /api/projects/:id` controller: (a) Validate `:id` is non-empty string, (b) `db.collection('brands').doc(id).get()`, (c) If not found → `404 { error: 'Project not found' }`, (d) Return full document data as `{ project: BrandResult }` | Saved projects retrievable by ID |
| 7 | H5:00–5:30 | 30 min | SYNC 1 | `main` | Merge all backend PRs into `main`. Participate in SYNC 1 verification. Confirm Firestore reads/writes work end-to-end | Backend endpoints all return real data |
| 8 | H5:30–7:00 | 90 min | Task 7 | `feat/validation` | Add `express-validator` to all routes: (a) `POST /api/brand/generate` — validate `description` (string, 10–500 chars), `industry` (enum), `targetAudience` (string, 5–200 chars). (b) `POST /api/brand/save` — validate all required fields non-empty. (c) `GET /api/projects/:id` — validate `id` is alphanumeric. Return `422 { errors: ValidationError[] }` on failure | All endpoints reject malformed input with clear error messages |
| 9 | H7:00–9:00 | 120 min | Task 8 | `feat/hardening` | (a) Load test with `autocannon` — confirm 50 req/sec sustained on `POST /api/brand/generate` without memory leak. (b) Test all error scenarios: missing env vars, Firestore timeout, invalid JSON body. (c) Add Firestore `.withConverter()` typed converter for `BrandResult` | No memory leaks; all error scenarios handled gracefully |
| 10 | H9:00–12:00 | 180 min | SYNC 2 | — | Deploy support: monitor Render logs, restart dyno if needed. Support team with any CORS or auth errors. Keep Firestore usage under free tier limits (50k reads/20k writes/day) | Stable production deployment throughout demo |

---

## Parallel Work Strategy

### The Decoupling Contract

The key to moving fast in parallel is ensuring **Role 2 never waits for Roles 3 or 4**. The contract is:

1. **Role 1** establishes the `packages/shared` type definitions by H1:30. These are the single source of truth.
2. **Role 2** imports types from `packages/shared` and builds against mock data that conforms exactly to those types.
3. **Roles 3 and 4** build real API implementations that return data matching those exact same types.
4. At **SYNC 1 (H5:00)**, Role 2 does a targeted swap: replace `import mockBrands from '../mocks/mockBrands'` with an Axios call. No component refactoring needed.

| Component | Uses Mock Until | Real API Replaces Mock At | API Owner |
|-----------|-----------------|--------------------------|-----------|
| `BrandResultsGrid` | Hour 5:00 | `POST /api/brand/generate` | Role 3 |
| `DomainBadge` | Hour 5:00 | `POST /api/domain/check` | Role 3 |
| `LogoGallery` | Hour 5:00 | `POST /api/brand/logos` (+ polling) | Role 3 |
| `BrandIdentityCard` (save button) | Hour 5:00 | `POST /api/brand/save` | Role 4 |
| Project history (stretch goal) | — | `GET /api/projects/:id` | Role 4 |

### Setup Order – First 30 Minutes is Sequential

```
H0:00 ─── Role 1: pnpm init + workspace scaffold ──────── (~20 min)
              │
H0:20 ──────►│── All others: branch off main ─────────────
              │        Role 2: `feat/ui-setup`
              │        Role 3: `feat/server-setup`
              │        Role 4: `feat/backend-setup`
```

**Role 1 must push the initial monorepo scaffold BEFORE others branch off `main`.** Estimated time: 20 minutes.

While waiting, Roles 2, 3, and 4 should:
- Set up their local Node version (`nvm use 20`)
- Review `packages/shared/src/types.ts` draft in the design doc
- Plan their first task in detail
- Set up their IDE (VS Code extensions: ESLint, Prettier, Tailwind IntelliSense)

---

## API Contracts

All requests must include header `Content-Type: application/json`.  
All error responses follow: `{ "error": "Human-readable message", "code": "MACHINE_CODE", "statusCode": 4xx }`.

---

### 1. `POST /api/brand/generate`

**Owner:** Role 3 (AI/API Engineer)  
**Purpose:** Generate 12 brand name candidates with full visual identity for each.

#### Request Body

```typescript
interface BrandGenerateRequest {
  description: string;        // 10–500 chars. What the company does.
  industry: 'Tech' | 'Health' | 'Finance' | 'Retail' | 'Other';
  targetAudience: string;     // 5–200 chars. Who it's for.
  vibes: Array<'Modern' | 'Minimal' | 'Bold' | 'Playful' | 'Trustworthy' | 'Eco-Conscious'>;
  competitors?: string;       // Optional. Comma-separated competitor names.
  domainExtensions: Array<'.com' | '.io' | '.co'>; // At least one required.
}
```

#### Response Body

```typescript
interface BrandGenerateResponse {
  brands: BrandResult[];
  generatedAt: string; // ISO 8601
  cached: boolean;     // true if response served from cache
}

interface BrandResult {
  id: string;
  name: string;           // e.g. "Verdant"
  tagline: string;        // e.g. "Grow without limits."
  score: number;          // 1–100 relevance score (GPT-generated)
  adjectives: string[];   // 3 brand personality adjectives
  colors: ColorSwatch[];
  fonts: { heading: string; body: string };
  vibes: string[];
}

interface ColorSwatch {
  hex: string;   // e.g. "#2D6A4F"
  label: string; // e.g. "Forest"
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
}
```

#### Example Request

```json
{
  "description": "Sustainable productivity app for remote teams focused on deep work and environmental accountability",
  "industry": "Tech",
  "targetAudience": "Remote professionals aged 25–40 who care about sustainability",
  "vibes": ["Eco-Conscious", "Modern", "Trustworthy"],
  "competitors": "Notion, Asana",
  "domainExtensions": [".com", ".io"]
}
```

#### Example Response

```json
{
  "brands": [
    {
      "id": "brand_01",
      "name": "Verdant",
      "tagline": "Grow without limits.",
      "score": 94,
      "adjectives": ["Grounded", "Fresh", "Reliable"],
      "colors": [
        { "hex": "#2D6A4F", "label": "Forest", "role": "primary" },
        { "hex": "#74C69D", "label": "Sage", "role": "secondary" },
        { "hex": "#B7E4C7", "label": "Mint", "role": "accent" },
        { "hex": "#F4F4F0", "label": "Linen", "role": "background" },
        { "hex": "#1B1B1B", "label": "Obsidian", "role": "text" }
      ],
      "fonts": { "heading": "Fraunces", "body": "Inter" },
      "vibes": ["Eco-Conscious", "Modern"]
    }
  ],
  "generatedAt": "2025-09-19T02:00:00.000Z",
  "cached": false
}
```

---

### 2. `POST /api/brand/logos`

**Owner:** Role 3 (AI/API Engineer)  
**Purpose:** Generate 4 logo concepts via DALL-E 3. Returns immediately with a `jobId` for polling.

#### Request Body

```typescript
interface BrandLogosRequest {
  brandName: string;      // e.g. "Verdant"
  tagline: string;
  colors: ColorSwatch[];
  style: 'Minimal' | 'Bold' | 'Playful' | 'Corporate';
}
```

#### Response Body (Initial – 202 Accepted)

```typescript
interface BrandLogosInitResponse {
  jobId: string;          // UUID
  status: 'processing';
  estimatedSeconds: number; // Typically 30–60
}
```

#### Polling: `GET /api/brand/logos/:jobId`

```typescript
interface BrandLogosStatusResponse {
  jobId: string;
  status: 'processing' | 'complete' | 'failed';
  logos?: LogoResult[];   // Present only when status === 'complete'
  error?: string;         // Present only when status === 'failed'
}

interface LogoResult {
  id: string;
  url: string;      // DALL-E 3 image URL (valid for 1 hour)
  prompt: string;   // The DALL-E prompt used
  style: string;
}
```

#### Example Request

```json
{
  "brandName": "Verdant",
  "tagline": "Grow without limits.",
  "colors": [{ "hex": "#2D6A4F", "label": "Forest", "role": "primary" }],
  "style": "Minimal"
}
```

#### Example Response (202 Accepted)

```json
{
  "jobId": "job_abc123xyz",
  "status": "processing",
  "estimatedSeconds": 45
}
```

#### Example Polling Response (when complete)

```json
{
  "jobId": "job_abc123xyz",
  "status": "complete",
  "logos": [
    {
      "id": "logo_01",
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "prompt": "Minimal logo for 'Verdant', a sustainable productivity app. Forest green (#2D6A4F) on white. Simple leaf-and-checkmark motif. SVG style. No text.",
      "style": "Minimal"
    }
  ]
}
```

---

### 3. `POST /api/domain/check`

**Owner:** Role 3 (AI/API Engineer)  
**Purpose:** Check domain availability for a brand name across requested extensions.

#### Request Body

```typescript
interface DomainCheckRequest {
  name: string;              // e.g. "Verdant"
  extensions: Array<'.com' | '.io' | '.co'>;
}
```

#### Response Body

```typescript
interface DomainCheckResponse {
  results: DomainResult[];
}

interface DomainResult {
  domain: string;       // e.g. "verdant.com"
  available: boolean;
  registrar?: string;   // e.g. "GoDaddy" — only when available === false
  price?: string;       // e.g. "$12/yr" — only when available === true
}
```

#### Example Request

```json
{
  "name": "Verdant",
  "extensions": [".com", ".io", ".co"]
}
```

#### Example Response

```json
{
  "results": [
    { "domain": "verdant.com", "available": false, "registrar": "Namecheap" },
    { "domain": "verdant.io", "available": true, "price": "$29/yr" },
    { "domain": "verdant.co", "available": true, "price": "$12/yr" }
  ]
}
```

---

### 4. `POST /api/brand/save`

**Owner:** Role 4 (Backend/DB Engineer)  
**Purpose:** Persist a completed brand identity to Firestore and return a shareable project ID.

#### Request Body

```typescript
interface BrandSaveRequest {
  brandInput: BrandGenerateRequest; // Original user input
  brandResult: BrandResult;         // The selected brand
  selectedName: string;             // Must match brandResult.name
  logos?: LogoResult[];             // Optional: selected logo concepts
}
```

#### Response Body

```typescript
interface BrandSaveResponse {
  projectId: string;   // Firestore document ID
  shareUrl: string;    // e.g. "https://upstream.vercel.app/project/abc123"
  savedAt: string;     // ISO 8601
}
```

#### Example Request

```json
{
  "brandInput": { "description": "Sustainable productivity app...", "industry": "Tech", "targetAudience": "Remote professionals", "vibes": ["Eco-Conscious"], "domainExtensions": [".com"] },
  "brandResult": { "id": "brand_01", "name": "Verdant", "tagline": "Grow without limits.", "score": 94, "adjectives": ["Grounded"], "colors": [], "fonts": { "heading": "Fraunces", "body": "Inter" }, "vibes": ["Eco-Conscious"] },
  "selectedName": "Verdant"
}
```

#### Example Response

```json
{
  "projectId": "Kj9mNpQr4vWxYz",
  "shareUrl": "https://upstream.vercel.app/project/Kj9mNpQr4vWxYz",
  "savedAt": "2025-09-19T07:45:00.000Z"
}
```

---

### 5. `GET /api/projects/:id`

**Owner:** Role 4 (Backend/DB Engineer)  
**Purpose:** Retrieve a previously saved brand identity project by ID.

#### URL Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | Firestore document ID returned by `POST /api/brand/save` |

#### Response Body

```typescript
interface ProjectRetrieveResponse {
  project: {
    id: string;
    brandInput: BrandGenerateRequest;
    brandResult: BrandResult;
    selectedName: string;
    logos?: LogoResult[];
    savedAt: string; // ISO 8601
  }
}
```

#### Example Response

```json
{
  "project": {
    "id": "Kj9mNpQr4vWxYz",
    "brandInput": { "description": "Sustainable productivity app...", "industry": "Tech" },
    "brandResult": { "name": "Verdant", "tagline": "Grow without limits.", "score": 94 },
    "selectedName": "Verdant",
    "savedAt": "2025-09-19T07:45:00.000Z"
  }
}
```

#### Error Response (404)

```json
{
  "error": "Project not found",
  "code": "PROJECT_NOT_FOUND",
  "statusCode": 404
}
```

---

## Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| 1 | **DALL-E 3 too slow or expensive during demo** | High | High | Pre-generate 4 logo sets for the demo brand ('Verdant') at H9:00 and cache them. During demo, serve from cache. Have placeholder images as final fallback. |
| 2 | **Large merge conflict at SYNC 1** | Medium | High | Role 1 must enforce that `apps/client` and `apps/server` directories are strictly separated. Each role works in their own directory. Conflicts should only occur in `packages/shared`. Role 1 resolves all conflicts immediately. |
| 3 | **Firebase Firestore quota exhaustion** | Low | Medium | Monitor usage in Firebase console at H6, H9, H11. If approaching limits, switch `POST /api/brand/save` to in-memory storage (Map) with no code changes to controllers. The service layer absorbs the swap. |
| 4 | **OpenAI rate limits (429 errors)** | Medium | High | Add `node-cache` caching at H5:30 (identical inputs return cached results). Add retry with exponential backoff (1s, 2s, 4s). Pre-generate demo results and cache them by H9:00. |
| 5 | **PDF export broken in Safari / Firefox** | Medium | Medium | Test PDF export in all three browsers by H9:00. If `html2canvas` fails in Safari, use `@react-pdf/renderer` as backup (already in package.json as optional dep). Do demo in Chrome if needed. |
| 6 | **Demo venue internet is slow or unreliable** | Medium | High | At H11:00, Role 1 creates a mobile hotspot backup. Role 3 pre-warms OpenAI cache with demo inputs. Keep all demo assets (logo images, PDF) pre-downloaded locally as emergency fallback. |
| 7 | **Team member blocked waiting for another** | Medium | Medium | The mock data contract (Parallel Work Strategy section) eliminates most blocking. If a role finishes early, they pick up GitHub Issues labeled `stretch-goal`. Role 1 monitors blockers proactively via check-ins at H2 and H4. |
| 8 | **OpenAI API key invalid or quota exceeded** | Low | Critical | Test the API key at H0:00 before any work begins. Add a `GET /api/ai/ping` diagnostic endpoint that calls GPT-3.5-turbo with a 5-token prompt. Keep a backup key from a second team member's account. |
| 9 | **Vite build fails at deployment** | Low | High | Role 1 tests `pnpm build` locally at H5:00 before deploying. Vercel build logs checked immediately after deploy trigger. Common fix: add `"build": "vite build"` to `apps/client/package.json` root. |
| 10 | **TypeScript type mismatch between frontend and backend** | Medium | Medium | Shared types in `packages/shared` are the single source of truth. Both `apps/client` and `apps/server` import from `@upstream/shared`. Any type changes go through a PR that both Role 2 and Role 3 must approve. |

---

## Integration Checkpoints

### 🔴 SYNC 1 – Hour 5:00 (30 minutes)

**Location:** All 4 team members gather (in-person or video call).  
**Goal:** Merge everything, verify the core loop works end-to-end.

#### Pre-Merge Checklist (Role 1 verifies before calling SYNC)
- [ ] `feat/brand-input-form` PR merged
- [ ] `feat/results-grid` PR merged
- [ ] `feat/visual-direction` PR merged
- [ ] `feat/logo-gallery` PR merged
- [ ] `feat/server-setup` PR merged
- [ ] `feat/brand-generate` PR merged
- [ ] `feat/domain-check` PR merged
- [ ] `feat/backend-setup` PR merged
- [ ] `feat/middleware` PR merged
- [ ] `feat/firebase` PR merged
- [ ] `feat/route-stubs` PR merged
- [ ] `feat/brand-save` PR merged

#### SYNC 1 Success Criteria
- [ ] `pnpm install && pnpm build` succeeds at monorepo root with zero errors
- [ ] `POST /api/brand/generate` with a real payload returns 12 `BrandResult` objects
- [ ] `POST /api/domain/check` returns domain availability results
- [ ] Frontend `BrandResultsGrid` displays real data (not mock) after form submit
- [ ] At least ONE complete user path works: fill form → see real brand names → click a name → see domain results
- [ ] All 4 team members can `git pull main` and run both apps locally with no setup errors
- [ ] No TypeScript compilation errors in either `apps/client` or `apps/server`
- [ ] `POST /api/brand/save` writes a document to Firestore and returns `projectId`

#### SYNC 1 Handoff Notes (Role 1 documents during SYNC)
After SYNC 1, Role 1 posts in team channel:
```
✅ SYNC 1 COMPLETE – H5:30
Staging: [Role 1 fills in URLs after deploy]
Working: [list what's verified]
Blocked: [list any known issues]
Next focus per role: [Role 2: API wiring | Role 3: Caching | Role 4: Validation]
```

---

### 🔴 SYNC 2 – Hour 9:00 (30 minutes)

**Location:** All 4 team members gather.  
**Goal:** Full end-to-end test on staging. Identify and triage final bugs. Lock demo script.

#### SYNC 2 Success Criteria
- [ ] Full user flow works on staging URL (not localhost): form → generate → results → visual panel → logo generation → export
- [ ] PDF export generates correctly and is readable in Chrome
- [ ] Logo generation returns 4 concepts within 90 seconds (or cached set is ready)
- [ ] `POST /api/brand/save` works on staging; `GET /api/projects/:id` retrieves saved project
- [ ] All 4 team members have reviewed and can narrate the demo script
- [ ] Staging Vercel URL confirmed and shareable
- [ ] Render backend URL confirmed, `/api/health` returns 200
- [ ] No console errors in browser during normal demo flow
- [ ] Demo brand inputs pre-filled and tested: "Verdant / sustainable productivity / eco-conscious"
- [ ] Emergency fallback plan confirmed (cached logos + pre-downloaded PDF)

#### SYNC 2 Bug Triage Protocol
After SYNC 2, any discovered bugs are categorized:
- 🔴 **CRITICAL** (breaks demo): Fix immediately, done by H10:30
- 🟡 **MAJOR** (visible but workaround exists): Fix if time allows by H11:00
- 🟢 **MINOR** (cosmetic): Skip, note in README as known issue

---

## Demo Script (2 Minutes)

> **Presenter:** Role 2 (drives the UI) + Role 1 (narrates)  
> **Pre-Demo Setup:** Open `https://upstream.vercel.app` in Chrome, form pre-cleared, DevTools closed.

| Step | Action | What Audience Sees | Talking Point |
|------|--------|--------------------|---------------|
| **1** | Open the app | Clean landing page with Upstream logo and hero headline | *"This is Upstream — from business idea to full brand identity in under 2 minutes."* |
| **2** | Click "Start Building Your Brand" | `BrandInputForm` slides in with 6 fields | *"Upstream needs just 6 inputs. No design experience required."* |
| **3** | Fill in the form: Description: *"sustainable productivity app for remote teams"*, Industry: *Tech*, Audience: *"remote professionals who care about the environment"*, Vibes: *Eco-Conscious + Modern + Trustworthy*, Competitors: *Notion*, Extensions: *.com .io* | Form fills with realistic data | *"We're telling Upstream our vision, our audience, and our vibe."* |
| **4** | Click **"Generate Brand Identity"** | `LoadingSpinner` with animated progress ("Consulting GPT-4o...") | *"Upstream is now running this through GPT-4o with a custom brand strategy prompt."* |
| **5** | Loading resolves (~3–5s) | `BrandResultsGrid` shows 12 name cards with taglines and scores | *"Twelve brand name candidates, each scored for fit, with taglines generated in one shot."* |
| **6** | Click on the card **"Verdant"** | `VisualDirectionPanel` expands on the right with color palette, fonts, adjectives | *"Every name comes with a complete visual direction — color palette, typography, brand personality."* |
| **7** | Point to `DomainBadge` components | Green ✓ `verdant.io` and `verdant.co`, red ✗ `verdant.com` | *"Domain availability checked in real time. verdant.io is open at \$29/yr."* |
| **8** | Click **"Generate Logo Concepts"** | `LoadingSpinner` with label "Generating with DALL-E 3... (~30s)" | *"Now we're calling DALL-E 3 to create logo concepts based on the visual direction."* |
| **9** | Logos appear (~30s) | `LogoGallery` 2×2 grid with 4 distinct logo concepts | *"Four unique logo directions — all on-brand, all generated from the same identity system."* |
| **10** | Click the top-left logo to select it | Selected logo highlighted with ring | *"You pick your favorite. The whole system stays coherent."* |
| **11** | Click **"Export Brand Identity"** | Browser shows PDF download progress | *"One click — full brand identity package downloads as a PDF."* |
| **12** | Show the downloaded PDF | PDF with name, tagline, color swatches, font specimens, logo | *"Name. Tagline. Color palette. Typography. Logo. Everything a designer needs to move forward."* |
| **Close** | — | — | *"From idea to brand identity in under 2 minutes. That's Upstream."* |

> **Timing target:** Steps 1–12 should complete in ≤ 2 minutes. Practice this 3× before the actual demo.  
> **Emergency fallback:** If live API is slow, Role 3 has pre-cached "Verdant" results. Role 2 knows the keyboard shortcut to load cached data (`Ctrl+Shift+D` triggers demo mode in the store).

---

## Environment Variables Reference

All required across the project. Role 1 must populate `.env.example` at H0:30.

| Variable | Used By | Description | Where to Get |
|----------|---------|-------------|--------------|
| `OPENAI_API_KEY` | `apps/server` | OpenAI API key | platform.openai.com |
| `FIREBASE_SERVICE_ACCOUNT` | `apps/server` | Firebase Admin SDK JSON (stringified) | Firebase Console → Project Settings → Service Accounts |
| `FIREBASE_PROJECT_ID` | `apps/server` | Firebase project ID | Firebase Console |
| `VITE_API_URL` | `apps/client` | Backend base URL | `http://localhost:3001` (local), Render URL (prod) |
| `VITE_APP_ENV` | `apps/client` | `development` or `production` | Set manually |
| `PORT` | `apps/server` | Server port | `3001` (local), set by Render automatically |
| `NODE_ENV` | `apps/server` | `development` or `production` | Set by deployment platform |
| `ALLOWED_ORIGINS` | `apps/server` | CORS whitelist (comma-separated) | `http://localhost:5173,https://upstream.vercel.app` |

---

## Branch Naming Convention

```
main                          ← protected, always deployable
feat/ui-setup                 ← Role 2
feat/brand-input-form         ← Role 2
feat/results-grid             ← Role 2
feat/visual-direction         ← Role 2
feat/logo-gallery             ← Role 2
feat/api-wiring               ← Role 2
feat/pdf-export               ← Role 2
feat/polish                   ← Role 2
feat/server-setup             ← Role 3 + 4 (shared)
feat/openai-service           ← Role 3
feat/brand-generate           ← Role 3
feat/domain-check             ← Role 3
feat/logo-generation          ← Role 3
feat/caching-prompts          ← Role 3
feat/hardening                ← Role 3
feat/backend-setup            ← Role 4
feat/middleware               ← Role 4
feat/firebase                 ← Role 4
feat/route-stubs              ← Role 4
feat/brand-save               ← Role 4
feat/project-retrieve         ← Role 4
feat/validation               ← Role 4
feat/infra                    ← Role 1
fix/<description>             ← any role, bug fixes
```

---

## Commit Message Convention

```
feat(ui): add BrandResultsGrid with mock data
feat(ai): implement POST /api/brand/generate with GPT-4o
feat(db): add Firestore save for brand results
fix(ui): correct color swatch hex rendering
chore(infra): configure Vercel deployment for apps/client
```

---

*Document version: 1.0 | Created: H0:00 | Last updated: H0:00*  
*Owner: Role 1 (Git/Project Manager)*
