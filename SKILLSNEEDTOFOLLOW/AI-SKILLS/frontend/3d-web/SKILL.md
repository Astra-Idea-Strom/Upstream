---
name: 3d-web
description: >-
  3D web graphics: WebGL fundamentals, canvas rendering, camera controls, shaders, and lightweight 3D scenes. Use when rendering interactive 3D visualizations, managing WebGL canvas state, or integrating 3D assets on the web. Not for complex Three.js scene graphs or shader libraries (that is threejs).
---

# 3D Web: WebGL Architecture, Performance Budgets & Strategic Applicability

## 1. When 3D Is Appropriate vs INAPPROPRIATE

Do not introduce 3D graphics merely because WebGL looks visually impressive. Evaluate against this strict decision gate:

### Green Light: When 3D Genuinely Adds Value
- **Interactive Product Visualizers**: Inspecting a physical item (sneaker, watch, hardware device) from 360° angles.
- **Spatial & Architectural Walkthroughs**: Floorplans, real estate layout exploration, CAD model inspection.
- **Scientific, Medical & Educational Simulations**: Molecular biology, planetary orbits, anatomy visualization.
- **Creative Brand Experiences**: Immersive storytelling where the interactive 3D scene *is* the core product narrative.

### Red Light: When 3D is Counterproductive & Harmful
- **Basic Pricing Tables & Feature Cards**: Rendering a 3D spinning box to show feature tiers wastes bandwidth and kills mobile battery. Use modern CSS.
- **Form-Heavy Productivity Tools**: Never block data entry or dashboard analytics behind a WebGL canvas.
- **Bandwidth-Constrained or Accessibility-Critical Apps**: Medical portals, government sites, low-connectivity tools.

---

## 2. Performance Budgets for 60 FPS WebGL

Mobile devices have severe GPU, memory, and thermal constraints. Enforce these strict ceilings:

| Metric | Target Budget | Hard Maximum Ceiling |
| :--- | :--- | :--- |
| **Total 3D Asset Size** | < 1.5 MB total | 3.0 MB |
| **Draw Calls per Frame** | < 50 draw calls | 100 draw calls |
| **Triangle / Poly Count** | < 50,000 triangles | 100,000 triangles |
| **Texture Dimensions** | 1024x1024 px | 2048x2048 px (Never 4K on mobile) |
| **Canvas Pixel Ratio** | `Math.min(window.devicePixelRatio, 2)` | Prohibit `pixelRatio > 2` on 4K/Retina displays |

---

## 3. Asset Compression Pipeline (Draco & KTX2)

Raw `.obj` or uncompressed `.gltf` files are prohibited in production:
1. **Geometry Compression**: Use **Draco** or **Meshopt** compression to reduce mesh byte size by 80%–90%.
2. **Texture Compression**: Use **KTX2 / Basis Universal** GPU-compressed textures. These stay compressed in GPU VRAM, preventing mobile out-of-memory crashes.
3. **Format**: Deliver assets packaged as binary **`.glb`**.

---

## 4. Graceful Fallbacks & Accessibility

Always provide an accessible non-WebGL fallback:
- Detect WebGL support before mounting the canvas:
```javascript
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch (e) {
    return false;
  }
}
```
- If WebGL is unavailable or fails to initialize, render an optimized static image fallback or interactive 2D carousel.
- Screen readers cannot read 3D geometry: provide descriptive text, ARIA live region annotations, and accessible HTML controls mirroring 3D actions.

---

## 5. Anti-Patterns
- **The Uncapped Pixel Ratio**: Passing `pixelRatio = 3.5` on flagship phones, burning GPU cores and draining 5% battery in 30 seconds.
- **Blocking Page Hydration**: Freezing the main UI thread while parsing an uncompressed 25MB 3D model.
- **Memory Leaks on Unmount**: Forgetting to dispose geometries, materials, and textures when the user navigates away from the 3D page.

---

## 6. Verification Check
- Does the 3D canvas maintain steady 60 FPS on a mid-tier mobile device?
- Is total 3D asset payload under 2MB?
- Is there a complete static fallback rendered when WebGL is disabled?
