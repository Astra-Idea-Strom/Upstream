---
name: tool-use
description: >-
  LLM tool calling, function definitions, JSON schema parameters, tool execution loops, and error recovery. Use when equipping LLMs with external tools, writing function definitions, parsing tool calls, or executing client-side functions. Not for autonomous multi-agent orchestration (that is agents).
---

# Tool Use: Function Calling, JSON Schemas & Error Recovery

## 1. Core Tool Use Invariants

1. **Strict JSON Schema Contracts**: All tool parameters must be declared with unambiguous JSON Schema definitions, including field descriptions, explicit types, and required lists.
2. **Runtime Argument Validation**: Never execute a tool directly with raw arguments from an LLM. Validate parameters against a runtime schema (Zod, Pydantic) before execution.
3. **Structured Error Feedback Loop**: When a tool fails or throws an exception, return the structured error message back to the LLM so it can correct its arguments on the subsequent turn.
4. **Idempotency Where Possible**: Design state-modifying tools with idempotency tokens to protect against accidental duplicate invocations during retries.

---

## 2. Key Implementation Patterns

### A. Declaring Tools with JSON Schema & Zod
```typescript
import { z } from "zod";

// 1. Define Zod validation schema
export const searchProductsSchema = z.object({
  query: z.string().min(1).describe("The search term or product name"),
  category: z.enum(["electronics", "clothing", "home"]).optional().describe("Product category filter"),
  maxPrice: z.number().positive().optional().describe("Maximum price in USD"),
  limit: z.number().int().min(1).max(50).default(10).describe("Number of results to return")
});

export type SearchProductsArgs = z.infer<typeof searchProductsSchema>;

// 2. Export OpenAI-compatible tool declaration
export const searchProductsTool = {
  type: "function" as const,
  function: {
    name: "search_products",
    description: "Search the product catalog by query, category, and maximum price.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search term or product name" },
        category: { type: "string", enum: ["electronics", "clothing", "home"], description: "Category filter" },
        maxPrice: { type: "number", description: "Maximum price in USD" },
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 }
      },
      required: ["query"]
    }
  }
};
```

### B. Safe Execution & Self-Correction Handler
```typescript
export async function executeFunctionCall(
  toolName: string,
  rawArguments: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    // 1. Parse JSON safely
    const parsedJson = JSON.parse(rawArguments);

    // 2. Validate against schema
    if (toolName === "search_products") {
      const validatedArgs = searchProductsSchema.parse(parsedJson);
      const results = await catalogService.search(validatedArgs);
      return { success: true, data: results };
    }

    return { success: false, error: `Unknown tool: ${toolName}` };
  } catch (error) {
    // Return precise validation error to model for recovery
    return {
      success: false,
      error: error instanceof z.ZodError 
        ? `Schema Validation Error: ${JSON.stringify(error.format())}` 
        : `Execution Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
```

---

## 3. Anti-Patterns to Avoid

- **Trusting LLM Arguments Without Validation**: Directly passing `args.id` into database deletion queries without verifying ownership or type.
- **Vague Tool Descriptions**: Writing `description: "does stuff"` which confuses the model's tool selection heuristics.
- **Crashing the Entire Turn on Tool Failure**: Throwing an unhandled exception instead of feeding the error back to the LLM to allow self-repair.

---

## 4. Verification Checklist

- [ ] Tool definitions have clear descriptions and explicit parameter types.
- [ ] Runtime Zod/Pydantic validation guards tool entry points.
- [ ] Error messages return actionable hints for model self-correction.
- [ ] Modifying operations enforce authorization and safety checks.
