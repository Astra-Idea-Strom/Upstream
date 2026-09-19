# Upstream 🌱
### AI-Powered Brand Identity Generator

> From business idea to complete brand identity in under 2 minutes.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)]()
[![Built with React](https://img.shields.io/badge/React-18-blue)]()
[![Powered by OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-purple)]()

## 🎯 The Problem
Early-stage founders waste weeks and thousands of dollars on brand consultants just to validate a name and visual direction. Existing tools (Namelix, Brandmark) handle naming OR logo generation separately — never together.

## ✨ The Solution
Upstream is a unified AI branding session. Describe your business once, and instantly get:
- ✅ **12 creative brand names** with explanations and taglines
- ✅ **Domain & social handle availability** for each name
- ✅ **Visual direction** (color palette, font pairings, style description) per name
- ✅ **AI-generated logo concepts** for your selected name
- ✅ **Downloadable brand identity PDF** ready to share with investors

## 🚀 Demo
*[Add Vercel URL after deployment]*

**Demo Input:**
> Industry: Sustainable productivity | Audience: Remote workers 25–40 | Tone: Professional | Mission: Make remote work eco-conscious and connected

**Output:** 12 names including *Verdant*, *Leafwise*, *Terraq* — each with color palettes, fonts, domain status, and logo concepts.

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| State | Zustand |
| Backend | Node.js 20 + Express 4 + TypeScript |
| Database | Firebase Firestore |
| AI (Text) | OpenAI GPT-4o |
| AI (Images) | DALL-E 3 |
| Export | jsPDF + html2canvas |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Monorepo | pnpm workspaces |

## 📁 Project Structure
```
Upstream/
├── apps/
│   ├── client/          # React + Vite frontend
│   └── server/          # Node.js + Express backend
├── packages/
│   └── shared/          # Shared TypeScript types
├── 01_FILE_STRUCTURE.md
├── 02_EXECUTION_PLAN.md
├── 03_GIT_STRATEGY.md
├── 04_SHARED_TYPES_AND_API_CONTRACTS.md
└── 05_ROLE_GUIDES.md
```

## ⚡ Getting Started (Local Development)

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- OpenAI API key
- Firebase project with Firestore

### Setup
```bash
# Clone
git clone https://github.com/YOUR_ORG/upstream.git
cd upstream

# Install all dependencies (monorepo)
pnpm install

# Set up environment variables
cp .env.example apps/server/.env
# Fill in your API keys in apps/server/.env

# Start both frontend and backend
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health check: http://localhost:3001/health

## 📚 Hackathon Documentation
All planning documents for the team:

| Document | Contents |
|----------|----------|
| [01_FILE_STRUCTURE.md](./01_FILE_STRUCTURE.md) | Complete file tree with role ownership |
| [02_EXECUTION_PLAN.md](./02_EXECUTION_PLAN.md) | 12-hour timeline, role tasks, risk register |
| [03_GIT_STRATEGY.md](./03_GIT_STRATEGY.md) | Git workflow, branching, PR process |
| [04_SHARED_TYPES_AND_API_CONTRACTS.md](./04_SHARED_TYPES_AND_API_CONTRACTS.md) | TypeScript types, API contracts, mock data |
| [05_ROLE_GUIDES.md](./05_ROLE_GUIDES.md) | Per-role step-by-step guides with code |

## 👥 Team Roles
| Role | Responsibilities | Branch Prefix |
|------|-----------------|---------------|
| 🔵 PM / Git | Monorepo, GitHub, PRs, deployment | `feature/setup-*` |
| 🟢 UI/UX | React components, Tailwind, PDF export | `feature/*-ui` |
| 🔴 AI/API | OpenAI, DALL-E, prompt engineering | `feature/openai-*` |
| 🟡 Backend | Express, Firebase, middleware | `feature/server-*` |

## 🔥 Core Features
- [x] Multi-step brand input form (industry, audience, tone, mission, constraints)
- [x] AI brand name generation (12 names per session, GPT-4o)
- [x] Per-name tagline generation
- [x] Domain & social handle availability checking
- [x] Visual brand direction (color palette + font pairing) per name
- [x] AI logo concept generation (DALL-E 3)
- [x] Brand Identity PDF export

## 🚧 Stretch Features
- [ ] Mood board generator (Unsplash API)
- [ ] Social media preview mockups
- [ ] Brand guidelines PDF template
- [ ] Competitor brand comparison
- [ ] User accounts (Firebase Auth)

## 🔑 API Overview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/brand/generate | Generate brand names, taglines, visual direction |
| POST | /api/brand/logos | Generate logo concepts (DALL-E 3) |
| POST | /api/domain/check | Check domain & handle availability |
| POST | /api/brand/save | Save brand project to Firestore |
| GET | /api/projects/:id | Retrieve saved project |
| GET | /health | Server health check |

## ⚠️ Environment Variables
```bash
# Copy to apps/server/.env
OPENAI_API_KEY=sk-...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Copy to apps/client/.env.local
VITE_API_URL=http://localhost:3001/api
```

## 📈 Architecture
```
User Browser
    ↓ (React + Vite)
Vercel CDN
    ↓ (HTTPS API calls)
Render (Node.js + Express)
    ├── OpenAI GPT-4o  (brand names, taglines, visual direction)
    ├── DALL-E 3       (logo concept images)
    └── Firebase Firestore (project persistence)
```

## 💰 Cost Estimates (Per Demo Run)
| Service | Cost |
|---------|------|
| GPT-4o (brand generation, ~2000 tokens) | ~$0.01 |
| DALL-E 3 (4 logos × $0.04) | ~$0.16 |
| Firebase Firestore (free tier) | $0 |
| **Total per full demo run** | **~$0.17** |

## 📄 License
MIT

---

*Built at [Hackathon Name] 2026 in 12 hours by a team of 4.*
