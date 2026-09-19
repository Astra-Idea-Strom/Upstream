# 03 – Git Strategy & Project Management

> **Project:** Upstream – AI Brand Identity Generator  
> **Team:** 4 members | **Duration:** 12-hour hackathon  
> **Rule #1:** Main is always deployable. Never push broken code to `main`.

---

## Branch Structure (Single-Branch-Per-Developer)

To prevent merge conflicts and branch switching friction during the 12-hour hackathon, **each developer works exclusively on a single persistent branch**:

```
main (protected - deployable at all times)
  │
  ├── dev/1-lead                    ← Dev 1 (PM / Lead / Shared Types / Infra)
  ├── dev/2-client                  ← Dev 2 (UI / UX / React Frontend)
  ├── dev/3-ai                      ← Dev 3 (AI / OpenAI / DALL-E / Mock Services)
  └── dev/4-backend                 ← Dev 4 (Express Bootstrap / Middleware / Firebase)
```

### Why This Structure?

- **Zero Merge Conflicts:** Each developer is strictly assigned isolated files and directories. Dev 2 owns `apps/client/`. In `apps/server/`, Dev 3 and Dev 4 own mutually exclusive files.
- **No Branch Switching Overhead:** You check out your assigned branch once at the start of the hackathon and stay on it.
- **Continuous Progress:** Commit and push frequently to your personal remote branch without waiting on anyone.
- **Scheduled Syncs:** Code merges into `main` at 3 explicit milestones (Hour 0:45, Hour 5:00 SYNC 1, Hour 9:00 SYNC 2).

### Branch Assignment Matrix

| Developer | Branch Name | Scope / Directory | Primary Responsibility |
|---|---|---|---|
| **Dev 1** (Lead / PM) | `dev/1-lead` | Root, `packages/shared/`, `.github/`, Deploy infra | Monorepo config, shared types, PR reviews, Vercel/Render deployment |
| **Dev 2** (UI / UX) | `dev/2-client` | `apps/client/**` (100% exclusive) | React 18 frontend, forms, results grid, Zustand store, PDF export |
| **Dev 3** (AI / API) | `dev/3-ai` | `apps/server/src/services/openai*`, `dalle*`, `mock/`, AI routes/controllers | Mock data fixtures, GPT-4o brand generation, DALL-E 3 logos, caching |
| **Dev 4** (Backend / DB) | `dev/4-backend` | `apps/server/` Express core, middleware, Firebase Admin, project storage | Server bootstrap, security middleware, Firestore persistence, health endpoint |

### Synchronization Order (Milestones)

Branches merge into `main` at 3 planned synchronization gates:

```
1. Hour 0:45: dev/4-backend  →  Merge server boilerplate to main (Dev 3 then pulls main)
2. Hour 5:00: SYNC 1         →  Merge dev/4-backend → dev/3-ai → dev/2-client into main
3. Hour 9:00: SYNC 2         →  Merge all remaining polish/bugfixes into main for deploy
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

### 2. Checking Out Your Assigned Branch (Do Once at Start)

Each developer checks out their assigned branch from the latest `main` once and works on it throughout the project:

```bash
# Make sure you're on main and it's up to date
git checkout main
git pull origin main

# Check out your specific assigned branch:
# Role 1: git checkout -b dev/1-lead
# Role 2: git checkout -b dev/2-client
# Role 3: git checkout -b dev/3-ai
# Role 4: git checkout -b dev/4-backend

# Example for Dev 2:
git checkout -b dev/2-client
git push -u origin dev/2-client
```

> **Rule:** Never create separate feature branches. Always stay on your assigned `dev/<role>` branch.

---

### 3. Syncing With Main While Working

When `main` is updated at a sync point (e.g., after the H0:45 server scaffold or H5:00 SYNC 1), pull `main` into your persistent branch:

```bash
# Fetch latest commits from remote
git fetch origin

# Merge main into your branch
git merge origin/main
```

**If you hit a conflict during merge:**

```bash
# Git will pause and show you the conflict files
# Open each conflicted file, resolve the conflict markers:
#   <<<<<<< HEAD        ← your changes
#   =======
#   >>>>>>> origin/main ← main changes

# After resolving each file:
git add <resolved-file>

# Complete the merge commit
git commit -m "chore: sync with main"
```

**If merge has unexpected issues and you want to abort:**

```bash
git merge --abort
# You'll be back to your original state before the merge attempt
```

---

### 4. Committing Your Work

```bash
# Stage everything (or specific files)
git add .

# Write a clear commit message (see Commit Convention below)
git commit -m "feat(client): add BrandInputForm component"

# Push to your persistent branch on GitHub
git push origin dev/2-client
```

> **Tip:** Commit and push frequently to your remote branch. That backs up your code and allows team leads to review progress without interrupting your work.

---

### 5. Opening a Pull Request (At Sync Milestones)

At synchronization checkpoints (H0:45, H5:00 SYNC 1, H9:00 SYNC 2):

1. Go to the repo on **GitHub.com**
2. Click **"New pull request"**
3. Set **base branch** to `main` and **compare branch** to your branch (e.g., `dev/2-client`)
4. Fill in the **PR template**
5. Assign **Dev 1 (Role 1)** as the reviewer
6. Add the appropriate label (`frontend`, `backend`, `ai`, etc.)
7. Link related Issues using `Closes #<issue-number>`
8. Click **"Create pull request"**

---

### 6. After Your PR Is Merged (Do NOT Delete Your Branch)

Because you have **one persistent branch for the entire hackathon**, do **NOT** delete your branch after merging:

```bash
# Stay on your branch (e.g. dev/2-client)
git checkout dev/2-client

# Pull the newly merged main into your branch to stay in sync
git pull origin main

# Push the updated branch state to remote
git push origin dev/2-client
```

> **Rule:** Never delete `dev/1-lead`, `dev/2-client`, `dev/3-ai`, or `dev/4-backend`. Keep working on your branch for the next milestone.

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

## File Ownership Matrix (Zero-Conflict Policy)

To eliminate merge conflicts when merging persistent branches into `main`, file ownership is strictly disjoint. **Never edit a file assigned to another developer.**

| File / Directory | Owner Branch | Policy |
|------------------|--------------|--------|
| `package.json` (root), `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, `.github/` | `dev/1-lead` | Only Dev 1 manages root configurations |
| `packages/shared/**` | `dev/1-lead` (approver) | All devs propose in chat; Dev 1 updates and merges to main |
| `apps/client/**` (all frontend files) | `dev/2-client` | 100% exclusive to Dev 2. No other dev touches `apps/client` |
| **`apps/server/` Foundation & Storage** | | |
| `apps/server/package.json`, `tsconfig.json`, `.env.example` | `dev/4-backend` | Dev 4 sets up root server configs at H0:45 |
| `apps/server/src/index.ts`, `src/app.ts` | `dev/4-backend` | Express app shell, middleware mounting & server bootstrap |
| `apps/server/src/config/firebase.ts` | `dev/4-backend` | Firebase Admin SDK initialization |
| `apps/server/src/middleware/**` (`errorHandler.ts`, `rateLimiter.ts`, `validateRequest.ts`) | `dev/4-backend` | All security & error handling middleware |
| `apps/server/src/services/firebase.service.ts` | `dev/4-backend` | Firestore read/write operations |
| `apps/server/src/routes/project.routes.ts` | `dev/4-backend` | Project save and retrieval routes |
| `apps/server/src/controllers/project.controller.ts` | `dev/4-backend` | Project Firestore controller |
| **`apps/server/` AI & Mock Services** | | |
| `apps/server/src/config/openai.ts` | `dev/3-ai` | OpenAI API client setup |
| `apps/server/src/mock/**` (`brandNames.mock.ts`, `domains.mock.ts`, `logos.mock.ts`) | `dev/3-ai` | Static fixtures unblocking frontend |
| `apps/server/src/services/openai.service.ts` | `dev/3-ai` | GPT-4o brand generation logic |
| `apps/server/src/services/dalle.service.ts` | `dev/3-ai` | DALL-E 3 image generation & polling |
| `apps/server/src/services/domain.service.ts` | `dev/3-ai` | Domain availability logic & hashing |
| `apps/server/src/routes/brand.routes.ts`, `logo.routes.ts`, `domain.routes.ts` | `dev/3-ai` | AI route endpoints |
| `apps/server/src/controllers/brand.controller.ts`, `logo.controller.ts`, `domain.controller.ts` | `dev/3-ai` | AI controller logic |

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
│  Start at project kickoff (do once):                    │
│    git checkout main && git pull origin main            │
│    git checkout -b dev/<your-assigned-branch>           │
│    git push -u origin dev/<your-assigned-branch>        │
│                                                         │
│  Save your work (commit & push often):                  │
│    git add . && git commit -m "type(scope): desc"       │
│    git push origin dev/<your-assigned-branch>           │
│                                                         │
│  Sync with main (after sync merges):                    │
│    git fetch origin && git merge origin/main            │
│                                                         │
│  Open PR (at sync checkpoints: H0:45, H5:00, H9:00):    │
│    GitHub UI → PR dev/<your-branch> into main           │
│    Assign Dev 1 as reviewer                             │
│                                                         │
│  After merge to main (DO NOT DELETE BRANCH):            │
│    git checkout dev/<your-assigned-branch>              │
│    git pull origin main                                 │
│                                                         │
│  Undo last commit (not pushed):                         │
│    git reset HEAD~1 --soft                              │
│                                                         │
│  Branches: dev/1-lead | dev/2-client | dev/3-ai | dev/4-backend│
└─────────────────────────────────────────────────────────┘
```

---

*Last updated: Hackathon Day | Upstream v1.0 | Maintained by Role 1*
