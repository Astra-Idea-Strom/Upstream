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
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrandKitExportCard: React.FC = () => {
  const { selectedName, input, reset } = useBrandStore();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState(false);

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
      className="bg-gradient-to-br from-white via-brand-50/30 to-purple-50/40 rounded-3xl border-2 border-brand-300/80 p-6 sm:p-8 shadow-md relative overflow-hidden transition-all animate-in fade-in duration-300"
    >
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-brand-300/20 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/80 relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>CARD 5: COMPLETE BRAND IDENTITY SPEC</span>
          </span>
          <h3 className="text-xl font-display font-black text-slate-950 tracking-tight">
            Investor-Ready Brand Specification
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your venture identity has been synthesized, harmonized, and verified.
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 relative z-10">
        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Brand Name</span>
          <strong className="text-sm text-slate-900 font-display font-black truncate block mt-0.5">
            {selectedName.name}
          </strong>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Industry</span>
          <strong className="text-xs text-slate-800 font-bold truncate block mt-0.5">
            {input.industry}
          </strong>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Domains</span>
          <strong className="text-xs text-emerald-700 font-bold font-mono block mt-0.5">
            {selectedName.domainAvailability.com ? '.com ready' : '.io ready'}
          </strong>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Status</span>
          <strong className="text-xs text-brand-700 font-bold block mt-0.5">
            Ready for Launch
          </strong>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
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
