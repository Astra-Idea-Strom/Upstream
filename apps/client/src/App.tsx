import React from 'react';
import { useBrandStore } from './store/brandStore';
import { Header } from './components/layout/Header';
import { LeftSidebarChat } from './components/layout/LeftSidebarChat';
import { HeroSection } from './components/home/HeroSection';
import { PrebuiltThemesSection } from './components/home/PrebuiltThemesSection';
import { BrandInputForm } from './components/forms/BrandInputForm';
import { BrandResultsGrid } from './components/brand/BrandResultsGrid';
import { LogoGenerationView } from './components/brand/LogoGenerationView';
import { BrandIdentityCard } from './components/brand/BrandIdentityCard';
import { Sparkles, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const { step } = useBrandStore();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top Floating Glass Navigation */}
      <Header />

      {/* Left Sidebar AI Co-pilot & Mood Board Drawer */}
      <LeftSidebarChat />

      {/* Main Multi-Step Content View */}
      <main className="flex-1">
        {step === 1 && (
          <>
            <HeroSection />
            <PrebuiltThemesSection />
            <BrandInputForm />
          </>
        )}

        {step === 2 && <BrandResultsGrid />}

        {step === 3 && <LogoGenerationView />}

        {step === 4 && <BrandIdentityCard />}
      </main>

      {/* Modern Minimal Footer matching the reference style */}
      <footer className="w-full border-t border-brand-100/80 bg-white/60 backdrop-blur-md py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
              UP
            </div>
            <span className="font-display font-bold text-slate-800 text-sm">UPSTREAM</span>
            <span className="text-slate-300">|</span>
            <span className="italic">Idea to Identity</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <a href="#brand-input-form" className="hover:text-brand-600 transition-colors">
              Brand Studio
            </a>
            <a href="#themes" className="hover:text-brand-600 transition-colors">
              Pre-built Themes
            </a>
            <span className="text-[11px] font-mono text-slate-400">
              © 2026 UPSTREAM AI Studio. All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
