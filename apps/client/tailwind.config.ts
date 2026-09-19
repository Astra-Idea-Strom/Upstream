import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF8FF',
          100: '#F3EEFF',
          200: '#E6DCFF',
          300: '#D2BFFF',
          400: '#B594FF',
          500: '#9060FA',
          600: '#7C3AED',
          700: '#6424D6',
          800: '#521CAE',
          900: '#43198D',
          950: '#1E0E45',
        },
        coral: {
          50: '#FFF5F5',
          100: '#FFE6E6',
          200: '#FFD1D1',
          300: '#FFAFA8',
          400: '#FF7D75',
          500: '#F85A52',
          600: '#E53B33',
        },
        lavender: {
          50: '#FBF9FE',
          100: '#F5F2FC',
          200: '#ECE5F9',
          300: '#DDD2F4',
          400: '#C2ADEC',
          500: '#A482E2',
        },
        slateDark: '#0D0F1D',
        navyDark: '#12172B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(124, 58, 237, 0.08)',
        'glass-hover': '0 16px 40px 0 rgba(124, 58, 237, 0.16)',
        'glow-purple': '0 0 35px -5px rgba(124, 58, 237, 0.35)',
        'glow-coral': '0 0 35px -5px rgba(248, 90, 82, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
