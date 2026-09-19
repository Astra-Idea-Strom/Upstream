import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { exportBrandCardToPDF, exportBrandCardToImage } from '../../../utils/pdfExport';
import {
  Download,
  FileText,
  Code2,
  Check,
  Sparkles,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { TwitterIcon, InstagramIcon } from '../../brand/SocialIcons';
import confetti from 'canvas-confetti';

// Convert hex to RGB numbers
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

// Convert RGB to approximate CMYK
function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export const BrandKitExportCard: React.FC = () => {
  const { selectedName, input, reset } = useBrandStore();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState(false);

  const da = selectedName.domainAvailability;
  const palette = selectedName.visualDirection?.palette || [];
  const fonts = selectedName.visualDirection?.fonts;

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      await exportBrandCardToPDF('brand-identity-onepager', selectedName.name);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      console.error(err);
      alert('Could not export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      setIsExportingPNG(true);
      await exportBrandCardToImage('brand-identity-onepager', selectedName.name);
    } catch (err) {
      console.error(err);
      alert('Could not export image.');
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleCopyTokens = () => {
    const tokens = {
      name: selectedName.name,
      tagline: selectedName.tagline,
      industry: input.industry,
      mission: input.mission,
      palette: selectedName.visualDirection.palette,
      typography: selectedName.visualDirection.fonts,
      domainAvailability: selectedName.domainAvailability,
    };
    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    setCopiedTokens(true);
    setTimeout(() => setCopiedTokens(false), 2000);
  };

  return (
    <div
      id="brand-identity-onepager"
      className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs relative text-left"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Asset Handoff
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Investor Brand Kit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete synchronized identity assets, domain checks, color specs, typography, and one-pager export.
          </p>
        </div>
        <button
          onClick={reset}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors border border-slate-200/60 shadow-2xs"
          title="Start New Project"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Brand Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Brand Name</span>
          <strong className="text-sm text-slate-900 font-display font-black truncate block mt-0.5">
            {selectedName.name}
          </strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Industry</span>
          <strong className="text-[11px] text-slate-800 font-bold truncate block mt-0.5">
            {input.industry}
          </strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Tone</span>
          <strong className="text-[11px] text-brand-700 font-bold capitalize block mt-0.5">
            {input.tone}
          </strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Status</span>
          <strong className="text-[11px] text-emerald-700 font-bold block mt-0.5">
            ✓ Launch Ready
          </strong>
        </div>
      </div>

      {/* Tagline */}
      <div className="mb-5 p-4 rounded-xl border border-slate-200 bg-slate-50">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Tagline</span>
        <p className="text-base font-serif italic text-slate-800">&ldquo;{selectedName.tagline}&rdquo;</p>
      </div>

      {/* Domain & Social Availability */}
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Domain & Social Handle Availability
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: <Globe className="w-3 h-3" />, label: '.com', avail: da.com, color: 'emerald' },
            { icon: <Globe className="w-3 h-3" />, label: '.io', avail: da.io, color: 'emerald' },
            { icon: <Globe className="w-3 h-3" />, label: '.co', avail: da.co, color: 'emerald' },
            { icon: <TwitterIcon className="w-3 h-3" />, label: '@twitter', avail: da.handle.twitter, color: 'sky' },
            { icon: <InstagramIcon className="w-3 h-3" />, label: '@instagram', avail: da.handle.instagram, color: 'pink' },
          ].map(({ icon, label, avail, color }) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
                avail
                  ? color === 'sky'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : color === 'pink'
                    ? 'bg-pink-50 text-pink-700 border-pink-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              {icon}
              <span>{avail ? '✓' : '✗'} {label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette with Full Specs */}
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Color Palette — Full Specifications
        </span>
        <div className="space-y-2">
          {palette.map((swatch) => {
            const rgb = hexToRgb(swatch.hex);
            const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
            return (
              <div key={swatch.hex} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 shadow-2xs border border-white"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{swatch.name}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                      {swatch.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-700 font-bold">{swatch.hex.toUpperCase()}</span>
                    {rgb && (
                      <span className="text-[10px] font-mono text-slate-500">
                        RGB({rgb.r}, {rgb.g}, {rgb.b})
                      </span>
                    )}
                    {cmyk && (
                      <span className="text-[10px] font-mono text-slate-500">
                        CMYK({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography */}
      {fonts && (
        <div className="mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Typography Pairing
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Headline Font</span>
              <p
                style={{ fontFamily: fonts.headline, fontWeight: parseInt(fonts.headlineWeight) }}
                className="text-lg text-slate-900 truncate"
              >
                {fonts.headline}
              </p>
              <span className="text-[10px] font-mono text-slate-500">Weight: {fonts.headlineWeight}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Body Font</span>
              <p
                style={{ fontFamily: fonts.body, fontWeight: parseInt(fonts.bodyWeight) }}
                className="text-base text-slate-700 truncate"
              >
                {fonts.body}
              </p>
              <span className="text-[10px] font-mono text-slate-500">Weight: {fonts.bodyWeight}</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Style Description */}
      {selectedName.visualDirection?.styleDescription && (
        <div className="mb-5 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Visual Direction</span>
          <p className="text-xs text-slate-700 leading-relaxed">{selectedName.visualDirection.styleDescription}</p>
        </div>
      )}

      {/* Logo Concept Marks Preview */}
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Logo Concept Marks
        </span>
        <div className="grid grid-cols-4 gap-2">
          {['minimal', 'wordmark', 'abstract', 'geometric'].map((style) => (
            <div
              key={style}
              className="aspect-square rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 p-2"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: palette[0]?.hex || '#7C3AED' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 capitalize">{style}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={handleDownloadPDF}
          disabled={isExportingPDF}
          className="flex-1 min-w-[160px] px-5 py-3 rounded-2xl bg-slate-950 hover:bg-brand-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>{isExportingPDF ? 'Generating PDF...' : 'Download PDF Kit'}</span>
        </button>

        <button
          onClick={handleDownloadPNG}
          disabled={isExportingPNG}
          className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs transition-all flex items-center gap-2 shadow-2xs"
        >
          <FileText className="w-4 h-4 text-blue-500" />
          <span>{isExportingPNG ? 'Exporting...' : 'Export PNG'}</span>
        </button>

        <button
          onClick={handleCopyTokens}
          className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs transition-all flex items-center gap-2 shadow-2xs"
        >
          {copiedTokens ? <Check className="w-4 h-4 text-emerald-600" /> : <Code2 className="w-4 h-4 text-coral-500" />}
          <span>{copiedTokens ? 'Tokens Copied!' : 'Copy JSON Tokens'}</span>
        </button>
      </div>
    </div>
  );
};
