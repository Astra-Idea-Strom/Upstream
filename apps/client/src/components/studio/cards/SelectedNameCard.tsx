import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { CardShell } from '../CardShell';
import { DomainChip } from '../DomainChip';
import { Button } from '../../ui/primitives';

/**
 * Step 2 artefact — the locked brand name, with the availability checks that
 * justify it.
 *
 * The name is the headline; the tagline sits directly beneath it. Domain and
 * handle availability share one chip row rather than two bordered panels with
 * uppercase labels.
 */
export const SelectedNameCard: React.FC = () => {
  const { selectedName, openNameModal, openTaglineModal, openPaletteModal } = useBrandStore();

  if (!selectedName) return null;

  const { domainAvailability: domains } = selectedName;

  return (
    <CardShell
      id="step-card-name"
      step={2}
      variant="confirmed"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={openNameModal}>
            Change name
          </Button>
          <Button variant="outline" size="sm" onClick={openPaletteModal}>
            Palette
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-2xl font-black tracking-tight text-slate-950">
            {selectedName.name}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="font-serif text-sm italic text-brand-700">“{selectedName.tagline}”</p>
            <Button variant="ghost" size="xs" onClick={openTaglineModal}>
              Change tagline
            </Button>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">{selectedName.meaning}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <DomainChip label=".com" available={domains.com} />
          <DomainChip label=".io" available={domains.io} />
          <DomainChip label=".co" available={domains.co} />
          <span aria-hidden="true" className="mx-0.5 h-3 w-px bg-slate-200" />
          <DomainChip label="Twitter" available={domains.handle.twitter} />
          <DomainChip label="Instagram" available={domains.handle.instagram} />
        </div>
      </div>
    </CardShell>
  );
};
