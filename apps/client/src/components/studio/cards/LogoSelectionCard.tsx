import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import type { LogoStyle } from '@upstream/shared';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const LOGO_OPTIONS: { style: LogoStyle; label: string; desc: string }[] = [
  { style: 'minimal', label: 'Minimalist Glyph', desc: 'Continuous-line geometric monogram with modern optical balance' },
  { style: 'wordmark', label: 'Modern Wordmark', desc: 'Architectural custom typography with proportional kerning' },
  { style: 'abstract', label: 'Abstract Prism', desc: 'Dynamic multifaceted tech symbol and vibrant refraction' },
  { style: 'geometric', label: 'Geometric Crest', desc: 'Golden ratio balanced badge with timeless symmetry' },
  { style: 'illustrative', label: 'Illustrative Emblem', desc: 'Organic sculptural symbol celebrating artisanal warmth' },
];

export const LogoSelectionCard: React.FC = () => {
  const {
    selectedName,
    selectedLogoStyle,
    selectLogoStyle,
    closeLogoModal,
    hasConfirmedLogo,
  } = useBrandStore();

  const handleAutoPick = () => {
    selectLogoStyle('minimal');
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-300/90 p-6 sm:p-7 shadow-md relative overflow-hidden transition-all animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>STEP 5: VECTOR LOGO MARKS</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
            Choose Vector Logo Style for <span className="text-brand-600">{selectedName.name}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Scalable mathematical vector marks calibrated for light and dark backgrounds.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedLogo && (
            <button
              onClick={closeLogoModal}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAutoPick}
            className="px-3.5 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-brand-600" />
            <span>⚡ Complete Brand Kit</span>
          </button>
        </div>
      </div>

      {/* 5 Logo Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {LOGO_OPTIONS.map((opt) => {
          const isSelected = selectedLogoStyle === opt.style;

          return (
            <div
              key={opt.style}
              onClick={() => selectLogoStyle(opt.style)}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center justify-between gap-3 ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                  : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              {/* Live Vector Artwork */}
              <div className="w-28 h-28 flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform duration-200">
                <LogoArtwork
                  brand={selectedName}
                  style={opt.style}
                  variant="light"
                  size="sm"
                />
              </div>

              <div>
                <h4 className="font-display font-bold text-sm text-slate-900">
                  {opt.label}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  {opt.desc}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectLogoStyle(opt.style);
                }}
                className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 group-hover:bg-brand-600 group-hover:text-white'
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
