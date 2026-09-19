import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getPalette } from '../../../lib/palettes';
import { SegmentedControl } from '../../ui/primitives';
import { cn } from '../../../lib/cn';
import {
  Moon,
  RotateCcw,
  Sun,
  Type,
} from 'lucide-react';

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
type CanvasBackground = 'light' | 'linen' | 'dark' | 'brand';

const BACKGROUNDS: { mode: CanvasBackground; label: string; icon: React.ReactNode }[] = [
  { mode: 'light', label: 'White', icon: <Sun className="h-3.5 w-3.5" /> },
  { mode: 'linen', label: 'Linen', icon: <span className="text-2xs font-bold">Aa</span> },
  { mode: 'dark', label: 'Dark', icon: <Moon className="h-3.5 w-3.5" /> },
  {
    mode: 'brand',
    label: 'Brand',
    icon: (
      <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-brand-600 to-coral-500" />
    ),
  },
];

const SELECT_CLASS =
  'rounded-lg border border-slate-200 bg-white px-2 py-1 text-2xs font-semibold text-slate-700 ' +
  'transition-colors hover:border-slate-300 focus:border-brand-400 focus:outline-none ' +
  'focus:ring-4 focus:ring-brand-500/10';

const STEP_BUTTON_CLASS =
  'flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 ' +
  'transition-colors hover:bg-slate-100 hover:text-slate-900 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45';

/**
 * Live design controls for the selected lockup.
 *
 * Sits under the name card so the user can tune the wordmark without leaving
 * the canvas. Reads the canonical palette catalogue, so the swatch row here
 * always matches the palette shown in step 4.
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
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs">
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
          title="Reset"
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-2xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Properties of the selected element. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5">
        {/* Typeface */}
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

        {/* Size */}
        <div className="flex items-center gap-1.5">
          <span className="text-2xs font-medium text-slate-400">Size</span>
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

        {/* Weight */}
        <div className="flex items-center gap-1">
          <span className="text-2xs font-medium text-slate-400">Weight</span>
          {[400, 600, 700, 800].map((weight) => (
            <button
              key={weight}
              type="button"
              onClick={() => setCanvaFontWeight(weight)}
              className={cn(
                'rounded-md px-1.5 py-1 font-mono text-2xs transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                canvaFontWeight === weight
                  ? 'bg-slate-900 font-bold text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {weight === 400 ? 'Reg' : weight === 600 ? 'Semi' : weight === 700 ? 'Bold' : 'Black'}
            </button>
          ))}
        </div>

        {/* Tracking */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="canva-tracking"
            className="text-2xs font-medium text-slate-400"
          >
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

        {/* Colour */}
        <div className="flex items-center gap-1.5">
          <span className="text-2xs font-medium text-slate-400">Colour</span>
          {palette.swatches.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => setCanvaTextColor(swatch.hex)}
              title={`${swatch.name} · ${swatch.hex}`}
              aria-label={`Use ${swatch.name}`}
              style={{ backgroundColor: swatch.hex }}
              className={cn(
                'h-5 w-5 rounded-full border border-black/10 shadow-2xs transition-transform hover:scale-110',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                canvaTextColor.toLowerCase() === swatch.hex.toLowerCase() &&
                  'ring-2 ring-brand-500 ring-offset-1',
              )}
            />
          ))}

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

        {/* Canvas background */}
        <div className="flex items-center gap-1">
          <span className="text-2xs font-medium text-slate-400">Canvas</span>
          {BACKGROUNDS.map((background) => (
            <button
              key={background.mode}
              type="button"
              onClick={() => setCanvaBgMode(background.mode)}
              title={background.label}
              aria-label={`${background.label} canvas`}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                canvaBgMode === background.mode
                  ? 'border-brand-300 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-700',
              )}
            >
              {background.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
