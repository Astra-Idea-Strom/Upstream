---
name: git
description: >-
  Git version control: branching workflows, atomic commits, interactive rebase, merge conflict resolution, and bisect. Use when managing git history, resolving merge conflicts, staging atomic commits, or debugging regressions via git bisect. Not for GitHub remote features or CI automation (that is github or ci-cd).
---

# Git: Version Control Discipline, Clean History & Conflict Resolution

## 1. Core Git Invariants

1. **Atomic Commits**: Each commit must represent exactly one logical change, compile cleanly, and pass existing tests. Never mix unrelated refactors with bug fixes.
2. **Conventional Commit Standards**: Commit messages must follow structured prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, followed by an imperative summary.
3. **Linear History via Rebase**: Keep feature branches up-to-date with `main` using `git rebase origin/main` rather than creating messy back-and-forth merge commits.
4. **Clean Staging & Working Trees**: Never commit build artifacts, node_modules, `.env` files, or OS clutter (`.DS_Store`, `Thumbs.db`).

---

## 2. Key Workflows & Commands

### A. Feature Branching & Conventional Commits
```bash
# 1. Create feature branch from latest main
git checkout main
git pull origin main
git checkout -b feature/auth-session-expiry

# 2. Stage specific hunks cleanly
git add -p src/auth/session.ts

# 3. Commit with structured conventional message
git commit -m "feat(auth): enforce 24-hour absolute session expiration"
```

### B. Interactive Rebase & Cleanup
Before submitting a pull request, squash intermediate "wip" or "fix typo" commits into clean, descriptive units:
```bash
# Rebase the last 4 commits interactively
git rebase -i HEAD~4

# In the rebase editor:
# pick e1a2b3c feat(auth): add session expiration check
# squash f4g5h6j fix typo in session check
# squash a7b8c9d add unit tests for session expiry
```

### C. Systematic Merge Conflict Resolution
```bash
# 1. Rebase onto latest main
git fetch origin
git rebase origin/main

# 2. When conflict occurs, inspect affected files
git status

# 3. Resolve conflicts manually in code, then stage resolved files
git add path/to/resolved-file.ts

# 4. Continue rebase (never run git commit during rebase)
git rebase --continue

# 5. If rebase goes wrong, safely abort to prior state
git rebase --abort
```

---

## 3. Anti-Patterns to Avoid

- **`git add .` Without Inspection**: Blindly staging everything, inadvertently committing temporary debug files, private keys, or massive binary logs.
- **Force Pushing to Shared Branches**: Running `git push --force` on `main` or team collaboration branches, destroying teammates' commits. Use `--force-with-lease` on private feature branches only.
- **Vague Commit Messages**: Commits titled "fixes", "updates", "wip", or "stuff" that provide zero context for future code archaeology.

---

## 4. Verification Checklist

- [ ] Repository has an active `.gitignore` covering OS, editor, dependency, and build files.
- [ ] Commit log demonstrates clean, readable, conventional messages.
- [ ] Feature branches rebase cleanly onto target branch before merging.
