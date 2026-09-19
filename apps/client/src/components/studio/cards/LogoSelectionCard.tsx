import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import type { LogoStyle } from '@upstream/shared';
import { Sparkles, ArrowRight, Zap, Check } from 'lucide-react';

const LOGO_OPTIONS: { style: LogoStyle; label: string; desc: string; badge: string; border: string; activeBorder: string }[] = [
  {
    style: 'minimal',
    label: 'Minimalist Glyph',
    desc: 'Continuous-line geometric monogram with modern optical balance',
    badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    border: 'border-emerald-300/90 hover:border-emerald-500',
    activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/60 shadow-md',
  },
  {
    style: 'wordmark',
    label: 'Modern Wordmark',
    desc: 'Architectural custom typography with proportional kerning',
    badge: 'bg-amber-100 text-amber-950 border-amber-300',
    border: 'border-amber-300/90 hover:border-amber-500',
    activeBorder: 'border-amber-600 ring-2 ring-amber-500/40 bg-amber-50/60 shadow-md',
  },
  {
    style: 'abstract',
    label: 'Abstract Prism',
    desc: 'Dynamic multifaceted tech symbol and vibrant refraction',
    badge: 'bg-purple-100 text-purple-950 border-purple-300',
    border: 'border-purple-300/90 hover:border-purple-500',
    activeBorder: 'border-purple-600 ring-2 ring-purple-500/40 bg-purple-50/60 shadow-md',
  },
  {
    style: 'geometric',
    label: 'Geometric Crest',
    desc: 'Golden ratio balanced badge with timeless symmetry',
    badge: 'bg-blue-100 text-blue-950 border-blue-300',
    border: 'border-blue-300/90 hover:border-blue-500',
    activeBorder: 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/60 shadow-md',
  },
  {
    style: 'illustrative',
    label: 'Illustrative Emblem',
    desc: 'Organic sculptural symbol celebrating artisanal warmth',
    badge: 'bg-rose-100 text-rose-950 border-rose-300',
    border: 'border-rose-300/90 hover:border-rose-500',
    activeBorder: 'border-rose-600 ring-2 ring-rose-500/40 bg-rose-50/60 shadow-md',
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

  const handleAutoPick = () => {
    selectLogoStyle('minimal');
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-400/90 p-6 sm:p-7 shadow-lg shadow-brand-500/5 relative overflow-hidden transition-all text-left animate-in fade-in duration-300">
      {/* Top Colorful Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200/90 gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-100 text-brand-900 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>STEP 5: VECTOR LOGO MARKS</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-700 font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight">
            Choose Vector Logo Style for <span className="text-brand-600">{selectedName.name}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Scalable mathematical vector marks calibrated for light and dark backgrounds.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedLogo && (
            <button
              onClick={closeLogoModal}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAutoPick}
            className="px-4 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-300 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>⚡ Complete Kit</span>
          </button>
        </div>
      </div>

      {/* 5 Logo Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {LOGO_OPTIONS.map((opt) => {
          const isSelected = selectedLogoStyle === opt.style;

          return (
            <div
              key={opt.style}
              onClick={() => selectLogoStyle(opt.style)}
              className={`group p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-between gap-3.5 overflow-hidden ${
                isSelected
                  ? opt.activeBorder
                  : `${opt.border} bg-white hover:bg-slate-50/80 shadow-xs hover:shadow-md hover:-translate-y-0.5`
              }`}
            >
              <div className="w-full flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${opt.badge}`}>
                  {opt.style}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              {/* Live Vector Artwork */}
              <div className="w-32 h-32 flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                <LogoArtwork
                  brand={selectedName}
                  style={opt.style}
                  variant="light"
                  size="sm"
                />
              </div>

              <div>
                <h4 className="font-display font-black text-base text-slate-950">
                  {opt.label}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
                  {opt.desc}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectLogoStyle(opt.style);
                }}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-brand-50 text-brand-800 border border-brand-200 group-hover:bg-brand-600 group-hover:text-white'
                }`}
              >
                <span>{isSelected ? 'Selected Mark ✓' : 'Select Logo Style'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
