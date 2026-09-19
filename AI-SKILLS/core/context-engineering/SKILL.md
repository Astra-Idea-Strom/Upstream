---
name: context-engineering
description: >-
  Context window management: pruning irrelevant history, hierarchical summarization, and high-density token budgeting. Use when managing long chat histories, fitting complex tasks into model context limits, or distilling conversation state. Not for prompt structure or subagent delegation briefs (that is prompt-engineering or prompt-optimization).
---

# Context Engineering: Token Efficiency & Context Window Management

## 1. Information Classification Hierarchy

Context is a finite, degrading working memory. Classify every piece of incoming information before carrying it across conversation turns:

| Class | Definition | Action |
| :--- | :--- | :--- |
| **CRITICAL** | Current user goal, active file diff, failing test trace, immediate acceptance test. | **Always keep** in immediate context. |
| **RELEVANT** | Types, interfaces, active skill instructions, database schema. | **Keep during active milestone**, discard when milestone finishes. |
| **SUPPORTING**| Third-party documentation, architectural background, installation logs. | **Retrieve on demand via tool calls**; do not linger. |
| **STALE** | Superseded test outputs, old diff iterations, replaced plans. | **Compress or discard immediately**. |
| **IRRELEVANT** | Unrelated repo files, chat pleasantries, unused skill manuals. | **Never load into context**. |

---

## 2. Tool-Output & Observation Management

Large tool outputs degrade model reasoning and waste token budgets. Apply strict extraction:

1. **Large Command/Log Outputs**:
   - If a build or test command outputs 200 lines, extract only:
     - The exit code
     - The exact failing assertion/error message with file and line number
     - The relevant 3-line snippet.
   - Never repeat the full 200-line raw output in subsequent prompt turns.
2. **Directory & File Viewing**:
   - Use targeted `view_file` with line slices (`StartLine`, `EndLine`) rather than dumping 2,000 lines.
   - Use `find_by_name` or `grep_search` with specific query patterns rather than full-tree dumps.

---

## 3. Context Compression Techniques

When conversation history grows long:
- **Summarize Completed Milestones**: Replace a 10-turn debugging conversation with a 2-line summary:
  *"Resolved TypeError in `checkout.ts:42` by adding nullish coalescing on `order.items`. Verified with `npm test`."*
- **Preserve Critical State**: Never summarize away active file paths, open questions, failing tests, or unverified assumptions.

---

## 4. Anti-Patterns
- **The Context Hoarder**: Carrying forward 50KB of raw terminal output across 6 conversation turns.
- **Blind Summarization**: Summarizing away the exact error message or stack trace needed to diagnose a bug.
- **Re-reading Unchanged Files**: Calling `view_file` on the same unchanged configuration file 4 times in a row.

---

## 5. Verification Check
- Is every token currently in context actively aiding the immediate engineering decision?
- Have completed milestones been compressed into concise verified outcomes?
- Are tool outputs filtered down to their essential diagnostic signal?

---

## 6. The Skill-Loading Contract
Skill activation is the largest single discretionary cost in a session. The
budget is explicit:

| Item | Tokens | Rule |
| :--- | ---: | :--- |
| Full skill library | ~71,000 | Never loaded. Ever. |
| Routing metadata | 0 (CLI) | Read in a subprocess, not in context. |
| Router output | ~120 | The only routing cost the session pays. |
| Selected skills | ≤5,000 | Enforced by `--budget`; typical query spends ~1,400. |

Rules:
1. Route once per distinct task, not once per turn.
2. Never load a `SKILL.md` "just in case" — if the router did not select it, the
   evidence says you do not need it.
3. When a milestone completes, the skills it needed become **STALE**. Drop them.
4. If the router returns zero skills, that is an answer. Proceed on base
   capability; do not go browsing the library.
5. `references/` files inside a skill are Tier 3: load one only when the body
   explicitly sends you there and you are blocked without it.

