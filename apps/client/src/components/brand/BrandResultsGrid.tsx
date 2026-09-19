import React, { useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import type { BrandName } from '@upstream/shared';
import { VisualDirectionPanel } from './VisualDirectionPanel';
import {
  Sparkles,
  Heart,
  Globe,
  Check,
  X,
  ArrowRight,
  Palette,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Share2,
} from 'lucide-react';

export const BrandResultsGrid: React.FC = () => {
  const {
    brandNames,
    selectedName,
    selectName,
    favorites,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    filterTone,
    setFilterTone,
    filterOnlyAvailable,
    setFilterOnlyAvailable,
    regenerateNames,
    isLoadingNames,
    setStep,
    input,
  } = useBrandStore();

  const [inspectingBrand, setInspectingBrand] = useState<BrandName | null>(null);

  // Filter and search logic
  const filteredNames = brandNames.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.meaning.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = filterOnlyAvailable ? brand.domainAvailability.com : true;

    return matchesSearch && matchesDomain;
  });

  const handleSelectAndProceed = (brand: BrandName) => {
    selectName(brand);
    setStep(3); // Go to Logo Studio
  };

  return (
    <div className="px-4 sm:px-8 py-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Step 2 Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>STEP 2 OF 4: AI BRAND NAMES & VISUAL PALETTES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Generated Brand Identities for <span className="text-brand-600">{input.industry}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your favorite brand name below. Each identity includes tailored taglines, domain checks,
              and coordinated color & font guides.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={regenerateNames}
              disabled={isLoadingNames}
              className="px-4 py-2.5 rounded-full bg-white/90 hover:bg-white border border-brand-200/80 text-brand-800 text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNames ? 'animate-spin' : ''}`} />
              <span>Regenerate Names</span>
            </button>

            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Edit Inputs
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel rounded-3xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/90">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter names, meanings, taglines..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* .com Available Only Toggle */}
            <button
              onClick={() => setFilterOnlyAvailable(!filterOnlyAvailable)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                filterOnlyAvailable
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>.com Available Only</span>
              {filterOnlyAvailable && <Check className="w-3 h-3 text-emerald-600" />}
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredNames.length} of {brandNames.length} names
            </span>
          </div>
        </div>

        {/* Brand Names Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNames.map((brand) => {
            const isSelected = selectedName?.id === brand.id;
            const isFav = favorites.includes(brand.id);

            return (
              <div
                key={brand.id}
                className={`group relative rounded-4xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'border-brand-500 ring-4 ring-brand-500/20 shadow-xl bg-white'
                    : 'border-white/80 hover:border-brand-200/90 bg-white/75 hover:bg-white shadow-glass hover:shadow-glass-hover'
                }`}
              >
                {/* Top Row: Brand Name & Favorite Toggle */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 font-semibold block">
                        AI Name Concept
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-none mt-1"
                        style={{ fontFamily: brand.visualDirection.fonts.headline }}
                      >
                        {brand.name}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(brand.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        isFav
                          ? 'text-coral-500 bg-coral-50'
                          : 'text-slate-300 hover:text-coral-500 hover:bg-slate-100'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-coral-500' : ''}`} />
                    </button>
                  </div>

                  {/* Tagline */}
                  <p
                    className="text-xs sm:text-sm font-semibold text-brand-700 mb-2 italic"
                    style={{ fontFamily: brand.visualDirection.fonts.body }}
                  >
                    "{brand.tagline}"
                  </p>

                  {/* Etymology / Meaning */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {brand.meaning}
                  </p>
                </div>

                {/* Middle: Domain Availability & Social Check */}
                <div className="space-y-3 pt-3 border-t border-slate-100/90">
                  {/* Domain Badges */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Domain Availability
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                      {/* .com */}
                      <span
                        className={`px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1 ${
                          brand.domainAvailability.com
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-500 border border-rose-200 line-through'
                        }`}
                      >
                        {brand.domainAvailability.com ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <X className="w-3 h-3 text-rose-400" />
                        )}
                        <span>.com</span>
                      </span>

                      {/* .io */}
                      <span
                        className={`px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1 ${
                          brand.domainAvailability.io
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {brand.domainAvailability.io && <Check className="w-3 h-3 text-emerald-600" />}
                        <span>.io</span>
                      </span>

                      {/* .co */}
                      <span
                        className={`px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1 ${
                          brand.domainAvailability.co
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {brand.domainAvailability.co && <Check className="w-3 h-3 text-emerald-600" />}
                        <span>.co</span>
                      </span>

                      {/* Social handles pill */}
                      <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[10px]">
                        @{brand.name.toLowerCase()} ({brand.domainAvailability.handle.twitter ? 'X ✓' : 'X ✗'}, {brand.domainAvailability.handle.instagram ? 'IG ✓' : 'IG ✗'})
                      </span>
                    </div>
                  </div>

                  {/* 5-Color Palette Strip */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Color Palette & Vibe
                      </span>
                      <button
                        onClick={() => setInspectingBrand(brand)}
                        className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
                      >
                        <Palette className="w-3 h-3" />
                        <span>Inspect Guide</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 h-6 w-full rounded-xl overflow-hidden p-0.5 bg-slate-100">
                      {brand.visualDirection.palette.map((swatch, i) => (
                        <div
                          key={i}
                          className="flex-1 h-full rounded-lg transition-transform hover:scale-110"
                          style={{ backgroundColor: swatch.hex }}
                          title={`${swatch.name}: ${swatch.hex} (${swatch.role})`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Proceed to Logo Studio */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Font: <strong className="text-slate-800">{brand.visualDirection.fonts.headline}</strong>
                  </span>

                  <button
                    onClick={() => handleSelectAndProceed(brand)}
                    className="px-4 py-2 rounded-full bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm group-hover:bg-brand-600"
                  >
                    <span>Build Logos</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspect Visual Direction Modal */}
        {inspectingBrand && (
          <VisualDirectionPanel
            brand={inspectingBrand}
            onClose={() => setInspectingBrand(null)}
            onProceedToLogos={() => {
              selectName(inspectingBrand);
              setStep(3);
            }}
          />
        )}
      </div>
    </div>
  );
};
