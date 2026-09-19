import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import type { BrandName, LogoStyle } from '@upstream/shared';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { Check, ArrowRight, RefreshCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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

  const displayedNames = brandNames.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">
            Curated Brand Names
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a candidate, or click <span className="font-semibold text-slate-700">Alternatives</span> on any card to explore specific taglines and marks.
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

      {/* Candidates List */}
      <div className="space-y-3.5">
        {displayedNames.map((brand, index) => {
          const isSelected = selectedName?.id === brand.id;
          const headlineFont = brand.visualDirection?.fonts?.headline || 'Outfit';
          const palette = brand.visualDirection?.palette || [];
          const alternatives = nameAlternativesMap[brand.id];
          const isExpanded = expandedAltId === brand.id;

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4
                        style={{ fontFamily: headlineFont }}
                        className="text-2xl font-bold text-slate-950 tracking-tight leading-none"
                      >
                        {brand.name}
                      </h4>
                      <span className="text-xs text-slate-500 italic font-serif">
                        "{brand.tagline}"
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {brand.meaning}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Aa {headlineFont}
                      </span>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                          brand.domainAvailability.com
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {brand.domainAvailability.com ? '✓ .com' : '✗ .com'}
                      </span>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                          brand.domainAvailability.io
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {brand.domainAvailability.io ? '✓ .io' : '✗ .io'}
                      </span>

                      {/* Mini Palette dots */}
                      <div className="flex items-center -space-x-1 ml-2">
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
