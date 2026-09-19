import React from 'react';
import { useBrandStore } from '../../store/brandStore';
import type { BrandName } from '@upstream/shared';
import {
  Sparkles,
  Heart,
  Globe,
  Check,
  X,
  ArrowRight,
  Palette,
  RefreshCw,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';

export const BrandResultsGrid: React.FC = () => {
  const {
    brandNames,
    selectedName,
    selectName,
    favorites,
    toggleFavorite,
    regenerateNames,
    isLoadingNames,
    setStep,
    input,
  } = useBrandStore();

  // Show top 5 curated names
  const displayedNames = brandNames.slice(0, 5);

  const handleSelectAndProceed = (brand: BrandName) => {
    selectName(brand);
    setStep(3); // Proceed to Color Palette & Visual Flow Guide
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>STEP 2 OF 5: 5 CURATED BRAND NAMES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Select Your Brand Name for <span className="text-brand-600">{input.industry}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the brand name card that best captures your venture. Click any card to select.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={regenerateNames}
            disabled={isLoadingNames}
            className="px-3 py-1.5 rounded-full bg-white border border-brand-200 text-brand-800 text-xs font-semibold hover:bg-brand-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingNames ? 'animate-spin' : ''}`} />
            <span>Regenerate 5 Names</span>
          </button>

          <button
            onClick={() => setStep(1)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Edit Idea</span>
          </button>
        </div>
      </div>

      {/* 5 Brand Names List / Cards */}
      <div className="space-y-4">
        {displayedNames.map((brand, idx) => {
          const isSelected = selectedName?.id === brand.id;
          const isFav = favorites.includes(brand.id);

          return (
            <div
              key={brand.id}
              onClick={() => selectName(brand)}
              className={`group relative rounded-3xl p-5 cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'border-brand-600 bg-white ring-2 ring-brand-500/20 shadow-md'
                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-brand-200 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left: Name & Etymology */}
                <div className="flex items-start gap-3.5">
                  {/* Selection Radio Circle */}
                  <div className="mt-1">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white shadow-xs'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">#0{idx + 1}</span>
                      <h3
                        className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none"
                        style={{ fontFamily: brand.visualDirection.fonts.headline }}
                      >
                        {brand.name}
                      </h3>
                      <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200/60 px-2 py-0.5 rounded-full font-semibold">
                        {brand.visualDirection.fonts.headline}
                      </span>
                    </div>

                    {/* Tagline */}
                    <p
                      className="text-xs font-semibold text-brand-700 mt-1 italic"
                      style={{ fontFamily: brand.visualDirection.fonts.body }}
                    >
                      "{brand.tagline}"
                    </p>

                    {/* Etymology */}
                    <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-xl">
                      {brand.meaning}
                    </p>
                  </div>
                </div>

                {/* Right: Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(brand.id);
                  }}
                  className={`p-2 rounded-full transition-colors self-start ${
                    isFav
                      ? 'text-coral-500 bg-coral-50'
                      : 'text-slate-300 hover:text-coral-500 hover:bg-slate-100'
                  }`}
                  title={isFav ? 'Favorited' : 'Favorite'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-coral-500' : ''}`} />
                </button>
              </div>

              {/* Bottom Details Row: Domain Availability & Palette */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Domain Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Domains:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                      brand.domainAvailability.com
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-400 border border-rose-200 line-through'
                    }`}
                  >
                    {brand.domainAvailability.com ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    <span>.com</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                      brand.domainAvailability.io
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {brand.domainAvailability.io && <Check className="w-2.5 h-2.5" />}
                    <span>.io</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                      brand.domainAvailability.co
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {brand.domainAvailability.co && <Check className="w-2.5 h-2.5" />}
                    <span>.co</span>
                  </span>

                  <span className="text-[10px] text-slate-400 ml-1">
                    @{brand.name.toLowerCase()} ({brand.domainAvailability.handle.twitter ? 'X✓' : 'X✗'}, {brand.domainAvailability.handle.instagram ? 'IG✓' : 'IG✗'})
                  </span>
                </div>

                {/* Color Palette Preview */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Colors:</span>
                  <div className="flex items-center gap-1 h-5 w-24 rounded-lg overflow-hidden p-0.5 bg-slate-100">
                    {brand.visualDirection.palette.map((swatch, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full rounded-sm"
                        style={{ backgroundColor: swatch.hex }}
                        title={`${swatch.name}: ${swatch.hex}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-brand-100 shadow-sm">
        <div>
          <span className="text-xs text-slate-500">Selected Name:</span>
          <h4 className="text-sm font-bold text-slate-900">{selectedName.name} — "{selectedName.tagline}"</h4>
        </div>

        <button
          onClick={() => setStep(3)}
          className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Pick Color Palette & Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
