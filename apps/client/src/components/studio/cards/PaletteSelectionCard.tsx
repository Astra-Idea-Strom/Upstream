import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { PALETTE_OPTIONS, DEFAULT_PALETTE_IDX } from '../../../lib/palettes';
import { CardShell } from '../CardShell';
import { SwatchStrip } from '../SwatchStrip';
import { Button } from '../../ui/primitives';
import { cn } from '../../../lib/cn';
import { Check } from 'lucide-react';

/**
 * Step 4, choosing state — chromatic harmony and type pairing.
 */
export const PaletteSelectionCard: React.FC = () => {
  const { selectedName, activePaletteIdx, selectPalette, closePaletteModal, hasConfirmedPalette } =
    useBrandStore();

  return (
    <CardShell
      id="step-card-visual"
      step={4}
      variant="choosing"
      status={{ label: 'Choose one', tone: 'warning', dot: true, pulse: true }}
      actions={
        <>
          {hasConfirmedPalette && (
            <Button variant="ghost" size="sm" onClick={closePaletteModal}>
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectPalette(DEFAULT_PALETTE_IDX)}
          >
            Pick first
          </Button>
        </>
      }
      title={`Colour direction for ${selectedName.name}`}
      subtitle="Five harmonies, each with a font pairing."
    >
      <ul className="space-y-3">
        {PALETTE_OPTIONS.map((palette) => {
          // `activePaletteIdx` always holds a value so the live preview has a
          // palette to render; only treat it as a user choice once applied.
          const isSelected = hasConfirmedPalette && activePaletteIdx === palette.idx;

          return (
            <li key={palette.idx}>
              <button
                type="button"
                onClick={() => selectPalette(palette.idx)}
                aria-pressed={isSelected}
                className={cn(
                  'w-full rounded-2xl border p-3.5 text-left transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/20'
                    : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                  <span className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-slate-900">
                      {palette.name}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-2xs font-semibold text-slate-600">
                      {palette.tone}
                    </span>
                  </span>

                  <span className="flex flex-shrink-0 items-center gap-2">
                    <span className="hidden font-mono text-2xs text-slate-500 sm:inline">
                      {palette.fonts.headline} + {palette.fonts.body}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-brand-600" />}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {palette.description}
                </p>

                <SwatchStrip
                  swatches={palette.swatches}
                  size="sm"
                  showHex={false}
                  showName
                  className="mt-3"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </CardShell>
  );
};
