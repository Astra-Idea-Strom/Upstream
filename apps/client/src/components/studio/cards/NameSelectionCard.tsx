import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import type { LogoStyle } from '@upstream/shared';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { Check, ArrowRight, RefreshCw, Sparkles, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { TwitterIcon, InstagramIcon } from '../../brand/SocialIcons';

type FilterTab = 'all' | 'com-available' | 'invented' | 'descriptive' | 'evocative' | 'compound' | 'playful';

export const NameSelectionCard: React.FC = () => {
  const {
    brandNames,
    selectedName,
    selectName,
    hasConfirmedName,
    closeNameModal,
    regenerateNames,
    isLoadingNames,
    nameAlternativesMap,
    generateNameAlternatives,
    applyAlternativeTagline,
    applyAlternativeLogo,
  } = useBrandStore();

  const [expandedAltId, setExpandedAltId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const handleToggleAlternatives = (brandId: string) => {
    if (expandedAltId === brandId) {
      setExpandedAltId(null);
    } else {
      setExpandedAltId(brandId);
      if (!nameAlternativesMap[brandId]) {
        generateNameAlternatives(brandId);
      }
    }
  };

  const comAvailableCount = brandNames.filter((b) => b.domainAvailability.com).length;

  const filteredNames = brandNames.filter((b) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'com-available') return b.domainAvailability.com;
    return (b as any).category === activeFilter;
  });

  const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: 'all', label: `All (${brandNames.length})` },
    { id: 'com-available', label: `✓ .com (${comAvailableCount})` },
    { id: 'invented', label: 'Invented' },
    { id: 'descriptive', label: 'Descriptive' },
    { id: 'evocative', label: 'Evocative' },
    { id: 'compound', label: 'Compound' },
    { id: 'playful', label: 'Playful' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">
            {brandNames.length} Curated Brand Names
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a candidate · click <span className="font-semibold text-slate-700">Alternatives</span> to refine taglines & logo marks
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedName && (
            <button
              onClick={closeNameModal}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={regenerateNames}
            disabled={isLoadingNames}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNames ? 'animate-spin' : ''}`} />
            <span>Regenerate All</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-4 border-b border-slate-100">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-slate-950 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Candidates List */}
      <div className="space-y-3.5">
        {filteredNames.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-8">
            No names match this filter. Try another category.
          </p>
        )}
        {filteredNames.map((brand, index) => {
          const isSelected = selectedName?.id === brand.id;
          const headlineFont = brand.visualDirection?.fonts?.headline || 'Outfit';
          const palette = brand.visualDirection?.palette || [];
          const alternatives = nameAlternativesMap[brand.id];
          const isExpanded = expandedAltId === brand.id;
          const da = brand.domainAvailability;
          const category = (brand as any).category as string | undefined;

          return (
            <div
              key={brand.id}
              className={`rounded-xl border transition-all ${
                isSelected
                  ? 'border-slate-900 bg-slate-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
              }`}
            >
              {/* Main Card Row */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Name + Category Badge */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4
                        style={{ fontFamily: headlineFont }}
                        className="text-2xl font-bold text-slate-950 tracking-tight leading-none"
                      >
                        {brand.name}
                      </h4>
                      {category && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          {category}
                        </span>
                      )}
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-slate-500 italic leading-snug">
                      &ldquo;{brand.tagline}&rdquo;
                    </p>

                    {/* Meaning */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {brand.meaning}
                    </p>

                    {/* Domain + Social Availability Row */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {[
                        { label: '.com', avail: da.com },
                        { label: '.io', avail: da.io },
                        { label: '.co', avail: da.co },
                      ].map(({ label, avail }) => (
                        <span
                          key={label}
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border flex items-center gap-0.5 ${
                            avail
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                          }`}
                        >
                          <Globe className="w-2.5 h-2.5" />
                          {avail ? '✓' : '✗'} {label}
                        </span>
                      ))}
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${
                          da.handle.twitter
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <TwitterIcon className="w-2.5 h-2.5" />
                        {da.handle.twitter ? '✓' : '✗'} @twitter
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${
                          da.handle.instagram
                            ? 'bg-pink-50 text-pink-700 border-pink-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <InstagramIcon className="w-2.5 h-2.5" />
                        {da.handle.instagram ? '✓' : '✗'} @instagram
                      </span>

                      {/* Mini Palette dots */}
                      <div className="flex items-center -space-x-1 ml-1">
                        {palette.map((swatch, sIdx) => (
                          <div
                            key={sIdx}
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: swatch.hex }}
                            title={`${swatch.name} (${swatch.hex})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <button
                      onClick={() => selectName(brand)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Select</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleAlternatives(brand.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors px-1 py-0.5"
                    >
                      <Sparkles className="w-3 h-3 text-brand-500" />
                      <span>{isExpanded ? 'Hide Alternatives' : 'Alternatives'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Alternatives Refinement Drawer */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 rounded-b-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Refinement: Specific Alternatives for {brand.name}
                    </span>
                    <button
                      onClick={() => generateNameAlternatives(brand.id)}
                      className="text-[10px] text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Refresh Options</span>
                    </button>
                  </div>

                  {/* Alternative Taglines */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Alternative Taglines (Click to Apply)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(alternatives?.taglines || [
                        `Pure Expression of ${brand.name}`,
                        `Architected for Modern Distinction`,
                        `Where Craft Meets Form`,
                      ]).map((altTag, tIdx) => {
                        const isCurrentTagline = brand.tagline === altTag;
                        return (
                          <button
                            key={tIdx}
                            onClick={() => applyAlternativeTagline(brand.id, altTag)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                              isCurrentTagline
                                ? 'border-slate-900 bg-white font-semibold text-slate-950 shadow-2xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="text-slate-400 block text-[9px] font-mono mb-0.5">
                              Angle {tIdx + 1}
                            </span>
                            <span className="italic font-serif block truncate">
                              "{altTag}"
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Alternative Vector Logo Concept Marks */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Alternative Vector Logo Styles (Click to Set Style)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['minimal', 'wordmark', 'abstract'] as LogoStyle[]).map((styleOpt) => (
                        <button
                          key={styleOpt}
                          onClick={() => applyAlternativeLogo(brand.id, styleOpt)}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 text-center transition-all flex flex-col items-center gap-1.5"
                        >
                          <div className="w-12 h-12 flex items-center justify-center">
                            <LogoArtwork
                              brand={brand}
                              style={styleOpt}
                              variant="light"
                              size="sm"
                            />
                          </div>
                          <span className="text-[10px] font-mono font-medium text-slate-700 capitalize">
                            {styleOpt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
