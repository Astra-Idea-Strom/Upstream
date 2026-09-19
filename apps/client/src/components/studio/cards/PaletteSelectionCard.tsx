import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { Check, ArrowRight, Palette } from 'lucide-react';

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
    tone: 'artisanal',
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Color Harmonies & Typography
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Color Palette for {selectedName.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a calibrated chromatic system and paired fonts.
          </p>
        </div>

        {hasConfirmedPalette && (
          <button
            onClick={closePaletteModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors self-start sm:self-auto"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-3">
        {PALETTE_OPTIONS.map((pal) => {
          const isSelected = activePaletteIdx === pal.idx;

          return (
            <div
              key={pal.idx}
              onClick={() => selectPalette(pal.idx)}
              className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-900 bg-slate-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-base text-slate-950">
                      {pal.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded capitalize">
                      {pal.tone}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{pal.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                    {pal.fonts.headline} + {pal.fonts.body}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPalette(pal.idx);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
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

              {/* Swatches Row */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {pal.swatches.map((sw, i) => (
                  <div key={i} className="flex flex-col">
                    <div
                      className="h-10 rounded-lg shadow-inner border border-black/5"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <span className="text-[10px] font-mono text-slate-700 mt-1 uppercase font-semibold">
                      {sw.hex}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate hidden sm:block">
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
