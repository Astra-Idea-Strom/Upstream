---
name: authorization
description: >-
  RBAC, ABAC, route guards, policy middleware and tenant isolation. Use when
  deciding what an already-identified user may access — permissions, roles,
  "user can see another user's data".
---

# Authorization: Access Control & Insecure Direct Object Reference (IDOR) Defense

## 1. Access Control Paradigms

1. **Role-Based Access Control (RBAC)**: Users are assigned static roles (`admin`, `manager`, `member`). Endpoints check if the user's role has permission for the action.
2. **Attribute-Based Access Control (ABAC)**: Permissions depend on dynamic attributes (e.g. "A user can edit an article ONLY IF `article.authorId === user.id` AND `article.status === 'draft'`").

---

## 2. Insecure Direct Object Reference (IDOR) Prevention

IDOR occurs when an application accepts a record ID from the client and retrieves or mutates it without verifying tenant/user ownership:

```typescript
// VULNERABLE TO IDOR: Anyone can access any invoice by guessing the ID
app.get("/api/invoices/:id", async (req, res) => {
  const invoice = await db.invoice.findUnique({ where: { id: req.params.id } });
  res.json(invoice);
});

// HARDENED SECURE IMPLEMENTATION: Scope query strictly to the authenticated tenant
app.get("/api/invoices/:id", requireAuth, async (req, res) => {
  const invoice = await db.invoice.findFirst({
    where: {
      id: req.params.id,
      tenantId: req.user.tenantId, // Ownership constraint enforced at the query level
    },
  });

  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" }); // Return 404, not 403, to avoid resource enumeration
  }

  res.json(invoice);
});
```

---

## 3. Middleware Permission Guards

Declare authorization guards declaratively on route definitions:

```typescript
// Type-safe permission middleware
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: "Access denied. Required permission missing." });
    }
    next();
  };
}
```

---

## 4. Anti-Patterns
- **Client-Side Authorization Only**: Hiding a "Delete" button in the frontend while leaving the `DELETE /api/items/:id` endpoint unprotected.
- **Sequential Integer IDs in Public APIs**: Using auto-incrementing integers (`/users/1`, `/users/2`) which make IDOR scraping trivial. Use **UUIDv4** or **CUID2 / ULID**.
- **Role Elevation Flaws**: Allowing a user to pass `"role": "admin"` in a profile update payload.

---

## 5. Verification Check
- Does every mutating and reading endpoint verify resource ownership against `req.user`?
- Are public-facing entity identifiers non-sequential (UUID/CUID)?
- Is authorization enforced 100% on the server side?
