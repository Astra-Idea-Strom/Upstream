/**
 * Logo Prompt Generation & Orchestration Service (Node.js / Express Backend)
 * 
 * - Loads structured brand reference database (brand_reference.json)
 * - Dynamically stitches prompts with user-selected archetype, brand name, and keywords
 * - Formats output payloads for OpenAI DALL-E 3 and Midjourney / Flux APIs
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
} from './brandTypes';

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
      path.resolve(__dirname, 'brand_reference.json'),
      path.resolve(__dirname, '../brand_reference.json'),
      path.resolve(__dirname, '../../Sample_data/brand_reference.json'),
      path.resolve(process.cwd(), 'brand_reference.json'),
      path.resolve(process.cwd(), 'Sample_data/brand_reference.json')
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

    // 6. DALL-E 3 Optimized Prompt (Positive natural language framing)
    // DALL-E 3 lacks a native negative prompt parameter; negative constraints are explicitly converted to strict negative instructions.
    const dalle3Prompt = negativeConstraints
      ? `${basePrompt}. Requirements: Clean, professional vector logo design on a pure white or transparent background. Avoid: ${negativeConstraints}`
      : `${basePrompt}. Clean, professional vector logo design on a pure white or transparent background.`;

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
      suggestedHexPalette: preferredColors && preferredColors.length > 0 
        ? preferredColors 
        : exemplar.visualAttributes.hexCodes,
      recommendedModel: 'DALL-E 3 / Flux.1-Dev'
    };
  }

  /**
   * Prepares the exact JSON payload required for OpenAI's images.generate API call
   */
  public createOpenAIDallePayload(
    request: GenerateLogoRequest,
    options?: { size?: '1024x1024' | '1792x1024' | '1024x1792'; quality?: 'standard' | 'hd' }
  ) {
    const promptPayload = this.buildLogoPrompt(request);

    return {
      model: 'dall-e-3',
      prompt: promptPayload.dalle3Prompt,
      n: 1, // DALL-E 3 generates 1 image per request
      size: options?.size || '1024x1024',
      quality: options?.quality || 'standard',
      response_format: 'url',
      _metadata: {
        targetBrand: promptPayload.targetBrand,
        archetype: promptPayload.archetype,
        exemplarUsed: promptPayload.exemplarUsed,
        palette: promptPayload.suggestedHexPalette
      }
    };
  }
}
