import React from 'react';
import { cn } from '../../lib/cn';

/* -------------------------------------------------------------------------- */
/* Button                                                                      */
/* -------------------------------------------------------------------------- */

export type ButtonVariant =
  | 'primary'
  | 'brand'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1.5 font-semibold whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ' +
  'select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-white ' +
  'disabled:opacity-45 disabled:pointer-events-none';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-slate-950 text-white hover:bg-brand-600 active:bg-brand-700 shadow-2xs',
  brand: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-2xs',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-2xs',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  outline:
    'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 hover:border-brand-300',
  danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-2xs rounded-md',
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-9 px-3.5 text-xs rounded-xl',
  lg: 'h-11 px-5 text-sm rounded-xl',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fully rounded pill shape (used for chips-like actions and top-bar controls). */
  pill?: boolean;
  /** Rendered before the label. */
  icon?: React.ReactNode;
  /** Rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Replaces the label with a spinner and blocks interaction. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    pill = false,
    icon,
    trailingIcon,
    loading = false,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        BUTTON_BASE,
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        pill && 'rounded-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner className="h-3.5 w-3.5" /> : icon}
      {children}
      {trailingIcon}
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/* IconButton                                                                  */
/* -------------------------------------------------------------------------- */

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Accessible name — required because these buttons have no visible label. */
  label: string;
}

const ICON_BUTTON_SIZES: Record<ButtonSize, string> = {
  xs: 'h-6 w-6 rounded-md',
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-9 w-9 rounded-lg',
  lg: 'h-11 w-11 rounded-xl',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ variant = 'ghost', size = 'sm', label, className, children, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={rest.title ?? label}
        className={cn(
          BUTTON_BASE,
          BUTTON_VARIANTS[variant],
          ICON_BUTTON_SIZES[size],
          'px-0',
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Chip — suggestion / prompt pills                                            */
/* -------------------------------------------------------------------------- */

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { icon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white',
        'px-2.5 py-1 text-2xs font-medium text-slate-600 shadow-2xs text-left',
        'transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 focus-visible:ring-offset-1',
        'disabled:opacity-45 disabled:pointer-events-none',
        className,
      )}
      {...rest}
    >
      {icon}
      <span className="truncate">{children}</span>
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/* StatusPill                                                                  */
/* -------------------------------------------------------------------------- */

export type StatusTone = 'neutral' | 'success' | 'warning' | 'brand' | 'info';

const STATUS_TONES: Record<StatusTone, string> = {
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const STATUS_DOTS: Record<StatusTone, string> = {
  neutral: 'bg-slate-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  brand: 'bg-brand-500',
  info: 'bg-blue-500',
};

export interface StatusPillProps {
  tone?: StatusTone;
  /** Show a leading status dot. */
  dot?: boolean;
  /** Pulse the dot — reserved for "agent is working" states. */
  pulse?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  tone = 'neutral',
  dot = false,
  pulse = false,
  icon,
  className,
  children,
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5',
      'text-2xs font-bold uppercase tracking-wider',
      STATUS_TONES[tone],
      className,
    )}
  >
    {dot && (
      <span
        className={cn(
          'h-1.5 w-1.5 flex-shrink-0 rounded-full',
          STATUS_DOTS[tone],
          pulse && 'animate-pulse',
        )}
      />
    )}
    {icon}
    {children}
  </span>
);

/* -------------------------------------------------------------------------- */
/* SectionLabel — uppercase micro heading                                      */
/* -------------------------------------------------------------------------- */

export const SectionLabel: React.FC<{
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ icon, className, children }) => (
  <span
    className={cn(
      'flex items-center gap-1 text-2xs font-bold uppercase tracking-wider text-slate-400',
      className,
    )}
  >
    {icon}
    {children}
  </span>
);

/* -------------------------------------------------------------------------- */
/* SegmentedControl — tab groups                                               */
/* -------------------------------------------------------------------------- */

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
  'aria-label'?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-xl border border-slate-200/70 bg-slate-100 p-0.5',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-2xs font-semibold transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
              active
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Spinner / Skeleton                                                          */
/* -------------------------------------------------------------------------- */

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('animate-spin', className)}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-lg bg-slate-200/70', className)} aria-hidden="true" />
);

/* -------------------------------------------------------------------------- */
/* Divider                                                                     */
/* -------------------------------------------------------------------------- */

export const Divider: React.FC<{ className?: string; vertical?: boolean }> = ({
  className,
  vertical = false,
}) =>
  vertical ? (
    <span className={cn('block h-4 w-px flex-shrink-0 bg-slate-200', className)} />
  ) : (
    <span className={cn('block h-px w-full bg-slate-200', className)} />
  );
