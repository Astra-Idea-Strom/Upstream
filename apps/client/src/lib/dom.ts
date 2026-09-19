import type { StudioStep } from './steps';

/**
 * DOM id for a step's artefact card on the canvas.
 *
 * Cards are addressed by their canonical step key rather than their position,
 * so the step rail can jump to an artefact without hard-coding an index.
 */
export function stepCardId(key: StudioStep['key']): string {
  return `step-card-${key}`;
}

/**
 * DOM id of the exportable brand-kit one-pager.
 *
 * Also the capture target for PDF/PNG export, so it must stay stable.
 */
export const KIT_CARD_ID = 'brand-identity-onepager';

/** Smooth-scroll an element into view inside whatever container holds it. */
export function scrollToId(id: string): boolean {
  if (typeof document === 'undefined') return false;

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

/**
 * Bring a step's card into view inside the canvas scroll container.
 *
 * Used by the top-bar step rail so a completed step is one click away. Returns
 * `false` when the card is not currently mounted (for example the user is
 * looking at the chat pane on mobile), letting the caller decide what to do.
 */
export function scrollToStepCard(key: StudioStep['key']): boolean {
  return scrollToId(stepCardId(key));
}
