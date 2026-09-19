import React from 'react';
import type { BrandName } from '@upstream/shared';
import { Check, Sparkles, ArrowRight, Globe } from 'lucide-react';

interface ChatBrandNameCardProps {
  brand: BrandName;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

// 5 Curated Color Themes for the chat cards: vibrant, distinguishable, highly readable
const CARD_COLOR_THEMES = [
  {
    bg: 'bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-white',
    border: 'border-amber-200/90 hover:border-amber-400',
    selectedRing: 'ring-2 ring-amber-500 border-amber-500 shadow-md shadow-amber-500/10',
    badge: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    accentText: 'text-amber-800',
    tag: 'Artisanal & Tactile',
    accentBar: 'bg-amber-500',
  },
  {
    bg: 'bg-gradient-to-br from-purple-500/10 via-purple-50/50 to-white',
    border: 'border-purple-200/90 hover:border-purple-400',
    selectedRing: 'ring-2 ring-purple-600 border-purple-600 shadow-md shadow-purple-500/10',
    badge: 'bg-purple-100/90 text-purple-900 border-purple-300/80',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    accentText: 'text-purple-800',
    tag: 'Dynamic & Bold',
    accentBar: 'bg-purple-600',
  },
  {
    bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-50/50 to-white',
    border: 'border-emerald-200/90 hover:border-emerald-400',
    selectedRing: 'ring-2 ring-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/10',
    badge: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    accentText: 'text-emerald-800',
    tag: 'Terroir & Organic',
    accentBar: 'bg-emerald-500',
  },
  {
    bg: 'bg-gradient-to-br from-blue-500/10 via-sky-50/50 to-white',
    border: 'border-blue-200/90 hover:border-blue-400',
    selectedRing: 'ring-2 ring-blue-500 border-blue-500 shadow-md shadow-blue-500/10',
    badge: 'bg-blue-100/90 text-blue-900 border-blue-300/80',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    accentText: 'text-blue-800',
    tag: 'Modernist Tech',
    accentBar: 'bg-blue-600',
  },
  {
    bg: 'bg-gradient-to-br from-rose-500/10 via-rose-50/50 to-white',
    border: 'border-rose-200/90 hover:border-rose-400',
    selectedRing: 'ring-2 ring-rose-500 border-rose-500 shadow-md shadow-rose-500/10',
    badge: 'bg-rose-100/90 text-rose-900 border-rose-300/80',
    btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
    accentText: 'text-rose-800',
    tag: 'Quiet Luxury',
    accentBar: 'bg-rose-500',
  },
];

export const ChatBrandNameCard: React.FC<ChatBrandNameCardProps> = ({
  brand,
  isSelected,
  onSelect,
  index,
}) => {
  const theme = CARD_COLOR_THEMES[index % CARD_COLOR_THEMES.length];
  const headlineFont = brand.visualDirection?.fonts?.headline || 'Outfit';
  const palette = brand.visualDirection?.palette || [];

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border p-3.5 transition-all cursor-pointer select-none text-left relative overflow-hidden ${
        theme.bg
      } ${
        isSelected
          ? theme.selectedRing
          : `${theme.border} hover:shadow-sm hover:translate-y-[-1px]`
      }`}
    >
      {/* Top Left Accent Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.accentBar}`} />

      {/* Header row: Tag + Font + Domain */}
      <div className="flex items-center justify-between gap-2 mb-2 pl-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider font-mono ${theme.badge}`}
          >
            {theme.tag}
          </span>
          <span className="text-[10px] font-mono text-slate-500 bg-white/80 border border-slate-200/70 px-1.5 py-0.5 rounded">
            Aa {headlineFont}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>.co available</span>
        </div>
      </div>

      {/* Main Brand Name in paired Headline Font */}
      <div className="flex items-baseline justify-between gap-2 mb-1 pl-1">
        <h3
          style={{ fontFamily: headlineFont }}
          className="text-lg sm:text-xl font-bold text-slate-950 tracking-tight leading-tight"
        >
          {brand.name}
        </h3>

        {isSelected && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Active</span>
          </span>
        )}
      </div>

      {/* Tagline */}
      <p className="text-xs italic text-slate-700 font-serif mb-1.5 pl-1 leading-snug">
        "{brand.tagline}"
      </p>

      {/* Meaning / Rationale */}
      <p className="text-[11px] text-slate-600 leading-relaxed pl-1 mb-2.5 line-clamp-2">
        {brand.meaning}
      </p>

      {/* Color Harmony Swatches Preview */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 pl-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">
            Palette:
          </span>
          <div className="flex items-center -space-x-1">
            {palette.map((swatch, sIdx) => (
              <div
                key={sIdx}
                className="w-4 h-4 rounded-full border border-white shadow-2xs transition-transform hover:scale-125"
                style={{ backgroundColor: swatch.hex }}
                title={`${swatch.name} (${swatch.hex})`}
              />
            ))}
          </div>
        </div>

        {/* 1-Click Select Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
            isSelected
              ? `${theme.btnBg} ring-2 ring-white`
              : 'bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-300'
          }`}
        >
          <span>{isSelected ? '✓ Selected' : 'Select Name'}</span>
          {!isSelected && <ArrowRight className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
