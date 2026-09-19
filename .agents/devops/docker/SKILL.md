---
name: docker
description: >-
  Containerization: Dockerfile multi-stage builds, docker-compose orchestration, container networking, and image size minimization. Use when creating Dockerfiles, running multi-container local environments, reducing container attack surfaces, or optimizing image builds. Not for cloud orchestration or CI workflows (that is cloud or ci-cd).
---

# Docker: Multi-Stage Builds, Security Hardening & Container Composition

## 1. Core Containerization Invariants

1. **Multi-Stage Build Architecture**: Separate build dependencies (compilers, devDependencies, header files) from runtime environments. The final production container must contain only runtime binaries.
2. **Never Run as Root**: The container process must run under a dedicated, unprivileged user (`USER node` or `USER nonroot`). Running as root enables container breakout exploits.
3. **Optimized Layer Caching**: Order Dockerfile directives from least frequently changed (base OS, lockfiles, dependencies) to most frequently changed (source code).
4. **Hermetic Healthchecks**: Provide explicit `HEALTHCHECK` instructions so orchestrators can determine real container readiness.

---

## 2. Key Implementation Patterns

### A. Production Multi-Stage Node.js Dockerfile
```dockerfile
# Stage 1: Dependency resolution & compilation
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer cache
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source code and build
COPY . .
RUN npm run build

# Prune dev dependencies for production runtime
RUN npm prune --production

# Stage 2: Hardened, minimal runtime container
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create dedicated non-root user and group
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy only production artifacts and node_modules
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

### B. Standard `docker-compose.yml` for Local Development
```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/appdb
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

---

## 3. Anti-Patterns to Avoid

- **Baking Secrets into Image Layers**: Using `ENV SECRET_KEY=abc` in Dockerfiles makes credentials permanently viewable in `docker history`.
- **Copying Entire Repository Before `npm install`**: Invalidates cache on every single line change, forcing reinstallation of all dependencies every build.
- **Using Unpinned `:latest` Tags**: Base images mutate unpredictably, breaking builds without code changes. Always pin explicit versions (e.g. `node:20.11.1-alpine3.19`).

---

## 4. Verification Checklist

- [ ] Dockerfile uses multi-stage build pattern.
- [ ] Image runs as non-root user (`USER appuser`).
- [ ] `docker scan` or `trivy image <tag>` reports zero high/critical vulnerabilities.
- [ ] Container includes automated `HEALTHCHECK` directive.
