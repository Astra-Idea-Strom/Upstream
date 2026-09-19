import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getPalette } from '../../../lib/palettes';
import { CANVAS_SURFACES, getCanvasSurface } from '../../../lib/canvasSurfaces';
import { isLegible } from '../../../lib/color';
import { SegmentedControl } from '../../ui/primitives';
import { cn } from '../../../lib/cn';
import { Moon, RotateCcw, Sun, Type } from 'lucide-react';

export const FONT_OPTIONS = [
  { name: 'Outfit' },
  { name: 'Plus Jakarta Sans' },
  { name: 'Syne' },
  { name: 'Playfair Display' },
  { name: 'Inter' },
  { name: 'Space Grotesk' },
  { name: 'Merriweather' },
];

type CanvasElement = 'wordmark' | 'tagline' | 'background';

const SURFACE_ICONS: Record<string, React.ReactNode> = {
  light: <Sun className="h-3.5 w-3.5" />,
  linen: <span className="text-2xs font-bold">Aa</span>,
  dark: <Moon className="h-3.5 w-3.5" />,
  brand: <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-brand-600 to-coral-500" />,
};

const SELECT_CLASS =
  'rounded-lg border border-slate-200 bg-white px-2 py-1 text-2xs font-semibold text-slate-700 ' +
  'transition-colors hover:border-slate-300 focus:border-brand-400 focus:outline-none ' +
  'focus:ring-4 focus:ring-brand-500/10';

const STEP_BUTTON_CLASS =
  'flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 ' +
  'transition-colors hover:bg-slate-100 hover:text-slate-900 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45';

const GROUP_LABEL = 'text-2xs font-medium text-slate-400';

/**
 * Live design controls for the selected lockup.
 *
 * The panel shows the properties of whichever element the tabs point at, and
 * **every control it shows works**. Three controls used to be decorative:
 *
 * - The swatch row read the brand palette, which always carries a near-white
 *   `background` colour. Clicking it set the wordmark to the canvas colour, so
 *   the text vanished — the row was offering backgrounds as if they were inks.
 *   Swatches that cannot be read on the current surface are now disabled, with
 *   the reason in the tooltip.
 * - `Font` and `Weight` were shown for the tagline but the artboard renders the
 *   tagline in the lockup's serif face, so they did nothing. They are now only
 *   shown for the wordmark.
 * - The `Canvas` tab had no effect at all; the surface buttons were live
 *   regardless. The surface is now the Canvas tab's property, and the type
 *   controls belong to the two text elements.
 */
export const CanvaEditorToolbar: React.FC = () => {
  const {
    activePaletteIdx,
    canvaSelectedElement,
    setCanvaSelectedElement,
    canvaHeadlineFont,
    setCanvaHeadlineFont,
    canvaWordmarkSize,
    setCanvaWordmarkSize,
    canvaTaglineSize,
    setCanvaTaglineSize,
    canvaFontWeight,
    setCanvaFontWeight,
    canvaLetterSpacing,
    setCanvaLetterSpacing,
    canvaTextColor,
    setCanvaTextColor,
    canvaBgMode,
    setCanvaBgMode,
    resetCanvaStyles,
  } = useBrandStore();

  const palette = getPalette(activePaletteIdx);
  const surface = getCanvasSurface(canvaBgMode);

  const isBackgroundSelected = canvaSelectedElement === 'background';
  const isTaglineSelected = canvaSelectedElement === 'tagline';
  const activeSize = isTaglineSelected ? canvaTaglineSize : canvaWordmarkSize;

  const nudgeSize = (delta: number) => {
    if (isTaglineSelected) {
      setCanvaTaglineSize(Math.min(36, Math.max(10, canvaTaglineSize + delta)));
    } else {
      setCanvaWordmarkSize(Math.min(84, Math.max(18, canvaWordmarkSize + delta)));
    }
  };

  return (
    <div
      role="group"
      aria-label="Lockup style controls"
      className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs"
    >
      {/* Which element is being edited, and a reset. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SegmentedControl<CanvasElement>
          aria-label="Element to edit"
          value={canvaSelectedElement}
          onChange={setCanvaSelectedElement}
          options={[
            { value: 'wordmark', label: 'Name' },
            { value: 'tagline', label: 'Tagline' },
            { value: 'background', label: 'Canvas' },
          ]}
        />

        <button
          type="button"
          onClick={resetCanvaStyles}
          title="Reset all lockup styles"
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-2xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Properties of the selected element. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5">
        {isBackgroundSelected ? (
          /* ------------------------------------------------ Canvas surface */
          <div className="flex items-center gap-1.5">
            <span className={GROUP_LABEL}>Surface</span>
            {CANVAS_SURFACES.map((option) => (
              <button
                key={option.mode}
                type="button"
                onClick={() => setCanvaBgMode(option.mode)}
                title={`${option.label} canvas`}
                aria-label={`${option.label} canvas`}
                aria-pressed={canvaBgMode === option.mode}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                  canvaBgMode === option.mode
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-700',
                )}
              >
                {SURFACE_ICONS[option.mode]}
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Typeface and weight belong to the wordmark only — the tagline
                renders in the lockup's serif face by design. */}
            {!isTaglineSelected && (
              <>
                <div className="flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                  <label htmlFor="canva-font" className="sr-only">
                    Typeface
                  </label>
                  <select
                    id="canva-font"
                    value={canvaHeadlineFont}
                    onChange={(event) => setCanvaHeadlineFont(event.target.value)}
                    className={SELECT_CLASS}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.name} value={font.name}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className={GROUP_LABEL}>Weight</span>
                  {[400, 600, 700, 800].map((weight) => (
                    <button
                      key={weight}
                      type="button"
                      onClick={() => setCanvaFontWeight(weight)}
                      aria-pressed={canvaFontWeight === weight}
                      className={cn(
                        'rounded-md px-1.5 py-1 font-mono text-2xs transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                        canvaFontWeight === weight
                          ? 'bg-slate-900 font-bold text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                      )}
                    >
                      {weight === 400
                        ? 'Reg'
                        : weight === 600
                          ? 'Semi'
                          : weight === 700
                            ? 'Bold'
                            : 'Black'}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Size */}
            <div className="flex items-center gap-1.5">
              <span className={GROUP_LABEL}>Size</span>
              <button
                type="button"
                onClick={() => nudgeSize(-2)}
                aria-label="Decrease size"
                className={STEP_BUTTON_CLASS}
              >
                −
              </button>
              <span className="w-9 text-center font-mono text-2xs font-bold text-slate-700">
                {activeSize}
              </span>
              <button
                type="button"
                onClick={() => nudgeSize(2)}
                aria-label="Increase size"
                className={STEP_BUTTON_CLASS}
              >
                +
              </button>
            </div>

            {/* Tracking */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="canva-tracking" className={GROUP_LABEL}>
                Tracking
              </label>
              <input
                id="canva-tracking"
                type="range"
                min="-1"
                max="12"
                step="1"
                value={canvaLetterSpacing}
                onChange={(event) => setCanvaLetterSpacing(Number.parseInt(event.target.value, 10))}
                className="w-16 cursor-pointer accent-brand-600"
              />
              <span className="w-6 font-mono text-2xs font-bold text-slate-600">
                {canvaLetterSpacing}
              </span>
            </div>

            {/* Colour — only inks that can actually be read on this surface. */}
            <div className="flex items-center gap-1.5">
              <span className={GROUP_LABEL}>Colour</span>
              {palette.swatches.map((swatch) => {
                const usable = isLegible(swatch.hex, surface.hex);
                const selected = canvaTextColor.toLowerCase() === swatch.hex.toLowerCase();

                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    disabled={!usable}
                    onClick={() => setCanvaTextColor(swatch.hex)}
                    title={
                      usable
                        ? `${swatch.name} · ${swatch.hex}`
                        : `${swatch.name} is too close to the ${surface.label.toLowerCase()} canvas to read`
                    }
                    aria-label={
                      usable ? `Use ${swatch.name}` : `${swatch.name} — unreadable on this canvas`
                    }
                    style={{ backgroundColor: swatch.hex }}
                    className={cn(
                      'h-5 w-5 rounded-full border border-black/10 shadow-2xs transition-transform',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                      usable
                        ? 'hover:scale-110'
                        : 'cursor-not-allowed opacity-25 saturate-0',
                      selected && 'ring-2 ring-brand-500 ring-offset-1',
                    )}
                  />
                );
              })}

              <label
                className="relative ml-0.5 flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-gradient-to-tr from-rose-400 via-brand-400 to-amber-300 shadow-2xs transition-transform hover:scale-105"
                title="Custom colour"
              >
                <span className="sr-only">Custom text colour</span>
                <input
                  type="color"
                  value={canvaTextColor.startsWith('#') ? canvaTextColor : '#0F172A'}
                  onChange={(event) => setCanvaTextColor(event.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
