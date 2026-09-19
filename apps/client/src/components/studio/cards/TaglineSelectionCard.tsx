import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getTaglinesForBrand, type BrandTaglineOption } from '../../../mock/mockData';
import { Sparkles, Check, Quote, ArrowRight, Zap } from 'lucide-react';

export const TaglineSelectionCard: React.FC = () => {
  const {
    selectedName,
    input,
    selectTagline,
    closeTaglineModal,
    hasConfirmedTagline,
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
    <div className="bg-white rounded-3xl border-2 border-brand-300/90 p-6 sm:p-7 shadow-md relative overflow-hidden transition-all animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>STEP 3: STRATEGIC TAGLINES</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
            Choose Strategic Tagline for <span className="text-brand-600">{brandName}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated positioning hooks and brand statements. Click one to lock it in.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedTagline && (
            <button
              onClick={closeTaglineModal}
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
            <span>Auto-Pick</span>
          </button>
        </div>
      </div>

      {/* Tagline Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {taglines.map((item) => {
          const isSelected = selectedName?.tagline === item.tagline;

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.tagline)}
              className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                  : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                  {item.angle}
                </span>

                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <p className="text-base font-bold text-slate-900 font-serif italic">
                    "{item.tagline}"
                  </p>
                </div>

                <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                  {item.tone}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item.tagline);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
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
    </div>
  );
};
