import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { CardShell } from '../CardShell';
import { Button } from '../../ui/primitives';
import { DomainChip } from '../DomainChip';
import { exportBrandCardToPDF, exportBrandCardToImage } from '../../../utils/pdfExport';
import { KIT_CARD_ID } from '../../../lib/dom';
import confetti from 'canvas-confetti';
import { Check, Code2, Download, FileText, RotateCcw } from 'lucide-react';

/**
 * Step 5 artefact — the exportable brand specification.
 *
 * Carries `KIT_CARD_ID` because it is also the DOM capture target for the PDF
 * and PNG exporters, so the element id must stay stable.
 */
export const BrandKitExportCard: React.FC = () => {
  const { selectedName, input, reset } = useBrandStore();
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
  const [copiedTokens, setCopiedTokens] = useState(false);

  const celebrate = () => {
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      /* canvas unavailable — purely decorative */
    }
  };

  const handleDownloadPDF = async () => {
    setExporting('pdf');
    try {
      await exportBrandCardToPDF(KIT_CARD_ID, selectedName.name);
      celebrate();
    } catch (error) {
      console.error(error);
      window.alert('Could not export the PDF. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleDownloadPNG = async () => {
    setExporting('png');
    try {
      await exportBrandCardToImage(KIT_CARD_ID, selectedName.name);
    } catch (error) {
      console.error(error);
      window.alert('Could not export the image. Please try again.');
    } finally {
      setExporting(null);
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
    navigator.clipboard?.writeText(JSON.stringify(tokens, null, 2)).catch(() => undefined);
    setCopiedTokens(true);
    window.setTimeout(() => setCopiedTokens(false), 2000);
  };

  return (
    <CardShell
      id={KIT_CARD_ID}
      step={5}
      variant="confirmed"
      className="border-brand-200 bg-gradient-to-br from-white via-brand-50/40 to-coral-50/30"
      status={{ label: 'Ready to export', tone: 'brand', dot: true }}
      actions={
        <Button
          variant="ghost"
          size="sm"
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          onClick={reset}
        >
          New project
        </Button>
      }
      title="Brand specification"
      subtitle="Every decision from this session, compiled and ready to share."
    >
      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-2.5">
            <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">Name</dt>
            <dd className="mt-0.5 truncate font-display text-sm font-bold text-slate-900">
              {selectedName.name}
            </dd>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-2.5">
            <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">Industry</dt>
            <dd className="mt-0.5 truncate text-xs font-semibold text-slate-700">
              {input.industry}
            </dd>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-2.5">
            <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">Domains</dt>
            <dd className="mt-1 flex flex-wrap gap-1">
              <DomainChip label=".com" available={selectedName.domainAvailability.com} />
              <DomainChip label=".io" available={selectedName.domainAvailability.io} />
            </dd>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white/90 p-2.5">
            <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">Status</dt>
            <dd className="mt-0.5 text-xs font-semibold text-brand-700">Ready for launch</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="lg"
            className="min-w-[10rem] flex-1"
            loading={exporting === 'pdf'}
            icon={<Download className="h-4 w-4" />}
            onClick={handleDownloadPDF}
          >
            {exporting === 'pdf' ? 'Generating PDF…' : 'Download PDF kit'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            loading={exporting === 'png'}
            icon={<FileText className="h-4 w-4 text-blue-500" />}
            onClick={handleDownloadPNG}
          >
            {exporting === 'png' ? 'Exporting…' : 'Export PNG'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={
              copiedTokens ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Code2 className="h-4 w-4 text-coral-500" />
              )
            }
            onClick={handleCopyTokens}
          >
            {copiedTokens ? 'Tokens copied' : 'Copy JSON tokens'}
          </Button>
        </div>
      </div>
    </CardShell>
  );
};
