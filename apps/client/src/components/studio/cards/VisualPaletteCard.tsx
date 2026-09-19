import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getPalette } from '../../../lib/palettes';
import { CardShell } from '../CardShell';
import { SwatchStrip } from '../SwatchStrip';
import { Button } from '../../ui/primitives';
import { Type, RefreshCw, WandSparkles } from 'lucide-react';

/**
 * Step 4 artefact — the applied visual system.
 *
 * Reads the same palette catalogue as the chooser, so what is shown here is
 * always exactly what the user selected.
 */
export const VisualPaletteCard: React.FC = () => {
  const { selectedName, activePaletteIdx, openPaletteModal, openLogoModal } = useBrandStore();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const palette = getPalette(activePaletteIdx);
  const { fonts } = palette;

  const handleCopy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => undefined);
    setCopiedHex(hex);
    window.setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <CardShell
      id="step-card-visual"
      step={4}
      variant="confirmed"
      status={{ label: 'Applied', tone: 'success', dot: true }}
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="h-3.5 w-3.5 text-slate-400" />}
            onClick={openPaletteModal}
          >
            Change palette
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<WandSparkles className="h-3.5 w-3.5" />}
            onClick={openLogoModal}
          >
            Logos
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              {palette.name}
            </span>
            <span className="text-2xs text-slate-400">Select a swatch to copy its hex</span>
          </div>

          <SwatchStrip
            swatches={palette.swatches}
            size="lg"
            showHex
            showName
            copiedHex={copiedHex}
            onCopy={handleCopy}
          />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-slate-400">
            <Type className="h-3 w-3" />
            Type pairing
          </span>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
                Headline · {fonts.headline}
              </span>
              <p
                className="mt-1 truncate text-base font-bold text-slate-900"
                style={{ fontFamily: `'${fonts.headline}', sans-serif` }}
              >
                {selectedName.name} Identity
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
                Body · {fonts.body}
              </span>
              <p
                className="mt-1 text-xs leading-relaxed text-slate-600"
                style={{ fontFamily: `'${fonts.body}', serif` }}
              >
                Crafting meaningful modern impressions across every touchpoint.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
