---
name: api-design
description: >-
  RESTful standards, pagination, status codes, versioning, OpenAPI. Use when
  designing or changing an HTTP interface — not when securing one (that is
  api-security).
---

# API Design: RESTful Standards, Pagination & Contract Engineering

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 0. Activation Boundary
**Use for:** resource modelling, URL and verb choice, status codes, pagination, versioning, OpenAPI.
**Do not use for:** authentication (`authentication`), rate limiting or abuse defence (`api-security`), or testing the contract (`api-testing`).
**Not triggered by:** a request to *secure* an API — that leads with `api-security`.

## 1. REST Resource Modeling & HTTP Verbs

Design APIs around nouns (resources), not actions (verbs):

| Action | HTTP Method | Route | Correct Status Code |
| :--- | :--- | :--- | :--- |
| List items | `GET` | `/api/v1/orders` | `200 OK` |
| Get item by ID | `GET` | `/api/v1/orders/:id` | `200 OK` (or `404 Not Found`) |
| Create item | `POST` | `/api/v1/orders` | `201 Created` + `Location` header |
| Replace item | `PUT` | `/api/v1/orders/:id` | `200 OK` |
| Partial update | `PATCH` | `/api/v1/orders/:id` | `200 OK` |
| Delete item | `DELETE` | `/api/v1/orders/:id` | `204 No Content` |

---

## 2. Pagination Strategy: Cursor vs Offset

### Offset Pagination (Simple / Static Data)
- Query: `GET /api/v1/orders?page=2&limit=20`
- Downsides: Poor performance on deep tables (`OFFSET 100000`); shifts/duplicates data if new records are inserted while user paginates.

### Cursor Pagination (High-Scale / Real-Time Feeds)
- Query: `GET /api/v1/orders?cursor=ord_xyz123&limit=20`
- Implementation: `SELECT * FROM orders WHERE id > $cursor ORDER BY id ASC LIMIT $limit`
- Guarantees O(1) index lookup performance and zero duplicate items across pages.

---

## 3. Idempotency & Mutation Safety

- Critical operations (e.g. charging a payment, creating an order) must accept an `Idempotency-Key` header.
- Store the idempotency key and hashed response in Redis for 24 hours.
- If a client retries the exact request due to network timeout, return the cached result without duplicate execution.

---

## 4. Standard JSON Envelope Schema
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "has_more": true,
      "next_cursor": "eyJpZCI6MTAxfQ=="
    }
  }
}
```

---

## 5. Anti-Patterns
- **Verbs in Endpoints**: `/api/v1/createOrder` or `/api/v1/deleteUser` instead of proper REST nouns.
- **Returning `200 OK` with Error Body**: Returning HTTP 200 with `{ "error": "Invalid password" }`. Always use proper 4xx/5xx status codes.
- **Unbounded Queries**: Endpoints that return all rows from a database table without a mandatory limit constraint.

---

## 6. Verification Check
- Are all list endpoints paginated with an enforced upper limit (e.g. `max: 100`)?
- Are HTTP status codes strictly semantic (201 for create, 204 for delete, 400 for validation, 401 for unauth, 403 for forbidden)?
- Do mutations accept idempotency keys where duplicates cause side-effects?
