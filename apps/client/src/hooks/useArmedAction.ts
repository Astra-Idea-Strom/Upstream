import { useEffect, useState } from 'react';

/**
 * Two-step confirmation for a destructive action.
 *
 * A modal is heavier than "reset the session" deserves, but firing on a single
 * click is not acceptable for anything that discards the user's work — and
 * destructive controls sit one click away from benign ones ("Home", "Export").
 * The first click arms the control, the second fires it; ignoring it disarms
 * automatically so the UI never gets stuck in a confirmation state.
 *
 * Used by the studio top bar's reset control and the export card's
 * "New project" action, so both confirm the same way.
 */
export function useArmedAction(onConfirm: () => void, timeoutMs = 4000) {
  const [isArmed, setArmed] = useState(false);

  useEffect(() => {
    if (!isArmed) return;
    const timer = window.setTimeout(() => setArmed(false), timeoutMs);
    return () => window.clearTimeout(timer);
  }, [isArmed, timeoutMs]);

  return {
    isArmed,
    /** First click — switch the control into its confirmation state. */
    arm: () => setArmed(true),
    /** Abandon the confirmation (blur, escape, unrelated interaction). */
    disarm: () => setArmed(false),
    /** Second click — run the action. */
    confirm: () => {
      setArmed(false);
      onConfirm();
    },
  };
}
