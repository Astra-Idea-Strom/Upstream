import React, { useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Image as ImageIcon,
  MessageSquare,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Flame,
  Palette,
} from 'lucide-react';

export const LeftSidebarChat: React.FC = () => {
  const {
    isSidebarOpen,
    setSidebarOpen,
    activeSidebarTab,
    setActiveSidebarTab,
    chatMessages,
    isChatTyping,
    sendChatMessage,
    input,
    setInput,
    selectedName,
  } = useBrandStore();

  const [inputMessage, setInputMessage] = useState('');
  const [assetPrompt, setAssetPrompt] = useState('3D organic botanical glass podium with lavender bloom');
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<string[]>([
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
  ]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleGenerateAsset = () => {
    setIsGeneratingAsset(true);
    setTimeout(() => {
      const assetPool = [
        'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      ];
      const randomImg = assetPool[Math.floor(Math.random() * assetPool.length)];
      setGeneratedAssets((prev) => [randomImg, ...prev]);
      setIsGeneratingAsset(false);
    }, 1200);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sliding Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-full sm:w-[420px] bg-white/90 backdrop-blur-2xl border-r border-brand-100 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-brand-100/80 flex items-center justify-between bg-gradient-to-r from-brand-50/80 via-white to-coral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-coral-400 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 leading-tight">
                Brand Intelligence Studio
              </h2>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Idea to Identity Co-pilot
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 bg-slate-50/60">
          <button
            onClick={() => setActiveSidebarTab('chat')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeSidebarTab === 'chat'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Branding Chat
          </button>
          <button
            onClick={() => setActiveSidebarTab('assets')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeSidebarTab === 'assets'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Visual Mood Board Gen
          </button>
        </div>

        {/* TAB 1: AI Chat Assistant */}
        {activeSidebarTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-tr-none'
                        : 'bg-white border border-brand-100/90 text-slate-800 rounded-tl-none shadow-brand-500/5'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1.5 ${
                        msg.sender === 'user' ? 'text-brand-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            sendChatMessage(sug);
                          }}
                          className="bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200/60 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors text-left flex items-center gap-1"
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
                <div className="flex items-center gap-1.5 text-brand-600 bg-brand-50/70 p-2.5 rounded-2xl w-fit border border-brand-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium ml-1 text-slate-500">Co-pilot is thinking...</span>
                </div>
              )}
            </div>

            {/* Quick Context Summary Pill */}
            <div className="px-4 py-2 bg-brand-50/50 border-t border-brand-100/60 flex items-center justify-between text-[11px] text-slate-600">
              <span className="truncate max-w-[200px]">
                Target: <strong className="text-brand-800">{input.industry}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white border border-brand-200 text-brand-700 font-semibold uppercase text-[9px]">
                {input.tone}
              </span>
            </div>

            {/* Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-brand-100 bg-white">
              <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-200/80 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask for taglines, visual direction, critique..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-brand-600 to-coral-500 text-white disabled:opacity-40 hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Visual Mood Board & Image Generator */}
        {activeSidebarTab === 'assets' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="bg-gradient-to-br from-brand-50 via-white to-coral-50 rounded-2xl p-3.5 border border-brand-100">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-800">AI Visual Concept Synthesizer</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Generate aesthetic 3D textures and mood board images to inspire your brand identity package.
              </p>

              {/* Prompt Input */}
              <div className="mt-3 space-y-2">
                <textarea
                  rows={2}
                  value={assetPrompt}
                  onChange={(e) => setAssetPrompt(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-200/80 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Describe your mood board visual..."
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1">
                  {[
                    '3D Clay Minimalist',
                    'Botanical Silk & Glass',
                    'Futuristic Neon Prism',
                    'Earthy Ceramic Terra',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAssetPrompt(`${preset} visual for ${input.industry}`)}
                      className="px-2 py-0.5 rounded-full bg-white border border-brand-100 text-[10px] text-slate-600 hover:text-brand-600 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerateAsset}
                  disabled={isGeneratingAsset}
                  className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-coral-500 text-white font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  {isGeneratingAsset ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Mood Board...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Generate Mood Visual</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Gallery of Mood Assets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700">Curated Mood Board</span>
                <span className="text-[10px] text-slate-400">{generatedAssets.length} visuals</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {generatedAssets.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden aspect-square border border-brand-100 shadow-sm"
                  >
                    <img
                      src={img}
                      alt="Brand Inspiration"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-white text-[10px]">
                      <span>Inspiration #{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
