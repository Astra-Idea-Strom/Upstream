import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { Palette, Check, ArrowRight, Zap, Sparkles } from 'lucide-react';

const PALETTE_OPTIONS = [
  {
    idx: 0,
    name: 'Electric Neon & Violet',
    tone: 'bold',
    themeBorder: 'border-purple-300/90 hover:border-purple-500',
    selectedBorder: 'border-purple-600 ring-2 ring-purple-500/40 bg-purple-50/70 shadow-md',
    accentBar: 'bg-purple-600',
    badge: 'bg-purple-100 text-purple-950 border-purple-300',
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
    themeBorder: 'border-amber-300/90 hover:border-amber-500',
    selectedBorder: 'border-amber-600 ring-2 ring-amber-500/40 bg-amber-50/70 shadow-md',
    accentBar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-950 border-amber-300',
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
    themeBorder: 'border-rose-300/90 hover:border-rose-500',
    selectedBorder: 'border-rose-600 ring-2 ring-rose-500/40 bg-rose-50/70 shadow-md',
    accentBar: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-950 border-rose-300',
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
    themeBorder: 'border-blue-300/90 hover:border-blue-500',
    selectedBorder: 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/70 shadow-md',
    accentBar: 'bg-blue-600',
    badge: 'bg-blue-100 text-blue-950 border-blue-300',
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
    themeBorder: 'border-emerald-300/90 hover:border-emerald-500',
    selectedBorder: 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/70 shadow-md',
    accentBar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
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
    <div className="bg-white rounded-3xl border-2 border-purple-400/90 p-6 sm:p-7 shadow-lg shadow-purple-500/5 relative overflow-hidden transition-all text-left animate-in fade-in duration-300">
      {/* Top Colorful Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-200/90 gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-extrabold uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              <span>STEP 4: COLOR HARMONIES & FONTS</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-700 font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              AWAITING SELECTION
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight">
            Select Color Direction for <span className="text-brand-600">{selectedName.name}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            5 calibrated chromatic palettes with Google Font pairings. Click any to apply.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {hasConfirmedPalette && (
            <button
              onClick={closePaletteModal}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAutoPick}
            className="px-4 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-purple-600" />
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
              className={`group relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? pal.selectedBorder
                  : `${pal.themeBorder} bg-white hover:bg-slate-50/80 shadow-xs hover:shadow-md hover:-translate-y-0.5`
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${pal.accentBar}`} />

              <div className="pl-3 sm:pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-black text-lg text-slate-950">
                        {pal.name}
                      </h4>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${pal.badge}`}>
                        {pal.tone}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{pal.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/80">
                      <span className="text-[9px] text-slate-400 font-mono block">Font Pairing</span>
                      <span className="text-xs font-bold text-slate-900">
                        {pal.fonts.headline} + {pal.fonts.body}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPalette(pal.idx);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-950 text-white group-hover:bg-purple-600'
                      }`}
                    >
                      <span>{isSelected ? 'Applied ✓' : 'Select Palette'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Color Swatches Grid */}
                <div className="grid grid-cols-5 gap-2.5 pt-1">
                  {pal.swatches.map((sw, i) => (
                    <div key={i} className="flex flex-col">
                      <div
                        className="h-11 sm:h-13 rounded-xl shadow-inner border border-black/10 transition-transform hover:scale-105"
                        style={{ backgroundColor: sw.hex }}
                      />
                      <span className="text-[10px] font-mono text-slate-800 mt-1 uppercase truncate font-bold">
                        {sw.hex}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate hidden sm:block font-medium">
                        {sw.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
