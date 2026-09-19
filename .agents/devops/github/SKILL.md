---
name: github
description: >-
  GitHub platform features: pull request templates, issue triage, branch protection rules, GitHub releases, and webhooks. Use when managing GitHub repositories, setting up branch protection, configuring PR automations, or handling GitHub webhooks. Not for local git command-line operations (that is git).
---

# GitHub: Pull Request Standards, Automation & Branch Protection

## 1. Core GitHub Invariants

1. **Structured Pull Request Descriptions**: Every PR must include problem context, technical solution summary, breaking change flags, and empirical verification evidence (test outputs or UI screenshots).
2. **Mandatory Branch Protection Gates**: The default branch (`main` / `master`) must require pull request reviews, passing CI status checks, and up-to-date branch status before merging. Direct pushes to `main` are strictly prohibited.
3. **Automated PR & Issue Templates**: Standardize repository intake with declarative Markdown templates in `.github/` to guarantee high-signal bug reports and PR disclosures.
4. **Semantic Release Tagging**: Releases must use annotated Git tags matching Semantic Versioning (`vMAJOR.MINOR.PATCH`) accompanied by automated changelogs.

---

## 2. Key Implementation Patterns

### A. Pull Request Template (`.github/pull_request_template.md`)
```markdown
## Summary
Brief description of the problem solved and technical approach taken.

## Changes Proposed
- Component A: Updated validation logic
- Database: Added migration for `is_archived` column

## Verification & Testing
- [ ] Unit tests added/updated (`npm test` passes 100%)
- [ ] Integration tests verified locally
- [ ] Manual verification completed (attach screenshots/recordings if UI)

## Security & Compliance
- [ ] Zero secrets committed (.env ignored)
- [ ] No high/critical CVEs introduced
- [ ] Data validation and authorization verified
```

### B. Efficient GitHub CLI (`gh`) Operations
```bash
# 1. Create a pull request directly from terminal with interactive review
gh pr create --title "feat(api): add idempotency key support" --body-file .github/pull_request_template.md

# 2. Check status of CI checks on current branch
gh pr checks

# 3. Review and view diff of an incoming pull request
gh pr diff 42

# 4. Merge PR cleanly using squash-and-merge
gh pr merge 42 --squash --delete-branch
```

---

## 3. Anti-Patterns to Avoid

- **Massive 2,000-Line PRs**: Submitting gigantic monolithic changes that overwhelm reviewers and make regression detection nearly impossible. Keep PRs under 400 lines of change whenever possible.
- **Bypassing Branch Protection with Admin Overrides**: Merging PRs while CI checks are failing or without peer reviews.
- **Empty or Single-Word PR Descriptions**: Submitting PRs with empty descriptions or "updated stuff", forcing reviewers to reverse-engineer intent from raw diffs.

---

## 4. Verification Checklist

- [ ] Repository has `.github/pull_request_template.md` configured.
- [ ] Branch protection rules require at least 1 approving review and passing CI.
- [ ] GitHub CLI commands work seamlessly for developer workflow automation.
