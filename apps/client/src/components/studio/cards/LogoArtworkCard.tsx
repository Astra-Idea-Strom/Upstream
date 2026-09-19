import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { RotateCcw } from 'lucide-react';
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

  const info = STYLE_LABELS[selectedLogoStyle] || STYLE_LABELS.minimal;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Vector Identity
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Vector Logo Mark
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {info.label} · {info.desc}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={openLogoModal}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            Change Style
          </button>
          <button
            onClick={() => setStep(5)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Export Kit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className={`w-full sm:w-48 h-40 rounded-2xl flex items-center justify-center p-6 transition-all duration-200 border shadow-inner ${
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
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Contrast Preview
              </span>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setActiveBg('light')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    activeBg === 'light'
                      ? 'bg-white border-slate-900 text-slate-900 font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Light Canvas
                </button>
                <button
                  onClick={() => setActiveBg('dark')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    activeBg === 'dark'
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Dark Canvas
                </button>
                <button
                  onClick={() => setActiveBg('brand')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    activeBg === 'brand'
                      ? 'bg-brand-600 border-brand-600 text-white font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Gradient Canvas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
