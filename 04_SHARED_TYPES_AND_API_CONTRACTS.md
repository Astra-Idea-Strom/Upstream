# 04 – Shared Types & API Contracts

> **Project**: Upstream — AI Brand Identity & Naming Generator
> **Last Updated**: Hour 1 Freeze
> **Owner**: Role 1 (Full-Stack Lead)

---

## ⚠️ READ THIS FIRST

This document is **frozen after Hour 1**. All 4 roles code against these types and mock data from Hour 1.

- **Do NOT** change a type without announcing it in team chat first.
- **Role 1 approves all changes** — no exceptions.
- If you add an optional field, mark it with `?` and add a comment.
- **Role 2 (Frontend)** → use the mock data section. No API calls needed until backend is live.
- **Role 3 (AI/API)** → implement against these exact request/response shapes.
- **Role 4 (DevOps/DB)** → Firestore schema is in the dedicated section below.

---

## TypeScript Types Reference

### `packages/shared/src/types/brand.types.ts`

```typescript
// ============================================================
// BRAND INPUT
// ============================================================
export type BrandTone =
  | 'playful'
  | 'professional'
  | 'minimalist'
  | 'bold'
  | 'tech-forward'
  | 'luxurious';

export interface BrandInput {
  businessName?: string;        // optional – user's existing name for inspiration
  industry: string;             // e.g. "sustainable productivity"
  targetAudience: string;       // e.g. "remote workers aged 25-40"
  mission: string;              // 1-2 sentence mission / values statement
  tone: BrandTone;
  constraints: string;          // e.g. "must feel trustworthy, avoid tech clichés"
}

// ============================================================
// COLOR & VISUAL
// ============================================================
export type ColorRole = 'primary' | 'secondary' | 'accent' | 'background' | 'text';

export interface ColorSwatch {
  hex: string;                  // e.g. "#2D6A4F"
  name: string;                 // human-readable color name e.g. "Forest Green"
  role: ColorRole;
}

export interface FontPairing {
  headline: string;             // Google Font name e.g. "Inter"
  body: string;                 // Google Font name e.g. "Merriweather"
  headlineWeight: string;       // e.g. "700"
  bodyWeight: string;           // e.g. "400"
}

export interface VisualDirection {
  palette: ColorSwatch[];       // exactly 5 swatches: primary, secondary, accent, background, text
  fonts: FontPairing;
  styleDescription: string;     // 2-3 sentence visual direction description
}

// ============================================================
// DOMAIN
// ============================================================
export interface SocialHandles {
  twitter: boolean;
  instagram: boolean;
}

export interface DomainAvailability {
  com: boolean;
  io: boolean;
  co: boolean;
  handle: SocialHandles;
}

// ============================================================
// BRAND NAME
// ============================================================
export interface BrandName {
  id: string;                   // e.g. "name_001" – assigned by backend
  name: string;                 // max 12 characters
  meaning: string;              // 1-sentence etymology / concept explanation
  tagline: string;              // 5-10 words, punchy and memorable
  domainAvailability: DomainAvailability;
  visualDirection: VisualDirection;
}

// ============================================================
// LOGO
// ============================================================
export type LogoStyle =
  | 'minimal'
  | 'wordmark'
  | 'abstract'
  | 'geometric'
  | 'illustrative';

export interface LogoConcept {
  id: string;                   // e.g. "logo_001"
  url: string;                  // DALL-E image URL or placeholder
  prompt: string;               // the exact DALL-E prompt used to generate it
  style: LogoStyle;
}

// ============================================================
// PROJECT
// ============================================================
export interface BrandProject {
  id: string;                   // Firestore document ID e.g. "proj_abc123"
  userId?: string;              // optional – null for anonymous sessions
  input: BrandInput;
  generatedNames: BrandName[];
  selectedName?: BrandName;     // set after user picks a favourite
  logoConcepts?: LogoConcept[]; // populated after logo generation step
  selectedLogo?: LogoConcept;   // set after user picks a logo
  createdAt: string;            // ISO 8601 timestamp
  updatedAt: string;            // ISO 8601 timestamp
}
```

---

### `packages/shared/src/types/api.types.ts`

```typescript
import type {
  BrandInput,
  BrandName,
  LogoConcept,
  BrandProject,
  DomainAvailability,
} from './brand.types';

// ─────────────────────────────────────────────
// POST /api/brand/generate
// ─────────────────────────────────────────────
export interface GenerateBrandRequest {
  input: BrandInput;
  count?: number; // default: 12
}

export interface GenerateBrandResponse {
  projectId: string;
  names: BrandName[];
}

// ─────────────────────────────────────────────
// POST /api/brand/logos
// ─────────────────────────────────────────────
export interface GenerateLogosRequest {
  projectId: string;
  selectedName: BrandName;
  count?: number; // default: 4
}

export interface GenerateLogosResponse {
  logos: LogoConcept[];
}

// ─────────────────────────────────────────────
// POST /api/domain/check
// ─────────────────────────────────────────────
export interface CheckDomainsRequest {
  names: string[]; // raw brand name strings e.g. ["Verdant", "Leafwise"]
}

export interface CheckDomainsResponse {
  results: Record<string, DomainAvailability>; // keyed by brand name string
}

// ─────────────────────────────────────────────
// POST /api/brand/save
// ─────────────────────────────────────────────
export interface SaveProjectRequest {
  project: Omit<BrandProject, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface SaveProjectResponse {
  id: string;
  message: string;
}

// ─────────────────────────────────────────────
// GET /api/projects/:id
// ─────────────────────────────────────────────
export type GetProjectResponse = BrandProject;

// ─────────────────────────────────────────────
// Error Response (all endpoints)
// ─────────────────────────────────────────────
export interface ApiError {
  error: string;      // machine-readable error code e.g. "OPENAI_ERROR"
  message: string;    // human-readable description
  statusCode: number; // HTTP status code
}
```

---

## API Contracts (Complete Reference)

### POST `/api/brand/generate`

| Field | Value |
|---|---|
| **Owner** | Role 3 (AI/API) |
| **Purpose** | Single call — returns names, taglines, meanings, and visual directions |
| **Expected Latency** | 8–15 seconds (GPT-4o streaming optional) |
| **Auth** | None (anonymous session) |
| **Content-Type** | `application/json` |

**Request:**

```json
{
  "input": {
    "businessName": "",
    "industry": "sustainable productivity",
    "targetAudience": "remote workers aged 25-40",
    "mission": "make remote work feel connected and eco-conscious",
    "tone": "professional",
    "constraints": "must feel trustworthy, avoid tech clichés"
  },
  "count": 12
}
```

**Response `200 OK`:**

```json
{
  "projectId": "proj_abc123",
  "names": [
    {
      "id": "name_001",
      "name": "Verdant",
      "meaning": "From 'verdant' meaning lush and green — evokes growth, nature, and sustainable progress.",
      "tagline": "Where green teams thrive.",
      "domainAvailability": {
        "com": true,
        "io": false,
        "co": true,
        "handle": { "twitter": true, "instagram": false }
      },
      "visualDirection": {
        "palette": [
          { "hex": "#2D6A4F", "name": "Forest Green",  "role": "primary"    },
          { "hex": "#95D5B2", "name": "Sage",           "role": "secondary"  },
          { "hex": "#F7F3E9", "name": "Cream",          "role": "background" },
          { "hex": "#1B4332", "name": "Deep Forest",    "role": "text"       },
          { "hex": "#D4A373", "name": "Warm Sand",      "role": "accent"     }
        ],
        "fonts": {
          "headline": "Inter",
          "body": "Merriweather",
          "headlineWeight": "700",
          "bodyWeight": "400"
        },
        "styleDescription": "Modern and clean with warm natural accents. Trustworthy yet approachable. Designed to feel like fresh air in a cluttered productivity space."
      }
    }
    // ... 11 more name objects
  ]
}
```

**Error Response `429 Too Many Requests`:**

```json
{ "error": "OPENAI_ERROR", "message": "Rate limit exceeded", "statusCode": 429 }
```

**Other Error Codes:**

| `error` | `statusCode` | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Missing required fields in `input` |
| `OPENAI_ERROR` | 502 | OpenAI API failure or rate limit |
| `PARSE_ERROR` | 502 | GPT returned invalid JSON |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

### POST `/api/brand/logos`

| Field | Value |
|---|---|
| **Owner** | Role 3 (AI/API) |
| **Purpose** | Generate logo image concepts via DALL-E 3 for a selected brand name |
| **Expected Latency** | 15–30 seconds (DALL-E 3, sequential or parallel) |
| **Auth** | None |
| **Content-Type** | `application/json` |

**Request:**

```json
{
  "projectId": "proj_abc123",
  "selectedName": {
    "id": "name_001",
    "name": "Verdant",
    "meaning": "From 'verdant' meaning lush and green — evokes growth, nature, and sustainable progress.",
    "tagline": "Where green teams thrive.",
    "domainAvailability": {
      "com": true, "io": false, "co": true,
      "handle": { "twitter": true, "instagram": false }
    },
    "visualDirection": {
      "palette": [
        { "hex": "#2D6A4F", "name": "Forest Green",  "role": "primary"    },
        { "hex": "#95D5B2", "name": "Sage",           "role": "secondary"  },
        { "hex": "#F7F3E9", "name": "Cream",          "role": "background" },
        { "hex": "#1B4332", "name": "Deep Forest",    "role": "text"       },
        { "hex": "#D4A373", "name": "Warm Sand",      "role": "accent"     }
      ],
      "fonts": {
        "headline": "Inter",
        "body": "Merriweather",
        "headlineWeight": "700",
        "bodyWeight": "400"
      },
      "styleDescription": "Modern and clean with warm natural accents."
    }
  },
  "count": 4
}
```

**Response `200 OK`:**

```json
{
  "logos": [
    {
      "id": "logo_001",
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "prompt": "Professional logo design for a brand called \"Verdant\". Sustainable productivity industry brand targeting remote workers aged 25-40. Visual style: Modern and clean with warm natural accents. Color palette: Forest Green, Sage, Cream. Logo style: minimal, modern, scalable vector-style mark with wordmark. Background: white.",
      "style": "minimal"
    },
    {
      "id": "logo_002",
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "prompt": "Professional geometric logo for \"Verdant\", sustainable productivity startup. Geometric leaf or growth icon. Colors: Forest Green (#2D6A4F) and Sage (#95D5B2). Clean wordmark below. White background.",
      "style": "geometric"
    },
    {
      "id": "logo_003",
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "prompt": "Abstract wordmark logo for \"Verdant\". Typography-first design with subtle organic letterform. Forest Green on white. Modern sans-serif. No icons.",
      "style": "wordmark"
    },
    {
      "id": "logo_004",
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "prompt": "Illustrative badge-style logo for \"Verdant\", eco-productivity brand. Small botanical illustration integrated with clean typesetting. Forest Green, Sage, Warm Sand palette. White background.",
      "style": "illustrative"
    }
  ]
}
```

**Error Response `404 Not Found`:**

```json
{ "error": "PROJECT_NOT_FOUND", "message": "No project found with id proj_abc123", "statusCode": 404 }
```

---

### POST `/api/domain/check`

| Field | Value |
|---|---|
| **Owner** | Role 3 (AI/API) |
| **Purpose** | Check `.com`, `.io`, `.co` availability and social handle availability for a list of brand names |
| **Expected Latency** | 2–5 seconds (parallel DNS / mock in hackathon) |
| **Auth** | None |
| **Content-Type** | `application/json` |
| **Note** | In hackathon scope, this may return **mocked/randomised** data. Mark clearly in UI. |

**Request:**

```json
{
  "names": ["Verdant", "Leafwise", "Terraq", "Driftwork", "Compass"]
}
```

**Response `200 OK`:**

```json
{
  "results": {
    "Verdant": {
      "com": true,
      "io": false,
      "co": true,
      "handle": { "twitter": true, "instagram": false }
    },
    "Leafwise": {
      "com": false,
      "io": true,
      "co": true,
      "handle": { "twitter": true, "instagram": true }
    },
    "Terraq": {
      "com": true,
      "io": true,
      "co": false,
      "handle": { "twitter": false, "instagram": true }
    },
    "Driftwork": {
      "com": false,
      "io": false,
      "co": true,
      "handle": { "twitter": true, "instagram": false }
    },
    "Compass": {
      "com": false,
      "io": false,
      "co": false,
      "handle": { "twitter": false, "instagram": false }
    }
  }
}
```

**Error Response `400 Bad Request`:**

```json
{ "error": "VALIDATION_ERROR", "message": "names must be a non-empty array of strings", "statusCode": 400 }
```

---

### POST `/api/brand/save`

| Field | Value |
|---|---|
| **Owner** | Role 4 (DevOps/DB) |
| **Purpose** | Persist a brand project to Firestore; returns the generated document ID |
| **Expected Latency** | < 1 second |
| **Auth** | None (anonymous save) |
| **Content-Type** | `application/json` |

**Request:**

```json
{
  "project": {
    "userId": null,
    "input": {
      "businessName": "",
      "industry": "sustainable productivity",
      "targetAudience": "remote workers aged 25-40",
      "mission": "make remote work feel connected and eco-conscious",
      "tone": "professional",
      "constraints": "must feel trustworthy, avoid tech clichés"
    },
    "generatedNames": [ /* array of BrandName objects */ ],
    "selectedName": {
      "id": "name_001",
      "name": "Verdant",
      "meaning": "From 'verdant' meaning lush and green.",
      "tagline": "Where green teams thrive.",
      "domainAvailability": {
        "com": true, "io": false, "co": true,
        "handle": { "twitter": true, "instagram": false }
      },
      "visualDirection": {
        "palette": [
          { "hex": "#2D6A4F", "name": "Forest Green", "role": "primary" },
          { "hex": "#95D5B2", "name": "Sage",          "role": "secondary" },
          { "hex": "#F7F3E9", "name": "Cream",         "role": "background" },
          { "hex": "#1B4332", "name": "Deep Forest",   "role": "text" },
          { "hex": "#D4A373", "name": "Warm Sand",     "role": "accent" }
        ],
        "fonts": { "headline": "Inter", "body": "Merriweather", "headlineWeight": "700", "bodyWeight": "400" },
        "styleDescription": "Modern and clean with warm natural accents."
      }
    },
    "logoConcepts": [ /* array of LogoConcept objects */ ],
    "selectedLogo": {
      "id": "logo_001",
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
      "prompt": "Professional logo design for a brand called Verdant...",
      "style": "minimal"
    }
  }
}
```

**Response `201 Created`:**

```json
{
  "id": "proj_abc123",
  "message": "Project saved successfully"
}
```

**Error Response `500 Internal Server Error`:**

```json
{ "error": "FIRESTORE_ERROR", "message": "Failed to write to database", "statusCode": 500 }
```

---

### GET `/api/projects/:id`

| Field | Value |
|---|---|
| **Owner** | Role 4 (DevOps/DB) |
| **Purpose** | Retrieve a previously saved brand project by its Firestore document ID |
| **Expected Latency** | < 500ms |
| **Auth** | None |
| **URL Param** | `:id` — the project ID returned by `POST /api/brand/save` |

**Request:** No body. Example: `GET /api/projects/proj_abc123`

**Response `200 OK`:** Full `BrandProject` object

```json
{
  "id": "proj_abc123",
  "userId": null,
  "input": {
    "businessName": "",
    "industry": "sustainable productivity",
    "targetAudience": "remote workers aged 25-40",
    "mission": "make remote work feel connected and eco-conscious",
    "tone": "professional",
    "constraints": "must feel trustworthy, avoid tech clichés"
  },
  "generatedNames": [
    {
      "id": "name_001",
      "name": "Verdant",
      "meaning": "From 'verdant' meaning lush and green — evokes growth, nature, and sustainable progress.",
      "tagline": "Where green teams thrive.",
      "domainAvailability": {
        "com": true, "io": false, "co": true,
        "handle": { "twitter": true, "instagram": false }
      },
      "visualDirection": {
        "palette": [
          { "hex": "#2D6A4F", "name": "Forest Green",  "role": "primary"    },
          { "hex": "#95D5B2", "name": "Sage",           "role": "secondary"  },
          { "hex": "#F7F3E9", "name": "Cream",          "role": "background" },
          { "hex": "#1B4332", "name": "Deep Forest",    "role": "text"       },
          { "hex": "#D4A373", "name": "Warm Sand",      "role": "accent"     }
        ],
        "fonts": { "headline": "Inter", "body": "Merriweather", "headlineWeight": "700", "bodyWeight": "400" },
        "styleDescription": "Modern and clean with warm natural accents. Trustworthy yet approachable."
      }
    }
  ],
  "selectedName": { /* BrandName object */ },
  "logoConcepts": [ /* LogoConcept[] */ ],
  "selectedLogo": { /* LogoConcept object */ },
  "createdAt": "2024-11-15T09:00:00.000Z",
  "updatedAt": "2024-11-15T09:42:17.000Z"
}
```

**Error Response `404 Not Found`:**

```json
{ "error": "NOT_FOUND", "message": "Project proj_abc123 does not exist", "statusCode": 404 }
```

---

## Mock Data (Copy-Paste Ready for Role 2)

Drop this file into `packages/shared/src/mocks/mockData.ts` and import what you need.

### Mock Brand Project (5 Names)

```typescript
import type { BrandProject, LogoConcept, CheckDomainsResponse } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK BRAND PROJECT
// Use this in Role 2 (Frontend) until the backend is live.
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_BRAND_PROJECT: BrandProject = {
  id: 'proj_mock001',
  userId: undefined,
  createdAt: '2024-11-15T09:00:00.000Z',
  updatedAt: '2024-11-15T09:00:00.000Z',
  input: {
    businessName: '',
    industry: 'sustainable productivity',
    targetAudience: 'remote workers aged 25-40',
    mission: 'make remote work feel connected and eco-conscious',
    tone: 'professional',
    constraints: 'must feel trustworthy, avoid tech clichés',
  },
  generatedNames: [
    // ── 1. Verdant ──────────────────────────────────────────────────────────
    {
      id: 'name_001',
      name: 'Verdant',
      meaning: "From 'verdant' — lush and green. Evokes natural growth and eco-conscious progress.",
      tagline: 'Where green teams thrive.',
      domainAvailability: {
        com: true, io: false, co: true,
        handle: { twitter: true, instagram: false },
      },
      visualDirection: {
        palette: [
          { hex: '#2D6A4F', name: 'Forest Green', role: 'primary'    },
          { hex: '#95D5B2', name: 'Sage',          role: 'secondary'  },
          { hex: '#F7F3E9', name: 'Cream',         role: 'background' },
          { hex: '#1B4332', name: 'Deep Forest',   role: 'text'       },
          { hex: '#D4A373', name: 'Warm Sand',     role: 'accent'     },
        ],
        fonts: { headline: 'Inter', body: 'Merriweather', headlineWeight: '700', bodyWeight: '400' },
        styleDescription:
          'Modern and clean with warm natural accents. Trustworthy yet approachable. Feels like fresh air in a cluttered productivity space.',
      },
    },

    // ── 2. Leafwise ─────────────────────────────────────────────────────────
    {
      id: 'name_002',
      name: 'Leafwise',
      meaning: 'Leaf + wise — smarter sustainability. Implies intelligent, nature-aligned decisions.',
      tagline: 'Work smarter. Tread lighter.',
      domainAvailability: {
        com: false, io: true, co: true,
        handle: { twitter: true, instagram: true },
      },
      visualDirection: {
        palette: [
          { hex: '#386641', name: 'Clover',        role: 'primary'    },
          { hex: '#A7C957', name: 'Lime Leaf',     role: 'secondary'  },
          { hex: '#F2F4F3', name: 'Frost White',   role: 'background' },
          { hex: '#1A1A2E', name: 'Night Ink',     role: 'text'       },
          { hex: '#FFC857', name: 'Golden Hour',   role: 'accent'     },
        ],
        fonts: { headline: 'Poppins', body: 'Source Sans Pro', headlineWeight: '600', bodyWeight: '400' },
        styleDescription:
          'Energetic and optimistic with a grounded green palette. The yellow accent brings warmth and momentum. Clean, airy layouts with confident typography.',
      },
    },

    // ── 3. Terraq ───────────────────────────────────────────────────────────
    {
      id: 'name_003',
      name: 'Terraq',
      meaning: "Invented from 'terra' (earth) + a modern 'q' suffix. Grounded, distinctive, tech-friendly.",
      tagline: 'Grounded work. Boundless potential.',
      domainAvailability: {
        com: true, io: true, co: false,
        handle: { twitter: false, instagram: true },
      },
      visualDirection: {
        palette: [
          { hex: '#6B4226', name: 'Terracotta',    role: 'primary'    },
          { hex: '#C8A882', name: 'Sand Dune',     role: 'secondary'  },
          { hex: '#FAF7F2', name: 'Linen',         role: 'background' },
          { hex: '#2C2416', name: 'Dark Espresso', role: 'text'       },
          { hex: '#4A7C59', name: 'Moss',          role: 'accent'     },
        ],
        fonts: { headline: 'Space Grotesk', body: 'Lora', headlineWeight: '700', bodyWeight: '400' },
        styleDescription:
          'Earthy and artisan with a modern edge. Terracotta and sand evoke stability and craftsmanship. The moss accent ties back to eco-conscious values.',
      },
    },

    // ── 4. Driftwork ────────────────────────────────────────────────────────
    {
      id: 'name_004',
      name: 'Driftwork',
      meaning: "Drift + work — the idea of flowing, effortless productivity. Work that doesn't feel like work.",
      tagline: 'Flow into your best work.',
      domainAvailability: {
        com: false, io: false, co: true,
        handle: { twitter: true, instagram: false },
      },
      visualDirection: {
        palette: [
          { hex: '#4361EE', name: 'Ocean Blue',    role: 'primary'    },
          { hex: '#7B9FFF', name: 'Sky Drift',     role: 'secondary'  },
          { hex: '#EDF2FF', name: 'Cloud White',   role: 'background' },
          { hex: '#0D1B2A', name: 'Midnight',      role: 'text'       },
          { hex: '#F72585', name: 'Signal Pink',   role: 'accent'     },
        ],
        fonts: { headline: 'Plus Jakarta Sans', body: 'DM Sans', headlineWeight: '800', bodyWeight: '400' },
        styleDescription:
          'Fluid and dynamic with a tech-forward energy. Blues create a sense of calm focus while the bold pink accent adds unexpected vitality. Feels like Notion meets Figma.',
      },
    },

    // ── 5. Compass ──────────────────────────────────────────────────────────
    {
      id: 'name_005',
      name: 'Compass',
      meaning: "A universal navigation metaphor — Compass gives remote workers a sense of direction and alignment.",
      tagline: 'Find your direction. Together.',
      domainAvailability: {
        com: false, io: false, co: false,
        handle: { twitter: false, instagram: false },
      },
      visualDirection: {
        palette: [
          { hex: '#2B2D42', name: 'Charcoal Navy',  role: 'primary'    },
          { hex: '#8D99AE', name: 'Steel Blue',      role: 'secondary'  },
          { hex: '#F8F9FA', name: 'Platinum',        role: 'background' },
          { hex: '#14151A', name: 'Obsidian',        role: 'text'       },
          { hex: '#EF233C', name: 'True North Red',  role: 'accent'     },
        ],
        fonts: { headline: 'Sora', body: 'IBM Plex Sans', headlineWeight: '700', bodyWeight: '400' },
        styleDescription:
          'Bold and authoritative with a premium feel. Charcoal navy communicates trust and leadership. The red accent acts like a compass needle — purposeful and precise.',
      },
    },
  ],

  selectedName: undefined,
  logoConcepts: undefined,
  selectedLogo: undefined,
};
```

---

### Mock Logo Concepts

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// MOCK LOGO CONCEPTS
// Placeholder images from picsum.photos until DALL-E responses are wired up.
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_LOGO_CONCEPTS: LogoConcept[] = [
  {
    id: 'logo_001',
    url: 'https://picsum.photos/400/400?random=1',
    prompt:
      'Professional logo design for a brand called "Verdant". Sustainable productivity industry. Minimal, modern, scalable vector-style mark with wordmark. Forest Green and Sage palette. White background.',
    style: 'minimal',
  },
  {
    id: 'logo_002',
    url: 'https://picsum.photos/400/400?random=2',
    prompt:
      'Geometric logo for "Verdant". Leaf or growth-inspired geometric icon in Forest Green (#2D6A4F). Clean sans-serif wordmark below. White background.',
    style: 'geometric',
  },
  {
    id: 'logo_003',
    url: 'https://picsum.photos/400/400?random=3',
    prompt:
      'Abstract wordmark for "Verdant". Typography-driven design, organic letterform treatment. Forest Green on white. No icons.',
    style: 'wordmark',
  },
  {
    id: 'logo_004',
    url: 'https://picsum.photos/400/400?random=4',
    prompt:
      'Illustrative badge logo for "Verdant". Subtle botanical illustration combined with clean type. Forest Green, Sage, and Warm Sand. White background.',
    style: 'illustrative',
  },
];
```

---

### Mock Domain Check Response

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// MOCK DOMAIN CHECK RESPONSE
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_DOMAIN_RESULTS: CheckDomainsResponse = {
  results: {
    Verdant: {
      com: true,
      io: false,
      co: true,
      handle: { twitter: true, instagram: false },
    },
    Leafwise: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    Terraq: {
      com: true,
      io: true,
      co: false,
      handle: { twitter: false, instagram: true },
    },
    Driftwork: {
      com: false,
      io: false,
      co: true,
      handle: { twitter: true, instagram: false },
    },
    Compass: {
      com: false,
      io: false,
      co: false,
      handle: { twitter: false, instagram: false },
    },
  },
};
```

---

### Convenience Mock API Functions (for Role 2 local dev)

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// MOCK API — import these instead of real fetch calls during local development.
// Swap out by changing VITE_USE_MOCK_API=true in your .env.local
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const mockGenerateBrand = async (): Promise<{ projectId: string; names: BrandProject['generatedNames'] }> => {
  await delay(1500); // simulate network latency
  return { projectId: MOCK_BRAND_PROJECT.id, names: MOCK_BRAND_PROJECT.generatedNames };
};

export const mockGenerateLogos = async (): Promise<{ logos: LogoConcept[] }> => {
  await delay(1000);
  return { logos: MOCK_LOGO_CONCEPTS };
};

export const mockCheckDomains = async (): Promise<CheckDomainsResponse> => {
  await delay(600);
  return MOCK_DOMAIN_RESULTS;
};

export const mockSaveProject = async (): Promise<{ id: string; message: string }> => {
  await delay(400);
  return { id: MOCK_BRAND_PROJECT.id, message: 'Project saved successfully' };
};

export const mockGetProject = async (): Promise<BrandProject> => {
  await delay(300);
  return { ...MOCK_BRAND_PROJECT, selectedName: MOCK_BRAND_PROJECT.generatedNames[0] };
};
```

---

## Firestore Schema

### Collection: `brandProjects`

```
brandProjects/{projectId}
  ├─ userId:          string | null          # null for anonymous sessions
  ├─ input:           BrandInput             # (map) full input object
  │    ├─ businessName:   string | null
  │    ├─ industry:       string
  │    ├─ targetAudience: string
  │    ├─ mission:        string
  │    ├─ tone:           string             # one of BrandTone values
  │    └─ constraints:    string
  ├─ generatedNames:  BrandName[]            # (array of maps)
  │    └─ [each item]
  │         ├─ id:                  string
  │         ├─ name:                string
  │         ├─ meaning:             string
  │         ├─ tagline:             string
  │         ├─ domainAvailability:  map
  │         │    ├─ com:    boolean
  │         │    ├─ io:     boolean
  │         │    ├─ co:     boolean
  │         │    └─ handle: map { twitter: boolean, instagram: boolean }
  │         └─ visualDirection:     map
  │              ├─ palette:          array of maps (hex, name, role)
  │              ├─ fonts:            map (headline, body, weights)
  │              └─ styleDescription: string
  ├─ selectedName:    BrandName | null       # (map) after user selects a name
  ├─ logoConcepts:    LogoConcept[]          # (array of maps)
  │    └─ [each item]
  │         ├─ id:     string
  │         ├─ url:    string
  │         ├─ prompt: string
  │         └─ style:  string               # one of LogoStyle values
  ├─ selectedLogo:    LogoConcept | null     # (map) after user selects a logo
  ├─ createdAt:       Timestamp             # Firestore server timestamp
  └─ updatedAt:       Timestamp             # Firestore server timestamp
```

> [!NOTE]
> Use `FieldValue.serverTimestamp()` for `createdAt` and `updatedAt` — never client-side `Date.now()`. This ensures consistent ordering across time zones.

**Firestore Security Rules (starter):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /brandProjects/{projectId} {
      // Anyone can create or read — no auth required for hackathon MVP
      allow read, create: if true;
      // Only allow update if the userId matches (or is null for anon)
      allow update: if resource.data.userId == null
                    || request.auth.uid == resource.data.userId;
      allow delete: if false;
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

### Collection: `users` *(stretch goal)*

```
users/{userId}
  ├─ email:        string
  ├─ displayName:  string
  ├─ projectIds:   string[]     # array of brandProject document IDs
  └─ createdAt:    Timestamp
```

---

## OpenAI Prompt Templates

### Brand Name + Tagline + Visual Direction (Single GPT-4o Call)

```typescript
// packages/api/src/prompts/brandGeneration.ts

import type { BrandInput } from '@upstream/shared';

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// Role 3: do NOT modify the JSON schema block — it must exactly match BrandName.
// ─────────────────────────────────────────────────────────────────────────────
export const BRAND_GENERATION_SYSTEM_PROMPT = `You are an expert brand strategist and naming consultant with 20 years of experience. You create memorable, distinctive brand names for startups.

Your naming philosophy:
- Great names are short (≤12 chars), memorable, and distinctive
- They evoke emotion, not just description
- Think Spotify, Canva, Notion, Figma, Linear — one concept, instantly understood
- Mix naming styles: invented words, nature metaphors, abstract concepts, portmanteaus

You MUST respond with valid JSON only. No markdown. No explanation outside the JSON. No trailing commas.

Response format (strict):
{
  "names": [
    {
      "name": "string — max 12 characters, no spaces",
      "meaning": "string — 1 sentence: etymology or concept. Start with the word itself.",
      "tagline": "string — 5 to 10 words, punchy and brand-ready",
      "visualDirection": {
        "palette": [
          { "hex": "#XXXXXX", "name": "Color Name", "role": "primary" },
          { "hex": "#XXXXXX", "name": "Color Name", "role": "secondary" },
          { "hex": "#XXXXXX", "name": "Color Name", "role": "background" },
          { "hex": "#XXXXXX", "name": "Color Name", "role": "text" },
          { "hex": "#XXXXXX", "name": "Color Name", "role": "accent" }
        ],
        "fonts": {
          "headline": "Google Font name",
          "body": "Google Font name",
          "headlineWeight": "700",
          "bodyWeight": "400"
        },
        "styleDescription": "2-3 sentences describing the visual style, feel, and brand world."
      }
    }
  ]
}

Rules:
- Each name must have exactly 5 palette entries (one per role: primary, secondary, background, text, accent)
- Use only real Google Fonts (Inter, Poppins, Merriweather, Lora, Space Grotesk, DM Sans, etc.)
- Each name must have a UNIQUE visual direction — different palettes, different fonts
- text role hex must have sufficient contrast against the background role hex (WCAG AA)
- background role should be near-white or very light unless brand tone demands otherwise`;

// ─────────────────────────────────────────────────────────────────────────────
// USER PROMPT BUILDER
// ─────────────────────────────────────────────────────────────────────────────
export const buildBrandGenerationUserPrompt = (
  input: BrandInput,
  count: number = 12,
): string => `
Generate ${count} creative brand names for the following business:

Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Mission / Values: ${input.mission}
Brand Tone: ${input.tone}
Constraints: ${input.constraints || 'None'}
${input.businessName ? `Existing Name Inspiration: ${input.businessName}` : ''}

Naming mix requirements (approximate distribution across ${count} names):
- 3 descriptive / metaphorical names (e.g. nature, journey, light)
- 3 invented / portmanteau words (e.g. Terraq, Driftly, Lumiq)
- 3 abstract / conceptual names (e.g. Compass, Plane, Apex)
- 3 punny / playful names (if tone allows, otherwise replace with metaphorical)

Return exactly ${count} names as a JSON array inside the "names" key.
`;

// ─────────────────────────────────────────────────────────────────────────────
// OPENAI CALL EXAMPLE
// ─────────────────────────────────────────────────────────────────────────────
/*
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: BRAND_GENERATION_SYSTEM_PROMPT },
    { role: 'user',   content: buildBrandGenerationUserPrompt(input, count) },
  ],
  temperature: 0.9,   // higher for creative variety
  max_tokens: 6000,   // generous for 12 names with full visual directions
});

const parsed = JSON.parse(completion.choices[0].message.content ?? '{}');
const names: BrandName[] = parsed.names; // validate before returning
*/
```

---

### DALL-E 3 Logo Generation Prompt

```typescript
// packages/api/src/prompts/logoGeneration.ts

import type { BrandName, BrandInput, LogoStyle } from '@upstream/shared';

// ─────────────────────────────────────────────────────────────────────────────
// LOGO PROMPT BUILDER
// Generates style-specific DALL-E 3 prompts for each logo concept.
// ─────────────────────────────────────────────────────────────────────────────
export const buildLogoPrompt = (
  brandName: BrandName,
  input: BrandInput,
  style: LogoStyle,
): string => {
  const primaryColor = brandName.visualDirection.palette.find(
    (c) => c.role === 'primary',
  );
  const secondaryColor = brandName.visualDirection.palette.find(
    (c) => c.role === 'secondary',
  );
  const colorNames = brandName.visualDirection.palette.map((c) => c.name).join(', ');

  const styleDescriptions: Record<LogoStyle, string> = {
    minimal:
      'A clean, minimal logo mark — simple geometric shape or single letterform, scalable at any size.',
    wordmark:
      'A typography-first wordmark. Lettering only, no icon. Creative letterform treatment, premium feel.',
    abstract:
      'An abstract logomark — non-representational shape that evokes the brand essence. No literal imagery.',
    geometric:
      'A bold geometric icon — triangles, hexagons, or grid-based forms. Mathematical precision.',
    illustrative:
      'A detailed illustrative mark — small scene or character that tells a brand story. Craft and warmth.',
  };

  return `Professional logo design for "${brandName.name}" brand.

Brand context: ${input.industry} company targeting ${input.targetAudience}.
Brand style: ${brandName.visualDirection.styleDescription}

Logo style: ${styleDescriptions[style]}
Primary color: ${primaryColor?.name} (${primaryColor?.hex})
Secondary color: ${secondaryColor?.name} (${secondaryColor?.hex})
Full palette reference: ${colorNames}

Technical requirements:
- White or transparent background
- Logo must be centered with generous padding
- No decorative borders, frames, or watermarks
- No text that says "logo" or "design"
- Scalable vector aesthetic — clean edges, no raster textures
- The brand name "${brandName.name}" should appear as clean typography below or integrated with the mark

Output: A single, production-ready logo concept on white background.`;
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGO STYLES TO GENERATE (default 4 per name, one per style)
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_LOGO_STYLES: LogoStyle[] = [
  'minimal',
  'geometric',
  'wordmark',
  'illustrative',
];

// ─────────────────────────────────────────────────────────────────────────────
// DALL-E 3 CALL EXAMPLE
// ─────────────────────────────────────────────────────────────────────────────
/*
const logoPromises = DEFAULT_LOGO_STYLES.map(async (style, index) => {
  const prompt = buildLogoPrompt(selectedName, input, style);
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'natural',
  });
  return {
    id: `logo_00${index + 1}`,
    url: response.data[0].url ?? '',
    prompt,
    style,
  } satisfies LogoConcept;
});

const logos = await Promise.all(logoPromises);
*/
```

---

## Environment Variables Reference

| Variable | Required By | Where to Get | Example Value |
|---|---|---|---|
| `OPENAI_API_KEY` | Role 3 | [platform.openai.com](https://platform.openai.com/api-keys) | `sk-proj-...` |
| `FIREBASE_PROJECT_ID` | Role 4 | Firebase Console → Project Settings | `upstream-hack-2024` |
| `FIREBASE_PRIVATE_KEY` | Role 4 | Firebase Console → Service Accounts → Generate Key | `-----BEGIN PRIVATE KEY-----\n...` |
| `FIREBASE_CLIENT_EMAIL` | Role 4 | Firebase Console → Service Accounts | `firebase-adminsdk@upstream-hack-2024.iam.gserviceaccount.com` |
| `PORT` | Role 4 | Set manually | `3001` |
| `NODE_ENV` | Role 4 | Set manually | `development` |
| `CLIENT_URL` | Role 4 | Vercel deploy URL or localhost | `http://localhost:5173` |
| `VITE_API_URL` | Role 2 | Render deploy URL or localhost | `http://localhost:3001` |
| `VITE_USE_MOCK_API` | Role 2 | Set to `true` to use mock data | `true` |
| `VITE_FIREBASE_API_KEY` | Role 2 | Firebase Console → Web App Config | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Role 2 | Firebase Console → Web App Config | `upstream-hack-2024.firebaseapp.com` |

### `.env.example` files

**`packages/api/.env.example`:**

```bash
OPENAI_API_KEY=sk-proj-REPLACE_ME
FIREBASE_PROJECT_ID=upstream-hack-2024
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nREPLACE_ME\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@upstream-hack-2024.iam.gserviceaccount.com
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**`packages/web/.env.example`:**

```bash
VITE_API_URL=http://localhost:3001
VITE_USE_MOCK_API=true
VITE_FIREBASE_API_KEY=AIzaSy-REPLACE_ME
VITE_FIREBASE_AUTH_DOMAIN=upstream-hack-2024.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=upstream-hack-2024
```

> [!CAUTION]
> Never commit `.env` files with real secrets to git. The `.env.example` files should contain only placeholder values. Add `.env` to `.gitignore` before your first commit.

---

## Quick Validation Checklist

Before coding against these types, verify:

- [ ] You can import from `@upstream/shared` (monorepo workspace symlink is set up)
- [ ] `MOCK_BRAND_PROJECT` renders 5 name cards in the UI without errors
- [ ] `MOCK_LOGO_CONCEPTS` renders 4 logo cards using picsum placeholder images
- [ ] TypeScript shows no errors on the type imports
- [ ] `VITE_USE_MOCK_API=true` in `.env.local` so Role 2 never blocks on backend

---

*Document frozen at Hour 1. Contact Role 1 before proposing any changes.*
