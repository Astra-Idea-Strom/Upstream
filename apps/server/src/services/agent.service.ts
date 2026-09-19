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

import { groq } from '../config/groq';
import { GROQ_CHAT_MODEL } from '../config/imagegen';
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
  engine: 'groq-tools' | 'groq-json-fallback';
  toolCalls?: AgentToolCallLog[];
  canvasPatch?: Record<string, unknown>;
  names?: Array<{ id: string; name: string; tagline: string; meaning: string }>;
  logos?: Array<{ id: string; url: string; style: string; mode?: string; assetId?: string }>;
  assets?: Array<{ id: string; kind: string; label: string; url?: string }>;
  projectId?: string;
  exportedKit?: unknown;
}

const MAX_TOOL_ROUNDS = 4;
const MAX_TOOL_RESULT_CHARS = 6000;

const SYSTEM_PROMPT = `You are Upstream's AI Brand Director — a creative director AND the operator of this workspace.

You do not merely advise. You ACT. You have tools that really generate brand names, really draw logo artwork with FLUX.2, really read images with a vision model, really update the brand kit, and really store assets. When the user asks for something to be done, call the matching tool and then report what came back.

## Tool policy
1. Never claim you created, changed, generated or saved anything unless a tool call actually did it.
2. If the user gives a brand name, pass that EXACT string as \`brandName\` — spelling and casing matter, it is rendered into the artwork's wordmark.
3. Names requested → \`generate_brand_names\`. Logos / marks / redraws → \`generate_logo_concepts\`. When the user wants the whole set of directions ("all five styles", "fill the logo chooser", "show me every direction"), call \`generate_logo_suite\` once instead of looping \`generate_logo_concepts\` — it returns one real mark per studio style, keyed by style name.
4. Certificates, trademark credentials, authenticity documents requested → \`generate_brand_certificate\`.
5. Images — uploaded, pasted, or referenced by path/URL (certificates, logos, screenshots, references) → ALWAYS call \`describe_image\` with that value in the \`image\` field. Paths like \`/api/assets/generated/x.jpg\` ARE readable by the tool. Never reply that you cannot see or access an image without first calling \`describe_image\`; if the tool then fails, report what it said.
6. Renames, new taglines, tone shifts, brief edits → \`update_brand_kit\` (one field per call).
7. Anything the user wants kept — a logo, a certificate, a palette, a reference — → \`save_brand_asset\`. Note: \`generate_logo_concepts\` already persists each concept and returns its URL, so do NOT re-save those; only call \`save_brand_asset\` for uploads, certificates or extra artefacts. When a URL already exists, pass it as \`url\` — never as \`image\`.
8. Visual/canvas adjustments → \`set_canvas_state\`, sending ONLY the keys that change. Never clear, reset or remove canvas sections; the user's existing sections must survive every change.
9. Prefer one well-chosen tool call over a chain. Do not re-generate something that already exists unless the user asked for a variation.
10. If a tool reports ok:false, say plainly what failed and what you would try next. Do not silently retry more than once.

## Voice
Warm, decisive, art-director energy. Concise Markdown with real substance: lead with what you did, then the specifics (names, palette hexes, asset URLs).

After your tool work is finished, you will be asked for a final JSON object. Respond with ONLY that JSON, no code fences.`;

const FINAL_FORMAT_INSTRUCTION = `Now produce the final answer as a single JSON object — no markdown fences, no preamble:

{
  "reply": "Markdown reply to the user. State concretely what you did, using the real values the tools returned (names, hexes, asset URLs). Never invent values a tool did not return.",
  "suggestions": ["2-3 short follow-up chips the user might click"],
  "detectedIntent": "greeting" | "new_brand" | "refine" | "question",
  "extractedBrief": {
    "businessName": "only if the user named the brand, else empty string",
    "industry": "clean industry label, else empty string",
    "tone": "playful | bold | minimalist | luxurious | tech-forward | professional, else empty string",
    "targetAudience": "else empty string",
    "mission": "else empty string"
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
 * One tool-enabled round trip, with a corrective nudge and retry when Groq
 * rejects the model's argument payload.
 */
async function callGroqWithTools(messages: any[]): Promise<any> {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await groq.chat.completions.create({
        model: GROQ_CHAT_MODEL,
        messages,
        tools: AGENT_TOOLS as any,
        tool_choice: 'auto',
        temperature: 0.6,
        max_tokens: 1800,
      } as any);
    } catch (err: any) {
      if (!isToolUseFailure(err) || attempt === MAX_ATTEMPTS) throw err;

      console.warn(
        `[Agent] Tool-call arguments rejected by Groq (attempt ${attempt}/${MAX_ATTEMPTS}) — retrying with a nudge.`
      );
      messages.push({
        role: 'system',
        content:
          'Your previous tool call was rejected because its arguments did not match the schema. ' +
          'Optional parameters must be OMITTED ENTIRELY — never send null, empty strings or placeholder values. ' +
          'Re-issue the call with only the arguments you actually need.',
      });
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

  const ctx: ToolContext = { projectId: (currentContext as any).projectId };

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
    const finalCompletion: any = await groq.chat.completions.create({
      model: GROQ_CHAT_MODEL,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1400,
      reasoning_effort: 'low',
    } as any);

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

    const legacy = await chatWithAgent(params);
    return {
      ...legacy,
      suggestions: legacy.suggestions ?? ['Show me the brand kit', 'Try a bolder direction'],
      extractedBrief: legacy.extractedBrief ?? {},
      engine: 'groq-json-fallback',
      toolCalls: toolCalls.length ? toolCalls : undefined,
    };
  }
}
