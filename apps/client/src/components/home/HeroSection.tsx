import React from 'react';
import { useBrandStore } from '../../store/brandStore';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Layers,
  Palette,
  CheckCircle2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { startIdentityCreation } = useBrandStore();

  return (
    <section className="relative px-4 sm:px-8 pt-4 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Hero Card mirroring Moana layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero Card: Typographic, Clean & Bold */}
          <div className="lg:col-span-6 glass-panel rounded-5xl p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shadow-glass border border-white/80">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-300/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-coral-300/20 blur-3xl pointer-events-none" />

            {/* Top Tag & Grid Icon */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-brand-200/60 p-2.5 flex items-center justify-center shadow-xs">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  <div className="rounded-md bg-brand-600" />
                  <div className="rounded-md bg-coral-400" />
                  <div className="rounded-md bg-brand-300" />
                  <div className="rounded-md bg-brand-800" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-brand-100 text-xs font-bold text-brand-800 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span>Idea to Identity</span>
              </div>
            </div>

            {/* Hero Main Copy */}
            <div className="my-10 relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-slate-950 tracking-tight leading-[1.12]">
                Experience the future with{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-coral-500 bg-clip-text text-transparent">
                  UPSTREAM AI
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-md font-normal leading-relaxed">
                Describe your business idea, and our AI instantly synthesizes 5 curated brand names,
                matching taglines, a visual chromatic palette, Google typography pairings, and vector logo sketches.
              </p>

              {/* Primary Action Button: Build Identity */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => startIdentityCreation()}
                  className="px-8 py-4 rounded-full bg-slate-950 hover:bg-brand-600 text-white font-bold text-sm transition-all flex items-center gap-3 shadow-xl shadow-slate-900/15 hover:shadow-brand-500/25 group"
                >
                  <span>Build the Identity</span>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Quote Badge */}
            <div className="pt-6 border-t border-brand-100/70 relative z-10 flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-slate-700 italic">
                “We envision brand creation with <span className="text-brand-600 font-bold not-italic">no limits</span>.”
              </p>
              <span className="text-[11px] text-slate-400 font-mono">UPSTREAM Studio</span>
            </div>
          </div>

          {/* Right Hero Card: Featuring the Photo from Photos folder */}
          <div className="lg:col-span-6 rounded-5xl relative overflow-hidden shadow-glass border border-white/80 p-8 flex flex-col justify-between min-h-[480px] bg-gradient-to-br from-brand-200/50 via-purple-100/40 to-pink-100/30">
            {/* Real Orchid Artwork from Photos folder */}
            <div className="absolute inset-0 z-0">
              <img
                src="/photos/orchid.jpeg"
                alt="Botanical artwork used as the hero visual"
                className="w-full h-full object-cover object-center"
              />
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-white/30" />
            </div>

            {/* Top Floating Glass Pills */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="glass-pill rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-slate-900">Idea to Identity Engine</span>
              </div>
              <div className="glass-pill rounded-full px-3.5 py-1 text-xs font-semibold text-brand-900 shadow-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Instant Generation</span>
              </div>
            </div>

            {/* Center Floating Glass Panel */}
            <div className="relative z-10 my-auto py-6">
              <div className="glass-panel rounded-3xl p-5 max-w-sm ml-auto backdrop-blur-2xl bg-white/85 border border-white/90 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                      UP
                    </div>
                    <span className="font-bold text-xs text-slate-900">Integrated Pipeline</span>
                  </div>
                  <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">
                    5 Steps
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      5 Brand Name Options
                    </span>
                    <strong className="text-slate-900">AI Synthesized</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      Domain (.com, .io, .co)
                    </span>
                    <strong className="text-emerald-600">Verified Live</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-coral-500" />
                      5-Color Chromatic Palette
                    </span>
                    <strong className="text-slate-900">Harmonized</strong>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-500" />
                      5 Logo Concept Sketches
                    </span>
                    <strong className="text-purple-600">Vector SVG</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Feature Badges */}
            <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="glass-panel rounded-2xl p-3 backdrop-blur-md bg-white/80 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Visual Direction</h4>
                  <p className="text-[10px] text-slate-500">Color, fonts & guides</p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-3 backdrop-blur-md bg-white/80 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-coral-500/10 flex items-center justify-center text-coral-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Export One-Pager</h4>
                  <p className="text-[10px] text-slate-500">PDF & PNG download</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inspirational Sub-Header */}
        <div className="mt-14 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/70 border border-brand-200/50 text-[11px] font-semibold text-brand-800 mb-4">
            <span>ABOUT UPSTREAM</span>
            <span className="w-1 h-1 rounded-full bg-brand-600" />
            <span>IDEA TO IDENTITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-slate-900 leading-relaxed">
            Upstream <span className="font-semibold text-brand-700">empowers founders</span> to transform ideas
            into an actionable, <span className="text-coral-600 font-semibold">cohesive brand identity</span> in one session.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 tracking-wide uppercase font-mono">
            Choose a curated industry theme below or click Build Identity above
          </p>
        </div>
      </div>
    </section>
  );
};
