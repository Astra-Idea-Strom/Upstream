import React from 'react';
import type { BrandName, LogoStyle } from '@upstream/shared';

interface LogoArtworkProps {
  brand: BrandName;
  style: LogoStyle;
  /**
   * How the mark is presented.
   *
   * `light` / `dark` / `color` paint their own surface and radius — the artwork
   * *is* the tile. `none` paints nothing and draws the mark in `currentColor`,
   * so it can sit on a surface the caller owns. Nesting a painted variant inside
   * another padded, rounded box is what produced the double-card artifact and
   * the clipped wordmark.
   */
  variant?: 'light' | 'dark' | 'color' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Render the brand name beneath the mark. */
  showName?: boolean;
  showTagline?: boolean;
  /**
   * A real generated mark (FLUX.2) to show instead of the procedural glyph.
   *
   * When the agent generates artwork we have an actual image, and drawing a
   * placeholder SVG on top of it made the generated mark invisible. Passing a
   * URL here swaps the glyph for the image; everything else (surface, name line,
   * tagline) keeps working, so callers need no other change.
   */
  imageUrl?: string;
}

/**
 * Size tokens.
 *
 * Padding, glyph and type scale together, and every token is checked against
 * its own box height: at `sm` the glyph alone used to overflow the 96px box
 * (64px glyph inside 48px of padding), which is why small previews looked
 * sliced. Each entry now leaves headroom for the name line.
 */
const SIZES = {
  sm: { box: 'h-24 w-24', pad: 'p-3', glyph: 'h-10 w-10', name: '0.75rem', tagline: '0.55rem' },
  md: { box: 'h-40 w-40', pad: 'p-4', glyph: 'h-16 w-16', name: '1.1rem', tagline: '0.7rem' },
  lg: { box: 'h-56 w-56', pad: 'p-5', glyph: 'h-24 w-24', name: '1.6rem', tagline: '0.85rem' },
  xl: { box: 'h-72 w-72', pad: 'p-6', glyph: 'h-32 w-32', name: '2rem', tagline: '1rem' },
} as const;

export const LogoArtwork: React.FC<LogoArtworkProps> = ({
  brand,
  style,
  variant = 'light',
  size = 'md',
  showName = true,
  showTagline = false,
  imageUrl,
}) => {
  const isBare = variant === 'none';
  const palette = brand.visualDirection?.palette ?? [];

  // A bare mark inherits its colour, so one surface can carry a light or a dark
  // mark without the caller passing colours in.
  const primaryColor = isBare ? 'currentColor' : palette[0]?.hex || '#7C3AED';
  const accentColor = isBare ? 'currentColor' : palette[2]?.hex || '#FB7185';

  const bgColor = isBare
    ? 'transparent'
    : variant === 'dark'
      ? '#0F172A'
      : variant === 'color'
        ? palette[0]?.hex || '#7C3AED'
        : '#FFFFFF';

  const onSurface = variant === 'dark' || variant === 'color';
  const textColor = isBare ? 'currentColor' : onSurface ? '#FFFFFF' : '#0F172A';
  const subtextColor = isBare ? 'currentColor' : onSurface ? 'rgba(255,255,255,0.75)' : '#64748B';

  const token = SIZES[size];

  /**
   * A bare mark with no name is just the glyph, so it collapses to its content
   * instead of reserving a square it will never fill. Painted variants always
   * keep the square — they are the tile.
   */
  const isGlyphOnly = isBare && !showName;

  const rootClasses = [
    'relative flex flex-col items-center justify-center text-center',
    'transition-colors duration-300',
    isGlyphOnly
      ? ''
      : isBare
        ? token.box
        : `${token.box} ${token.pad} rounded-3xl`,
  ]
    .filter(Boolean)
    .join(' ');

  const firstLetter = brand.name.charAt(0).toUpperCase() || 'U';
  const secondLetter = brand.name.length > 1 ? brand.name.charAt(1).toUpperCase() : 'P';

  return (
    <div className={rootClasses} style={{ backgroundColor: bgColor }}>
      {/* Mark — every style shares one glyph box so the five directions read at
          the same optical weight instead of each picking its own size. */}
      <div className={`flex flex-shrink-0 items-center justify-center ${token.glyph}`}>
        {imageUrl ? (
          /* Generated artwork — fills the glyph box and keeps the caller's
             surface, so it reads the same as the SVG it replaces. */
          <img
            src={imageUrl}
            alt={`${brand.name} mark`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <>
            {style === 'minimal' && (
          <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={primaryColor}
              strokeWidth="4"
              strokeDasharray="180 30"
              strokeLinecap="round"
            />
            <path
              d="M35 65 L50 25 L65 65"
              stroke={primaryColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="48" r="6" fill={accentColor} fillOpacity={isBare ? 0.6 : 1} />
          </svg>
        )}

        {style === 'wordmark' && (
          <svg className="h-full w-full" viewBox="0 0 120 80" fill="none">
            <rect
              x="10"
              y="15"
              width="100"
              height="50"
              rx="12"
              fill={isBare ? 'none' : onSurface ? 'rgba(255,255,255,0.15)' : `${primaryColor}15`}
              stroke={primaryColor}
              strokeWidth="2"
            />
            <text
              x="60"
              y="48"
              textAnchor="middle"
              fill={textColor}
              fontSize="24"
              fontFamily="Outfit, sans-serif"
              fontWeight="800"
              letterSpacing="3"
            >
              {firstLetter}
              {secondLetter}
            </text>
            <circle cx="95" cy="25" r="4" fill={accentColor} fillOpacity={isBare ? 0.6 : 1} />
          </svg>
        )}

        {style === 'abstract' && (
          <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`grad1-${brand.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="100%" stopColor={accentColor} />
              </linearGradient>
              <linearGradient id={`grad2-${brand.name}`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="100%" stopColor={accentColor} />
              </linearGradient>
            </defs>
            <polygon
              points="50,15 85,35 85,75 50,95 15,75 15,35"
              stroke={`url(#grad1-${brand.name})`}
              strokeWidth="4"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M50 15 L50 95 M15 35 L85 75 M15 75 L85 35"
              stroke={`url(#grad2-${brand.name})`}
              strokeWidth="2"
              strokeOpacity="0.4"
            />
            <circle cx="50" cy="50" r="10" fill={`url(#grad1-${brand.name})`} />
          </svg>
        )}

        {style === 'geometric' && (
          <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
            <rect
              x="25"
              y="25"
              width="50"
              height="50"
              rx="8"
              transform="rotate(45 50 50)"
              fill={isBare ? 'none' : onSurface ? 'rgba(255,255,255,0.2)' : `${primaryColor}20`}
              stroke={primaryColor}
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="14"
              stroke={accentColor}
              strokeWidth="3"
              fill={isBare ? 'none' : onSurface ? 'rgba(255,255,255,0.25)' : `${accentColor}30`}
            />
            <circle cx="50" cy="50" r="4" fill={textColor} />
          </svg>
        )}

        {style === 'illustrative' && (
          <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 15 C30 35 20 60 50 85 C80 60 70 35 50 15 Z"
              fill={isBare ? 'none' : onSurface ? 'rgba(255,255,255,0.25)' : `${primaryColor}25`}
              stroke={primaryColor}
              strokeWidth="3.5"
            />
            <path
              d="M50 30 Q45 55 50 75"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="50" cy="30" r="3" fill={accentColor} fillOpacity={isBare ? 0.6 : 1} />
          </svg>
        )}
          </>
        )}
      </div>

      {showName && (
        <h3
          className="mt-1.5 line-clamp-1 max-w-full font-bold leading-tight tracking-tight"
          style={{
            color: textColor,
            fontFamily: brand.visualDirection?.fonts?.headline || 'Outfit, sans-serif',
            fontSize: token.name,
          }}
        >
          {brand.name}
        </h3>
      )}

      {showTagline && brand.tagline && (
        <p
          className="mt-0.5 line-clamp-1 max-w-[90%] font-normal tracking-wide"
          style={{
            color: subtextColor,
            fontFamily: brand.visualDirection?.fonts?.body || 'Inter, sans-serif',
            fontSize: token.tagline,
            opacity: isBare ? 0.7 : 1,
          }}
        >
          {brand.tagline}
        </p>
      )}
    </div>
  );
};
