# Upstream AI Brand Director — Agentic Architecture & Operational Blueprint

> **System Classification**: Multi-Agent Autonomous Brand Creation Platform  
> **Status**: Verified Operational & Live  
> **Host**: Client: `http://localhost:5173` | Server: `http://localhost:3001`

---

## 1. Executive Summary & Vision

Upstream is an enterprise-grade, autonomous **AI Brand Director**. Traditional brand builders are either static questionnaires or simple text chatbots that talk *about* design without touching the canvas. 

Upstream bridges this gap with a **tool-calling cognitive loop**:
1. **Conversational Intelligence**: Powered by **Groq `openai/gpt-oss-120b`**, the AI operates as a seasoned creative director and hands-on brand strategist.
2. **Vision & Multimodal Analysis**: Powered by **Cloudflare Workers AI `@cf/qwen/qwen3.8-27b`**, the system reads user-uploaded reference marks, certificate proofs, and design exemplars, translating raw imagery into rich visual grammar. (Groq is **not** a vision fallback — it hosts no Qwen VL model; `qwen/qwen3.8-27b` is a Cloudflare model id.)
3. **Generative Visual Synthesis**: Powered by **AICredits `black-forest-labs/flux-2-dev`** (with Pollinations.ai fallback), the system generates museum-grade vector logos, certificates of authenticity, and cohesive visual identities.
4. **Active Workspace State Mutation**: When the user instructs the chatbot ("change the name", "generate a mark", "issue a certificate", "darken the palette"), the AI does not just respond in text — **it invokes server-side tools that execute the action, persist the asset, and live-update the artboard**.

---

## 2. Architecture Topology

```
                                  ┌───────────────────────────────┐
                                  │   User Prompt / Image Upload  │
                                  └───────────────┬───────────────┘
                                                  │
                                                  ▼
                         ┌─────────────────────────────────────────────────┐
                         │              Upstream Client (React)            │
                         │   • Studio Artboard / Canvas                    │
                         │   • Real-Time Interactive Design Controls       │
                         │   • Autonomous Agent Chat Interface             │
                         └────────────────────────┬────────────────────────┘
                                                  │ HTTP POST /api/brand/chat
                                                  ▼
                         ┌─────────────────────────────────────────────────┐
                         │             Express Server Engine               │
                         │   • Controller: runAgentChat()                  │
                         │   • Context Resolution & State Snapshot         │
                         └────────────────────────┬────────────────────────┘
                                                  │
                                                  ▼
                         ┌─────────────────────────────────────────────────┐
                         │         Groq: GPT OSS 120B Cognitive Core       │
                         │   • Model: openai/gpt-oss-120b                  │
                         │   • Autonomous Tool Selection & Planning        │
                         └───────┬─────────────────────────────────┬───────┘
                                 │                                 │
           ┌─────────────────────┴─────────────┐                   │ Tool Call
           │ Evaluates & calls available tools │                   │ Finished
           ▼                                   ▼                   ▼
┌───────────────────────┐           ┌───────────────────────┐ ┌──────────────────────┐
│  Vision Intelligence  │           │   Image Generation    │ │ Structured Synthesis │
│  Cloudflare / Groq    │           │  AICredits FLUX.2-dev │ │ Returns:             │
│  Qwen 3.8 27B Vision  │           │  (Fallback: Pollen)   │ │ • reply (Markdown)   │
│  • Reads reference img│           │  • Logo marks         │ │ • toolCalls log      │
│  • Extracts geometry, │           │  • Certificates       │ │ • canvasPatch        │
│    palette & grammar  │           │  • Brand assets       │ │ • names / logos      │
└───────────────────────┘           └───────────────────────┘ └──────────┬───────────┘
                                                                         │
                                                                         ▼
                                                              Live Artboard Mutation
```

---

## 3. Tool Ecosystem (The Agent's Hands)

The LLM is granted 11 server-side tools. It inspects user intent, selects the optimal tool, executes it safely, and feeds the resulting state back into its reasoning loop.

| Tool Name | Engine / Dependency | Purpose & Capability |
| :--- | :--- | :--- |
| `generate_brand_names` | Groq `openai/gpt-oss-120b` | Generates 1–12 cohesive brand names with semantic etymology, taglines, 5-color palettes, font pairings, and domain availability. |
| `generate_logo_concepts` | AICredits `flux-2-dev` | Generates high-resolution vector logo concepts from scratch or adapted from archetypes. |
| `generate_brand_certificate` | AICredits `flux-2-dev` | Issues an ornate, museum-quality Certificate of Brand Authenticity or Trademark Registration with gold seal & guilloche security borders. |
| `describe_image` | Cloudflare `@cf/qwen/qwen3.8-27b` | Inspects uploaded images, certificates, or screenshots and extracts visual grammar, shape contours, and typography. |
| `check_domain_availability` | Domain Service | Live checks `.com`, `.io`, `.co` and social handles (`@twitter`, `@instagram`). |
| `update_brand_kit` | State Mutator | Performs non-destructive partial updates (name, tagline, tone, industry, mission). |
| `save_brand_asset` | Asset Store Service | Persists logos, certificates, palettes, or uploaded exemplars with durable IDs. |
| `list_brand_assets` | Asset Store Service | Retrieves stored project assets categorized by kind (`logo`, `certificate`, `palette`). |
| `get_project_state` | State Resolver | Reads active venture brief, candidate names, selected mark, and current workflow progress. |
| `set_canvas_state` | Artboard Mutator | Modifies artboard surface (`light`, `linen`, `dark`, `brand`), font sizes, letter tracking, or ink contrast. |
| `export_brand_kit` | Exporter | Packages the complete brand kit as structured JSON or publication-grade Markdown. |

---

## 4. Models & Providers Matrix

| Domain | Primary Provider | Model Identifier | Fallback Provider | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Conversational Chat & Strategy** | **Groq** | `openai/gpt-oss-120b` | Single-shot JSON director | **Live (497ms)** |
| **Vision & Image Description** | **Cloudflare Workers AI** | `@cf/qwen/qwen3.8-27b` | None (vision is skipped, prompt falls back to the archetype blueprint) | **Live (1276ms)** |
| **Logo & Visual Art Generation** | **AICredits.in** | `black-forest-labs/flux-2-dev` | Pollinations.ai FLUX | **Live (374ms probe / ~14s gen)** |
| **Emergency Image Fallback** | **Pollinations.ai** | `flux` | Local SVG procedural vector engine | **Live** |

---

## 5. Typical End-to-End Workflows

### Scenario A: Creating a New Venture from Scratch
1. **User**: *"I'm launching TorqueX, an aggressive high-performance electric automotive brand. Give me a dark visual identity and a logo."*
2. **Agent Planning**:
   - Analyzes brief: Industry = `Automotive / EV`, Tone = `bold`, Name = `TorqueX`.
   - Calls `update_brand_kit` with `{ field: 'businessName', value: 'TorqueX' }`.
   - Calls `set_canvas_state` with `{ surface: 'dark', headlineFont: 'Outfit', fontWeight: 800 }`.
   - Calls `generate_logo_concepts` with `brandName: 'TorqueX'`, `archetypeId: 'abstract'`, `preferredColors: ['#0F172A', '#EF4444', '#FFFFFF']`.
3. **Execution**:
   - `black-forest-labs/flux-2-dev` renders aerodynamic vector marks.
   - Canvas immediately shifts to dark surface, loads `TorqueX`, and mounts the generated logo mark.
   - Agent presents the finished identity with follow-up suggestions.

### Scenario B: Generating an Authenticity Certificate
1. **User**: *"Now generate an official certificate of authenticity for TorqueX."*
2. **Agent Planning**:
   - Calls `generate_brand_certificate` with `brandName: 'TorqueX'`, `industry: 'Automotive'`, `type: 'authenticity'`.
3. **Execution**:
   - FLUX.2-dev synthesizes a parchment certificate featuring gold embossed seals and guilloche borders.
   - The certificate is stored under project assets (`/api/assets/generated/certificate_...png`).
   - Agent reports the certificate URL and embeds it in the response.

### Scenario C: Image Adaptation via Vision
1. **User**: Uploads a reference emblem image or asks to emulate an existing logo.
2. **Agent Planning**:
   - Calls `describe_image` on the payload.
   - Cloudflare Qwen 3.8 27B analyzes the geometry: *"The mark consists of interlocking carbon-fiber chevrons rotating counter-clockwise with high-contrast beveling."*
   - Calls `generate_logo_concepts` incorporating the extracted visual grammar for the user's specific brand.

---

## 6. Verification & Health Monitoring

Upstream includes a live probe endpoint for real-time observability:
```bash
GET http://localhost:3001/api/brand/diagnostics
```

**Live Verification Output**:
```json
{
  "configured": {
    "chat": { "provider": "groq", "model": "openai/gpt-oss-120b", "configured": true },
    "vision": { "provider": "cloudflare", "model": "@cf/qwen/qwen3.8-27b", "configured": true },
    "image": { "provider": "aicredits", "model": "black-forest-labs/flux-2-dev", "configured": true },
    "imageFallback": { "provider": "pollinations", "model": "flux", "configured": true }
  },
  "probes": {
    "chat": { "provider": "groq", "reachable": true, "latencyMs": 497 },
    "vision": { "provider": "cloudflare-qwen-vision", "reachable": true, "latencyMs": 1276 },
    "image": { "provider": "aicredits-flux-2-dev", "reachable": true, "latencyMs": 374 }
  }
}
```

---

## 7. Operational Guidelines for Future Development

1. **Non-Destructive Canvas Updates**: Tool execution must only patch dirty fields. Existing sections and user choices must never be purged unless explicitly instructed.
2. **Dual-Path Resiliency**: Always maintain the secondary engine fallback (Pollinations behind AICredits for images; a blueprint-only prompt when Cloudflare vision is unreachable — there is no second vision provider, Groq hosts no Qwen VL model).
3. **Durable File Handling**: Never transmit raw inline base64 in list responses. Persist all generated images to `apps/server/public/generated/` and expose them via relative `/api/assets/generated/` URLs for proxy compatibility.
