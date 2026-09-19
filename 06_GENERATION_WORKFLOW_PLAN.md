# 06 — Generation Workflow Plan (Backend)

> **Scope**: backend only. No frontend files were modified by this work.
> **Status**: implemented and verified end-to-end against live providers (evidence in §9).
> **Last verified**: 2026-09-19, server `:3001`, client proxy `:5173`.

---

## 1. The three-provider contract

One job per provider. Mixing them up was the root cause of most of the original
failures — in particular, a vision call was being sent to Groq with a model Groq
does not host.

| Job | Provider | Model / endpoint | Verified |
|---|---|---|---|
| **Chat + tool calling** | Groq | `openai/gpt-oss-120b` (`POST https://api.groq.com/openai/v1/chat/completions`) | reachable, 490 ms |
| **Vision** (read an image → text) | Cloudflare Workers AI | `@cf/qwen/qwen3.8-27b` (`POST /accounts/{id}/ai/run/@cf/qwen/qwen3.8-27b`) | reachable, ~1.5 s |
| **Image generation** (text → image) | AICredits.in | `black-forest-labs/flux-2-dev` (`POST https://api.aicredits.in/v1/images/generations`) | reachable, 360 ms |
| Image fallback (tail only) | Pollinations.ai | `gen.pollinations.ai/image/<prompt>?model=flux` | key present |

**Explicitly not used:** Cloudflare for image generation (the `@cf/…/flux-2-dev`
route demands a multipart body and is slower than the AICredits gateway), Gemini
for anything (quota-dead), fal.ai (no key), Groq for vision (no Qwen VL models
exist there — `qwen/qwen3.8-27b` is a **Cloudflare** model id).

### Credentials (in `apps/server/.env`, git-ignored)

```dotenv
GROQ_API_KEY=gsk_…                       # chat
GROQ_MODEL=openai/gpt-oss-120b
CLOUDFLARE_API_TOKEN=cfat_…              # vision
CLOUDFLARE_ACCOUNT_ID=ba99d6a9…
CLOUDFLARE_VISION_MODEL=@cf/qwen/qwen3.8-27b
AICREDITS_API_KEY=sk-live-<hex>          # image generation
AICREDITS_BASE_URL=https://api.aicredits.in/v1
AICREDITS_IMAGE_MODEL=black-forest-labs/flux-2-dev
POLLINATIONS_API_KEY=sk_…                # last-resort image fallback
PUBLIC_BASE_URL=                         # empty → relative asset URLs
```

> ⚠️ **AICredits key format**: `sk-live-<60 hex>`. The hyphen between `live` and
> the hex block is required — the same key without it returns `401 Invalid API
> Key`. It is a per-key spend wallet (₹, prepaid), so treat it as a secret and
> never commit it; `.env` is already covered by `.gitignore:16`.

---

## 2. Request flows

### 2.1 Chat → tool loop → structured reply (`POST /api/brand/chat`)

```
user message (+ history, currentContext)
        │
        ▼
Groq gpt-oss-120b  ── tools = 11 backend functions, tool_choice = auto
        │
        ├─ finish_reason = tool_calls → executeTool() server-side
        │        └─ result fed back as a `tool` message → loop (max 4 rounds)
        │
        └─ no more tool calls
        ▼
Groq again, response_format = json_object, reasoning_effort = low
        ▼
{ reply, suggestions, detectedIntent, extractedBrief }   ← original contract
+ { engine, toolCalls, canvasPatch, names, logos, assets, projectId, exportedKit }
```

The response is a **strict superset** of the old shape, so the existing client
keeps working while newer consumers can read the extras. `reasoning_effort: low`
is applied only to the final formatting call — tool *selection* keeps the model's
default reasoning budget.

If the tool loop throws for any reason, the request degrades to the original
single-shot JSON director (`engine: "groq-json-fallback"`) instead of failing.

### 2.2 Scratch logo (`POST /api/brand/logos`, `mode: "scratch"`)

```
brandName + archetypeId + palette
        │
        ▼
prompt.service.buildLogoPrompt() → fluxPrompt      ← natural language, no --no flags
        │
        ▼
image.service.generateImageAssets(prompt, count)
        ├─ 1st: AICredits flux-2-dev  (b64_json → Buffer, mime sniffed)
        └─ 2nd: Pollinations flux     (only if AICredits returns nothing)
        │
        ▼
saveImageBuffer() → apps/server/public/generated/<name>.<ext>
        │
        ▼
LogoConcept.url = /api/assets/generated/<name>.<ext>   (served, cacheable)
```

If **both** providers fail, a locally drawn typographic SVG is returned so the
caller still gets a branded, legible result rather than nothing.

### 2.3 Template logo (`mode: "template"`)

```
reference mark (uploaded base64, or an archetype exemplar from
               "API & Others/Sample_Data/Images/<Archetype>/<file>")
        │
        ├─ Cloudflare @cf/qwen/qwen3.8-27b  ← the "eyes": returns visual grammar
        │
        ▼
fluxPrompt (archetype blueprint + wordmark pinned + vision notes)
        │
        ▼
AICredits flux-2-dev → persisted → served URL
```

### 2.4 Certificate (`POST /api/brand/chat` → `generate_brand_certificate`)

The agent composes a certificate prompt, renders it with FLUX.2 [dev], and
persists it as an asset of `kind: "certificate"` in the asset store.

### 2.5 Logo suite — closing the "artwork not connected" gap

The studio canvas offers five **fixed** style tiles and draws a procedural SVG for
each; the artwork pipeline thinks in **archetypes**. Those vocabularies overlap but
are not identical, which is why generated marks could never be mapped onto a
specific tile.

`POST /api/logos/suite` (and the `generate_logo_suite` agent tool) owns that
translation and returns marks **keyed by the style names the UI already uses**:

| Studio style | Archetype used | Wordmark rendered |
|---|---|---|
| `minimal` | `lettermark` | no (mark only) |
| `wordmark` | `wordmark` | yes |
| `abstract` | `abstract` | yes |
| `geometric` | `combination` | yes |
| `illustrative` | `pictorial` | yes |

```
POST /api/logos/suite
{ "brandName": "Aurae", "styles": ["wordmark","geometric"], "preferredColors": [...],
  "industry": "haute couture atelier", "tagline": "...", "concurrency": 3 }

→ { "success": true, "data": {
      "logos":   [ { "style": "wordmark", "url": "/api/assets/generated/logo_wordmark_….jpg", "assetId": "…" }, … ],
      "byStyle": { "wordmark": { "url": "…", "id": "…", "assetId": "…" }, … },
      "failures": [] } }
```

Rendering runs with bounded concurrency (default 3, AICredits allows 24 active
tasks) — two styles complete in ~17 s instead of ~30 s sequentially. A style that
fails is reported in `failures` while the rest of the suite still returns; the
endpoint answers `207` in that case. Marks are auto-persisted as `logo` assets
tagged with their style.

The agent's `logos[]` response field is built from `byStyle`, so the existing
client code (`aiRes.logos[0]` → `selectedLogo`) already receives real artwork
without any change to its own vocabulary.

---

## 3. Tool catalog — what the chatbot can actually do

Registered in `services/agentTools.service.ts`; dispatched by
`executeTool(name, args, ctx)`. **No tool ever throws** — failures return
`{ ok: false, error }` so the model can explain them in prose.

| # | Tool | Does | Returns |
|---|---|---|---|
| 1 | `generate_brand_names` | Groq naming: names + meanings + taglines + 5-colour palette + fonts + domain check; persists to the project | `names[]`, `projectId` |
| 2 | `generate_logo_concepts` | FLUX.2 [dev] logo artwork (scratch or template); auto-persists each concept | `logos[]` with URLs + `assetId` |
| 3 | `generate_logo_suite` | One mark per studio style in a single call, keyed by style name | `byStyle` map of URLs + `assetId` |
| 4 | `generate_brand_certificate` | Certificate of authenticity / trademark / founding / excellence artwork | `certificateUrl`, `assetId` |
| 5 | `describe_image` | Qwen 3.8 27B vision on a data URI, http URL, or an own-asset path | `description`, `model` |
| 6 | `check_domain_availability` | .com / .io / .co + Twitter / Instagram handles | `results` map |
| 7 | `update_brand_kit` | Partial update of one field (businessName, industry, audience, mission, tone, constraints, tagline) | updated project snapshot |
| 8 | `save_brand_asset` | Store a logo / certificate / reference / palette / kit | `assetId`, `url` |
| 9 | `list_brand_assets` | List stored assets, filterable by kind | `assets[]` |
| 10 | `get_project_state` | Read brief, names, selected name, logos, asset count | project snapshot |
| 11 | `export_brand_kit` | Assemble the kit as JSON or Markdown | `kit` / `markdown` |
| 12 | `set_canvas_state` | Adjust surface, fonts, sizes, tracking, ink | `canvasPatch` (partial) |

### The canvas rule (non-negotiable)

`set_canvas_state` accepts **only the keys that change** and returns a patch that
the caller must *merge*. The agent is instructed never to clear, reset or remove
a canvas section — an existing section must survive every instruction. Verified:
"put the canvas on the dark surface" returned exactly `{"bgMode":"dark"}` and
nothing else.

---

## 4. Response contract (`POST /api/brand/chat`)

```jsonc
{
  "reply": "markdown",
  "suggestions": ["…"],                  // 2-4 chips
  "detectedIntent": "greeting | new_brand | refine | question",
  "extractedBrief": { "businessName": "", "industry": "", "tone": "", "targetAudience": "", "mission": "" },

  // additive — safe to ignore, richer consumers use them
  "engine": "groq-tools | groq-json-fallback",
  "toolCalls": [{ "name": "generate_logo_concepts", "ok": true, "summary": "drew 2 logo concept(s)" }],
  "canvasPatch": { "bgMode": "dark" },
  "names":  [{ "id": "", "name": "", "tagline": "", "meaning": "" }],
  "logos":  [{ "id": "", "url": "/api/assets/generated/….jpg", "style": "wordmark", "mode": "scratch", "assetId": "" }],
  "assets": [{ "id": "", "kind": "certificate", "label": "", "url": "" }],
  "projectId": "mock_proj_…",
  "exportedKit": {}
}
```

---

## 5. HTTP surface

| Method | Path | Purpose |
|---|---|---|
| GET | `/health`, `/api/health` | liveness |
| GET | `/api/brand/diagnostics` | per-provider configured + reachable probe with latency |
| POST | `/api/brand/chat` | agent chat with tools |
| POST | `/api/brand/generate` | names + visual direction (Groq) |
| POST | `/api/brand/logos` | logo concepts (FLUX.2 [dev]) |
| POST | `/api/logos/suite` | one real mark per studio style, keyed by style (`207` on partial success) |
| GET | `/api/logos/styles` | studio style vocabulary → archetype mapping |
| POST | `/api/brand/save` | persist a project |
| GET | `/api/brand/assets?projectId=&kind=` | list stored assets |
| POST | `/api/brand/assets` | store an asset directly |
| GET | `/api/logos/archetypes`, `/api/logos/archetypes/:a/exemplars`, `POST /api/logos/preview-prompt`, `GET /api/logos/sample-image/:a/:file` | archetype + prompt tooling |
| POST | `/api/domain/check` | domain availability |
| GET | `/api/projects`, `/api/projects/:id` | project read |
| GET | `/api/assets/generated/:file` | **served artwork** (also aliased at `/generated/:file`) |

Assets are served under `/api` on purpose: the Vite dev proxy forwards `/api` to
`:3001`, so a relative URL resolves from the client origin with no CORS work.
`helmet` is configured with `crossOriginResourcePolicy: cross-origin` so the
artwork can be embedded cross-origin.

### Timeout contract (client ↔ server)

The agent chat is a **multi-round tool loop on a reasoning model**, and logo or
certificate requests additionally wait on FLUX.2. Measured end-to-end:

| Request | Typical |
|---|---|
| greeting / no tools | 2–3 s |
| one tool (naming) | 30 s |
| one tool (logo) | 19–41 s |
| two tools (rename + canvas) | 59 s |
| five-style logo suite | 36 s |

`apps/client/src/services/api.ts` therefore sets **`timeout: 180_000`** (was
45 000). At 45 s, real answers were being cut off mid-flight and surfaced as
*"I had trouble connecting to the AI director (timeout of 45000ms exceeded)"* —
the request had not failed, the client had simply stopped waiting. **Any future
client that talks to `/api/brand/chat` must allow ≥ 120 s.** Latency is dominated
by the model's reasoning before the first token, not by image generation.

---

## 6. Persistence

| Data | Where | Notes |
|---|---|---|
| Projects | `firebase.service.ts` → in-memory mock (Firebase creds empty) | lost on restart; drop in Firestore credentials to make it durable |
| Assets (logo / certificate / reference / palette / kit) | `apps/server/data/brand-assets.json` | survives restarts; listings strip inline base64 |
| Generated artwork | `apps/server/public/generated/` | served at `/api/assets/generated/*` |

---

## 7. Failure matrix

| Failure | Behaviour |
|---|---|
| AICredits 401 / 402 / 429 / timeout | warn + fall through to Pollinations |
| Pollinations fails too | local typographic SVG fallback (brand name always legible) |
| Cloudflare vision unreachable | logo still generates; prompt falls back to the archetype blueprint only |
| Qwen returns HTTP 200 with **empty** content (reasoning-token starvation) | automatic retry with `chat_template_kwargs.enable_thinking=false` |
| Groq tool calling unavailable | degrade to single-shot JSON director |
| **Groq rejects the model's tool arguments** (`400 tool_use_failed` — typically `{"kind": null}` for an optional string) | nudge + retry up to 3×; if still rejected, stop calling tools but keep every result already gathered and still answer |
| A tool fails | `{ ok:false, error }` → the model reports it; no silent retries |
| Model passes a URL where an image was expected | URL passthrough; base64 payloads are validated before decoding |
| Static asset missing on disk | explicit `Asset not found on disk: <file>` |

---

## 8. What was broken (root causes, all fixed)

1. **Vision called on the wrong provider.** `describeImageWithQwen` hit Groq with
   `qwen/qwen3.8-27b` — a model that only exists on Cloudflare. Every reference
   analysis silently returned `''`. → moved to Cloudflare Workers AI.
2. **No FLUX.2 at all.** Image generation used `@cf/…/flux-1-schnell` (and
   `@cf/…/flux-2-dev` rejects JSON with `required properties at '/' are
   'multipart'`) plus a free Pollinations fallback. → AICredits
   `black-forest-labs/flux-2-dev` is now primary.
3. **Midjourney flags in a natural-language prompt.** `stitchedPrompt` appended
   `--no <constraints>`; FLUX.2 paints flags into the artwork as stray text.
   → `fluxPrompt` restates exclusions in prose.
4. **The brand name was never pinned.** Prompts said "design a logo for X" but
   never required the wordmark to read `X`. → the exact string is quoted and the
   model is told to render no other words. Verified by reading a generated mark
   back with vision: it renders `Brewlio` correctly.
5. **Generated images were unreachable.** Only base64 data URIs were returned —
   never written to disk, never served, so nothing downstream could display or
   cache them. → persisted and served at `/api/assets/generated/*`.
6. **Mime/extension lie.** AICredits answers `b64_json` with **JPEG** bytes; the
   code wrote them as `.png` with `image/png`. → magic-byte sniffing decides the
   type (`ffd8ff` → `.jpg`).
7. **45-byte garbage assets.** The agent handed a relative asset URL to
   `save_brand_asset.image`, which was decoded as base64. → URL passthrough,
   local-path resolution, and base64 validation (min length + charset).
8. **Chat had no tools.** `/api/brand/chat` could only talk. → 11-tool
   function-calling loop.
9. **Cross-origin embedding blocked** by helmet's default CORP. → relaxed to
   `cross-origin`.
10. **Placeholder fallback SVG** ignored the real name (and could break on
    `&`/`<`). → XML-escaped, name-sized typographic fallback.

### The last mile: getting artwork onto the canvas

The canvas renders **procedural SVG marks** from `selectedName.name` +
`selectedLogoStyle` (`components/brand/LogoArtwork.tsx`) — it does not read
`LogoConcept.url` in the render path. Everything upstream of that is now closed:

- the artwork is generated, persisted and served;
- `POST /api/logos/suite` returns it **keyed by the exact studio style names**;
- the chat response carries it in `logos[]`, and the client store now assigns
  `selectedLogo` from `logos[0]` and merges `canvasPatch` (verified in
  `store/brandStore.ts`).

What remains is a presentation choice inside `LogoArtwork.tsx` / the five tiles:
`if (selectedLogo?.url) render <img src={selectedLogo.url} />` keyed by
`selectedLogoStyle`, falling back to today's SVG. That is a frontend edit and is
deliberately left alone here.

For the five tiles specifically, the cleanest wiring is one call to
`/api/logos/suite` and a `style → url` map in the store, since the suite already
answers in the UI's own vocabulary.

---

## 9. Verification evidence

| Check | Result |
|---|---|
| `/api/brand/diagnostics` | chat `reachable=true 490ms`, vision `true 1555ms`, image `true 360ms` |
| `POST /api/brand/generate` | HTTP 200 in 4.9 s → `BeanMirth, CaffLoom, CarbonBrew, SkyRoast, JivaBean` + taglines + palettes |
| `POST /api/brand/logos` (scratch) | HTTP 200, 6.9–15.5 s → `logo_scratch_…jpg`, 47–54 KB, 1024×1024 JPEG |
| `POST /api/brand/logos` (template, `chase-bank` exemplar) | HTTP 200 in 36 s → vision read the reference, FLUX.2 drew `Aurae` |
| Vision read-back of a generated mark | returned the wordmark text `Brewlio` → **name assignment works** |
| Chat "create a logo for Brewlio" | `engine=groq-tools`, tools `[generate_logo_concepts]`, 2 concepts + URLs |
| Chat "give me 5 names" | `engine=groq-tools`, `[generate_brand_names]`, 5 names, `detectedIntent=new_brand` |
| Chat "rename to Aurae, canvas dark, touch nothing else" | `[update_brand_kit, set_canvas_state]`, `canvasPatch={"bgMode":"dark"}` only |
| Chat "describe this image" | `[describe_image]` → detailed visual grammar |
| Chat "issue a certificate for Aurae" | `[generate_brand_certificate]` → `certificate_….jpg` + asset |
| Asset store | `GET /api/brand/assets?projectId=…` → 2 logo assets with URLs |
| `GET /api/logos/styles` | five styles → `lettermark / wordmark / abstract / combination / pictorial` |
| `POST /api/logos/suite` (2 styles) | HTTP 200 in 17.3 s → `byStyle.wordmark`, `byStyle.geometric`, no failures |
| Chat "all five logo directions" | `engine=groq-tools`, `[generate_logo_suite]`, five style-keyed URLs in `logos[]` (36 s) |
| Client typecheck (`apps/client`) | clean with the parallel session's store/api wiring |
| Static serving | `GET /api/assets/generated/…jpg` → HTTP 200 `image/png|jpeg`, correct bytes |
| `tsc --noEmit` (server) | clean |

**Observed latencies** (gpt-oss-120b reasons before answering): chat with one
image tool ≈ 20 s, with one logo tool ≈ 19 s, with two tools ≈ 60 s, naming ≈
30 s, single logo ≈ 7–16 s, template logo (vision + generation) ≈ 36 s.

---

## 10. Operating it

```bash
# from the repo root
pnpm --filter @upstream/server dev        # nodemon + tsx, port 3001
pnpm dev                                  # client 5173 + server 3001 together

# sanity check before a demo
curl --noproxy '*' http://localhost:3001/api/brand/diagnostics
```

> On this machine `http_proxy`/`https_proxy` are set with an empty `no_proxy`, so
> probe localhost with `curl --noproxy '*'`.

**Dev-server gotcha:** `tsx watch` can leave orphaned children holding `:3001`,
after which every restart dies with `EADDRINUSE` while the *old* build keeps
serving — you then test stale code. If behaviour looks impossible, kill whatever
owns 3001 and start one fresh process.

---

## 11. Potential — what this unlocks

**Now that the loop is closed, the chatbot is an operator, not an advisor:**

- **Brief → finished identity in one instruction.** "Sustainable streetwear for
  Gen-Z, bold, five names, then a mark" runs naming → palette → logo → asset
  persistence in a single turn, with every artefact URL returned.
- **Certificates and credentials as first-class artefacts.** Trademark,
  authenticity, founding and excellence certificates render through the same
  pipeline and land in the asset vault, ready for the export kit.
- **Vision as quality control.** Because the same model reads images, the agent
  can verify its own output — "read that mark back and confirm the wordmark
  spelling" — turning a blind generator into a self-checking one.
- **Reference-driven design.** Upload any mark, get its visual grammar
  extracted, then a *new* mark in that grammar under a different name.
- **A durable asset vault per project** (logos, certificates, references,
  palettes, kits) that survives restarts and can be exported as JSON or Markdown.
- **Canvas instructions in natural language**, applied as minimal patches so the
  user's existing sections are never destroyed.

**Next steps worth doing**

1. Render `selectedLogo.url` in the canvas — the artwork is generated, served and
   already reaching the store; only the presentation fallback is missing. For the
   five tiles, call `/api/logos/suite` once and keep a `style → url` map.
2. Point `firebase.service.ts` at real credentials so projects are durable.
3. Stream the chat response (SSE) — most of the perceived latency is the model's
   reasoning before the first byte.
4. Cache generated marks per (brandName, archetype, palette) hash to cut repeat
   spend on the AICredits wallet.
5. Add a cost guard per key on `/api/brand/logos` (currently `MAX_IMAGES_PER_REQUEST = 4`).
6. Consider `flux-2-klein-4b` for cheap drafts and `flux-2-pro`/`flux-2-max` for
   final marks — both are already in the AICredits catalogue.

---

## 12. Known limitations

- **Text in artwork is probabilistic.** FLUX.2 [dev] renders pinned wordmarks
  reliably for wordmark archetypes, less so for abstract marks where lettering is
  a minor element. Use `describe_image` to verify before shipping.
- **Latency** is dominated by gpt-oss-120b reasoning, not by image generation.
- **Mock persistence** for projects (Firebase creds empty) — in-memory only.
- **Certificate/logo legibility** is not machine-checked beyond the vision
  read-back the agent can perform on request.
- A parallel editing session is active in this repo (it added
  `generate_brand_certificate`, the asset endpoints' docs, and client-side
  `ChatApiResponse` typing). Re-read files before editing; a mid-write state
  briefly broke `agentTools.service.ts` with an esbuild syntax error.
