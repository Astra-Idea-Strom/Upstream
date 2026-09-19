import React, { useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { ChatPane } from './ChatPane';
import { BrandInputForm } from '../forms/BrandInputForm';
import { BrandResultsGrid } from '../brand/BrandResultsGrid';
import { VisualFlowGuide } from '../brand/VisualFlowGuide';
import { LogoGenerationView } from '../brand/LogoGenerationView';
import { BrandIdentityCard } from '../brand/BrandIdentityCard';
import {
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Code2,
  Eye,
  FileText,
  Download,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export const StudioLayout: React.FC = () => {
  const {
    step,
    setStep,
    input,
    selectedName,
    setViewMode,
    reset,
  } = useBrandStore();

  const [previewTab, setPreviewTab] = useState<'canvas' | 'tokens' | 'export'>('canvas');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F8F6FE] text-slate-900 font-sans">
      {/* ============================================================ */}
      {/* REPLIT TOP IDE HEADER BAR */}
      {/* ============================================================ */}
      <header className="h-12 border-b border-slate-200/90 bg-white px-4 flex items-center justify-between flex-shrink-0 z-30 select-none">
        {/* Left: Project Brand & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-white font-black text-xs">
              UP
            </div>
            <span className="font-display font-black text-sm tracking-tight text-slate-950">
              UPSTREAM
            </span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Project & Active Name Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100/90 text-xs font-semibold text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[140px]">{input.industry}</span>
            <span className="text-slate-400">/</span>
            <strong className="text-brand-700 font-bold">{selectedName.name}</strong>
          </div>
        </div>

        {/* Center: Replit Stage Navigator Segmented Bar */}
        <div className="hidden md:flex items-center bg-slate-100/90 rounded-full p-1 border border-slate-200/60 shadow-2xs">
          {[
            { s: 1, label: '1. Brief' },
            { s: 2, label: '2. Names (5)' },
            { s: 3, label: '3. Palette & Fonts' },
            { s: 4, label: '4. Logos (5)' },
            { s: 5, label: '5. Download As...' },
          ].map((item) => (
            <button
              key={item.s}
              onClick={() => {
                setStep(item.s as any);
                setPreviewTab('canvas');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                step === item.s
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(5)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Card</span>
          </button>

          <button
            onClick={() => setViewMode('landing')}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Home
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN TWO-PANEL WORKSPACE (REPLIT AGENT + REPLIT CANVAS) */}
      {/* ============================================================ */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: REPLIT AGENT CONSOLE (~38% width) */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 h-full">
          <ChatPane />
        </div>

        {/* RIGHT PANEL: REPLIT WORKSPACE PREVIEW WINDOW */}
        <div className="flex-1 h-full flex flex-col overflow-hidden bg-slate-50/70 border-l border-slate-200/90">
          {/* Replit Browser / Window Bar */}
          <div className="h-10 border-b border-slate-200/90 bg-white px-3 flex items-center justify-between flex-shrink-0">
            {/* Left: Window controls & URL Pill */}
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <button
                onClick={handleRefresh}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Reload Preview"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              <div className="flex-1 px-3 py-1 rounded-xl bg-slate-100/90 text-slate-600 text-[11px] font-mono flex items-center justify-between border border-slate-200/60 truncate">
                <span className="truncate">upstream://workspace/preview/step-{step}-{['brief', 'names', 'palette', 'logos', 'export'][step - 1]}</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-2">● LIVE</span>
              </div>
            </div>

            {/* Right: Workspace Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-100/90 rounded-lg p-0.5 text-[11px] font-semibold text-slate-600 ml-3">
              <button
                onClick={() => setPreviewTab('canvas')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  previewTab === 'canvas' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <Eye className="w-3 h-3 text-brand-600" />
                <span>Canvas</span>
              </button>
              <button
                onClick={() => setPreviewTab('tokens')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  previewTab === 'tokens' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3 h-3 text-coral-500" />
                <span>Tokens Spec</span>
              </button>
              <button
                onClick={() => {
                  setStep(5);
                  setPreviewTab('canvas');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  step === 5 && previewTab === 'canvas' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                <FileText className="w-3 h-3 text-blue-500" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Replit Canvas Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {previewTab === 'tokens' ? (
              /* Tokens JSON Spec View */
              <div className="max-w-3xl mx-auto rounded-3xl bg-slate-950 text-slate-100 p-6 font-mono text-xs shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-brand-400 font-bold">// Generated Design Tokens for {selectedName.name}</span>
                  <span className="text-[10px] text-slate-500">format: JSON Spec</span>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
                  {JSON.stringify(
                    {
                      name: selectedName.name,
                      tagline: selectedName.tagline,
                      industry: input.industry,
                      palette: selectedName.visualDirection.palette,
                      typography: selectedName.visualDirection.fonts,
                      domains: selectedName.domainAvailability,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            ) : (
              /* Step-by-Step Canvas View */
              <div className="max-w-4xl mx-auto">
                {step === 1 && <BrandInputForm />}
                {step === 2 && <BrandResultsGrid />}
                {step === 3 && <VisualFlowGuide />}
                {step === 4 && <LogoGenerationView />}
                {step === 5 && <BrandIdentityCard />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
