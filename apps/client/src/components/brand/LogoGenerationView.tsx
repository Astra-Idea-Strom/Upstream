import React, { useState, useEffect } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { LogoArtwork } from './LogoArtwork';
import type { LogoStyle } from '@upstream/shared';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Check,
  Smartphone,
  CreditCard,
  Image as ImageIcon,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';

const GENERATION_STAGES = [
  { stage: 1, title: 'Parsing Semantic Geometry', detail: 'Deconstructing brand essence, phonetics, and industry vectors...' },
  { stage: 2, title: 'Synthesizing Optical Typography', detail: 'Calibrating kerning, tracking, and letterform balance...' },
  { stage: 3, title: 'Harmonizing Light & Dark Contrast', detail: 'Applying WCAG compliant chromatic contrast matrices...' },
  { stage: 4, title: 'Synthesizing 5 Vector Logo Marks', detail: 'Rendering 5 distinct architectural styles with real-world touchpoint mockups...' },
];

const FIVE_LOGO_STYLES: { style: LogoStyle; label: string; desc: string }[] = [
  { style: 'minimal', label: 'Minimalist Glyph', desc: 'Continuous-line monogram' },
  { style: 'wordmark', label: 'Modern Wordmark', desc: 'Architectural typography' },
  { style: 'abstract', label: 'Abstract Prism', desc: 'Dynamic multifaceted mark' },
  { style: 'geometric', label: 'Geometric Crest', desc: 'Golden ratio balanced badge' },
  { style: 'illustrative', label: 'Illustrative Emblem', desc: 'Organic sculptural symbol' },
];

export const LogoGenerationView: React.FC = () => {
  const {
    selectedName,
    selectedLogoStyle,
    setSelectedLogoStyle,
    setStep,
  } = useBrandStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [activeCanvasBg, setActiveCanvasBg] = useState<'light' | 'dark' | 'color'>('light');
  const [activeMockupTab, setActiveMockupTab] = useState<'app' | 'card' | 'social'>('app');

  // Trigger rich multi-stage generation sequence
  useEffect(() => {
    setIsGenerating(true);
    setCurrentStageIdx(0);

    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < GENERATION_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => setIsGenerating(false), 700);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [selectedName]);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setCurrentStageIdx(0);

    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < GENERATION_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => setIsGenerating(false), 600);
          return prev;
        }
      });
    }, 550);
  };

  const primaryColor = selectedName.visualDirection?.palette[0]?.hex || '#7C3AED';

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>STEP 4 OF 5: 5 AI LOGO CONCEPTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Select Your Logo Mark for <span className="text-brand-600">{selectedName.name}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any logo mark to select it as your primary brand emblem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-full bg-white border border-brand-200 text-brand-800 text-xs font-semibold hover:bg-brand-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate 5 Logos</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Back to Visual Guide</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SPECIAL MULTI-STAGE GENERATION ANIMATION SCREEN */}
      {/* ============================================================ */}
      {isGenerating ? (
        <div className="glass-panel rounded-4xl p-8 sm:p-14 border border-white/90 shadow-glass text-center relative overflow-hidden my-4">
          <div className="max-w-md mx-auto relative z-10 space-y-6">
            {/* Glowing SVG Progress Ring */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#EDE9FE"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient-ring)"
                  strokeWidth="8"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (251 * (currentStageIdx + 1)) / GENERATION_STAGES.length}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#FB7185" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-600 animate-spin-slow" />
                <span className="text-xs font-extrabold font-mono text-slate-900 mt-0.5">
                  {Math.round(((currentStageIdx + 1) / GENERATION_STAGES.length) * 100)}%
                </span>
              </div>
            </div>

            <div>
              <span className="px-3 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-mono font-semibold uppercase tracking-wider">
                Phase {currentStageIdx + 1} of {GENERATION_STAGES.length}
              </span>
              <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mt-1.5">
                {GENERATION_STAGES[currentStageIdx].title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {GENERATION_STAGES[currentStageIdx].detail}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-2">
              {GENERATION_STAGES.map((s, idx) => (
                <div
                  key={s.stage}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx <= currentStageIdx
                      ? 'bg-gradient-to-r from-brand-600 to-coral-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* 5 LOGO CONCEPTS GRID WITH CARD SELECTION */
        /* ============================================================ */
        <div className="space-y-6">
          {/* Canvas Mode Switcher Bar */}
          <div className="glass-panel rounded-3xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/90">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Canvas Mode:
              </span>
              <div className="flex items-center gap-1 bg-slate-100/90 rounded-full p-1">
                <button
                  onClick={() => setActiveCanvasBg('light')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeCanvasBg === 'light'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setActiveCanvasBg('dark')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeCanvasBg === 'dark'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setActiveCanvasBg('color')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeCanvasBg === 'color'
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Brand Color
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>5 Vector Logos Ready</span>
            </div>
          </div>

          {/* 5 Generated Logo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIVE_LOGO_STYLES.map((item) => {
              const isSelected = selectedLogoStyle === item.style;

              return (
                <div
                  key={item.style}
                  onClick={() => setSelectedLogoStyle(item.style)}
                  className={`group relative rounded-3xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                    isSelected
                      ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-md bg-white'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white shadow-2xs'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  {/* Logo Artwork Center Display */}
                  <div className="rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center py-4 bg-slate-50/50">
                    <LogoArtwork
                      brand={selectedName}
                      style={item.style}
                      variant={activeCanvasBg}
                      size="sm"
                      showTagline={item.style === 'wordmark'}
                    />
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">SVG Ready</span>
                    <span
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-brand-600' : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      {isSelected ? 'Selected ✓' : 'Click to Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-World Mockup Box */}
          <div className="p-5 rounded-3xl bg-slate-950 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400">
                  Touchpoint Mockup
                </span>
                <h4 className="text-sm font-bold text-white">
                  {selectedName.name} in Context ({selectedLogoStyle})
                </h4>
              </div>

              <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 text-xs">
                <button
                  onClick={() => setActiveMockupTab('app')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeMockupTab === 'app' ? 'bg-white text-slate-900' : 'text-slate-300'
                  }`}
                >
                  App Icon
                </button>
                <button
                  onClick={() => setActiveMockupTab('card')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeMockupTab === 'card' ? 'bg-white text-slate-900' : 'text-slate-300'
                  }`}
                >
                  Business Card
                </button>
                <button
                  onClick={() => setActiveMockupTab('social')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activeMockupTab === 'social' ? 'bg-white text-slate-900' : 'text-slate-300'
                  }`}
                >
                  Social Profile
                </button>
              </div>
            </div>

            {/* Mockup Canvas */}
            <div className="flex items-center justify-center py-6 min-h-[160px]">
              {activeMockupTab === 'app' && (
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-white shadow-xl p-2 flex items-center justify-center relative">
                    <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="light" size="sm" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                      1
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{selectedName.name} Mobile App</span>
                    <span className="text-[11px] text-slate-400">iOS App Store & Android presence</span>
                  </div>
                </div>
              )}

              {activeMockupTab === 'card' && (
                <div className="w-full max-w-sm aspect-[1.8/1] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white border border-white/20 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{selectedName.name}</h4>
                      <p className="text-[10px] text-slate-400">{selectedName.tagline}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                      <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="dark" size="sm" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between text-[10px] pt-3 border-t border-white/10 text-slate-400">
                    <span>Founder & Visionary</span>
                    <span className="font-mono text-brand-300">{selectedName.name.toLowerCase()}.com</span>
                  </div>
                </div>
              )}

              {activeMockupTab === 'social' && (
                <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 overflow-hidden shadow-xl">
                  <div className="h-16 w-full" style={{ backgroundColor: primaryColor }} />
                  <div className="p-3">
                    <div className="w-12 h-12 rounded-full bg-white shadow-md -mt-9 mb-1 p-1 flex items-center justify-center border border-slate-100">
                      <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="light" size="sm" />
                    </div>
                    <h5 className="font-bold text-xs">{selectedName.name}</h5>
                    <p className="text-[10px] text-slate-500">@{selectedName.name.toLowerCase()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action: Proceed to Download As... */}
          <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-brand-100 shadow-sm">
            <div>
              <span className="text-xs text-slate-500">Selected Style:</span>
              <h4 className="text-sm font-bold text-slate-900 capitalize">{selectedLogoStyle} Mark</h4>
            </div>

            <button
              onClick={() => setStep(5)}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Download Brand Identity (Step 5)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
