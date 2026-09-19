import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getTaglinesForBrand } from '../../../mock/mockData';
import { CardShell } from '../CardShell';
import { Button } from '../../ui/primitives';
import { RefreshCw } from 'lucide-react';

/**
 * Confirmed tagline artefact.
 *
 * Step 3 previously had no settled card: the selection card vanished once a
 * tagline was picked and the tagline only survived inside the name card, so the
 * canvas appeared to skip a step. This is the missing artefact.
 */
export const TaglineCard: React.FC = () => {
  const { selectedName, input, openTaglineModal } = useBrandStore();

  const options = getTaglinesForBrand(selectedName.name, input.industry);
  const active = options.find((option) => option.tagline === selectedName.tagline);

  return (
    <CardShell
      id="step-card-tagline"
      step={3}
      variant="confirmed"
      status={{ label: 'Locked', tone: 'success', dot: true }}
      actions={
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="h-3.5 w-3.5 text-slate-400" />}
          onClick={openTaglineModal}
        >
          Change tagline
        </Button>
      }
    >
      <figure className="border-l-2 border-brand-200 pl-4">
        <blockquote className="font-serif text-lg italic leading-snug text-slate-900">
          “{selectedName.tagline}”
        </blockquote>
        <figcaption className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs text-slate-500">
          {active && (
            <>
              <span className="font-bold uppercase tracking-wider text-slate-600">
                {active.angle}
              </span>
              <span className="text-slate-300">·</span>
            </>
          )}
          <span>{active?.tone ?? 'Positioning statement'}</span>
        </figcaption>
      </figure>
    </CardShell>
  );
};
