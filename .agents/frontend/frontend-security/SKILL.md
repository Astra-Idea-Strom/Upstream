---
name: frontend-security
description: >-
  Frontend vulnerability defense: DOM XSS sanitization (DOMPurify), CSP with per-response nonces,
  iframe sandboxing, CSRF mitigation, secure cookie flags, and Subresource Integrity (SRI).
  Use when handling untrusted HTML/links in UI, configuring CSP headers, sandboxing iframes,
  or securing client authentication tokens. Not for server-side SQL injection or database encryption
  (that is backend-security or secure-coding).
---

# Frontend Security: Client-Side Defense, Sanitization & Header Hardening

## 1. Cross-Site Scripting (DOM XSS) Prevention

XSS occurs when untrusted input reaches an execution sink in the browser DOM.

### Safe HTML Rendering with DOMPurify
Never use `dangerouslySetInnerHTML` or `innerHTML` with raw input. Sanitize with DOMPurify:
```tsx
import DOMPurify from "isomorphic-dompurify";

const cleanHtml = DOMPurify.sanitize(userBioHtml, {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p"],
  ALLOWED_ATTR: ["href", "title", "target"]
});

return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
```

### URL Protocol Validation
Validate user-supplied URLs before passing them to `<a href={url}>` to prevent `javascript:` execution:
```typescript
export function safeUrl(rawUrl: string, fallback = "#"): string {
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch {}
  return fallback;
}
```

### Dangerous DOM Sinks & postMessage Verification
- **Execution Sinks**: Avoid `eval()`, `setTimeout(string)`, and raw `document.write`.
- **postMessage Verification**: Always verify message origin before processing payloads:
```typescript
window.addEventListener("message", (event: MessageEvent) => {
  if (event.origin !== "https://trusted-domain.com") return;
  handlePayload(event.data);
});
```

---

## 2. Content Security Policy (CSP) & Defense Headers

Enforce strict CSP headers generated with dynamic nonces per response:
```javascript
// Express middleware: dynamic per-response nonce
import crypto from "node:crypto";

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.locals.nonce = nonce;
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none';`
  );
  next();
});
```
- **`frame-ancestors 'none'`**: Modern clickjacking protection (prefer over `X-Frame-Options: DENY`, which is kept as a fallback).
- **`style-src` Trade-off**: CSS-in-JS often demands `'unsafe-inline'`. To eliminate it, use build-time CSS extraction or style hashes.

---

## 3. Cross-Site Request Forgery (CSRF) Defense

1. **Safe GET Methods**: Never perform state mutations via `GET`, `HEAD`, or `OPTIONS`.
2. **SameSite Cookies**: Use `SameSite=Lax` for general navigation; `SameSite=Strict` for sensitive flows.
3. **Anti-CSRF Headers**: Require custom headers (e.g. `X-CSRF-Token` or `X-Requested-With`) on state-changing requests (`POST`, `PUT`, `DELETE`). Browsers enforce CORS preflights on custom headers:
```typescript
await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": getCsrfToken()
  },
  body: JSON.stringify(orderData)
});
```

---

## 4. Secure Iframe Sandboxing

Apply least privilege when embedding untrusted content:
```html
<iframe
  src="https://untrusted-partner.com/widget"
  sandbox="allow-scripts allow-forms"
  referrerpolicy="no-referrer"
  loading="lazy"
></iframe>
```

> [!CAUTION] Sandboxing Escape Pitfall
> **Never combine `allow-scripts` and `allow-same-origin`** for untrusted content. Scripts executing within the host origin can manipulate the parent DOM and strip the `sandbox` attribute.

---

## 5. Subresource Integrity (SRI) & Token Storage

- **Subresource Integrity (SRI)**: Ensure third-party CDN scripts cannot be tampered with:
```html
<script
  src="https://cdn.example.com/lib.min.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```
- **Token Storage**: Never store sensitive credentials in `localStorage` or `sessionStorage` (vulnerable to XSS). Store authentication in `HttpOnly; Secure; SameSite=Lax` cookies.

---

## 6. Anti-Patterns to Avoid

- **Raw HTML Injection**: Passing raw user input into `dangerouslySetInnerHTML`.
- **Static CSP Nonces**: Hardcoded static nonces provide zero injection defense.
- **Unvalidated Links**: Allowing `href={userInput}` without protocol verification.
- **`allow-scripts allow-same-origin`**: Enables iframe sandbox escape.
- **Mutating State on GET**: Exposes endpoints to simple image-tag CSRF attacks.

---

## 7. Verification Checklist

- [ ] All dynamic HTML rendering is sanitized via DOMPurify with strict tag whitelists.
- [ ] Links and redirect targets are validated for `http:` and `https:` protocols.
- [ ] CSP nonces are cryptographically unique per HTTP response.
- [ ] Iframes avoid combining `allow-scripts` and `allow-same-origin`.
- [ ] State-changing requests (POST/PUT/DELETE) verify anti-CSRF tokens or custom headers.
- [ ] External CDN scripts include `integrity` (SRI) hashes and `crossorigin="anonymous"`.
