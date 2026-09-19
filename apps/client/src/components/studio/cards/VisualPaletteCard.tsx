import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import {
  Palette,
  Type,
  Check,
  RotateCcw,
} from 'lucide-react';

const ALTERNATIVE_PALETTES = [
  {
    name: 'Electric Neon & Violet',
    description: 'High energy modern tech-forward and streetwear contrast.',
    swatches: [
      { hex: '#7C3AED', name: 'Electric Violet', role: 'primary' as const },
      { hex: '#1E1B4B', name: 'Midnight Navy', role: 'secondary' as const },
      { hex: '#FB7185', name: 'Neon Coral', role: 'accent' as const },
      { hex: '#F8F6FE', name: 'Lilac Fog', role: 'background' as const },
      { hex: '#0F172A', name: 'Pitch Ink', role: 'text' as const },
    ],
  },
  {
    name: 'Artisan Terracotta & Roast',
    description: 'Warm, cozy earthy ceramics, espresso crema, and natural kraft paper.',
    swatches: [
      { hex: '#D97706', name: 'Terracotta Glaze', role: 'primary' as const },
      { hex: '#FDE68A', name: 'Warm Cream', role: 'secondary' as const },
      { hex: '#7C3AED', name: 'Artisan Violet', role: 'accent' as const },
      { hex: '#FDFBF7', name: 'Linen Paper', role: 'background' as const },
      { hex: '#451A03', name: 'Dark Roast', role: 'text' as const },
    ],
  },
  {
    name: 'Haute Atelier Pastel',
    description: 'Soft, silk European elegance with muted lavender and amber gold.',
    swatches: [
      { hex: '#9060FA', name: 'Silk Lavender', role: 'primary' as const },
      { hex: '#DDD6FE', name: 'Mist Lilac', role: 'secondary' as const },
      { hex: '#F59E0B', name: 'Amber Gold', role: 'accent' as const },
      { hex: '#FCFBFF', name: 'Opal Pearl', role: 'background' as const },
      { hex: '#1E1035', name: 'Velvet Noir', role: 'text' as const },
    ],
  },
  {
    name: 'Pure Botanical Sage',
    description: 'Clean organic wellness and restorative natural skincare harmony.',
    swatches: [
      { hex: '#10B981', name: 'Botanical Emerald', role: 'primary' as const },
      { hex: '#A7F3D0', name: 'Mint Dew', role: 'secondary' as const },
      { hex: '#F472B6', name: 'Wild Blossom', role: 'accent' as const },
      { hex: '#F6FBF8', name: 'Fresh Morning', role: 'background' as const },
      { hex: '#064E3B', name: 'Deep Canopy', role: 'text' as const },
    ],
  },
];

export const VisualPaletteCard: React.FC = () => {
  const { selectedName, activePaletteIdx, openPaletteModal, openLogoModal } = useBrandStore();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const paletteObj = ALTERNATIVE_PALETTES[activePaletteIdx] || ALTERNATIVE_PALETTES[0];
  const fonts = selectedName?.visualDirection?.fonts || {
    headline: 'Plus Jakarta Sans',
    body: 'Inter',
    headlineWeight: '800',
    bodyWeight: '400',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Visual Harmony
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Color Palette & Fonts
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {paletteObj.name} · {paletteObj.description}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={openPaletteModal}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            Change Palette
          </button>
          <button
            onClick={openLogoModal}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Inspect Logos
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              5-Color Swatch Values
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Click to copy</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {paletteObj.swatches.map((swatch, i) => (
              <div
                key={i}
                onClick={() => handleCopy(swatch.hex)}
                className="group flex flex-col cursor-pointer"
              >
                <div
                  className="h-12 sm:h-14 rounded-xl shadow-inner border border-black/10 flex items-end p-2 transition-transform group-hover:scale-102 relative overflow-hidden"
                  style={{ backgroundColor: swatch.hex }}
                >
                  {copiedHex === swatch.hex && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white text-[10px] font-bold">
                      <Check className="w-3.5 h-3.5 mr-0.5" /> Copied
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-900 mt-1 truncate">
                  {swatch.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  {swatch.hex}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Headline · {fonts.headline}
              </span>
              <p
                className="text-lg font-bold text-slate-950 mt-1 truncate"
                style={{ fontFamily: fonts.headline }}
              >
                {selectedName.name} Identity
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Body Font · {fonts.body}
              </span>
              <p
                className="text-xs text-slate-600 mt-1 leading-relaxed"
                style={{ fontFamily: fonts.body }}
              >
                Crafting meaningful modern impressions across all touchpoints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
