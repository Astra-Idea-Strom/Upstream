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
import { BrandMoodBoardCard } from './cards/BrandMoodBoardCard';
import { SocialMediaPreviewCard } from './cards/SocialMediaPreviewCard';
import { CompetitorComparisonCard } from './cards/CompetitorComparisonCard';
import { BrandGuidelinesCard } from './cards/BrandGuidelinesCard';
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
  Sparkles,
  Image as ImageIcon,
  Share2,
  Compass,
  BookOpen,
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
    activeStudioTab,
    setActiveStudioTab,
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

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#FBFBFE]">
      {/* Workspace Top Navigation Bar */}
      <div className="border-b border-slate-200/90 bg-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
            Brand Studio Canvas
          </span>
        </div>

        {/* Deliverables View Switcher Tabs */}
        {hasConfirmedName && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'identity', label: 'Identity & Canva' },
              { id: 'moodboard', label: 'Mood Board' },
              { id: 'social', label: 'Social Mockups' },
              { id: 'competitors', label: 'Competitor Map' },
              { id: 'guidelines', label: 'Guidelines (PDF)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStudioTab(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeStudioTab === tab.id
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {hasAnyCard && (
            <button
              onClick={reset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {!hasAnyCard ? (
          /* Empty State Canvas */
          <div className="max-w-2xl mx-auto my-auto min-h-[70vh] flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white mb-4 shadow-sm">
              <Layers className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-display font-bold text-slate-950 tracking-tight">
              Brand Studio Awaiting Direction
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed font-normal">
              Enter your vision on the left. Names, logo marks, mood boards, social media mockups, and competitor benchmarks will materialize here.
            </p>

            <div className="w-full mt-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Starter Prompts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <button
                  onClick={() =>
                    sendChatMessage('We are building a coffee business and looking to have a brand')
                  }
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-slate-950">
                      Specialty Coffee
                    </strong>
                    <span className="text-[10px] text-slate-400 block truncate">
                      "We are building a coffee business..."
                    </span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    sendChatMessage('Streetwear and sneaker label for urban Gen Z creators')
                  }
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-800">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-slate-950">
                      Streetwear & Sneakers
                    </strong>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Urban athletic fashion label
                    </span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    sendChatMessage('Autonomous AI agent cloud platform for developers')
                  }
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-slate-950">
                      AI Developer Cloud
                    </strong>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Autonomous agent infrastructure
                    </span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    sendChatMessage('Haute couture atelier and luxury evening wear boutique')
                  }
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-3 shadow-2xs group"
                >
                  <div className="p-2 rounded-lg bg-pink-50 text-pink-800">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-slate-900 block group-hover:text-slate-950">
                      Luxury Atelier
                    </strong>
                    <span className="text-[10px] text-slate-400 block truncate">
                      European bespoke craftsmanship
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {/* ================= 1. IDENTITY & CANVA DELIVERABLES ================= */}
            {activeStudioTab === 'identity' && (
              <>
                {/* Step 1: Industry & Concept Card */}
                {hasConfirmedIndustry && <IndustryConceptCard />}

                {/* Step 2: 5 Brand Names (Choice vs Confirmed) */}
                {hasConfirmedIndustry && (!hasConfirmedName || isNameModalOpen) ? (
                  <NameSelectionCard />
                ) : (
                  hasConfirmedName && (
                    <>
                      <SelectedNameCard />
                      <CanvaEditorToolbar />
                      <CanvaInteractiveArtboard />
                    </>
                  )
                )}

                {/* Step 3: Strategic Taglines */}
                {hasConfirmedName && isTaglineModalOpen && (
                  <TaglineSelectionCard />
                )}

                {/* Step 4: Color Harmonies & Typography */}
                {isPaletteModalOpen ? (
                  <PaletteSelectionCard />
                ) : (
                  hasConfirmedPalette && <VisualPaletteCard />
                )}

                {/* Step 5: Vector Logo Marks */}
                {isLogoModalOpen ? (
                  <LogoSelectionCard />
                ) : (
                  hasConfirmedLogo && <LogoArtworkCard />
                )}

                {/* Brand Kit Export Card */}
                {(hasConfirmedLogo || step === 5) && <BrandKitExportCard />}
              </>
            )}

            {/* ================= 2. MOOD BOARD GENERATOR ================= */}
            {activeStudioTab === 'moodboard' && (
              <BrandMoodBoardCard />
            )}

            {/* ================= 3. SOCIAL MEDIA PREVIEWS ================= */}
            {activeStudioTab === 'social' && (
              <SocialMediaPreviewCard />
            )}

            {/* ================= 4. COMPETITOR BENCHMARK & 2X2 MAP ================= */}
            {activeStudioTab === 'competitors' && (
              <CompetitorComparisonCard />
            )}

            {/* ================= 5. BRAND GUIDELINES MANUAL ================= */}
            {activeStudioTab === 'guidelines' && (
              <>
                <BrandGuidelinesCard />
                <BrandKitExportCard />
              </>
            )}

            <div ref={workspaceEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
