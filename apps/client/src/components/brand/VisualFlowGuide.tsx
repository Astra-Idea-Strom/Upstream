import React, { useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import type { ColorSwatch } from '@upstream/shared';
import {
  Palette,
  Type,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  ChevronLeft,
  Sliders,
  Eye,
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
    name: 'Haute Atelier Pastel',
    description: 'Soft, silk European elegance with muted lavender and champagne gold.',
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

export const VisualFlowGuide: React.FC = () => {
  const { selectedName, setStep, activePaletteIdx, setActivePaletteIdx } = useBrandStore();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [testText, setTestText] = useState('Sculpting the next generation of identity.');

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const currentPalette = ALTERNATIVE_PALETTES[activePaletteIdx] || ALTERNATIVE_PALETTES[0];
  const { fonts, styleDescription } = selectedName.visualDirection;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-1.5">
            <Palette className="w-3 h-3 text-coral-500" />
            <span>STEP 3 OF 5: COLOR PALETTE & VISUAL FLOW GUIDE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Visual Guide for <span className="text-brand-600">{selectedName.name}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 italic">
            "{selectedName.tagline}"
          </p>
        </div>

        <button
          onClick={() => setStep(2)}
          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Names</span>
        </button>
      </div>

      {/* Style Atmosphere Banner */}
      <div className="p-4 rounded-3xl bg-brand-50/70 border border-brand-100/90 shadow-2xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block mb-1">
          Aesthetic Architecture & Style Notes
        </span>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {styleDescription}
        </p>
      </div>

      {/* Color Palette Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-600" />
            <span>Select 5-Color Chromatic Palette</span>
          </h3>
          <span className="text-[11px] text-slate-400">Click any hex to copy</span>
        </div>

        {/* Alternate Palette Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ALTERNATIVE_PALETTES.map((pal, idx) => {
            const isSelected = activePaletteIdx === idx;
            return (
              <div
                key={pal.name}
                onClick={() => setActivePaletteIdx(idx)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-600 bg-white ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900">{pal.name}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* 5 Swatches Bar */}
                <div className="flex h-7 rounded-xl overflow-hidden shadow-2xs mb-2">
                  {pal.swatches.map((s, i) => (
                    <div
                      key={i}
                      className="flex-1 h-full"
                      style={{ backgroundColor: s.hex }}
                      title={`${s.name}: ${s.hex}`}
                    />
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 line-clamp-1">{pal.description}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Swatches of Active Palette */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {currentPalette.swatches.map((swatch, i) => {
            const isCopied = copiedHex === swatch.hex;
            return (
              <div
                key={i}
                onClick={() => handleCopy(swatch.hex)}
                className="group relative rounded-3xl p-3 border border-slate-200 hover:border-brand-400 bg-white shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between h-32"
              >
                <div
                  className="w-full h-14 rounded-2xl shadow-inner relative flex items-center justify-center"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-mono">
                    {isCopied ? 'Copied' : swatch.hex}
                  </span>
                </div>
                <div className="mt-1.5">
                  <span className="font-bold text-xs text-slate-800 block truncate">
                    {swatch.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">
                    {swatch.hex}
                  </span>
                  <span className="text-[8px] font-bold text-brand-600 uppercase tracking-wider block">
                    {swatch.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography Hierarchy Specimen */}
      <div className="p-5 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Type className="w-4 h-4 text-brand-600" />
            <span>Google Font Pairing Specimen</span>
          </h3>
          <span className="text-[11px] font-mono text-brand-700 font-semibold">
            {fonts.headline} + {fonts.body}
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Headline Font ({fonts.headline} {fonts.headlineWeight}w) — Click to Edit Specimen
          </label>
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full text-xl sm:text-2xl font-bold text-slate-900 tracking-tight bg-transparent border-b border-dashed border-slate-300 focus:border-brand-500 focus:outline-none pb-1"
            style={{ fontFamily: fonts.headline }}
          />
        </div>

        <div className="pt-2">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Body Copy Font ({fonts.body} {fonts.bodyWeight}w)
          </span>
          <p
            className="text-xs sm:text-sm text-slate-600 leading-relaxed"
            style={{ fontFamily: fonts.body }}
          >
            {selectedName.meaning} Engineered for digital clarity across web platforms, packaging,
            merchandise, and investor documentation.
          </p>
        </div>
      </div>

      {/* Bottom Action: Proceed to Logos */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setStep(2)}
          className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          Back to 5 Names
        </button>

        <button
          onClick={() => setStep(4)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-coral-500 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all group"
        >
          <span>Proceed to 5 Logo Concepts</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
