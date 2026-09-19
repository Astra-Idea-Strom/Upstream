/**
 * Image service — vision + image generation for the Upstream logo pipeline.
 *
 * Responsibilities (and ONLY these):
 *
 *   describeImageWithQwen()  → Cloudflare Workers AI, `@cf/qwen/qwen3.8-27b`
 *                              Reads a reference mark and returns a visual
 *                              grammar description. This is the multimodal
 *                              "eyes" of the pipeline.
 *
 *   generateImageAssets()    → AICredits.in, `black-forest-labs/flux-2-dev`
 *                              Draws the actual artwork. Falls back to
 *                              Pollinations FLUX only if AICredits fails.
 *
 * Cloudflare is deliberately NOT in the image-generation chain any more — the
 * `@cf/.../flux-2-dev` route needs a multipart body and is slower than the
 * AICredits gateway, which speaks plain OpenAI JSON.
 *
 * Every generated image is written to `apps/server/public/generated/` and
 * returned both as a data URI (inline, always works) and as a public URL
 * (small payloads, cacheable, works through the Vite `/api` proxy).
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  AICREDITS_API_KEY,
  AICREDITS_BASE_URL,
  AICREDITS_IMAGE_MODEL,
  CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_VISION_MODEL,
  MAX_IMAGES_PER_REQUEST,
  POLLINATIONS_API_KEY,
  POLLINATIONS_IMAGE_MODEL,
  buildPublicAssetUrl,
  cloudflareRunUrl,
  hasAICredits,
  hasCloudflareVision,
} from '../config/imagegen';

export interface GeneratedImageAsset {
  /** Public URL (relative by default: /api/assets/generated/<file>.png). */
  url: string;
  /** Inline data URI — identical bytes, no network round trip. */
  dataUri: string;
  /** File name on disk under public/generated/. */
  fileName: string;
  /** Which engine actually produced this image. */
  provider: 'aicredits' | 'pollinations' | 'fallback-svg';
  /** Mime type of the payload. */
  mimeType: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Asset persistence
// ─────────────────────────────────────────────────────────────────────────────

function generatedDir(): string {
  // __dirname is apps/server/src/services (tsx) or apps/server/dist/services (built)
  const candidates = [
    path.resolve(__dirname, '../../public/generated'),
    path.resolve(process.cwd(), 'public/generated'),
    path.resolve(process.cwd(), 'apps/server/public/generated'),
  ];
  for (const dir of candidates) {
    const parent = path.dirname(dir);
    if (fs.existsSync(parent)) {
      fs.mkdirSync(dir, { recursive: true });
      return dir;
    }
  }
  const fallback = candidates[0];
  fs.mkdirSync(fallback, { recursive: true });
  return fallback;
}

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

/**
 * Detect an image mime type from its magic bytes.
 *
 * Returns `null` when the bytes are not a format we recognise — callers then
 * fall back to whatever the provider declared. This matters because AICredits
 * answers `b64_json` with **JPEG** bytes even when the request looks like it
 * should produce PNG; trusting the declaration wrote `.png` files that were
 * actually JPEG, which breaks strict consumers (canvas drawImage, PDF export).
 */
function sniffMime(buffer: Buffer): string | null {
  if (buffer.length > 12) {
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e) return 'image/png';
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
    if (buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP') {
      return 'image/webp';
    }
    if (buffer.slice(0, 5).toString('ascii').toLowerCase().includes('<svg')) return 'image/svg+xml';
    if (buffer.slice(0, 3).toString('ascii') === 'GIF') return 'image/gif';
  }
  return null;
}

/**
 * Persist an image buffer and return everything a caller could want:
 * a public URL, a data URI and the on-disk file name.
 */
export function saveImageBuffer(
  buffer: Buffer,
  prefix = 'logo',
  provider: GeneratedImageAsset['provider'] = 'aicredits',
  declaredMime?: string
): GeneratedImageAsset {
  // Sniffed bytes beat the provider's declaration — see sniffMime().
  const mimeType = sniffMime(buffer) || declaredMime || 'image/png';
  const ext = EXT_BY_MIME[mimeType] || 'png';
  const fileName = `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
  const dir = generatedDir();

  try {
    fs.writeFileSync(path.join(dir, fileName), buffer);
  } catch (err: any) {
    console.warn(`[ImageService] Could not persist ${fileName}: ${err.message}`);
  }

  return {
    url: buildPublicAssetUrl(fileName),
    dataUri: `data:${mimeType};base64,${buffer.toString('base64')}`,
    fileName,
    provider,
    mimeType,
  };
}

/**
 * Normalise any incoming image reference to base64 + mime.
 *
 * Accepts, in order: data URI · absolute http(s) URL · our own relative asset
 * path (`/api/assets/generated/x.jpg`) · bare base64.
 *
 * The relative-path case exists because the agent naturally hands back the URLs
 * this service just produced. Treating those as base64 silently wrote 45-byte
 * garbage files, so they are now resolved against the local generated folder
 * instead.
 */
export async function resolveImageToBase64(
  input: string
): Promise<{ base64: string; mimeType: string }> {
  const value = (input || '').trim();
  if (!value) throw new Error('No image provided');

  const dataUriMatch = value.match(/^data:(image\/[\w.+-]+);base64,(.+)$/s);
  if (dataUriMatch) {
    return { mimeType: dataUriMatch[1], base64: dataUriMatch[2] };
  }

  if (/^https?:\/\//i.test(value)) {
    const res = await fetch(value);
    if (!res.ok) throw new Error(`Could not download image (HTTP ${res.status})`);
    const mimeType = res.headers.get('content-type')?.split(';')[0] || 'image/png';
    const buf = Buffer.from(await res.arrayBuffer());
    return { mimeType, base64: buf.toString('base64') };
  }

  // Our own relative asset path → read it straight off disk.
  if (value.startsWith('/')) {
    const fileName = path.basename(value);
    const localPath = path.join(generatedDir(), fileName);
    if (fs.existsSync(localPath)) {
      const buf = fs.readFileSync(localPath);
      return { mimeType: sniffMime(buf) || 'image/png', base64: buf.toString('base64') };
    }
    throw new Error(`Asset not found on disk: ${fileName}`);
  }

  // Bare base64 — validate before trusting it.
  const cleaned = value.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/=]+$/.test(cleaned) || cleaned.length < 256) {
    throw new Error(
      'Image payload was neither a data URI, an http(s) URL, an asset path, nor valid base64.'
    );
  }
  return { mimeType: 'image/png', base64: cleaned };
}

// ─────────────────────────────────────────────────────────────────────────────
// VISION — Cloudflare Workers AI · Qwen 3.8 27B (multimodal)
// ─────────────────────────────────────────────────────────────────────────────

export interface VisionDescription {
  description: string;
  provider: 'cloudflare-qwen';
  model: string;
}

/**
 * Describe a reference logo mark using Qwen 3.8 27B on Cloudflare Workers AI.
 *
 * Returns an empty string when vision is unavailable so callers can degrade
 * gracefully instead of failing the whole logo request.
 *
 * Note on `chat_template_kwargs.enable_thinking`: qwen3.8-27b is a reasoning
 * model, and its `reasoning` tokens come out of the same `max_tokens` budget as
 * the answer. With a tight budget the model can spend everything on thinking
 * and return an EMPTY `content` with HTTP 200 — which is exactly how this
 * endpoint used to "succeed" while producing nothing. The retry below turns
 * thinking off for a guaranteed-answer path.
 */
export async function describeImageWithQwen(
  imageBase64: string,
  brandName?: string,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  if (!hasCloudflareVision()) {
    console.warn('[ImageService] Cloudflare vision not configured — skipping description.');
    return '';
  }

  const dataUri = imageBase64.startsWith('data:')
    ? imageBase64
    : `data:${mimeType};base64,${imageBase64.replace(/\s/g, '')}`;

  const instruction = [
    'You are a logo design analyst. Study the attached logo mark and describe it for a designer',
    'who must adapt its visual grammar into a brand-new mark.',
    'Cover, in 2-3 dense sentences: the geometric composition, interlocking or repeated shapes,',
    'symmetry and rotation, contour and line weight, negative space, and the typographic style',
    'if lettering is present.',
    'Never name a trademarked brand. Describe archetypal visual language only.',
    brandName ? `The new mark is for the brand "${brandName}".` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: instruction },
        { type: 'image_url', image_url: { url: dataUri } },
      ],
    },
  ];

  /** One vision round trip; returns { text, payload } with text possibly empty. */
  const callVision = async (extra: Record<string, unknown>) => {
    const res = await fetch(cloudflareRunUrl(CLOUDFLARE_VISION_MODEL), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, ...extra }),
    });

    const payload: any = await res.json().catch(() => null);

    if (!res.ok || payload?.success === false) {
      const detail = payload?.errors?.[0]?.message || payload?.error || `HTTP ${res.status}`;
      console.warn(`[ImageService] Cloudflare Qwen vision failed: ${detail}`);
      return { text: '', payload };
    }

    // Cloudflare wraps the OpenAI-shaped body in `result`.
    const body = payload?.result ?? payload;
    const msg = body?.choices?.[0]?.message;
    const text =
      msg?.content ||
      msg?.reasoning ||
      body?.response ||
      (typeof body === 'string' ? body : '');

    return { text: String(text || '').trim(), payload };
  };

  try {
    // Attempt 1: reasoning on, generous budget.
    const first = await callVision({ max_tokens: 1200, temperature: 0.3 });
    if (first.text) return first.text;

    // Attempt 2: thinking disabled — shorter, deterministic, cannot be starved.
    console.warn('[ImageService] Vision returned empty content — retrying with thinking disabled.');
    const second = await callVision({
      max_tokens: 600,
      temperature: 0.2,
      chat_template_kwargs: { enable_thinking: false },
    });
    if (second.text) return second.text;

    // Attempt 3: Groq Qwen 3.8 27B vision fallback
    if (process.env.GROQ_API_KEY) {
      console.log('[ImageService] Falling back to Groq Qwen 3.8 27B vision...');
      const Groq = (await import('groq-sdk')).default;
      const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const groqRes = await groqClient.chat.completions.create({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: instruction },
              { type: 'image_url', image_url: { url: dataUri } },
            ],
          },
        ],
        max_tokens: 350,
        temperature: 0.3,
      });
      const groqText = groqRes.choices[0]?.message?.content?.trim();
      if (groqText) return groqText;
    }

    console.warn(
      `[ImageService] Cloudflare Qwen vision returned no text. Raw: ${JSON.stringify(
        second.payload
      ).slice(0, 300)}`
    );
    return '';
  } catch (err: any) {
    console.warn('[ImageService] Cloudflare Qwen vision error:', err.message);
    // Fallback to Groq Qwen vision if available
    if (process.env.GROQ_API_KEY) {
      try {
        const Groq = (await import('groq-sdk')).default;
        const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const groqRes = await groqClient.chat.completions.create({
          model: 'qwen/qwen3.8-27b',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: instruction },
                { type: 'image_url', image_url: { url: dataUri } },
              ],
            },
          ],
          max_tokens: 350,
          temperature: 0.3,
        });
        return groqRes.choices[0]?.message?.content?.trim() || '';
      } catch (gErr: any) {
        console.warn('[ImageService] Groq vision fallback also failed:', gErr.message);
      }
    }
    return '';
  }
}

/** Rich variant that also reports which model answered. */
export async function describeImage(image: string, brandName?: string): Promise<VisionDescription> {
  const { base64, mimeType } = await resolveImageToBase64(image);
  const description = await describeImageWithQwen(base64, brandName, mimeType);
  return { description, provider: 'cloudflare-qwen', model: CLOUDFLARE_VISION_MODEL };
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE GENERATION — AICredits.in · black-forest-labs/flux-2-dev
// ─────────────────────────────────────────────────────────────────────────────

interface RawImageResult {
  buffer: Buffer;
  mimeType: string;
  provider: GeneratedImageAsset['provider'];
}

/**
 * FLUX.2 [dev] through the AICredits OpenAI-compatible gateway.
 * Returns base64 (`b64_json`) or a signed URL — both are normalised to a Buffer.
 */
export async function generateWithAICredits(prompt: string): Promise<RawImageResult | null> {
  if (!hasAICredits()) {
    console.warn('[ImageService] AICREDITS_API_KEY missing — skipping FLUX.2 request.');
    return null;
  }

  try {
    const res = await fetch(`${AICREDITS_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AICREDITS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AICREDITS_IMAGE_MODEL,
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    });

    const text = await res.text();
    let payload: any = null;
    try {
      payload = JSON.parse(text);
    } catch {
      /* non-JSON error body */
    }

    if (!res.ok) {
      console.warn(
        `[ImageService] AICredits FLUX.2 HTTP ${res.status}: ${
          (payload && JSON.stringify(payload)) || text.slice(0, 200)
        }`
      );
      return null;
    }

    const first = payload?.data?.[0];
    if (!first) {
      console.warn('[ImageService] AICredits returned no image data.');
      return null;
    }

    if (first.b64_json) {
      const buffer = Buffer.from(first.b64_json, 'base64');
      return {
        buffer,
        // Sniff: the gateway returns JPEG bytes regardless of the request.
        mimeType: sniffMime(buffer) || 'image/png',
        provider: 'aicredits',
      };
    }

    if (first.url) {
      const imgRes = await fetch(first.url);
      if (!imgRes.ok) return null;
      return {
        buffer: Buffer.from(await imgRes.arrayBuffer()),
        mimeType: imgRes.headers.get('content-type')?.split(';')[0] || 'image/png',
        provider: 'aicredits',
      };
    }

    console.warn('[ImageService] AICredits response had neither b64_json nor url.');
    return null;
  } catch (err: any) {
    console.warn('[ImageService] AICredits request error:', err.message);
    return null;
  }
}

/** Emergency tail of the chain: Pollinations FLUX (free, no key required). */
export async function generateWithPollinations(prompt: string): Promise<RawImageResult | null> {
  const seed = Math.floor(Math.random() * 1_000_000);
  const url =
    `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}` +
    `?model=${encodeURIComponent(POLLINATIONS_IMAGE_MODEL)}&width=1024&height=1024&seed=${seed}`;

  try {
    const headers: Record<string, string> = {};
    if (POLLINATIONS_API_KEY) headers.Authorization = `Bearer ${POLLINATIONS_API_KEY}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`[ImageService] Pollinations returned HTTP ${res.status}`);
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1024) return null;

    return {
      buffer,
      mimeType: res.headers.get('content-type')?.split(';')[0] || 'image/jpeg',
      provider: 'pollinations',
    };
  } catch (err: any) {
    console.warn('[ImageService] Pollinations request error:', err.message);
    return null;
  }
}

/**
 * Generate `count` images for one prompt.
 *
 * Chain: AICredits FLUX.2 [dev] → Pollinations FLUX. Every returned asset is
 * already persisted and carries both a URL and a data URI.
 */
export async function generateImageAssets(
  prompt: string,
  count = 2,
  prefix = 'logo'
): Promise<GeneratedImageAsset[]> {
  const target = Math.max(1, Math.min(count, MAX_IMAGES_PER_REQUEST));
  const assets: GeneratedImageAsset[] = [];

  for (let i = 0; i < target; i++) {
    // Vary the composition per concept so two tiles are not the same picture.
    const variedPrompt =
      target > 1
        ? `${prompt}${i > 0 ? ` Variation ${i + 1}: alternate composition, same brand language.` : ''}`
        : prompt;

    let raw = await generateWithAICredits(variedPrompt);
    if (!raw) raw = await generateWithPollinations(variedPrompt);

    if (raw) {
      assets.push(saveImageBuffer(raw.buffer, prefix, raw.provider, raw.mimeType));
    } else {
      console.warn(`[ImageService] All image providers failed for concept ${i + 1}.`);
    }
  }

  return assets;
}

/**
 * Backwards-compatible wrapper: returns data URIs only.
 * Existing callers (flux.service / gemini.service) keep working unchanged.
 */
export async function generateFluxImages(prompt: string, count = 2): Promise<string[]> {
  const assets = await generateImageAssets(prompt, count);
  return assets.map((a) => a.dataUri);
}
