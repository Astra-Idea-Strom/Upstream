/**
 * Colour maths for the lockup editor.
 *
 * The editor let the user set a text colour from the brand palette, but every
 * palette ships a near-white `background` swatch (`#FDFBF7`, `#F8F6FE`, …).
 * Picking one made the wordmark invisible on the white canvas — the swatch row
 * was offering background colours as if they were inks. These helpers let the
 * toolbar refuse a colour it knows cannot be read.
 */

function parseHex(hex: string): [number, number, number] | null {
  const value = hex.trim().replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return null;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1 (identical) → 21 (black on white). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * The lowest ratio a swatch may have against the canvas before the toolbar
 * refuses it. 3:1 is the WCAG AA floor for large text, and the wordmark is
 * large by design — anything below this reads as a smudge, not as type.
 */
export const MIN_TEXT_CONTRAST = 3;

/** True when `ink` is readable on `surface`. */
export function isLegible(ink: string, surface: string): boolean {
  return contrastRatio(ink, surface) >= MIN_TEXT_CONTRAST;
}
