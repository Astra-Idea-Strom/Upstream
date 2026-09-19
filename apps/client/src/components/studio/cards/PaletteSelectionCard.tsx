import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { Palette, Check, ArrowRight, Zap } from 'lucide-react';

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
      { hex: '#F59E0B', name: 'Warm Amber Gold' },
      { hex: '#FCFBFF', name: 'Opal Pearl' },
      { hex: '#1E1035', name: 'Velvet Noir' },
    ],
    fonts: { headline: 'Playfair Display', body: 'Plus Jakarta Sans' },
  },
  {
    idx: 3,
    name: 'Modern Tech & Hyper Indigo',
    tone: 'tech-forward',
    description: 'Crisp developer intelligence with glassmorphism and cyan glows.',
    swatches: [
      { hex: '#6366F1', name: 'Hyper Indigo' },
      { hex: '#06B6D4', name: 'Cyan Glow' },
      { hex: '#8B5CF6', name: 'Prism Purple' },
      { hex: '#F8FAFC', name: 'Clean Circuit' },
      { hex: '#0B0F19', name: 'Deep Space' },
    ],
    fonts: { headline: 'Outfit', body: 'Inter' },
  },
  {
    idx: 4,
    name: 'Organic Botanical & Emerald',
    tone: 'minimalist',
    description: 'Tactile morning dew, wild rose accents, and apothecary calm.',
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

export const PaletteSelectionCard: React.FC = () => {
  const {
    selectedName,
    activePaletteIdx,
    selectPalette,
    closePaletteModal,
    hasConfirmedPalette,
  } = useBrandStore();

  const handleAutoPick = () => {
    selectPalette(1); // Default warm artisan terracotta
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-300/90 p-6 sm:p-7 shadow-md relative overflow-hidden transition-all animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold">
              <Palette className="w-3 h-3 text-coral-500" />
              <span>STEP 4: COLOR HARMONIES & FONTS</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
            Select Color Direction for <span className="text-brand-600">{selectedName.name}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            5 calibrated chromatic palettes with Google Font pairings. Click any to apply.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedPalette && (
            <button
              onClick={closePaletteModal}
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

      {/* Palette Options List */}
      <div className="space-y-3.5">
        {PALETTE_OPTIONS.map((pal) => {
          const isSelected = activePaletteIdx === pal.idx;

          return (
            <div
              key={pal.idx}
              onClick={() => selectPalette(pal.idx)}
              className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                  : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-base text-slate-900">
                      {pal.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {pal.tone}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{pal.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-mono block">Fonts</span>
                    <span className="text-xs font-bold text-slate-700">
                      {pal.fonts.headline} + {pal.fonts.body}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPalette(pal.idx);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-950 text-white group-hover:bg-brand-600 shadow-2xs'
                    }`}
                  >
                    <span>{isSelected ? 'Applied' : 'Select'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {pal.swatches.map((sw, i) => (
                  <div key={i} className="flex flex-col">
                    <div
                      className="h-10 sm:h-12 rounded-xl shadow-inner border border-black/5"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <span className="text-[9px] font-mono text-slate-600 mt-1 uppercase truncate font-semibold">
                      {sw.hex}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate hidden sm:block">
                      {sw.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
