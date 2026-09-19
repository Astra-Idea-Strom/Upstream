# 03 – Git Strategy & Project Management

> **Project:** Upstream – AI Brand Identity Generator  
> **Team:** 4 members | **Duration:** 12-hour hackathon  
> **Rule #1:** Main is always deployable. Never push broken code to `main`.

---

## Branch Structure

```
main (protected - deployable at all times)
  │
  ├── feature/setup-monorepo        ← Role 1 │ First 30 min │ CRITICAL PATH
  ├── feature/shared-types           ← Role 1 │ Hour 1
  │
  ├── feature/client-scaffold        ← Role 2 │ Hour 1
  ├── feature/brand-form-ui          ← Role 2 │ Hours 1–3
  ├── feature/brand-results-ui       ← Role 2 │ Hours 3–5
  ├── feature/logo-ui               ← Role 2 │ Hours 5–7
  ├── feature/export-ui             ← Role 2 │ Hours 7–9
  │
  ├── feature/server-scaffold        ← Role 4 │ Hour 1
  ├── feature/firebase-setup         ← Role 4 │ Hours 1–2
  ├── feature/brand-routes           ← Role 4 │ Hours 2–4
  ├── feature/middleware             ← Role 4 │ Hours 2–3
  │
  ├── feature/mock-data             ← Role 3 │ Hour 1–2
  ├── feature/openai-service         ← Role 3 │ Hours 2–5
  ├── feature/dalle-service          ← Role 3 │ Hours 4–6
  └── feature/domain-check           ← Role 3 │ Hours 5–7
```

### Why This Structure?

- **`main` is sacred.** It is the only branch that gets deployed to Vercel/Render. It must always build without errors.
- **One branch per feature/task.** This keeps PRs small, reviews fast, and conflicts minimal.
- **No long-lived branches.** Every feature branch should be merged within a few hours of creation. Don't sit on code.

### Naming Convention

```
feature/<scope>-<what-it-does>
```

| Part | Rule | Example |
|------|------|---------|
| `feature/` | Always prefix with this | `feature/` |
| `<scope>` | Maps to app area | `client`, `server`, `shared`, `infra` |
| `<what-it-does>` | Short kebab-case description | `brand-form-ui`, `openai-service` |

**Never use:** `myfeature`, `test123`, your name as a branch name.

### Merge Order (Critical)

Some branches **must** merge before others can start. Follow this dependency order:

```
1. feature/setup-monorepo  →  MERGE FIRST (unblocks everyone)
2. feature/shared-types    →  MERGE SECOND (unblocks Roles 2, 3, 4 type imports)
3. feature/client-scaffold →  MERGE before any client UI branches
4. feature/server-scaffold →  MERGE before any server route branches
5. All others              →  Can merge in any order after above are done
```

---

## Git Commands Cheatsheet

### 1. Initial Setup (First Person to Clone — Role 1)

```bash
# Clone the repo
git clone <repo-url>
cd Upstream

# Install all workspace dependencies
pnpm install

# Verify everything works
pnpm build

# Push an initial commit if you haven't already
git add .
git commit -m "chore(config): initial monorepo setup"
git push origin main
```

> **For everyone else:** Once Role 1 has done the above and pushed, everyone else clones and runs:
> ```bash
> git clone <repo-url>
> cd Upstream
> pnpm install
> ```

---

### 2. Creating a Feature Branch

Always branch off of the latest `main`:

```bash
# Make sure you're on main and it's up to date
git checkout main
git pull origin main

# Create and switch to your new feature branch
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/brand-form-ui
```

> **Rule:** Never branch off another person's feature branch. Always branch from `main`.

---

### 3. Syncing With Main While Working

If `main` has moved forward while you've been working (e.g., someone merged their PR), sync your branch:

```bash
# Fetch the latest state of origin without merging
git fetch origin

# Rebase your branch on top of the latest main
git rebase origin/main
```

**If you hit a conflict during rebase:**

```bash
# Git will pause and show you the conflict files
# Open each conflicted file, resolve the conflict markers:
#   <<<<<<< HEAD        ← your changes
#   =======
#   >>>>>>> origin/main ← their changes

# After resolving each file:
git add <resolved-file>

# Continue the rebase
git rebase --continue

# Repeat for each conflict until rebase is done
```

**If rebase is a disaster and you want to bail out:**

```bash
git rebase --abort
# You'll be back to your original state before the rebase
```

---

### 4. Committing Your Work

```bash
# Stage everything (or specific files)
git add .
# or
git add apps/client/src/components/BrandInputForm.tsx

# Write a good commit message (see Commit Convention below)
git commit -m "feat(client): add BrandInputForm component"

# Push to your feature branch on GitHub
git push origin feature/your-feature-name

# First push of a new branch — use -u to set upstream:
git push -u origin feature/your-feature-name
```

> **Tip:** Commit often. Small commits are easier to revert and easier to review. Don't save all your work for one giant commit at the end.

---

### 5. Opening a Pull Request (GitHub UI)

1. Go to the repo on **GitHub.com**
2. You'll see a yellow banner: _"feature/your-feature-name had recent pushes"_ → click **"Compare & pull request"**
3. Fill in the **PR template** (see PR Process section below)
4. Set **base branch** to `main`
5. Assign **Role 1** as the reviewer
6. Add the appropriate **label** (`frontend`, `backend`, `ai`, etc.)
7. Link the related **Issue** using `Closes #<issue-number>` in the description
8. Click **"Create pull request"**

---

### 6. After Your PR Is Merged

Clean up your local machine:

```bash
# Switch back to main
git checkout main

# Pull the merged changes
git pull origin main

# Delete the old feature branch locally (it's already deleted on GitHub)
git branch -d feature/your-feature-name
```

> If git says the branch wasn't fully merged (even though it was via squash merge), force delete:
> ```bash
> git branch -D feature/your-feature-name
> ```

---

### 7. Emergency: Undo Last Commit (Before Pushing)

Made a mistake in your last commit but **haven't pushed yet**?

```bash
# Undo the commit, keep your changes staged
git reset HEAD~1 --soft

# Now your changes are back in staging — fix what you need, then recommit
```

**Variations:**
```bash
git reset HEAD~1 --soft    # Undo commit, keep changes staged
git reset HEAD~1 --mixed   # Undo commit, keep changes unstaged (default)
git reset HEAD~1 --hard    # Undo commit, DISCARD all changes (dangerous!)
```

---

### 8. Emergency: Revert a Merged PR

If a bad PR was merged into `main` and it's breaking things:

```bash
# Find the merge commit hash
git log --oneline -10

# Revert it (this creates a new "undo" commit, safe for shared branches)
git revert <merge-commit-hash>
# Git opens an editor for the commit message — just save and close

# Push the revert
git push origin main
```

> **Why `revert` not `reset`?** Because `reset` rewrites history, which breaks everyone else's clone. `revert` creates a new commit that undoes the changes — safe for shared branches.

---

## Commit Message Convention

### Format

```
<type>(<scope>): <short description>
```

- **type** — what kind of change is this?
- **scope** — which part of the codebase does it affect?
- **description** — imperative mood, lowercase, no period at end (think: "this commit will _add BrandInputForm_")

### Types

| Type | When to Use |
|------|-------------|
| `feat` | Adding a new feature or component |
| `fix` | Fixing a bug |
| `chore` | Setup, config, dependencies, tooling |
| `style` | CSS/UI-only changes (no logic change) |
| `refactor` | Code restructure with no feature change |
| `docs` | Documentation, README, comments |
| `test` | Adding or updating tests |

### Scopes

| Scope | Maps To |
|-------|---------|
| `client` | `apps/client/` |
| `server` | `apps/server/` |
| `shared` | `packages/shared/` |
| `config` | Root config files (tsconfig, pnpm, etc.) |
| `infra` | CI/CD, Vercel, Render, environment |

### Real Examples for This Project

```bash
# Features
feat(client): add BrandInputForm with validation
feat(client): build BrandResultsGrid with loading skeleton
feat(client): implement PDF export via jsPDF
feat(server): implement /api/brand/generate endpoint
feat(server): add /api/domain/check with Whois lookup
feat(shared): add BrandName and VisualDirection types
feat(shared): add ApiResponse and ErrorCode types

# Fixes
fix(server): handle OpenAI timeout with 30s retry logic
fix(client): correct form validation for empty brand name
fix(server): resolve CORS error on /api/brand/generate

# Chores
chore(config): set up pnpm workspaces and tsconfig paths
chore(config): add .env.example for required API keys
chore(infra): configure Vercel project for apps/client

# Styles
style(client): improve BrandNameCard hover animations
style(client): add responsive grid for mobile viewports

# Refactors
refactor(server): extract brand logic into BrandService class
```

---

## PR Process (Hackathon-Optimized)

### PR Template

Create `.github/pull_request_template.md` in the repo root with this content:

```markdown
## What does this PR do?
<!-- Brief description of the change -->

## Which Role worked on this?
- [ ] Role 1 (PM / Shared Types)
- [ ] Role 2 (UI/UX / Frontend)
- [ ] Role 3 (AI / API Integration)
- [ ] Role 4 (Backend / Infrastructure)

## Closes Issue
Closes #<!-- issue number -->

## Testing
- [ ] I tested this locally and it works
- [ ] `pnpm build` passes without errors
- [ ] No TypeScript errors (`pnpm type-check`)

## Screenshots (if UI change)
<!-- Paste a screenshot or screen recording here -->

## Unblocks
<!-- Does merging this PR unblock another team member? Who and what? -->
<!-- Example: "Unblocks Role 3 — they need the /api/brand routes to exist" -->
```

---

### Review Rules

| Rule | Detail |
|------|--------|
| **Merge gatekeeper** | Role 1 reviews and approves all PRs |
| **Max review time** | 20 minutes — if no review, merge anyway and fix after |
| **Merge strategy** | Always use **Squash Merge** (keeps `main` history clean) |
| **Build check** | Verify `pnpm build` passes before merging |
| **No nitpicking** | This is a hackathon — don't block PRs for style preferences |
| **Delete branch after merge** | Enable "auto-delete head branches" in GitHub repo settings |

### Setting Up Branch Protection (Role 1 Does This in Hour 1)

In GitHub → Settings → Branches → Add rule for `main`:

- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Require status checks to pass (if CI is set up)
- ❌ Do NOT enable "Include administrators" (Role 1 needs emergency access)

---

## GitHub Issues Setup

### Labels to Create

Go to **GitHub → Issues → Labels → New label** and create:

| Label | Color | Use For |
|-------|-------|---------|
| `frontend` | `#0075ca` (blue) | Client-side UI/UX work |
| `backend` | `#008000` (green) | Server, API, database work |
| `ai` | `#7c3aed` (purple) | OpenAI, DALL·E, AI service work |
| `infra` | `#6b7280` (gray) | Config, deployment, CI/CD |
| `stretch` | `#ca8a04` (yellow) | Nice-to-have, time permitting |
| `bug` | `#d73a4a` (red) | Something is broken |
| `blocking` | `#e65b00` (orange) | Blocks another team member |

---

### Issues to Create at Start (Role 1 Creates All in Hour 1)

| # | Title | Labels | Assignee | Milestone |
|---|-------|--------|----------|-----------|
| #1 | Initialize pnpm monorepo | `infra` | Role 1 | Milestone 1 |
| #2 | Set up shared TypeScript types | `infra` | Role 1 | Milestone 1 |
| #3 | Set up Vite + React + Tailwind | `frontend`, `infra` | Role 2 | Milestone 1 |
| #4 | Build BrandInputForm | `frontend` | Role 2 | Milestone 2 |
| #5 | Build BrandResultsGrid | `frontend` | Role 2 | Milestone 2 |
| #6 | Build VisualDirectionPanel | `frontend` | Role 2 | Milestone 2 |
| #7 | Build LogoGallery | `frontend` | Role 2 | Milestone 2 |
| #8 | Build PDF export | `frontend` | Role 2 | Milestone 3 |
| #9 | Set up Express + TypeScript server | `backend`, `infra` | Role 4 | Milestone 1 |
| #10 | Configure Firebase Firestore | `backend` | Role 4 | Milestone 2 |
| #11 | Implement brand routes | `backend` | Role 4 | Milestone 2 |
| #12 | Implement auth middleware | `backend` | Role 4 | Milestone 2 |
| #13 | Create mock data for development | `ai` | Role 3 | Milestone 2 |
| #14 | Implement /api/brand/generate (OpenAI) | `ai` | Role 3 | Milestone 2 |
| #15 | Implement /api/brand/logos (DALL·E) | `ai` | Role 3 | Milestone 3 |
| #16 | Implement /api/domain/check | `ai` | Role 3 | Milestone 2 |
| #17 | Deploy frontend to Vercel | `infra` | Role 1 | Milestone 3 |
| #18 | Deploy backend to Render | `infra` | Role 1 | Milestone 3 |
| #19 | Mood board generator | `frontend`, `ai`, `stretch` | — | — |
| #20 | Social media preview cards | `frontend`, `stretch` | — | — |

> **How to reference issues in commits:**  
> Add `Closes #4` to your PR description — GitHub auto-closes the issue when the PR merges.

---

## File Ownership Matrix

This table prevents merge conflicts. **If you don't own it, coordinate before touching it.**

| File / Directory | Owner | Policy |
|------------------|-------|--------|
| `package.json` (root) | Role 1 | Coordinate if others need root-level deps |
| `pnpm-workspace.yaml` | Role 1 | **Do not touch** |
| `tsconfig.base.json` | Role 1 | **Do not touch** |
| `.gitignore` | Role 1 | **Do not touch** |
| `.github/` | Role 1 | **Do not touch** |
| `packages/shared/src/` | Role 1 initially, then ALL | Announce in chat before adding new types |
| `packages/shared/src/types/brand.types.ts` | Role 1 approves changes | Types frozen after Hour 1 — see protocol below |
| `apps/client/` (all files) | Role 2 | Role 1 or Role 3 may edit `store/` or `api.ts` with notice |
| `apps/client/src/api/api.ts` | Role 2 primarily | Role 3 adds new API calls with notice |
| `apps/server/src/index.ts` | Role 4 | **Do not touch** |
| `apps/server/src/config/` | Role 4 | **Do not touch** |
| `apps/server/src/middleware/` | Role 4 | **Do not touch** |
| `apps/server/src/routes/` | Role 4 creates, Role 3 adds handlers | Communicate before adding new routes |
| `apps/server/src/controllers/` | Role 4 stubs, Role 3 implements AI logic | Follow stub contract |
| `apps/server/src/services/firebase.service.ts` | Role 4 | **Do not touch** |
| `apps/server/src/services/openai.service.ts` | Role 3 | **Do not touch** |
| `apps/server/src/services/dalle.service.ts` | Role 3 | **Do not touch** |
| `apps/server/src/mock/` | Role 3 | **Do not touch** |

---

## Shared Files Coordination Protocol

### `packages/shared/src/types/brand.types.ts`

This file is the **contract** between frontend and backend. Everyone imports from it.

**The Protocol:**

1. **In Hour 1:** Role 1 defines all types together with the team in a 15-minute sync call
2. **After Hour 1:** Types are **frozen** — do not change them without team approval
3. **If a type MUST change:**
   - Post in team chat: _"I need to change `BrandName.taglines` from `string[]` to `Tagline[]`. Any objections?"_
   - Wait 5 minutes for responses
   - Role 1 makes the change and immediately pushes to `main`
   - Everyone fetches and rebuilds: `git fetch origin && git rebase origin/main`

**Why this matters:** If Role 2 uses `brand.names[0].text` and Role 3 returns `brand.names[0].value`, the integration will silently break. Agree first, code second.

---

## GitHub Milestones

### Milestone 1 – Foundation (Due: Hour 1 End)

**Issues:** #1, #2, #3, #9  
**Goal:** Every team member can run their part of the app locally without errors.

**Definition of Done:**
- [ ] `pnpm install` works from repo root
- [ ] `pnpm dev` starts both client and server
- [ ] Shared types are importable in client and server
- [ ] Everyone has cloned the repo and confirmed it runs

---

### Milestone 2 – Core Features (Due: Hour 5 End)

**Issues:** #4, #5, #6, #7, #10, #11, #12, #13, #14, #16  
**Goal:** All core features are built and individually working. Integration begins.

**Definition of Done:**
- [ ] UI forms and result views are rendered (may use mock data)
- [ ] Backend routes exist and return data (may use mock)
- [ ] Mock data is available so frontend and backend can work independently
- [ ] `/api/brand/generate` returns a real or mocked brand identity payload
- [ ] `/api/domain/check` returns availability results

---

### Milestone 3 – Integration & Demo-Ready (Due: Hour 9 End)

**Issues:** #8, #15, #17, #18  
**Goal:** Full user flow works on a deployed staging URL. Demo-ready.

**Definition of Done:**
- [ ] User can fill the form → see brand names → see logos → export PDF
- [ ] Frontend is live on Vercel
- [ ] Backend is live on Render
- [ ] Environment variables are set in both hosting platforms
- [ ] No console errors in the happy path

> **Hours 9–12:** Polish, stretch features (#19, #20), presentation prep, and buffer time.

---

## Emergency Procedures

### 🔴 Main Branch Is Broken

**Symptoms:** `pnpm build` fails on `main`, deployed app is broken.

```bash
# Step 1: Role 1 immediately posts in team chat
# "🔴 MAIN IS BROKEN — stop all PRs and merges"

# Step 2: Find the bad commit
git log --oneline -10

# Step 3: Revert the specific bad commit
git revert <bad-commit-hash> --no-edit

# Step 4: Push the fix
git push origin main

# Step 5: Verify
pnpm build

# Step 6: Role 1 posts in chat
# "✅ MAIN IS FIXED — resume normal work"
```

> If multiple commits are bad, revert them in reverse chronological order (newest first).

---

### 🟡 Massive Merge Conflict

**Symptoms:** You open a PR and GitHub shows 20+ conflicting files.

**Resolution Process:**

1. Only **Role 1** resolves conflicts on `main`
2. For each conflict, accept the **newer code** unless it obviously breaks something
3. If unsure which version is correct, ping the **file owner** (see File Ownership Matrix)
4. After all conflicts are resolved:

```bash
git add .
git rebase --continue
# or if merging:
git commit -m "fix(config): resolve merge conflicts"
git push origin main
```

**Prevention:** Merge feature branches frequently. The longer a branch lives, the worse conflicts get.

---

### 🟠 Someone Committed Directly to Main

**Symptoms:** Someone ran `git push origin main` from their local `main` branch.

```bash
# Step 1: Do NOT panic. Do NOT force push.
# Force pushing rewrites history and breaks everyone's clone.

# Step 2: Assess the commit
git log --oneline -5
# Is it harmful? Does it break the build?

# If the commit is fine (just bypassed process):
# Leave it. Note it in the chat. Move on.

# If the commit is problematic:
git revert <hash>
git push origin main
```

> **Prevent this:** Enable branch protection (see PR Process section). Branch protection blocks direct pushes to `main`.

---

### 🟡 You Accidentally Pushed to Wrong Branch

```bash
# Undo the last push (only if you're the only one working on the branch)
git reset HEAD~1 --soft           # undo commit locally
git push origin <branch> --force  # overwrite remote (safe on YOUR feature branch only)

# NEVER force push to main
```

---

## Quick Reference Card

Print this and keep it on your screen during the hackathon:

```
┌─────────────────────────────────────────────────────────┐
│                  UPSTREAM GIT QUICK REF                 │
├─────────────────────────────────────────────────────────┤
│  Start new task:                                        │
│    git checkout main && git pull origin main            │
│    git checkout -b feature/<scope>-<description>        │
│                                                         │
│  Save your work:                                        │
│    git add . && git commit -m "type(scope): desc"       │
│    git push origin feature/<your-branch>                │
│                                                         │
│  Sync with main:                                        │
│    git fetch origin && git rebase origin/main           │
│                                                         │
│  Open PR → GitHub UI → Compare & pull request           │
│  Assign Role 1 as reviewer                              │
│                                                         │
│  After merge:                                           │
│    git checkout main && git pull origin main            │
│    git branch -d feature/<your-branch>                  │
│                                                         │
│  Undo last commit (not pushed):                         │
│    git reset HEAD~1 --soft                              │
│                                                         │
│  Commit types: feat | fix | chore | style | refactor    │
│  Scopes:       client | server | shared | config | infra│
└─────────────────────────────────────────────────────────┘
```

---

*Last updated: Hackathon Day | Upstream v1.0 | Maintained by Role 1*
