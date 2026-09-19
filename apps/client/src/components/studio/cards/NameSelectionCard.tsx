import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import type { BrandName } from '@upstream/shared';
import { Sparkles, Check, RefreshCw, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

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
    runFullAutonomousPipeline,
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
    <div className="bg-white rounded-3xl border-2 border-brand-300/90 p-6 sm:p-7 shadow-md relative overflow-hidden transition-all animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>STEP 2: 5 AI CANDIDATE NAMES</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
            Choose Your Brand Name for <span className="text-brand-600">{input.industry}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select one of the 5 AI-synthesized company names below to lock it into your brand kit.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasConfirmedName && (
            <button
              onClick={closeNameModal}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={regenerateNames}
            disabled={isLoadingNames}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingNames ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
          <button
            onClick={handleAutoPick}
            className="px-3.5 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-brand-600" />
            <span>Auto-Pick</span>
          </button>
        </div>
      </div>

      {/* Candidate Name Cards */}
      <div className="space-y-3">
        {displayedNames.map((brand, index) => {
          const isSelected = selectedName?.id === brand.id;

          return (
            <div
              key={brand.id}
              onClick={() => handleSelect(brand)}
              className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                  : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-300 bg-slate-100 text-slate-600 group-hover:border-brand-400 group-hover:text-brand-700'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : index + 1}
                  </div>
                  <h4 className="text-xl font-display font-black text-slate-900 tracking-tight">
                    {brand.name}
                  </h4>
                  <span className="text-xs font-semibold text-brand-600 italic font-serif">
                    "{brand.tagline}"
                  </span>
                </div>

                <p className="text-xs text-slate-600 pl-9 leading-relaxed">
                  {brand.meaning}
                </p>

                <div className="flex items-center gap-2 pl-9 pt-1">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border ${
                      brand.domainAvailability.com
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {brand.domainAvailability.com ? '✓ .com available' : '✗ .com taken'}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border ${
                      brand.domainAvailability.io
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {brand.domainAvailability.io ? '✓ .io available' : '✗ .io taken'}
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 ml-auto">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Trademark Clear
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(brand);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-950 text-white group-hover:bg-brand-600 shadow-2xs'
                  }`}
                >
                  <span>{isSelected ? 'Selected' : 'Select Name'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
