---
name: threejs
description: >-
  Three.js 3D development: scene graphs, mesh geometries, PBR materials, lighting, GLTF loading, and render loops. Use when developing Three.js applications, loading 3D GLTF models, creating custom lighting rigs, or optimizing render frames. Not for lightweight 2D canvas graphics or pure CSS styling (that is 3d-web or advanced-css).
---

# Three.js & React Three Fiber (R3F): Production 3D Engineering

## 1. Core Architecture: React Three Fiber (R3F) Standard

In modern React / Next.js ecosystems, declare 3D scenes using React Three Fiber (`@react-three/fiber`) and `@react-three/drei`. This binds Three.js into the declarative component lifecycle:

```tsx
import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import * as THREE from "three";

// 1. Model Component with Automatic Preload & Disposal
function InteractiveModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  // Smooth frame update (runs outside React state loop for 60fps)
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={1.5}
      onClick={(e: any) => {
        e.stopPropagation();
        console.log("Model clicked");
      }}
    />
  );
}

// 2. Production Canvas Configuration
export function ModelViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="relative w-full h-[450px] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        dpr={[1, 2]} // Caps pixel ratio to max 2 for mobile GPU protection
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

        <Suspense fallback={<Html center><span className="text-xs text-zinc-400">Loading 3D...</span></Html>}>
          <InteractiveModel url={modelUrl} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
}

// Preload the asset to eliminate loading stutter
useGLTF.preload("/models/product.glb");
```

---

## 2. Raycasting & User Interaction

- In native Three.js, raycasting requires normalized mouse coordinates and an explicit `raycaster.intersectObjects` call.
- In R3F, raycasting is built into event handlers directly on meshes: `onPointerOver`, `onPointerOut`, `onClick`.
- **Optimization**: Never raycast against high-poly models directly. Add a simple low-poly invisible bounding box (`visible={false}`) to serve as the raycasting proxy target.

---

## 3. Mandatory Memory Disposal (Preventing VRAM Leaks)

WebGL memory does not get garbage-collected automatically by JavaScript:
```javascript
// Native Three.js Clean Cleanup on Component Unmount
function cleanupThreeScene(scene, renderer) {
  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry.dispose();
      if (child.material.isMaterial) {
        cleanMaterial(child.material);
      } else if (Array.isArray(child.material)) {
        child.material.forEach(cleanMaterial);
      }
    }
  });
  renderer.dispose();
}

function cleanMaterial(material) {
  material.dispose();
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose(); // Dispose textures
    }
  }
}
```

---

## 4. Anti-Patterns
- **Creating Geometries in `useFrame`**: Creating `new THREE.SphereGeometry()` inside the render loop creates 60 allocations per second, triggering severe GC pauses. Always allocate once in `useMemo` or declare as a JSX tag.
- **Uncapped Shadow Maps**: Setting shadow map sizes to 4096x4096 crashes mobile GPUs. Use 1024x1024 or contact shadows (`@react-three/drei` `<ContactShadows />`).
- **Heavy Post-Processing Chains**: Stacking Bloom, SSAO, Depth of Field, and Chromatic Aberration simultaneously on standard web pages.

---

## 5. Verification Check
- Does the 3D scene properly clean up all geometries and textures when navigating away?
- Is DPR clamped between 1 and 2 to protect mobile battery life?
- Are orbit controls constrained in distance and angles so the camera never clips inside objects?
