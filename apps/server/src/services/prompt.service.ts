/**
 * Logo Prompt Generation & Orchestration Service
 * 
 * - Loads structured brand reference database (brand_reference.json)
 * - Dynamically stitches prompts with archetype, brand name, and keywords
 * - Formats output payloads for Flux, Gemini, or DALL-E
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  BrandReferenceDatabase,
  BrandReferenceEntry,
  ArchetypeCategory,
  LogoArchetype,
  GenerateLogoRequest,
  GeneratedPromptPayload
} from '../types/logo.types';

export class LogoPromptService {
  private database: BrandReferenceDatabase;

  constructor(jsonPath?: string) {
    this.database = this.loadDatabase(jsonPath);
  }

  /**
   * Load brand reference database from JSON
   */
  private loadDatabase(customPath?: string): BrandReferenceDatabase {
    const candidates = [
      customPath,
      path.resolve(__dirname, '../data/brand_reference.json'),
      path.resolve(__dirname, '../../data/brand_reference.json'),
      path.resolve(__dirname, '../../../API & Others/brand_reference.json'),
      path.resolve(process.cwd(), 'src/data/brand_reference.json'),
      path.resolve(process.cwd(), 'data/brand_reference.json'),
      path.resolve(process.cwd(), 'brand_reference.json'),
    ].filter(Boolean) as string[];

    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw) as BrandReferenceDatabase;
      }
    }

    throw new Error(
      `Could not locate 'brand_reference.json'. Looked in: ${candidates.join(', ')}`
    );
  }

  /**
   * List all 7 archetype categories with metadata
   */
  public getArchetypes(): ArchetypeCategory[] {
    return Object.values(this.database.archetypes);
  }

  /**
   * Get specific archetype details
   */
  public getArchetype(archetypeId: LogoArchetype): ArchetypeCategory | undefined {
    return this.database.archetypes[archetypeId];
  }

  /**
   * Get all brand exemplars for a specific archetype
   */
  public getExemplarsByArchetype(archetypeId: LogoArchetype): BrandReferenceEntry[] {
    const category = this.database.archetypes[archetypeId];
    return category ? category.brands : [];
  }

  /**
   * Find a specific brand by slug ID (e.g. 'apple', 'chase-bank', 'spotify')
   */
  public getBrandById(brandId: string): BrandReferenceEntry | undefined {
    return this.database.catalog.find(b => b.id === brandId.toLowerCase().trim());
  }

  /**
   * Core Engine: Stitches brand name, archetype rules, and custom keywords into a ready prompt
   */
  public buildLogoPrompt(request: GenerateLogoRequest): GeneratedPromptPayload {
    const { brandName, archetype, exemplarBrandId, industry, userKeywords, preferredColors } = request;

    if (!brandName || !brandName.trim()) {
      throw new Error('Brand name is required to generate a logo prompt.');
    }

    const category = this.database.archetypes[archetype];
    if (!category || !category.brands || category.brands.length === 0) {
      throw new Error(`Invalid or empty logo archetype: '${archetype}'`);
    }

    // Select exemplar brand: either user-selected, or pick first in category
    let exemplar: BrandReferenceEntry = category.brands[0];
    if (exemplarBrandId) {
      const match = category.brands.find(b => b.id === exemplarBrandId.toLowerCase().trim());
      if (match) exemplar = match;
    }

    const blueprint = exemplar.generationBlueprint;
    let basePrompt = blueprint.basePrompt;
    const negativeConstraints = blueprint.negativeConstraints;

    // 1. Substitute [BRAND] token with user's target brand name
    const sanitizedBrand = brandName.trim();
    basePrompt = basePrompt.replace(/\[BRAND\]/g, sanitizedBrand);

    // 2. Inject Industry Context if supplied
    if (industry && industry.trim()) {
      basePrompt += `, crafted specifically for the ${industry.trim()} sector`;
    }

    // 3. Inject User Keywords / Aesthetic Vibes if supplied
    if (userKeywords && userKeywords.trim()) {
      basePrompt += `, incorporating visual cues of ${userKeywords.trim()}`;
    }

    // 4. Inject Preferred Colors if supplied
    if (preferredColors && preferredColors.length > 0) {
      const colorStr = preferredColors.join(', ');
      basePrompt += `, styled in a curated palette featuring ${colorStr}`;
    }

    // 5. Stitched Prompt (Midjourney / Flux style with --no flags)
    const stitchedPrompt = negativeConstraints
      ? `${basePrompt} --no ${negativeConstraints}`
      : basePrompt;

    // 6. Natural Language Formatted Prompt
    const dalle3Prompt = negativeConstraints
      ? `${basePrompt}. Requirements: Clean, professional vector logo design on a pure white or transparent background. Avoid: ${negativeConstraints}`
      : `${basePrompt}. Clean, professional vector logo design on a pure white or transparent background.`;

    // 7. FLUX.2 [dev] prompt — natural language only, wordmark pinned
    const fluxPrompt = this.buildFluxPrompt({
      brandName: sanitizedBrand,
      archetype,
      exemplar,
      industry,
      userKeywords,
      preferredColors:
        preferredColors && preferredColors.length > 0
          ? preferredColors
          : exemplar.visualAttributes.hexCodes,
    });

    return {
      targetBrand: sanitizedBrand,
      archetype,
      exemplarUsed: {
        id: exemplar.id,
        name: exemplar.name,
        imageFile: exemplar.imageFile
      },
      basePrompt,
      negativeConstraints,
      stitchedPrompt,
      dalle3Prompt,
      fluxPrompt,
      wordmarkText: sanitizedBrand,
      suggestedHexPalette: preferredColors && preferredColors.length > 0 
        ? preferredColors 
        : exemplar.visualAttributes.hexCodes,
      recommendedModel: 'FLUX.2 [dev] · black-forest-labs/flux-2-dev'
    };
  }

  /**
   * Build a prompt FLUX.2 [dev] actually understands.
   *
   * Three things this fixes versus the raw blueprint prompt:
   *   1. No `--no …` flags. FLUX.2 reads natural language; flags get painted
   *      into the image as stray text.
   *   2. The wordmark string is quoted and pinned, and the model is told to
   *      render no other words — this is what makes the brand name land in the
   *      artwork instead of a misspelled approximation.
   *   3. The blueprint's own composition and typography notes are reused so the
   *      archetype still drives the geometry.
   */
  public buildFluxPrompt(args: {
    brandName: string;
    archetype: LogoArchetype;
    exemplar?: BrandReferenceEntry;
    industry?: string;
    userKeywords?: string;
    preferredColors?: string[];
  }): string {
    const { brandName, archetype, exemplar, industry, userKeywords, preferredColors } = args;
    const blueprint = exemplar?.generationBlueprint;
    const visual = exemplar?.visualAttributes;

    const lines: string[] = [];

    lines.push(
      `Professional flat vector logo lockup for the brand "${brandName}".`,
      `The wordmark text must read exactly "${brandName}" — spelled letter by letter, correctly, in a clean legible typeface. Render no other words, no lorem text, no watermark.`
    );

    lines.push(`Logo archetype: ${archetype} mark.`);
    if (industry) lines.push(`Industry context: ${industry}.`);

    if (visual?.composition) {
      lines.push(`Composition to adapt: ${visual.composition}`);
    }
    if (visual?.complexityAndGeometry) {
      lines.push(`Geometry: ${visual.complexityAndGeometry}`);
    }
    if (visual?.typographyStyle) {
      lines.push(`Typography direction: ${visual.typographyStyle}`);
    }
    if (blueprint?.basePrompt) {
      // Reuse the archetype's distilled brief, minus any placeholder tokens.
      lines.push(`Archetype brief: ${blueprint.basePrompt.replace(/\[BRAND\]/g, brandName)}`);
    }
    if (userKeywords?.trim()) {
      lines.push(`Aesthetic cues: ${userKeywords.trim()}.`);
    }
    if (preferredColors && preferredColors.length > 0) {
      lines.push(`Use this exact palette: ${preferredColors.join(', ')}.`);
    }

    const exclusions = [
      blueprint?.negativeConstraints,
      'photorealistic rendering',
      '3D bevels or glossy highlights',
      'drop shadows or mockups',
      'busy backgrounds or scenery',
      'extra text or gibberish lettering',
      'watermarks or signatures',
    ]
      .filter(Boolean)
      .join(', ');

    lines.push(
      'Style: crisp uniform line weight, generous negative space, centered composition, ' +
        'high contrast, pure white background, print-ready logo artwork.'
    );
    lines.push(`Do not include: ${exclusions}.`);

    return lines.join('\n');
  }
}

export const promptService = new LogoPromptService();
