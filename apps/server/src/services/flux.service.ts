import { fal, FLUX_MODEL } from '../config/fal';
import { promptService } from './prompt.service';
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

/**
 * Generate a clean placeholder SVG vector logo if the external image model fails or is rate-limited
 */
function createFallbackLogoSvg(brandName: string, primaryColor = '#3B82F6', bgColor = '#0F172A'): string {
  const initial = (brandName || 'U').charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="${bgColor}" rx="48"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="${primaryColor}" stroke-width="24" stroke-dasharray="600 200"/>
  <text x="256" y="295" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="128" fill="#FFFFFF" text-anchor="middle">${initial}</text>
  <text x="256" y="440" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="36" fill="${primaryColor}" text-anchor="middle" letter-spacing="4">${brandName.toUpperCase()}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate logo concepts from scratch using FLUX.1 [dev]
 */
export async function generateLogoFromScratch(
  params: GenerateScratchLogoParams
): Promise<LogoConcept[]> {
  const {
    brandName,
    archetypeId = 'abstract',
    preferredColors = [],
    styleKeywords = '',
    industry = '',
    count = 2,
  } = params;

  // 1. Build rich prompt from reference blueprints
  const promptPayload = promptService.buildLogoPrompt({
    brandName,
    archetype: (archetypeId as LogoArchetype) || 'abstract',
    industry,
    userKeywords: styleKeywords,
    preferredColors,
  });

  const promptToUse = promptPayload.stitchedPrompt;
  const concepts: LogoConcept[] = [];

  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    console.warn('[FluxService] FAL_API_KEY not found. Using fallback concept generation.');
    const primary = preferredColors[0] || '#3B82F6';
    return [
      {
        id: `logo_flux_fallback_${Date.now()}_1`,
        url: createFallbackLogoSvg(brandName, primary),
        prompt: promptToUse,
        style: archetypeId,
        model: 'flux',
        mode: 'scratch',
      },
    ];
  }

  try {
    const result: any = await fal.subscribe(FLUX_MODEL, {
      input: {
        prompt: promptToUse,
        image_size: 'square_hd',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: Math.min(count, 2),
        enable_safety_checker: true,
      },
      logs: false,
    });

    const images = result?.data?.images || result?.images || [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img?.url) {
        concepts.push({
          id: `logo_flux_${Date.now()}_${i + 1}`,
          url: img.url,
          prompt: promptToUse,
          style: archetypeId,
          model: 'flux',
          mode: 'scratch',
        });
      }
    }

    if (concepts.length > 0) {
      return concepts;
    }
  } catch (err: any) {
    console.warn(`[FluxService] Fal.ai call failed (${err.message}). Generating fallback concept.`);
  }

  // Fallback if Fal.ai fails or returns empty
  const primary = preferredColors[0] || '#3B82F6';
  return [
    {
      id: `logo_flux_${Date.now()}_1`,
      url: createFallbackLogoSvg(brandName, primary),
      prompt: promptToUse,
      style: archetypeId,
      model: 'flux',
      mode: 'scratch',
    },
  ];
}
