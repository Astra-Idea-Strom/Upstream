---
name: prompt-optimization
description: >-
  High-signal prompt engineering for subagents, task tools, and LLM APIs: XML tag structuring,
  JSON schemas, few-shot conditioning, and delegation briefs. Use when crafting prompts for
  subagents, defining tool schemas, reducing prompt bloat, or improving LLM instruction adherence.
  Not for end-user chat interfaces or prompt evaluation pipelines (that is prompt-engineering or ai-evaluation).
---

# Prompt Optimization: High-Signal Subagent & Tool Instructions

## 1. The High-Signal Prompting Standard

When delegating tasks to subagents, task execution tools, or external LLM APIs, eliminate conversational filler. Structure instructions with clear modular XML tags to maximize reasoning precision:

```xml
<context>
Workspace: Next.js 14 App Router, Prisma ORM, PostgreSQL.
Target file: src/app/api/auth/route.ts
</context>

<task>
Implement rate-limiting on POST /api/auth using Redis token-bucket algorithm.
</task>

<constraints>
- Use existing redis client from src/lib/redis.ts.
- Maximum 5 requests per 60 seconds per IP.
- Return HTTP 429 with 'Retry-After' header when exceeded.
- Do not modify Prisma schema or user authentication logic.
</constraints>

<output_format>
Return only the modified route handler code in src/app/api/auth/route.ts.
</output_format>
```

---

## 2. Complete Subagent & Task Tool Delegation Brief

When invoking a subagent or task tool, provide a self-contained execution contract:

```typescript
// Subagent delegation payload specification
const subagentTask = {
  role: "Backend Security Specialist",
  prompt: `
Task: Audit and secure src/server/billing.ts against timing attacks.

Files:
- Target: src/server/billing.ts
- Test Suite: tests/billing.test.ts

Constraints:
- Use crypto.timingSafeEqual for signature comparison.
- Maintain existing function signatures.
- Do not introduce external npm dependencies.

Verification Command:
npm test -- tests/billing.test.ts
`
};
```

---

## 3. Structured JSON Schema Conditioning

When reliable structured output is required, bind the LLM output to a strict JSON Schema or Zod definition:

```typescript
import { z } from "zod";

export const TaskDecompositionSchema = z.object({
  milestones: z.array(
    z.object({
      id: z.string().regex(/^M[0-9]+$/),
      title: z.string().min(5),
      targetFiles: z.array(z.string()),
      acceptanceCriteria: z.string(),
      estimatedLoc: z.number().int().positive()
    })
  ).min(1).max(5)
});

export type TaskDecomposition = z.infer<typeof TaskDecompositionSchema>;
```

---

## 4. Few-Shot Conditioning & Compression Boundaries

### Few-Shot Implementation Rules
- Provide 2–3 diverse, realistic input/output pairs.
- Demonstrate negative edge cases (e.g., malformed inputs returning structured errors).
- Place few-shot examples inside `<examples>` tags before the target query.

### When NOT to Compress a Prompt
- **Security Boundaries**: Never compress authentication, encryption, or authorization constraints.
- **Edge-Case Handling**: Never remove explicit instructions on handling null, undefined, or empty arrays.
- **Ambiguity Risk**: If removing 10 tokens introduces interpretative ambiguity, retain the tokens.

---

## 5. Empirical 5-Sample Prompt Testing Protocol

Before deploying or committing a prompt template, run 5 standardized test evaluations:
1. **Happy Path**: Standard valid input produces expected schema and output.
2. **Empty / Minimal Input**: Valid but minimal parameters handled gracefully.
3. **Boundary / Overflow**: Edge values (e.g. 0, negative, maximum integer, 10,000 characters).
4. **Adversarial / Malformed**: Injection attempts or corrupted input format.
5. **Format Adherence**: Output parses cleanly with schema validator on 5/5 runs.

---

## 6. Verification Checklist

- [ ] Instructions are compartmentalized into distinct XML sections (`<context>`, `<task>`, `<constraints>`).
- [ ] Subagent delegation briefs contain explicit target paths and exact test commands.
- [ ] Expected schema is defined via TypeScript interfaces or JSON schema.
- [ ] No host-specific proprietary tool names are assumed; neutral task tool phrasing is used.
