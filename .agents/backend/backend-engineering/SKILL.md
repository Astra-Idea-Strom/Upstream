---
name: backend-engineering
description: >-
  Server-side architecture: Node.js, Express, Fastify, REST APIs, middleware pipelines, and error boundaries. Use when building server-side applications, structuring backend routes, handling HTTP requests, or implementing business services. Not for frontend presentation or database schema modeling (that is frontend-engineering or data-modeling).
---

# Backend Engineering: Service Architecture, Controllers & Runtimes

## 1. The Controller-Service-Repository Pattern

Maintain strict separation between transport, business logic, and database persistence:

```text
HTTP Request
     │
     ▼
[Controller / Route Handler] → Validates request payload (Zod/Pydantic), extracts auth token, maps to DTO.
     │
     ▼
[Service Layer]              → Pure domain business logic, state transitions, domain rules, notifications.
     │
     ▼
[Repository / Data Access]   → Database queries, ORM calls, transactions, cache reads.
     │
     ▼
Database / External API
```

### Why This Separation is Mandatory
- **Testability**: Service functions can be unit-tested without mocking HTTP request/response objects.
- **Interchangeability**: Switching from REST to WebSockets or CLI commands reuses the exact same Service Layer.

---

## 2. Centralized Asynchronous Error Handling

Never sprinkle raw `try/catch` blocks randomly across every route handler without standard error propagation:

```typescript
// Express Centralized Error Middleware Pattern
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500, public isOperational: boolean = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Error Boundary Handler
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Unexpected Crash: Log full trace internally, return sanitized generic response
  console.error("FATAL UNEXPECTED ERROR:", err);
  return res.status(500).json({
    status: "error",
    message: "An internal server error occurred.",
  });
}
```

---

## 3. Environment & Configuration Hygiene
- Parse and validate all environment variables at application startup using **Zod** or `pydantic-settings`.
- If a required variable (`DATABASE_URL`, `JWT_SECRET`) is missing, fail fast and terminate the process immediately with an actionable error.

---

## 4. Anti-Patterns
- **SQL in Controllers**: Executing `db.query("SELECT * FROM ...")` directly inside an Express route handler.
- **Uncaught Promise Rejections**: Forgetting `.catch()` or omitting `try/catch` in async middleware without an `express-async-errors` wrapper.
- **Process Memory Leak**: Storing user session state in global JavaScript variables (`const sessions = {}`) instead of Redis or a database.

---

## 5. Verification Check
- Are controllers decoupled from database query logic?
- Does the application fail fast on boot if an environment variable is missing?
- Are all unexpected 500 errors logged with stack traces while returning sanitized messages to clients?
