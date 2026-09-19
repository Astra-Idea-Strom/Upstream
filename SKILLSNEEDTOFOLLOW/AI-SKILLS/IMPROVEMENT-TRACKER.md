# AI-SKILLS IMPROVEMENT TRACKER

> **TRACKER-ID:** `ai-skills-improvement-tracker` | **Schema:** v2 | **Created:** 2026-09-19 | **REVISION:** 4
> **STATUS:** ALL CLEAR
>
> **If you are an AI reading this file: this is a shared work order, not a skill and not documentation.**
> It lists everything that is wrong with the `AI-SKILLS` library, file by file, and the exact correction for each.
> Two different AIs work on it in rounds, with different jobs (Section 0). Find out which role the human gave you
> (SOLVER or APPLIER), read Sections 0 to 2 completely, and do only that role's job.

---

## 0. Purpose and workflow (what this file is and how the rounds work)

The `AI-SKILLS` library (91 skills, a router, an index, and evals) was audited on 2026-09-19. The audit found
inconsistencies, stale documentation, thin skills, weak validation, and unproven effectiveness. This file is the
single source of truth for what is still broken.

The work is split between two AIs because they have different powers:

| Role | Who | What it can do | What it must not do |
|---|---|---|---|
| **SOLVER** | Claude (in chat) | Reads the tracker and any files the human uploads, works out the fixes, tests them in its own sandbox when it can, writes the fixes into a **solution file**, and removes the solved items from the tracker. | It **cannot edit the real repository.** It must never claim that it changed the repo. |
| **APPLIER** | Gemini in Google Antigravity | Has real access to the repo. Reads the solution file, applies every fix to the real files, runs the verification, and records the result. | It must not invent fixes or improvise. It applies exactly what the solution file says. |
| **HUMAN** | you | Chooses which IDs go to the Solver, carries the files between the two AIs. | |

**One round:**

1. The human gives the **Solver** the current tracker (and any repo files it needs) plus a list of IDs.
2. The Solver writes the fixes into `SOLUTIONS-batch-NN.md` (format in Section 2e) and **removes the solved items from the tracker**. It returns **two files**: the solution file and the updated tracker.
3. The human gives the solution file (and the updated tracker) to the **Applier**.
4. The Applier applies each fix to the real repo, runs the verification (Section 2b), and marks the batch `APPLIED`. Anything that fails goes back into the tracker marked `APPLY-FAILED`.
5. Repeat with the next IDs until every list is empty (Section 9).

**What "removed from the tracker" means:** the item now has a complete written solution. It does **not** mean the repo has been changed yet. Whether a solution has actually been applied is tracked in the solution file's `STATUS` and in the log (Section 8), so nothing can be lost between the two AIs.

Paths are relative to `IdeaStrom/AI-SKILLS/` unless they start with `IdeaStrom/`. In the bulk lists (Section 6), a path such as `data/nosql` means the skill folder; the file to edit is `data/nosql/SKILL.md`.

**Prompt for the SOLVER (paste to Claude with this file attached):**
> Read `IMPROVEMENT-TRACKER.md` completely (Sections 0 to 2). You are the SOLVER. Solve only these IDs: `<IDs>`. Write the fixes into a new file `SOLUTIONS-batch-<NN>.md` using the format in Section 2e, remove the solved items from the tracker, and give me back both files. You cannot edit the repo, so do not claim you did.

**Prompt for the APPLIER (paste to Antigravity):**
> Read `AI-SKILLS/IMPROVEMENT-TRACKER.md` (Sections 0 to 2), then `AI-SKILLS/solutions/SOLUTIONS-batch-<NN>.md`. You are the APPLIER. Apply every block exactly as written, run the Section 2b verification, then update the batch STATUS, the tracker and the log as described in Section 2d.

---

## 1. First-time setup (done once by the APPLIER, or by the human; the SOLVER needs no setup)

**Setup is already done if all of these are true:** this file exists at `AI-SKILLS/IMPROVEMENT-TRACKER.md`, the folder `AI-SKILLS/solutions/` exists, `README.md` contains the marker `<!-- IMPROVEMENT-TRACKER -->`, and no other copy of this file exists in the repo.

If not done, do these steps in order:

1. **Place this file at `IdeaStrom/AI-SKILLS/IMPROVEMENT-TRACKER.md`** (same folder as `README.md` and `MASTER-SKILLS.md`).
   - Why here: any AI that opens the library root sees it next to the two entry-point documents.
   - It must NOT be inside a skill folder and must NOT be named `SKILL.md`, so the validator, indexer and router never treat it as a skill.
   - If another copy exists anywhere else (for example the upload location), delete the extra copy. One canonical copy only. When the human later hands over a newer revision from the Solver, replace the repo copy with it (see rule AR9).
2. **Create the folder `IdeaStrom/AI-SKILLS/solutions/`** and save every solution file there. It is not a skill folder; the indexer and router ignore it.
3. **Add a discovery pointer** as the first content line under the title of `README.md`, `MASTER-SKILLS.md` and `SKILL-DEVELOPMENT.md`, using exactly this text:
   ```markdown
   <!-- IMPROVEMENT-TRACKER -->
   > **Maintenance in progress:** open work on this library is tracked in [`IMPROVEMENT-TRACKER.md`](IMPROVEMENT-TRACKER.md). Any AI that edits this library must read that file first and follow its rules.
   ```
4. **Do not** add the tracker or the solution files to `skills-index.json`, `skills-manifest.json`, or the router overlays. They are not skills.
5. Run the verification in Section 2b. Both checks must still pass.
6. When the work is finished (Section 9), remove the three pointers and leave this file with `STATUS: ALL CLEAR`.

---

## 2. Rules of the cycle (mandatory)

### 2a. Content rules (apply to every fix, for both roles)

| # | Rule |
|---|---|
| R7 | **No invented facts.** Technical corrections must be checked against primary sources (WCAG 2.2 spec, OWASP, MDN, PostgreSQL/MongoDB/Redis docs, W3C). If you cannot verify a claim, do not write it; the Solver marks the item `BLOCKED` (rule SR5). |
| R8 | **Keep skills lean.** Target 3.5 KB to 6 KB (about 900 to 1,500 tokens) per `SKILL.md`. If more depth is needed, put it in `<skill-folder>/references/<topic>.md` and link it from a "Deeper reference" line. Keep the YAML frontmatter format. Keep existing `Source Attribution` lines. Keep the section pattern: principles, patterns with code, anti-patterns, verification checklist. |
| R9 | **One source of truth for descriptions.** The description in a skill's `SKILL.md` frontmatter is authoritative. After changing it, rebuild the index (Section 2b) so `skills-index.json` matches. |
| R10 | **Minimal diffs.** UTF-8, LF line endings, no unrelated reformatting. |

### 2b. Verification (the APPLIER runs this in the real repo after applying; the SOLVER runs what it can in its sandbox)

```bash
cd IdeaStrom/AI-SKILLS
python tools/build_index.py            # rebuild shards, router card, graph, BM25
python tools/build_index.py --check    # must print: [OK] index is up to date
python tools/skill-validation/validate_skills.py   # must report 0 errors
python tools/skill-validation/test_router.py       # must pass
python evals/eval_router.py --fail-under 0.80      # metrics must not drop below the baseline below
```

**Baseline on 2026-09-19 (router v3, 100 prompts):** precision 0.735, recall 0.940, F1 0.825, lead-skill accuracy 86/95 (0.905),
forbidden activations 0/100, correct abstentions 5/5, mean context 1,417 tokens. Legacy router for comparison: F1 0.427.
No change may make any of these worse. Note: `--fail-under 0.80` may fail on the current baseline until I-09 is done; in that case compare against the numbers above instead.

### 2c. SOLVER rules (Claude)

| # | Rule |
|---|---|
| SR1 | **Scope.** Solve only the IDs the human gave you. Do not touch other entries. |
| SR2 | **Write solutions, not claims.** You cannot edit the repo. Every fix goes into the solution file as a block that the Applier can execute mechanically (format in Section 2e). Never say a file "has been changed". |
| SR3 | **Exact and self-contained.** A skill rewrite is delivered as the **complete new file content**. An edit is delivered as the exact OLD text and the exact NEW text. No "and so on", no "similar to above", no placeholders. The Applier is a fast, literal executor and must not have to guess. |
| SR4 | **Remove solved items from the tracker.** When an item has a complete solution block, delete its file name (list line) or the whole entry from the tracker you return. No strikethrough, no "done". If a file is in several lists (for example S-01 and B-01), remove it only from the list whose problem you solved. |
| SR5 | **Partial or blocked.** If only part of an entry is solved, edit the entry so it describes only what remains and keep it. If you cannot solve it, or cannot verify a fact (R7), keep it and add `BLOCKED: <reason>`. Never write a solution you are unsure about. |
| SR6 | **Test when you can.** If the human uploaded the repo (or the needed files), run the checks in your sandbox and state in each block what you tested and the result. If you could not test, write `Tested by solver: no`. |
| SR7 | **Batch size.** At most about 6 full skill rewrites, or about 30 bulk-list lines, per batch, so every block stays exact. If the human asks for more, split into several batch files. |
| SR8 | **Return two files every round:** `SOLUTIONS-batch-NN.md` and the updated tracker (with `REVISION` increased by 1 and the header's `STATUS` unchanged). In the tracker's log (Section 8) add one line per solved item with `applied: pending`. |
| SR9 | **Independence for N-01.** If you have already read `tools/overlays.json` or `tools/route3.py`, you must not write the held-out test set; mark N-01 `BLOCKED: solver has seen the router` and tell the human to assign it to another AI. |

### 2d. APPLIER rules (Gemini in Antigravity)

| # | Rule |
|---|---|
| AR1 | **Read first.** Read Sections 0 to 2 of the tracker, then the whole solution file, before changing anything. |
| AR2 | **Apply exactly.** Execute each block as written, in order. Do not improve, shorten, reword or "fix" the content. If a block looks wrong, do not apply it and mark it `FAILED: <reason>` (rule AR6). |
| AR3 | **EDIT blocks must match exactly.** If the OLD text is not found exactly once, do not guess and do not edit nearby text. Mark the block `FAILED: old text not found`. |
| AR4 | **Verify.** After the batch, run the Section 2b verification. Also run each block's own "Apply check". |
| AR5 | **Tracker removals.** The solution file lists the tracker entries and lines that were removed by the Solver. Make sure they are also gone from the tracker in the repo. If they are already gone, skip them (this step is safe to repeat). Delete nothing else from the tracker. |
| AR6 | **Failures go back into the tracker.** For every block that failed, or whose Apply check failed, restore its entry or list line in the tracker and add `APPLY-FAILED: <reason>` to it. Undo any partial changes from that block so the repo is not left half-changed. The human will hand the entry to the Solver again. |
| AR7 | **Record the result.** In each block write `Apply result: OK` or `FAILED: <reason>`. Set the solution file header `STATUS` to `APPLIED` (all blocks OK), `PARTIAL` (some failed) or `FAILED` (all failed). In the Section 8 log change `applied: pending` to `applied: yes` or `applied: failed` for each item. |
| AR8 | **Minimal diffs.** Rule R10 applies. Do not touch files that no block mentions. |
| AR9 | **Newer tracker copy.** If the human gives you a tracker with a higher `REVISION` than the repo copy, replace the repo copy with it first, then re-apply any `applied:` updates you had already made. Never overwrite a higher revision with a lower one. |
| AR10 | **Finish signal.** When the conditions in Section 9 are all true, set the tracker `STATUS` to `ALL CLEAR` and stop. |

### 2e. Solution file format (the SOLVER writes it; the APPLIER reads it)

**File name:** `SOLUTIONS-batch-NN.md` (NN = 01, 02, ...). The APPLIER stores it in `AI-SKILLS/solutions/`.
**Never** name it `SKILL.md` and never put it inside a skill folder.

````markdown
# SOLUTIONS-batch-NN

- BATCH: NN
- DATE: YYYY-MM-DD
- SOLVER: <model name>
- TRACKER-REVISION-READ: <number>
- IDS SOLVED: <comma-separated list, for example I-01, I-04, S-02, B-05 (lines: README.md, MASTER-SKILLS.md)>
- STATUS: PENDING          <!-- APPLIER changes this to APPLIED, PARTIAL or FAILED -->

## Tracker removals
Exact entries and lines the SOLVER removed from IMPROVEMENT-TRACKER.md (safe to repeat; skip if already gone):
- Entry `I-04` (whole entry)
- Line `data/nosql` in list `B-01`

## Solution blocks

### SOLVED: <ID> - <short title>
- Action: CREATE | REPLACE | EDIT | DELETE | MOVE | RUN
- Target: `path/relative/to/AI-SKILLS`
- Tested by solver: yes (<what and result>) | no
- Change:
  - CREATE / REPLACE: the complete file content in a fenced code block
  - EDIT: an OLD block and a NEW block, both exact
  - DELETE: the path
  - MOVE: from -> to
  - RUN: the exact command and the expected output
- Apply check: <command(s) and expected result the APPLIER must confirm>
- Apply result: <APPLIER fills in: OK | FAILED: reason>
````

Grouped blocks are allowed for bulk lists (B-01 to B-05): one block with one row or sub-block per file, each with its exact new text. The APPLIER records one result per file.

---

## 3. Audit facts (so you do not have to rediscover them)

- 91 `SKILL.md` files on disk (core 13, ai 8, backend 9, data 6, devops 8, domains 7, frontend 14, security 9, testing 8, tools 9). Average size is about 3.4 KB. Smallest is `data/nosql` at 2.1 KB.
- `skills-index.json` has 91 entries but its own `total_skills` says 86. `skills-manifest.json` has 86 entries.
- The validator prints "100%" but only compares the index with the disk, so it misses everything in this list.
- `tools/skill-validation/test_router.py` tests the legacy `route.py`, not the v3 router (`route3.py`).
- The generated index is currently fresh (`build_index.py --check` passes).
- 74 skills have a description with no "Use when" trigger. 35 skills have a different description in `SKILL.md` than in `skills-index.json`.
- Nothing measures whether using the skills makes the AI's output better. Only routing is measured, and the router author also wrote the test prompts.

---

## 4. INFRASTRUCTURE FILES

*(All items resolved in batch 03)*

## 5. SKILL FILES TO EXPAND AND CORRECT

*(All items resolved in batch 03)*

## 6. BULK LISTS

*(All items resolved in batch 03)*

## 7. NEW DELIVERABLES

*(All items resolved in batch 03)*

## 8. Resolution log (IDs, batch names and numbers only; no problem file names)

The SOLVER adds one line per solved item with `applied: pending`. The APPLIER changes it to `applied: yes` or `applied: failed`.

_Format: `YYYY-MM-DD | ID | solved by <model> | batch NN | applied: pending/yes/failed`_

2026-09-19 | N-03 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | B-05 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | I-12 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | I-11 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | I-05 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | I-01 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | I-08 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | B-02 | solved by Gemini in Antigravity | batch 01 | applied: yes
2026-09-19 | S-03 | solved by Claude/User | batch 02 | applied: yes
2026-09-19 | I-02 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | I-03 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | I-04 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | I-06 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | I-07 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | I-09 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | I-10 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-01 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-02 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-04 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-05 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-06 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-07 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-08 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-09 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-10 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-11 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | S-12 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | B-01 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | B-03 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | B-04 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | N-01 | solved by Gemini in Antigravity | batch 03 | applied: yes
2026-09-19 | N-02 | solved by Gemini in Antigravity | batch 03 | applied: yes

---

## 9. Completion check

The work is complete when ALL of these are true:
1. Sections 4, 5, 6 and 7 contain no entries and no list lines.
2. Every line in the Section 8 log says `applied: yes`.
3. The Section 2b verification passes in the real repo.
4. `validate_skills.py` has no warnings left that were promoted to errors in I-03.

When true, the APPLIER sets the STATUS line at the top to `ALL CLEAR`, removes the three discovery pointers from `README.md`, `MASTER-SKILLS.md` and `SKILL-DEVELOPMENT.md`, and stops. The SOLVER never sets `ALL CLEAR` because it cannot see the real repo.
