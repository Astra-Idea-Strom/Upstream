import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import {
  Sparkles,
  Globe,
  Check,
  X,
  RotateCcw,
  Palette,
  ShieldCheck,
} from 'lucide-react';

export const SelectedNameCard: React.FC = () => {
  const { selectedName, openNameModal, openTaglineModal, openPaletteModal } = useBrandStore();

  if (!selectedName) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs relative overflow-hidden transition-all hover:border-brand-300 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/70 text-[10px] font-bold text-brand-800">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>CARD 2: CURATED BRAND NAME</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SELECTED
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openNameModal}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Change Name</span>
          </button>
          <button
            onClick={openPaletteModal}
            className="px-3 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
          >
            <Palette className="w-3 h-3 text-brand-600" />
            <span>View Palette</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-display font-black text-slate-950 tracking-tight">
              {selectedName.name}
            </h2>
            <span className="text-xs font-mono font-bold text-brand-600 px-2 py-0.5 rounded-md bg-brand-50 border border-brand-100">
              verified
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-semibold text-brand-700 italic font-serif">
              "{selectedName.tagline}"
            </p>
            <button
              onClick={openTaglineModal}
              className="px-2.5 py-0.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 text-[11px] font-bold border border-brand-200 transition-colors"
            >
              Change Tagline
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
          <span className="font-semibold text-slate-800">Concept & Meaning: </span>
          {selectedName.meaning}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-brand-600" />
                <span>Domain Checks</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">WHOIS live</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.com
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                {selectedName.domainAvailability.com ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                .com
              </span>

              <span
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.io
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                {selectedName.domainAvailability.io ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                .io
              </span>

              <span
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.co
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                {selectedName.domainAvailability.co ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                .co
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-600" />
                <span>Social Handles</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">@{selectedName.name.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.handle.twitter
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                {selectedName.domainAvailability.handle.twitter ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                Twitter
              </span>

              <span
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.handle.instagram
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                {selectedName.domainAvailability.handle.instagram ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                Instagram
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
