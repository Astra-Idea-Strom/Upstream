import React, { useState } from 'react';
import type { BrandName, ColorSwatch } from '@upstream/shared';
import {
  Palette,
  Type,
  Sparkles,
  Check,
  Copy,
  X,
  ExternalLink,
  Sliders,
} from 'lucide-react';

interface VisualDirectionPanelProps {
  brand: BrandName;
  onClose: () => void;
  onProceedToLogos: () => void;
}

export const VisualDirectionPanel: React.FC<VisualDirectionPanelProps> = ({
  brand,
  onClose,
  onProceedToLogos,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [testText, setTestText] = useState('Sculpting the next generation of identity.');

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const { palette, fonts, styleDescription } = brand.visualDirection;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
      <div className="bg-white/95 backdrop-blur-2xl rounded-5xl border border-white/90 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
            <Palette className="w-3.5 h-3.5 text-coral-500" />
            <span>AI BRAND VISUAL DIRECTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Visual Guide for <span className="text-brand-600">{brand.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
            "{brand.tagline}"
          </p>
        </div>

        {/* Style Atmosphere */}
        <div className="p-4 rounded-3xl bg-brand-50/70 border border-brand-100/80 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block mb-1">
            Aesthetic Identity & Tone
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {styleDescription}
          </p>
        </div>

        {/* Color Palette Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-600" />
              <span>Recommended 5-Color Harmony</span>
            </h3>
            <span className="text-[11px] text-slate-400">Click any hex to copy</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {palette.map((color: ColorSwatch, i: number) => {
              const isCopied = copiedHex === color.hex;
              return (
                <div
                  key={i}
                  onClick={() => handleCopy(color.hex)}
                  className="group relative rounded-3xl p-3 border border-slate-200/80 hover:border-brand-400 bg-white shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between h-36"
                >
                  {/* Swatch color block */}
                  <div
                    className="w-full h-16 rounded-2xl shadow-inner relative flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      {isCopied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                      {isCopied ? 'Copied' : color.hex}
                    </span>
                  </div>

                  {/* Swatch Details */}
                  <div className="mt-2">
                    <span className="font-bold text-xs text-slate-800 block truncate">
                      {color.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">
                      {color.hex}
                    </span>
                    <span className="text-[9px] font-bold text-brand-600 uppercase tracking-wider block mt-0.5">
                      {color.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Typography Pairing */}
        <div className="p-5 rounded-3xl border border-slate-200/90 bg-white mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-brand-600" />
              <span>Curated Google Typography Pairing</span>
            </h3>
            <span className="text-[11px] text-brand-700 font-semibold">
              {fonts.headline} (Headline) + {fonts.body} (Body)
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Headline Specimen — {fonts.headline} {fonts.headlineWeight}w
              </span>
              <h4
                className="text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight"
                style={{ fontFamily: fonts.headline }}
              >
                {brand.name} — {testText}
              </h4>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Body Specimen — {fonts.body} {fonts.bodyWeight}w
              </span>
              <p
                className="text-xs sm:text-sm text-slate-600 leading-relaxed"
                style={{ fontFamily: fonts.body }}
              >
                {brand.meaning} Crafted with precision to embody authentic brand value, tactile elegance,
                and seamless digital presence across web and physical packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Back to Names
          </button>

          <button
            onClick={() => {
              onClose();
              onProceedToLogos();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-coral-500 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Logo Concepts with this Direction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
