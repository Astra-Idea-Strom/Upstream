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
 * Generate logo concepts using Gemini Image generation (gemini-3.1-flash-image)
 */
export async function generateLogoFromTemplate(
  params: GenerateTemplateLogoParams
): Promise<LogoConcept[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const {
    brandName,
    archetypeId,
    preferredColors = [],
    fontStyle = '',
    styleKeywords = '',
    industry = '',
    count = 2,
  } = params;

  // Resolve reference image
  const referenceImage = await resolveReferenceImage(params);

  // Build the generation prompt
  const colorDesc = preferredColors.length > 0 ? `Palette: ${preferredColors.join(', ')}.` : '';
  const fontDesc = fontStyle ? `Typography style: ${fontStyle}.` : '';
  const keywordDesc = styleKeywords ? `Design aesthetic: ${styleKeywords}.` : '';
  const industryDesc = industry ? `Industry sector: ${industry}.` : '';

  const promptText = `Design a high-quality, professional vector logo for the brand named "${brandName}".
Archetype: ${archetypeId} logo mark.
${industryDesc}
${colorDesc}
${fontDesc}
${keywordDesc}
Compositional Rules:
- Emulate the design balance, symmetry, and geometric abstraction of the reference logo.
- Do NOT copy or reproduce the reference brand name or trademarked elements. Adapt only the archetypal visual grammar for "${brandName}".
- Clean vector art on a pure white or transparent background. High contrast, crisp contours. No realistic photos, no complex gradients, no 3D textures.`;

  const modelName = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestParts: any[] = [{ text: promptText }];
  if (referenceImage) {
    requestParts.push({
      inlineData: {
        mimeType: referenceImage.mimeType,
        data: referenceImage.base64,
      },
    });
  }

  const concepts: LogoConcept[] = [];

  // Generate requested number of variations
  for (let i = 0; i < Math.min(count, 3); i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: requestParts }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[GeminiService] Gemini API returned ${response.status}:`, errText);

        if (response.status === 429) {
          throw new Error('AI_QUOTA_EXCEEDED: Gemini image generation quota exceeded.');
        }
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];

      // Find image part
      let imageDataUri = '';
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageDataUri = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageDataUri) {
        throw new Error('Gemini response did not contain an image payload.');
      }

      concepts.push({
        id: `logo_gemini_${Date.now()}_${i + 1}`,
        url: imageDataUri,
        prompt: promptText,
        style: archetypeId,
        model: 'gemini',
        mode: 'template',
      });
    } catch (err: any) {
      console.error(`[GeminiService] Generation iteration ${i + 1} failed:`, err.message);
      if (concepts.length === 0 && i === count - 1) {
        throw err;
      }
    }
  }

  return concepts;
}
