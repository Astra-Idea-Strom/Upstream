import React from 'react';
import { cn } from '../../lib/cn';

export interface DomainChipProps {
  /** The domain extension or handle being checked, e.g. `.com` or `Instagram`. */
  label: string;
  available: boolean;
  className?: string;
}

/**
 * Availability readout for a domain or social handle.
 *
 * Every surface that reports availability (name selection, name card, export
 * summary) renders this, so the same `.io is taken` state always looks the same.
 *
 * Availability is carried by colour alone — green when free, grey when taken —
 * rather than a tick/cross glyph, which kept the chip narrow enough that five of
 * them sit on one line. The state is still announced to assistive tech through
 * the visually hidden suffix.
 */
export const DomainChip: React.FC<DomainChipProps> = ({ label, available, className }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold',
      available
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-slate-200 bg-slate-100 text-slate-400',
      className,
    )}
  >
    <span>{label}</span>
    <span className="sr-only">{available ? ' available' : ' taken'}</span>
  </span>
);
