import React, { useRef, useEffect } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { IndustryConceptCard } from './cards/IndustryConceptCard';
import { NameSelectionCard } from './cards/NameSelectionCard';
import { SelectedNameCard } from './cards/SelectedNameCard';
import { TaglineSelectionCard } from './cards/TaglineSelectionCard';
import { PaletteSelectionCard } from './cards/PaletteSelectionCard';
import { VisualPaletteCard } from './cards/VisualPaletteCard';
import { LogoSelectionCard } from './cards/LogoSelectionCard';
import { LogoArtworkCard } from './cards/LogoArtworkCard';
import { BrandKitExportCard } from './cards/BrandKitExportCard';
import { CanvaEditorToolbar } from './canva/CanvaEditorToolbar';
import { CanvaInteractiveArtboard } from './canva/CanvaInteractiveArtboard';
import {
  Layers,
  Coffee,
  Shirt,
  Cpu,
  Crown,
  RotateCcw,
} from 'lucide-react';

export const AgentWorkspace: React.FC = () => {
  const {
    hasConfirmedIndustry,
    hasConfirmedName,
    hasConfirmedPalette,
    hasConfirmedLogo,
    isNameModalOpen,
    isTaglineModalOpen,
    isPaletteModalOpen,
    isLogoModalOpen,
    step,
    sendChatMessage,
    reset,
  } = useBrandStore();

  const workspaceEndRef = useRef<HTMLDivElement>(null);

  const hasAnyCard =
    hasConfirmedIndustry ||
    hasConfirmedName ||
    hasConfirmedPalette ||
    hasConfirmedLogo ||
    isNameModalOpen;

  // Smooth scroll down slightly as new cards or choices appear on canvas
  useEffect(() => {
    if (hasAnyCard) {
      workspaceEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [
    hasConfirmedIndustry,
    hasConfirmedName,
    hasConfirmedPalette,
    hasConfirmedLogo,
    isNameModalOpen,
    isTaglineModalOpen,
    isPaletteModalOpen,
    isLogoModalOpen,
  ]);

  const activeDeliverablesCount = [
    hasConfirmedIndustry,
    hasConfirmedName,
    hasConfirmedPalette,
    hasConfirmedLogo,
    step === 5,
  ].filter(Boolean).length;

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#F8F6FE]">
      {/* Workspace Top Bar */}
      <div className="h-12 border-b border-slate-200/90 bg-white px-4 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-display font-black text-xs text-slate-900 uppercase tracking-wider">
            Autonomous Workspace Canvas
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-mono text-slate-500">
            {hasAnyCard
              ? `${activeDeliverablesCount}/5 Deliverables Materialized`
              : 'Awaiting Agent Prompt'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasAnyCard && (
            <button
              onClick={reset}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Canvas</span>
            </button>
          )}
        </div>
      </div>

      {/* Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {!hasAnyCard ? (
          /* Empty State Canvas: Autonomous Agent Ready */
          <div className="max-w-2xl mx-auto my-auto min-h-[70vh] flex flex-col items-center justify-center text-center p-8 rounded-4xl border-2 border-dashed border-brand-200/70 bg-white/60 backdrop-blur-md">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-brand-500 to-coral-400 flex items-center justify-center text-white shadow-glow-purple mb-5">
              <Layers className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-display font-black text-slate-950 tracking-tight">
              Agent Canvas Awaiting Input
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-2 leading-relaxed">
              Prompt your Upstream Agent on the left. All choices and finalized brand specifications
              will materialize right here on your canvas as interactive cards.
            </p>

            <div className="w-full mt-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Or click a starter prompt to begin immediately:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <button
                  onClick={() =>
                    sendChatMessage('We are building a coffee business and looking to have a brand')
                  }
                  className="p-3.5 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-brand-800">
                      Specialty Coffee Roastery
                    </strong>
                    <span className="text-[10px] text-slate-500 block truncate">
                      "We are building a coffee business..."
                    </span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    sendChatMessage('Streetwear and sneaker label for urban Gen Z creators')
                  }
                  className="p-3.5 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-brand-800">
                      Streetwear & Sneakers
                    </strong>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Urban athletic fashion label
                    </span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    sendChatMessage('Autonomous AI agent cloud platform for developers')
                  }
                  className="p-3.5 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-brand-800">
                      AI Developer Cloud
                    </strong>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Autonomous agent infrastructure
                    </span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    sendChatMessage('Haute couture atelier and luxury evening wear boutique')
                  }
                  className="p-3.5 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-xl bg-pink-100 text-pink-800">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-brand-800">
                      Luxury Atelier Boutique
                    </strong>
                    <span className="text-[10px] text-slate-500 block truncate">
                      European bespoke craftsmanship
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-16">
            {/* Step 1: Industry & Concept Card */}
            {hasConfirmedIndustry && <IndustryConceptCard />}

            {/* Step 2: 5 Brand Names (Choice Card vs Confirmed Card) */}
            {hasConfirmedIndustry && (!hasConfirmedName || isNameModalOpen) ? (
              <NameSelectionCard />
            ) : (
              hasConfirmedName && (
                <>
                  <SelectedNameCard />
                  {/* Canva Interactive Editor Studio & Design Controls */}
                  <CanvaEditorToolbar />
                  <CanvaInteractiveArtboard />
                </>
              )
            )}

            {/* Step 3: Strategic Taglines (Choice Card when choosing) */}
            {hasConfirmedName && isTaglineModalOpen && (
              <TaglineSelectionCard />
            )}

            {/* Step 4: Color Harmonies & Typography (Choice Card vs Confirmed Card) */}
            {isPaletteModalOpen ? (
              <PaletteSelectionCard />
            ) : (
              hasConfirmedPalette && <VisualPaletteCard />
            )}

            {/* Step 5: Vector Logo Marks (Choice Card vs Confirmed Card) */}
            {isLogoModalOpen ? (
              <LogoSelectionCard />
            ) : (
              hasConfirmedLogo && <LogoArtworkCard />
            )}

            {/* Step 6: Investor-Ready Brand Kit Export Card */}
            {(hasConfirmedLogo || step === 5) && <BrandKitExportCard />}

            <div ref={workspaceEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
