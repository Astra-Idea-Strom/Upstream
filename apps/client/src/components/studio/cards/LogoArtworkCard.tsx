import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { CardShell } from '../CardShell';
import { Button, SegmentedControl } from '../../ui/primitives';
import { KIT_CARD_ID, scrollToId } from '../../../lib/dom';
import { cn } from '../../../lib/cn';
import type { LogoStyle } from '@upstream/shared';
import { CreditCard, Download, Image as ImageIcon, Smartphone } from 'lucide-react';

const STYLE_LABELS: Record<LogoStyle, { label: string; desc: string }> = {
  minimal: { label: 'Minimalist Glyph', desc: 'Continuous-line monogram' },
  wordmark: { label: 'Modern Wordmark', desc: 'Architectural typography' },
  abstract: { label: 'Abstract Prism', desc: 'Faceted multifaceted mark' },
  geometric: { label: 'Geometric Crest', desc: 'Golden-ratio balanced badge' },
  illustrative: { label: 'Illustrative Emblem', desc: 'Organic sculptural symbol' },
};

type PreviewSurface = 'light' | 'dark' | 'brand';
type MockupTab = 'icon' | 'card' | 'banner';

/**
 * Step 5 artefact — the locked logo mark, previewed on real surfaces.
 *
 * The mark itself is the content: one large preview, its style name, and two
 * compact switches. Every control is self-labelling, so the uppercase section
 * headers around them were removed.
 */
export const LogoArtworkCard: React.FC = () => {
  const { selectedName, selectedLogoStyle, openLogoModal } = useBrandStore();
  const [surface, setSurface] = useState<PreviewSurface>('light');
  const [mockup, setMockup] = useState<MockupTab>('icon');

  const info = STYLE_LABELS[selectedLogoStyle] ?? STYLE_LABELS.minimal;

  return (
    <CardShell
      id="step-card-logo"
      step={5}
      variant="confirmed"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={openLogoModal}>
            Change style
          </Button>
          <Button
            variant="brand"
            size="sm"
            icon={<Download className="h-3.5 w-3.5" />}
            onClick={() => scrollToId(KIT_CARD_ID)}
          >
            Export kit
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div
            className={cn(
              'flex h-40 w-full flex-shrink-0 items-center justify-center rounded-2xl border p-6 shadow-inner transition-colors duration-300 sm:w-44',
              surface === 'dark' && 'border-slate-800 bg-slate-950 text-white',
              surface === 'brand' && 'border-transparent bg-gradient-to-br from-brand-600 to-coral-500 text-white',
              surface === 'light' && 'border-slate-200/80 bg-slate-50 text-slate-900',
            )}
          >
            <LogoArtwork
              brand={selectedName}
              style={selectedLogoStyle}
              variant={surface === 'brand' ? 'color' : surface}
              size="md"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h4 className="font-display text-base font-bold text-slate-900">{info.label}</h4>
              <p className="mt-0.5 text-xs text-slate-500">{info.desc}</p>
            </div>

            <SegmentedControl<PreviewSurface>
              aria-label="Logo preview surface"
              value={surface}
              onChange={setSurface}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'brand', label: 'Brand' },
              ]}
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-2xs font-medium text-slate-400">Mockups</span>

            <SegmentedControl<MockupTab>
              aria-label="Touchpoint mockup"
              value={mockup}
              onChange={setMockup}
              options={[
                { value: 'icon', label: <Smartphone className="h-3 w-3" /> },
                { value: 'card', label: <CreditCard className="h-3 w-3" /> },
                { value: 'banner', label: <ImageIcon className="h-3 w-3" /> },
              ]}
            />
          </div>

          <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            {mockup === 'icon' && (
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-2 text-white shadow-lg">
                <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="dark" size="sm" />
              </div>
            )}

            {mockup === 'card' && (
              <div className="flex h-36 w-64 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
                <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="light" size="sm" />
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{selectedName.name}</h5>
                  <p className="text-2xs italic text-slate-400">{selectedName.tagline}</p>
                </div>
              </div>
            )}

            {mockup === 'banner' && (
              <div className="flex h-24 w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 p-3 text-white">
                <div>
                  <h5 className="text-lg font-black tracking-tight">{selectedName.name}</h5>
                  <p className="text-xs text-brand-200">{selectedName.tagline}</p>
                </div>
                <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="dark" size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </CardShell>
  );
};
