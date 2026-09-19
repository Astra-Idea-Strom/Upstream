---
name: authentication
description: >-
  Identity proof: JWT, HttpOnly cookies, session stores, Argon2id, refresh-token
  rotation. Use when handling login, signup, sessions, passwords or tokens — not
  for deciding what a logged-in user may do (that is authorization).
---

# Authentication: Secure Session Management & Identity Verification

## 1. Password Hashing Standards

Never store or compare passwords in plain text, MD5, or unsalted SHA256:

- **Primary Standard**: **Argon2id** (Winner of the Password Hashing Competition).
  - Memory cost: >= 64 MB, Time cost: >= 3 iterations.
- **Alternative Standard**: **bcrypt**.
  - Cost factor / Work factor: >= 12.
- Always use constant-time comparison functions to prevent timing attacks.

```typescript
// Argon2id Hashing Recipe
import * as argon2 from "argon2";

export async function hashPassword(plainText: string): Promise<string> {
  return argon2.hash(plainText, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64MB
    timeCost: 3,
  });
}

export async function verifyPassword(hash: string, plainText: string): Promise<boolean> {
  return argon2.verify(hash, plainText);
}
```

---

## 2. JWTs vs Stateful Database Sessions

| Feature | Stateless JWTs | Stateful DB / Redis Sessions |
| :--- | :--- | :--- |
| **Best For** | Microservices, short-lived tokens (<= 15 min) | Monoliths, SaaS dashboards, instant logout revocation |
| **Revocation** | Impossible without distributed blacklist | Instant deletion of session key from Redis |
| **Storage** | `HttpOnly`, `Secure` cookie | `HttpOnly`, `Secure` cookie holding session ID |

### The Hybrid Token Standard (Recommended for SPAs)
- **Short-Lived Access Token (JWT)**: Expires in 15 minutes. Sent via `Authorization: Bearer <token>` or HttpOnly cookie.
- **Long-Lived Refresh Token**: Opaque random 64-byte string stored in database/Redis. Valid for 7–30 days. Triggers token rotation upon use.

---

## 3. Password Reset Security Flow
1. Generate a cryptographically secure random token (e.g. `crypto.randomBytes(32).toString('hex')`).
2. Store a **SHA256 hash of the token** in the database with an expiration timestamp (max 15–30 minutes). Never store the raw token.
3. Send the raw token in the reset link email.
4. On redemption, hash the submitted token and compare against the database. Invalidate immediately after use.

---

## 4. Anti-Patterns
- **Storing Tokens in `localStorage`**: Permitting trivial token theft via any minor XSS vulnerability.
- **JWT Without Expiration**: Generating tokens with no `exp` claim, making compromised tokens valid forever.
- **Verbose Auth Errors**: Returning "Email does not exist" vs "Incorrect password" during login. Always return a generic error: "Invalid email or password" to prevent user enumeration.

---

## 5. Verification Check
- Are passwords hashed using Argon2id or bcrypt (cost >= 12)?
- Are session tokens transmitted strictly via `HttpOnly`, `Secure`, `SameSite=Lax` cookies?
- Is user enumeration prevented on login and password reset routes?
