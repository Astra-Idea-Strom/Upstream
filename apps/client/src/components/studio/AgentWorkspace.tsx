import React, { useEffect, useRef } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { IndustryConceptCard } from './cards/IndustryConceptCard';
import { NameSelectionCard } from './cards/NameSelectionCard';
import { SelectedNameCard } from './cards/SelectedNameCard';
import { TaglineSelectionCard } from './cards/TaglineSelectionCard';
import { TaglineCard } from './cards/TaglineCard';
import { PaletteSelectionCard } from './cards/PaletteSelectionCard';
import { VisualPaletteCard } from './cards/VisualPaletteCard';
import { LogoSelectionCard } from './cards/LogoSelectionCard';
import { LogoArtworkCard } from './cards/LogoArtworkCard';
import { BrandKitExportCard } from './cards/BrandKitExportCard';
import { CanvaEditorToolbar } from './canva/CanvaEditorToolbar';
import { CanvaInteractiveArtboard } from './canva/CanvaInteractiveArtboard';
import { Skeleton, StatusPill } from '../ui/primitives';
import { useFlowProgress } from '../../hooks/useFlowProgress';
import { stepCardId } from '../../lib/dom';
import type { StudioStepKey } from '../../lib/steps';
import { LayoutGrid, PenLine } from 'lucide-react';

/**
 * Renders one step's slot on the canvas.
 *
 * `pending` wins over everything (the agent is mid-generation), then the
 * chooser while the step is active or explicitly reopened, then the settled
 * artefact. Keeping this in one place is what guarantees a step is never
 * blank — the previous implementation advanced through 700 ms timers, so there
 * were windows where a completed card had unmounted and the next had not yet
 * appeared.
 */
const StepSlot: React.FC<{
  pending: React.ReactNode;
  showChooser: boolean;
  chooser: React.ReactNode;
  confirmed: React.ReactNode;
}> = ({ pending, showChooser, chooser, confirmed }) => {
  if (pending) return <>{pending}</>;
  return <>{showChooser ? chooser : confirmed}</>;
};

/**
 * The canvas: every artefact the agent has produced for this session, in flow
 * order.
 *
 * The pane header is deliberately quiet — a label and the next action. Progress
 * itself lives in the top-bar step rail, so the two can never disagree.
 */
export const AgentWorkspace: React.FC = () => {
  const {
    hasConfirmedIndustry,
    hasConfirmedName,
    hasConfirmedTagline,
    hasConfirmedPalette,
    hasConfirmedLogo,
    isLoadingNames,
    isAutoPilot,
    isNameModalOpen,
    isTaglineModalOpen,
    isPaletteModalOpen,
    isLogoModalOpen,
  } = useBrandStore();

  const progress = useFlowProgress();
  const activeStep = progress.steps.find((entry) => entry.status === 'active')?.step ?? null;

  const statusOf = (key: StudioStepKey) =>
    progress.steps.find((entry) => entry.step.key === key)?.status;

  const isActive = (key: StudioStepKey) => statusOf(key) === 'active';

  /** A chooser is shown only when the user is the one making the decision. */
  const chooserVisible = (key: StudioStepKey, reopened: boolean) =>
    !isAutoPilot && (isActive(key) || reopened);

  /** Placeholder for a step the agent is currently generating. */
  const agentPending = (key: StudioStepKey, label: string) =>
    isAutoPilot && isActive(key) ? <SkeletonCard label={label} /> : null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const previousActiveId = useRef<number | null>(null);

  const hasAnyCard = progress.completedCount > 0;

  /**
   * Bring the step awaiting action into view as the flow advances, instead of
   * jumping to a bottom sentinel on every state change (which yanked the
   * viewport while the user was still reading the previous artefact).
   */
  useEffect(() => {
    const activeId = progress.activeStepId;
    if (activeId === null || activeId === previousActiveId.current || !activeStep) return;

    const isFirstRender = previousActiveId.current === null;
    previousActiveId.current = activeId;
    if (isFirstRender) return;

    const el = scrollRef.current?.querySelector<HTMLElement>(`#${stepCardId(activeStep.key)}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [progress.activeStepId, activeStep]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#F8F6FE]">
      {/* Pane header — a label, not a second application bar. */}
      <div className="z-20 flex h-11 flex-shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 bg-white px-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <LayoutGrid className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Canvas</span>
          <span className="truncate text-2xs text-slate-400">
            {hasAnyCard
              ? `${progress.completedCount} of ${progress.total} artefacts`
              : 'No artefacts yet'}
          </span>
        </div>

        {activeStep && (
          <StatusPill tone="brand" dot className="flex-shrink-0">
            Next · {activeStep.label}
          </StatusPill>
        )}
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
        {!hasAnyCard ? (
          <CanvasEmptyState />
        ) : (
          <div className="mx-auto max-w-3xl space-y-5 pb-20">
            {/* Step 1 — Brief */}
            {hasConfirmedIndustry && <IndustryConceptCard />}

            {/* Step 2 — Name */}
            {hasConfirmedIndustry && (
              <StepSlot
                pending={
                  isLoadingNames ? (
                    <SkeletonCard label="Synthesising brand names…" />
                  ) : (
                    agentPending('name', 'Selecting the strongest name…')
                  )
                }
                showChooser={chooserVisible('name', isNameModalOpen)}
                chooser={<NameSelectionCard />}
                confirmed={<SelectedNameCard />}
              />
            )}

            {/* Step 3 — Tagline */}
            {hasConfirmedName && (
              <StepSlot
                pending={agentPending('tagline', 'Drafting taglines…')}
                showChooser={chooserVisible('tagline', isTaglineModalOpen)}
                chooser={<TaglineSelectionCard />}
                confirmed={<TaglineCard />}
              />
            )}

            {/* Step 4 — Visual system */}
            {hasConfirmedTagline && (
              <StepSlot
                pending={agentPending('visual', 'Harmonising colour and type…')}
                showChooser={chooserVisible('visual', isPaletteModalOpen)}
                chooser={<PaletteSelectionCard />}
                confirmed={<VisualPaletteCard />}
              />
            )}

            {/* Step 5 — Logo */}
            {hasConfirmedPalette && (
              <StepSlot
                pending={agentPending('logo', 'Drawing vector marks…')}
                showChooser={chooserVisible('logo', isLogoModalOpen)}
                chooser={<LogoSelectionCard />}
                confirmed={<LogoArtworkCard />}
              />
            )}

            {/* Live lockup editor — placed after every artefact exists, so it
                reflects the confirmed name, tagline, palette and mark. */}
            {hasConfirmedLogo && (
              <>
                <CanvaEditorToolbar />
                <CanvaInteractiveArtboard />
              </>
            )}

            {/* Terminal artefact */}
            {hasConfirmedLogo && <BrandKitExportCard />}
          </div>
        )}
      </div>
    </div>
  );
};

/** Placeholder shown while the agent is generating a step's options. */
const SkeletonCard: React.FC<{ label: string }> = ({ label }) => (
  <section
    aria-busy="true"
    aria-live="polite"
    className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6"
  >
    <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-5 w-32 rounded-full" />
    </div>

    <p className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
      {label}
    </p>

    <div className="mt-3 space-y-2">
      {[0, 1, 2].map((row) => (
        <Skeleton key={row} className="h-14 w-full rounded-2xl" />
      ))}
    </div>
  </section>
);

/**
 * Empty canvas.
 *
 * Previously this was a large dashed box that repeated the same four starter
 * prompts already offered in the agent panel. It now states what the canvas is
 * for and previews the five artefacts that will land here.
 */
const CanvasEmptyState: React.FC = () => {
  const progress = useFlowProgress();

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-slate-400 shadow-2xs">
        <LayoutGrid className="h-5 w-5" />
      </div>

      <h2 className="mt-4 font-display text-lg font-bold tracking-tight text-slate-900">
        Nothing on the canvas yet
      </h2>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
        Describe your venture in the agent panel. Each decision you confirm is materialised here as
        an editable artefact.
      </p>

      <ol className="mt-6 w-full space-y-px overflow-hidden rounded-xl border border-slate-200/80 bg-white text-left">
        {progress.steps.map(({ step }) => (
          <li
            key={step.key}
            className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-b-0"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-3xs font-bold text-slate-400">
              {step.id}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-slate-700">{step.title}</span>
              <span className="block truncate text-2xs text-slate-400">{step.description}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-center gap-1.5 text-2xs text-slate-400">
        <PenLine className="h-3 w-3" />
        Start by typing a brief in the panel on the left
      </p>
    </div>
  );
};
