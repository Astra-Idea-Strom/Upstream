import React, { useState, useEffect } from 'react';
import { useBrandStore } from '../../store/brandStore';
import {
  Plus,
  ArrowRight,
  Coffee,
  Shirt,
  Cpu,
  Sparkles,
  Flower2,
  Gem,
  Compass,
} from 'lucide-react';

export const ReplitHeroSection: React.FC = () => {
  const { startIdentityCreation, setViewMode } = useBrandStore();
  const [prompt, setPrompt] = useState('');
  const [autoTimer, setAutoTimer] = useState<number>(4);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-transition timer so user sees the page for a few seconds like an animation
  // then transitions without having to search for a "build" button
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setAutoTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          startIdentityCreation('We are building a specialty coffee business and looking to have a brand');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, startIdentityCreation]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt = prompt.trim() || 'We are building a specialty coffee business and looking to have a brand';
    startIdentityCreation(finalPrompt);
  };

  const handleSelectPill = (pillPrompt: string) => {
    startIdentityCreation(pillPrompt);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-[#FAF7F2] text-slate-900 font-sans selection:bg-orange-500 selection:text-white px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-[400px] h-[250px] rounded-full bg-purple-100/30 blur-3xl pointer-events-none" />

      {/* Top bar: Ultra-minimal, no cluttered navbar */}
      <div className="h-16 max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F97356] flex items-center justify-center text-white font-black text-xs shadow-2xs">
            UP
          </div>
          <span className="font-display font-black text-base tracking-tight text-slate-950">
            UPSTREAM
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Autonomous Studio entering in {autoTimer}s
          </span>
          <button
            onClick={() => setViewMode('studio')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-full border border-slate-200/80 hover:bg-white transition-all shadow-2xs"
          >
            Skip to Studio →
          </button>
        </div>
      </div>

      {/* Main Center Replit Hero */}
      <div className="max-w-3xl w-full mx-auto my-auto flex flex-col items-center text-center py-10 z-10">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-xs font-bold text-orange-800 mb-6 shadow-2xs animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-[#F97356]" />
          <span>Idea to Identity · Replit Agent Mode</span>
        </div>

        {/* Big Clean Replit Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-slate-950 tracking-tight leading-[1.08] mb-4 animate-in slide-in-from-bottom-2 duration-500">
          What will you build?
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed font-normal">
          Turn vision into iconic brand identities in minutes — no agency needed
        </p>

        {/* Replit Prompt Box Container */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white rounded-3xl border-2 border-orange-200/90 shadow-xl shadow-orange-500/5 hover:border-orange-300 focus-within:border-[#F97356] focus-within:ring-4 focus-within:ring-orange-500/10 transition-all p-4 text-left relative"
          onFocus={() => setIsPaused(true)}
        >
          {/* Input field */}
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setIsPaused(true);
            }}
            placeholder="Build a brand for... (e.g. Specialty coffee roastery named Ceramiq, or a streetwear label)"
            rows={2}
            className="w-full resize-none text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent leading-relaxed"
          />

          {/* Bottom actions row inside box */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
            <button
              type="button"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Add business parameters"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#F97356] hover:bg-[#EA580C] text-white flex items-center justify-center transition-all shadow-md shadow-orange-500/20 hover:scale-105"
              title="Start Autonomous Studio"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Category / Starter Pills (Mirroring Replit's bottom icons) */}
        <div className="w-full max-w-2xl mt-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-xs">
            <button
              onClick={() => handleSelectPill('We are building a coffee business and looking to have a brand')}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-900 transition-all flex items-center gap-2 shadow-2xs group"
            >
              <Coffee className="w-3.5 h-3.5 text-[#F97356]" />
              <span className="font-semibold">Coffee Roastery</span>
            </button>

            <button
              onClick={() => handleSelectPill('Streetwear and sneaker label for Gen Z named Kinetics')}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-900 transition-all flex items-center gap-2 shadow-2xs group"
            >
              <Shirt className="w-3.5 h-3.5 text-[#F97356]" />
              <span className="font-semibold">Streetwear</span>
            </button>

            <button
              onClick={() => handleSelectPill('Autonomous AI cloud platform for developers named Synapse')}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-900 transition-all flex items-center gap-2 shadow-2xs group"
            >
              <Cpu className="w-3.5 h-3.5 text-[#F97356]" />
              <span className="font-semibold">AI SaaS</span>
            </button>

            <button
              onClick={() => handleSelectPill('Clean organic botanical skincare brand named Verdura')}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-900 transition-all flex items-center gap-2 shadow-2xs group"
            >
              <Flower2 className="w-3.5 h-3.5 text-[#F97356]" />
              <span className="font-semibold">Skincare</span>
            </button>

            <button
              onClick={() => handleSelectPill('Modern architectural fine jewelry atelier')}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-900 transition-all flex items-center gap-2 shadow-2xs group"
            >
              <Gem className="w-3.5 h-3.5 text-[#F97356]" />
              <span className="font-semibold">Fine Jewelry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="h-12 max-w-6xl w-full mx-auto flex items-center justify-between text-[11px] text-slate-400 font-mono z-10">
        <span>© 2026 UPSTREAM AI Studio</span>
        <span>Replit Agent Experience</span>
      </div>
    </div>
  );
};
