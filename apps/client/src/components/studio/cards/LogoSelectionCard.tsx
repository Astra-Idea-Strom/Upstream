import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { CardShell } from '../CardShell';
import { Button } from '../../ui/primitives';
import type { LogoStyle } from '@upstream/shared';
import { cn } from '../../../lib/cn';
import { Check } from 'lucide-react';

const LOGO_OPTIONS: { style: LogoStyle; label: string; desc: string }[] = [
  { style: 'minimal', label: 'Minimalist Glyph', desc: 'Continuous-line monogram with optical balance' },
  { style: 'wordmark', label: 'Modern Wordmark', desc: 'Architectural typography with proportional kerning' },
  { style: 'abstract', label: 'Abstract Prism', desc: 'Faceted tech symbol with vibrant refraction' },
  { style: 'geometric', label: 'Geometric Crest', desc: 'Golden-ratio badge with timeless symmetry' },
  { style: 'illustrative', label: 'Illustrative Emblem', desc: 'Organic sculptural symbol with artisanal warmth' },
];

/**
 * Step 5, choosing state — vector logo directions.
 */
export const LogoSelectionCard: React.FC = () => {
  const { selectedName, selectedLogoStyle, selectLogoStyle, closeLogoModal, hasConfirmedLogo } =
    useBrandStore();

  return (
    <CardShell
      id="step-card-logo"
      step={5}
      variant="choosing"
      status={{ label: 'Choose one', tone: 'warning', dot: true, pulse: true }}
      actions={
        <>
          {hasConfirmedLogo && (
            <Button variant="ghost" size="sm" onClick={closeLogoModal}>
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectLogoStyle(LOGO_OPTIONS[0].style)}
          >
            Pick first
          </Button>
        </>
      }
      title={`Logo direction for ${selectedName.name}`}
      subtitle="Vector marks for light and dark backgrounds."
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {LOGO_OPTIONS.map((option) => {
          // `selectedLogoStyle` always holds a value so the live preview has a
          // style to render; only treat it as a user choice once it's confirmed.
          const isSelected = hasConfirmedLogo && selectedLogoStyle === option.style;

          return (
            <li key={option.style}>
              <button
                type="button"
                onClick={() => selectLogoStyle(option.style)}
                aria-pressed={isSelected}
                className={cn(
                  'group flex h-full w-full flex-col items-center gap-3 rounded-2xl border p-3.5 text-center transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/20'
                    : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70',
                )}
              >
                <span className="flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-2">
                  <LogoArtwork brand={selectedName} style={option.style} variant="light" size="sm" />
                </span>

                <span className="flex-1">
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="font-display text-xs font-bold text-slate-900">
                      {option.label}
                    </span>
                    {isSelected && <Check className="h-3 w-3 text-brand-600" />}
                  </span>
                  <span className="mt-0.5 block text-2xs leading-snug text-slate-500">
                    {option.desc}
                  </span>
                </span>

                <span
                  className={cn(
                    'w-full rounded-lg py-1.5 text-2xs font-bold transition-colors',
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-brand-600 group-hover:text-white',
                  )}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </CardShell>
  );
};
