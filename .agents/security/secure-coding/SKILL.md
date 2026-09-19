---
name: secure-coding
description: >-
  Secure programming practices: memory safety, buffer overflow prevention, type validation, integer overflow defenses, and safe parsing. Use when writing secure logic, preventing input parsing overflows, eliminating dangerous execution sinks, or type-checking inputs. Not for web headers or network transport security (that is backend-security).
---

# Secure Coding: Defensive Programming & Software Hardening

## 1. The Core Invariants of Defensive Programming

Every software component must enforce these three non-negotiable invariants:

1. **All External Input Is Malicious**: Validate every byte crossing a boundary (HTTP headers, query strings, body JSON, uploaded files, environment variables, message queues) using strict, declarative schemas (Zod, Pydantic).
2. **Fail Closed (Default Deny)**: If an authorization, verification, or validation step fails or throws an unhandled error, deny access immediately. Never default to permissive access.
3. **Principle of Least Privilege**: Grant processes, database users, and API tokens only the absolute minimum permissions required for their specific task.

---

## 2. Defensive Coding Rules Across Runtimes

### A. Input Sanitization & Type Coercion
- Never rely on loose equality (`==` in JavaScript/PHP). Always use strict equality (`===`).
- Explicitly parse strings to numbers with base specification: `parseInt(val, 10)`. Reject `NaN`.
- In Python, use explicit type hints and runtime validation (`pydantic.BaseModel`).

### B. Path Traversal Defense
Never concatenate user-supplied filenames into file system calls:
```typescript
import path from "path";

export function getSafeFilePath(baseDir: string, userFileName: string): string {
  // 1. Strip directory separators and null bytes
  const sanitized = path.basename(userFileName);
  
  // 2. Resolve absolute path
  const resolvedPath = path.resolve(baseDir, sanitized);

  // 3. Verify path stays within target directory boundaries
  if (!resolvedPath.startsWith(path.resolve(baseDir))) {
    throw new Error("Access Denied: Path traversal detected.");
  }

  return resolvedPath;
}
```

### C. Safe Subprocess Execution
Never invoke shell processes using string concatenation:
```typescript
// DANGEROUS: Command Injection vulnerability
child_process.exec(`convert ${userFile} output.png`);

// SECURE: Argument array execution without shell interpolation
child_process.execFile("convert", [userFile, "output.png"]);
```

---

## 3. Anti-Patterns
- **The Blacklist Validation**: Checking if input contains `' OR '1'='1`. Attackers will bypass blacklists with alternate encodings. Always use **whitelists** (e.g. `^[a-zA-Z0-9_-]+$`).
- **Verbose Error Stack Dumps to Clients**: Exposing database connection parameters or internal system paths to web users.
- **Client-Side Validation Only**: Relying solely on HTML5 `required` or frontend form checks without server-side validation.

---

## 4. Verification Check
- Are all inputs validated against strict schema whitelists?
- Are file system operations guarded against `../` path traversal?
- Are subprocesses executed with argument arrays rather than shell interpolation?
