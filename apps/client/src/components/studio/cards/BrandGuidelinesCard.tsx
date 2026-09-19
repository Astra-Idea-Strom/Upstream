import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { exportBrandCardToPDF } from '../../../utils/pdfExport';
import {
  FileText,
  Download,
  Check,
  X,
  Copy,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper to calculate approximate RGB from Hex
function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

// Helper to calculate approximate CMYK from RGB
function hexToCmyk(hex: string) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const k = Math.min(1 - r, 1 - g, 1 - b);
  if (k === 1) return '0, 0, 0, 100';
  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);
  return `${c}, ${m}, ${y}, ${Math.round(k * 100)}`;
}

export const BrandGuidelinesCard: React.FC = () => {
  const { selectedName, selectedLogoStyle, input } = useBrandStore();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const headlineFont = selectedName.visualDirection?.fonts?.headline || 'Outfit';
  const bodyFont = selectedName.visualDirection?.fonts?.body || 'Inter';
  const palette = selectedName.visualDirection?.palette || [];

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      await exportBrandCardToPDF('brand-guidelines-manual', `${selectedName.name}-Brand-Guidelines`);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      console.error(err);
      alert('Could not export Brand Guidelines PDF.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleCopyMarkdown = () => {
    const md = `# ${selectedName.name} — Brand Identity Guidelines v1.0
Industry: ${input.industry}
Tagline: "${selectedName.tagline}"
Mission: ${input.mission}

## 1. Tone of Voice
- Authoritative, but approachable.
- Purposeful, not verbose.
- Tactile and craft-led.

## 2. Color Palette
${palette.map((s) => `- ${s.name}: ${s.hex} | RGB: (${hexToRgb(s.hex)}) | CMYK: (${hexToCmyk(s.hex)})`).join('\n')}

## 3. Typography
- Headline: ${headlineFont}
- Body: ${bodyFont}

## 4. Logo Usage
- Minimum Clearspace: Equal to the height of the symbol 'x'.
- Minimum Digital Size: 32px.
- Never stretch, skew, rotate, or alter colors.
`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div
      id="brand-guidelines-manual"
      className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Founder Reference Manual
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              v1.0 Standard
            </span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Brand Guidelines & Style Guide
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Architectural rules for logo usage, color fidelity, typography, and tone of voice.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied MD' : 'Copy MD'}</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPDF ? 'Generating...' : 'Download PDF Manual'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LOGO SYSTEM & CLEARSPACE */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono block">
          01. Logo Clearspace & Reproduction
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Clearspace Diagram Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
            <div className="relative p-6 border-2 border-dashed border-slate-300 rounded-xl bg-white shadow-2xs">
              <span className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">x margin</span>
              <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">x margin</span>
              <div className="w-20 h-20 flex items-center justify-center">
                <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="light" size="sm" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs font-normal">
              Always isolate the mark with a minimum clearspace equal to the logo height (<strong className="font-mono">x</strong>).
            </p>
          </div>

          {/* Do's & Don'ts Rules */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="font-bold block text-emerald-900">Permitted Usage:</strong>
                Use official vector assets on high-contrast backgrounds; preserve proportional bounding box.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-950 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="font-bold block text-rose-900">Misuse & Don'ts:</strong>
                Do not stretch or distort aspect ratio. Do not rotate or replace official color swatches with random tints.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: COLOR SPECIFICATIONS TABLE */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono block">
          02. Chromatic Production Specifications (RGB / CMYK / HEX)
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                <th className="py-2 px-3">Swatch</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3 font-mono">HEX</th>
                <th className="py-2 px-3 font-mono">RGB (Web)</th>
                <th className="py-2 px-3 font-mono">CMYK (Print)</th>
                <th className="py-2 px-3">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {palette.map((swatch, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <div
                      className="w-5 h-5 rounded-md border border-black/10 shadow-2xs"
                      style={{ backgroundColor: swatch.hex }}
                    />
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{swatch.name}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{swatch.hex}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{hexToRgb(swatch.hex)}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{hexToCmyk(swatch.hex)}</td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {idx === 0 ? '60% Dominant' : idx === 1 ? '30% Secondary' : '10% Accent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: TYPOGRAPHY & TONE OF VOICE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono block">
            03. Typography Standards
          </span>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Primary Headline Font
              </span>
              <p style={{ fontFamily: headlineFont }} className="text-xl font-bold text-slate-900 mt-0.5">
                {headlineFont}
              </p>
              <span className="text-[11px] text-slate-500">Use for titles, wordmarks, and hero headers.</span>
            </div>
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Secondary Body Copy
              </span>
              <p style={{ fontFamily: bodyFont }} className="text-sm font-medium text-slate-800 mt-0.5">
                {bodyFont}
              </p>
              <span className="text-[11px] text-slate-500">Use for paragraphs, interfaces, and print documentation.</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono block">
            04. Tone of Voice Matrix
          </span>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">• Authoritative:</span>
              <span className="text-slate-600">Rooted in craft and category expertise; never frivolous.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">• Approaching:</span>
              <span className="text-slate-600">Warm and user-centric; avoiding cold corporate jargon.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">• Precise:</span>
              <span className="text-slate-600">Every word serves a deliberate positioning purpose.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
