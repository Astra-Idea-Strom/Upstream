---
name: frontend-performance
description: >-
  Core Web Vitals engineering (LCP, CLS, INP), asset optimization (AVIF/WebP, fonts), code splitting,
  streaming SSR, and hydration architectures. Use when improving page load speed, optimizing bundle size,
  fixing layout shifts, or debugging INP interaction lag. Not for server caching or database performance
  (that is caching or sql).
---

# Frontend Performance: Core Web Vitals, Asset Delivery & Hydration Architecture

## 1. Core Web Vitals Standards (2026 Standards)

1. **LCP (Largest Contentful Paint) <= 2.5s**:
   - Render time of the largest visible image or text block in viewport.
   - Preload the hero image in document `<head>` with `fetchpriority="high"`.
   - Never lazy-load above-the-fold hero images.
   - Self-host fonts in WOFF2 format with `font-display: swap` and `size-adjust`.
2. **CLS (Cumulative Layout Shift) <= 0.1**:
   - Measure of unexpected visual shifts during page lifecycle.
   - Always declare explicit `width` and `height` or CSS `aspect-ratio` on images/embeds.
   - Reserve container space for dynamic content before arrival.
3. **INP (Interaction to Next Paint) <= 200ms**:
   - Captures latency across clicks, taps, and keypresses.
   - Keep main-thread tasks under 50ms. Yield control using `scheduler.yield()` or microtask splitting.
   - Debounce search inputs and decouple UI feedback from background network sync.

---

## 2. Image Optimization: Hero vs Below-The-Fold

Always supply modern image formats (AVIF, WebP) with explicit dimensional attributes:

### Hero Image (Above-the-Fold: Immediate Priority)
```html
<!-- Preload candidate in document head -->
<link rel="preload" as="image" href="/hero.avif" type="image/avif" fetchpriority="high">

<!-- In component: high priority, NO lazy loading -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Showcase" width="1200" height="675" fetchpriority="high" decoding="async">
</picture>
```

### Below-the-Fold Images (Deferred / Lazy)
```html
<!-- Deferred rendering: native lazy loading -->
<picture>
  <source srcset="/card.avif" type="image/avif">
  <source srcset="/card.webp" type="image/webp">
  <img src="/card.jpg" alt="Preview" width="600" height="400" loading="lazy" decoding="async">
</picture>
```

---

## 3. Hydration Architectures & Streaming SSR

Hydration attaches event listeners to server-rendered HTML:

- **React Server Components (RSC)**: Ship zero client JavaScript for static informational views.
- **Streaming SSR with Suspense**: Stream the primary shell first, streaming dynamic components as data resolves:
```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <main>
      <Header />
      <Suspense fallback={<FeedSkeleton />}>
        <DynamicFeed />
      </Suspense>
    </main>
  );
}
```
- **Preventing Hydration Mismatches**: Never render client-varying state (`window.innerWidth`, `new Date()`, `localStorage`) in server passes. Defer to `useEffect()` after mounting.

---

## 4. Performance Measurement: Field vs Lab

Lab audits (Lighthouse) diagnose theoretical bugs; Field data captures real-world user variance:

### Field Metrics Capture (`web-vitals`)
Collect real-user Core Web Vitals and transmit to telemetry:
```typescript
import { onCLS, onINP, onLCP } from "web-vitals";

function sendMetric(metric: { name: string; value: number; id: string }) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon ? navigator.sendBeacon("/api/vitals", body) : fetch("/api/vitals", { body, method: "POST", keepalive: true });
}

onCLS(sendMetric);
onINP(sendMetric);
onLCP(sendMetric);
```

### CSS Performance Optimizations
- **`content-visibility: auto`**: Skips rendering off-screen DOM subtrees until scrolled near:
```css
.offscreen-card {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px;
}
```
- **`preconnect`**: Warm up external CDN connections before download requests fire:
```html
<link rel="preconnect" href="https://assets.example.com" crossorigin>
```

---

## 5. Bundle Sizing & Code Splitting

- **Dynamic Lazy Loading**: Split heavy dependencies (charts, editors, 3D) via `React.lazy()` or `next/dynamic`.
- **Target Budget**: Keep initial critical JavaScript bundle under 150 KB gzipped.
- **Import Hygiene**: Import specific functions (`import debounce from 'lodash-es/debounce'`) rather than full libraries.

---

## 6. Anti-Patterns to Avoid

- **Lazy-Loading Hero Images**: Placing `loading="lazy"` on the LCP hero element delays discovery.
- **Unsized Images**: Omitting `width`/`height`, causing page content to shift downward (ruining CLS).
- **Synchronous Web Fonts**: Blocking page render with unoptimized font `@import` rules in CSS.
- **Monolithic Single-Bundle Hydration**: Shipping massive client JavaScript that halts the main thread during boot.

---

## 7. Verification Checklist

- [ ] Hero image uses `fetchpriority="high"` and `<link rel="preload">`; `loading="lazy"` is absent.
- [ ] Below-the-fold images declare `loading="lazy"` and explicit `width`/`height`.
- [ ] Critical JavaScript bundle is under 150 KB gzipped.
- [ ] Long tasks yield via `scheduler.yield()` or microtask splitting to maintain INP <= 200ms.
- [ ] No hydration mismatch warnings appear in the client console.
- [ ] Real-user vitals are instrumented with `web-vitals` library and `navigator.sendBeacon`.
