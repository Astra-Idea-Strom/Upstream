/**
 * Brand Reference & Logo Generation Types
 */

export type LogoArchetype =
  | 'abstract'
  | 'combination'
  | 'emblems'
  | 'lettermark'
  | 'mascot'
  | 'pictorial'
  | 'wordmark';

export interface VisualAttributes {
  dominantPaletteRaw: string;
  hexCodes: string[];
  typographyStyle: string;
  composition: string;
  complexityAndGeometry: string;
  textureAndFinish: string;
}

export interface StrategicVibe {
  personalityRaw: string;
  personalityTraits: string[];
  targetAudience: string;
  symbolism: string;
}

export interface GenerationBlueprint {
  rawPrompt: string;
  basePrompt: string;
  negativeConstraints: string;
  hasBrandPlaceholder: boolean;
}

export interface BrandReferenceEntry {
  id: string;
  name: string;
  archetype: LogoArchetype;
  imageFile: string;
  visualAttributes: VisualAttributes;
  strategicVibe: StrategicVibe;
  generationBlueprint: GenerationBlueprint;
}

export interface ArchetypeCategory {
  id: LogoArchetype;
  name: string;
  tagline: string;
  description: string;
  brandCount: number;
  brands: BrandReferenceEntry[];
}

export interface BrandReferenceDatabase {
  version: string;
  description: string;
  archetypes: Record<LogoArchetype, ArchetypeCategory>;
  catalog: BrandReferenceEntry[];
}

/**
 * Request payload sent to generate a logo prompt or invoke generation
 */
export interface GenerateLogoRequest {
  brandName: string;
  archetype: LogoArchetype;
  exemplarBrandId?: string; // e.g. "spotify", "apple", "chase-bank"
  industry?: string;        // e.g. "Fintech", "HealthTech", "Coffee Roaster"
  userKeywords?: string;    // e.g. "minimalist, midnight neon glow, fluid gradients"
  preferredColors?: string[]; // e.g. ["#117ACA", "#000000"]
}

/**
 * Result payload containing stitched prompts ready for DALL-E 3, Gemini, or Flux
 */
export interface GeneratedPromptPayload {
  targetBrand: string;
  archetype: LogoArchetype;
  exemplarUsed: {
    id: string;
    name: string;
    imageFile: string;
  };
  basePrompt: string;
  negativeConstraints: string;
  /** Full stitched string including negative prompt flags (--no ...) */
  stitchedPrompt: string;
  /** Clean prompt formatted for natural language prompt fields */
  dalle3Prompt: string;
  suggestedHexPalette: string[];
  recommendedModel: string;
}

/**
 * Frontend UI Card Metadata (For Step 3: Visual Direction)
 */
export interface ArchetypeUICard {
  id: LogoArchetype;
  title: string;
  tagline: string;
  description: string;
  bestForIndustries: string[];
  keyVisualTraits: string[];
  famousExamples: Array<{
    name: string;
    imageFile: string;
  }>;
  badgeColor: string;
  iconName: string;
}
