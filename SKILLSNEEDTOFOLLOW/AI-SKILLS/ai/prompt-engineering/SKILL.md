---
name: prompt-engineering
description: >-
  System prompts, XML instruction structure, few-shot demonstration conditioning, and role definition for language models. Use when authoring system instructions, structuring user prompts, conditioning model behavior, or extracting structured data. Not for subagent delegation briefs or prompt token compression (that is prompt-optimization).
---

# Prompt Engineering: Structural Design, Few-Shot & Reasoning Guardrails

## 1. Core Prompting Invariants

1. **Strict Sectional Modularity**: Structure system prompts into discrete, unambiguous XML or Markdown blocks: `<role>`, `<objective>`, `<context>`, `<rules>`, `<negative_constraints>`, `<output_format>`.
2. **Explicit Negative Constraints**: State what the model must NOT do in clear, direct language (e.g. "Do not explain code unless requested; do not invent API endpoints not present in schema").
3. **High-Signal Few-Shot Demonstrations**: Provide 2–3 input/output exemplar pairs when consistent formatting, tone, or complex schema mapping is required.
4. **Deliberate Chain-of-Thought**: Force models to reason through intermediate steps before emitting final answers for complex logic, math, or classification problems.

---

## 2. Key Implementation Patterns

### A. Production System Prompt Template
```markdown
<role>
You are an expert full-stack TypeScript architect and security auditor.
</role>

<objective>
Analyze the user's API route implementation, identify security vulnerabilities or logic flaws, and provide a corrected production implementation.
</objective>

<rules>
1. Evaluate code against OWASP API Top 10 guidelines.
2. Ensure strict Zod schema validation on all inputs.
3. Use parameterized queries for all database interactions.
4. Keep explanations concise and focused on rationale.
</rules>

<negative_constraints>
- DO NOT use the "any" type in TypeScript.
- DO NOT propose libraries that are unmaintained or deprecated.
- DO NOT invent environment variables without documenting them.
</negative_constraints>

<output_format>
Output your response using the following structure:
### Vulnerability Analysis
- [Itemized list of findings with severity]

### Corrected Code
```typescript
// Production-grade implementation
```
</output_format>
```

### B. Few-Shot Exemplar Structure
```markdown
<examples>
<example>
<input>
"User 42 updated phone to 555-0199 on 2026-09-18"
</input>
<output>
{
  "entity": "user",
  "id": 42,
  "action": "update_phone",
  "value": "555-0199",
  "timestamp": "2026-09-18T00:00:00Z"
}
</output>
</example>
</examples>
```

---

## 3. Anti-Patterns to Avoid

- **Walls of Unstructured Prose**: Giving 500 words of conversational narrative where critical constraints get buried and ignored.
- **Vague Directives**: Using ambiguous adjectives like "make it good", "be helpful", or "write clean code" instead of concrete behavioral rules.
- **Conflicting Instructions**: Ordering the model to "be exhaustive and detail every edge case" while simultaneously demanding "keep it under 2 sentences".

---

## 4. Verification Checklist

- [ ] System prompt uses explicit structural delimiters (`<role>`, `<rules>`, `<output_format>`).
- [ ] Negative constraints prevent common hallucination paths.
- [ ] Few-shot examples mirror desired production edge cases.
- [ ] Output schema format is deterministically specified.
