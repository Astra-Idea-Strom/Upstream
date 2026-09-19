/**
 * The single canonical definition of the Upstream brand-identity flow.
 *
 * Every surface that talks about progress (chat run log, workspace step rail,
 * card headers, empty states) reads from this list so the numbering can never
 * drift. Previously the workspace cards said "CARD 2" while the chat said
 * "STEP 2" and the two progress counters counted different things.
 */
export interface StudioStep {
  /** 1-based position in the flow. */
  id: 1 | 2 | 3 | 4 | 5;
  /** Stable key for lookups. */
  key: 'brief' | 'name' | 'tagline' | 'visual' | 'logo';
  /** Compact label for the step rail. */
  label: string;
  /** Full title used in card headers and the run log. */
  title: string;
  /** One-line description used in empty states. */
  description: string;
}

/** Stable identifier for a flow step, used for DOM ids and card routing. */
export type StudioStepKey = StudioStep['key'];

export const STUDIO_STEPS: readonly StudioStep[] = [
  {
    id: 1,
    key: 'brief',
    label: 'Brief',
    title: 'Brief & Positioning',
    description: 'Industry, audience, mission and brand tone',
  },
  {
    id: 2,
    key: 'name',
    label: 'Name',
    title: 'Brand Name',
    description: 'Five candidates with domain availability',
  },
  {
    id: 3,
    key: 'tagline',
    label: 'Tagline',
    title: 'Strategic Tagline',
    description: 'Four positioning statements to choose from',
  },
  {
    id: 4,
    key: 'visual',
    label: 'Visual',
    title: 'Color & Typography',
    description: 'Chromatic harmony and Google Font pairing',
  },
  {
    id: 5,
    key: 'logo',
    label: 'Logo & Kit',
    title: 'Logo & Brand Kit',
    description: 'Vector mark, touchpoints and export',
  },
] as const;

export const TOTAL_STEPS = STUDIO_STEPS.length;

export function getStep(id: number): StudioStep {
  return STUDIO_STEPS.find((step) => step.id === id) ?? STUDIO_STEPS[0];
}

/* -------------------------------------------------------------------------- */
/* Flow progress                                                              */
/* -------------------------------------------------------------------------- */

export type StepStatus = 'done' | 'active' | 'upcoming';

/**
 * The raw session flags, in flow order.
 *
 * Kept as a plain record (rather than reading the store directly) so this
 * derivation stays pure and testable, and so any surface — top bar, chat log,
 * canvas header, cards — computes progress from the identical inputs.
 */
export interface FlowFlags {
  brief: boolean;
  name: boolean;
  tagline: boolean;
  visual: boolean;
  logo: boolean;
}

export interface FlowStepState {
  step: StudioStep;
  status: StepStatus;
}

export interface FlowProgress {
  steps: FlowStepState[];
  /** Number of completed steps (0–5). */
  completedCount: number;
  total: number;
  /** The step currently awaiting user action, or `null` when every step is done. */
  activeStepId: StudioStep['id'] | null;
  isComplete: boolean;
  /** Completion percentage, rounded — for progress bars. */
  percent: number;
}

const FLAG_ORDER: readonly StudioStep['key'][] = ['brief', 'name', 'tagline', 'visual', 'logo'];

/**
 * Derive the one true progress state from the session flags.
 *
 * A step is `done` once its flag is set; the first step that is not done is
 * `active`; everything after it is `upcoming`. This is deliberately linear —
 * the flow never shows two active steps, which is what made the old counters
 * (which counted overlapping subsets) disagree with each other.
 */
export function getFlowProgress(flags: FlowFlags): FlowProgress {
  const completed = FLAG_ORDER.filter((key) => flags[key]).length;
  const activeIndex = FLAG_ORDER.findIndex((key) => !flags[key]);

  const steps = STUDIO_STEPS.map((step, index) => {
    let status: StepStatus;
    if (flags[step.key]) {
      status = 'done';
    } else if (index === activeIndex) {
      status = 'active';
    } else {
      status = 'upcoming';
    }
    return { step, status };
  });

  return {
    steps,
    completedCount: completed,
    total: TOTAL_STEPS,
    activeStepId: activeIndex === -1 ? null : STUDIO_STEPS[activeIndex].id,
    isComplete: completed === TOTAL_STEPS,
    percent: Math.round((completed / TOTAL_STEPS) * 100),
  };
}

/** The step a user should be looking at right now, or `null` when complete. */
export function getActiveStep(flags: FlowFlags): StudioStep | null {
  const { activeStepId } = getFlowProgress(flags);
  return activeStepId === null ? null : getStep(activeStepId);
}

/** The next incomplete step after `key`, used for "what happens next" copy. */
export function getNextStep(key: StudioStep['key']): StudioStep | null {
  const index = FLAG_ORDER.indexOf(key);
  if (index === -1 || index === FLAG_ORDER.length - 1) return null;
  return STUDIO_STEPS[index + 1] ?? null;
}
