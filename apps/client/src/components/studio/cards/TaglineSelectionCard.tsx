import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getTaglinesForBrand, type BrandTaglineOption } from '../../../mock/mockData';
import { Sparkles, Check, Quote, ArrowRight, Zap } from 'lucide-react';

const TAGLINE_THEMES = [
  {
    border: 'border-amber-300/90 hover:border-amber-500',
    selected: 'border-amber-600 ring-2 ring-amber-500/40 bg-amber-50/80 shadow-md',
    badge: 'bg-amber-100 text-amber-950 border-amber-300',
    accentBar: 'bg-amber-500',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  {
    border: 'border-purple-300/90 hover:border-purple-500',
    selected: 'border-purple-600 ring-2 ring-purple-500/40 bg-purple-50/80 shadow-md',
    badge: 'bg-purple-100 text-purple-950 border-purple-300',
    accentBar: 'bg-purple-600',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  {
    border: 'border-emerald-300/90 hover:border-emerald-500',
    selected: 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/80 shadow-md',
    badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    accentBar: 'bg-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  {
    border: 'border-blue-300/90 hover:border-blue-500',
    selected: 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/80 shadow-md',
    badge: 'bg-blue-100 text-blue-950 border-blue-300',
    accentBar: 'bg-blue-600',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
];

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
    <div className="bg-white rounded-3xl border-2 border-amber-400/90 p-6 sm:p-7 shadow-lg shadow-amber-500/5 relative overflow-hidden transition-all text-left animate-in fade-in duration-300">
      {/* Top Colorful Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200/90 gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>STEP 3: STRATEGIC TAGLINES</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-700 font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight">
            Choose Strategic Tagline for <span className="text-brand-600">{brandName}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Calibrated positioning hooks and brand statements. Click any to lock it in.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedTagline && (
            <button
              onClick={closeTaglineModal}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAutoPick}
            className="px-4 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Auto-Pick</span>
          </button>
        </div>
      </div>

      {/* Tagline Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {taglines.map((item, idx) => {
          const isSelected = selectedName?.tagline === item.tagline;
          const theme = TAGLINE_THEMES[idx % TAGLINE_THEMES.length];

          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.tagline)}
              className={`group relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 overflow-hidden ${
                isSelected
                  ? theme.selected
                  : `${theme.border} bg-white hover:bg-slate-50/80 shadow-xs hover:shadow-md hover:-translate-y-0.5`
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${theme.accentBar}`} />

              <div className="pl-3 sm:pl-4 space-y-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border font-mono inline-block ${theme.badge}`}>
                  {item.angle}
                </span>

                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                  <p className="text-base sm:text-lg font-bold text-slate-950 font-serif italic leading-snug">
                    "{item.tagline}"
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {item.tone}
                </p>
              </div>

              <div className="pt-2 pl-3 sm:pl-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item.tagline);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
                    isSelected
                      ? 'bg-slate-950 text-white shadow-sm'
                      : `${theme.btn}`
                  }`}
                >
                  <span>{isSelected ? 'Selected ✓' : 'Select Tagline'}</span>
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
