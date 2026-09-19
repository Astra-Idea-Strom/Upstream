# 01 – Project File Structure

## Overview

**Upstream** is an AI-powered Brand Identity & Naming Generator built as a monorepo using **pnpm workspaces**. The project is split into three packages: `apps/client` (React + TypeScript + Vite + Tailwind + Zustand), `apps/server` (Node.js + Express + TypeScript), and `packages/shared` (common TypeScript types consumed by both apps). The backend integrates with **OpenAI GPT-4o** for brand name, tagline, and visual direction generation, and with **DALL-E 3** for AI logo synthesis. Results are persisted in **Firebase Firestore**, exported as PDFs via **jsPDF + html2canvas**, and deployed on **Vercel** (frontend) + **Render** (backend).

---

## Complete Directory Tree

```
upstream/
├── .env.example
├── .gitignore
├── package.json                        ← root package.json (pnpm workspaces)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── README.md
│
├── apps/
│   ├── client/                         ← React + Vite + TypeScript frontend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── vite-env.d.ts
│   │       │
│   │       ├── components/
│   │       │   ├── ui/
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Card.tsx
│   │       │   │   ├── Badge.tsx
│   │       │   │   ├── ColorSwatch.tsx
│   │       │   │   ├── LoadingSpinner.tsx
│   │       │   │   └── index.ts
│   │       │   │
│   │       │   ├── forms/
│   │       │   │   ├── BrandInputForm.tsx
│   │       │   │   └── FormField.tsx
│   │       │   │
│   │       │   ├── brand/
│   │       │   │   ├── BrandNameCard.tsx
│   │       │   │   ├── BrandResultsGrid.tsx
│   │       │   │   ├── TaglineDisplay.tsx
│   │       │   │   ├── VisualDirectionPanel.tsx
│   │       │   │   ├── LogoGallery.tsx
│   │       │   │   ├── DomainBadge.tsx
│   │       │   │   └── BrandIdentityCard.tsx
│   │       │   │
│   │       │   └── layout/
│   │       │       ├── Header.tsx
│   │       │       ├── StepIndicator.tsx
│   │       │       └── PageWrapper.tsx
│   │       │
│   │       ├── pages/
│   │       │   ├── HomePage.tsx
│   │       │   ├── InputPage.tsx
│   │       │   ├── ResultsPage.tsx
│   │       │   ├── LogoPage.tsx
│   │       │   └── ExportPage.tsx
│   │       │
│   │       ├── hooks/
│   │       │   ├── useBrandGeneration.ts
│   │       │   ├── useLogoGeneration.ts
│   │       │   └── usePDFExport.ts
│   │       │
│   │       ├── store/
│   │       │   └── brandStore.ts
│   │       │
│   │       ├── services/
│   │       │   └── api.ts
│   │       │
│   │       └── utils/
│   │           ├── pdfExport.ts
│   │           └── colorUtils.ts
│   │
│   └── server/                         ← Node.js + Express + TypeScript backend
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env                        ← NOT committed; copy from root .env.example
│       └── src/
│           ├── index.ts                ← Entry point; Express app bootstrap
│           │
│           ├── routes/
│           │   ├── brand.routes.ts
│           │   ├── logo.routes.ts
│           │   └── domain.routes.ts
│           │
│           ├── controllers/
│           │   ├── brand.controller.ts
│           │   ├── logo.controller.ts
│           │   └── domain.controller.ts
│           │
│           ├── services/
│           │   ├── openai.service.ts
│           │   ├── dalle.service.ts
│           │   ├── domain.service.ts
│           │   └── firebase.service.ts
│           │
│           ├── middleware/
│           │   ├── errorHandler.ts
│           │   ├── rateLimiter.ts
│           │   └── validateRequest.ts
│           │
│           ├── config/
│           │   ├── firebase.ts
│           │   └── openai.ts
│           │
│           └── mock/
│               ├── brandNames.ts
│               ├── domains.ts
│               └── logos.ts
│
└── packages/
    └── shared/                         ← Shared TypeScript types (consumed by both apps)
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts
            └── types/
                ├── brand.types.ts
                ├── api.types.ts
                └── index.ts
```

---

## File & Folder Reference

### Root Level

| File / Folder | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `.env.example` | Template of all required environment variables; committed to git | 🟡 Backend (Role 4) | Hour 1 |
| `.gitignore` | Excludes `node_modules`, `.env`, `dist`, build artefacts | 🔵 PM (Role 1) | Hour 1 |
| `package.json` | Root workspace manifest; declares pnpm workspaces & shared dev scripts | 🔵 PM (Role 1) | Hour 1 |
| `pnpm-workspace.yaml` | Tells pnpm which directories are workspace packages | 🔵 PM (Role 1) | Hour 1 |
| `tsconfig.base.json` | Base TypeScript compiler options extended by all sub-packages | 🔴 AI/API (Role 3) | Hour 1 |
| `README.md` | Project overview, setup instructions, team roles, demo links | 🔵 PM (Role 1) | Hour 1 |

---

### `apps/client/` — React Frontend

#### Config & Setup

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `package.json` | Client package manifest; lists React, Vite, Tailwind, Zustand, jsPDF deps | 🟢 UI/UX (Role 2) | Hour 1 |
| `tsconfig.json` | Extends `tsconfig.base.json`; enables JSX & path aliases | 🟢 UI/UX (Role 2) | Hour 1 |
| `tsconfig.node.json` | TypeScript config for Vite's node environment (vite.config.ts) | 🟢 UI/UX (Role 2) | Hour 1 |
| `vite.config.ts` | Vite bundler config; defines `@/` alias, proxy to `localhost:3001` | 🟢 UI/UX (Role 2) | Hour 1 |
| `tailwind.config.ts` | Tailwind content paths, custom color palette, font families | 🟢 UI/UX (Role 2) | Hour 1 |
| `postcss.config.js` | PostCSS plugins (tailwindcss, autoprefixer) | 🟢 UI/UX (Role 2) | Hour 1 |
| `index.html` | HTML shell; mounts `#root` div, sets meta tags & favicon | 🟢 UI/UX (Role 2) | Hour 1 |

#### `src/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `main.tsx` | React DOM render entry; wraps `<App>` with React Router `<BrowserRouter>` | 🟢 UI/UX (Role 2) | Hour 1 |
| `App.tsx` | Top-level router; maps routes to page components | 🟢 UI/UX (Role 2) | Hour 1 |
| `vite-env.d.ts` | Vite client type declarations (auto-generated) | 🟢 UI/UX (Role 2) | Hour 1 |

#### `src/components/ui/` — Primitive Design-System Components

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `Button.tsx` | Reusable button with variants (primary, secondary, ghost, danger) and loading state | 🟢 UI/UX (Role 2) | Hour 2 |
| `Card.tsx` | Wrapper card with optional hover elevation and padding variants | 🟢 UI/UX (Role 2) | Hour 2 |
| `Badge.tsx` | Small pill/tag component; used for domain availability status labels | 🟢 UI/UX (Role 2) | Hour 2 |
| `ColorSwatch.tsx` | Displays a palette colour circle with hex label; used in VisualDirectionPanel | 🟢 UI/UX (Role 2) | Hour 3 |
| `LoadingSpinner.tsx` | Animated SVG spinner shown during API calls | 🟢 UI/UX (Role 2) | Hour 2 |
| `index.ts` | Barrel export for all ui/ components | 🟢 UI/UX (Role 2) | Hour 2 |

#### `src/components/forms/` — Input Form Components

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `BrandInputForm.tsx` | Main multi-field form: industry, keywords, tone, audience; submits to brandStore | 🟢 UI/UX (Role 2) | Hour 2 |
| `FormField.tsx` | Generic labelled input/textarea/select wrapper with validation error display | 🟢 UI/UX (Role 2) | Hour 2 |

#### `src/components/brand/` — Brand Results Display Components

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `BrandNameCard.tsx` | Card showing a single generated brand name with score, meaning, select button | 🟢 UI/UX (Role 2) | Hour 3 |
| `BrandResultsGrid.tsx` | Responsive grid rendering multiple `BrandNameCard` components | 🟢 UI/UX (Role 2) | Hour 3 |
| `TaglineDisplay.tsx` | Displays AI-generated taglines with copy-to-clipboard action | 🟢 UI/UX (Role 2) | Hour 3 |
| `VisualDirectionPanel.tsx` | Shows suggested brand colours (`ColorSwatch`), fonts, mood board keywords | 🟢 UI/UX (Role 2) | Hour 4 |
| `LogoGallery.tsx` | Displays DALL-E 3 generated logo images in a masonry/grid layout | 🟢 UI/UX (Role 2) | Hour 5 |
| `DomainBadge.tsx` | Per-domain row showing TLD, availability status, registrar link | 🟢 UI/UX (Role 2) | Hour 4 |
| `BrandIdentityCard.tsx` | Consolidated card combining name, tagline, palette & domain for PDF/export view | 🟢 UI/UX (Role 2) | Hour 5 |

#### `src/components/layout/` — Page Shell Components

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `Header.tsx` | Top navigation bar; logo, step links, GitHub/demo badge | 🟢 UI/UX (Role 2) | Hour 2 |
| `StepIndicator.tsx` | Horizontal numbered stepper (Input → Results → Logo → Export) | 🟢 UI/UX (Role 2) | Hour 2 |
| `PageWrapper.tsx` | Common max-width container with top/bottom padding applied to every page | 🟢 UI/UX (Role 2) | Hour 2 |

#### `src/pages/` — Route-Level Page Components

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `HomePage.tsx` | Landing page: hero headline, CTA "Generate My Brand" button, feature highlights | 🟢 UI/UX (Role 2) | Hour 2 |
| `InputPage.tsx` | Renders `BrandInputForm`; triggers `useBrandGeneration` on submit | 🟢 UI/UX (Role 2) | Hour 2 |
| `ResultsPage.tsx` | Shows `BrandResultsGrid`, `TaglineDisplay`, `VisualDirectionPanel`, `DomainBadge` | 🟢 UI/UX (Role 2) | Hour 3 |
| `LogoPage.tsx` | Triggers logo generation, renders `LogoGallery`, lets user select a logo | 🟢 UI/UX (Role 2) | Hour 5 |
| `ExportPage.tsx` | Renders `BrandIdentityCard` in export layout; "Download PDF" button | 🟢 UI/UX (Role 2) | Hour 6 |

#### `src/hooks/` — Custom React Hooks

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `useBrandGeneration.ts` | Calls `api.ts → POST /api/brand/generate`; updates brandStore with names, taglines, palette | 🔴 AI/API (Role 3) | Hour 3 |
| `useLogoGeneration.ts` | Calls `api.ts → POST /api/logo/generate`; stores DALL-E URLs in brandStore | 🔴 AI/API (Role 3) | Hour 5 |
| `usePDFExport.ts` | Uses `html2canvas` to snapshot `BrandIdentityCard` then `jsPDF` to bundle & download | 🟢 UI/UX (Role 2) | Hour 6 |

#### `src/store/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `brandStore.ts` | Zustand global store: holds form inputs, generated brand names, selected name, taglines, palette, logo URLs, loading/error states | 🔴 AI/API (Role 3) | Hour 2 |

#### `src/services/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `api.ts` | Axios (or fetch) wrapper; base URL from env; typed request/response functions for `/brand`, `/logo`, `/domain` endpoints | 🔴 AI/API (Role 3) | Hour 2 |

#### `src/utils/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `pdfExport.ts` | Utility functions: `captureElement(el)` → base64 image, `buildPDF(images, brandData)` → jsPDF document | 🟢 UI/UX (Role 2) | Hour 6 |
| `colorUtils.ts` | Helpers: `hexToRgb`, `getContrastColor`, `generatePaletteCSS`; used by VisualDirectionPanel | 🟢 UI/UX (Role 2) | Hour 4 |

---

### `apps/server/` — Express Backend

#### Config & Setup

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `package.json` | Server manifest; lists express, openai, firebase-admin, zod, cors deps | 🟡 Backend (Role 4) | Hour 1 |
| `tsconfig.json` | Extends base; targets `ESNext`, `module: NodeNext`, outputs to `dist/` | 🟡 Backend (Role 4) | Hour 1 |
| `.env` | Actual secrets (never committed); copied from `.env.example` | 🟡 Backend (Role 4) | Hour 1 |

#### `src/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `index.ts` | App bootstrap: loads env, creates Express instance, registers middleware, mounts routers, starts HTTP server | 🟡 Backend (Role 4) | Hour 1 |

#### `src/routes/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `brand.routes.ts` | Mounts `POST /generate`, `GET /:sessionId` on `/api/brand`; applies `rateLimiter` + `validateRequest` middleware | 🟡 Backend (Role 4) | Hour 2 |
| `logo.routes.ts` | Mounts `POST /generate` on `/api/logo`; applies rate limiting | 🟡 Backend (Role 4) | Hour 4 |
| `domain.routes.ts` | Mounts `POST /check` on `/api/domain`; returns domain availability list | 🟡 Backend (Role 4) | Hour 3 |

#### `src/controllers/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `brand.controller.ts` | Handles brand generation request: validates body → calls `openai.service` → persists to Firestore → returns result | 🔴 AI/API (Role 3) | Hour 2 |
| `logo.controller.ts` | Receives brand name + style → calls `dalle.service` → returns image URLs | 🔴 AI/API (Role 3) | Hour 4 |
| `domain.controller.ts` | Receives brand names → calls `domain.service` for each TLD → returns availability map | 🟡 Backend (Role 4) | Hour 3 |

#### `src/services/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `openai.service.ts` | GPT-4o integration: `generateBrandNames(input)`, `generateTaglines(name, input)`, `generateVisualDirection(name, input)`; structured JSON output via function calling | 🔴 AI/API (Role 3) | Hour 2 |
| `dalle.service.ts` | DALL-E 3 integration: `generateLogos(brandName, style, count)`; returns array of image URLs; handles retries on rate limit | 🔴 AI/API (Role 3) | Hour 4 |
| `domain.service.ts` | Checks domain availability for `.com`, `.io`, `.co`, `.ai` TLDs; wraps RDAP API or mock fallback | 🟡 Backend (Role 4) | Hour 3 |
| `firebase.service.ts` | Firestore CRUD: `saveBrandSession(data)`, `getBrandSession(id)`, `updateSelectedBrand(id, name)` | 🟡 Backend (Role 4) | Hour 2 |

#### `src/middleware/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `errorHandler.ts` | Global Express error handler; formats errors as `{ success: false, error, code }` JSON | 🟡 Backend (Role 4) | Hour 1 |
| `rateLimiter.ts` | `express-rate-limit` instance; reads `RATE_LIMIT_WINDOW_MS` & `RATE_LIMIT_MAX_REQUESTS` from env | 🟡 Backend (Role 4) | Hour 1 |
| `validateRequest.ts` | Zod-based schema validation middleware factory; returns 422 with field errors on mismatch | 🟡 Backend (Role 4) | Hour 2 |

#### `src/config/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `firebase.ts` | Initialises Firebase Admin SDK with service account credentials from env; exports `db` (Firestore instance) | 🟡 Backend (Role 4) | Hour 1 |
| `openai.ts` | Creates and exports the `OpenAI` client instance using `OPENAI_API_KEY`; sets default model constants | 🔴 AI/API (Role 3) | Hour 1 |

#### `src/mock/`

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `brandNames.ts` | Hardcoded array of sample brand name objects; used as fallback when `NODE_ENV=development` and OpenAI is unavailable | 🔴 AI/API (Role 3) | Hour 1 |
| `domains.ts` | Static mock domain availability results; mirrors real API response shape | 🟡 Backend (Role 4) | Hour 1 |
| `logos.ts` | Static URLs to placeholder logo images; mirrors DALL-E response shape | 🔴 AI/API (Role 3) | Hour 1 |

---

### `packages/shared/` — Shared TypeScript Types

| File | Purpose | Owner Role | Created By (Hour) |
|---|---|---|---|
| `package.json` | Declares package as `@upstream/shared`; `exports` field points to compiled types | 🔵 PM (Role 1) | Hour 1 |
| `tsconfig.json` | Extends base config; `declarationOnly: true`; outputs `.d.ts` to `dist/` | 🔵 PM (Role 1) | Hour 1 |
| `src/index.ts` | Re-exports everything from `types/index.ts` | 🔵 PM (Role 1) | Hour 1 |
| `src/types/brand.types.ts` | Core domain types: `BrandInput`, `BrandName`, `BrandSession`, `VisualDirection`, `ColorPalette`, `LogoResult` | 🔵 PM (Role 1) | Hour 1 |
| `src/types/api.types.ts` | HTTP contract types: `GenerateBrandRequest`, `GenerateBrandResponse`, `GenerateLogoRequest`, `GenerateLogoResponse`, `DomainCheckRequest`, `DomainCheckResponse`, `ApiError` | 🔵 PM (Role 1) | Hour 1 |
| `src/types/index.ts` | Barrel export: `export * from './brand.types'; export * from './api.types';` | 🔵 PM (Role 1) | Hour 1 |

---

## .env.example Contents

```dotenv
# ─── OpenAI ───────────────────────────────────────────────────────────────────
OPENAI_API_KEY=sk-...

# ─── Firebase Admin SDK ───────────────────────────────────────────────────────
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# ─── Server ───────────────────────────────────────────────────────────────────
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ─── Rate Limiting ────────────────────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

---

## Root `package.json`

```json
{
  "name": "upstream",
  "version": "1.0.0",
  "private": true,
  "description": "AI Brand Identity & Naming Generator – Hackathon Monorepo",
  "scripts": {
    "dev": "pnpm --parallel -r run dev",
    "dev:client": "pnpm --filter @upstream/client run dev",
    "dev:server": "pnpm --filter @upstream/server run dev",
    "build": "pnpm -r run build",
    "build:client": "pnpm --filter @upstream/client run build",
    "build:server": "pnpm --filter @upstream/server run build",
    "build:shared": "pnpm --filter @upstream/shared run build",
    "lint": "pnpm -r run lint",
    "typecheck": "pnpm -r run typecheck",
    "clean": "pnpm -r exec rm -rf dist node_modules/.cache"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

---

## `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## `tsconfig.base.json`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "isolatedModules": true
  }
}
```

---

## `.gitignore`

```gitignore
# ─── Dependencies ─────────────────────────────────────────────────────────────
node_modules/
.pnp
.pnp.js

# ─── Build Outputs ────────────────────────────────────────────────────────────
dist/
build/
out/
*.tsbuildinfo

# ─── Environment & Secrets ────────────────────────────────────────────────────
.env
.env.local
.env.*.local
apps/server/.env

# ─── Logs ─────────────────────────────────────────────────────────────────────
logs/
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*

# ─── OS & Editor ─────────────────────────────────────────────────────────────
.DS_Store
Thumbs.db
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# ─── Testing ─────────────────────────────────────────────────────────────────
coverage/
.nyc_output/

# ─── Vite ─────────────────────────────────────────────────────────────────────
apps/client/dist/
apps/client/.vite/

# ─── Misc ─────────────────────────────────────────────────────────────────────
.turbo/
.cache/
tmp/
temp/
```

---

## Owner Role Legend

| Badge | Role | Responsibilities |
|---|---|---|
| 🔵 PM | Role 1 – Project Manager | Repo setup, documentation, workspace config, coordination |
| 🟢 UI/UX | Role 2 – Frontend / Design | All React components, pages, Tailwind styling, PDF export UX |
| 🔴 AI/API | Role 3 – AI Integration | OpenAI / DALL-E service wrappers, prompts, Zustand store, hooks |
| 🟡 Backend | Role 4 – Backend / Infra | Express routes, middleware, Firebase, domain checks, deployment |
