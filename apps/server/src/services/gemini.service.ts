import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promptService } from './prompt.service';
import type { LogoConcept, LogoArchetype } from '@upstream/shared';

const ARCHETYPE_FOLDER_MAP: Record<string, string> = {
  abstract: 'Abstract',
  combination: 'Combination',
  emblems: 'Emblems',
  lettermark: 'Lettermark',
  mascot: 'Mascot',
  pictorial: 'Pictorial',
  wordmark: 'Wordmark',
};

/**
 * Template-mode logo generation.
 *
 * The file name is historical — Gemini is no longer involved. The flow is:
 *
 *   reference mark (disk or upload)
 *        │
 *        ├─ Cloudflare Workers AI · @cf/qwen/qwen3.8-27b   ← "eyes"
 *        │     returns a visual-grammar description
 *        │
 *        └─ AICredits.in · black-forest-labs/flux-2-dev   ← "hands"
 *              draws the new mark, brand name pinned in the wordmark
 *
 * If the reference image cannot be resolved, or vision returns nothing, the
 * archetype blueprint alone still produces a usable prompt.
 */

export interface GenerateTemplateLogoParams {
  brandName: string;
  archetypeId: string;
  exemplarBrandId?: string;
  referenceImageBase64?: string;
  referenceImageMimeType?: string;
  preferredColors?: string[];
  fontStyle?: string;
  styleKeywords?: string;
  industry?: string;
  count?: number;
}

/**
 * Locate and prepare reference image from disk or base64 payload
 */
async function resolveReferenceImage(params: GenerateTemplateLogoParams): Promise<{
  base64: string;
  mimeType: string;
} | null> {
  // 1. Direct base64 provided
  if (params.referenceImageBase64) {
    const raw = params.referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    const resized = await sharp(buffer)
      .resize({ width: 1024, height: 1024, fit: 'inside' })
      .jpeg({ quality: 85 })
      .toBuffer();
    return {
      base64: resized.toString('base64'),
      mimeType: 'image/jpeg',
    };
  }

  // 2. Resolve from exemplar on disk
  if (!params.archetypeId) return null;

  const folder = ARCHETYPE_FOLDER_MAP[params.archetypeId.toLowerCase()];
  if (!folder) return null;

  let imageFileName = '';
  if (params.exemplarBrandId) {
    const brand = promptService.getBrandById(params.exemplarBrandId);
    if (brand && brand.imageFile) {
      imageFileName = brand.imageFile;
    }
  }

  if (!imageFileName) {
    const exemplars = promptService.getExemplarsByArchetype(params.archetypeId as LogoArchetype);
    if (exemplars.length > 0) {
      imageFileName = exemplars[0].imageFile;
    }
  }

  if (!imageFileName) return null;

  // Search candidate paths for the image
  const searchDirs = [
    path.resolve(process.cwd(), 'API & Others/Sample_Data/Images', folder),
    path.resolve(process.cwd(), '../API & Others/Sample_Data/Images', folder),
    path.resolve(process.cwd(), '../../API & Others/Sample_Data/Images', folder),
    path.resolve(__dirname, '../../../API & Others/Sample_Data/Images', folder),
    path.resolve(__dirname, '../../../../API & Others/Sample_Data/Images', folder),
  ];

  let filePath = '';
  for (const dir of searchDirs) {
    const full = path.join(dir, imageFileName);
    if (fs.existsSync(full)) {
      filePath = full;
      break;
    }
  }

  if (!filePath) {
    console.warn(`[GeminiService] Could not find sample image "${imageFileName}" in ${folder}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const resized = await sharp(fileBuffer)
    .resize({ width: 1024, height: 1024, fit: 'inside' })
    .jpeg({ quality: 85 })
    .toBuffer();

  return {
    base64: resized.toString('base64'),
    mimeType: 'image/jpeg',
  };
}

/**
 * Generate logo concepts using Qwen 3.8 27B Vision (Cloudflare) + FLUX.2 [dev] (AICredits)
 */
export async function generateLogoFromTemplate(
  params: GenerateTemplateLogoParams
): Promise<LogoConcept[]> {
  const {
    brandName,
    archetypeId,
    exemplarBrandId,
    preferredColors = [],
    fontStyle = '',
    styleKeywords = '',
    industry = '',
    count = 2,
  } = params;

  // 1. Resolve reference exemplar image from disk or base64 payload
  const referenceImage = await resolveReferenceImage(params);

  // 2. Vision: let Qwen 3.8 27B on Cloudflare read the reference mark
  let visualGrammar = '';
  if (referenceImage?.base64) {
    const { describeImageWithQwen } = await import('./image.service');
    visualGrammar = await describeImageWithQwen(
      referenceImage.base64,
      brandName,
      referenceImage.mimeType
    );
    if (visualGrammar) {
      console.log(
        `[LogoService] Qwen 3.8 27B (Cloudflare) read the reference mark: "${visualGrammar.slice(0, 100)}..."`
      );
    } else {
      console.warn('[LogoService] Vision returned nothing — falling back to blueprint only.');
    }
  }

  // 3. Build the FLUX.2 prompt: archetype blueprint + wordmark pinning + vision notes
  const { promptService } = await import('./prompt.service');
  const promptPayload = promptService.buildLogoPrompt({
    brandName,
    archetype: (archetypeId as LogoArchetype) || 'abstract',
    exemplarBrandId,
    industry,
    userKeywords: [styleKeywords, fontStyle].filter(Boolean).join(', '),
    preferredColors,
  });

  const promptParts = [promptPayload.fluxPrompt];

  if (visualGrammar) {
    promptParts.push(
      `Visual grammar to adapt (from the reference mark, do not copy it literally): ${visualGrammar}`
    );
  }

  promptParts.push(
    `The finished artwork must clearly show the brand name "${brandName}" as the wordmark, spelled exactly and legibly, with no additional words.`
  );

  const promptText = promptParts.join('\n');

  // 4. Generate with FLUX.2 [dev] via AICredits (Pollinations as the only fallback)
  const { generateImageAssets } = await import('./image.service');
  const assets = await generateImageAssets(promptText, count, 'logo_template');

  const concepts: LogoConcept[] = assets.map((asset, idx) => ({
    id: `logo_template_${Date.now()}_${idx + 1}`,
    url: asset.url || asset.dataUri,
    prompt: promptText,
    style: archetypeId,
    model: 'flux',
    mode: 'template',
  }));

  if (concepts.length === 0) {
    // Fallback if image generation fails entirely
    const { generateLogoFromScratch } = await import('./flux.service');
    return generateLogoFromScratch({
      brandName,
      archetypeId,
      preferredColors,
      fontStyle,
      styleKeywords,
      industry,
      count,
    });
  }

  return concepts;
}

