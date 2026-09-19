import React from 'react';
import { cn } from '../../lib/cn';
import { StatusPill, type StatusTone } from '../ui/primitives';
import { getStep, type StudioStep } from '../../lib/steps';

/* -------------------------------------------------------------------------- */
/* StepBadge                                                                   */
/* -------------------------------------------------------------------------- */

export interface StepBadgeProps {
  step: StudioStep['id'];
  className?: string;
}

/**
 * The single step marker used by every workspace card.
 *
 * Deliberately quiet: a numbered dot and the step name in sentence case. It was
 * a purple uppercase pill with a border, which competed with the card's actual
 * content for attention.
 */
export const StepBadge: React.FC<StepBadgeProps> = ({ step, className }) => {
  const meta = getStep(step);

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-3xs font-black text-white">
        {meta.id}
      </span>
      <span className="text-2xs font-semibold text-slate-500">{meta.title}</span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* CardShell                                                                   */
/* -------------------------------------------------------------------------- */

export interface CardStatus {
  label: string;
  tone?: StatusTone;
  dot?: boolean;
  pulse?: boolean;
}

export interface CardShellProps {
  /** Which of the five flow steps this card belongs to. */
  step: StudioStep['id'];
  /**
   * `choosing` cards are the ones the user must act on — they get an accent
   * border and a ring so the eye lands on them. `confirmed` cards are settled
   * artefacts and stay quiet.
   */
  variant?: 'confirmed' | 'choosing';
  status?: CardStatus;
  /** Header-right controls (Change, Inspect, Cancel…). */
  actions?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
  children: React.ReactNode;
}

export const CardShell: React.FC<CardShellProps> = ({
  step,
  variant = 'confirmed',
  status,
  actions,
  title,
  subtitle,
  className,
  bodyClassName,
  id,
  children,
}) => {
  const isChoosing = variant === 'choosing';

  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-4 overflow-hidden rounded-3xl border bg-white p-5 sm:p-6',
        'animate-enter',
        isChoosing
          ? 'border-brand-300 shadow-sm ring-1 ring-brand-500/10'
          : 'border-slate-200/90 shadow-xs hover:border-brand-200',
        className,
      )}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <StepBadge step={step} />
          {status && (
            <StatusPill tone={status.tone ?? 'neutral'} dot={status.dot} pulse={status.pulse}>
              {status.label}
            </StatusPill>
          )}
        </div>

        {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </header>

      {(title || subtitle) && (
        <div className="mt-3.5">
          {title && (
            <h3 className="font-display text-lg font-bold tracking-tight text-slate-950">
              {title}
            </h3>
          )}
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div className={cn(title || subtitle ? 'mt-4' : 'mt-4', bodyClassName)}>{children}</div>
    </section>
  );
};
