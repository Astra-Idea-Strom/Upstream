import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import type { BrandName } from '@upstream/shared';
import { Sparkles, Check, RefreshCw, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

// 5 Curated Color Themes for candidate cards on the workspace: vibrant, distinguishable, highly readable
const CANDIDATE_CARD_THEMES = [
  {
    gradient: 'from-amber-500/15 via-amber-50/40 to-white',
    cardBorder: 'border-amber-300/90 hover:border-amber-500',
    selectedBorder: 'border-amber-600 ring-2 ring-amber-500/40 bg-amber-50/80 shadow-md',
    accentBar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
    btnColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    tag: 'Artisanal & Tactile',
    numBadge: 'bg-amber-500 text-white',
  },
  {
    gradient: 'from-purple-500/15 via-purple-50/40 to-white',
    cardBorder: 'border-purple-300/90 hover:border-purple-500',
    selectedBorder: 'border-purple-600 ring-2 ring-purple-500/40 bg-purple-50/80 shadow-md',
    accentBar: 'bg-purple-600',
    badge: 'bg-purple-100 text-purple-950 border-purple-300 font-bold',
    btnColor: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
    tag: 'Dynamic & Bold',
    numBadge: 'bg-purple-600 text-white',
  },
  {
    gradient: 'from-emerald-500/15 via-emerald-50/40 to-white',
    cardBorder: 'border-emerald-300/90 hover:border-emerald-500',
    selectedBorder: 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/80 shadow-md',
    accentBar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    tag: 'Terroir & Organic',
    numBadge: 'bg-emerald-600 text-white',
  },
  {
    gradient: 'from-blue-500/15 via-sky-50/40 to-white',
    cardBorder: 'border-blue-300/90 hover:border-blue-500',
    selectedBorder: 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/80 shadow-md',
    accentBar: 'bg-blue-600',
    badge: 'bg-blue-100 text-blue-950 border-blue-300 font-bold',
    btnColor: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    tag: 'Modernist Tech',
    numBadge: 'bg-blue-600 text-white',
  },
  {
    gradient: 'from-rose-500/15 via-rose-50/40 to-white',
    cardBorder: 'border-rose-300/90 hover:border-rose-500',
    selectedBorder: 'border-rose-600 ring-2 ring-rose-500/40 bg-rose-50/80 shadow-md',
    accentBar: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-950 border-rose-300 font-bold',
    btnColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    tag: 'Quiet Luxury',
    numBadge: 'bg-rose-600 text-white',
  },
];

export const NameSelectionCard: React.FC = () => {
  const {
    brandNames,
    selectedName,
    selectName,
    closeNameModal,
    hasConfirmedName,
    regenerateNames,
    isLoadingNames,
    input,
  } = useBrandStore();

  const displayedNames = brandNames.slice(0, 5);

  const handleSelect = (brand: BrandName) => {
    selectName(brand);
  };

  const handleAutoPick = () => {
    if (displayedNames.length > 0) {
      selectName(displayedNames[0]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-400/90 p-6 sm:p-7 shadow-lg shadow-brand-500/5 relative overflow-hidden transition-all animate-in fade-in duration-300 text-left">
      {/* Top Colorful Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-purple-500 to-brand-600" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200/90 gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-100 text-brand-900 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>STEP 2: 5 AI CANDIDATE NAMES</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-700 font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight">
            Choose Your Brand Name for <span className="text-brand-600">{input.industry}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Select one of the 5 AI-synthesized brand candidates below. Each features custom font pairings, color palettes, and verified domain hooks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedName && (
            <button
              onClick={closeNameModal}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={regenerateNames}
            disabled={isLoadingNames}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNames ? 'animate-spin text-brand-600' : 'text-slate-600'}`} />
            <span>Regenerate</span>
          </button>
          <button
            onClick={handleAutoPick}
            className="px-4 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-300 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>Auto-Pick Top</span>
          </button>
        </div>
      </div>

      {/* 5 Distinct Colorful Candidate Name Cards */}
      <div className="space-y-4">
        {displayedNames.map((brand, index) => {
          const isSelected = selectedName?.id === brand.id;
          const theme = CANDIDATE_CARD_THEMES[index % CANDIDATE_CARD_THEMES.length];
          const headlineFont = brand.visualDirection?.fonts?.headline || 'Outfit';
          const palette = brand.visualDirection?.palette || [];

          return (
            <div
              key={brand.id}
              onClick={() => handleSelect(brand)}
              className={`group relative rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer select-none overflow-hidden bg-gradient-to-br ${
                theme.gradient
              } ${
                isSelected
                  ? theme.selectedBorder
                  : `${theme.cardBorder} hover:shadow-md hover:-translate-y-0.5 shadow-xs`
              }`}
            >
              {/* Left Vertical Color Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${theme.accentBar}`} />

              <div className="pl-3 sm:pl-4 space-y-3">
                {/* Header Row: Number + Vibe Tag + Typography Font + Domains */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${theme.numBadge}`}>
                      {index + 1}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-mono border ${theme.badge}`}>
                      {theme.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 bg-white/90 border border-slate-200/90 px-2 py-0.5 rounded-md font-semibold">
                      Aa {headlineFont}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border ${
                        brand.domainAvailability.com
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {brand.domainAvailability.com ? '✓ .com' : '✗ .com'}
                    </span>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border ${
                        brand.domainAvailability.io
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {brand.domainAvailability.io ? '✓ .io' : '✗ .io'}
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono hidden sm:flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      TM Clear
                    </span>
                  </div>
                </div>

                {/* Brand Name in Paired Font + Tagline */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                  <h4
                    style={{ fontFamily: headlineFont }}
                    className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none"
                  >
                    {brand.name}
                  </h4>
                  <span className="text-xs sm:text-sm font-semibold text-brand-700 italic font-serif">
                    "{brand.tagline}"
                  </span>
                </div>

                {/* Brand Meaning & Rationale */}
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                  {brand.meaning}
                </p>

                {/* Bottom Row: Palette Swatches + Select Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-200/80">
                  {/* Chromatic Palette Swatches */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase font-mono text-slate-500">
                      Color Harmony:
                    </span>
                    <div className="flex items-center -space-x-1">
                      {palette.map((swatch, sIdx) => (
                        <div
                          key={sIdx}
                          className="w-5 h-5 rounded-full border-2 border-white shadow-2xs transition-transform hover:scale-125 hover:z-10"
                          style={{ backgroundColor: swatch.hex }}
                          title={`${swatch.name} (${swatch.hex})`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Select CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(brand);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isSelected
                        ? 'bg-slate-950 text-white ring-2 ring-slate-900'
                        : `${theme.btnColor} group-hover:scale-[1.02]`
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Active Selected Brand</span>
                      </>
                    ) : (
                      <>
                        <span>Select Brand</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
