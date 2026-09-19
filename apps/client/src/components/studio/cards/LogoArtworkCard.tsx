import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import {
  Sparkles,
  RotateCcw,
  Smartphone,
  CreditCard,
  Image as ImageIcon,
} from 'lucide-react';
import type { LogoStyle } from '@upstream/shared';

const STYLE_LABELS: Record<LogoStyle, { label: string; desc: string }> = {
  minimal: { label: 'Minimalist Glyph', desc: 'Continuous-line monogram' },
  wordmark: { label: 'Modern Wordmark', desc: 'Architectural typography' },
  abstract: { label: 'Abstract Prism', desc: 'Dynamic multifaceted mark' },
  geometric: { label: 'Geometric Crest', desc: 'Golden ratio balanced badge' },
  illustrative: { label: 'Illustrative Emblem', desc: 'Organic sculptural symbol' },
};

export const LogoArtworkCard: React.FC = () => {
  const { selectedName, selectedLogoStyle, openLogoModal, setStep } = useBrandStore();
  const [activeBg, setActiveBg] = useState<'light' | 'dark' | 'brand'>('light');
  const [activeTab, setActiveMockupTab] = useState<'icon' | 'card' | 'banner'>('icon');

  const info = STYLE_LABELS[selectedLogoStyle] || STYLE_LABELS.minimal;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs relative overflow-hidden transition-all hover:border-brand-300 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/70 text-[10px] font-bold text-brand-800">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>CARD 4: VECTOR LOGO MARKS</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYNTHESIZED
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openLogoModal}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Change Style</span>
          </button>
          <button
            onClick={() => setStep(5)}
            className="px-3 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-colors shadow-2xs"
          >
            Export Kit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className={`w-full sm:w-48 h-44 rounded-3xl flex items-center justify-center p-6 transition-all duration-300 border shadow-inner ${
              activeBg === 'dark'
                ? 'bg-slate-950 border-slate-800 text-white'
                : activeBg === 'brand'
                ? 'bg-gradient-to-br from-brand-600 to-coral-500 border-transparent text-white'
                : 'bg-slate-50 border-slate-200/80 text-slate-900'
            }`}
          >
            <LogoArtwork
              brand={selectedName}
              style={selectedLogoStyle}
              variant={activeBg === 'brand' ? 'color' : activeBg}
              size="md"
            />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Architectural Style
              </span>
              <h4 className="text-base font-bold text-slate-900 font-display">
                {info.label}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {info.desc} · Scalable vector SVG mathematics with calibrated optical balance.
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Preview Contrast
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveBg('light')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    activeBg === 'light'
                      ? 'bg-white border-slate-900 text-slate-900 shadow-2xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Light Mode
                </button>
                <button
                  onClick={() => setActiveBg('dark')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    activeBg === 'dark'
                      ? 'bg-slate-950 border-slate-950 text-white shadow-2xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Dark Mode
                </button>
                <button
                  onClick={() => setActiveBg('brand')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    activeBg === 'brand'
                      ? 'bg-brand-600 border-brand-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Brand Gradient
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Real-World Touchpoint Mockups
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveMockupTab('icon')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'icon' ? 'bg-brand-100 text-brand-800' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Mobile App Icon"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveMockupTab('card')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'card' ? 'bg-brand-100 text-brand-800' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Business Card"
              >
                <CreditCard className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveMockupTab('banner')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'banner' ? 'bg-brand-100 text-brand-800' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Social Banner"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-center">
            {activeTab === 'icon' && (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-2 shadow-lg flex items-center justify-center text-white overflow-hidden">
                <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="dark" size="sm" />
              </div>
            )}
            {activeTab === 'card' && (
              <div className="w-64 h-36 rounded-2xl bg-white border border-slate-200 shadow-md p-3 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between">
                  <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="light" size="sm" />
                  <span className="text-[10px] font-mono text-slate-400">HQ / Atelier</span>
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{selectedName.name}</h5>
                  <p className="text-[10px] text-slate-400 italic">{selectedName.tagline}</p>
                </div>
              </div>
            )}
            {activeTab === 'banner' && (
              <div className="w-full h-24 rounded-2xl bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 p-3 flex items-center justify-between text-white overflow-hidden">
                <div>
                  <h5 className="font-black text-lg tracking-tight">{selectedName.name}</h5>
                  <p className="text-xs text-brand-200">{selectedName.tagline}</p>
                </div>
                <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="dark" size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
