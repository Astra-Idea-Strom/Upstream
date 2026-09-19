import React, { useEffect, useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { CardShell } from '../CardShell';
import { Button } from '../../ui/primitives';
import { DomainChip } from '../DomainChip';
import { exportBrandCardToPDF, exportBrandCardToImage } from '../../../utils/pdfExport';
import { KIT_CARD_ID } from '../../../lib/dom';
import { useArmedAction } from '../../../hooks/useArmedAction';
import confetti from 'canvas-confetti';
import { Check, Code2, Download, FileText, RotateCcw } from 'lucide-react';

/**
 * Step 5 artefact — the exportable brand specification.
 *
 * Carries `KIT_CARD_ID` because it is also the DOM capture target for the PDF
 * and PNG exporters, so the element id must stay stable. Its body is the
 * document that gets exported, which is why the summary stays — but as plain
 * lines rather than a four-cell boxed grid.
 */
export const BrandKitExportCard: React.FC = () => {
  const { selectedName, input, reset } = useBrandStore();
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
  const [copiedTokens, setCopiedTokens] = useState(false);

  /** Discards the finished session, so it confirms the same way the top bar does. */
  const newProject = useArmedAction(reset);

  const celebrate = () => {
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      /* canvas unavailable — purely decorative */
    }
  };

  /**
   * The terminal artefact mounts exactly once per session, when the identity is
   * finished. That makes this the single correct place for the celebration:
   * the manual and autonomous paths both land here.
   */
  useEffect(() => {
    celebrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      title="Brand specification"
      actions={
        newProject.isArmed ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={newProject.confirm}
            onBlur={newProject.disarm}
            className="border border-coral-300 bg-coral-50 text-coral-700 hover:bg-coral-100"
          >
            Discard and start over?
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={newProject.arm}
          >
            New project
          </Button>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-2xl font-black tracking-tight text-slate-950">
            {selectedName.name}
          </h3>
          <p className="mt-0.5 font-serif text-sm italic text-brand-700">
            “{selectedName.tagline}”
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-2xs">
          <span className="flex items-baseline gap-1.5">
            <span className="text-slate-400">Industry</span>
            <span className="font-medium text-slate-700">{input.industry}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <span className="text-slate-400">Domains</span>
            <DomainChip label=".com" available={selectedName.domainAvailability.com} />
            <DomainChip label=".io" available={selectedName.domainAvailability.io} />
            <DomainChip label=".co" available={selectedName.domainAvailability.co} />
          </span>
        </div>

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
            icon={<FileText className="h-4 w-4" />}
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
                <Code2 className="h-4 w-4" />
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
