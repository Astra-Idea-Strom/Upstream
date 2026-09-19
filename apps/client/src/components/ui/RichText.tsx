import React from 'react';
import { cn } from '../../lib/cn';

/**
 * Minimal markdown renderer for agent messages.
 *
 * The agent composes its replies with `**bold**`, `*italic*` and `- bullets`,
 * but the chat previously rendered them as literal asterisks inside a
 * `whitespace-pre-line` paragraph. This renders the small subset the agent
 * actually emits, and nothing more (no dangerouslySetInnerHTML).
 */

const INLINE_PATTERN = /(\*\*[^*\n]+\*\*|__[^_\n]+__|`[^`\n]+`|\*[^*\n]+\*|_[^_\n]+_)/g;

function renderInline(text: string, keyPrefix: string, inverse: boolean): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = new RegExp(INLINE_PATTERN.source, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (token.startsWith('**') || token.startsWith('__')) {
      nodes.push(
        <strong key={key} className={cn('font-bold', inverse ? 'text-white' : 'text-slate-900')}>
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <code
          key={key}
          className={cn(
            'rounded px-1 py-0.5 font-mono text-[0.92em]',
            inverse ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-800',
          )}
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

interface Block {
  type: 'paragraph' | 'bullets' | 'numbers';
  lines: string[];
}

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trimEnd();
    const isBullet = /^\s*[-•*]\s+/.test(line);
    const isNumbered = /^\s*\d+\.\s+/.test(line);

    if (isBullet || isNumbered) {
      const type = isBullet ? 'bullets' : 'numbers';
      if (!current || current.type !== type) {
        current = { type, lines: [] };
        blocks.push(current);
      }
      current.lines.push(line.replace(/^\s*(?:[-•*]|\d+\.)\s+/, ''));
    } else if (line.trim() === '') {
      current = null;
    } else {
      if (!current || current.type !== 'paragraph') {
        current = { type: 'paragraph', lines: [] };
        blocks.push(current);
      }
      current.lines.push(line);
    }
  }

  return blocks;
}

export interface RichTextProps {
  text: string;
  /** Use light-on-dark colours (for user bubbles on a dark background). */
  inverse?: boolean;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ text, inverse = false, className }) => {
  const blocks = toBlocks(text);

  return (
    <div className={cn('space-y-1.5', className)}>
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;

        if (block.type === 'bullets') {
          return (
            <ul key={key} className="space-y-1 pl-0.5">
              {block.lines.map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`} className="flex gap-2">
                  <span
                    className={cn(
                      'mt-[0.45em] h-1 w-1 flex-shrink-0 rounded-full',
                      inverse ? 'bg-white/60' : 'bg-brand-400',
                    )}
                  />
                  <span className="flex-1">
                    {renderInline(line, `${key}-${lineIndex}`, inverse)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'numbers') {
          return (
            <ol key={key} className="space-y-1 pl-0.5">
              {block.lines.map((line, lineIndex) => (
                <li key={`${key}-${lineIndex}`} className="flex gap-2">
                  <span
                    className={cn(
                      'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-3xs font-bold',
                      inverse ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700',
                    )}
                  >
                    {lineIndex + 1}
                  </span>
                  <span className="flex-1">
                    {renderInline(line, `${key}-${lineIndex}`, inverse)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={key} className="whitespace-pre-line">
            {renderInline(block.lines.join('\n'), key, inverse)}
          </p>
        );
      })}
    </div>
  );
};
