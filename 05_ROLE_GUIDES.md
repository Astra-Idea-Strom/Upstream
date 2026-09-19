# 05 – Role Guides

> **12-Hour Hackathon: Upstream — AI Brand Identity & Naming Generator**
>
> **Stack:** pnpm monorepo · React 18 + Vite + TypeScript + Tailwind + Zustand (client) · Node.js 20 + Express 4 + TypeScript (server) · Firebase Firestore · OpenAI GPT-4o + DALL-E 3 · jsPDF + html2canvas

---

> **HOW TO USE THIS DOCUMENT**
> Find your colour-coded role below. Read **only your section** — every section is fully self-contained.
>
> | Role | Colour | Focus |
> |------|--------|-------|
> | Role 1 | 🔵 Blue  | Git / Project Manager |
> | Role 2 | 🟢 Green | UI/UX Developer |
> | Role 3 | 🔴 Red   | AI / API Engineer |
> | Role 4 | 🟡 Yellow | Backend / Database Engineer |

---
---

# 🔵 ROLE 1 – Git / Project Manager

## Your Mission in One Line

Bootstrap the project, keep `main` clean, review PRs fast, and run the 3 integration syncs.

---

## Your Hour-by-Hour Plan

### H0:00 – 0:20 | Initialize Monorepo

Run these exact commands in your terminal:

```bash
# Create project structure
mkdir -p apps/client apps/server packages/shared

# Root package.json bootstrap
npm init -y

# Install pnpm globally if not already installed
npm install -g pnpm

# Initialize pnpm workspace
pnpm init
```

Create `pnpm-workspace.yaml` at the repo root:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Create root `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

Replace root `package.json` contents with:

```json
{
  "name": "upstream",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm --filter @upstream/client dev\" \"pnpm --filter @upstream/server dev\"",
    "build": "pnpm --filter @upstream/shared build && pnpm --filter @upstream/client build && pnpm --filter @upstream/server build",
    "typecheck": "pnpm -r typecheck",
    "clean": "pnpm -r exec rm -rf dist node_modules"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "typescript": "^5.3.0"
  }
}
```

Install root deps:

```bash
pnpm install
```

---

### H0:20 – 0:40 | Shared Types Skeleton

Create `packages/shared/package.json`:

```json
{
  "name": "@upstream/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

Create `packages/shared/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

Create `packages/shared/src/types/brand.types.ts` — copy the **full** contents from `04_SHARED_TYPES_AND_API_CONTRACTS.md` (brand types section).

Create `packages/shared/src/types/api.types.ts` — copy the **full** contents from `04_SHARED_TYPES_AND_API_CONTRACTS.md` (API contract types section).

Create `packages/shared/src/index.ts`:

```typescript
export * from './types/brand.types';
export * from './types/api.types';
```

---

### H0:40 – 1:00 | GitHub Setup

```bash
git init
git add .
git commit -m "chore(config): initialize pnpm monorepo with shared types"

# Create the repo on GitHub first, then:
git remote add origin https://github.com/YOUR_ORG/upstream.git
git branch -M main
git push -u origin main
```

On GitHub — configure branch protection for `main`:

1. Go to **Settings → Branches**
2. Click **Add branch protection rule**, pattern: `main`
3. ✅ **Require a pull request before merging**
4. Set **Required approvals**: `1`
5. ✅ **Dismiss stale pull request approvals when new commits are pushed**
6. ✅ **Do not allow bypassing the above settings**
7. Click **Save changes**

---

### H1:00 – 1:30 | Create Issues & Share Repo

Create all GitHub issues from `03_GIT_STRATEGY.md`.  
Share the repo link in your team chat immediately:

```
🚀 REPO IS READY!

Clone:   git clone <url>
Install: pnpm install
Dev:     pnpm dev

Shared types:  packages/shared/src/types/
Your branch:   dev/2-client (UI) | dev/3-ai (AI) | dev/4-backend (Backend)

Read 05_ROLE_GUIDES.md for your specific instructions!
```

Confirm every teammate can clone and `pnpm install` successfully before moving on.

---

### H1:30 – 5:00 | PR Management Mode

For **every sync PR** (`dev/4-backend`, `dev/3-ai`, `dev/2-client`):

1. Pull the branch locally:
   ```bash
   git fetch && git checkout dev/<role-branch>
   ```
2. Run the build — it **must** pass:
   ```bash
   pnpm install && pnpm build
   ```
3. Skim for obvious bugs or TypeScript errors.
4. **Approve → Squash and merge into main.** (⚠️ **DO NOT delete the branch** — it is persistent for the developer!)
5. Remind the developer to run `git pull origin main` on their branch after the merge.

---

### H5:00 – 5:30 | SYNC 1

Verify all core PRs are merged. Run a clean full build:

```bash
git pull origin main
pnpm install
pnpm build
# Green output = SYNC 1 done ✅
```

If anything fails, fix it before giving the team the all-clear.

---

### H5:30 – 8:00 | Deployment Setup

**Vercel — Frontend:**

1. [vercel.com](https://vercel.com) → **New Project** → Import GitHub repo
2. **Root Directory:** `apps/client`
3. **Build Command:** `pnpm build`
4. **Output Directory:** `dist`
5. **Environment variable:** `VITE_API_URL=<your-render-url>`
6. Deploy.

**Render — Backend:**

1. [render.com](https://render.com) → **New Web Service** → Connect GitHub repo
2. **Root Directory:** `apps/server`
3. **Build Command:** `pnpm install && pnpm build`
4. **Start Command:** `node dist/index.js`
5. Add **all** environment variables from `.env.example`:
   - `OPENAI_API_KEY`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `CLIENT_URL` (Vercel URL)
   - `PORT=3001`
6. Deploy.

---

### H9:00 – 9:30 | SYNC 2 — End-to-End Staging Test

Open the deployed Vercel URL and run through the full flow:

- [ ] Page loads without console errors
- [ ] Fill the brand input form and submit
- [ ] Brand name cards appear in the results grid
- [ ] Click a name card — visual direction panel expands
- [ ] Click **Generate Logo Concepts** — spinner appears, then 4 logos load
- [ ] Click a logo to select it
- [ ] Click **Export** — PDF downloads with correct content
- [ ] Verify PDF contains: name, tagline, palette, fonts, selected logo

If anything fails, file a bug and ping the responsible role immediately.

---

### H11:00 – 12:00 | Final Prep & Submission

```bash
# Update README with the live Vercel URL
# Stage and commit:
git add README.md
git commit -m "docs: add live demo URL to README"
git push origin main
```

- [ ] Open the live Vercel URL in fullscreen — this is your demo view
- [ ] Pre-load mock data so the demo starts from Step 2 (results already showing)
- [ ] Run through the demo script **twice** end-to-end
- [ ] Submit on the hackathon platform with the Vercel URL + GitHub link

---

## Files You Own

```
pnpm-workspace.yaml
tsconfig.base.json
package.json  (root)
packages/shared/package.json
packages/shared/tsconfig.json
packages/shared/src/index.ts
packages/shared/src/types/brand.types.ts
packages/shared/src/types/api.types.ts
.gitignore
.env.example
README.md
```

---
---

# 🟢 ROLE 2 – UI/UX Developer

## Your Mission in One Line

Build a beautiful, multi-step React app. Start with mock data, plug in real APIs at Hour 5.

---

## App Flow

```
Step 1: Input Form  →  Step 2: Results Grid  →  Step 3: Logo Gallery  →  Step 4: Export
```

Each step is a full-screen view controlled by `step` in Zustand store.

---

## Initial Setup

**Wait for Role 1 to push the initial commit**, then:

```bash
git checkout main && git pull
git checkout -b dev/2-client
git push -u origin dev/2-client
```

Scaffold the Vite app:

```bash
cd apps/client

# If the directory is empty, scaffold it:
pnpm create vite@latest . --template react-ts

# Install all dependencies in one shot:
pnpm add tailwindcss @tailwindcss/vite zustand react-router-dom axios jspdf html2canvas react-hot-toast
pnpm add -D @types/node

# Link shared package:
pnpm add @upstream/shared --workspace
```

Create `apps/client/package.json` (ensure these fields exist):

```json
{
  "name": "@upstream/client",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Hour-by-Hour Build Order

### H0:00 – 0:30 | Scaffold & Config

Create `apps/client/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

Create `apps/client/src/index.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-brand-primary: #2D6A4F;
    --color-brand-accent: #95D5B2;
    --color-brand-bg: #F8FAF8;
    --color-brand-text: #1B2421;
  }
  body {
    background-color: var(--color-brand-bg);
    color: var(--color-brand-text);
    font-family: 'Inter', sans-serif;
  }
}
```

Update `apps/client/index.html` — add Google Fonts in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
```

---

### H0:30 – 1:00 | State Store + API Client

Create `apps/client/src/store/brandStore.ts`:

```typescript
import { create } from 'zustand';
import type { BrandInput, BrandName, LogoConcept } from '@upstream/shared';

interface BrandStore {
  step: 1 | 2 | 3 | 4;
  input: BrandInput | null;
  projectId: string | null;
  brandNames: BrandName[];
  selectedName: BrandName | null;
  logoConcepts: LogoConcept[];
  selectedLogo: LogoConcept | null;
  isLoadingNames: boolean;
  isLoadingLogos: boolean;
  error: string | null;
  // Actions
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setInput: (input: BrandInput) => void;
  setProjectId: (id: string) => void;
  setBrandNames: (names: BrandName[]) => void;
  selectName: (name: BrandName) => void;
  setLogoConcepts: (logos: LogoConcept[]) => void;
  selectLogo: (logo: LogoConcept) => void;
  setLoadingNames: (v: boolean) => void;
  setLoadingLogos: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

const initialState = {
  step: 1 as const,
  input: null,
  projectId: null,
  brandNames: [],
  selectedName: null,
  logoConcepts: [],
  selectedLogo: null,
  isLoadingNames: false,
  isLoadingLogos: false,
  error: null,
};

export const useBrandStore = create<BrandStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setInput: (input) => set({ input }),
  setProjectId: (id) => set({ projectId: id }),
  setBrandNames: (names) => set({ brandNames: names }),
  selectName: (name) => set({ selectedName: name }),
  setLogoConcepts: (logos) => set({ logoConcepts: logos }),
  selectLogo: (logo) => set({ selectedLogo: logo }),
  setLoadingNames: (v) => set({ isLoadingNames: v }),
  setLoadingLogos: (v) => set({ isLoadingLogos: v }),
  setError: (e) => set({ error: e }),
  reset: () => set(initialState),
}));
```

Create `apps/client/src/services/api.ts`:

```typescript
import axios from 'axios';
import type {
  GenerateBrandRequest,
  GenerateBrandResponse,
  GenerateLogosRequest,
  GenerateLogosResponse,
  CheckDomainsRequest,
  CheckDomainsResponse,
} from '@upstream/shared';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60_000, // 60 s — AI calls can be slow
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Unknown error';
    return Promise.reject(new Error(message));
  }
);

export const brandApi = {
  generate: (data: GenerateBrandRequest) =>
    api.post<GenerateBrandResponse>('/brand/generate', data).then((r) => r.data),

  generateLogos: (data: GenerateLogosRequest) =>
    api.post<GenerateLogosResponse>('/brand/logos', data).then((r) => r.data),

  checkDomains: (data: CheckDomainsRequest) =>
    api.post<CheckDomainsResponse>('/domain/check', data).then((r) => r.data),
};
```

---

### H1:00 – 2:00 | BrandInputForm (Step 1)

Create `apps/client/src/mock/mockData.ts` — needed immediately so you can skip API while building:

```typescript
import type { BrandName, LogoConcept } from '@upstream/shared';

export const MOCK_BRAND_NAMES: BrandName[] = [
  {
    id: 'n1',
    name: 'Verdant',
    meaning: 'From Latin viridis — lush and green, evokes sustainable growth.',
    tagline: 'Where green teams thrive.',
    domainAvailability: {
      com: true, io: false, co: true,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#2D6A4F', name: 'Forest Green', role: 'primary' },
        { hex: '#95D5B2', name: 'Sage', role: 'secondary' },
        { hex: '#F7F3E9', name: 'Cream', role: 'background' },
        { hex: '#1B4332', name: 'Deep Forest', role: 'text' },
        { hex: '#D4A373', name: 'Warm Sand', role: 'accent' },
      ],
      fonts: { headline: 'Inter', body: 'Merriweather', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Modern and clean with warm natural accents. Trustworthy yet approachable.',
    },
  },
  {
    id: 'n2',
    name: 'Leafwise',
    meaning: 'Intelligent growth — leaves that are guided by knowledge.',
    tagline: 'Smart. Sustainable. Simple.',
    domainAvailability: {
      com: false, io: true, co: true,
      handle: { twitter: false, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#386641', name: 'Emerald', role: 'primary' },
        { hex: '#A7C4A0', name: 'Fern', role: 'secondary' },
        { hex: '#FAFDF7', name: 'White Smoke', role: 'background' },
        { hex: '#2D3A2E', name: 'Dark Canopy', role: 'text' },
        { hex: '#F2A65A', name: 'Amber', role: 'accent' },
      ],
      fonts: { headline: 'DM Sans', body: 'Source Serif 4', headlineWeight: '600', bodyWeight: '400' },
      styleDescription: 'Earthy and grounded — evokes a forest walk on a clear morning.',
    },
  },
  {
    id: 'n3',
    name: 'Terraq',
    meaning: 'Terra + Q — earthy intelligence with a sharp edge.',
    tagline: 'Ground your ambition.',
    domainAvailability: {
      com: true, io: true, co: false,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#6B4226', name: 'Terracotta', role: 'primary' },
        { hex: '#C89B7B', name: 'Sand', role: 'secondary' },
        { hex: '#F9F5F0', name: 'Linen', role: 'background' },
        { hex: '#2C1810', name: 'Espresso', role: 'text' },
        { hex: '#3D9970', name: 'Mint', role: 'accent' },
      ],
      fonts: { headline: 'Sora', body: 'Lora', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Warm, bold, and grounded — like clay shaped with purpose.',
    },
  },
  {
    id: 'n4',
    name: 'Driftwork',
    meaning: 'Flow through your work like water — effortless and adaptive.',
    tagline: 'Work in flow.',
    domainAvailability: {
      com: false, io: true, co: false,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#1D3557', name: 'Navy', role: 'primary' },
        { hex: '#457B9D', name: 'Steel Blue', role: 'secondary' },
        { hex: '#F0F4F8', name: 'Mist', role: 'background' },
        { hex: '#0D1B2A', name: 'Midnight', role: 'text' },
        { hex: '#E63946', name: 'Coral', role: 'accent' },
      ],
      fonts: { headline: 'Outfit', body: 'Noto Serif', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Clean, coastal, and calm — designed for deep focus.',
    },
  },
  {
    id: 'n5',
    name: 'Clearpath',
    meaning: 'Clarity of direction — removing obstacles between you and your goals.',
    tagline: 'See the way forward.',
    domainAvailability: {
      com: true, io: false, co: true,
      handle: { twitter: false, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#7B2D8B', name: 'Violet', role: 'primary' },
        { hex: '#C77DFF', name: 'Lavender', role: 'secondary' },
        { hex: '#FAF7FF', name: 'Ghost White', role: 'background' },
        { hex: '#1A0A2E', name: 'Deep Plum', role: 'text' },
        { hex: '#FFD166', name: 'Honey', role: 'accent' },
      ],
      fonts: { headline: 'Space Grotesk', body: 'Libre Baskerville', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Bold and visionary — built for people who think ahead.',
    },
  },
];

export const MOCK_LOGOS: LogoConcept[] = [
  { id: 'l1', url: 'https://picsum.photos/400/400?random=21', prompt: 'minimal geometric logo', style: 'minimal' },
  { id: 'l2', url: 'https://picsum.photos/400/400?random=22', prompt: 'abstract logo concept', style: 'geometric' },
  { id: 'l3', url: 'https://picsum.photos/400/400?random=23', prompt: 'wordmark logo design', style: 'wordmark' },
  { id: 'l4', url: 'https://picsum.photos/400/400?random=24', prompt: 'abstract brand mark', style: 'abstract' },
];
```

Create `apps/client/src/components/forms/BrandInputForm.tsx`:

```typescript
import { useState } from 'react';
import type { BrandInput } from '@upstream/shared';
import { useBrandStore } from '../../store/brandStore';

const TONES: BrandInput['tone'][] = [
  'playful', 'professional', 'minimalist', 'bold', 'tech-forward', 'luxurious',
];

export default function BrandInputForm() {
  const { setInput, setStep } = useBrandStore();
  const [form, setForm] = useState<Partial<BrandInput>>({ tone: 'professional' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.industry || !form.targetAudience || !form.mission || !form.tone) return;
    setInput(form as BrandInput);
    setStep(2); // Triggers useBrandGeneration hook in parent
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2D6A4F]">Build Your Brand</h1>
        <p className="text-gray-500 mt-1">Tell us about your business — we'll do the rest.</p>
      </div>

      {/* Industry */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Industry *</label>
        <input
          type="text"
          required
          placeholder="e.g. sustainable productivity, fintech, health & wellness"
          value={form.industry ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D6A4F] outline-none"
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Target Audience *</label>
        <input
          type="text"
          required
          placeholder="e.g. remote workers aged 25-40"
          value={form.targetAudience ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D6A4F] outline-none"
        />
      </div>

      {/* Mission / Values */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Mission / Values *</label>
        <textarea
          required
          rows={3}
          placeholder="e.g. make remote work feel connected and eco-conscious"
          value={form.mission ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D6A4F] outline-none resize-none"
        />
      </div>

      {/* Brand Tone */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Brand Tone *</label>
        <select
          value={form.tone}
          onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value as BrandInput['tone'] }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D6A4F] outline-none bg-white"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Constraints (optional) */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Constraints <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. must feel trustworthy, no tech clichés"
          value={form.constraints ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, constraints: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D6A4F] outline-none"
        />
      </div>

      {/* Optional Business Name */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Preferred Name Ideas <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. Verdant, Leaf, Green"
          value={form.existingName ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, existingName: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2D6A4F] outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-4 rounded-xl transition-colors duration-200 text-lg"
      >
        Generate Brand Names ✨
      </button>
    </form>
  );
}
```

---

### H2:00 – 3:00 | BrandResultsGrid — Step 2 (with Mock Data)

Create `apps/client/src/components/ui/ColorSwatch.tsx`:

```typescript
interface ColorSwatchProps {
  hex: string;
  name: string;
  size?: 'sm' | 'lg';
}

export default function ColorSwatch({ hex, name, size = 'sm' }: ColorSwatchProps) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-10 h-10';
  return (
    <div className="group relative">
      <div
        className={`${dim} rounded-full border-2 border-white shadow-sm cursor-pointer`}
        style={{ backgroundColor: hex }}
        title={`${name} ${hex}`}
      />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {name}<br />{hex}
      </span>
    </div>
  );
}
```

Create `apps/client/src/components/brand/DomainBadge.tsx`:

```typescript
interface DomainBadgeProps {
  tld: string;
  available: boolean;
}

export default function DomainBadge({ tld, available }: DomainBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500 line-through'
    }`}>
      {available ? '✓' : '✗'} .{tld}
    </span>
  );
}
```

Create `apps/client/src/components/brand/BrandNameCard.tsx`:

```typescript
import type { BrandName } from '@upstream/shared';
import ColorSwatch from '../ui/ColorSwatch';
import DomainBadge from './DomainBadge';

interface BrandNameCardProps {
  brand: BrandName;
  selected: boolean;
  onSelect: (brand: BrandName) => void;
}

export default function BrandNameCard({ brand, selected, onSelect }: BrandNameCardProps) {
  return (
    <div
      onClick={() => onSelect(brand)}
      className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-lg ${
        selected
          ? 'border-[#2D6A4F] shadow-lg bg-[#F0FFF8]'
          : 'border-gray-100 bg-white hover:border-[#95D5B2]'
      }`}
    >
      <h3 className="text-2xl font-bold text-[#1B2421]">{brand.name}</h3>
      <p className="text-sm text-[#2D6A4F] font-medium mt-1 italic">"{brand.tagline}"</p>
      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{brand.meaning}</p>

      {/* Color swatches */}
      <div className="flex gap-1 mt-4">
        {brand.visualDirection.palette.map((c) => (
          <ColorSwatch key={c.hex} hex={c.hex} name={c.name} size="sm" />
        ))}
      </div>

      {/* Domain availability */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        <DomainBadge tld="com" available={brand.domainAvailability.com} />
        <DomainBadge tld="io"  available={brand.domainAvailability.io} />
        <DomainBadge tld="co"  available={brand.domainAvailability.co} />
      </div>

      {selected && (
        <div className="mt-3 text-xs font-semibold text-[#2D6A4F] flex items-center gap-1">
          ✅ Selected — see details below
        </div>
      )}
    </div>
  );
}
```

Create `apps/client/src/components/brand/BrandResultsGrid.tsx`:

```typescript
import type { BrandName } from '@upstream/shared';
import { useBrandStore } from '../../store/brandStore';
import BrandNameCard from './BrandNameCard';

export default function BrandResultsGrid() {
  const { brandNames, selectedName, selectName, setStep, isLoadingNames } = useBrandStore();

  if (isLoadingNames) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Generating your brand names… (~15 seconds)</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#1B2421] mb-2">Your Brand Names</h2>
      <p className="text-gray-500 mb-6">Click a name to see the full visual identity.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brandNames.map((brand) => (
          <BrandNameCard
            key={brand.id}
            brand={brand}
            selected={selectedName?.id === brand.id}
            onSelect={selectName}
          />
        ))}
      </div>

      {selectedName && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setStep(3)}
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Generate Logo Concepts →
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### H3:00 – 4:00 | VisualDirectionPanel

Create `apps/client/src/components/brand/VisualDirectionPanel.tsx`:

```typescript
import type { BrandName } from '@upstream/shared';
import ColorSwatch from '../ui/ColorSwatch';

interface Props { brand: BrandName }

export default function VisualDirectionPanel({ brand }: Props) {
  const { palette, fonts, styleDescription } = brand.visualDirection;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-4 border border-gray-100">
      <h3 className="text-lg font-bold text-[#1B2421] mb-4">Visual Direction — {brand.name}</h3>

      {/* Palette */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Colour Palette</p>
        <div className="flex gap-3 flex-wrap">
          {palette.map((c) => (
            <div key={c.hex} className="flex flex-col items-center gap-1">
              <ColorSwatch hex={c.hex} name={c.name} size="lg" />
              <span className="text-[10px] text-gray-400 font-mono">{c.hex}</span>
              <span className="text-[10px] text-gray-500 capitalize">{c.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Typography</p>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-400">Headline · </span>
            <span
              className="text-xl font-bold text-[#1B2421]"
              style={{ fontFamily: fonts.headline, fontWeight: fonts.headlineWeight }}
            >
              {brand.name}
            </span>
            <span className="text-xs text-gray-400 ml-2">{fonts.headline} {fonts.headlineWeight}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400">Body · </span>
            <span
              className="text-sm text-gray-600"
              style={{ fontFamily: fonts.body, fontWeight: fonts.bodyWeight }}
            >
              {brand.tagline}
            </span>
            <span className="text-xs text-gray-400 ml-2">{fonts.body} {fonts.bodyWeight}</span>
          </div>
        </div>
      </div>

      {/* Style description */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Style</p>
        <p className="text-sm text-gray-600 italic">{styleDescription}</p>
      </div>
    </div>
  );
}
```

---

### H4:00 – 5:00 | LogoGallery + Export Preview

Create `apps/client/src/components/brand/LogoGallery.tsx`:

```typescript
import { useBrandStore } from '../../store/brandStore';
import { useLogoGeneration } from '../../hooks/useLogoGeneration';

export default function LogoGallery() {
  const { logoConcepts, selectedLogo, selectLogo, setStep, isLoadingLogos } = useBrandStore();
  const { generateLogos } = useLogoGeneration();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#1B2421] mb-2">Logo Concepts</h2>
      <p className="text-gray-500 mb-6">We'll generate 4 unique logo directions for your brand.</p>

      {logoConcepts.length === 0 && !isLoadingLogos && (
        <div className="text-center py-16">
          <button
            onClick={generateLogos}
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            ✨ Generate Logo Concepts
          </button>
          <p className="text-gray-400 text-sm mt-3">Takes ~30 seconds · Powered by DALL-E 3</p>
        </div>
      )}

      {isLoadingLogos && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Generating logos… (~30 seconds)</p>
        </div>
      )}

      {logoConcepts.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {logoConcepts.map((logo) => (
              <div
                key={logo.id}
                onClick={() => selectLogo(logo)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedLogo?.id === logo.id
                    ? 'border-[#2D6A4F] shadow-lg scale-105'
                    : 'border-gray-100 hover:border-[#95D5B2]'
                }`}
              >
                <img src={logo.url} alt={`${logo.style} logo`} className="w-full aspect-square object-cover" />
                <div className="p-2 bg-white text-center">
                  <span className="text-xs font-medium text-gray-500 capitalize">{logo.style}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedLogo && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(4)}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-8 py-3 rounded-xl transition-colors"
              >
                Preview & Export →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

Create `apps/client/src/components/brand/BrandIdentityCard.tsx` (the export target):

```typescript
import type { BrandName, LogoConcept } from '@upstream/shared';
import DomainBadge from './DomainBadge';
import { usePDFExport } from '../../hooks/usePDFExport';

interface Props {
  brand: BrandName;
  logo: LogoConcept | null;
}

export default function BrandIdentityCard({ brand, logo }: Props) {
  const { exportPDF } = usePDFExport();
  const { palette, fonts } = brand.visualDirection;
  const primaryHex = palette.find((c) => c.role === 'primary')?.hex ?? '#2D6A4F';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* The element captured by html2canvas */}
      <div id="brand-identity-card" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: fonts.headline, color: primaryHex }}
            >
              {brand.name}
            </h1>
            <p className="text-lg text-gray-500 italic mt-1">"{brand.tagline}"</p>
          </div>
          {logo && (
            <img src={logo.url} alt="Selected logo" className="w-24 h-24 rounded-xl object-cover shadow" />
          )}
        </div>

        {/* Colour Palette */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Colour Palette</p>
          <div className="flex gap-2">
            {palette.map((c) => (
              <div key={c.hex} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow" style={{ backgroundColor: c.hex }} />
                <span className="text-[10px] text-gray-400 font-mono">{c.hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Typography</p>
          <p className="text-sm text-gray-600">
            Headline: <strong>{fonts.headline}</strong> · Body: <strong>{fonts.body}</strong>
          </p>
        </div>

        {/* Domains */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Domain Availability</p>
          <div className="flex gap-2">
            <DomainBadge tld="com" available={brand.domainAvailability.com} />
            <DomainBadge tld="io"  available={brand.domainAvailability.io} />
            <DomainBadge tld="co"  available={brand.domainAvailability.co} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-300 text-right mt-4">
          Generated by Upstream · {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => exportPDF(brand.name)}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg shadow-md"
        >
          ⬇️ Download as PDF
        </button>
      </div>
    </div>
  );
}
```

---

### H5:30 – 7:00 | Wire Real APIs

Create `apps/client/src/hooks/useBrandGeneration.ts`:

```typescript
import { useCallback } from 'react';
import { useBrandStore } from '../store/brandStore';
import { brandApi } from '../services/api';
import { MOCK_BRAND_NAMES } from '../mock/mockData';
import toast from 'react-hot-toast';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export function useBrandGeneration() {
  const store = useBrandStore();

  const generateBrands = useCallback(async () => {
    if (!store.input) return;
    store.setLoadingNames(true);
    store.setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1500)); // Simulate latency
        store.setProjectId('mock_proj_001');
        store.setBrandNames(MOCK_BRAND_NAMES);
      } else {
        const result = await brandApi.generate({ input: store.input, count: 12 });
        store.setProjectId(result.projectId);
        store.setBrandNames(result.names);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      store.setError(msg);
      toast.error(msg);
    } finally {
      store.setLoadingNames(false);
    }
  }, [store]);

  return { generateBrands };
}
```

Create `apps/client/src/hooks/useLogoGeneration.ts`:

```typescript
import { useCallback } from 'react';
import { useBrandStore } from '../store/brandStore';
import { brandApi } from '../services/api';
import { MOCK_LOGOS } from '../mock/mockData';
import toast from 'react-hot-toast';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export function useLogoGeneration() {
  const store = useBrandStore();

  const generateLogos = useCallback(async () => {
    if (!store.selectedName || !store.projectId) return;
    store.setLoadingLogos(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 2000));
        store.setLogoConcepts(MOCK_LOGOS);
      } else {
        const result = await brandApi.generateLogos({
          projectId: store.projectId,
          brandNameId: store.selectedName.id,
        });
        store.setLogoConcepts(result.logos);
      }
      toast.success('Logo concepts ready!');
    } catch (err) {
      toast.error('Logo generation failed — using previews instead');
      store.setLogoConcepts(MOCK_LOGOS); // Always fall back gracefully
    } finally {
      store.setLoadingLogos(false);
    }
  }, [store]);

  return { generateLogos };
}
```

Create `apps/client/src/hooks/usePDFExport.ts`:

```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export function usePDFExport() {
  const exportPDF = async (brandName: string) => {
    const element = document.getElementById('brand-identity-card');
    if (!element) {
      toast.error('Export element not found');
      return;
    }
    const toastId = toast.loading('Generating PDF…');
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${brandName.toLowerCase()}-brand-identity.pdf`);
      toast.success('PDF downloaded!', { id: toastId });
    } catch (err) {
      toast.error('PDF export failed', { id: toastId });
      console.error(err);
    }
  };

  return { exportPDF };
}
```

Create `apps/client/src/App.tsx` — the root step controller:

```typescript
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useBrandStore } from './store/brandStore';
import { useBrandGeneration } from './hooks/useBrandGeneration';
import BrandInputForm from './components/forms/BrandInputForm';
import BrandResultsGrid from './components/brand/BrandResultsGrid';
import VisualDirectionPanel from './components/brand/VisualDirectionPanel';
import LogoGallery from './components/brand/LogoGallery';
import BrandIdentityCard from './components/brand/BrandIdentityCard';

export default function App() {
  const { step, input, selectedName, selectedLogo } = useBrandStore();
  const { generateBrands } = useBrandGeneration();

  // Trigger generation when input is set and we move to step 2
  useEffect(() => {
    if (step === 2 && input) {
      generateBrands();
    }
  }, [step, input]);

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-12">
      <Toaster position="top-right" />

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-colors ${
              s === step ? 'bg-[#2D6A4F]' : s < step ? 'bg-[#95D5B2]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {step === 1 && <BrandInputForm />}
      {step === 2 && (
        <>
          <BrandResultsGrid />
          {selectedName && <VisualDirectionPanel brand={selectedName} />}
        </>
      )}
      {step === 3 && <LogoGallery />}
      {step === 4 && selectedName && <BrandIdentityCard brand={selectedName} logo={selectedLogo} />}
    </div>
  );
}
```

Create `apps/client/.env.example`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK=true
```

---

### H7:00 – 9:00 | Polish

- [ ] Add loading skeleton cards to `BrandResultsGrid` while `isLoadingNames` is true
- [ ] Add a step-back button (`←`) on Steps 2–4 using `setStep(step - 1)`
- [ ] Add hover transition on all cards (`transition-all duration-200`)
- [ ] Make grid responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [ ] Test the full mock flow: Form → Results → Select → Logos → Export
- [ ] Change `VITE_USE_MOCK=false` and test with real API if Role 3 is ready
- [ ] Check CORS — if API calls fail, ensure Role 4 whitelisted `localhost:5173`

---

## Design System (Use Consistently)

| Token | Value |
|-------|-------|
| Primary | `#2D6A4F` (Forest Green) |
| Accent | `#95D5B2` (Sage) |
| Background | `#F8FAF8` |
| Text | `#1B2421` |
| Border radius | `rounded-xl` (0.75rem) / `rounded-2xl` (1rem) |
| Shadow | `shadow-md`, `shadow-lg` |
| Font | Inter (headlines), Merriweather (body) |
| Transition | `transition-all duration-200` |

---

## Files You Own

```
apps/client/
├── index.html
├── vite.config.ts
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── mock/
    │   └── mockData.ts
    ├── store/
    │   └── brandStore.ts
    ├── services/
    │   └── api.ts
    ├── hooks/
    │   ├── useBrandGeneration.ts
    │   ├── useLogoGeneration.ts
    │   └── usePDFExport.ts
    └── components/
        ├── forms/
        │   └── BrandInputForm.tsx
        ├── ui/
        │   └── ColorSwatch.tsx
        └── brand/
            ├── BrandNameCard.tsx
            ├── BrandResultsGrid.tsx
            ├── VisualDirectionPanel.tsx
            ├── DomainBadge.tsx
            ├── LogoGallery.tsx
            └── BrandIdentityCard.tsx
```

---
---

# 🔴 ROLE 3 – AI / API Engineer

## Your Mission in One Line

Build all AI endpoints. Priority: mock data first to unblock Role 2, then real OpenAI calls.

---

## Your Very First Task — Do This IMMEDIATELY

While Role 4 sets up Express, create mock data so Role 2 can start immediately.

```bash
git checkout main && git pull
git checkout -b dev/3-ai
git push -u origin dev/3-ai
```

---

### H0:00 – 0:30 | Mock Data Files

Create `apps/server/src/mock/brandNames.mock.ts`:

```typescript
import type { BrandName } from '@upstream/shared';

export const MOCK_BRAND_NAMES: BrandName[] = [
  {
    id: 'mock_n1',
    name: 'Verdant',
    meaning: 'From Latin viridis — lush and green, evokes sustainable growth.',
    tagline: 'Where green teams thrive.',
    domainAvailability: {
      com: true, io: false, co: true,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#2D6A4F', name: 'Forest Green', role: 'primary' },
        { hex: '#95D5B2', name: 'Sage', role: 'secondary' },
        { hex: '#F7F3E9', name: 'Cream', role: 'background' },
        { hex: '#1B4332', name: 'Deep Forest', role: 'text' },
        { hex: '#D4A373', name: 'Warm Sand', role: 'accent' },
      ],
      fonts: { headline: 'Inter', body: 'Merriweather', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Modern and clean with warm natural accents. Trustworthy yet approachable.',
    },
  },
  {
    id: 'mock_n2',
    name: 'Leafwise',
    meaning: 'Intelligent growth — leaves guided by knowledge.',
    tagline: 'Smart. Sustainable. Simple.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#386641', name: 'Emerald', role: 'primary' },
        { hex: '#A7C4A0', name: 'Fern', role: 'secondary' },
        { hex: '#FAFDF7', name: 'White Smoke', role: 'background' },
        { hex: '#2D3A2E', name: 'Dark Canopy', role: 'text' },
        { hex: '#F2A65A', name: 'Amber', role: 'accent' },
      ],
      fonts: { headline: 'DM Sans', body: 'Source Serif 4', headlineWeight: '600', bodyWeight: '400' },
      styleDescription: 'Earthy and grounded — evokes a forest walk on a clear morning.',
    },
  },
  {
    id: 'mock_n3',
    name: 'Terraq',
    meaning: 'Terra + Q — earthy intelligence with a sharp edge.',
    tagline: 'Ground your ambition.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#6B4226', name: 'Terracotta', role: 'primary' },
        { hex: '#C89B7B', name: 'Sand', role: 'secondary' },
        { hex: '#F9F5F0', name: 'Linen', role: 'background' },
        { hex: '#2C1810', name: 'Espresso', role: 'text' },
        { hex: '#3D9970', name: 'Mint', role: 'accent' },
      ],
      fonts: { headline: 'Sora', body: 'Lora', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Warm, bold, and grounded — like clay shaped with purpose.',
    },
  },
  {
    id: 'mock_n4',
    name: 'Driftwork',
    meaning: 'Flow through your work like water — effortless and adaptive.',
    tagline: 'Work in flow.',
    domainAvailability: { com: false, io: true, co: false, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#1D3557', name: 'Navy', role: 'primary' },
        { hex: '#457B9D', name: 'Steel Blue', role: 'secondary' },
        { hex: '#F0F4F8', name: 'Mist', role: 'background' },
        { hex: '#0D1B2A', name: 'Midnight', role: 'text' },
        { hex: '#E63946', name: 'Coral', role: 'accent' },
      ],
      fonts: { headline: 'Outfit', body: 'Noto Serif', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Clean, coastal, and calm — designed for deep focus.',
    },
  },
  {
    id: 'mock_n5',
    name: 'Canopy',
    meaning: 'A protective layer — shelter for ideas that need room to grow.',
    tagline: 'Under the canopy, ideas flourish.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#4A7C59', name: 'Canopy Green', role: 'primary' },
        { hex: '#B7DDB3', name: 'Leaf', role: 'secondary' },
        { hex: '#F4FAF4', name: 'Dew', role: 'background' },
        { hex: '#1A3025', name: 'Shadow', role: 'text' },
        { hex: '#E8B86D', name: 'Sunbeam', role: 'accent' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Open Sans', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Lush and welcoming — evokes the feeling of discovering a peaceful clearing.',
    },
  },
  {
    id: 'mock_n6',
    name: 'Mossworth',
    meaning: 'Worth as deep-rooted as the oldest moss on stone.',
    tagline: 'Built on what lasts.',
    domainAvailability: { com: false, io: false, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#5C6B48', name: 'Olive', role: 'primary' },
        { hex: '#ADB88A', name: 'Moss', role: 'secondary' },
        { hex: '#F2F0E6', name: 'Parchment', role: 'background' },
        { hex: '#242B1A', name: 'Bark', role: 'text' },
        { hex: '#C4773D', name: 'Rust', role: 'accent' },
      ],
      fonts: { headline: 'Cormorant Garamond', body: 'Karla', headlineWeight: '600', bodyWeight: '400' },
      styleDescription: 'Heritage and craft — for brands that value depth over trend.',
    },
  },
  {
    id: 'mock_n7',
    name: 'Clearpath',
    meaning: 'Clarity of direction — removing obstacles between you and your goals.',
    tagline: 'See the way forward.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#7B2D8B', name: 'Violet', role: 'primary' },
        { hex: '#C77DFF', name: 'Lavender', role: 'secondary' },
        { hex: '#FAF7FF', name: 'Ghost White', role: 'background' },
        { hex: '#1A0A2E', name: 'Deep Plum', role: 'text' },
        { hex: '#FFD166', name: 'Honey', role: 'accent' },
      ],
      fonts: { headline: 'Space Grotesk', body: 'Libre Baskerville', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Bold and visionary — built for people who think ahead.',
    },
  },
  {
    id: 'mock_n8',
    name: 'Solace',
    meaning: 'Comfort in the chaos of modern work.',
    tagline: 'Find your calm. Keep your momentum.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#5E8B7E', name: 'Teal', role: 'primary' },
        { hex: '#A2C4C0', name: 'Mist Teal', role: 'secondary' },
        { hex: '#F5F9F8', name: 'Frost', role: 'background' },
        { hex: '#1F3330', name: 'Deep Teal', role: 'text' },
        { hex: '#F4A261', name: 'Warm Orange', role: 'accent' },
      ],
      fonts: { headline: 'Nunito', body: 'Georgia', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Soft and reassuring — like a deep breath at the start of a focused session.',
    },
  },
  {
    id: 'mock_n9',
    name: 'Rootly',
    meaning: 'Deeply rooted processes — growth from the ground up.',
    tagline: 'Root deeper. Grow higher.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#8B5E3C', name: 'Cedar', role: 'primary' },
        { hex: '#D4A574', name: 'Oak', role: 'secondary' },
        { hex: '#FBF7F2', name: 'Ivory', role: 'background' },
        { hex: '#2D1A0E', name: 'Dark Wood', role: 'text' },
        { hex: '#52796F', name: 'Sage Green', role: 'accent' },
      ],
      fonts: { headline: 'Bitter', body: 'Work Sans', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Warm and organic — grounded in craft and authenticity.',
    },
  },
  {
    id: 'mock_n10',
    name: 'Echelon',
    meaning: 'A tier above — structured for excellence.',
    tagline: 'Step up. Stand out.',
    domainAvailability: { com: true, io: false, co: false, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#1A1A2E', name: 'Midnight Blue', role: 'primary' },
        { hex: '#4A4E8C', name: 'Indigo', role: 'secondary' },
        { hex: '#F8F8FC', name: 'Off White', role: 'background' },
        { hex: '#0D0D1A', name: 'Obsidian', role: 'text' },
        { hex: '#C9A84C', name: 'Gold', role: 'accent' },
      ],
      fonts: { headline: 'Montserrat', body: 'Raleway', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Premium and authoritative — for leaders who mean business.',
    },
  },
  {
    id: 'mock_n11',
    name: 'Basecamp',
    meaning: 'The starting point for every great expedition.',
    tagline: 'Every summit starts here.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: false, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#2F4858', name: 'Slate', role: 'primary' },
        { hex: '#718EA4', name: 'Steel', role: 'secondary' },
        { hex: '#F3F6F8', name: 'Cloud', role: 'background' },
        { hex: '#111D25', name: 'Charcoal', role: 'text' },
        { hex: '#E07A5F', name: 'Ember', role: 'accent' },
      ],
      fonts: { headline: 'Rubik', body: 'IBM Plex Serif', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Rugged and dependable — for teams that tackle hard problems.',
    },
  },
  {
    id: 'mock_n12',
    name: 'Compass',
    meaning: 'Always pointing to what matters most.',
    tagline: 'Navigate what matters.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#2B4590', name: 'Royal Blue', role: 'primary' },
        { hex: '#7B9ED9', name: 'Periwinkle', role: 'secondary' },
        { hex: '#F7F9FF', name: 'Pale Blue', role: 'background' },
        { hex: '#0A1628', name: 'Navy Night', role: 'text' },
        { hex: '#F4C430', name: 'Saffron', role: 'accent' },
      ],
      fonts: { headline: 'Poppins', body: 'Crimson Text', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Confident and directional — built for people who set the bearing for others.',
    },
  },
];
```

Create `apps/server/src/mock/logos.mock.ts`:

```typescript
import type { LogoConcept } from '@upstream/shared';

export const MOCK_LOGOS: LogoConcept[] = [
  { id: 'mock_l1', url: 'https://picsum.photos/400/400?random=41', prompt: 'minimal clean logo', style: 'minimal' },
  { id: 'mock_l2', url: 'https://picsum.photos/400/400?random=42', prompt: 'geometric logo concept', style: 'geometric' },
  { id: 'mock_l3', url: 'https://picsum.photos/400/400?random=43', prompt: 'wordmark typography logo', style: 'wordmark' },
  { id: 'mock_l4', url: 'https://picsum.photos/400/400?random=44', prompt: 'abstract brand mark', style: 'abstract' },
];
```

Create `apps/server/src/mock/domains.mock.ts`:

```typescript
/** Deterministic domain availability based on name characters — no API needed. */
function nameHash(name: string): number {
  return name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function mockDomainCheck(name: string): {
  com: boolean; io: boolean; co: boolean;
  handle: { twitter: boolean; instagram: boolean };
} {
  const h = nameHash(name);
  return {
    com: h % 3 !== 0,         // ~67% available
    io: h % 2 === 0,          // ~50% available
    co: h % 4 !== 0,          // ~75% available
    handle: {
      twitter: h % 3 !== 0,
      instagram: h % 5 !== 0,
    },
  };
}
```

Commit and push immediately so Role 2 can reference these:

```bash
git add apps/server/src/mock/
git commit -m "feat(mock): add brand names, logos, and domain mock data"
git push origin dev/3-ai
```

---

### H0:30 – 1:00 | OpenAI Client Setup

```bash
cd apps/server
pnpm add openai
```

Create `apps/server/src/config/openai.ts`:

```typescript
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 55_000, // slightly under the client 60s timeout
});
```

---

### H1:00 – 2:30 | OpenAI Brand Generation Service

Create `apps/server/src/services/openai.service.ts`:

```typescript
import { openai } from '../config/openai';
import { MOCK_BRAND_NAMES } from '../mock/brandNames.mock';
import type { BrandInput, BrandName } from '@upstream/shared';

const SYSTEM_PROMPT = `You are a world-class brand naming strategist. 
When given a business brief, you generate creative, distinctive, and memorable brand names.
You ALWAYS respond with valid JSON only — no prose, no markdown.
Your JSON must match the exact schema provided.`;

function buildUserPrompt(input: BrandInput, count: number): string {
  return `Generate ${count} unique brand names for this business:

Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Mission/Values: ${input.mission}
Brand Tone: ${input.tone}
Constraints: ${input.constraints || 'None'}
${input.existingName ? `Preferred keywords: ${input.existingName}` : ''}

Respond with ONLY this JSON structure (no other text):
{
  "names": [
    {
      "id": "n_<index>",
      "name": "<brand name, 1-2 words max>",
      "meaning": "<40-60 word etymology or meaning>",
      "tagline": "<punchy tagline under 8 words>",
      "visualDirection": {
        "palette": [
          { "hex": "<hex>", "name": "<colour name>", "role": "primary" },
          { "hex": "<hex>", "name": "<colour name>", "role": "secondary" },
          { "hex": "<hex>", "name": "<colour name>", "role": "background" },
          { "hex": "<hex>", "name": "<colour name>", "role": "text" },
          { "hex": "<hex>", "name": "<colour name>", "role": "accent" }
        ],
        "fonts": {
          "headline": "<Google Font name>",
          "body": "<Google Font name>",
          "headlineWeight": "700",
          "bodyWeight": "400"
        },
        "styleDescription": "<2 sentence visual style description>"
      }
    }
  ]
}`;
}

export async function generateBrands(input: BrandInput, count: number): Promise<BrandName[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input, count) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9,
      max_tokens: 4000,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(raw);
    const names: BrandName[] = parsed.names;

    // Add placeholder domain availability (to be filled by domain service)
    return names.map((n) => ({
      ...n,
      domainAvailability: { com: false, io: false, co: false, handle: { twitter: false, instagram: false } },
    }));
  } catch (err) {
    console.error('[OpenAI] generateBrands failed, falling back to mock:', err);
    // CRITICAL: never let AI failure crash the demo
    return MOCK_BRAND_NAMES.slice(0, count);
  }
}
```

---

### H2:30 – 3:30 | Domain Check Endpoint

Create `apps/server/src/controllers/domain.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { mockDomainCheck } from '../mock/domains.mock';
import type { CheckDomainsRequest, CheckDomainsResponse, DomainAvailability } from '@upstream/shared';

export const checkDomains = async (req: Request, res: Response) => {
  const { names } = req.body as CheckDomainsRequest;

  const results: Record<string, DomainAvailability> = {};

  for (const name of names) {
    results[name] = mockDomainCheck(name);
  }

  res.json({ results } satisfies CheckDomainsResponse);
};
```

---

### H3:30 – 5:00 | DALL-E 3 Logo Generation

Create `apps/server/src/services/dalle.service.ts`:

```typescript
import { openai } from '../config/openai';
import { MOCK_LOGOS } from '../mock/logos.mock';
import type { BrandName, LogoConcept } from '@upstream/shared';

// In-memory cache — logos are expensive, never regenerate within same process
const logoCache = new Map<string, LogoConcept[]>();

const STYLES = ['minimal', 'geometric', 'wordmark', 'abstract'] as const;
type LogoStyle = typeof STYLES[number];

function buildLogoPrompt(brandName: BrandName, industry: string, style: LogoStyle): string {
  const colors = brandName.visualDirection.palette
    .filter((c) => c.role !== 'background')
    .map((c) => c.name)
    .join(', ');

  return `Professional ${style} logo design for "${brandName.name}", a ${industry} brand. ` +
    `Brand colours: ${colors}. ` +
    `Style: ${brandName.visualDirection.styleDescription} ` +
    `Requirements: Clean, minimal, scalable vector aesthetic. Solid white background. ` +
    `If text present, use clean sans-serif. No gradients. No complex illustrations. ` +
    `Suitable for professional business use.`;
}

export async function generateLogos(
  brandName: BrandName,
  industry: string,
  count = 4
): Promise<LogoConcept[]> {
  const cacheKey = `${brandName.name}:${industry}`;
  if (logoCache.has(cacheKey)) {
    console.log(`[DALL-E] Cache hit for ${cacheKey}`);
    return logoCache.get(cacheKey)!;
  }

  const logos: LogoConcept[] = [];
  const stylesToGenerate = STYLES.slice(0, Math.min(count, STYLES.length));

  for (let i = 0; i < stylesToGenerate.length; i++) {
    const style = stylesToGenerate[i];
    try {
      const prompt = buildLogoPrompt(brandName, industry, style);
      console.log(`[DALL-E] Generating ${style} logo for ${brandName.name}…`);

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',   // NEVER use 'hd' during hackathon — 2x cost
      });

      logos.push({
        id: `logo_${Date.now()}_${i}`,
        url: response.data[0].url!,
        prompt,
        style,
      });
    } catch (err) {
      console.error(`[DALL-E] Failed for style ${style}:`, err);
      // Fall back to mock — never crash the demo
      logos.push({ ...MOCK_LOGOS[i], id: `logo_fallback_${Date.now()}_${i}` });
    }
  }

  logoCache.set(cacheKey, logos);
  return logos;
}
```

Create `apps/server/src/controllers/logo.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { generateLogos } from '../services/dalle.service';
import type { GenerateLogosRequest, GenerateLogosResponse } from '@upstream/shared';

// Simple per-project rate limit — max 2 logo generations
const logoRequestCounts = new Map<string, number>();
const MAX_LOGO_REQUESTS = 2;

export const generateLogoConcepts = async (req: Request, res: Response) => {
  const { projectId, brandNameId } = req.body as GenerateLogosRequest;

  // Rate limiting per project
  const count = logoRequestCounts.get(projectId) ?? 0;
  if (count >= MAX_LOGO_REQUESTS) {
    return res.status(429).json({
      error: 'RATE_LIMITED',
      message: `Maximum ${MAX_LOGO_REQUESTS} logo generations per project`,
    });
  }
  logoRequestCounts.set(projectId, count + 1);

  // brandName must be resolved from DB or passed in body — for hackathon pass it in body
  const { brandName, industry } = req.body as any;

  const logos = await generateLogos(brandName, industry ?? 'technology', 4);

  res.json({ logos } satisfies GenerateLogosResponse);
};
```

> **IMPORTANT:** Update `GenerateLogosRequest` in shared types to include `brandName` and `industry` fields if they aren't already present.

---

### H5:00+ | Brand Generate Controller (Finish from Role 4 stub)

Fill in `apps/server/src/controllers/brand.controller.ts` — **coordinate with Role 4 who owns this file**:

```typescript
import { Request, Response } from 'express';
import * as openaiService from '../services/openai.service';
import * as firebaseService from '../services/firebase.service';
import { mockDomainCheck } from '../mock/domains.mock';
import type { GenerateBrandRequest, GenerateBrandResponse } from '@upstream/shared';

export const generateBrands = async (req: Request, res: Response) => {
  const { input, count = 12 } = req.body as GenerateBrandRequest;

  // 1. Generate names via GPT-4o (falls back to mock on error)
  const rawNames = await openaiService.generateBrands(input, count);

  // 2. Overlay domain availability
  const namesWithDomains = rawNames.map((name) => ({
    ...name,
    domainAvailability: mockDomainCheck(name.name),
  }));

  // 3. Persist to Firestore (non-critical — let it fail silently)
  let projectId = `proj_${Date.now()}`;
  try {
    projectId = await firebaseService.saveProject({ input, names: namesWithDomains });
  } catch (err) {
    console.warn('[Firebase] Save failed (non-critical):', err);
  }

  res.json({ projectId, names: namesWithDomains } satisfies GenerateBrandResponse);
};
```

---

## Cost Control Rules — NON-NEGOTIABLE

| Rule | Detail |
|------|--------|
| **On-demand only** | NEVER pre-generate logos; only trigger on user button click |
| **Cache everything** | Use `logoCache` Map — same brand never generates twice |
| **Standard quality** | Always `quality: 'standard'`, never `'hd'` |
| **Standard size** | Always `size: '1024x1024'` |
| **Silent fallback** | If DALL-E fails for any reason, serve mock logos. No exceptions |
| **Rate limit** | Max 2 logo generation calls per `projectId` |
| **No parallelism** | Generate logos sequentially (`for` loop), not with `Promise.all` |

---

## Files You Own

```
apps/server/src/
├── mock/
│   ├── brandNames.mock.ts    ← YOU OWN
│   ├── logos.mock.ts         ← YOU OWN
│   └── domains.mock.ts       ← YOU OWN
├── config/
│   └── openai.ts             ← YOU OWN
├── services/
│   ├── openai.service.ts     ← YOU OWN
│   └── dalle.service.ts      ← YOU OWN
└── controllers/
    ├── brand.controller.ts   ← SHARED with Role 4 (coordinate!)
    ├── domain.controller.ts  ← YOU OWN
    └── logo.controller.ts    ← YOU OWN
```

---
---

# 🟡 ROLE 4 – Backend / Database Engineer

## Your Mission in One Line

Build the Express foundation, wire up Firebase, and implement save/retrieve endpoints. Role 3 builds **on top** of your work.

---

## Initial Setup

```bash
git checkout main && git pull
git checkout -b dev/4-backend
git push -u origin dev/4-backend
cd apps/server

# Bootstrap package.json
pnpm init -y

# Runtime dependencies
pnpm add express cors helmet express-rate-limit express-async-errors dotenv firebase-admin

# Dev dependencies
pnpm add -D typescript @types/express @types/cors @types/node tsx nodemon

# Link shared types
pnpm add @upstream/shared --workspace
```

Create `apps/server/package.json` (confirm these fields are present):

```json
{
  "name": "@upstream/server",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts --watch src",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  }
}
```

Create `apps/server/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "CommonJS",
    "moduleResolution": "node",
    "target": "ES2022"
  },
  "include": ["src/**/*"]
}
```

Create `apps/server/.env.example` (commit this — **not** `.env`):

```env
PORT=3001
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Copy `.env.example` to `.env` and fill in real values. **Never commit `.env`** — confirm it's in `.gitignore`.

---

## Hour-by-Hour Build Order

### H0:00 – 0:45 | Express Application Entry Point

Create `apps/server/src/index.ts`:

```typescript
import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import brandRoutes from './routes/brand.routes';
import logoRoutes from './routes/logo.routes';
import domainRoutes from './routes/domain.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────
app.use(rateLimiter);

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/brand', brandRoutes);
app.use('/api/brand', logoRoutes);   // POST /api/brand/logos
app.use('/api/domain', domainRoutes);

// ── Error handler (must be LAST) ──────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
```

---

### H0:45 – 1:30 | Middleware

Create `apps/server/src/middleware/errorHandler.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    error: err.name ?? 'INTERNAL_ERROR',
    message: err.message ?? 'An unexpected error occurred',
    statusCode,
  });
};
```

Create `apps/server/src/middleware/rateLimiter.ts`:

```typescript
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute window
  max: 20,                // 20 requests per window per IP
  message: {
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please wait a moment.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

### H1:30 – 2:00 | Firebase Configuration

**Get Firebase credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. **Project Settings → Service Accounts → Generate New Private Key**
3. Download the JSON file
4. Copy `project_id`, `client_email`, and `private_key` into your `.env`

Create `apps/server/src/config/firebase.ts`:

```typescript
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) throw new Error('FIREBASE_PRIVATE_KEY is required');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey.replace(/\\n/g, '\n'), // Fix escaped newlines from .env
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });

  console.log('✅ Firebase Admin initialized');
}

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
```

---

### H2:00 – 3:00 | Route Stubs

Create `apps/server/src/routes/brand.routes.ts`:

```typescript
import { Router } from 'express';
import {
  generateBrands,
  saveProject,
  getProject,
} from '../controllers/brand.controller';
import { validateGenerateBrand } from '../middleware/validation';

const router = Router();

// POST /api/brand/generate   — Role 3 implements AI logic; Role 4 provides save
router.post('/generate', validateGenerateBrand, generateBrands);

// POST /api/brand/save       — Role 4 implements
router.post('/save', saveProject);

// GET  /api/brand/:id        — Role 4 implements
// NOTE: This must come AFTER /generate and /logos routes to avoid conflict
router.get('/:id', getProject);

export default router;
```

Create `apps/server/src/routes/logo.routes.ts`:

```typescript
import { Router } from 'express';
import { generateLogoConcepts } from '../controllers/logo.controller';

const router = Router();

// POST /api/brand/logos  — Role 3 implements
router.post('/logos', generateLogoConcepts);

export default router;
```

Create `apps/server/src/routes/domain.routes.ts`:

```typescript
import { Router } from 'express';
import { checkDomains } from '../controllers/domain.controller';

const router = Router();

// POST /api/domain/check  — Role 3 implements
router.post('/check', checkDomains);

export default router;
```

Create `apps/server/src/controllers/brand.controller.ts` — **STUB** for Role 3 to fill:

```typescript
import { Request, Response } from 'express';

// ⚠️ Role 3 will replace the stub body of generateBrands with real OpenAI logic.
// Role 4 implements saveProject and getProject.

export const generateBrands = async (req: Request, res: Response) => {
  // STUB — Role 3 replaces this
  res.json({
    projectId: `stub_${Date.now()}`,
    names: [],
    message: 'Role 3: replace this stub with OpenAI logic',
  });
};

export const saveProject = async (_req: Request, res: Response) => {
  // TODO: Role 4 implement using firebase.service.ts
  res.json({ id: `stub_save_${Date.now()}` });
};

export const getProject = async (req: Request, res: Response) => {
  // TODO: Role 4 implement using firebase.service.ts
  res.json({ id: req.params.id, message: 'Role 4: implement with Firebase' });
};
```

---

### H3:00 – 5:00 | Firebase CRUD Service

Create `apps/server/src/services/firebase.service.ts`:

```typescript
import { db, FieldValue } from '../config/firebase';
import type { BrandProject } from '@upstream/shared';

const COLLECTION = 'brandProjects';

export async function saveProject(
  data: Omit<BrandProject, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await db.collection(COLLECTION).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`[Firebase] Project saved: ${docRef.id}`);
  return docRef.id;
}

export async function getProject(id: string): Promise<BrandProject | null> {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as BrandProject;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<BrandProject, 'id' | 'createdAt'>>
): Promise<void> {
  await db.collection(COLLECTION).doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function listProjects(limit = 20): Promise<BrandProject[]> {
  const snapshot = await db
    .collection(COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BrandProject));
}
```

Now implement the real controller functions — update `brand.controller.ts`:

```typescript
// Replace saveProject and getProject stubs:

export const saveProject = async (req: Request, res: Response) => {
  const data = req.body;
  const id = await firebaseService.saveProject(data);
  res.status(201).json({ id });
};

export const getProject = async (req: Request, res: Response) => {
  const project = await firebaseService.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Project not found' });
  }
  res.json(project);
};
```

---

### H5:30 – 9:00 | Validation & Hardening

```bash
pnpm add express-validator
```

Create `apps/server/src/middleware/validation.ts`:

```typescript
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: errors.array(),
    });
  }
  next();
};

export const validateGenerateBrand = [
  body('input.industry')
    .notEmpty().withMessage('Industry is required')
    .isString().isLength({ max: 200 }),
  body('input.targetAudience')
    .notEmpty().withMessage('Target audience is required')
    .isString().isLength({ max: 200 }),
  body('input.mission')
    .notEmpty().withMessage('Mission is required')
    .isString().isLength({ max: 500 }),
  body('input.tone')
    .isIn(['playful', 'professional', 'minimalist', 'bold', 'tech-forward', 'luxurious'])
    .withMessage('Invalid tone value'),
  body('count')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Count must be between 1 and 20'),
  handleValidation,
];

export const validateCheckDomains = [
  body('names')
    .isArray({ min: 1, max: 20 }).withMessage('names must be an array of 1–20 strings'),
  body('names.*')
    .isString().trim().notEmpty(),
  handleValidation,
];
```

Apply `validateCheckDomains` to the domain route as well (update `domain.routes.ts`).

---

### H9:00+ | Final Checks

- [ ] `GET /health` returns `200` on deployed Render URL
- [ ] `POST /api/brand/generate` returns 12 names (mock fallback if OpenAI key missing)
- [ ] `POST /api/brand/logos` returns 4 logo URLs
- [ ] `POST /api/domain/check` returns domain objects
- [ ] `POST /api/brand/save` persists to Firestore and returns document ID
- [ ] `GET /api/brand/:id` retrieves a saved project from Firestore
- [ ] Rate limiter blocks on the 21st request in a 60-second window
- [ ] CORS allows requests from the Vercel deployment URL (add to Render env vars)
- [ ] `.env` is NOT committed (confirm with `git status`)

---

## Files You Own

```
apps/server/
├── package.json
├── tsconfig.json
├── .env.example              ← commit this
├── .env                      ← NEVER commit this
└── src/
    ├── index.ts
    ├── config/
    │   └── firebase.ts
    ├── middleware/
    │   ├── errorHandler.ts
    │   ├── rateLimiter.ts
    │   └── validation.ts
    ├── routes/
    │   └── project.routes.ts     ← Owned by Dev 4 (save & retrieve projects)
    ├── controllers/
    │   └── project.controller.ts ← Owned by Dev 4 (Firestore save/get operations)
    └── services/
        └── firebase.service.ts
```

---

> **Zero-Conflict Policy with Role 3:** You exclusively own `project.routes.ts`, `project.controller.ts`, and `firebase.service.ts`. Role 3 exclusively owns `brand.routes.ts`, `brand.controller.ts`, and AI services. By keeping your routes and controllers in separate files, neither developer ever modifies the other's files, guaranteeing zero merge conflicts when merging `dev/4-backend` and `dev/3-ai` into `main`.

---

*End of 05_ROLE_GUIDES.md*
