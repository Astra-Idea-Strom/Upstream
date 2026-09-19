import React from 'react';
import { useBrandStore } from './store/brandStore';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/home/HeroSection';
import { PrebuiltThemesSection } from './components/home/PrebuiltThemesSection';
import { StudioLayout } from './components/studio/StudioLayout';
import { BrandMark } from './components/layout/BrandMark';

/**
 * Top-level shell.
 *
 * The landing page and the studio are two views of one product, so navigation
 * between them is always user-initiated. (Previously the landing page ran a
 * four-second countdown and then navigated itself to the studio behind a
 * "Launching Replit-style Studio in 4s" banner, which hijacked the visitor.)
 */
export const App: React.FC = () => {
  const viewMode = useBrandStore((state) => state.viewMode);

  if (viewMode === 'studio') {
    return <StudioLayout />;
  }

  return (
    <div className="flex min-h-screen animate-fade-in flex-col bg-[#F8F6FE] selection:bg-brand-500 selection:text-white">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <PrebuiltThemesSection />
      </main>

      <footer className="mt-12 w-full border-t border-brand-100/80 bg-white/60 px-4 py-8 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <BrandMark size="sm" />

          <span className="text-2xs text-slate-400">© 2026 Upstream</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
