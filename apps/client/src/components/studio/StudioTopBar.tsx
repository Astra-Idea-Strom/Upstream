import React from 'react';
import { ChevronRight, Download, Home, RotateCcw } from 'lucide-react';
import { useBrandStore } from '../../store/brandStore';
import { Button, Divider, IconButton } from '../ui/primitives';
import { BrandMark } from '../layout/BrandMark';
import { useFlowProgress } from '../../hooks/useFlowProgress';
import { useArmedAction } from '../../hooks/useArmedAction';
import { KIT_CARD_ID, scrollToId } from '../../lib/dom';

/**
 * The studio's one and only application chrome.
 *
 * Left: brand + project breadcrumb. Right: session actions.
 *
 * The step rail that used to sit between them is gone — five labelled ticks
 * repeating a flow the user is already walking through, and the canvas pane
 * header already states the position ("Canvas · 2 of 5"). What remains of
 * progress reporting is that one count plus the hairline along the bottom edge,
 * which is enough to answer "how far along am I" without a second full row of
 * chrome.
 */
export const StudioTopBar: React.FC = () => {
  const { input, selectedName, hasConfirmedName, reset, setViewMode } = useBrandStore();
  const progress = useFlowProgress();

  /**
   * Reset discards the whole session and sits one click away from "Home", so it
   * arms before it fires. See `useArmedAction`.
   */
  const resetAction = useArmedAction(reset);

  return (
    <header className="relative z-30 flex h-14 flex-shrink-0 select-none items-center gap-3 border-b border-slate-200/90 bg-white/85 px-3 backdrop-blur-xl sm:px-4">
      {/* Left: brand + project breadcrumb */}
      <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setViewMode('landing')}
          className="rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 focus-visible:ring-offset-2"
          aria-label="Upstream home"
        >
          <BrandMark size="sm" />
        </button>

        <Divider vertical className="hidden sm:block" />

        <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50 px-2.5 py-1 text-xs">
          <span className="max-w-[8rem] truncate font-semibold text-slate-700 sm:max-w-[14rem]">
            {input.industry || 'Untitled brief'}
          </span>
          {hasConfirmedName && (
            <>
              <ChevronRight className="h-3 w-3 flex-shrink-0 text-slate-300" aria-hidden="true" />
              <span className="max-w-[7rem] truncate font-bold text-brand-700">
                {selectedName.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: session actions */}
      <div className="ml-auto flex flex-shrink-0 items-center gap-1.5">
        {resetAction.isArmed ? (
          <Button
            variant="ghost"
            size="sm"
            pill
            onClick={resetAction.confirm}
            onBlur={resetAction.disarm}
            className="border border-coral-300 bg-coral-50 text-coral-700 hover:bg-coral-100"
          >
            Confirm reset
          </Button>
        ) : (
          <IconButton label="Reset session" onClick={resetAction.arm}>
            <RotateCcw className="h-3.5 w-3.5" />
          </IconButton>
        )}

        {hasConfirmedName && (
          <Button
            variant="brand"
            size="sm"
            pill
            icon={<Download className="h-3.5 w-3.5" />}
            onClick={() => scrollToId(KIT_CARD_ID)}
          >
            Export kit
          </Button>
        )}

        <Divider vertical className="mx-0.5 hidden sm:block" />

        <Button
          variant="secondary"
          size="sm"
          pill
          icon={<Home className="h-3.5 w-3.5 text-slate-400" />}
          onClick={() => setViewMode('landing')}
        >
          Home
        </Button>
      </div>

      {/* Hairline progress readout along the bottom edge of the chrome. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-transparent"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-coral-500 transition-[width] duration-500 ease-out"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </header>
  );
};
