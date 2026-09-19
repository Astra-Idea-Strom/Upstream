import React, { useRef, useEffect, useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { RichText } from '../ui/RichText';
import { Spinner } from '../ui/primitives';
import { useFlowProgress } from '../../hooks/useFlowProgress';
import { cn } from '../../lib/cn';
import { ArrowRight, ArrowUp, Coffee, Cpu, Crown, Shirt } from 'lucide-react';

/** The starter prompts, shown once — here, not also on the canvas. */
const STARTER_PROMPTS = [
  { icon: Coffee, label: 'Specialty Coffee Roastery', prompt: 'We are building a coffee business named Ceramiq' },
  { icon: Shirt, label: 'Streetwear & Sneakers', prompt: 'Streetwear and sneaker label called Kinetics' },
  { icon: Cpu, label: 'Developer Cloud', prompt: 'Developer cloud platform named Nexa' },
  { icon: Crown, label: 'Luxury Atelier', prompt: 'Haute couture atelier and luxury evening wear boutique' },
] as const;

/**
 * The conversation pane.
 *
 * Assistant turns are plain prose; only user turns are bubbles. The pane
 * deliberately carries no progress readout of its own — the top-bar step rail
 * is the single place the flow's position is expressed, so the two can never
 * disagree.
 */
export const AgentChatPanel: React.FC = () => {
  const { chatMessages, isChatTyping, isAutoPilot, sendChatMessage, handleActionOption, reset } =
    useBrandStore();
  const progress = useFlowProgress();

  const [inputVal, setInputVal] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeStep = progress.steps.find((entry) => entry.status === 'active')?.step ?? null;
  const hasStarted = progress.completedCount > 0;

  /** Mid-flight: composing a reply, or driving the remaining steps itself. */
  const isBusy = isChatTyping || isAutoPilot;

  /**
   * Used only to steer the composer's placeholder — the step rail owns all
   * visible progress reporting.
   */
  const activeStepLabel = activeStep?.label ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatMessages, isChatTyping]);

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
        <span className="truncate text-xs font-bold text-slate-900">Agent</span>

        <div className="flex flex-shrink-0 items-center gap-2">
          {isBusy && (
            <span className="flex items-center gap-1.5 text-2xs font-medium text-slate-500">
              <Spinner className="h-3 w-3 text-brand-500" />
              Working
            </span>
          )}

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
            <h1 className="font-display text-xl font-black leading-tight tracking-tight text-slate-950">
              What are you building?
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Describe your venture. Every decision you confirm is added to the canvas.
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
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-100 group-hover:text-brand-700">
                    <starter.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800">
                    {starter.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-300 transition-colors group-hover:text-brand-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        <div className="space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            // Action options are all "continue the flow" affordances, so they
            // are suppressed once the flow has nothing left to continue.
            const hasActions = Boolean(msg.actionOptions?.length) && !progress.isComplete;

            return (
              <div key={msg.id} className={cn('flex flex-col', isUser && 'items-end')}>
                {isUser ? (
                  <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white">
                    <RichText text={msg.text} inverse />
                  </div>
                ) : (
                  <RichText
                    text={msg.text}
                    className="text-xs leading-relaxed text-slate-700"
                  />
                )}

                {/* Primary affordance: explicit agent actions. */}
                {hasActions && (
                  <div className="mt-2 flex w-full flex-col gap-1.5">
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
                        <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-brand-500" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Secondary affordance: free-text follow-ups. Suppressed when
                    explicit actions already cover the same intent. */}
                {!hasActions && Boolean(msg.suggestions?.length) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions?.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendChatMessage(suggestion)}
                        className={cn(
                          'rounded-full border border-slate-200 bg-white px-2.5 py-1',
                          'text-2xs font-medium text-slate-600 transition-colors',
                          'hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                        )}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isChatTyping && (
            <span className="flex items-center gap-2 text-2xs font-medium text-slate-500">
              <Spinner className="h-3 w-3 text-brand-500" />
              Working
            </span>
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
            Message the agent
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
                  ? `Waiting on ${activeStepLabel.toLowerCase()}…`
                  : 'Refine the brief, or ask for a different direction…'
            }
            rows={2}
            className="w-full resize-none bg-transparent px-1 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />

          <div className="mt-1 flex items-center justify-end border-t border-slate-100 pt-1.5">
            <button
              type="submit"
              disabled={!inputVal.trim()}
              aria-label="Send"
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full transition-all',
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
