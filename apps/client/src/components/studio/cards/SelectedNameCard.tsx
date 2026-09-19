import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import {
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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Active Brand Identity
          </span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            Locked
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={openNameModal}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            Change Name
          </button>
          <button
            onClick={openPaletteModal}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            Edit Palette
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2
              style={{ fontFamily: headlineFont }}
              className="text-3xl sm:text-4xl font-display font-bold text-slate-950 tracking-tight leading-none"
            >
              {selectedName.name}
            </h2>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Aa {headlineFont}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-600 italic font-serif">
              "{selectedName.tagline}"
            </p>
            <button
              onClick={openTaglineModal}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Change Tagline
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          {selectedName.meaning}
        </p>

        {/* Chromatic Palette Row */}
        {palette.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-xs font-semibold text-slate-700 font-mono">Assigned Color Palette:</span>
            <div className="flex items-center gap-2">
              {palette.map((swatch, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-2xs">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-700">{swatch.hex}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domains & Handles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-500" />
                <span>Domains</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                  selectedName.domainAvailability.com
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {selectedName.domainAvailability.com ? '✓' : '✗'} .com
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                  selectedName.domainAvailability.io
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {selectedName.domainAvailability.io ? '✓' : '✗'} .io
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                  selectedName.domainAvailability.co
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {selectedName.domainAvailability.co ? '✓' : '✗'} .co
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-500" />
                <span>Social Handles</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">@{selectedName.name.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                  selectedName.domainAvailability.handle.twitter
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                Twitter: {selectedName.domainAvailability.handle.twitter ? 'Available' : 'Claimed'}
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                  selectedName.domainAvailability.handle.instagram
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                Instagram: {selectedName.domainAvailability.handle.instagram ? 'Available' : 'Claimed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
