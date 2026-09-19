import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { FlowProgress, StudioStep } from '../../lib/steps';

export interface StepRailProps {
  /** Progress derived from `useFlowProgress()` — the single source of truth. */
  progress: FlowProgress;
  className?: string;
  /** Hide the text labels and show numbers/checks only. */
  compact?: boolean;
  /**
   * When provided, completed steps become buttons so the user can navigate
   * back to an earlier artefact without restarting the session.
   */
  onSelect?: (step: StudioStep) => void;
}

/**
 * The studio's persistent progress rail.
 *
 * This is the only place the flow's position is expressed. It reads the
 * canonical step list from `lib/steps` and the canonical statuses from
 * `useFlowProgress`, so the rail can never drift from the cards below it.
 */
export const StepRail: React.FC<StepRailProps> = ({
  progress,
  className,
  compact = false,
  onSelect,
}) => (
  <ol className={cn('flex items-center', compact ? 'gap-0.5' : 'gap-1', className)}>
    {progress.steps.map(({ step, status }, index) => {
      const isDone = status === 'done';
      const isActive = status === 'active';
      const isReachable = Boolean(onSelect) && isDone;

      const marker = (
        <span
          className={cn(
            'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
            'text-3xs font-bold transition-colors duration-200',
            isDone && 'bg-emerald-500 text-white',
            isActive && 'bg-brand-600 text-white ring-4 ring-brand-500/15',
            status === 'upcoming' && 'border border-slate-200 bg-white text-slate-400',
          )}
        >
          {isDone ? <Check className="h-3 w-3" strokeWidth={3} /> : step.id}
        </span>
      );

      const label = !compact && (
        <span
          className={cn(
            'hidden whitespace-nowrap text-2xs lg:inline',
            isDone && 'font-medium text-slate-500',
            isActive && 'font-bold text-brand-700',
            status === 'upcoming' && 'font-medium text-slate-400',
          )}
        >
          {step.label}
        </span>
      );

      return (
        <li key={step.key} className="flex items-center">
          {index > 0 && (
            <span
              aria-hidden="true"
              className={cn(
                'mx-1 h-px w-2 flex-shrink-0 sm:w-3',
                progress.steps[index - 1].status === 'done' ? 'bg-emerald-300' : 'bg-slate-200',
              )}
            />
          )}

          {isReachable ? (
            <button
              type="button"
              onClick={() => onSelect?.(step)}
              title={`Go to ${step.title}`}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-1.5',
                'transition-colors hover:bg-slate-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
              )}
            >
              {marker}
              {label}
            </button>
          ) : (
            <span
              className="flex items-center gap-1.5 py-0.5 pl-0.5 pr-1.5"
              title={`Step ${step.id} · ${step.title}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {marker}
              {label}
            </span>
          )}
        </li>
      );
    })}
  </ol>
);
