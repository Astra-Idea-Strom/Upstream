import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { CardShell } from '../CardShell';
import { DomainChip } from '../DomainChip';
import { Button } from '../../ui/primitives';
import { Palette, RefreshCw } from 'lucide-react';

/**
 * Step 2 artefact — the locked brand name, with the identity checks that
 * justify it.
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
      status={{ label: 'Selected', tone: 'success', dot: true }}
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="h-3.5 w-3.5 text-slate-400" />}
            onClick={openNameModal}
          >
            Change name
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Palette className="h-3.5 w-3.5" />}
            onClick={openPaletteModal}
          >
            Palette
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="font-display text-2xl font-black tracking-tight text-slate-950">
              {selectedName.name}
            </h3>
            <span className="rounded-md border border-brand-100 bg-brand-50 px-1.5 py-0.5 font-mono text-2xs font-bold text-brand-700">
              verified
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="font-serif text-sm italic text-brand-700">“{selectedName.tagline}”</p>
            <Button variant="ghost" size="xs" onClick={openTaglineModal}>
              Change tagline
            </Button>
          </div>
        </div>

        <p className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-600">
          <span className="font-semibold text-slate-800">Concept &amp; meaning · </span>
          {selectedName.meaning}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Domain availability
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <DomainChip label=".com" available={domains.com} />
              <DomainChip label=".io" available={domains.io} />
              <DomainChip label=".co" available={domains.co} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Social handles
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <DomainChip label="Twitter" available={domains.handle.twitter} />
              <DomainChip label="Instagram" available={domains.handle.instagram} />
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
