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
} from 'lucide-react';

export const AgentChatPanel: React.FC = () => {
  const {
    chatMessages,
    isChatTyping,
    sendChatMessage,
    handleActionOption,
    input,
    selectedName,
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

      {/* Messages & Execution Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#FBFBFE]">
        {/* Collapsible Execution Steps Log */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs">
          <button
            onClick={() => setShowAgentLog(!showAgentLog)}
            className="w-full flex items-center justify-between text-left text-slate-700 font-semibold text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-brand-600" />
              <span>Agent Execution Stream ({completedStepsCount}/5 Complete)</span>
            </div>
            {showAgentLog ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showAgentLog && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5 font-mono text-[10px] text-slate-600">
              <div className={`flex items-center gap-1.5 ${hasConfirmedIndustry ? 'text-emerald-700' : 'text-slate-400'}`}>
                {hasConfirmedIndustry ? <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" /> : <span className="w-3 h-3 text-center">•</span>}
                <span>[1/5] Extract vision: {hasConfirmedIndustry ? input.industry : 'Awaiting concept'}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasConfirmedName ? 'text-emerald-700' : 'text-slate-400'}`}>
                {hasConfirmedName ? <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" /> : <span className="w-3 h-3 text-center">•</span>}
                <span>[2/5] Brand name: {hasConfirmedName ? selectedName.name : 'Pending'}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasConfirmedTagline ? 'text-emerald-700' : 'text-slate-400'}`}>
                {hasConfirmedTagline ? <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" /> : <span className="w-3 h-3 text-center">•</span>}
                <span>[3/5] Tagline: {hasConfirmedTagline ? `"${selectedName.tagline}"` : 'Pending'}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasConfirmedPalette ? 'text-emerald-700' : 'text-slate-400'}`}>
                {hasConfirmedPalette ? <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" /> : <span className="w-3 h-3 text-center">•</span>}
                <span>[4/5] 5-color harmony & Google Font pairing</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasConfirmedLogo ? 'text-emerald-700' : 'text-slate-400'}`}>
                {hasConfirmedLogo ? <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" /> : <span className="w-3 h-3 text-center">•</span>}
                <span>[5/5] Vector logo & investor brand kit export</span>
              </div>
            </div>
          )}
        </div>

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
                {msg.actionOptions.map((opt) => (
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

      {/* Docked Prompt Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
          <button
            onClick={() => sendChatMessage('We are building a coffee business and looking to have a brand')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-colors border border-slate-200/70"
          >
            ☕ Coffee Roastery
          </button>
          <button
            onClick={() => sendChatMessage('Streetwear and sneaker label for urban Gen Z creators')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-colors border border-slate-200/70"
          >
            👟 Streetwear
          </button>
          <button
            onClick={() => sendChatMessage('Autonomous AI agent cloud platform')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-colors border border-slate-200/70"
          >
            ⚡ AI SaaS
          </button>
        </div>

        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Prompt Upstream Agent (e.g. We are building a coffee business...)"
            className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-slate-950 text-white disabled:opacity-25 hover:bg-brand-600 transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
