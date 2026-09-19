/**
 * Provider configuration for the Upstream generation stack.
 *
 * Three providers, three jobs — do not mix them up:
 *
 *   1. CHAT      → Groq          `openai/gpt-oss-120b`
 *   2. VISION    → Cloudflare    `@cf/qwen/qwen3.8-27b`   (reads an image, writes a description)
 *   3. IMAGE GEN → AICredits.in  `black-forest-labs/flux-2-dev` (draws the actual artwork)
 *
 * Cloudflare is NEVER used for image generation any more — FLUX.2 [dev] is
 * served by AICredits. Pollinations remains as an emergency tail of the
 * fallback chain so a logo request never returns nothing.
 */

// ── Chat: Groq ────────────────────────────────────────────────────────────────
export const GROQ_CHAT_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

// ── Vision: Cloudflare Workers AI ─────────────────────────────────────────────
export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
export const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
export const CLOUDFLARE_VISION_MODEL =
  process.env.CLOUDFLARE_VISION_MODEL || '@cf/qwen/qwen3.8-27b';

export const hasCloudflareVision = (): boolean =>
  Boolean(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN);

export const cloudflareRunUrl = (model: string): string =>
  `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;

// ── Image generation: AICredits.in (OpenAI-compatible) ────────────────────────
const rawKey = process.env.AICREDITS_API_KEY || '';
export const AICREDITS_API_KEY = rawKey.startsWith('sk-live') && !rawKey.startsWith('sk-live-')
  ? rawKey.replace(/^sk-live/, 'sk-live-')
  : rawKey;
export const AICREDITS_BASE_URL = (
  process.env.AICREDITS_BASE_URL || 'https://api.aicredits.in/v1'
).replace(/\/+$/, '');
export const AICREDITS_IMAGE_MODEL =
  process.env.AICREDITS_IMAGE_MODEL || 'black-forest-labs/flux-2-dev';

export const hasAICredits = (): boolean => Boolean(AICREDITS_API_KEY);

// ── Image generation fallback: Pollinations.ai ────────────────────────────────
export const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || '';
export const POLLINATIONS_IMAGE_MODEL = process.env.POLLINATIONS_IMAGE_MODEL || 'flux';

// ── Generated asset delivery ──────────────────────────────────────────────────
/**
 * Where generated PNGs are written and the URL prefix they are served from.
 *
 * The client dev server proxies `/api` → :3001, so a *relative* URL
 * (`/api/assets/generated/x.png`) resolves in the browser without CORS or
 * absolute-host guesswork. Set `PUBLIC_BASE_URL` only when the API is deployed
 * somewhere the client does not share an origin with.
 */
export const GENERATED_DIR_SEGMENTS = ['public', 'generated'] as const;
export const ASSET_URL_PREFIX = '/api/assets/generated';
export const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || '').replace(/\/+$/, '');

export const buildPublicAssetUrl = (fileName: string): string =>
  `${PUBLIC_BASE_URL}${ASSET_URL_PREFIX}/${fileName}`;

/** How many images a single request may fan out to (cost guard). */
export const MAX_IMAGES_PER_REQUEST = 4;

export interface ProviderDiagnostics {
  chat: { provider: 'groq'; model: string; configured: boolean };
  vision: { provider: 'cloudflare'; model: string; configured: boolean };
  image: { provider: 'aicredits'; model: string; configured: boolean };
  imageFallback: { provider: 'pollinations'; model: string; configured: boolean };
}

export const providerDiagnostics = (): ProviderDiagnostics => ({
  chat: {
    provider: 'groq',
    model: GROQ_CHAT_MODEL,
    configured: Boolean(process.env.GROQ_API_KEY),
  },
  vision: {
    provider: 'cloudflare',
    model: CLOUDFLARE_VISION_MODEL,
    configured: hasCloudflareVision(),
  },
  image: {
    provider: 'aicredits',
    model: AICREDITS_IMAGE_MODEL,
    configured: hasAICredits(),
  },
  imageFallback: {
    provider: 'pollinations',
    model: POLLINATIONS_IMAGE_MODEL,
    configured: Boolean(POLLINATIONS_API_KEY),
  },
});
