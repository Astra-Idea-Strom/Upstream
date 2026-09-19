import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { PaletteSwatch } from '../../lib/palettes';

export interface SwatchStripProps {
  swatches: readonly PaletteSwatch[];
  /** `sm` for in-card previews, `lg` for the confirmed palette card. */
  size?: 'sm' | 'lg';
  /** Show the hex value under each swatch. */
  showHex?: boolean;
  /** Show the human colour name under each swatch. */
  showName?: boolean;
  /** When set, clicking a swatch copies its hex and marks it as copied. */
  copiedHex?: string | null;
  onCopy?: (hex: string) => void;
  className?: string;
}

/**
 * The five-colour harmony strip.
 *
 * Rendered identically in the palette chooser, the confirmed palette card and
 * anywhere else that previews a visual direction, so a palette always looks the
 * same wherever it appears.
 */
export const SwatchStrip: React.FC<SwatchStripProps> = ({
  swatches,
  size = 'sm',
  showHex = true,
  showName = false,
  copiedHex = null,
  onCopy,
  className,
}) => {
  const isInteractive = Boolean(onCopy);

  return (
    <div className={cn('grid grid-cols-5 gap-2', className)}>
      {swatches.map((swatch) => {
        const isCopied = copiedHex === swatch.hex;

        const content = (
          <>
            <span
              className={cn(
                'relative block w-full rounded-xl border border-black/5 shadow-inner transition-transform',
                size === 'lg' ? 'h-12 sm:h-14' : 'h-9 sm:h-10',
                isInteractive && 'group-hover:scale-[1.04]',
              )}
              style={{ backgroundColor: swatch.hex }}
            >
              {isCopied && (
                <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </span>

            {showName && (
              <span className="mt-1.5 block truncate text-2xs font-semibold text-slate-700">
                {swatch.name}
              </span>
            )}

            {showHex && (
              <span className="block truncate font-mono text-2xs uppercase text-slate-400">
                {swatch.hex}
              </span>
            )}
          </>
        );

        if (!isInteractive) {
          return (
            <div key={swatch.hex + swatch.role} className="flex flex-col">
              {content}
            </div>
          );
        }

        return (
          <button
            key={swatch.hex + swatch.role}
            type="button"
            onClick={() => onCopy?.(swatch.hex)}
            title={`Copy ${swatch.name} (${swatch.hex})`}
            className="group flex flex-col rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 focus-visible:ring-offset-2"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};
