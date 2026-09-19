import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import {
  Type,
  Maximize2,
  Minimize2,
  Sliders,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
} from 'lucide-react';

export const FONT_OPTIONS = [
  { name: 'Outfit', category: 'Modern Geometric Sans' },
  { name: 'Plus Jakarta Sans', category: 'Tech Neo-Grotesque' },
  { name: 'Syne', category: 'Artisanal Avant-Garde' },
  { name: 'Playfair Display', category: 'High Editorial Serif' },
  { name: 'Inter', category: 'Neutral Hyper-Legible' },
  { name: 'Space Grotesk', category: 'Brutalist Tech' },
  { name: 'Merriweather', category: 'Warm Literary Serif' },
];

export const CanvaEditorToolbar: React.FC = () => {
  const {
    selectedName,
    activePaletteIdx,
    canvaSelectedElement,
    setCanvaSelectedElement,
    canvaHeadlineFont,
    setCanvaHeadlineFont,
    canvaWordmarkSize,
    setCanvaWordmarkSize,
    canvaTaglineSize,
    setCanvaTaglineSize,
    canvaFontWeight,
    setCanvaFontWeight,
    canvaLetterSpacing,
    setCanvaLetterSpacing,
    canvaTextColor,
    setCanvaTextColor,
    canvaBgMode,
    setCanvaBgMode,
    resetCanvaStyles,
  } = useBrandStore();

  const paletteSwatches = selectedName.visualDirection?.palette || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-sm space-y-3 select-none">
      {/* Top Header & Element Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-brand-600" />
            <span>Canva Design Controls</span>
          </span>
        </div>

        {/* Selected Element Tabs: Name vs Tagline vs Background */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setCanvaSelectedElement('wordmark')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              canvaSelectedElement === 'wordmark'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Brand Name
          </button>
          <button
            onClick={() => setCanvaSelectedElement('tagline')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              canvaSelectedElement === 'tagline'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tagline
          </button>
          <button
            onClick={() => setCanvaSelectedElement('background')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              canvaSelectedElement === 'background'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Canvas Theme
          </button>
        </div>

        <button
          onClick={resetCanvaStyles}
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          title="Reset to AI defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Tooling Row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
        {/* 1. Font Family Picker */}
        <div className="flex items-center gap-2">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={canvaHeadlineFont}
            onChange={(e) => setCanvaHeadlineFont(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white text-xs cursor-pointer shadow-2xs"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Font Size Controls */}
        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Size</span>
          <button
            onClick={() => {
              if (canvaSelectedElement === 'tagline') {
                setCanvaTaglineSize(Math.max(10, canvaTaglineSize - 2));
              } else {
                setCanvaWordmarkSize(Math.max(18, canvaWordmarkSize - 2));
              }
            }}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center font-mono font-bold text-slate-800">
            {canvaSelectedElement === 'tagline' ? canvaTaglineSize : canvaWordmarkSize}px
          </span>
          <button
            onClick={() => {
              if (canvaSelectedElement === 'tagline') {
                setCanvaTaglineSize(Math.min(36, canvaTaglineSize + 2));
              } else {
                setCanvaWordmarkSize(Math.min(84, canvaWordmarkSize + 2));
              }
            }}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>

        {/* 3. Font Weight Selector */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Weight</span>
          {[400, 600, 700, 800].map((w) => (
            <button
              key={w}
              onClick={() => setCanvaFontWeight(w)}
              className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all ${
                canvaFontWeight === w
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {w === 400 ? 'Reg' : w === 600 ? 'Semi' : w === 700 ? 'Bold' : 'Black'}
            </button>
          ))}
        </div>

        {/* 4. Letter Spacing Tracking */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Tracking</span>
          <input
            type="range"
            min="-1"
            max="12"
            step="1"
            value={canvaLetterSpacing}
            onChange={(e) => setCanvaLetterSpacing(parseInt(e.target.value, 10))}
            className="w-16 sm:w-20 accent-brand-600 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-600 font-bold w-6">
            {canvaLetterSpacing}px
          </span>
        </div>

        {/* 5. Color Swatches & Custom Picker */}
        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Color</span>
          {paletteSwatches.slice(0, 5).map((sw, i) => (
            <button
              key={i}
              onClick={() => setCanvaTextColor(sw.hex)}
              className={`w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-110 shadow-2xs ${
                canvaTextColor.toLowerCase() === sw.hex.toLowerCase() ? 'ring-2 ring-brand-500 ring-offset-1' : ''
              }`}
              style={{ backgroundColor: sw.hex }}
              title={sw.name}
            />
          ))}

          {/* Native Color Eyedropper Picker */}
          <label className="relative cursor-pointer flex items-center justify-center w-6 h-6 rounded-full border border-slate-300 bg-gradient-to-tr from-rose-400 via-purple-400 to-amber-300 shadow-2xs hover:scale-105 transition-transform ml-1">
            <input
              type="color"
              value={canvaTextColor.startsWith('#') ? canvaTextColor : '#0F172A'}
              onChange={(e) => setCanvaTextColor(e.target.value)}
              className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>

        {/* 6. Background Mode */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Canvas</span>
          <button
            onClick={() => setCanvaBgMode('light')}
            className={`p-1.5 rounded-lg transition-colors ${
              canvaBgMode === 'light' ? 'bg-white border border-slate-300 text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Clean White"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCanvaBgMode('linen')}
            className={`p-1.5 rounded-lg transition-colors ${
              canvaBgMode === 'linen' ? 'bg-amber-50 border border-amber-300 text-amber-900 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Warm Linen"
          >
            <span className="text-[10px] font-bold font-serif">Aa</span>
          </button>
          <button
            onClick={() => setCanvaBgMode('dark')}
            className={`p-1.5 rounded-lg transition-colors ${
              canvaBgMode === 'dark' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Obsidian Dark"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCanvaBgMode('brand')}
            className={`p-1.5 rounded-lg transition-colors ${
              canvaBgMode === 'brand' ? 'bg-gradient-to-r from-brand-600 to-coral-500 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Brand Gradient"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
