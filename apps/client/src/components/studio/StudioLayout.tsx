import React, { useState, useEffect, useCallback } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { AgentChatPanel } from './AgentChatPanel';
import { AgentWorkspace } from './AgentWorkspace';
import { Download, RotateCcw } from 'lucide-react';

export const StudioLayout: React.FC = () => {
  const {
    input,
    selectedName,
    hasConfirmedName,
    setViewMode,
    isNameModalOpen,
    isTaglineModalOpen,
    isPaletteModalOpen,
    isLogoModalOpen,
    setStep,
    reset,
  } = useBrandStore();

  // Resizable Panels State with persistence
  const [chatWidth, setChatWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upstream_chat_width');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 280 && parsed <= 900) {
          return parsed;
        }
      }
    }
    return 420;
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number) => {
      const minWidth = 280;
      const maxWidth = Math.max(minWidth, Math.min(window.innerWidth - 380, 850));
      const newWidth = Math.max(minWidth, Math.min(clientX, maxWidth));
      setChatWidth(newWidth);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      localStorage.setItem('upstream_chat_width', chatWidth.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, chatWidth]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F0F6FC] text-slate-900 font-sans">
      {/* ============================================================ */}
      {/* TOP AGENT PORTAL HEADER (No top options patch) */}
      {/* ============================================================ */}
      <header className="h-12 border-b border-sky-200/60 bg-[#F4F9FD] px-4 flex items-center justify-between flex-shrink-0 z-30 select-none">
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

          <div className="h-4 w-[1px] bg-sky-200/80" />

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sky-100/70 border border-sky-200/60 text-xs font-semibold text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[160px]">{input.industry || 'Brand Venture'}</span>
            {hasConfirmedName && (
              <>
                <span className="text-slate-400">/</span>
                <strong className="text-brand-700 font-bold">{selectedName.name}</strong>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasConfirmedName && (
            <button
              onClick={() => setStep(5)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Kit</span>
            </button>
          )}

          <button
            onClick={reset}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Reset Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setViewMode('landing')}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Home
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN TWO-PANEL WORKSPACE (Chat Interface on Left, Workspace Cards on Right) */}
      {/* ============================================================ */}
      <div className={`flex-1 flex overflow-hidden relative ${isDragging ? 'select-none' : ''}`}>
        {/* Left Panel: Chat Interface */}
        <div
          style={{ width: `${chatWidth}px` }}
          className="max-md:!w-full flex-shrink-0 h-full overflow-hidden"
        >
          <AgentChatPanel />
        </div>

        {/* Resizable Divider Handle (Visible on md+) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={() => {
            setChatWidth(420);
            localStorage.setItem('upstream_chat_width', '420');
          }}
          title="Drag to resize panels (Double-click to reset)"
          className={`hidden md:flex items-center justify-center w-2 -ml-[1px] relative z-20 cursor-col-resize group transition-colors duration-150 flex-shrink-0 select-none ${
            isDragging
              ? 'bg-sky-500 ring-2 ring-sky-400/40'
              : 'bg-sky-200/80 hover:bg-sky-400'
          }`}
        >
          {/* Subtle tactile grip pill */}
          <div
            className={`w-0.5 h-8 rounded-full transition-colors ${
              isDragging ? 'bg-white' : 'bg-sky-400 group-hover:bg-white'
            }`}
          />
        </div>

        {/* Right Panel: Workspace Canvas */}
        <div className="flex-1 h-full flex flex-col overflow-hidden min-w-[340px]">
          <AgentWorkspace />
        </div>

        {/* Transparent overlay during dragging to prevent child pointer event interception */}
        {isDragging && (
          <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
        )}
      </div>
    </div>
  );
};
