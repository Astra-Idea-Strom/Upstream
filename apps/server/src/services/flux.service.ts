import { promptService } from './prompt.service';
import {
  generateImageAssets,
  saveImageBuffer,
  type GeneratedImageAsset,
} from './image.service';
import type { LogoConcept, LogoArchetype } from '@upstream/shared';

export interface GenerateScratchLogoParams {
  brandName: string;
  archetypeId?: string;
  preferredColors?: string[];
  fontStyle?: string;
  styleKeywords?: string;
  industry?: string;
  count?: number;
}

/** XML-escape a value before it is interpolated into SVG markup. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Last-resort mark, drawn locally.
 *
 * Only used when *both* image providers are down. It is intentionally
 * typographic: the brand name is always legible, so a degraded response still
 * shows the right brand instead of an anonymous placeholder.
 */
export function createFallbackLogoSvg(
  brandName: string,
  primaryColor = '#3B82F6',
  bgColor = '#0F172A'
): GeneratedImageAsset {
  const safeName = (brandName || 'Brand').trim();
  const initial = escapeXml(safeName.charAt(0).toUpperCase());
  const label = escapeXml(safeName.toUpperCase().slice(0, 18));
  // Shrink the name line as it grows so long names do not overflow the plate.
  const labelSize = Math.max(22, Math.min(44, Math.round(560 / Math.max(label.length, 6))));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="${bgColor}" rx="48"/>
  <circle cx="256" cy="232" r="132" fill="none" stroke="${primaryColor}" stroke-width="22" stroke-dasharray="600 220"/>
  <text x="256" y="268" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="800" font-size="120" fill="#FFFFFF" text-anchor="middle">${initial}</text>
  <text x="256" y="428" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="600" font-size="${labelSize}" fill="${primaryColor}" text-anchor="middle" letter-spacing="3">${label}</text>
</svg>`;

  return saveImageBuffer(Buffer.from(svg, 'utf-8'), 'logo_fallback', 'fallback-svg', 'image/svg+xml');
}

/** Map an image asset onto the shared LogoConcept contract. */
function toConcept(
  asset: GeneratedImageAsset,
  prompt: string,
  styleKey: string,
  mode: 'template' | 'scratch',
  index: number
): LogoConcept {
  return {
    id: `logo_${mode}_${Date.now()}_${index + 1}`,
    // Prefer the served URL; the data URI stays available for offline clients.
    url: asset.url || asset.dataUri,
    prompt,
    style: styleKey,
    model: 'flux',
    mode,
  };
}

/**
 * Generate logo concepts from scratch with FLUX.2 [dev] (AICredits).
 *
 * Unlike template mode there is no reference mark: the archetype blueprint in
 * `brand_reference.json` is the only steer, so the prompt is the whole game.
 */
export async function generateLogoFromScratch(
  params: GenerateScratchLogoParams
): Promise<LogoConcept[]> {
  const {
    brandName,
    archetypeId = 'abstract',
    preferredColors = [],
    fontStyle = '',
    styleKeywords = '',
    industry = '',
    count = 2,
  } = params;

  const promptPayload = promptService.buildLogoPrompt({
    brandName,
    archetype: (archetypeId as LogoArchetype) || 'abstract',
    industry,
    userKeywords: [styleKeywords, fontStyle].filter(Boolean).join(', '),
    preferredColors,
  });

  const promptToUse = promptPayload.fluxPrompt;

  const assets = await generateImageAssets(promptToUse, count, 'logo_scratch');
  if (assets.length > 0) {
    return assets.map((asset, i) => toConcept(asset, promptToUse, archetypeId, 'scratch', i));
  }

  console.warn('[FluxService] All providers failed — serving local typographic fallback.');
  const primary = preferredColors[0] || '#3B82F6';
  return [
    toConcept(createFallbackLogoSvg(brandName, primary), promptToUse, archetypeId, 'scratch', 0),
  ];
}
