import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { RichText } from '../ui/RichText';
import { StatusPill, Spinner } from '../ui/primitives';
import { useFlowProgress } from '../../hooks/useFlowProgress';
import { cn } from '../../lib/cn';
import {
  ArrowUp,
  Bot,
  Check,
  Coffee,
  Cpu,
  Crown,
  Shirt,
  Sparkles,
} from 'lucide-react';

/** The starter prompts, shown once — here, not also on the canvas. */
const STARTER_PROMPTS = [
  { icon: Coffee, label: 'Specialty Coffee Roastery', prompt: 'We are building a coffee business named Ceramiq', accent: 'text-amber-700 bg-amber-50' },
  { icon: Shirt, label: 'Streetwear & Sneakers', prompt: 'Streetwear and sneaker label called Kinetics', accent: 'text-brand-700 bg-brand-50' },
  { icon: Cpu, label: 'AI Developer Cloud', prompt: 'Autonomous AI agent cloud platform named Nexa', accent: 'text-blue-700 bg-blue-50' },
  { icon: Crown, label: 'Luxury Atelier', prompt: 'Haute couture atelier and luxury evening wear boutique', accent: 'text-coral-600 bg-coral-50' },
] as const;

/**
 * The agent conversation pane.
 *
 * Follows the Replit/Lovable convention: assistant turns are unboxed prose with
 * an avatar, user turns are the only bubbles. This replaced a layout where
 * every turn was a bordered card nested inside a bordered panel, which made a
 * three-message conversation read as nine stacked boxes.
 */
export const AgentChatPanel: React.FC = () => {
  const { chatMessages, isChatTyping, isAutoPilot, sendChatMessage, handleActionOption, reset } =
    useBrandStore();
  const progress = useFlowProgress();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeStep = progress.steps.find((entry) => entry.status === 'active')?.step ?? null;
  const hasStarted = progress.completedCount > 0;

  /** The agent is mid-flight: thinking about a reply, or driving auto-pilot. */
  const isAgentBusy = isChatTyping || isAutoPilot;

  /**
   * Used only to steer the composer's placeholder — the step rail owns all
   * visible progress reporting.
   */
  const activeStepLabel = activeStep?.label ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatMessages, isChatTyping]);

  const statusLabel = useMemo(() => {
    if (isChatTyping) return 'Thinking';
    if (progress.isComplete) return 'Session complete';
    return hasStarted ? 'Ready' : 'Idle';
  }, [isChatTyping, progress.isComplete, hasStarted]);

  const handleSend = (event?: React.FormEvent) => {
    event?.preventDefault();
    const value = inputVal.trim();
    if (!value) return;
    sendChatMessage(value);
    setInputVal('');
  };

  return (
    <div className="flex h-full flex-col border-r border-slate-200/90 bg-white">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex h-11 flex-shrink-0 items-center justify-between gap-2 border-b border-slate-200/90 px-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-coral-400 text-white">
            <Bot className="h-3.5 w-3.5" />
          </span>
          <span className="truncate text-xs font-bold text-slate-900">Upstream Agent</span>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          <StatusPill
            tone={isChatTyping ? 'brand' : progress.isComplete ? 'success' : 'neutral'}
            dot
            pulse={isChatTyping}
          >
            {statusLabel}
          </StatusPill>

          {hasStarted && (
            <button
              type="button"
              onClick={reset}
              className="rounded-md px-1.5 py-0.5 text-2xs font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45"
            >
              New
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Transcript                                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4">
        {/* Greeting — the single entry point into the flow. */}
        {!hasStarted && (
          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/70 bg-brand-50 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-brand-700">
              <Sparkles className="h-3 w-3 text-coral-500" />
              Idea to identity
            </div>

            <h1 className="mt-3 font-display text-xl font-black leading-tight tracking-tight text-slate-950">
              What are you building?
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Describe your venture. The agent will work through the brief, name, tagline, visual
              system and logo — materialising each artefact on the canvas as it goes.
            </p>

            <div className="mt-4 space-y-1.5">
              {STARTER_PROMPTS.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  onClick={() => sendChatMessage(starter.prompt)}
                  className={cn(
                    'group flex w-full items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white px-2.5 py-2 text-left',
                    'transition-colors hover:border-brand-300 hover:bg-brand-50/60',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg',
                      starter.accent,
                    )}
                  >
                    <starter.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800">
                    {starter.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Run log — shown only while the agent is actually working, so the
            transcript reads as a conversation rather than a dashboard. The
            step rail in the top bar is the persistent progress surface. */}
        {isAgentBusy && (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/60">
            <div className="flex items-center gap-2 border-b border-slate-200/70 px-2.5 py-2">
              <Spinner className="h-3 w-3 flex-shrink-0 text-brand-500" />
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                Run log · {progress.completedCount}/{progress.total}
              </span>
            </div>

            <ol className="space-y-1.5 px-2.5 py-2">
              {progress.steps.map(({ step, status }) => (
                <li key={step.key} className="flex items-start gap-2">
                  <span
                    className={cn(
                      'mt-px flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full',
                      status === 'done' && 'bg-emerald-500 text-white',
                      status === 'active' && 'border border-brand-400 bg-white',
                      status === 'upcoming' && 'border border-slate-300 bg-white',
                    )}
                  >
                    {status === 'done' && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}
                    {status === 'active' && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block truncate text-2xs font-semibold',
                        status === 'done' && 'text-slate-500',
                        status === 'active' && 'text-brand-700',
                        status === 'upcoming' && 'text-slate-400',
                      )}
                    >
                      {step.title}
                    </span>
                    {status === 'active' && (
                      <span className="block text-2xs leading-snug text-slate-500">
                        {step.description}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Conversation */}
        <div className="space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            const hasActions = Boolean(msg.actionOptions?.length);

            return (
              <div key={msg.id} className={cn('flex flex-col', isUser && 'items-end')}>
                {isUser ? (
                  <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white">
                    <RichText text={msg.text} inverse />
                  </div>
                ) : (
                  <div className="flex w-full gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-coral-400 text-white">
                      <Bot className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <RichText
                        text={msg.text}
                        className="text-xs leading-relaxed text-slate-700"
                      />
                    </div>
                  </div>
                )}

                {/* Primary affordance: explicit agent actions. */}
                {hasActions && (
                  <div
                    className={cn(
                      'mt-2 flex w-full flex-col gap-1.5',
                      !isUser && 'pl-[2.125rem]',
                    )}
                  >
                    {msg.actionOptions?.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleActionOption(option)}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-xl border border-brand-200/80 bg-white',
                          'px-2.5 py-2 text-left text-xs font-semibold text-slate-800',
                          'transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        <ArrowUp className="h-3.5 w-3.5 flex-shrink-0 rotate-90 text-brand-500" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Secondary affordance: free-text follow-ups. Suppressed when
                    explicit actions already cover the same intent. */}
                {!hasActions && Boolean(msg.suggestions?.length) && (
                  <div className={cn('mt-2 flex flex-wrap gap-1.5', !isUser && 'pl-[2.125rem]')}>
                    {msg.suggestions?.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendChatMessage(suggestion)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1',
                          'text-2xs font-medium text-slate-600 transition-colors',
                          'hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                        )}
                      >
                        <Sparkles className="h-2.5 w-2.5 flex-shrink-0 text-coral-500" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isChatTyping && (
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-coral-400 text-white">
                <Bot className="h-3.5 w-3.5" />
              </span>
              <span className="flex items-center gap-1.5 text-2xs font-medium text-slate-500">
                <Spinner className="h-3 w-3 text-brand-500" />
                Working…
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Composer                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-shrink-0 border-t border-slate-200/90 bg-white p-2.5">
        <form
          onSubmit={handleSend}
          className={cn(
            'rounded-2xl border border-slate-200 bg-white p-2 transition-colors',
            'focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10',
          )}
        >
          <label htmlFor="agent-prompt" className="sr-only">
            Message the Upstream Agent
          </label>
          <textarea
            id="agent-prompt"
            value={inputVal}
            onChange={(event) => setInputVal(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              !hasStarted
                ? 'Describe the venture you want to brand…'
                : activeStepLabel
                  ? `Waiting on ${activeStepLabel.toLowerCase()} — or refine the brief…`
                  : 'Refine the brief, or ask for a different direction…'
            }
            rows={2}
            className="w-full resize-none bg-transparent px-1 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />

          <div className="mt-1 flex items-center justify-between gap-2 border-t border-slate-100 pt-1.5">
            <span className="hidden text-2xs text-slate-400 sm:inline">
              <kbd className="font-sans font-semibold text-slate-500">↵</kbd> send ·{' '}
              <kbd className="font-sans font-semibold text-slate-500">⇧↵</kbd> newline
            </span>

            <button
              type="submit"
              disabled={!inputVal.trim()}
              aria-label="Send to Upstream Agent"
              className={cn(
                'ml-auto flex h-7 w-7 items-center justify-center rounded-full transition-all',
                'bg-brand-600 text-white hover:bg-brand-700 active:scale-95',
                'disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 focus-visible:ring-offset-2',
              )}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
