import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getTaglinesForBrand, type BrandTaglineOption } from '../../../mock/mockData';
import { CardShell } from '../CardShell';
import { Button } from '../../ui/primitives';
import { cn } from '../../../lib/cn';
import { Check, Quote } from 'lucide-react';

/**
 * Step 3, choosing state — strategic tagline options.
 */
export const TaglineSelectionCard: React.FC = () => {
  const { selectedName, input, selectTagline, closeTaglineModal, hasConfirmedTagline } =
    useBrandStore();

  const taglines: BrandTaglineOption[] = getTaglinesForBrand(selectedName.name, input.industry);

  return (
    <CardShell
      id="step-card-tagline"
      step={3}
      variant="choosing"
      status={{ label: 'Choose one', tone: 'warning', dot: true, pulse: true }}
      actions={
        <>
          {hasConfirmedTagline && (
            <Button variant="ghost" size="sm" onClick={closeTaglineModal}>
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => taglines[0] && selectTagline(taglines[0].tagline)}
          >
            Pick first
          </Button>
        </>
      }
      title={`Tagline for ${selectedName.name}`}
      subtitle="Four positioning statements."
    >
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {taglines.map((item) => {
          const isSelected = selectedName.tagline === item.tagline;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => selectTagline(item.tagline)}
                aria-pressed={isSelected}
                className={cn(
                  'flex h-full w-full flex-col gap-2.5 rounded-2xl border p-3.5 text-left transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/20'
                    : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-2xs font-semibold text-slate-600">
                    {item.angle}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0 text-brand-600" />}
                </span>

                <span className="flex items-start gap-1.5">
                  <Quote className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-300" />
                  <span className="font-serif text-sm font-semibold italic leading-snug text-slate-900">
                    {item.tagline}
                  </span>
                </span>

                <span className="text-2xs leading-relaxed text-slate-500">{item.tone}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </CardShell>
  );
};
