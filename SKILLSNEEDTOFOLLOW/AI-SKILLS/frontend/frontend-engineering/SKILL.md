---
name: frontend-engineering
description: >-
  Modern frontend development: React, Next.js, component lifecycle, custom hooks, state management, and DOM optimization. Use when building user interfaces, architecting React components, managing client state, or optimizing render lifecycles. Not for design token taxonomy or CSS animations (that is design-systems or animation-motion).
---

# Frontend Engineering: Modern Component Architecture & State Management

## 1. Component Architecture & Hierarchy

Structure frontend applications with clear separation of concerns:

```text
src/
├── app/                  # Route layouts, pages, and route handlers (Next.js App Router)
├── components/
│   ├── ui/               # Headless or design token primitives (Button, Input, Dialog)
│   └── [feature]/        # Domain-specific compositions (e.g. OrderTable, ProfileCard)
├── hooks/                # Reusable stateful abstractions (useDebounce, useMediaQuery)
├── lib/                  # Utility functions, formatters, and API client instances
└── types/                # Shared TypeScript domain models and DTO schemas
```

### React Server Components (RSC) vs Client Components
- **Server Components (Default in App Router)**:
  - Use for: Data fetching, database access, heavy dependencies, initial static render.
  - Advantages: Zero client bundle overhead, secure direct backend access.
- **Client Components (`'use client'`)**:
  - Use ONLY when required for: `useState`, `useEffect`, event listeners (`onClick`, `onChange`), browser APIs (`window`, `localStorage`), or interactive libraries (Framer Motion, Canvas).
  - Push `'use client'` to the leaves of the component tree to maximize server-rendered surface area.

---

## 2. Form Handling & Validation

Never rely on uncontrolled inputs or unvalidated submit handlers:
- Use **React Hook Form** or native form actions with **Zod** schema validation.
- Provide immediate, accessible inline error messages tied to input IDs via `aria-describedby`.
- Handle all 4 form states explicitly: **Idle**, **Submitting (disabled button + spinner)**, **Success**, and **Error (actionable feedback)**.

```tsx
// Idiomatic Zod Schema + Form Validation Pattern
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;
```

---

## 3. Anti-Patterns
- **The "God" Component**: A single 800-line React component handling routing, data fetching, form state, and complex UI layouts.
- **Prop Drilling Through 6 Layers**: Failing to use React Context, component composition (passing children), or a lightweight store (Zustand) for deeply nested state.
- **Overusing `useEffect` for Derived State**: Computing values inside `useEffect` with `setState` instead of calculating them inline during render.
- **Flash of Unstyled Content (FOUC)**: Misconfiguring CSS imports or layout containers causing visual layout jumps.

---

## 4. Verification Check
- Are Server Components used wherever client interactivity is not required?
- Does every form have client-side and server-side schema validation?
- Are all loading, error, and empty states rendered cleanly?
