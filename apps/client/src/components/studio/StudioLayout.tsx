import React, { useCallback, useEffect, useState } from 'react';
import { LayoutGrid, MessageSquare } from 'lucide-react';
import { AgentChatPanel } from './AgentChatPanel';
import { AgentWorkspace } from './AgentWorkspace';
import { StudioTopBar } from './StudioTopBar';
import { SegmentedControl } from '../ui/primitives';
import { cn } from '../../lib/cn';

const MIN_CHAT_WIDTH = 300;
const MAX_CHAT_WIDTH = 720;
const DEFAULT_CHAT_WIDTH = 400;
/** The canvas must always keep at least this much room. */
const MIN_CANVAS_WIDTH = 420;
const STORAGE_KEY = 'upstream_chat_width';

type MobilePane = 'chat' | 'canvas';

function readStoredWidth(): number {
  if (typeof window === 'undefined') return DEFAULT_CHAT_WIDTH;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_CHAT_WIDTH;
  const parsed = Number.parseInt(stored, 10);
  if (Number.isNaN(parsed)) return DEFAULT_CHAT_WIDTH;
  return Math.min(Math.max(parsed, MIN_CHAT_WIDTH), MAX_CHAT_WIDTH);
}

function clampWidth(px: number): number {
  const available = typeof window === 'undefined' ? MAX_CHAT_WIDTH : window.innerWidth - MIN_CANVAS_WIDTH;
  const upper = Math.max(MIN_CHAT_WIDTH, Math.min(MAX_CHAT_WIDTH, available));
  return Math.min(Math.max(px, MIN_CHAT_WIDTH), upper);
}

/**
 * The studio shell: a resizable two-pane workspace.
 *
 * Agent conversation on the left, materialised brand artefacts on the right —
 * the same shape as Replit, Lovable and Bolt. Below `md` the panes would be
 * unusably narrow side by side, so they become a single switched pane instead
 * of both being squeezed in.
 */
export const StudioLayout: React.FC = () => {
  const [chatWidth, setChatWidth] = useState<number>(readStoredWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>('chat');

  const persistWidth = useCallback((width: number) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(width));
    } catch {
      /* storage may be unavailable (private mode) — width is non-critical */
    }
  }, []);

  const nudgeWidth = useCallback(
    (delta: number) => {
      setChatWidth((current) => {
        const next = clampWidth(current + delta);
        persistWidth(next);
        return next;
      });
    },
    [persistWidth],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number) => setChatWidth(clampWidth(clientX));
    const handleMouseMove = (event: MouseEvent) => handleMove(event.clientX);
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) handleMove(touch.clientX);
    };
    const handleEnd = () => {
      setIsDragging(false);
      setChatWidth((current) => {
        persistWidth(current);
        return current;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    const { body } = document;
    const previousCursor = body.style.cursor;
    const previousUserSelect = body.style.userSelect;
    body.style.cursor = 'col-resize';
    body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      body.style.cursor = previousCursor;
      body.style.userSelect = previousUserSelect;
    };
  }, [isDragging, persistWidth]);

  return (
    <div className="flex h-screen w-screen animate-fade-in flex-col overflow-hidden bg-[#F8F6FE] font-sans text-slate-900">
      <StudioTopBar />

      {/* Mobile pane switch — the two panes are never shown side by side here. */}
      <div className="flex h-11 flex-shrink-0 items-center justify-center border-b border-slate-200/90 bg-white px-3 md:hidden">
        <SegmentedControl<MobilePane>
          aria-label="Switch studio pane"
          value={mobilePane}
          onChange={setMobilePane}
          options={[
            {
              value: 'chat',
              label: 'Agent',
              icon: <MessageSquare className="h-3 w-3" />,
            },
            {
              value: 'canvas',
              label: 'Canvas',
              icon: <LayoutGrid className="h-3 w-3" />,
            },
          ]}
        />
      </div>

      <div className={cn('relative flex flex-1 overflow-hidden', isDragging && 'select-none')}>
        {/* Left pane: agent conversation */}
        <div
          style={{ width: chatWidth }}
          className={cn(
            'h-full flex-shrink-0 overflow-hidden max-md:!w-full',
            mobilePane === 'canvas' && 'max-md:hidden',
          )}
        >
          <AgentChatPanel />
        </div>

        {/* Resize handle (desktop only) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          tabIndex={0}
          onMouseDown={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onTouchStart={() => setIsDragging(true)}
          onDoubleClick={() => {
            setChatWidth(DEFAULT_CHAT_WIDTH);
            persistWidth(DEFAULT_CHAT_WIDTH);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              nudgeWidth(-24);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              nudgeWidth(24);
            }
          }}
          title="Drag to resize · double-click to reset"
          className={cn(
            'group relative z-20 -ml-px hidden w-1.5 flex-shrink-0 cursor-col-resize select-none',
            'items-center justify-center transition-colors duration-150 md:flex',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
            isDragging ? 'bg-brand-500' : 'bg-slate-200/90 hover:bg-brand-400',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-8 w-0.5 rounded-full transition-colors',
              isDragging ? 'bg-white' : 'bg-slate-400 group-hover:bg-white',
            )}
          />
        </div>

        {/* Right pane: workspace canvas */}
        <div
          className={cn(
            'flex h-full min-w-0 flex-1 flex-col overflow-hidden',
            mobilePane === 'chat' && 'max-md:hidden',
          )}
        >
          <AgentWorkspace />
        </div>

        {/* Swallow pointer events while dragging so children cannot steal them. */}
        {isDragging && <div className="fixed inset-0 z-50 cursor-col-resize select-none" />}
      </div>
    </div>
  );
};
