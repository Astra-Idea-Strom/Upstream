import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { CardShell } from '../CardShell';
import { Button } from '../../ui/primitives';
import { KIT_CARD_ID, scrollToId } from '../../../lib/dom';
import type { LogoStyle } from '@upstream/shared';
import { Download } from 'lucide-react';

const STYLE_LABELS: Record<LogoStyle, { label: string; desc: string }> = {
  minimal: { label: 'Minimalist Glyph', desc: 'Continuous-line monogram' },
  wordmark: { label: 'Modern Wordmark', desc: 'Architectural typography' },
  abstract: { label: 'Abstract Prism', desc: 'Faceted multifaceted mark' },
  geometric: { label: 'Geometric Crest', desc: 'Golden-ratio balanced badge' },
  illustrative: { label: 'Illustrative Emblem', desc: 'Organic sculptural symbol' },
};

/**
 * The three surfaces the mark is checked against, shown together.
 *
 * A Light/Dark/Brand switcher made the user do the work of discovering the mark
 * was legible on all three; showing the set at once is both denser and more
 * informative, which is the point of a brand sheet.
 */
const SURFACES = [
  { id: 'light', label: 'Light', tile: 'border-slate-200/90 bg-white text-slate-900' },
  { id: 'dark', label: 'Dark', tile: 'border-slate-800 bg-slate-950 text-white' },
  {
    id: 'brand',
    label: 'Brand',
    tile: 'border-transparent bg-gradient-to-br from-brand-600 to-coral-500 text-white',
  },
] as const;

/**
 * Step 5 artefact — the locked mark, shown across surfaces and applications.
 *
 * Rebuilt because the previous version nested a self-backgrounded, fixed-size
 * `LogoArtwork` inside padded rounded tiles. That produced two artifacts at
 * once: a double-card edge where the artwork's own white box sat inside the
 * tile, and a wordmark clipped by the tile's fixed height. The artwork now has a
 * transparent `none` variant, so each tile owns its surface and the mark simply
 * sits on it.
 */
export const LogoArtworkCard: React.FC = () => {
  const { selectedName, selectedLogoStyle, openLogoModal, logoImageByStyle, selectedLogo } =
    useBrandStore();
  const info = STYLE_LABELS[selectedLogoStyle] ?? STYLE_LABELS.minimal;

  // Every surface in this card shows the real generated mark when one exists,
  // so the confirmed artefact is the artwork the agent actually produced.
  const mark = {
    brand: selectedName,
    style: selectedLogoStyle,
    imageUrl: logoImageByStyle[selectedLogoStyle] || selectedLogo?.url,
  } as const;

  return (
    <CardShell
      id="step-card-logo"
      step={5}
      variant="confirmed"
      title={info.label}
      subtitle={info.desc}
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
      <div className="space-y-5">
        {/* ---------------------------------------------------------------- */}
        {/* On surface                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <h4 className="text-2xs font-bold uppercase tracking-wider text-slate-400">
            On surface
          </h4>

          <ul className="mt-2.5 grid grid-cols-3 gap-3">
            {SURFACES.map((surface) => (
              <li key={surface.id}>
                <figure className="space-y-2">
                  <div
                    className={`grid min-h-[184px] place-items-center rounded-2xl border shadow-2xs ${surface.tile}`}
                  >
                    <LogoArtwork {...mark} variant="none" size="md" />
                  </div>
                  <figcaption className="text-center text-2xs font-semibold text-slate-500">
                    {surface.label}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* In use                                                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-slate-100 pt-5">
          <h4 className="text-2xs font-bold uppercase tracking-wider text-slate-400">In use</h4>

          <ul className="mt-2.5 grid grid-cols-3 gap-3">
            {/* App icon — glyph only, no wordmark, as a real icon would be. */}
            <li>
              <figure className="space-y-2">
                <div className="grid h-[152px] place-items-center rounded-2xl border border-slate-200/90 bg-slate-50">
                  <div className="grid h-[104px] w-[104px] place-items-center rounded-[1.75rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
                    <LogoArtwork {...mark} variant="none" size="sm" showName={false} />
                  </div>
                </div>
                <figcaption className="text-center text-2xs font-semibold text-slate-500">
                  App icon
                </figcaption>
              </figure>
            </li>

            {/* Business card — mark, then the lockup set as text. */}
            <li>
              <figure className="space-y-2">
                <div className="grid h-[152px] place-items-center rounded-2xl border border-slate-200/90 bg-slate-50 p-3">
                  <div className="flex h-full w-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xs">
                    {/* `self-start` keeps the mark left-aligned without
                        collapsing the text block, which needs full width for
                        its truncation to bite. */}
                    <div className="self-start">
                      <LogoArtwork {...mark} variant="none" size="sm" showName={false} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-xs font-bold text-slate-900">
                        {selectedName.name}
                      </p>
                      <p className="mt-0.5 truncate text-3xs italic text-slate-400">
                        {selectedName.tagline}
                      </p>
                    </div>
                  </div>
                </div>
                <figcaption className="text-center text-2xs font-semibold text-slate-500">
                  Business card
                </figcaption>
              </figure>
            </li>

            {/* Cover — the lockup on the brand gradient. */}
            <li>
              <figure className="space-y-2">
                <div className="grid h-[152px] place-items-center rounded-2xl border border-slate-200/90 bg-slate-50 p-3">
                  <div className="flex h-full w-full items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-brand-700 via-brand-600 to-coral-500 p-3 text-white shadow-md">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-black leading-tight tracking-tight">
                        {selectedName.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-3xs leading-snug text-white/80">
                        {selectedName.tagline}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <LogoArtwork {...mark} variant="none" size="sm" showName={false} />
                    </div>
                  </div>
                </div>
                <figcaption className="text-center text-2xs font-semibold text-slate-500">
                  Cover
                </figcaption>
              </figure>
            </li>
          </ul>
        </section>
      </div>
    </CardShell>
  );
};
