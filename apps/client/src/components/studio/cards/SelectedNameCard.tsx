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
  Layers,
} from 'lucide-react';

export const SelectedNameCard: React.FC = () => {
  const { selectedName, openNameModal, openTaglineModal, openPaletteModal } = useBrandStore();

  if (!selectedName) return null;

  const headlineFont = selectedName.visualDirection?.fonts?.headline || 'Outfit';
  const palette = selectedName.visualDirection?.palette || [];

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-400/90 p-6 sm:p-7 shadow-md shadow-brand-500/5 relative overflow-hidden transition-all text-left animate-in fade-in duration-300">
      {/* Top Colorful Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-coral-500 to-amber-500" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200/90 gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-100 text-brand-900 text-[10px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-coral-500" />
            <span>CARD 2: LOCKED BRAND IDENTITY</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={openNameModal}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-slate-600" />
            <span>Switch Name</span>
          </button>
          <button
            onClick={openPaletteModal}
            className="px-4 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-300 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Palette className="w-3.5 h-3.5 text-brand-600" />
            <span>Edit Palette</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2
              style={{ fontFamily: headlineFont }}
              className="text-3xl sm:text-4xl font-display font-black text-slate-950 tracking-tight leading-none"
            >
              {selectedName.name}
            </h2>
            <span className="text-[11px] font-mono font-bold text-brand-800 px-2.5 py-0.5 rounded-md bg-brand-50 border border-brand-200">
              Aa {headlineFont}
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-800 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
              ✓ Verified
            </span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <p className="text-sm sm:text-base font-semibold text-brand-700 italic font-serif">
              "{selectedName.tagline}"
            </p>
            <button
              onClick={openTaglineModal}
              className="px-3 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold border border-brand-200 transition-colors shadow-2xs"
            >
              Edit Tagline
            </button>
          </div>
        </div>

        {/* Meaning Box */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/90 font-normal">
          <strong className="font-bold text-slate-950">Brand Concept: </strong>
          {selectedName.meaning}
        </p>

        {/* Chromatic Palette Swatches Preview */}
        {palette.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-brand-50/20 to-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-slate-900">Assigned Chromatic Palette:</span>
            </div>
            <div className="flex items-center gap-2">
              {palette.map((swatch, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200/90 px-2 py-1 rounded-xl shadow-2xs">
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-700">{swatch.hex}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domain & Handles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Domain Checks</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">WHOIS verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.com
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {selectedName.domainAvailability.com ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                .com
              </span>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.io
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {selectedName.domainAvailability.io ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                .io
              </span>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.co
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {selectedName.domainAvailability.co ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                .co
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Social Handles</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">@{selectedName.name.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.handle.twitter
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {selectedName.domainAvailability.handle.twitter ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                Twitter
              </span>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                  selectedName.domainAvailability.handle.instagram
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {selectedName.domainAvailability.handle.instagram ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                Instagram
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
