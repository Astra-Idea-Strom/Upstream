import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import type { BrandName } from '@upstream/shared';
import {
  Sparkles,
  X,
  Check,
  Globe,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const NameSelectionModal: React.FC = () => {
  const {
    brandNames,
    selectedName,
    selectName,
    closeNameModal,
    regenerateNames,
    runFullAutonomousPipeline,
    isLoadingNames,
    input,
  } = useBrandStore();

  const displayedNames = brandNames.slice(0, 5);

  const handleSelect = (brand: BrandName) => {
    selectName(brand);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 rounded-3xl border border-white/80 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>AI SYNTHESIS COMPLETE</span>
            </div>
            <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
              Select Your Brand Name for <span className="text-brand-600">{input.industry}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any company name below to select it. It will instantly materialize on your right workspace.
            </p>
          </div>

          <button
            onClick={closeNameModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {displayedNames.map((brand) => {
            const isSelected = selectedName?.id === brand.id;

            return (
              <div
                key={brand.id}
                onClick={() => handleSelect(brand)}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <h4 className="text-xl font-display font-black text-slate-900 tracking-tight">
                      {brand.name}
                    </h4>
                    <span className="text-xs font-semibold text-brand-600 italic">
                      "{brand.tagline}"
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                    {brand.meaning}
                  </p>

                  <div className="flex items-center gap-2 pl-8 pt-1">
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
                        : 'bg-slate-950 text-white hover:bg-brand-600'
                    }`}
                  >
                    <span>{isSelected ? 'Selected' : 'Select Name'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={regenerateNames}
              disabled={isLoadingNames}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNames ? 'animate-spin' : ''}`} />
              <span>Synthesize 5 New Names</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runFullAutonomousPipeline}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-coral-500 text-white text-xs font-bold shadow-2xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Auto-Pilot (All Steps)</span>
            </button>

            <button
              onClick={closeNameModal}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
