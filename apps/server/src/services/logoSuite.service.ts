/**
 * Logo suite — one generated mark per UI style, in a single call.
 *
 * Why this exists: the studio canvas offers five *fixed* style tiles
 * (`minimal | wordmark | abstract | geometric | illustrative` — see
 * `apps/client/src/components/brand/LogoGenerationView.tsx`) and draws a
 * procedural SVG for each. The artwork pipeline, meanwhile, thinks in
 * **archetypes** (`abstract | combination | emblems | lettermark | mascot |
 * pictorial | wordmark`).
 *
 * Those two vocabularies overlap but are not the same, so a client could never
 * map a generated mark onto a specific tile. This module owns the translation:
 * each UI style gets an archetype, a prompt modifier, and — importantly — comes
 * back keyed by the *style* name the UI already uses.
 *
 * Result: `byStyle.wordmark` is a real FLUX.2 image URL, ready to drop into the
 * wordmark tile. No frontend vocabulary change required.
 */

import { promptService } from './prompt.service';
import { generateImageAssets } from './image.service';
import { saveAsset } from './assetStore.service';
import type { LogoArchetype } from '@upstream/shared';

/** The five styles the studio canvas renders. */
export const UI_LOGO_STYLES = [
  'minimal',
  'wordmark',
  'abstract',
  'geometric',
  'illustrative',
] as const;

export type UiLogoStyle = (typeof UI_LOGO_STYLES)[number];

interface StylePreset {
  archetype: LogoArchetype;
  /** Human label, mirrors the client's tile copy. */
  label: string;
  /** Appended to the FLUX prompt so each tile reads as a distinct direction. */
  direction: string;
  /** Some styles are mark-only — no wordmark text should be rendered. */
  renderWordmark: boolean;
}

export const STYLE_PRESETS: Record<UiLogoStyle, StylePreset> = {
  minimal: {
    archetype: 'lettermark',
    label: 'Minimalist Glyph',
    direction:
      'Ultra-minimal continuous-line monogram built from the brand initial. Single uniform stroke weight, generous negative space, no ornament, no lettering beyond the initial.',
    renderWordmark: false,
  },
  wordmark: {
    archetype: 'wordmark',
    label: 'Modern Wordmark',
    direction:
      'Typographic wordmark where the full brand name is the hero element. Architectural letterforms, precise optical kerning, one restrained accent detail.',
    renderWordmark: true,
  },
  abstract: {
    archetype: 'abstract',
    label: 'Abstract Prism',
    direction:
      'Faceted abstract geometric prism mark, overlapping translucent planes, rotational symmetry, non-literal and conceptual.',
    renderWordmark: true,
  },
  geometric: {
    archetype: 'combination',
    label: 'Geometric Crest',
    direction:
      'Golden-ratio balanced crest or badge: a precise geometric emblem with the brand name set beneath it in a matching weight.',
    renderWordmark: true,
  },
  illustrative: {
    archetype: 'pictorial',
    label: 'Illustrative Emblem',
    direction:
      'Organic sculptural emblem, hand-drawn illustrative contour, tactile linework with a single accent fill.',
    renderWordmark: true,
  },
};

export interface SuiteRequest {
  brandName: string;
  styles?: string[];
  preferredColors?: string[];
  industry?: string;
  tagline?: string;
  styleKeywords?: string;
  fontStyle?: string;
  projectId?: string;
  /** Images per style. Default 1 — the canvas wants exactly one per tile. */
  countPerStyle?: number;
  /** How many styles to render at once. Default 3 (AICredits allows 24 active tasks). */
  concurrency?: number;
}

export interface SuiteEntry {
  style: UiLogoStyle;
  label: string;
  archetype: LogoArchetype;
  id: string;
  url: string;
  prompt: string;
  provider: string;
  assetId?: string;
}

export interface SuiteResult {
  brandName: string;
  projectId?: string;
  styles: UiLogoStyle[];
  /** Ordered list, useful for a carousel. */
  logos: SuiteEntry[];
  /** Keyed lookup — the shape a canvas maps tiles from. */
  byStyle: Record<string, { url: string; id: string; label: string; assetId?: string }>;
  failures: Array<{ style: string; error: string }>;
}

/** Run tasks with a bounded number in flight, preserving input order. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<Array<{ ok: true; value: R } | { ok: false; error: string }>> {
  const results: Array<{ ok: true; value: R } | { ok: false; error: string }> = new Array(
    items.length
  );
  let cursor = 0;

  const runner = async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = { ok: true, value: await worker(items[index], index) };
      } catch (err: any) {
        results[index] = { ok: false, error: err?.message || 'generation failed' };
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, () => runner())
  );
  return results;
}

/**
 * Generate one mark per requested UI style.
 *
 * Never throws for a single style failing: that style is reported in
 * `failures` and the rest of the suite is still returned.
 */
export async function generateLogoSuite(request: SuiteRequest): Promise<SuiteResult> {
  const brandName = (request.brandName || '').trim();
  if (!brandName) throw new Error('brandName is required to build a logo suite.');

  const requested = (request.styles?.length ? request.styles : [...UI_LOGO_STYLES])
    .map((s) => String(s).toLowerCase())
    .filter((s): s is UiLogoStyle => (UI_LOGO_STYLES as readonly string[]).includes(s));

  const styles = requested.length ? Array.from(new Set(requested)) : [...UI_LOGO_STYLES];
  const countPerStyle = Math.max(1, Math.min(request.countPerStyle ?? 1, 2));
  const concurrency = Math.max(1, Math.min(request.concurrency ?? 3, 5));
  const projectId = request.projectId || 'unassigned';

  const outcomes = await mapWithConcurrency(styles, concurrency, async (style) => {
    const preset = STYLE_PRESETS[style];

    // Archetype blueprint drives the geometry; the preset drives the direction.
    const payload = promptService.buildLogoPrompt({
      brandName,
      archetype: preset.archetype,
      industry: request.industry,
      userKeywords: [preset.direction, request.styleKeywords, request.fontStyle]
        .filter(Boolean)
        .join(' '),
      preferredColors: request.preferredColors,
    });

    const parts = [payload.fluxPrompt, `Direction for this concept: ${preset.direction}`];
    if (request.tagline) parts.push(`Brand tagline (may appear as a small secondary line): "${request.tagline}".`);
    if (!preset.renderWordmark) {
      parts.push('Render NO text at all in this concept — mark only, no letters, no words.');
    }
    const prompt = parts.join('\n');

    const assets = await generateImageAssets(prompt, countPerStyle, `logo_${style}`);
    if (assets.length === 0) throw new Error('all image providers failed');

    const asset = assets[0];
    const saved = saveAsset({
      projectId,
      kind: 'logo',
      label: `${brandName} — ${preset.label}`,
      url: asset.url,
      dataUri: asset.dataUri,
      data: { prompt, style, archetype: preset.archetype, provider: asset.provider },
      tags: ['logo-suite', style],
    });

    const entry: SuiteEntry = {
      style,
      label: preset.label,
      archetype: preset.archetype,
      id: `logo_${style}_${Date.now()}`,
      url: asset.url,
      prompt,
      provider: asset.provider,
      assetId: saved.id,
    };
    return entry;
  });

  const logos: SuiteEntry[] = [];
  const failures: Array<{ style: string; error: string }> = [];
  outcomes.forEach((outcome, i) => {
    if (outcome.ok) logos.push(outcome.value);
    else failures.push({ style: styles[i], error: outcome.error });
  });

  const byStyle: SuiteResult['byStyle'] = {};
  for (const entry of logos) {
    byStyle[entry.style] = {
      url: entry.url,
      id: entry.id,
      label: entry.label,
      assetId: entry.assetId,
    };
  }

  return { brandName, projectId, styles, logos, byStyle, failures };
}
