/**
 * Conversational agent — Groq `openai/gpt-oss-120b` with real tools.
 *
 * The model is no longer a chatbot that *talks about* making changes; it has
 * function-calling access to the backend (naming, FLUX.2 logo generation,
 * Qwen vision, project state, asset storage, canvas control) and is instructed
 * to act through those tools instead of describing actions.
 *
 * Flow per turn:
 *
 *   user message
 *      │
 *      ▼
 *   Groq (tools=AGENT_TOOLS, tool_choice=auto)
 *      │  finish_reason = tool_calls ?
 *      ├── yes → executeTool() server-side → feed result back → loop (max 4 rounds)
 *      └── no  → done
 *      ▼
 *   Groq again with response_format=json_object → {reply, suggestions, intent, brief}
 *      ▼
 *   HTTP response = the legacy contract + toolCalls / canvasPatch / names / logos
 *
 * The response is a strict superset of the original shape, so the existing
 * client keeps working untouched while richer consumers can read the extras.
 */

import { GROQ_CHAT_MODEL } from '../config/imagegen';
import { chatCompletion } from './chatProvider.service';
import { AGENT_TOOLS, executeTool, type ToolContext, type ToolResult } from './agentTools.service';
import { chatWithAgent, type AgentChatParams } from './groq.service';

export type AgentIntent = 'greeting' | 'new_brand' | 'refine' | 'question';

export interface AgentToolCallLog {
  name: string;
  ok: boolean;
  summary: string;
}

export interface AgentChatResponse {
  reply: string;
  suggestions: string[];
  detectedIntent: AgentIntent;
  extractedBrief: {
    businessName?: string;
    industry?: string;
    tone?: string;
    targetAudience?: string;
    mission?: string;
  };
  /** Extra, additive fields — the original client ignores them. */
  engine: 'groq-tools' | 'groq-json-fallback' | 'local-tool-summary';
  toolCalls?: AgentToolCallLog[];
  canvasPatch?: Record<string, unknown>;
  names?: Array<{ id: string; name: string; tagline: string; meaning: string }>;
  logos?: Array<{ id: string; url: string; style: string; mode?: string; assetId?: string }>;
  assets?: Array<{ id: string; kind: string; label: string; url?: string }>;
  projectId?: string;
  exportedKit?: unknown;
}

const MAX_TOOL_ROUNDS = 2;
const MAX_TOOL_RESULT_CHARS = 2500;
/**
 * Output budget for a tool-selection round.
 *
 * gpt-oss-120b emits `reasoning` tokens that come out of this same budget, so a
 * tight ceiling can be consumed entirely by thinking and return NO tool call
 * (finish_reason: "length") — which reads downstream as "the agent refused to
 * generate an image". Low reasoning effort plus a generous ceiling keeps room
 * for the actual call.
 */
const TOOL_ROUND_MAX_TOKENS = 1200;

/**
 * Kept deliberately short.
 *
 * Groq's on-demand tier allows 8000 tokens/minute, and every round re-sends this
 * prompt plus all tool schemas. A verbose system prompt is therefore not just
 * cosmetic — it directly caused `429 rate_limit_exceeded`, which killed the tool
 * loop and silently degraded to the no-tools director (so image generation was
 * never called).
 */
const SYSTEM_PROMPT = `You are Upstream's AI Brand Director and the operator of this workspace. You ACT through tools; you never just advise.

Rules:
1. Never claim you created, changed or saved anything unless a tool call did it.
2. Pass brand names EXACTLY as the user writes them — they are rendered into the artwork.
3. Logo/mark/artwork requests ("make the logo", "generate the mark", "redraw it") → generate_logo_concepts. All styles at once → generate_logo_suite. Naming → generate_brand_names. Certificates → generate_brand_certificate.
4. Images referenced by path or URL (e.g. /api/assets/generated/x.jpg) → call describe_image with that path. Never say you cannot see an image without calling describe_image first.
5. Rename / retagline / retone → update_brand_kit (one field per call). Canvas tweaks → set_canvas_state with ONLY the changed keys; never clear existing sections.
6. Keep assets the user wants (uploads, certificates) with save_brand_asset — but never re-save logos the generator already persisted.
7. One well-chosen tool call beats a chain. If a tool fails, say so plainly.

Voice: warm, decisive, concise Markdown — lead with what you did, then real values (names, hexes, URLs). You will be asked for a final JSON object afterwards; reply with only that JSON.`;

const FINAL_FORMAT_INSTRUCTION = `Reply with a single JSON object — no fences, no preamble:

{
  "reply": "Markdown reply stating concretely what you did, using only values the tools returned.",
  "suggestions": ["2-3 short follow-up chips"],
  "detectedIntent": "greeting" | "new_brand" | "refine" | "question",
  "extractedBrief": {
    "businessName": "", "industry": "", "tone": "", "targetAudience": "", "mission": ""
  }
}`;

// ─────────────────────────────────────────────────────────────────────────────

/** Turn a raw tool result into a one-line human summary for the reply context. */
function summarizeToolResult(name: string, result: ToolResult): string {
  if (!result.ok) return `failed: ${result.error ?? 'unknown error'}`;

  switch (name) {
    case 'generate_brand_names':
      return `generated ${result.count} names (e.g. ${(result.names as any[])?.[0]?.name ?? '—'})`;
    case 'generate_logo_concepts':
      return `drew ${(result.logos as any[])?.length ?? 0} logo concept(s)`;
    case 'generate_brand_certificate':
      return `issued brand certificate for ${result.brandName ?? 'brand'}`;
    case 'describe_image':
      return 'read the image';
    case 'check_domain_availability':
      return 'checked domain availability';
    case 'update_brand_kit':
      return `updated ${result.updatedField}`;
    case 'save_brand_asset':
      return `saved ${result.kind} asset`;
    case 'list_brand_assets':
      return `listed ${result.count} asset(s)`;
    case 'get_project_state':
      return 'read the project state';
    case 'export_brand_kit':
      return `exported the kit as ${result.format}`;
    case 'set_canvas_state':
      return 'adjusted the canvas';
    default:
      return 'completed';
  }
}

/** Collect the additive extras from tool results into the HTTP response. */
function collectExtras(
  name: string,
  result: ToolResult,
  acc: {
    canvasPatch: Record<string, unknown>;
    names: any[];
    logos: any[];
    assets: any[];
    projectId?: string;
    exportedKit?: unknown;
  }
): void {
  if (!result.ok) return;

  if (typeof result.projectId === 'string' && !acc.projectId) acc.projectId = result.projectId;

  switch (name) {
    case 'generate_brand_names':
      if (Array.isArray(result.names)) {
        acc.names = (result.names as any[]).map((n) => ({
          id: n.id,
          name: n.name,
          tagline: n.tagline,
          meaning: n.meaning,
        }));
      }
      break;
    case 'generate_logo_concepts':
      if (Array.isArray(result.logos)) acc.logos = result.logos as any[];
      break;
    case 'generate_logo_suite':
      if (result.byStyle && typeof result.byStyle === 'object') {
        // Surface suite marks in the same `logos[]` shape the client already
        // reads, so a suite fills the chooser exactly like individual concepts.
        const fromSuite = Object.entries(result.byStyle as Record<string, any>).map(
          ([style, v]) => ({
            id: v.id,
            url: v.url,
            style,
            mode: 'scratch',
            assetId: v.assetId,
          })
        );
        acc.logos = [...fromSuite, ...acc.logos];

        // Echo the persisted asset ids so the response is self-describing.
        for (const [style, v] of Object.entries(result.byStyle as Record<string, any>)) {
          if (v?.assetId) {
            acc.assets.push({
              id: v.assetId,
              kind: 'logo',
              label: v.label || `${result.brandName ?? 'brand'} — ${style}`,
              url: v.url,
            });
          }
        }
      }
      break;
    case 'generate_brand_certificate':
      acc.assets.push({
        id: result.assetId,
        kind: 'certificate',
        label: result.label || 'Brand Certificate',
        url: result.certificateUrl,
      });
      break;
    case 'set_canvas_state':
      if (result.canvasPatch && typeof result.canvasPatch === 'object') {
        // Merge, never replace: untouched canvas keys survive.
        Object.assign(acc.canvasPatch, result.canvasPatch);
      }
      break;
    case 'save_brand_asset':
      acc.assets.push({
        id: result.assetId,
        kind: result.kind,
        label: result.label,
        url: result.url,
      });
      break;
    case 'list_brand_assets':
      if (Array.isArray(result.assets)) acc.assets.push(...(result.assets as any[]));
      break;
    case 'export_brand_kit':
      acc.exportedKit = result.format === 'markdown' ? result.markdown : result.kit;
      break;
    default:
      break;
  }
}

function coerceIntent(value: unknown): AgentIntent {
  const v = String(value || '').toLowerCase();
  if (v === 'greeting' || v === 'new_brand' || v === 'refine' || v === 'question') return v;
  return 'question';
}

/** Safe JSON extraction — models occasionally wrap objects in prose or fences. */
function parseJsonLoose(raw: string): any | null {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Compose the reply locally from the tool results.
 *
 * The tools are the expensive, valuable part of a turn — a mark that took 45s to
 * render must never be lost because the *summarising* call hit a quota. When the
 * model cannot answer (daily token cap, outage), we still return the real URLs
 * in a plain, deterministic Markdown reply.
 */
function buildLocalReply(
  acc: {
    canvasPatch: Record<string, unknown>;
    names: any[];
    logos: any[];
    assets: any[];
    projectId?: string;
    exportedKit?: unknown;
  },
  toolCalls: AgentToolCallLog[],
  reason: string
): string {
  const lines: string[] = [];

  if (toolCalls.length) {
    lines.push(`**Done** — ${toolCalls.map((t) => `${t.name} (${t.summary})`).join(', ')}.`, '');
  }

  if (acc.logos.length) {
    lines.push('**Logo artwork**', '');
    for (const logo of acc.logos) {
      lines.push(`- **${logo.style ?? 'mark'}** — ![${logo.style ?? 'mark'}](${logo.url})`);
      lines.push(`  \`${logo.url}\``);
    }
    lines.push('');
  }

  if (acc.names.length) {
    lines.push('**Names**', '');
    for (const n of acc.names) {
      lines.push(`- **${n.name}** — ${n.tagline || n.meaning || ''}`);
    }
    lines.push('');
  }

  if (acc.assets.length) {
    lines.push('**Saved assets**', '');
    for (const a of acc.assets) {
      lines.push(`- ${a.kind}: ${a.label}${a.url ? ` — ${a.url}` : ''}`);
    }
    lines.push('');
  }

  if (Object.keys(acc.canvasPatch).length) {
    lines.push(
      `**Canvas updated** — ${Object.entries(acc.canvasPatch)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')}`,
      ''
    );
  }

  if (!lines.length) {
    lines.push(
      `I couldn't reach the language model just now (${reason}). Nothing was changed — please try again in a moment.`
    );
  } else {
    lines.push(`_(${reason} — the actions above completed and are saved.)_`);
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Groq rejects the entire completion with `400 tool_use_failed` when the model's
 * generated arguments fail schema validation — most commonly `null` for an
 * optional string. This is a *request* error, so it never reaches executeTool().
 */
function isToolUseFailure(err: any): boolean {
  const text = `${err?.message || ''} ${err?.error ? JSON.stringify(err.error) : ''}`;
  return text.includes('tool_use_failed') || text.includes('did not match schema');
}

/**
 * Groq's on-demand tier enforces tokens-per-minute. A multi-round tool loop can
 * trip it, and a 429 is transient — waiting is always better than degrading to
 * the no-tools director (which is what silently stopped image generation).
 * Groq tells us how long to wait; fall back to a fixed ladder.
 */
function isRateLimit(err: any): boolean {
  const text = `${err?.message || ''} ${err?.error ? JSON.stringify(err.error) : ''}`;
  return (
    text.includes('rate_limit_exceeded') ||
    text.includes('Rate limit reached') ||
    text.includes('429')
  );
}

function rateLimitWaitMs(err: any, attempt: number): number {
  const match = `${err?.message || ''}`.match(/try again in ([\d.]+)s/i);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000) + 750;
  return attempt === 1 ? 8_000 : 20_000;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One tool-enabled round trip: retries schema rejections with a corrective
 * nudge, and waits out rate limits instead of failing the request.
 */
async function callGroqWithTools(messages: any[]): Promise<any> {
  const MAX_ATTEMPTS = 4;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await chatCompletion({
        messages,
        tools: AGENT_TOOLS as any,
        tool_choice: 'auto',
        temperature: 0.6,
        max_tokens: TOOL_ROUND_MAX_TOKENS,
        // Keeps reasoning from eating the tool-call budget (and cuts latency).
        reasoning_effort: 'low',
      });
    } catch (err: any) {
      const last = attempt === MAX_ATTEMPTS;

      if (isRateLimit(err) && !last) {
        const wait = rateLimitWaitMs(err, attempt);
        console.warn(
          `[Agent] Groq rate limit hit (attempt ${attempt}/${MAX_ATTEMPTS}) — waiting ${wait}ms before retrying.`
        );
        await sleep(wait);
        continue;
      }

      if (isToolUseFailure(err) && !last) {
        console.warn(
          `[Agent] Tool-call arguments rejected by Groq (attempt ${attempt}/${MAX_ATTEMPTS}) — retrying with a nudge.`
        );
        messages.push({
          role: 'system',
          content:
            'Your previous tool call was rejected because its arguments did not match the schema. ' +
            'Optional parameters must be OMITTED ENTIRELY — never send null, empty strings or placeholders. ' +
            'Re-issue the call with only the arguments you need.',
        });
        continue;
      }

      throw err;
    }
  }

  throw new Error('Unreachable: tool call retries exhausted');
}

// ─────────────────────────────────────────────────────────────────────────────

export async function runAgentChat(params: AgentChatParams): Promise<AgentChatResponse> {
  const { message, history = [], currentContext = {} } = params;

  const contextLines = [
    currentContext.industry ? `Industry: ${currentContext.industry}` : '',
    currentContext.tone ? `Tone: ${currentContext.tone}` : '',
    currentContext.selectedName ? `Selected name: ${currentContext.selectedName}` : '',
    currentContext.step ? `Workflow step: ${currentContext.step}` : '',
    (currentContext as any).projectId ? `Project id: ${(currentContext as any).projectId}` : '',
  ].filter(Boolean);

  const ctx: ToolContext = {
    projectId: (currentContext as any).projectId,
    // Client context is forwarded so tools can act even when the model omits
    // arguments — e.g. image generation still gets the brand name and tone.
    selectedName: currentContext.selectedName,
    industry: currentContext.industry,
    tone: currentContext.tone,
    targetAudience: currentContext.targetAudience,
    mission: currentContext.mission,
  };

  const messages: any[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'system',
      content: contextLines.length
        ? `Current workspace state:\n${contextLines.map((l) => `- ${l}`).join('\n')}`
        : 'No brand project has been started yet in this workspace.',
    },
  ];

  for (const turn of history.slice(-6)) {
    messages.push({ role: turn.sender === 'user' ? 'user' : 'assistant', content: turn.text });
  }
  messages.push({ role: 'user', content: message });

  const acc = {
    canvasPatch: {} as Record<string, unknown>,
    names: [] as any[],
    logos: [] as any[],
    assets: [] as any[],
    projectId: undefined as string | undefined,
    exportedKit: undefined as unknown,
  };
  const toolCalls: AgentToolCallLog[] = [];

  try {
    // ── Phase 1: tool loop ──────────────────────────────────────────────────
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      let completion: any;
      try {
        completion = await callGroqWithTools(messages);
      } catch (err: any) {
        // Groq validates tool arguments against the JSON schema *before* our
        // code runs and rejects the whole completion when the model emits
        // `null` for an optional string (e.g. {"kind": null}). The nudge above
        // usually fixes it; if it persists we stop calling tools but keep every
        // result gathered so far and still produce a real answer.
        if (isToolUseFailure(err)) {
          console.warn(
            `[Agent] Tool-call schema rejected by Groq after retries — continuing without further tools: ${err.message.slice(0, 200)}`
          );
          break;
        }
        throw err;
      }

      const choice = completion?.choices?.[0];
      const assistantMessage = choice?.message;
      if (!assistantMessage) throw new Error('Groq returned no message');

      const calls = assistantMessage.tool_calls ?? [];
      messages.push({
        role: 'assistant',
        content: assistantMessage.content ?? '',
        tool_calls: calls.length ? calls : undefined,
      });

      if (calls.length === 0) break;

      for (const call of calls) {
        const toolName = call?.function?.name ?? 'unknown';
        const result = await executeTool(toolName, call?.function?.arguments ?? '{}', ctx);

        toolCalls.push({
          name: toolName,
          ok: Boolean(result.ok),
          summary: summarizeToolResult(toolName, result),
        });
        collectExtras(toolName, result, acc);

        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result).slice(0, MAX_TOOL_RESULT_CHARS),
        });
      }
    }

    // ── Phase 2: structured final answer ────────────────────────────────────
    messages.push({ role: 'user', content: FINAL_FORMAT_INSTRUCTION });

    // Low reasoning effort: this call only reformats facts the tools already
    // produced. Tool *selection* above keeps the model's default effort.
    // Same rate-limit tolerance as the tool rounds.
    //
    // If it still fails, the turn is NOT lost: the tool results (marks that took
    // tens of seconds to render) are returned in a locally-composed reply rather
    // than surfacing a 500 to the client.
    let finalCompletion: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        finalCompletion = await chatCompletion({
          messages,
          jsonMode: true,
          temperature: 0.5,
          max_tokens: 900,
          reasoning_effort: 'low',
        });
        break;
      } catch (err: any) {
        const last = attempt === 3;
        if (isRateLimit(err) && !last) {
          const wait = Math.min(rateLimitWaitMs(err, attempt), 20_000);
          console.warn(`[Agent] Groq rate limit on final answer — waiting ${wait}ms.`);
          await sleep(wait);
          continue;
        }
        if (last) {
          console.warn(
            `[Agent] Final answer unavailable (${String(err.message).slice(0, 140)}) — returning tool results directly.`
          );
          return {
            reply: buildLocalReply(acc, toolCalls, 'the language model was unavailable for the summary'),
            suggestions: ['Try again', 'Show me the brand kit'],
            detectedIntent: 'question',
            extractedBrief: {},
            engine: 'local-tool-summary',
            toolCalls: toolCalls.length ? toolCalls : undefined,
            canvasPatch: Object.keys(acc.canvasPatch).length ? acc.canvasPatch : undefined,
            names: acc.names.length ? acc.names : undefined,
            logos: acc.logos.length ? acc.logos : undefined,
            assets: acc.assets.length ? acc.assets : undefined,
            projectId: acc.projectId,
            exportedKit: acc.exportedKit,
          };
        }
        throw err;
      }
    }

    const raw = finalCompletion?.choices?.[0]?.message?.content ?? '';
    const parsed = parseJsonLoose(raw);

    if (parsed?.reply) {
      return {
        reply: String(parsed.reply),
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions.slice(0, 4).map(String)
          : ['Show me the brand kit', 'Try a bolder direction', 'Start a new brand'],
        detectedIntent: coerceIntent(parsed.detectedIntent),
        extractedBrief: parsed.extractedBrief ?? {},
        engine: 'groq-tools',
        toolCalls: toolCalls.length ? toolCalls : undefined,
        canvasPatch: Object.keys(acc.canvasPatch).length ? acc.canvasPatch : undefined,
        names: acc.names.length ? acc.names : undefined,
        logos: acc.logos.length ? acc.logos : undefined,
        assets: acc.assets.length ? acc.assets : undefined,
        projectId: acc.projectId,
        exportedKit: acc.exportedKit,
      };
    }

    // Model ignored the JSON contract but still said something useful.
    const fallbackReply =
      raw?.trim() ||
      `I ran ${toolCalls.length} action(s) but could not phrase the summary. Here is what changed: ` +
        toolCalls.map((t) => `${t.name} (${t.summary})`).join(', ');

    return {
      reply: fallbackReply,
      suggestions: ['Show me the brand kit', 'Try another direction'],
      detectedIntent: 'question',
      extractedBrief: {},
      engine: 'groq-tools',
      toolCalls: toolCalls.length ? toolCalls : undefined,
      canvasPatch: Object.keys(acc.canvasPatch).length ? acc.canvasPatch : undefined,
      names: acc.names.length ? acc.names : undefined,
      logos: acc.logos.length ? acc.logos : undefined,
      assets: acc.assets.length ? acc.assets : undefined,
      projectId: acc.projectId,
      exportedKit: acc.exportedKit,
    };
  } catch (err: any) {
    // Tool calling is an enhancement, not a dependency: degrade to the
    // original single-shot JSON director so chat never goes dark.
    console.warn(`[Agent] Tool loop failed (${err.message}) — falling back to JSON director.`);

    const extras = {
      toolCalls: toolCalls.length ? toolCalls : undefined,
      canvasPatch: Object.keys(acc.canvasPatch).length ? acc.canvasPatch : undefined,
      names: acc.names.length ? acc.names : undefined,
      logos: acc.logos.length ? acc.logos : undefined,
      assets: acc.assets.length ? acc.assets : undefined,
      projectId: acc.projectId,
    };

    try {
      const legacy = await chatWithAgent(params);
      return {
        ...legacy,
        suggestions: legacy.suggestions ?? ['Show me the brand kit', 'Try a bolder direction'],
        extractedBrief: legacy.extractedBrief ?? {},
        engine: 'groq-json-fallback',
        ...extras,
      };
    } catch (secondErr: any) {
      // Both model paths are down (e.g. the daily token cap). Anything the tools
      // did produce is still returned — that is the difference between a user
      // seeing their generated logo and seeing an error.
      console.warn(
        `[Agent] JSON director also failed (${String(secondErr.message).slice(0, 140)}) — returning tool results directly.`
      );
      return {
        reply: buildLocalReply(
          acc,
          toolCalls,
          'the language model is unavailable right now (quota or outage)'
        ),
        suggestions: ['Try again', 'Show me the brand kit'],
        detectedIntent: 'question',
        extractedBrief: {},
        engine: 'local-tool-summary',
        ...extras,
      };
    }
  }
}
