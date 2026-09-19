# Universal AI Engineering Skill System (AI-SKILLS)


> A modular, high-performance, human-centered software engineering skill ecosystem designed for Google Antigravity and Agent Skills standard (`agentskills.io`).

---

## Architecture Overview

The Universal AI Engineering Skill System provides a structured, token-efficient knowledge base and execution engine across the entire software engineering lifecycle. Instead of overwhelming the AI's context with monolithic prompts, the system employs a **two-stage discovery and routing architecture** backed by an index-driven skill graph:

```text
MASTER-SKILLS.md       ← Brain / Operating Rules (Cognitive Loop, Hallucination Control)
      │
      ▼
tools/route3.py        ← Deterministic Routing Engine (BM25, Overlays, Cost Budget)
      │
      ▼
index/ (shards)        ← Precomputed Shards (router-card.json, cards/*.json, graph.json)
      │
      ▼
Specific SKILL.md      ← Detailed Knowledge (Activated on demand within token budget)
```

---

## Directory Topology

```text
AI-SKILLS/
├── MASTER-SKILLS.md          # Primary AI operating manual & cognitive loop
├── SKILL-SELECTION.md        # Skill selection guide and decision mapping
├── SECURITY-POLICY.md        # Security vetting, sandboxing, secrets & AI safety
├── SKILL-DEVELOPMENT.md      # Engineering lifecycle guide for authoring skills
├── skills-index.json         # Machine-readable skill graph registry (91 skills)
├── README.md                 # System overview and deployment guide
│
├── core/                     # Foundational software engineering cognition (13 skills)
│   ├── prompt-understanding/ # Natural language intent parsing & translation
│   ├── requirements-analysis/# Explicit & implicit requirement extraction
│   ├── problem-decomposition/# Milestone splitting & proportionality
│   ├── planning/             # Internal task representation & execution tracking
│   ├── context-engineering/  # Token efficiency, prioritization & compression
│   ├── prompt-optimization/  # Optimized prompts for tools, subagents & APIs
│   ├── decision-making/      # Architecture Decision Records (ADRs) & trade-offs
│   ├── debugging/            # Evidence-based 4-phase systematic debugging
│   ├── refactoring/          # Clean code, code smells & safe transformations
│   ├── code-review/          # Quality checklists & static analysis
│   ├── documentation/        # Architecture documentation & API specs
│   ├── error-handling/       # Defensive error architectures, typed errors & recovery
│   └── i18n-localization/    # Internationalization, ICU messages, RTL & pluralization
│
├── frontend/                 # Human-centered UI, advanced CSS & 3D (14 skills)
│   ├── frontend-engineering/ # React, Next.js, component architecture, state
│   ├── ui-ux/                # User flows, mental models & heuristic evaluation
│   ├── visual-design/        # Hierarchy, contrast, color theory & layout
│   ├── design-systems/       # Design tokens, component libraries & consistency
│   ├── responsive-design/    # Mobile-first layouts, fluid clamp & breakpoints
│   ├── accessibility/        # WCAG 2.2 AA, ARIA roles, keyboard navigation
│   ├── frontend-performance/ # Core Web Vitals (LCP, CLS, INP), bundle optimization
│   ├── frontend-security/    # XSS, CSP headers, CSRF, secure auth cookies
│   ├── human-ui-design/      # Anti-AI-slop (bans gratuitous gradients/pill borders)
│   ├── web-design/           # Typography scales, 4pt/8pt rhythm & composition
│   ├── advanced-css/         # Subgrid, Container Queries, :has(), @layer
│   ├── animation-motion/     # Framer Motion, micro-interactions, reduced-motion
│   ├── 3d-web/               # WebGL fundamentals, asset budgets & fallbacks
│   └── threejs/              # Three.js & R3F scenes, lights, GLTF & non-usage rules
│
├── backend/                  # Server architecture & data flow (9 skills)
│   ├── backend-engineering/  # HTTP servers, Node.js, Python, error handling
│   ├── api-design/           # RESTful standards, pagination, status codes, OpenAPI
│   ├── authentication/       # JWT, HttpOnly cookies, session stores, Argon2id
│   ├── authorization/        # RBAC, ABAC, route guards & middleware
│   ├── database/             # Database connection pools, migrations & ORMs
│   ├── caching/              # Redis caching strategies, invalidation & TTLs
│   ├── queues/               # Asynchronous workers, BullMQ, Celery & retry logic
│   ├── realtime/             # WebSockets, Server-Sent Events (SSE) & pub/sub
│   └── backend-security/     # Rate limiting, input sanitization & SSRF defense
│
├── data/                     # Persistence & analytical engines (6 skills)
│   ├── sql/                  # Relational queries, joins, indexes & transactions
│   ├── postgresql/           # Advanced PostgreSQL (JSONB, full-text, EXPLAIN ANALYZE)
│   ├── nosql/                # Document stores, MongoDB, key-value stores
│   ├── data-modeling/        # Entity-relationship diagrams & normalization
│   ├── data-processing/      # ETL pipelines, stream processing & batching
│   └── analytics/            # Event tracking, metric aggregation & reporting
│
├── security/                 # Defense-in-depth engineering (9 skills)
│   ├── secure-coding/        # Defending against injection, buffer overflows, leaks
│   ├── owasp/                # OWASP Top 10 web vulnerabilities remediation
│   ├── threat-modeling/      # STRIDE methodology & attack surface mapping
│   ├── api-security/         # Token validation, scopes, payload limits & HMAC
│   ├── secrets-management/   # Zero-committed-secrets, .env hygiene & vault storage
│   ├── dependency-security/  # Supply-chain audits, lockfile verification, pinning
│   ├── privacy/              # GDPR, PII redaction, data retention & compliance
│   ├── ai-security/          # Prompt injection defense, tool sandboxing & safety
│   └── security-review/      # PR and diff security auditing & vulnerability checks
│
├── testing/                  # Quality verification & test automation (8 skills)
│   ├── unit-testing/         # Isolated component & unit tests, Vitest, Jest, pytest
│   ├── integration-testing/  # Service boundaries, database integration & mocks
│   ├── api-testing/          # Contract testing, HTTP assertions, Supertest
│   ├── e2e-testing/          # End-to-end browser testing, Playwright
│   ├── performance-testing/  # Load testing, k6, memory profiling & latency checks
│   ├── accessibility-testing/# Axe-core automated audits & keyboard testing
│   ├── security-testing/     # DAST, SAST, dependency scanning & fuzz testing
│   └── tdd-workflow/         # Test-Driven Development red-green-refactor loop
│
├── devops/                   # Delivery & operational excellence (8 skills)
│   ├── git/                  # Branching strategies, atomic commits & rebase
│   ├── github/               # GitHub Actions, PR templates & branch protection
│   ├── docker/               # Multi-stage Dockerfiles, caching & minimal images
│   ├── ci-cd/                # Automated testing, build pipelines & deployment gates
│   ├── deployment/           # Vercel, Railway, AWS, Fly.io & zero-downtime releases
│   ├── cloud/                # Cloud architecture, serverless & container hosting
│   ├── monitoring/           # Health checks, uptime, Prometheus & alerts
│   └── observability/        # OpenTelemetry, structured logging & distributed tracing
│
├── ai/                       # Generative AI & agentic engineering (8 skills)
│   ├── llm/                  # LLM selection, parameter tuning, context window limits
│   ├── prompt-engineering/   # Few-shot, chain-of-thought & system prompt design
│   ├── rag/                  # Chunking strategies, hybrid search & reranking
│   ├── embeddings/           # Vector embeddings, dimensionality & similarity
│   ├── agents/               # Autonomous execution loops, state & tool planning
│   ├── tool-use/             # Structured JSON outputs, schema validation & fallbacks
│   ├── ai-evaluation/        # Grounding metrics, hallucination tests & benchmarks
│   └── retrieval-ranking/    # Cross-encoders, reciprocal rank fusion & re-ranking
│
├── domains/                  # Vertical specializations (7 skills)
│   ├── audio-speech-processing/# Whisper STT, Web Audio API, diarization & TTS
│   ├── document-processing/  # PDF layout extraction, chunking & ATS filtering
│   ├── computer-vision-multimodal/# Multimodal LLMs, object detection & pose estimation
│   ├── health-wellness-safety/# Non-diagnostic boundaries, clinical disclaimers & triage
│   ├── personal-finance/     # Currency math, double-entry ledgers & bank data privacy
│   ├── edtech-learning/      # SM-2/FSRS spaced repetition & rubric evaluation
│   └── geo-mapping/          # Leaflet, Mapbox, OpenStreetMap & route estimation
│
├── tools/                    # Skill maintenance & verification tools (9 skills)
│   ├── skill-discovery/      # Automated skill discovery & candidate extraction
│   ├── skill-auditing/       # Security & license compliance auditor
│   ├── skill-validation/     # Frontmatter, schema & routing test suite
│   ├── skill-installation/   # Global and workspace installation helper
│   ├── skill-adaptation/     # Third-party skill sanitization & improvement
│   ├── skill-routing/        # Deterministic routing engine & progressive disclosure
│   ├── capability-gap-detection/# Automated detection of agent capability deficits
│   ├── skill-evaluation/     # Systematic empirical skill benchmarking
│   └── skill-authoring/      # Structured authoring pipeline for agent skills
│
├── index/                    # Precomputed router index shards and metadata
├── evals/                    # Evaluation harness, benchmarks, and regression suites
└── solutions/                # Applied and pending tracker solution batches
```

---

## Installation & Usage in Google Antigravity

### 1. Workspace-Specific Installation (Recommended for Teams)
To enable the skill system within a specific project, mount `AI-SKILLS` under `.agents/skills` at the repository root:

```powershell
# In your project root:
New-Item -ItemType Directory -Path ".agents" -Force
# Link or copy AI-SKILLS into .agents/skills
Copy-Item -Recurse -Path "path\to\AI-SKILLS" -Destination ".agents\skills"
```

Create `.agents\skills.json` at your project root:
```json
{
  "entries": [
    {
      "path": ".agents/skills"
    }
  ]
}
```

### 2. Global Machine-Wide Installation
To make all 91 skills available across all projects on your workstation:

```powershell
# Global Antigravity config directory
$GlobalConfigDir = "$HOME\.gemini\config"
New-Item -ItemType Directory -Path "$GlobalConfigDir\skills" -Force

# Register AI-SKILLS in global skills.json
$SkillsConfig = @{
  "entries" = @(
    @{ "path" = "C:\path\to\AI-SKILLS" }
  )
} | ConvertTo-Json

$SkillsConfig | Out-File -Encoding utf8 "$GlobalConfigDir\skills.json"
```

---

## Running Verification & Routing Tests

Run the built-in test suite to verify frontmatter validity, schema conformance, and router accuracy:

```powershell
# Windows
cd C:\path\to\AI-SKILLS
python tools/skill-validation/validate_skills.py
python tools/skill-validation/test_router.py

# Linux / macOS
cd /path/to/AI-SKILLS
python3 tools/skill-validation/validate_skills.py
python3 tools/skill-validation/test_router.py
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
