import React, { useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { ChatPane } from './ChatPane';
import { BrandInputForm } from '../forms/BrandInputForm';
import { BrandResultsGrid } from '../brand/BrandResultsGrid';
import { VisualFlowGuide } from '../brand/VisualFlowGuide';
import { LogoGenerationView } from '../brand/LogoGenerationView';
import { BrandIdentityCard } from '../brand/BrandIdentityCard';
import {
  Plus,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Home,
  Layers,
  Palette,
  CheckCircle2,
  Bookmark,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
} from 'lucide-react';

export const StudioLayout: React.FC = () => {
  const {
    step,
    setStep,
    sessions,
    activeSessionId,
    loadSession,
    createNewProject,
    setViewMode,
    selectedName,
  } = useBrandStore();

  const [isRailCollapsed, setIsRailCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F6FE]">
      {/* ============================================================ */}
      {/* 1. LEFTMOST NAVIGATION RAIL (Antigravity & Kimi style) */}
      {/* ============================================================ */}
      <aside
        className={`h-full bg-white/80 backdrop-blur-2xl border-r border-brand-100 flex flex-col justify-between transition-all duration-300 z-20 ${
          isRailCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Top Header & New Brand Button */}
        <div className="p-3 border-b border-brand-100/70">
          <div className="flex items-center justify-between mb-3 px-1">
            {!isRailCollapsed && (
              <button
                onClick={() => setViewMode('landing')}
                className="flex items-center gap-2 group text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  UP
                </div>
                <span className="font-display font-extrabold text-sm text-slate-900">
                  UPSTREAM
                </span>
              </button>
            )}

            <button
              onClick={() => setIsRailCollapsed(!isRailCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors mx-auto"
              title={isRailCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isRailCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* + New Brand / New Chat Button */}
          <button
            onClick={createNewProject}
            className={`w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              isRailCollapsed ? 'justify-center' : 'justify-start'
            }`}
            title="New Brand Project"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!isRailCollapsed && <span>New Brand Project</span>}
          </button>
        </div>

        {/* Sessions & History List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          {!isRailCollapsed && (
            <span className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              Previous Projects & Chats
            </span>
          )}

          {sessions.map((s) => {
            const isActive = activeSessionId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => loadSession(s.id)}
                className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-brand-50 border border-brand-200 text-brand-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
                title={s.title}
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                {!isRailCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{s.title}</span>
                    <span className="block text-[10px] text-slate-400 truncate">{s.industry}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Rail Actions */}
        <div className="p-3 border-t border-brand-100/70 space-y-1">
          <button
            onClick={() => setViewMode('landing')}
            className={`w-full p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2 text-xs ${
              isRailCollapsed ? 'justify-center' : 'justify-start'
            }`}
            title="Back to Landing Page"
          >
            <Home className="w-4 h-4 flex-shrink-0 text-slate-500" />
            {!isRailCollapsed && <span>Back to Home</span>}
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. LEFT HALF: AI CHAT PANE */}
      {/* ============================================================ */}
      <div className="w-full md:w-[380px] lg:w-[420px] h-full flex-shrink-0 hidden sm:block">
        <ChatPane />
      </div>

      {/* ============================================================ */}
      {/* 3. RIGHT HALF: INTERACTIVE STUDIO STEPS */}
      {/* ============================================================ */}
      <main className="flex-1 h-full flex flex-col overflow-hidden bg-[#FAF8FF]">
        {/* Top Stepper Bar for Step Navigation */}
        <header className="h-14 border-b border-brand-100/80 bg-white/70 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
          <nav className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold py-1">
            {[
              { num: 1, label: '1. Idea Input' },
              { num: 2, label: '2. 5 Names' },
              { num: 3, label: '3. Color Palette' },
              { num: 4, label: '4. 5 Logos' },
              { num: 5, label: '5. Download As...' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                <button
                  onClick={() => setStep(s.num as any)}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    step === s.num
                      ? 'bg-slate-950 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-brand-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Active Brand Pill in Top Bar */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">{selectedName.name}</span>
          </div>
        </header>

        {/* Step Content Area */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && <BrandInputForm />}
          {step === 2 && <BrandResultsGrid />}
          {step === 3 && <VisualFlowGuide />}
          {step === 4 && <LogoGenerationView />}
          {step === 5 && <BrandIdentityCard />}
        </div>
      </main>
    </div>
  );
};
