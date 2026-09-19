export type SwatchRole = 'primary' | 'secondary' | 'accent' | 'background' | 'text';

export interface PaletteSwatch {
  hex: string;
  name: string;
  role: SwatchRole;
}

export interface PaletteOption {
  idx: number;
  name: string;
  tone: string;
  description: string;
  /** Always ordered primary → secondary → accent → background → text. */
  swatches: PaletteSwatch[];
  fonts: { headline: string; body: string };
}

/**
 * The one canonical visual-direction catalogue.
 *
 * This previously existed twice — once inside the palette chooser and once
 * inside the confirmed palette card — and the two lists had drifted: index 3
 * was "Modern Tech & Hyper Indigo" in the chooser but "Pure Botanical Sage" in
 * the card, so selecting it showed a palette the user never picked. Both
 * surfaces, and the Canva controls, now read from here.
 */
export const PALETTE_OPTIONS: readonly PaletteOption[] = [
  {
    idx: 0,
    name: 'Electric Neon & Violet',
    tone: 'bold',
    description: 'High-energy modern tech-forward and streetwear contrast.',
    swatches: [
      { hex: '#7C3AED', name: 'Electric Violet', role: 'primary' },
      { hex: '#1E1B4B', name: 'Midnight Navy', role: 'secondary' },
      { hex: '#FB7185', name: 'Neon Coral', role: 'accent' },
      { hex: '#F8F6FE', name: 'Lilac Fog', role: 'background' },
      { hex: '#0F172A', name: 'Pitch Ink', role: 'text' },
    ],
    fonts: { headline: 'Plus Jakarta Sans', body: 'Inter' },
  },
  {
    idx: 1,
    name: 'Artisan Terracotta & Roast',
    tone: 'playful',
    description: 'Warm, cosy earthy ceramics, espresso crema and natural kraft paper.',
    swatches: [
      { hex: '#D97706', name: 'Terracotta Glaze', role: 'primary' },
      { hex: '#FDE68A', name: 'Warm Cream', role: 'secondary' },
      { hex: '#7C3AED', name: 'Artisan Violet', role: 'accent' },
      { hex: '#FDFBF7', name: 'Linen Paper', role: 'background' },
      { hex: '#451A03', name: 'Dark Roast', role: 'text' },
    ],
    fonts: { headline: 'Outfit', body: 'Merriweather' },
  },
  {
    idx: 2,
    name: 'Haute Atelier Pastel',
    tone: 'luxurious',
    description: 'Soft, silk European elegance with muted lavender and champagne gold.',
    swatches: [
      { hex: '#9060FA', name: 'Silk Lavender', role: 'primary' },
      { hex: '#DDD6FE', name: 'Mist Lilac', role: 'secondary' },
      { hex: '#F59E0B', name: 'Warm Amber Gold', role: 'accent' },
      { hex: '#FCFBFF', name: 'Opal Pearl', role: 'background' },
      { hex: '#1E1035', name: 'Velvet Noir', role: 'text' },
    ],
    fonts: { headline: 'Playfair Display', body: 'Plus Jakarta Sans' },
  },
  {
    idx: 3,
    name: 'Modern Tech & Hyper Indigo',
    tone: 'tech-forward',
    description: 'Crisp developer intelligence with glassmorphism and cyan glows.',
    swatches: [
      { hex: '#6366F1', name: 'Hyper Indigo', role: 'primary' },
      { hex: '#06B6D4', name: 'Cyan Glow', role: 'secondary' },
      { hex: '#8B5CF6', name: 'Prism Purple', role: 'accent' },
      { hex: '#F8FAFC', name: 'Clean Circuit', role: 'background' },
      { hex: '#0B0F19', name: 'Deep Space', role: 'text' },
    ],
    fonts: { headline: 'Outfit', body: 'Inter' },
  },
  {
    idx: 4,
    name: 'Organic Botanical & Emerald',
    tone: 'minimalist',
    description: 'Tactile morning dew, wild rose accents and apothecary calm.',
    swatches: [
      { hex: '#10B981', name: 'Botanical Emerald', role: 'primary' },
      { hex: '#A7F3D0', name: 'Mint Dew', role: 'secondary' },
      { hex: '#F472B6', name: 'Wild Blossom', role: 'accent' },
      { hex: '#F6FBF8', name: 'Fresh Morning', role: 'background' },
      { hex: '#064E3B', name: 'Deep Canopy', role: 'text' },
    ],
    fonts: { headline: 'Merriweather', body: 'Inter' },
  },
] as const;

export const DEFAULT_PALETTE_IDX = 1;

/** Resolve a palette by index, falling back to the first entry. */
export function getPalette(idx: number): PaletteOption {
  return PALETTE_OPTIONS.find((option) => option.idx === idx) ?? PALETTE_OPTIONS[0];
}
