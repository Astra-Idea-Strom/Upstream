import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import type { LogoStyle } from '@upstream/shared';
import { Sparkles, X, Check, ArrowRight, Zap } from 'lucide-react';

const LOGO_OPTIONS: { style: LogoStyle; label: string; desc: string }[] = [
  { style: 'minimal', label: 'Minimalist Glyph', desc: 'Continuous-line geometric monogram' },
  { style: 'wordmark', label: 'Modern Wordmark', desc: 'Architectural custom typography' },
  { style: 'abstract', label: 'Abstract Prism', desc: 'Dynamic multifaceted tech symbol' },
  { style: 'geometric', label: 'Geometric Crest', desc: 'Golden ratio balanced badge' },
  { style: 'illustrative', label: 'Illustrative Emblem', desc: 'Organic sculptural symbol' },
];

export const LogoSelectionModal: React.FC = () => {
  const { selectedName, selectedLogoStyle, selectLogoStyle, closeLogoModal, logoImageByStyle } =
    useBrandStore();

  const handleAutoPick = () => {
    selectLogoStyle('minimal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 rounded-3xl border border-white/80 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-coral-500" />
              <span>VECTOR LOGO MARKS</span>
            </div>
            <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
              Select Vector Logo Style for <span className="text-brand-600">{selectedName.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pick the vector concept that best anchors your visual identity.
            </p>
          </div>

          <button
            onClick={closeLogoModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {LOGO_OPTIONS.map((opt) => {
            const isSelected = selectedLogoStyle === opt.style;

            return (
              <div
                key={opt.style}
                onClick={() => selectLogoStyle(opt.style)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                <div>
                  <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                    <LogoArtwork brand={selectedName} style={opt.style} size="sm" imageUrl={logoImageByStyle[opt.style]} />
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-slate-900">{opt.label}</h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mb-3">{opt.desc}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectLogoStyle(opt.style);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isSelected ? 'bg-brand-600 text-white shadow-xs' : 'bg-slate-950 text-white hover:bg-brand-600'
                  }`}
                >
                  <span>{isSelected ? 'Active Mark' : 'Select Style'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Selecting a mark finalizes your full Investor-Ready Brand Specification Kit.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoPick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-coral-500 text-white text-xs font-bold shadow-2xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Complete Brand Kit</span>
            </button>

            <button
              onClick={closeLogoModal}
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
