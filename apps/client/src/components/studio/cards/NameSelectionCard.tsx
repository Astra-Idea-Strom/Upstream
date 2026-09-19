import React from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { CardShell } from '../CardShell';
import { DomainChip } from '../DomainChip';
import { Button } from '../../ui/primitives';
import { cn } from '../../../lib/cn';
import { ArrowRight, Check, RefreshCw } from 'lucide-react';

/**
 * Step 2, choosing state — the five candidate names.
 */
export const NameSelectionCard: React.FC = () => {
  const {
    brandNames,
    selectedName,
    selectName,
    closeNameModal,
    hasConfirmedName,
    regenerateNames,
    isLoadingNames,
  } = useBrandStore();

  const displayedNames = brandNames.slice(0, 5);

  return (
    <CardShell
      id="step-card-name"
      step={2}
      variant="choosing"
      status={{ label: 'Choose one', tone: 'warning', dot: true, pulse: true }}
      actions={
        <>
          {hasConfirmedName && (
            <Button variant="ghost" size="sm" onClick={closeNameModal}>
              Cancel
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className={cn('h-3.5 w-3.5', isLoadingNames && 'animate-spin')} />}
            onClick={regenerateNames}
            disabled={isLoadingNames}
          >
            Regenerate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => displayedNames[0] && selectName(displayedNames[0])}
          >
            Pick first
          </Button>
        </>
      }
      title="Choose a brand name"
      subtitle="Five candidates with domain availability."
    >
      <ul className="space-y-2">
        {displayedNames.map((brand, index) => {
          const isSelected = selectedName?.id === brand.id;

          return (
            <li key={brand.id}>
              <button
                type="button"
                onClick={() => selectName(brand)}
                aria-pressed={isSelected}
                className={cn(
                  'group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors sm:p-3.5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/20'
                    : 'border-slate-200/90 bg-white hover:border-brand-300 hover:bg-slate-50/70',
                )}
              >
                <span
                  className={cn(
                    'mt-px flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-3xs font-bold',
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-500 group-hover:border-brand-300 group-hover:text-brand-700',
                  )}
                >
                  {isSelected ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-display text-base font-bold tracking-tight text-slate-900">
                      {brand.name}
                    </span>
                    <span className="font-serif text-xs italic text-brand-700">
                      “{brand.tagline}”
                    </span>
                  </span>

                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {brand.meaning}
                  </span>

                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <DomainChip label=".com" available={brand.domainAvailability.com} />
                    <DomainChip label=".io" available={brand.domainAvailability.io} />
                    <DomainChip label=".co" available={brand.domainAvailability.co} />
                  </span>
                </span>

                <span
                  className={cn(
                    'mt-0.5 hidden flex-shrink-0 items-center gap-1 text-2xs font-bold sm:flex',
                    isSelected ? 'text-brand-700' : 'text-slate-400 group-hover:text-brand-700',
                  )}
                >
                  {isSelected ? 'Selected' : 'Select'}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </CardShell>
  );
};
