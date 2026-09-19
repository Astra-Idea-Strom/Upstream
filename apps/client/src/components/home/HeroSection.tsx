import React from 'react';
import { useBrandStore } from '../../store/brandStore';
import { ArrowRight, FileText, Palette } from 'lucide-react';

/** The five artefacts the studio produces, in flow order. */
const DELIVERABLES = [
  'Brief & positioning',
  'Brand name',
  'Tagline',
  'Colour & typography',
  'Logo & brand kit',
];

export const HeroSection: React.FC = () => {
  const { startIdentityCreation } = useBrandStore();

  return (
    <section className="relative px-4 sm:px-8 pt-4 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero Card: Typographic */}
          <div className="lg:col-span-6 glass-panel rounded-5xl p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shadow-glass border border-white/80">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-300/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-coral-300/20 blur-3xl pointer-events-none" />

            {/* Brand glyph */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-brand-200/60 p-2.5 flex items-center justify-center shadow-xs">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  <div className="rounded-md bg-brand-600" />
                  <div className="rounded-md bg-coral-400" />
                  <div className="rounded-md bg-brand-300" />
                  <div className="rounded-md bg-brand-800" />
                </div>
              </div>
            </div>

            {/* Hero main copy */}
            <div className="my-10 relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-slate-950 tracking-tight leading-[1.12]">
                Build a complete{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-coral-500 bg-clip-text text-transparent">
                  brand identity
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-md font-normal leading-relaxed">
                Describe your business. Get five brand names, taglines, a colour palette, type
                pairings and a logo mark — in one session.
              </p>

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
          </div>

          {/* Right Hero Card: Featuring the photo from the Photos folder */}
          <div className="lg:col-span-6 rounded-5xl relative overflow-hidden shadow-glass border border-white/80 p-8 flex flex-col justify-end min-h-[480px] bg-gradient-to-br from-brand-200/50 via-purple-100/40 to-pink-100/30">
            {/* Real orchid artwork from the Photos folder */}
            <div className="absolute inset-0 z-0">
              <img
                src="/photos/orchid.jpeg"
                alt="Botanical artwork used as the hero visual"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-white/30" />
            </div>

            {/* What the session produces */}
            <div className="relative z-10">
              <div className="glass-panel rounded-3xl p-5 max-w-sm ml-auto backdrop-blur-2xl bg-white/85 border border-white/90 shadow-2xl">
                <h2 className="font-bold text-xs text-slate-900">Five deliverables</h2>

                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-700">
                  {DELIVERABLES.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 border-b border-slate-100 py-1 last:border-b-0"
                    >
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom feature badges */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-6">
              <div className="glass-panel rounded-2xl p-3 backdrop-blur-md bg-white/80 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Visual direction</h4>
                  <p className="text-[10px] text-slate-500">Colour, type & guides</p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-3 backdrop-blur-md bg-white/80 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-coral-500/10 flex items-center justify-center text-coral-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Export</h4>
                  <p className="text-[10px] text-slate-500">PDF, PNG & JSON tokens</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-header */}
        <div className="mt-14 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-slate-900 leading-relaxed">
            Upstream turns a business idea into a{' '}
            <span className="font-semibold text-brand-700">complete brand identity</span> in one
            session.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500">
            Pick a starter kit below, or build from scratch.
          </p>
        </div>
      </div>
    </section>
  );
};
