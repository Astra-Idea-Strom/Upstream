import React from 'react';
import { cn } from '../../lib/cn';

export interface BrandMarkProps {
  /** Renders the UPSTREAM wordmark next to the glyph. */
  showWordmark?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const GLYPH_SIZES = {
  sm: 'h-7 w-7 rounded-lg',
  md: 'h-8 w-8 rounded-xl',
} as const;

const ICON_SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
} as const;

/**
 * The one and only Upstream logo lockup.
 *
 * The landing header previously used a purple gradient triangle while the
 * studio header used a black "UP" square, so the product looked like two
 * different apps. Both shells now render this component.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  showWordmark = true,
  size = 'md',
  className,
}) => (
  <span className={cn('flex items-center gap-2.5', className)}>
    <span
      className={cn(
        'flex flex-shrink-0 items-center justify-center bg-gradient-to-tr from-brand-600 via-brand-500 to-coral-400 text-white',
        'shadow-sm shadow-brand-500/20',
        GLYPH_SIZES[size],
      )}
    >
      <svg
        className={ICON_SIZES[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="m12 9 4 7H8Z" />
      </svg>
    </span>

    {showWordmark && (
      <span className="font-display text-lg font-black tracking-tight text-slate-950">
        UPSTREAM
      </span>
    )}
  </span>
);
