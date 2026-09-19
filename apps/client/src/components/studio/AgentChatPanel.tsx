import React, { useState, useRef, useEffect } from 'react';
import { useBrandStore } from '../../store/brandStore';
import {
  Send,
  Sparkles,
  Bot,
  Terminal,
  Check,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const AgentChatPanel: React.FC = () => {
  const {
    chatMessages,
    isChatTyping,
    sendChatMessage,
    handleActionOption,
    input,
    step,
    hasConfirmedIndustry,
    hasConfirmedName,
    hasConfirmedTagline,
    hasConfirmedPalette,
    hasConfirmedLogo,
    reset,
  } = useBrandStore();

  const [inputVal, setInputVal] = useState('');
  const [showAgentLog, setShowAgentLog] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const completedStepsCount = [
    hasConfirmedIndustry,
    hasConfirmedName,
    hasConfirmedTagline,
    hasConfirmedPalette,
    hasConfirmedLogo,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 select-none">
      {/* Agent Header */}
      <div className="h-12 px-4 border-b border-slate-200/90 flex items-center justify-between bg-[#FAF9FE] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-coral-400 flex items-center justify-center text-white text-xs font-bold shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-slate-900 leading-none">Upstream Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5 leading-none">
              Autonomous Brand Architect · v2
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200/70 text-[10px] font-bold text-brand-700">
            {completedStepsCount}/5 Active
          </span>
          <button
            onClick={reset}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Reset Agent Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sleek Milestone Pipeline Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500 flex-shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className={`px-2 py-0.5 rounded-md transition-colors ${hasConfirmedIndustry ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200/70 text-slate-600'}`}>
            1. Concept
          </span>
          <span className="text-slate-300">›</span>
          <span className={`px-2 py-0.5 rounded-md transition-colors ${hasConfirmedName ? 'bg-emerald-100 text-emerald-800 font-bold' : step === 2 ? 'bg-amber-100 text-amber-900 font-bold ring-1 ring-amber-300 animate-pulse' : 'bg-slate-200/70 text-slate-600'}`}>
            2. Names
          </span>
          <span className="text-slate-300">›</span>
          <span className={`px-2 py-0.5 rounded-md transition-colors ${hasConfirmedTagline ? 'bg-emerald-100 text-emerald-800 font-bold' : step === 3 ? 'bg-amber-100 text-amber-900 font-bold ring-1 ring-amber-300 animate-pulse' : 'bg-slate-200/70 text-slate-600'}`}>
            3. Tagline
          </span>
          <span className="text-slate-300">›</span>
          <span className={`px-2 py-0.5 rounded-md transition-colors ${hasConfirmedPalette ? 'bg-emerald-100 text-emerald-800 font-bold' : step === 4 ? 'bg-amber-100 text-amber-900 font-bold ring-1 ring-amber-300 animate-pulse' : 'bg-slate-200/70 text-slate-600'}`}>
            4. Palette
          </span>
          <span className="text-slate-300">›</span>
          <span className={`px-2 py-0.5 rounded-md transition-colors ${hasConfirmedLogo ? 'bg-emerald-100 text-emerald-800 font-bold' : step === 5 ? 'bg-amber-100 text-amber-900 font-bold ring-1 ring-amber-300 animate-pulse' : 'bg-slate-200/70 text-slate-600'}`}>
            5. Logo
          </span>
        </div>
        <span className="text-slate-600 font-semibold hidden sm:inline">
          {completedStepsCount}/5 Complete
        </span>
      </div>

      {/* Messages & Execution Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#FBFBFE]">
        {/* Replit Agent Welcome Banner if awaiting concept */}
        {!hasConfirmedIndustry && (
          <div className="p-4 rounded-3xl bg-gradient-to-b from-orange-50/80 via-white to-white border border-orange-200/80 shadow-2xs space-y-2.5 animate-in fade-in duration-300 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-[10px] font-bold text-orange-800">
              <Sparkles className="w-3 h-3 text-[#F97356]" />
              <span>Idea to Identity · Replit Agent Mode</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight leading-tight">
              What will you build?
            </h2>

            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              Describe your startup vision below. The autonomous agent will build your brand step-by-step: name, taglines, color harmony, and vector logo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => sendChatMessage('We are building a coffee business named Ceramiq')}
                className="p-2.5 rounded-2xl bg-white hover:bg-orange-50/70 border border-slate-200/90 hover:border-orange-300 text-left transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">☕</span>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 group-hover:text-orange-950 block truncate">
                      Coffee 'Ceramiq'
                    </strong>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Direct name fast-path
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => sendChatMessage('Streetwear and sneaker label called Kinetics')}
                className="p-2.5 rounded-2xl bg-white hover:bg-purple-50/70 border border-slate-200/90 hover:border-purple-300 text-left transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">👟</span>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 group-hover:text-purple-950 block truncate">
                      Streetwear 'Kinetics'
                    </strong>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Urban sneakers & apparel
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Conversation Thread */}
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl p-3 shadow-2xs leading-relaxed select-text ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span
                className={`text-[9px] block mt-1 ${
                  msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {/* Interactive Action Option Buttons */}
            {msg.actionOptions && msg.actionOptions.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2 max-w-[95%] w-full">
                {msg.actionOptions
                  .filter((opt) => opt.actionType !== 'open_names_modal')
                  .map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleActionOption(opt)}
                      className="w-full bg-white hover:bg-brand-50 text-slate-800 hover:text-brand-800 border border-brand-200/80 rounded-xl px-3 py-2 text-xs font-bold transition-all text-left flex items-center justify-between shadow-2xs group"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
              </div>
            )}

            {/* Suggestion Chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                {msg.suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => sendChatMessage(sug)}
                    className="bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200/90 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors text-left flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-coral-500 flex-shrink-0" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isChatTyping && (
          <div className="flex items-center gap-1.5 text-brand-600 bg-white p-2.5 rounded-2xl w-fit border border-slate-200 shadow-2xs">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-mono text-slate-500 ml-1">Agent synthesizing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Replit-Style Docked Prompt Bar */}
      <div className="p-3 bg-white border-t border-slate-200/90 flex-shrink-0 space-y-2">
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
          <button
            onClick={() => sendChatMessage('We are building a coffee business named Ceramiq')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 transition-colors border border-slate-200/70 font-medium"
          >
            ☕ Coffee 'Ceramiq'
          </button>
          <button
            onClick={() => sendChatMessage('Streetwear and sneaker label called Kinetics')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors border border-slate-200/70 font-medium"
          >
            👟 Streetwear 'Kinetics'
          </button>
          <button
            onClick={() => sendChatMessage('Autonomous AI agent cloud platform named Nexa')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors border border-slate-200/70 font-medium"
          >
            ⚡ AI SaaS 'Nexa'
          </button>
        </div>

        {/* Replit Styled Multi-Line Card Box */}
        <form
          onSubmit={handleSend}
          className="w-full bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 focus-within:border-[#F97356] focus-within:ring-4 focus-within:ring-orange-500/10 transition-all p-2.5 shadow-2xs relative text-left"
        >
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Build a brand for... (e.g. Specialty coffee roastery named Ceramiq, or a streetwear label)"
            rows={2}
            className="w-full resize-none text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent leading-relaxed"
          />

          {/* Bottom Actions Row inside Box */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Add context or attachments"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-400 font-mono">Press ↵</span>
            </div>

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-6 h-6 rounded-full bg-[#F97356] disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 disabled:hover:scale-100"
              title="Send to Upstream Agent"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
