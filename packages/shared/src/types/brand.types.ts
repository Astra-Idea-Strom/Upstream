// ============================================================
// BRAND INPUT
// ============================================================
export type BrandTone =
  | 'playful'
  | 'professional'
  | 'minimalist'
  | 'bold'
  | 'tech-forward'
  | 'luxurious';

export interface BrandInput {
  businessName?: string;        // optional – user's existing name for inspiration
  industry: string;             // e.g. "sustainable productivity"
  targetAudience: string;       // e.g. "remote workers aged 25-40"
  mission: string;              // 1-2 sentence mission / values statement
  tone: BrandTone;
  constraints: string;          // e.g. "must feel trustworthy, avoid tech clichés"
}

// ============================================================
// COLOR & VISUAL
// ============================================================
export type ColorRole = 'primary' | 'secondary' | 'accent' | 'background' | 'text';

export interface ColorSwatch {
  hex: string;                  // e.g. "#2D6A4F"
  name: string;                 // human-readable color name e.g. "Forest Green"
  role: ColorRole;
}

export interface FontPairing {
  headline: string;             // Google Font name e.g. "Inter"
  body: string;                 // Google Font name e.g. "Merriweather"
  headlineWeight: string;       // e.g. "700"
  bodyWeight: string;           // e.g. "400"
}

export interface VisualDirection {
  palette: ColorSwatch[];       // exactly 5 swatches: primary, secondary, accent, background, text
  fonts: FontPairing;
  styleDescription: string;     // 2-3 sentence visual direction description
}

// ============================================================
// DOMAIN
// ============================================================
export interface SocialHandles {
  twitter: boolean;
  instagram: boolean;
}

export interface DomainAvailability {
  com: boolean;
  io: boolean;
  co: boolean;
  handle: SocialHandles;
}

// ============================================================
// BRAND NAME
// ============================================================
export interface BrandName {
  id: string;                   // e.g. "name_001" – assigned by backend
  name: string;                 // max 12 characters
  meaning: string;              // 1-sentence etymology / concept explanation
  tagline: string;              // 5-10 words, punchy and memorable
  domainAvailability: DomainAvailability;
  visualDirection: VisualDirection;
}

// ============================================================
// LOGO
// ============================================================
export type LogoStyle =
  | 'minimal'
  | 'wordmark'
  | 'abstract'
  | 'geometric'
  | 'illustrative';

export type LogoArchetype =
  | 'abstract'
  | 'combination'
  | 'emblems'
  | 'lettermark'
  | 'mascot'
  | 'pictorial'
  | 'wordmark';

export type LogoMode = 'template' | 'scratch';

export interface LogoConcept {
  id: string;                   // e.g. "logo_001"
  url: string;                  // image URL or base64 data URI
  prompt: string;               // the exact prompt used to generate it
  style: LogoStyle | string;
  model?: 'gemini' | 'flux';    // AI engine that generated it
  mode?: LogoMode;              // generation mode
}

export interface LogoGenerationRequest {
  projectId: string;
  selectedName: BrandName;
  mode: LogoMode;
  archetypeId?: string;            // e.g. 'abstract', 'combination', 'wordmark'
  exemplarBrandId?: string;        // e.g. 'chase-bank', 'spotify'
  referenceImageBase64?: string;   // optional direct base64 image data
  referenceImageMimeType?: string; // e.g. 'image/png', 'image/jpeg'
  preferredColors?: string[];      // hex codes e.g. ['#117ACA', '#231F20']
  fontStyle?: string;              // e.g. 'geometric sans-serif', 'serif'
  styleKeywords?: string;          // e.g. 'minimalist, corporate'
  industry?: string;
  count?: number;                  // number of concepts (default: 2)
}

// ============================================================
// PROJECT
// ============================================================
export interface BrandProject {
  id: string;                   // Firestore document ID e.g. "proj_abc123"
  userId?: string;              // optional – null for anonymous sessions
  input: BrandInput;
  generatedNames: BrandName[];
  selectedName?: BrandName;     // set after user picks a favourite
  logoConcepts?: LogoConcept[]; // populated after logo generation step
  selectedLogo?: LogoConcept;   // set after user picks a logo
  createdAt: string;            // ISO 8601 timestamp
  updatedAt: string;            // ISO 8601 timestamp
}
