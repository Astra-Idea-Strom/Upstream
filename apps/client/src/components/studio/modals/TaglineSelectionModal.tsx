import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getTaglinesForBrand, type BrandTaglineOption } from '../../../mock/mockData';
import { Sparkles, X, Check, Quote, ArrowRight, Zap } from 'lucide-react';

export const TaglineSelectionModal: React.FC = () => {
  const {
    selectedName,
    input,
    selectTagline,
    closeTaglineModal,
    runFullAutonomousPipeline,
  } = useBrandStore();

  const brandName = selectedName?.name || 'Your Brand';
  const taglines: BrandTaglineOption[] = getTaglinesForBrand(brandName, input.industry);

  const handleSelect = (tagline: string) => {
    selectTagline(tagline);
  };

  const handleAutoPick = () => {
    if (taglines.length > 0) {
      selectTagline(taglines[0].tagline);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 rounded-3xl border border-white/80 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>STEP 2: TAGLINE SYNTHESIS</span>
            </div>
            <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
              Select Tagline for <span className="text-brand-600">{brandName}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the brand positioning statement or slogan. It will immediately update your brand card.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoPick}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors shadow-2xs"
            >
              <Zap className="w-3 h-3 text-brand-600" />
              <span>Auto-Pick</span>
            </button>
            <button
              onClick={closeTaglineModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tagline Cards */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {taglines.map((item) => {
            const isSelected = selectedName?.tagline === item.tagline;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.tagline)}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {item.angle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <Quote className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    <p className="text-base sm:text-lg font-bold text-slate-900 font-serif italic">
                      "{item.tagline}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 pl-6">
                    {item.tone}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center justify-end sm:justify-center">
                  <button
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-brand-600 group-hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Active' : 'Select'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous agent ready to calibrate visual color harmonies next.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runFullAutonomousPipeline}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-coral-500 text-white text-xs font-bold shadow-2xs hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Auto-Pilot (All Steps)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
