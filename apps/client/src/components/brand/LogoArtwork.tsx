import React from 'react';
import type { BrandName, LogoStyle } from '@upstream/shared';

interface LogoArtworkProps {
  brand: BrandName;
  style: LogoStyle;
  variant?: 'light' | 'dark' | 'color';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const LogoArtwork: React.FC<LogoArtworkProps> = ({
  brand,
  style,
  variant = 'light',
  size = 'md',
  showTagline = false,
}) => {
  const primaryColor = brand.visualDirection?.palette[0]?.hex || '#7C3AED';
  const secondaryColor = brand.visualDirection?.palette[1]?.hex || '#1E1B4B';
  const accentColor = brand.visualDirection?.palette[2]?.hex || '#FB7185';
  const bgColor = variant === 'dark' ? '#0F172A' : variant === 'color' ? primaryColor : '#FFFFFF';
  const textColor = variant === 'dark' || variant === 'color' ? '#FFFFFF' : '#0F172A';
  const subtextColor = variant === 'dark' || variant === 'color' ? 'rgba(255,255,255,0.75)' : '#64748B';

  const sizeClasses = {
    sm: 'w-24 h-24 text-xs',
    md: 'w-40 h-40 text-sm',
    lg: 'w-64 h-64 text-base',
    xl: 'w-80 h-80 text-lg',
  }[size];

  const firstLetter = brand.name.charAt(0).toUpperCase() || 'U';
  const secondLetter = brand.name.length > 1 ? brand.name.charAt(1).toUpperCase() : 'P';

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-3xl p-6 transition-all duration-300 ${sizeClasses}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Visual Glyph / Icon based on selected style */}
      <div className="relative flex items-center justify-center mb-2">
        {style === 'minimal' && (
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={variant === 'color' ? '#FFFFFF' : primaryColor}
              strokeWidth="4"
              strokeDasharray="180 30"
              strokeLinecap="round"
            />
            <path
              d="M35 65 L50 25 L65 65"
              stroke={variant === 'color' ? '#FFFFFF' : primaryColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="50"
              cy="48"
              r="6"
              fill={variant === 'color' ? '#FFFFFF' : accentColor}
            />
          </svg>
        )}

        {style === 'wordmark' && (
          <svg className="w-20 h-14" viewBox="0 0 120 80" fill="none">
            <rect
              x="10"
              y="15"
              width="100"
              height="50"
              rx="12"
              fill={variant === 'color' ? 'rgba(255,255,255,0.15)' : `${primaryColor}15`}
              stroke={variant === 'color' ? '#FFFFFF' : primaryColor}
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
            <circle cx="95" cy="25" r="4" fill={accentColor} />
          </svg>
        )}

        {style === 'abstract' && (
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id={`grad1-${brand.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={variant === 'color' ? '#FFFFFF' : primaryColor} />
                <stop offset="100%" stopColor={variant === 'color' ? '#FFD1D1' : accentColor} />
              </linearGradient>
              <linearGradient id={`grad2-${brand.name}`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={variant === 'color' ? 'rgba(255,255,255,0.7)' : secondaryColor} />
                <stop offset="100%" stopColor={variant === 'color' ? '#FFFFFF' : primaryColor} />
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
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
            <rect
              x="25"
              y="25"
              width="50"
              height="50"
              rx="8"
              transform="rotate(45 50 50)"
              fill={variant === 'color' ? 'rgba(255,255,255,0.2)' : `${primaryColor}20`}
              stroke={variant === 'color' ? '#FFFFFF' : primaryColor}
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="14"
              stroke={variant === 'color' ? '#FFFFFF' : accentColor}
              strokeWidth="3"
              fill={variant === 'color' ? '#FFFFFF' : `${accentColor}30`}
            />
            <circle cx="50" cy="50" r="4" fill={textColor} />
          </svg>
        )}

        {style === 'illustrative' && (
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 15 C30 35 20 60 50 85 C80 60 70 35 50 15 Z"
              fill={variant === 'color' ? 'rgba(255,255,255,0.25)' : `${primaryColor}25`}
              stroke={variant === 'color' ? '#FFFFFF' : primaryColor}
              strokeWidth="3.5"
            />
            <path
              d="M50 30 Q45 55 50 75"
              stroke={variant === 'color' ? '#FFFFFF' : accentColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="50" cy="30" r="3" fill={accentColor} />
          </svg>
        )}
      </div>

      {/* Brand Name Title */}
      <h3
        className="font-bold tracking-tight text-center leading-tight mt-1"
        style={{
          color: textColor,
          fontFamily: brand.visualDirection?.fonts?.headline || 'Outfit, sans-serif',
          fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.35rem' : '1.75rem',
        }}
      >
        {brand.name}
      </h3>

      {/* Optional Tagline */}
      {showTagline && brand.tagline && (
        <p
          className="text-center font-normal tracking-wide mt-1 line-clamp-1 max-w-[90%]"
          style={{
            color: subtextColor,
            fontFamily: brand.visualDirection?.fonts?.body || 'Inter, sans-serif',
            fontSize: size === 'sm' ? '0.65rem' : size === 'md' ? '0.75rem' : '0.875rem',
          }}
        >
          {brand.tagline}
        </p>
      )}
    </div>
  );
};
