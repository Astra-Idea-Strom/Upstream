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
import { BrandInputForm } from '../forms/BrandInputForm';
import {
  Layers,
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
    activeStudioTab,
    setActiveStudioTab,
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
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-[#F0F6FC]">
      {/* Workspace Top Navigation Bar */}
      <div className="border-b border-sky-200/60 bg-[#EBF3FA] px-4 py-2 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-20 shadow-2xs">
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
                    : 'text-slate-600 hover:text-slate-950 hover:bg-sky-100'
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
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-950 hover:bg-sky-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#F0F6FC]">
        {!hasAnyCard ? (
          /* Empty State — Brand Input Form as Primary CTA */
          <div className="max-w-2xl mx-auto my-auto min-h-[70vh] flex flex-col justify-center py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-slate-950 tracking-tight">
                  AI Brand Identity Studio
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your business vision below to generate 12 brand names, taglines, palettes & logos.
                </p>
              </div>
            </div>
            <BrandInputForm />
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
