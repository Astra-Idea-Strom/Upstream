import React from 'react';
import { useBrandStore } from '../../store/brandStore';
import {
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
  Share2,
  Compass,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { step, setStep, isSidebarOpen, setSidebarOpen, selectedName } = useBrandStore();

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-pill rounded-full px-5 py-2.5 shadow-glass">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-coral-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="m12 9 4 7H8Z" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 block leading-none">
                UPSTREAM
              </span>
              <span className="text-[10px] font-medium tracking-wider text-brand-700 uppercase block mt-0.5">
                Idea to Identity
              </span>
            </div>
          </button>

          {/* Vertical divider */}
          <div className="hidden md:block h-5 w-[1px] bg-brand-200/80 mx-1" />

          {/* AI Co-pilot Trigger Pill */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
              isSidebarOpen
                ? 'bg-brand-600 text-white shadow-brand-500/25'
                : 'bg-brand-100/90 text-brand-800 hover:bg-brand-200/80'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-coral-500 animate-pulse-subtle" />
            <span>AI Brand Co-Pilot</span>
            <span className="bg-coral-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
              LIVE
            </span>
          </button>
        </div>

        {/* Center: Step Navigation Indicator */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md rounded-full px-2 py-1 border border-brand-100/60 shadow-inner">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              step === 1
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-700'
            }`}
          >
            1. Idea & Themes
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <button
            onClick={() => setStep(2)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              step === 2
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-700'
            }`}
          >
            2. Brand Names & Visuals
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <button
            onClick={() => setStep(3)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              step === 3
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-700'
            }`}
          >
            3. AI Logo Concepts
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <button
            onClick={() => setStep(4)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              step === 4
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-brand-700'
            }`}
          >
            4. Export Card
          </button>
        </nav>

        {/* Right: Social & Action Pills */}
        <div className="flex items-center gap-2">
          {/* Social icons matching reference image */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/80 rounded-full px-2.5 py-1 text-slate-500">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-brand-600 transition-colors"
              title="Twitter/X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-brand-600 transition-colors"
              title="LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-brand-600 transition-colors"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          {/* Quick AI Studio Button */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="flex sm:hidden p-2 rounded-full bg-brand-100 text-brand-700 hover:bg-brand-200"
            title="Open AI Co-pilot"
          >
            <Bot className="w-4 h-4 text-coral-500" />
          </button>

          {/* Active Brand Pill if selected */}
          {selectedName && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[100px] truncate">{selectedName.name}</span>
            </div>
          )}

          {/* Account / Action Avatar Pill */}
          <div className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-medium shadow-sm hover:bg-slate-800 cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-400 to-coral-400 flex items-center justify-center text-[10px] font-bold text-slate-900">
              UP
            </div>
            <span className="hidden sm:inline">Studio</span>
          </div>
        </div>
      </div>
    </header>
  );
};
