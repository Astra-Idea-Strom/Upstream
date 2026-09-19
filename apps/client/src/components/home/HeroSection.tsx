import React from 'react';
import { useBrandStore } from '../../store/brandStore';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Zap,
  CheckCircle2,
  Globe,
  Palette,
  Layers,
  Star,
  Compass,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setStep, setSidebarOpen } = useBrandStore();

  return (
    <section className="relative px-4 sm:px-8 pt-4 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Hero Card mirroring Moana layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero Card: Minimal, Typographic & Bold */}
          <div className="lg:col-span-6 glass-panel rounded-5xl p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shadow-glass border border-white/80">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-300/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-coral-300/20 blur-3xl pointer-events-none" />

            {/* Top Tag & App Icon Grid */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-brand-200/60 p-2.5 flex items-center justify-center shadow-sm">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  <div className="rounded-md bg-brand-500" />
                  <div className="rounded-md bg-coral-400" />
                  <div className="rounded-md bg-brand-300" />
                  <div className="rounded-md bg-brand-700" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-brand-100 text-xs font-semibold text-brand-700">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span>Next-Gen Identity Engine</span>
              </div>
            </div>

            {/* Hero Main Copy */}
            <div className="my-10 relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Experience the future with{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-coral-500 bg-clip-text text-transparent">
                  UPSTREAM AI
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-md font-normal leading-relaxed">
                Transform any nascent business concept into 15+ memorable brand names, matching taglines,
                harmonized color palettes, typography systems, and AI logo concepts.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-full bg-slate-950 text-white font-semibold text-sm hover:bg-brand-700 transition-all flex items-center gap-2.5 shadow-lg shadow-slate-900/10 hover:shadow-brand-500/20 group"
                >
                  <span>Build Brand Identity</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-5 py-3.5 rounded-full bg-white/80 hover:bg-white text-slate-800 font-semibold text-sm border border-brand-200/70 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Bot className="w-4 h-4 text-brand-600" />
                  <span>AI Co-Pilot Chat</span>
                </button>
              </div>
            </div>

            {/* Bottom Quote Badge */}
            <div className="pt-6 border-t border-brand-100/70 relative z-10 flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-slate-700 italic">
                “We envision brand creation with <span className="text-brand-600 font-bold not-italic">no limits</span>.”
              </p>
              <span className="text-[11px] text-slate-400 font-mono tracking-wider">UPSTREAM v2.4</span>
            </div>
          </div>

          {/* Right Hero Card: 3D Aesthetic Visual Canvas & Floating Feature Pills */}
          <div className="lg:col-span-6 rounded-5xl relative overflow-hidden shadow-glass border border-white/80 p-8 flex flex-col justify-between min-h-[460px] bg-gradient-to-br from-brand-200/60 via-purple-100/50 to-pink-100/40">
            {/* Background 3D image or illustration */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
                alt="3D Fluid Shapes"
                className="w-full h-full object-cover opacity-85 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-white/40" />
            </div>

            {/* Top Floating Glass Pills */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="glass-pill rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-slate-800">4,800+ Brands Launched</span>
              </div>
              <div className="glass-pill rounded-full px-3 py-1 text-xs font-semibold text-brand-900 shadow-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Zero Latency</span>
              </div>
            </div>

            {/* Center Floating 3D Showcase Card */}
            <div className="relative z-10 my-auto py-6">
              <div className="glass-panel rounded-3xl p-5 max-w-sm ml-auto backdrop-blur-xl bg-white/85 border border-white/90 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                      UP
                    </div>
                    <span className="font-bold text-xs text-slate-900">Brand Synthesis Engine</span>
                  </div>
                  <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold">
                    100% Unified
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      AI Name & Etymology
                    </span>
                    <strong className="text-slate-800">12 Options</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      Domain (.com, .io, .co)
                    </span>
                    <strong className="text-emerald-600">Live WHOIS</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-coral-500" />
                      5-Color Palette & Fonts
                    </span>
                    <strong className="text-slate-800">Automated</strong>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-500" />
                      Logo Concept Sketches
                    </span>
                    <strong className="text-purple-600">4 Styles</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pill Showcase */}
            <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="glass-panel rounded-2xl p-3 backdrop-blur-md bg-white/75 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Visual Identity</h4>
                  <p className="text-[10px] text-slate-500">Hex palettes & typography</p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-3 backdrop-blur-md bg-white/75 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-coral-500/10 flex items-center justify-center text-coral-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Instant PDF Card</h4>
                  <p className="text-[10px] text-slate-500">Investor ready one-pager</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transitional Banner Matching Moana: "Moana aspires to be the driving force..." */}
        <div className="mt-14 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/70 border border-brand-200/50 text-[11px] font-semibold text-brand-800 mb-4">
            <span>ABOUT UPSTREAM</span>
            <span className="w-1 h-1 rounded-full bg-brand-600" />
            <span>IDEA TO IDENTITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-slate-900 leading-relaxed">
            Upstream <span className="font-semibold text-brand-700">empowers founders</span> to transform abstract thoughts
            into an actionable, <span className="text-coral-600 font-semibold">cohesive brand identity</span> in seconds.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 tracking-wide uppercase font-mono">
            Choose a curated industry theme below or engineer a custom vision
          </p>
        </div>
      </div>
    </section>
  );
};
