import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getTaglinesForBrand } from '../../../mock/mockData';
import { CardShell } from '../CardShell';
import { Button } from '../../ui/primitives';

/**
 * Confirmed tagline artefact.
 *
 * The quote carries the card; the positioning angle is a single muted line
 * beneath it. The long "what this evokes" description was an explanation of the
 * explanation, so it is gone.
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
      actions={
        <Button variant="secondary" size="sm" onClick={openTaglineModal}>
          Change tagline
        </Button>
      }
    >
      <figure>
        <blockquote className="font-serif text-xl italic leading-snug text-slate-900">
          “{selectedName.tagline}”
        </blockquote>
        {active && (
          <figcaption className="mt-2 text-2xs font-medium text-slate-400">
            {active.angle}
          </figcaption>
        )}
      </figure>
    </CardShell>
  );
};
