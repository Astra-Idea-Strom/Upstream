import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getTaglinesForBrand, type BrandTaglineOption } from '../../../mock/mockData';
import { Check, ArrowRight } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Brand Positioning
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Taglines for {brandName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a positioning hook to anchor customer perception.
          </p>
        </div>

        {hasConfirmedTagline && (
          <button
            onClick={closeTaglineModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors self-start sm:self-auto"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {taglines.map((item) => {
          const isSelected = selectedName?.tagline === item.tagline;

          return (
            <div
              key={item.id}
              onClick={() => selectTagline(item.tagline)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-slate-900 bg-slate-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  {item.angle}
                </span>

                <p className="text-base font-bold text-slate-900 font-serif italic">
                  "{item.tagline}"
                </p>

                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {item.tone}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectTagline(item.tagline);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white'
                  }`}
                >
                  <span>{isSelected ? 'Applied' : 'Select'}</span>
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
