import React, { useState, useEffect } from 'react';
import { useBrandStore } from './store/brandStore';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/home/HeroSection';
import { PrebuiltThemesSection } from './components/home/PrebuiltThemesSection';
import { StudioLayout } from './components/studio/StudioLayout';
import { ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const { viewMode, setViewMode } = useBrandStore();
  const [countdown, setCountdown] = useState<number>(4);
  const [hasAutoEntered, setHasAutoEntered] = useState<boolean>(false);

  useEffect(() => {
    // Only auto-transition once on initial load when on landing page
    if (viewMode === 'studio' || hasAutoEntered) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasAutoEntered(true);
          setViewMode('studio');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [viewMode, hasAutoEntered, setViewMode]);

  if (viewMode === 'studio') {
    return <StudioLayout />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white bg-[#F8F6FE] relative">
      {/* Top Auto-Transition Status Banner */}
      <div className="bg-slate-950 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-slate-300 text-[11px] sm:text-xs">
              Home preview active · Launching Replit-style Studio in{' '}
              <strong className="text-white font-black">{countdown}s</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setHasAutoEntered(true);
              setViewMode('studio');
            }}
            className="text-[11px] font-bold text-[#F97356] hover:text-orange-300 flex items-center gap-1 transition-colors px-2.5 py-0.5 rounded-full hover:bg-white/10"
          >
            <span>Skip to Studio</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Clean Header: Website Name Only */}
      <Header />

      {/* Main Home Page with Flower Photos and Prebuilt Themes */}
      <main className="flex-1">
        <HeroSection />
        <PrebuiltThemesSection />
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full border-t border-brand-100/80 bg-white/60 backdrop-blur-md py-6 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[9px]">
              UP
            </div>
            <span className="font-display font-black text-slate-900 text-sm tracking-tight">UPSTREAM</span>
            <span className="text-slate-300">|</span>
            <span className="italic">Idea to Identity</span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            © 2026 UPSTREAM AI Studio. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
