import React, { useState, useEffect } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { LogoArtwork } from './LogoArtwork';
import type { LogoStyle } from '@upstream/shared';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  Check,
  Smartphone,
  CreditCard,
  Image as ImageIcon,
  Sliders,
  Maximize2,
  Download,
  Share2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const GENERATION_STAGES = [
  { stage: 1, title: 'Deconstructing Brand Semantics', detail: 'Parsing phonetics, industry symbolism, and keyword vectors...' },
  { stage: 2, title: 'Synthesizing Optical Typography', detail: 'Adjusting kerning, tracking, and geometric balance...' },
  { stage: 3, title: 'Color Matrix & Contrast Harmonization', detail: 'Applying WCAG AAA compliant contrast against light and dark matrices...' },
  { stage: 4, title: 'Generating Vector Concept Sketches', detail: 'Rendering 4 distinct architectural logo styles and real-world mockups...' },
];

export const LogoGenerationView: React.FC = () => {
  const {
    selectedName,
    selectedLogo,
    selectLogo,
    setStep,
    input,
  } = useBrandStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [activeCanvasBg, setActiveCanvasBg] = useState<'light' | 'dark' | 'color'>('light');
  const [activeMockupTab, setActiveMockupTab] = useState<'app' | 'card' | 'social'>('app');
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('minimal');

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
          setTimeout(() => setIsGenerating(false), 800);
          return prev;
        }
      });
    }, 750);

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
          setTimeout(() => setIsGenerating(false), 700);
          return prev;
        }
      });
    }, 600);
  };

  if (!selectedName) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Please select a brand name first.</p>
        <button
          onClick={() => setStep(2)}
          className="mt-4 px-5 py-2.5 rounded-full bg-brand-600 text-white text-xs font-semibold"
        >
          Return to Brand Names
        </button>
      </div>
    );
  }

  const primaryColor = selectedName.visualDirection?.palette[0]?.hex || '#7C3AED';

  return (
    <div className="px-4 sm:px-8 py-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Step 3 Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>STEP 3 OF 4: AI LOGO CONCEPT STUDIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Logo Concept Studio for <span className="text-brand-600">{selectedName.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              AI-generated logo marks tailored to your {selectedName.visualDirection.styleDescription}.
              Preview on light, dark, and real-world mockups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-full bg-white border border-brand-200 text-brand-800 text-xs font-semibold hover:bg-brand-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate Logos</span>
            </button>

            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Back to Names
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SPECIAL MULTI-STAGE GENERATION ANIMATION SCREEN */}
        {/* ============================================================ */}
        {isGenerating ? (
          <div className="glass-panel rounded-5xl p-8 sm:p-16 border border-white/90 shadow-glass text-center relative overflow-hidden my-6">
            {/* Ambient Animated Blobs */}
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-400/25 blur-3xl animate-pulse-subtle pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-coral-400/25 blur-3xl animate-pulse-subtle pointer-events-none" />

            <div className="max-w-md mx-auto relative z-10 space-y-6">
              {/* Glowing SVG Progress Ring */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#EDE9FE"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="url(#gradient-ring)"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * (currentStageIdx + 1)) / GENERATION_STAGES.length}
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

                {/* Center Icon and % */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-600 animate-spin-slow" />
                  <span className="text-sm font-extrabold font-mono text-slate-900 mt-1">
                    {Math.round(((currentStageIdx + 1) / GENERATION_STAGES.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Stage Title and Detail */}
              <div>
                <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-[11px] font-mono font-semibold uppercase tracking-wider">
                  Phase {currentStageIdx + 1} of {GENERATION_STAGES.length}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mt-2">
                  {GENERATION_STAGES[currentStageIdx].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  {GENERATION_STAGES[currentStageIdx].detail}
                </p>
              </div>

              {/* Progress Steps Pills */}
              <div className="grid grid-cols-4 gap-2 pt-4">
                {GENERATION_STAGES.map((s, idx) => (
                  <div
                    key={s.stage}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      idx <= currentStageIdx
                        ? 'bg-gradient-to-r from-brand-600 to-coral-400'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Synthesizing SVG Bezier vector geometries for {selectedName.name}...</span>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* LOGO CONCEPTS SHOWCASE & INTERACTIVE MOCKUPS */
          /* ============================================================ */
          <div className="space-y-8">
            {/* Top Canvas Controls Bar */}
            <div className="glass-panel rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/90">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Canvas Mode:
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-full p-1">
                  <button
                    onClick={() => setActiveCanvasBg('light')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeCanvasBg === 'light'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Light Canvas
                  </button>
                  <button
                    onClick={() => setActiveCanvasBg('dark')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeCanvasBg === 'dark'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Dark Pitch
                  </button>
                  <button
                    onClick={() => setActiveCanvasBg('color')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeCanvasBg === 'color'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Brand Primary
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Vector SVG Ready & Scalable</span>
              </div>
            </div>

            {/* 4 Generated Logo Styles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { style: 'minimal' as LogoStyle, label: 'Minimalist Glyph', desc: 'Sleek monogram emblem' },
                { style: 'wordmark' as LogoStyle, label: 'Modern Wordmark', desc: 'Architectural typography mark' },
                { style: 'abstract' as LogoStyle, label: 'Abstract Prism', desc: 'Dynamic multifaceted symbol' },
                { style: 'geometric' as LogoStyle, label: 'Geometric Crest', desc: 'Golden ratio balanced badge' },
              ].map((item) => {
                const isSelected = selectedStyle === item.style;

                return (
                  <div
                    key={item.style}
                    onClick={() => setSelectedStyle(item.style)}
                    className={`group relative rounded-4xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                      isSelected
                        ? 'border-brand-500 ring-4 ring-brand-500/20 shadow-xl bg-white'
                        : 'border-white/80 hover:border-brand-200 bg-white/70 hover:bg-white shadow-glass hover:shadow-glass-hover'
                    }`}
                  >
                    {/* Top Label */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                      </div>
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Logo Visual Presentation */}
                    <div className="rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-inner py-6 bg-slate-50/50">
                      <LogoArtwork
                        brand={selectedName}
                        style={item.style}
                        variant={activeCanvasBg}
                        size="md"
                        showTagline={item.style === 'wordmark'}
                      />
                    </div>

                    {/* Select CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">SVG Concept</span>
                      <button
                        type="button"
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                          isSelected
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-slate-600 hover:text-brand-600'
                        }`}
                      >
                        {isSelected ? 'Active Selection' : 'Select Style'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-World Mockup Previews Section */}
            <div className="glass-panel rounded-5xl p-6 sm:p-10 border border-white/90 shadow-glass">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    Real-World Context
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                    How Your Brand Looks in the Wild
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live mockup simulation of {selectedName.name} across consumer touchpoints.
                  </p>
                </div>

                {/* Mockup Tabs */}
                <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
                  <button
                    onClick={() => setActiveMockupTab('app')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeMockupTab === 'app'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile App Icon</span>
                  </button>
                  <button
                    onClick={() => setActiveMockupTab('card')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeMockupTab === 'card'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Business Card</span>
                  </button>
                  <button
                    onClick={() => setActiveMockupTab('social')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeMockupTab === 'social'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Social Profile</span>
                  </button>
                </div>
              </div>

              {/* Mockup Display Box */}
              <div className="rounded-4xl bg-gradient-to-tr from-slate-900 via-brand-950 to-slate-900 p-8 sm:p-12 flex items-center justify-center min-h-[320px] shadow-2xl relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />

                {/* 1. Mobile App Icon Mockup */}
                {activeMockupTab === 'app' && (
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* App Icon */}
                    <div className="w-36 h-36 rounded-4xl bg-white shadow-2xl p-4 flex flex-col items-center justify-center border-4 border-white/20 relative">
                      <LogoArtwork brand={selectedName} style={selectedStyle} variant="light" size="sm" />
                      {/* iOS Notification Badge */}
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        1
                      </span>
                    </div>

                    {/* App description info */}
                    <div className="text-white space-y-2 max-w-xs text-center sm:text-left">
                      <span className="text-[10px] font-mono text-brand-300 uppercase tracking-wider">
                        iOS / Android Touchpoint
                      </span>
                      <h4 className="font-bold text-lg leading-tight">{selectedName.name} App</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        High visibility app store presence with strong icon contrast and recognizable geometry.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Business Card Mockup */}
                {activeMockupTab === 'card' && (
                  <div className="relative w-full max-w-md aspect-[1.75/1] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-6 sm:p-8 text-white shadow-2xl border border-white/10 flex flex-col justify-between transform hover:rotate-1 transition-transform">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono tracking-widest uppercase text-brand-300">
                          {selectedName.name}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{selectedName.tagline}</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center p-1">
                        <LogoArtwork brand={selectedName} style={selectedStyle} variant="dark" size="sm" />
                      </div>
                    </div>

                    <div className="flex items-end justify-between text-[11px] pt-4 border-t border-white/10">
                      <div>
                        <strong className="block font-bold text-white">Founder & CEO</strong>
                        <span className="text-slate-400">founder@{selectedName.name.toLowerCase()}.com</span>
                      </div>
                      <span className="text-[10px] font-mono text-brand-300">
                        {selectedName.domainAvailability.com ? `${selectedName.name.toLowerCase()}.com` : `${selectedName.name.toLowerCase()}.io`}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Social Profile Mockup */}
                {activeMockupTab === 'social' && (
                  <div className="w-full max-w-md rounded-3xl bg-white text-slate-900 overflow-hidden shadow-2xl">
                    {/* Header Banner */}
                    <div
                      className="h-24 w-full relative flex items-center justify-center p-4"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span className="text-white font-display font-extrabold text-lg opacity-80">
                        {selectedName.name}
                      </span>
                    </div>

                    {/* Avatar & Profile Info */}
                    <div className="p-4 relative">
                      <div className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-white p-1 -mt-12 mb-2 flex items-center justify-center">
                        <LogoArtwork brand={selectedName} style={selectedStyle} variant="light" size="sm" />
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                        <span>{selectedName.name}</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[9px]">
                          ✓
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500">@{selectedName.name.toLowerCase()}</p>
                      <p className="text-xs text-slate-700 mt-2">{selectedName.tagline}</p>
                      <span className="text-[10px] text-brand-600 font-mono mt-1 block">
                        🔗 {selectedName.name.toLowerCase()}.com
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Next Step Action: Export */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel rounded-4xl border border-white/90">
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-sm">Selected: {selectedName.name} ({selectedStyle})</h4>
                <p className="text-xs text-slate-500">Ready to package into a downloadable Brand Identity Card.</p>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-coral-500 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all group"
              >
                <span>Export Brand Identity Card</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
