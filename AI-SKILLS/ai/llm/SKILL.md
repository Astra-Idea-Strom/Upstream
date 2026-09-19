---
name: llm
description: >-
  LLM API integration, token budgeting, prompt construction, streaming responses, and temperature/sampling configuration. Use when calling OpenAI, Anthropic, or Gemini APIs, streaming tokens to clients, or handling model context windows. Not for agentic delegation loops or vector storage (that is agents or embeddings).
---

# LLM: Model Selection, Parameter Calibration & Streaming Architectures

## 1. Core Model Invariants

1. **Deterministic Parameters for Deterministic Tasks**: Set `temperature = 0.0` (or `0.1`) and `top_p = 1.0` for code generation, JSON extraction, entity classification, and math. Only increase temperature (0.5 - 0.7) for creative writing or conversational variety.
2. **Strict Token Budgeting**: Calculate input context tokens and reserve an explicit output buffer (`max_tokens`) to prevent abrupt generation cutoffs and unbudgeted cloud API costs.
3. **Always Stream for Interactive Interfaces**: End users should never stare at a blank spinner for 8 seconds. Stream model responses incrementally using Server-Sent Events (SSE) or WebSockets to reduce Time-To-First-Byte (TTFB) under 800ms.
4. **Graceful Fallback & Retry Strategy**: Implement exponential backoff with jitter on rate limits (HTTP 429) and server overloads (HTTP 503). Have a lighter fallback model configured.

---

## 2. Key Implementation Patterns

### A. Model Selection Decision Framework

| Task Category | Recommended Tier | Typical Models | Rationale |
| :--- | :--- | :--- | :--- |
| **Complex Planning & Logic** | Frontier / Pro | GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro | Highest reasoning accuracy, deep multi-turn context |
| **High-Throughput Extraction / RAG** | Fast / Light | GPT-4o-mini, Claude 3.5 Haiku, Gemini 1.5 Flash | 10x lower latency, 90% cheaper, sufficient for extraction |
| **Offline / Strict Privacy** | Local / Self-Hosted | Llama 3.1 8B/70B via Ollama / vLLM | Zero data leaves perimeter, zero per-token billing |

### B. Streaming Response with Server-Sent Events (Express / Node.js)
```typescript
import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI();

export async function streamChatHandler(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: req.body.prompt }],
      temperature: 0.2,
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`);
    res.end();
  }
}
```

---

## 3. Anti-Patterns to Avoid

- **High Temperature on Structured Output**: Setting `temperature = 0.8` when asking for JSON output, resulting in hallucinated syntax errors and malformed keys.
- **Unbounded Context Accumulation**: Appending entire multi-turn chat transcripts without pruning or summarization, eventually overflowing context limits and spiking costs.
- **Synchronous Blocking UI Calls**: Waiting for 2,000 generated tokens in a single blocking HTTP request without UI progress feedback.

---

## 4. Verification Checklist

- [ ] Task temperature aligns with deterministic vs creative requirements.
- [ ] Token count pre-flight checks prevent context window overflows.
- [ ] Streaming SSE responses deliver TTFB under 1 second.
- [ ] Exponential backoff handles 429 rate limit exceptions cleanly.
