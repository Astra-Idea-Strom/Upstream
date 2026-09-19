import React from 'react';
import { useBrandStore } from './store/brandStore';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/home/HeroSection';
import { PrebuiltThemesSection } from './components/home/PrebuiltThemesSection';
import { StudioLayout } from './components/studio/StudioLayout';

export const App: React.FC = () => {
  const { viewMode } = useBrandStore();

  if (viewMode === 'studio') {
    return <StudioLayout />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Clean Header: Website Name Only */}
      <Header />

      {/* Main Home Page */}
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
