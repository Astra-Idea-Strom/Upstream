import { useMemo } from 'react';
import { useBrandStore } from '../store/brandStore';
import { getFlowProgress, getActiveStep, type FlowProgress, type StudioStep } from '../lib/steps';

/**
 * The studio's progress state, derived once from the session flags.
 *
 * Every surface that talks about progress (top-bar step rail, chat run log,
 * canvas header, card variants) consumes this hook. Before this existed, three
 * different counters were computed inline in three components, each counting a
 * different subset of the flow, so the numbers visibly disagreed with each
 * other during a session.
 */
export function useFlowProgress(): FlowProgress {
  const brief = useBrandStore((state) => state.hasConfirmedIndustry);
  const name = useBrandStore((state) => state.hasConfirmedName);
  const tagline = useBrandStore((state) => state.hasConfirmedTagline);
  const visual = useBrandStore((state) => state.hasConfirmedPalette);
  const logo = useBrandStore((state) => state.hasConfirmedLogo);

  return useMemo(
    () => getFlowProgress({ brief, name, tagline, visual, logo }),
    [brief, name, tagline, visual, logo],
  );
}

/** The step the user should act on next, or `null` when the flow is complete. */
export function useActiveStep(): StudioStep | null {
  const brief = useBrandStore((state) => state.hasConfirmedIndustry);
  const name = useBrandStore((state) => state.hasConfirmedName);
  const tagline = useBrandStore((state) => state.hasConfirmedTagline);
  const visual = useBrandStore((state) => state.hasConfirmedPalette);
  const logo = useBrandStore((state) => state.hasConfirmedLogo);

  return useMemo(
    () => getActiveStep({ brief, name, tagline, visual, logo }),
    [brief, name, tagline, visual, logo],
  );
}
