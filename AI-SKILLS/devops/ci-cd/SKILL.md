---
name: ci-cd
description: >-
  Continuous integration and delivery: GitHub Actions, automated test workflows, artifact building, and deployment gates. Use when creating CI/CD pipelines, automating linting and tests on pull requests, or configuring build matrix workflows. Not for container definitions or cloud resource provisioning (that is docker or cloud).
---

# CI/CD: Automated Pipelines, Quality Gates & Deployment Triggers

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 1. Core CI/CD Invariants

1. **Deterministic Quality Gates**: Every pull request must pass five sequential or parallel gates before merging: Linting -> Type Checking -> Unit Tests -> Security Scanning -> Production Build.
2. **Fast Feedback SLA**: CI pipelines must complete within 5–7 minutes. Maximize dependency caching and parallel job execution.
3. **No Deployment on Broken Main**: Deployments to production must trigger only from passing, protected branch commits (`main` / `master`).
4. **Hermetic Test Environments**: Services required for testing (Postgres, Redis) must run as isolated container services inside the CI runner.

---

## 2. Key Implementation Patterns

### A. Production GitHub Actions Pipeline (`.github/workflows/ci.yml`)
```yaml
name: CI / Quality Gates

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    name: Lint, Types & Security
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install Dependencies
        run: npm ci --ignore-scripts

      - name: Lint Check
        run: npm run lint

      - name: TypeScript Check
        run: npx tsc --noEmit

      - name: Dependency Vulnerability Audit
        run: npm audit --audit-level=high

  test:
    name: Automated Unit & Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install Dependencies
        run: npm ci --ignore-scripts

      - name: Run Test Suite
        env:
          DATABASE_URL: postgres://testuser:testpassword@localhost:5432/testdb
          NODE_ENV: test
        run: npm test -- --coverage

  build:
    name: Production Build Verification
    needs: [validate, test]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install Dependencies
        run: npm ci --ignore-scripts

      - name: Build Production Bundle
        run: npm run build
```

---

## 3. Anti-Patterns to Avoid

- **Skipping CI for "Trivial" Commits**: Allowing `[skip ci]` on production branches, bypassing verification gates.
- **Flaky Tests Silently Retried 5 Times**: Masking race conditions with excessive test retries instead of fixing root causes.
- **Uncached Dependency Downloads**: Downloading hundreds of megabytes of npm or pip packages on every workflow step.

---

## 4. Verification Checklist

- [ ] GitHub Actions workflow triggers on push and pull request.
- [ ] Concurrency group cancels redundant in-progress builds on new commits.
- [ ] Caching for package managers is enabled.
- [ ] Build step fails if TypeScript errors or lint issues exist.
