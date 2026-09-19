---
name: agents
description: >-
  Autonomous AI agent architecture: plan-execute-evaluate cycles, memory stores, subagent delegation, and loop safety bounds. Use when designing multi-step agentic workflows, orchestrating subagents, or implementing autonomous tool loops. Not for single-turn prompt conditioning or tool calling schemas (that is prompt-engineering or tool-use).
---

# Agents: ReAct Loops, State Machines & Autonomous Guardrails

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 1. Core Autonomous Agent Invariants

1. **Deterministic Loop Termination**: Every agent loop must enforce hard termination criteria: maximum steps (`max_iterations = 10`), wall-clock timeout, or explicit finish signal. Unbounded while-loops are strictly prohibited.
2. **ReAct Paradigm (Reason, Act, Observe)**: The agent must articulate its reasoning thought before invoking tools, then process observations objectively before taking subsequent actions.
3. **Immutable State Machine**: Agent transitions (IDLE -> PLANNING -> EXECUTING -> EVALUATING -> TERMINATED) must be tracked via an explicit state container with rollback capabilities.
4. **Human-in-the-Loop Escalation**: Destructive actions (deleting databases, sending external emails, financial transactions) require human approval before execution.

---

## 2. Key Implementation Patterns

### A. ReAct Execution Loop Engine
```typescript
interface AgentState {
  step: number;
  maxSteps: number;
  history: Array<{ role: "thought" | "tool_call" | "observation"; content: string }>;
  isFinished: boolean;
}

export async function runAgentLoop(
  taskGoal: string,
  tools: Record<string, Function>,
  maxSteps = 8
): Promise<string> {
  let state: AgentState = { step: 0, maxSteps, history: [], isFinished: false };

  while (!state.isFinished && state.step < state.maxSteps) {
    state.step++;

    // 1. Model Reasons and selects Action
    const decision = await model.decideNextStep(taskGoal, state.history);

    state.history.push({ role: "thought", content: decision.thought });

    if (decision.isFinalAnswer) {
      state.isFinished = true;
      return decision.finalOutput;
    }

    // 2. Execute selected Tool Action safely
    try {
      const toolFn = tools[decision.toolName];
      if (!toolFn) throw new Error(`Unknown tool: ${decision.toolName}`);

      const observation = await toolFn(decision.toolArgs);
      state.history.push({
        role: "observation",
        content: JSON.stringify(observation)
      });
    } catch (toolError) {
      state.history.push({
        role: "observation",
        content: `Error executing tool: ${toolError instanceof Error ? toolError.message : String(toolError)}`
      });
    }
  }

  throw new Error(`Agent exceeded maximum execution step limit (${maxSteps}) without resolving goal.`);
}
```

### B. Orchestrator-Worker Multi-Agent Pattern
1. **Planner / Orchestrator**: Decomposes high-level prompt into isolated subtasks and assigns them to specialized agents.
2. **Specialized Workers**: Independent agents executing bounded sub-problems (e.g. Researcher, Coder, Auditor).
3. **Synthesizer / Verifier**: Evaluates worker outputs against acceptance criteria before delivering final result.

---

## 3. Anti-Patterns to Avoid

- **Unbounded While Loops**: Running `while (!done)` where a repeated tool error causes an infinite loop that burns API credits.
- **Lost Context in Multi-Turn Agents**: Allowing agent transcripts to grow infinitely until token truncation causes the model to forget its initial goal.
- **Autonomous Destructive Execution**: Allowing an agent to execute `DROP TABLE` or `rm -rf` autonomously without confirmation gates.

---

## 4. Verification Checklist

- [ ] Agent terminates deterministically on `maxSteps` or target completion.
- [ ] Tool execution errors are captured and fed back as observations for self-correction.
- [ ] Destructive side effects require explicit confirmation.
- [ ] State transitions follow an explicit finite state machine.
