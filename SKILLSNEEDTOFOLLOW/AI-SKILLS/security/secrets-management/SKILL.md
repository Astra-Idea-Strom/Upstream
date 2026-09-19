---
name: secrets-management
description: >-
  Secrets lifecycle: environment variables, .env security, vault integration, key rotation, and gitignore enforcement. Use when configuring API keys, preventing secrets leakage in source control, rotating production credentials, or loading env files. Not for user authentication or password hashing (that is authentication).
---

# Secrets Management: Zero-Commit Policy & Credential Isolation

## 1. Core Secrets Invariants

1. **Zero Hardcoded Secrets**: No plaintext API key, database password, private key, or JWT signing secret may ever exist in version control or Docker images.
2. **Schema-Validated Environment Variables**: Applications must validate all required environment variables at process startup using a strict schema (e.g. Zod, Pydantic). Fail immediately if any secret is missing or malformed.
3. **Log & Telemetry Redaction**: Every logging sink, error reporter (Sentry), and tracing exporter (OpenTelemetry) must redact headers (`Authorization`, `Cookie`, `X-Api-Key`) and secret patterns.
4. **Least-Privilege & Auto-Rotation**: Keys must be scoped to specific environments (staging vs prod) and rotated periodically without downtime.

---

## 2. Key Implementation Patterns

### A. Strict Environment Schema Validation
```typescript
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32, "Session secret must be at least 32 characters"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  PORT: z.coerce.number().default(3000)
});

export const env = envSchema.parse(process.env);
```

### B. Structured Log Masking Middleware
```typescript
import pino from "pino";

export const logger = pino({
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers['x-api-key']",
      "*.password",
      "*.token",
      "*.secret",
      "*.creditCard"
    ],
    censor: "[REDACTED]"
  }
});
```

### C. Git Secret Defense (.gitignore Configuration)
Ensure `.gitignore` contains these mandatory patterns:
```gitignore
# Environment files
.env
.env.*
!.env.example

# Key files and certificates
*.pem
*.key
*.pfx
*.cert
id_rsa
id_ed25519

# Cloud credentials
.aws/credentials
gcp-key.json
service-account*.json
```

---

## 3. Anti-Patterns to Avoid

- **Committing `.env` Files**: Relying on git tracking for local convenience. Always commit only `.env.example` with blank dummy values.
- **Passing Secrets in Docker Build Arguments**: Using `ARG SECRET_KEY` bakes secrets directly into the intermediate image layers where `docker history` can reveal them.
- **Logging Exception Dumps Containing Connection Strings**: Database connection errors frequently dump `postgres://user:password@host/db` directly into stdout.
- **Client-Side Environment Leakage**: Prefixing private keys with `NEXT_PUBLIC_` or `VITE_`, exposing backend credentials directly to the browser bundle.

---

## 4. Verification & Testing

1. Scan codebase for leaked credentials using Gitleaks:
   ```bash
   gitleaks detect --source . --verbose
   ```
2. Verify git staging hook:
   ```bash
   git diff --cached | grep -E "(BEGIN PRIVATE KEY|sk_live_|AKIA[0-9A-Z]{16})"
   ```
