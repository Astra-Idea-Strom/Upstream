import React, { useMemo } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getCompetitorsForIndustry, type CompetitorBrand } from '../../../mock/competitorData';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  Compass,
  Layers,
} from 'lucide-react';

export const CompetitorComparisonCard: React.FC = () => {
  const { selectedName, input } = useBrandStore();

  const competitorData = useMemo(() => {
    return getCompetitorsForIndustry(input.industry || selectedName.name);
  }, [input.industry, selectedName.name]);

  // Perceptual Map coordinate converter:
  // x: -100 to 100 -> 10% to 90%
  // y: -100 to 100 -> 90% to 10% (inverted for SVG canvas)
  const toSvgX = (x: number) => 50 + (x * 40) / 100;
  const toSvgY = (y: number) => 50 - (y * 40) / 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Market Assessment & Differentiation
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Competitor Brand Benchmark
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            How <span className="font-semibold text-slate-900">{selectedName.name}</span> positions and differentiates against key players in {competitorData.industry}.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold self-start sm:self-auto">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          <span>{competitorData.competitors.length} Benchmarked Brands</span>
        </div>
      </div>

      {/* 2x2 Perceptual Positioning Map */}
      <div className="mb-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-brand-600" />
            <span>2x2 Perceptual Market Map</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Opportunity Matrix
          </span>
        </div>

        {/* Map Canvas */}
        <div className="relative w-full h-64 sm:h-72 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          {/* Axis Labels */}
          <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            ▲ Ultra-Premium / Bespoke
          </span>
          <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            ▼ Mass Market / Accessible
          </span>
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            Heritage / Traditional
          </span>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest [writing-mode:vertical-rl]">
            Modern / Futuristic
          </span>

          {/* Crosshair Lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200" />

          {/* Competitor Pins */}
          {competitorData.competitors.map((comp, cIdx) => {
            const leftPct = toSvgX(comp.mapCoords.x);
            const topPct = toSvgY(comp.mapCoords.y);

            return (
              <div
                key={cIdx}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-slate-400 group-hover:bg-slate-700 border-2 border-white shadow-2xs transition-colors" />
                <span className="text-[10px] font-semibold text-slate-600 bg-white/95 border border-slate-200/80 px-1.5 py-0.5 rounded shadow-2xs mt-1 whitespace-nowrap">
                  {comp.name}
                </span>
              </div>
            );
          })}

          {/* User's Brand Pin (Highlighted & Glowing) */}
          <div
            style={{
              left: `${toSvgX(competitorData.userBrandCoords.x)}%`,
              top: `${toSvgY(competitorData.userBrandCoords.y)}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-bounce"
          >
            <div className="relative">
              <span className="w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-md block" />
              <span className="w-4 h-4 rounded-full bg-brand-500 animate-ping absolute inset-0 opacity-75" />
            </div>
            <span className="text-[11px] font-black text-white bg-slate-950 px-2 py-0.5 rounded-md shadow-md mt-1 whitespace-nowrap flex items-center gap-1">
              <span>★ {selectedName.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Competitor Cards List */}
      <div className="space-y-3.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
          Side-by-Side Differentiation Breakdown
        </span>

        {competitorData.competitors.map((comp, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <h4 className="font-bold text-base text-slate-900 font-display">
                  {comp.name}
                </h4>
                <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {comp.positioning}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {comp.pricePoint}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">Palette:</span>
                <div className="flex items-center -space-x-1">
                  {comp.palette.map((sw, sIdx) => (
                    <div
                      key={sIdx}
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                      style={{ backgroundColor: sw.hex }}
                      title={sw.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic font-serif">
              "{comp.tagline}" · <span className="text-slate-600 not-italic font-sans">{comp.visualStyle}</span>
            </p>

            {/* Tactical Differentiation Callout */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-bold text-emerald-900">Why {selectedName.name} Wins: </strong>
                {comp.differentiationAgainst}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
