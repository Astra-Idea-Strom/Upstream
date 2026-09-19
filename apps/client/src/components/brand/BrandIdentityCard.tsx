import React, { useState, useEffect } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { LogoArtwork } from './LogoArtwork';
import { exportBrandCardToPDF, exportBrandCardToImage } from '../../utils/pdfExport';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  Check,
  Copy,
  Sparkles,
  Printer,
  RotateCcw,
  Palette,
  Type,
  Globe,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export const BrandIdentityCard: React.FC = () => {
  const {
    selectedName,
    input,
    setStep,
    reset,
  } = useBrandStore();

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#FB7185', '#9060FA', '#FBBF24'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!selectedName) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">No brand selected yet.</p>
        <button
          onClick={() => setStep(1)}
          className="mt-4 px-5 py-2.5 rounded-full bg-brand-600 text-white text-xs font-semibold"
        >
          Start New Project
        </button>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      await exportBrandCardToPDF('brand-identity-onepager', selectedName.name);
    } catch (err) {
      console.error(err);
      alert('Could not generate PDF. Please try again.');
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
      colors: selectedName.visualDirection.palette.reduce((acc: any, c) => {
        acc[c.role] = { name: c.name, hex: c.hex };
        return acc;
      }, {}),
      typography: selectedName.visualDirection.fonts,
      domains: selectedName.domainAvailability,
    };

    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    setCopiedTokens(true);
    setTimeout(() => setCopiedTokens(false), 2000);
  };

  return (
    <div className="px-4 sm:px-8 py-10 relative">
      <div className="max-w-5xl mx-auto">
        {/* Step 4 Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>STEP 4 OF 4: BRAND IDENTITY ONE-PAGER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Brand Identity Complete: <span className="text-brand-600">{selectedName.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ready to share with investors, co-founders, and design contractors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Logos</span>
            </button>

            <button
              onClick={handleCopyTokens}
              className="px-4 py-2.5 rounded-full bg-white border border-brand-200 text-brand-800 text-xs font-semibold hover:bg-brand-50 flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copiedTokens ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTokens ? 'Tokens Copied' : 'Copy Tokens JSON'}</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={isExportingPNG}
              className="px-4 py-2.5 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPNG ? 'Saving...' : 'Download PNG'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-coral-500 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPDF ? 'Generating PDF...' : 'Download PDF Guide'}</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PRINTABLE / EXPORTABLE BRAND CARD ONE-PAGER */}
        {/* ============================================================ */}
        <div
          id="brand-identity-onepager"
          className="bg-white rounded-5xl border border-slate-200/90 shadow-2xl p-8 sm:p-12 space-y-8 text-slate-900 relative overflow-hidden"
          style={{ minHeight: '840px' }}
        >
          {/* Subtle watermark / background grid */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-50/80 -mr-20 -mt-20 pointer-events-none" />

          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-8 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  UP
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-brand-700 font-bold">
                  UPSTREAM BRAND SPECIFICATION
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-slate-950"
                style={{ fontFamily: selectedName.visualDirection.fonts.headline }}
              >
                {selectedName.name}
              </h1>
              <p
                className="text-base sm:text-lg font-medium text-brand-700 mt-2 italic"
                style={{ fontFamily: selectedName.visualDirection.fonts.body }}
              >
                "{selectedName.tagline}"
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 font-bold text-[11px] inline-block">
                Tone: {input.tone.toUpperCase()}
              </span>
              <p className="text-slate-500">{input.industry}</p>
              <p className="text-[11px] font-mono text-slate-400">
                Generated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Mission & Concept Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Etymology & Core Concept
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedName.meaning}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Brand Mission & Purpose
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {input.mission}
              </p>
            </div>
          </div>

          {/* Logo Showcase: Light Canvas & Dark Pitch */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Primary Logo Marks (Light & Dark Applications)
              </span>
              <span className="text-[11px] text-slate-400">Vector SVG Architecture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Background Version */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center shadow-xs">
                <LogoArtwork brand={selectedName} style="minimal" variant="light" size="lg" showTagline={true} />
                <span className="text-[10px] font-mono text-slate-400 mt-2 uppercase tracking-wider">
                  Light Canvas Application
                </span>
              </div>

              {/* Dark Background Version */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 flex flex-col items-center justify-center shadow-xs">
                <LogoArtwork brand={selectedName} style="minimal" variant="dark" size="lg" showTagline={true} />
                <span className="text-[10px] font-mono text-slate-400 mt-2 uppercase tracking-wider">
                  Dark Pitch Application
                </span>
              </div>
            </div>
          </div>

          {/* Color Palette Specification */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Official 5-Color Chromatic Palette
              </span>
              <span className="text-[11px] text-slate-400">Hexadecimal Specifications</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {selectedName.visualDirection.palette.map((color, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 p-3 flex flex-col justify-between bg-white"
                >
                  <div
                    className="w-full h-16 rounded-2xl shadow-inner mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block truncate">
                      {color.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">
                      {color.hex}
                    </span>
                    <span className="text-[9px] font-bold text-brand-600 uppercase tracking-wider block mt-0.5">
                      {color.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Hierarchy */}
          <div className="space-y-3 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Typography System
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl border border-slate-200 bg-slate-50/70">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Headline Font: {selectedName.visualDirection.fonts.headline} (Weight {selectedName.visualDirection.fonts.headlineWeight})
                </span>
                <p
                  className="text-xl font-bold text-slate-900"
                  style={{ fontFamily: selectedName.visualDirection.fonts.headline }}
                >
                  Aa Bb Cc Dd Ee Ff Gg 0123456789
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Used for hero headers, packaging titles, billboards, and high-impact identity assets.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Body Font: {selectedName.visualDirection.fonts.body} (Weight {selectedName.visualDirection.fonts.bodyWeight})
                </span>
                <p
                  className="text-sm text-slate-800"
                  style={{ fontFamily: selectedName.visualDirection.fonts.body }}
                >
                  Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj 0123456789
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Used for web body copy, digital interfaces, editorial descriptions, and investor notes.
                </p>
              </div>
            </div>
          </div>

          {/* Domain & Social Availability Certification */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-900">Digital Registry:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-semibold border border-emerald-200">
                .com: {selectedName.domainAvailability.com ? 'AVAILABLE' : 'TAKEN'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-semibold border border-emerald-200">
                .io: {selectedName.domainAvailability.io ? 'AVAILABLE' : 'TAKEN'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                X/Twitter: @{selectedName.name.toLowerCase()}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                Instagram: @{selectedName.name.toLowerCase()}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Certified by UPSTREAM AI Studio
            </div>
          </div>
        </div>

        {/* Bottom Reset / Start Another Brand Button */}
        <div className="mt-8 text-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Generate Another Brand Identity</span>
          </button>
        </div>
      </div>
    </div>
  );
};
