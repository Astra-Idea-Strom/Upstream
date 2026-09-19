import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import type { LogoStyle } from '@upstream/shared';
import { Check, ArrowRight } from 'lucide-react';

const LOGO_OPTIONS: { style: LogoStyle; label: string; desc: string }[] = [
  {
    style: 'minimal',
    label: 'Minimalist Glyph',
    desc: 'Continuous-line geometric monogram with optical balance',
  },
  {
    style: 'wordmark',
    label: 'Modern Wordmark',
    desc: 'Architectural custom typography with proportional kerning',
  },
  {
    style: 'abstract',
    label: 'Abstract Prism',
    desc: 'Dynamic multifaceted symbol with clean geometry',
  },
  {
    style: 'geometric',
    label: 'Geometric Crest',
    desc: 'Balanced badge with timeless symmetry',
  },
  {
    style: 'illustrative',
    label: 'Illustrative Emblem',
    desc: 'Organic sculptural symbol celebrating craftsmanship',
  },
];

export const LogoSelectionCard: React.FC = () => {
  const {
    selectedName,
    selectedLogoStyle,
    selectLogoStyle,
    closeLogoModal,
    hasConfirmedLogo,
  } = useBrandStore();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Visual Symbolism
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Vector Logo Styles for {selectedName.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose a vector mark style calibrated for digital and physical touchpoints.
          </p>
        </div>

        {hasConfirmedLogo && (
          <button
            onClick={closeLogoModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors self-start sm:self-auto"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {LOGO_OPTIONS.map((opt) => {
          const isSelected = selectedLogoStyle === opt.style;

          return (
            <div
              key={opt.style}
              onClick={() => selectLogoStyle(opt.style)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center justify-between gap-3 ${
                isSelected
                  ? 'border-slate-900 bg-slate-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
              }`}
            >
              <div className="w-28 h-28 flex items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                <LogoArtwork
                  brand={selectedName}
                  style={opt.style}
                  variant="light"
                  size="sm"
                />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 font-display">
                  {opt.label}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed font-normal">
                  {opt.desc}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectLogoStyle(opt.style);
                }}
                className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white'
                }`}
              >
                <span>{isSelected ? 'Active Mark' : 'Select Style'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
