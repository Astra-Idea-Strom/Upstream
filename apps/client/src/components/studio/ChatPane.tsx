import React, { useState, useRef, useEffect } from 'react';
import { useBrandStore } from '../../store/brandStore';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Layers,
  Palette,
  Wand2,
} from 'lucide-react';

export const ChatPane: React.FC = () => {
  const {
    chatMessages,
    isChatTyping,
    sendChatMessage,
    input,
    selectedName,
    step,
    setStep,
  } = useBrandStore();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl border-r border-brand-100/80">
      {/* Top Chat Header */}
      <div className="p-4 border-b border-brand-100/70 flex items-center justify-between bg-white/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-coral-400 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 leading-none">
              Brand Co-Pilot
            </h3>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Idea to Identity Agent
            </span>
          </div>
        </div>

        {/* Current Active Step Badge */}
        <div className="px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-[10px] font-bold text-brand-700">
          Step {step} of 5
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 shadow-2xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white border border-brand-100 text-slate-800 rounded-tl-none shadow-brand-500/5'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span
                className={`text-[9px] block mt-1.5 ${
                  msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {/* Suggestion Chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                {msg.suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => sendChatMessage(sug)}
                    className="bg-brand-50 hover:bg-brand-100/90 text-brand-700 border border-brand-200/70 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors text-left flex items-center gap-1 shadow-2xs"
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
          <div className="flex items-center gap-1.5 text-brand-600 bg-brand-50/80 p-2.5 rounded-2xl w-fit border border-brand-100">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-medium ml-1 text-slate-500">Co-pilot is analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Step Advance Shortcuts */}
      <div className="px-4 py-2 border-t border-brand-100/60 bg-brand-50/40 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-medium truncate max-w-[150px]">
          Target: <strong className="text-slate-800">{input.industry}</strong>
        </span>
        <div className="flex items-center gap-1">
          {step < 5 && (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="px-2 py-0.5 rounded-md bg-white border border-brand-200 text-brand-700 hover:bg-brand-100 font-bold flex items-center gap-1 transition-colors text-[10px]"
            >
              <span>Next Step</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-brand-100">
        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask to adjust tone, rewrite tagline, tweak palette..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-slate-950 text-white disabled:opacity-30 hover:bg-brand-600 transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
