import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getPalette } from '../../../lib/palettes';
import { CardShell } from '../CardShell';
import { SwatchStrip } from '../SwatchStrip';
import { Button } from '../../ui/primitives';

/**
 * Step 4 artefact — the applied visual system.
 *
 * Reads the same palette catalogue as the chooser, so what is shown here is
 * always exactly what the user selected. The palette and one type specimen are
 * the whole card; the bordered "headline / body" panels and the copy hint were
 * chrome around four pieces of information.
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
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={openPaletteModal}>
            Change palette
          </Button>
          <Button variant="outline" size="sm" onClick={openLogoModal}>
            Logos
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <span className="text-2xs font-medium text-slate-400">{palette.name}</span>
          <SwatchStrip
            swatches={palette.swatches}
            size="lg"
            showHex
            showName
            copiedHex={copiedHex}
            onCopy={handleCopy}
            className="mt-2"
          />
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-4">
          <p
            className="truncate font-display text-2xl font-black tracking-tight text-slate-900"
            style={{ fontFamily: `'${fonts.headline}', sans-serif` }}
          >
            {selectedName.name}
          </p>
          <p className="text-2xs text-slate-400">
            {fonts.headline} <span className="text-slate-300">·</span> {fonts.body}
          </p>
        </div>
      </div>
    </CardShell>
  );
};
