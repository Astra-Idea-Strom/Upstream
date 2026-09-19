import React from 'react';
import { useBrandStore } from '../../store/brandStore';
import { ArrowRight, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const { viewMode, setViewMode, startIdentityCreation } = useBrandStore();

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-pill rounded-full px-6 py-3 shadow-glass">
        {/* Website Name Only */}
        <button
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-coral-400 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="m12 9 4 7H8Z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-xl tracking-tight text-slate-950">
              UPSTREAM
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-brand-600 uppercase font-mono hidden sm:inline">
              Idea to Identity
            </span>
          </div>
        </button>

        {/* Minimal Action */}
        <div>
          {viewMode === 'studio' ? (
            <button
              onClick={() => setViewMode('landing')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white/80 hover:bg-white border border-slate-200/80 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Back to Home</span>
            </button>
          ) : (
            <button
              onClick={startIdentityCreation}
              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-slate-950 hover:bg-brand-600 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Build Identity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
