import React from 'react';
import { cn } from '../../lib/cn';

export interface DomainChipProps {
  /** Label shown after the tick/cross, e.g. `.com` or `Instagram`. */
  label: string;
  available: boolean;
  className?: string;
}

/**
 * Availability readout for a domain or social handle.
 *
 * Every surface that reports availability (name selection, name card, export
 * summary) renders this, so the same `.io is taken` state always looks the same.
 */
export const DomainChip: React.FC<DomainChipProps> = ({ label, available, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold',
      available
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-slate-200 bg-slate-50 text-slate-400',
      className,
    )}
  >
    <span aria-hidden="true">{available ? '✓' : '✗'}</span>
    <span>{label}</span>
    <span className="sr-only">{available ? 'available' : 'taken'}</span>
  </span>
);
