import type React from 'react';

export type CanvasBackground = 'light' | 'linen' | 'dark' | 'brand';

export interface CanvasSurface {
  mode: CanvasBackground;
  /** Shown in the toolbar's title/aria text. */
  label: string;
  /** Applied to the artboard. */
  classes: string;
  /** Representative hex, used for contrast checks. */
  hex: string;
  /** Ink guaranteed to read on this surface — also the reset value. */
  ink: string;
}

/**
 * The four surfaces the lockup is previewed on.
 *
 * Previously the artboard held its own `bgStyles` map and the toolbar held its
 * own `BACKGROUNDS` list, so the two could disagree about what "Linen" looks
 * like. Both now read this one definition, the same way the palette row reads
 * `lib/palettes.ts`.
 */
export const CANVAS_SURFACES: readonly CanvasSurface[] = [
  {
    mode: 'light',
    label: 'White',
    classes: 'bg-white border-slate-200/90',
    hex: '#FFFFFF',
    ink: '#0F172A',
  },
  {
    mode: 'linen',
    label: 'Linen',
    classes: 'bg-[#FDFBF7] border-amber-200/80',
    hex: '#FDFBF7',
    ink: '#451A03',
  },
  {
    mode: 'dark',
    label: 'Dark',
    classes: 'bg-slate-950 border-slate-800',
    hex: '#0F172A',
    ink: '#FFFFFF',
  },
  {
    mode: 'brand',
    label: 'Brand',
    classes: 'bg-gradient-to-br from-brand-600 via-brand-700 to-coral-500 border-transparent',
    hex: '#7C3AED',
    ink: '#FFFFFF',
  },
] as const;

export function getCanvasSurface(mode: CanvasBackground): CanvasSurface {
  return CANVAS_SURFACES.find((surface) => surface.mode === mode) ?? CANVAS_SURFACES[0];
}

/**
 * Icons are kept out of the shared module so it stays free of React — the
 * toolbar owns presentation. This maps a surface to its control glyph.
 */
export type SurfaceIcons = Record<CanvasBackground, React.ReactNode>;
