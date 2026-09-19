import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { Palette, X, Check, ArrowRight, Zap } from 'lucide-react';

const PALETTE_OPTIONS = [
  {
    idx: 0,
    name: 'Electric Neon & Violet',
    tone: 'bold',
    description: 'High energy modern tech-forward and streetwear contrast.',
    swatches: [
      { hex: '#7C3AED', name: 'Electric Violet' },
      { hex: '#1E1B4B', name: 'Midnight Navy' },
      { hex: '#FB7185', name: 'Neon Coral' },
      { hex: '#F8F6FE', name: 'Lilac Fog' },
      { hex: '#0F172A', name: 'Pitch Ink' },
    ],
    fonts: { headline: 'Plus Jakarta Sans', body: 'Inter' },
  },
  {
    idx: 1,
    name: 'Artisan Terracotta & Roast',
    tone: 'playful',
    description: 'Warm, cozy earthy ceramics, espresso crema, and natural kraft paper.',
    swatches: [
      { hex: '#D97706', name: 'Terracotta Glaze' },
      { hex: '#FDE68A', name: 'Warm Cream' },
      { hex: '#7C3AED', name: 'Artisan Violet' },
      { hex: '#FDFBF7', name: 'Linen Paper' },
      { hex: '#451A03', name: 'Dark Roast' },
    ],
    fonts: { headline: 'Outfit', body: 'Merriweather' },
  },
  {
    idx: 2,
    name: 'Haute Atelier Pastel',
    tone: 'luxurious',
    description: 'Soft, silk European elegance with muted lavender and champagne gold.',
    swatches: [
      { hex: '#9060FA', name: 'Silk Lavender' },
      { hex: '#DDD6FE', name: 'Mist Lilac' },
      { hex: '#F59E0B', name: 'Amber Gold' },
      { hex: '#FCFBFF', name: 'Opal Pearl' },
      { hex: '#1E1035', name: 'Velvet Noir' },
    ],
    fonts: { headline: 'Playfair Display', body: 'Plus Jakarta Sans' },
  },
  {
    idx: 3,
    name: 'Pure Botanical Sage',
    tone: 'minimalist',
    description: 'Clean organic wellness and restorative natural skincare harmony.',
    swatches: [
      { hex: '#10B981', name: 'Botanical Emerald' },
      { hex: '#A7F3D0', name: 'Mint Dew' },
      { hex: '#F472B6', name: 'Wild Blossom' },
      { hex: '#F6FBF8', name: 'Fresh Morning' },
      { hex: '#064E3B', name: 'Deep Canopy' },
    ],
    fonts: { headline: 'Merriweather', body: 'Inter' },
  },
];

export const PaletteSelectionModal: React.FC = () => {
  const { selectedName, activePaletteIdx, selectPalette, closePaletteModal, runFullAutonomousPipeline } =
    useBrandStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 rounded-3xl border border-white/80 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold mb-1">
              <Palette className="w-3 h-3 text-coral-500" />
              <span>COLOR & TYPOGRAPHY HARMONIES</span>
            </div>
            <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
              Select Visual Palette for <span className="text-brand-600">{selectedName.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the chromatic palette that reflects your brand essence.
            </p>
          </div>

          <button
            onClick={closePaletteModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
          {PALETTE_OPTIONS.map((pal) => {
            const isSelected = activePaletteIdx === pal.idx;

            return (
              <div
                key={pal.idx}
                onClick={() => selectPalette(pal.idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{pal.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {pal.fonts.headline} + {pal.fonts.body}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPalette(pal.idx);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 self-end sm:self-center ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-950 text-white hover:bg-brand-600'
                    }`}
                  >
                    <span>{isSelected ? 'Applied' : 'Select Palette'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 mb-3">{pal.description}</p>

                <div className="grid grid-cols-5 gap-2">
                  {pal.swatches.map((sw, i) => (
                    <div key={i} className="flex flex-col">
                      <div
                        className="h-10 sm:h-12 rounded-xl shadow-inner border border-black/5"
                        style={{ backgroundColor: sw.hex }}
                      />
                      <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase truncate">
                        {sw.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous agent will proceed to render vector logo styles next.</span>
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
              onClick={closePaletteModal}
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
