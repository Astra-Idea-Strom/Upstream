/**
 * Chat provider chain: Groq → Cloudflare Workers AI.
 *
 * Both hosts serve the *same* model (`openai/gpt-oss-120b`), so a Groq quota
 * wall does not have to mean "no output". Groq stays primary (it is the
 * configured chat provider and the faster path); Cloudflare takes over when Groq
 * answers 429/5xx or the network fails.
 *
 * Callers get a normalised OpenAI-shaped completion either way, so the agent
 * loop never needs to know which host answered.
 */

import { groq } from '../config/groq';
import { GROQ_CHAT_MODEL } from '../config/imagegen';
import { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, hasCloudflareVision } from '../config/imagegen';

/** Same weights, different host — used when Groq is rate limited. */
export const CLOUDFLARE_CHAT_MODEL = process.env.CLOUDFLARE_CHAT_MODEL || '@cf/openai/gpt-oss-120b';

export interface ChatCallParams {
  messages: any[];
  tools?: any[];
  tool_choice?: any;
  jsonMode?: boolean;
  max_tokens?: number;
  temperature?: number;
  reasoning_effort?: string;
}

export interface NormalizedChoice {
  message: { role?: string; content: string | null; tool_calls?: any[] };
  finish_reason?: string;
}

export interface NormalizedCompletion {
  choices: NormalizedChoice[];
  provider: 'groq' | 'cloudflare';
}

/** Groq answered "no tokens left"; skip it briefly instead of re-paying the timeout. */
let groqCooldownUntil = 0;
const GROQ_COOLDOWN_MS = 90_000;

function isRateLimited(err: any): boolean {
  const text = `${err?.message || ''} ${err?.error ? JSON.stringify(err.error) : ''}`;
  return text.includes('rate_limit_exceeded') || text.includes('Rate limit reached');
}

function isTransient(err: any): boolean {
  const status = err?.status ?? err?.response?.status;
  const text = String(err?.message || '');
  return (
    isRateLimited(err) ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 529 ||
    /fetch failed|ECONNRESET|ETIMEDOUT|network/i.test(text)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Groq
// ─────────────────────────────────────────────────────────────────────────────

async function callGroq(params: ChatCallParams): Promise<NormalizedCompletion> {
  const body: any = {
    model: GROQ_CHAT_MODEL,
    messages: params.messages,
    temperature: params.temperature ?? 0.6,
    max_tokens: params.max_tokens ?? 900,
  };
  if (params.tools?.length) {
    body.tools = params.tools;
    body.tool_choice = params.tool_choice ?? 'auto';
  }
  if (params.jsonMode) body.response_format = { type: 'json_object' };
  if (params.reasoning_effort) body.reasoning_effort = params.reasoning_effort;

  const res: any = await groq.chat.completions.create(body);
  const choice = res?.choices?.[0];
  if (!choice?.message) throw new Error('Groq returned no message');

  return {
    choices: [
      {
        message: {
          role: choice.message.role,
          content: choice.message.content ?? '',
          tool_calls: choice.message.tool_calls ?? undefined,
        },
        finish_reason: choice.finish_reason,
      },
    ],
    provider: 'groq',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Workers AI
// ─────────────────────────────────────────────────────────────────────────────

async function callCloudflare(
  params: ChatCallParams,
  opts: { jsonMode: boolean }
): Promise<NormalizedCompletion> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${CLOUDFLARE_CHAT_MODEL}`;

  const body: any = {
    messages: params.messages,
    temperature: params.temperature ?? 0.6,
    max_tokens: params.max_tokens ?? 900,
  };
  if (params.tools?.length) {
    body.tools = params.tools;
    body.tool_choice = params.tool_choice ?? 'auto';
  }
  if (opts.jsonMode) body.response_format = { type: 'json_object' };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload: any = await res.json().catch(() => null);

  if (!res.ok || payload?.success === false) {
    const detail = payload?.errors?.[0]?.message || `HTTP ${res.status}`;

    // Some Workers AI models reject response_format; retry once without it —
    // the prompt already demands bare JSON and parseJsonLoose tolerates prose.
    if (opts.jsonMode && /response_format|json_object|Bad input/i.test(String(detail))) {
      console.warn('[ChatProvider] Cloudflare rejected json mode — retrying without it.');
      return callCloudflare(params, { jsonMode: false });
    }
    throw new Error(`Cloudflare chat failed: ${detail}`);
  }

  const result = payload?.result ?? payload;
  const choice = result?.choices?.[0];
  if (!choice?.message) throw new Error('Cloudflare returned no message');

  return {
    choices: [
      {
        message: {
          role: choice.message.role,
          content: choice.message.content ?? '',
          tool_calls: choice.message.tool_calls ?? undefined,
        },
        finish_reason: choice.finish_reason,
      },
    ],
    provider: 'cloudflare',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a chat completion against the first provider that will serve it.
 *
 * Throws only when *every* provider failed; callers treat that as "the model is
 * unavailable" and fall back to returning tool results directly.
 */
export async function chatCompletion(params: ChatCallParams): Promise<NormalizedCompletion> {
  const groqOnCooldown = Date.now() < groqCooldownUntil;

  if (!groqOnCooldown) {
    try {
      return await callGroq(params);
    } catch (err: any) {
      if (!isTransient(err)) throw err;

      if (isRateLimited(err)) {
        groqCooldownUntil = Date.now() + GROQ_COOLDOWN_MS;
        console.warn(
          `[ChatProvider] Groq rate limited — switching to Cloudflare ${CLOUDFLARE_CHAT_MODEL} for ${GROQ_COOLDOWN_MS / 1000}s.`
        );
      } else {
        console.warn(`[ChatProvider] Groq error (${String(err.message).slice(0, 120)}) — trying Cloudflare.`);
      }
    }
  }

  if (!hasCloudflareVision()) {
    throw new Error('Groq unavailable and Cloudflare is not configured');
  }

  return callCloudflare(params, { jsonMode: Boolean(params.jsonMode) });
}
