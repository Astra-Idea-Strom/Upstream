---
name: geo-mapping
description: >-
  Geospatial engineering: GeoJSON schemas, coordinates, spatial queries, Leaflet/Mapbox maps, and Haversine distance. Use when rendering interactive maps, calculating geographic distances, querying bounding boxes, or handling GeoJSON coordinates. Not for general 3D rendering or canvas graphics (that is 3d-web or threejs).
---

# Geo Mapping: Spatial Systems, Haversine Math & Interactive Maps

> **Source Attribution**: Adapted and evolved from vudovn's `antigravity-kit` (MIT).

## 1. Core Geospatial Invariants

1. **Coordinate Standard (WGS 84)**: All latitude and longitude coordinates must adhere to WGS 84 (EPSG:4326) in decimal degrees: Latitude [-90.0, +90.0], Longitude [-180.0, +180.0]. Always document whether APIs expect `[lat, lng]` (Leaflet) or `[lng, lat]` (GeoJSON/Mapbox).
2. **Great-Circle Distance Calculations**: For short to medium distances on Earth, use the Haversine formula to compute great-circle distance over spherical geometry, avoiding flat Cartesian approximations.
3. **Lazy-Load Tile Layers & Vector Assets**: Large GeoJSON feature collections and interactive map containers must be loaded asynchronously to avoid degrading initial page performance.
4. **Resilient Geocoding Caching**: Geocoding (address -> coordinates) is expensive and rate-limited. Cache results indefinitely by normalized address string in Redis or PostgreSQL.

---

## 2. Key Implementation Patterns

### A. Haversine Great-Circle Distance (TypeScript)
```typescript
export interface Coordinates {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371.0;

/**
 * Calculates the great-circle distance between two points in kilometers.
 */
export function calculateHaversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const lat1 = toRadians(coord1.lat);
  const lat2 = toRadians(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}
```

### B. Greedy Nearest-Neighbor Route Optimization
```typescript
export function optimizeItineraryRoute(
  startPoint: Coordinates,
  stops: Array<Coordinates & { id: string; name: string }>
): Array<Coordinates & { id: string; name: string }> {
  const unvisited = [...stops];
  const orderedRoute: typeof stops = [];
  let currentPos = startPoint;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateHaversineDistance(currentPos, unvisited[i]);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIdx = i;
      }
    }

    const [nextStop] = unvisited.splice(nearestIdx, 1);
    orderedRoute.push(nextStop);
    currentPos = nextStop;
  }

  return orderedRoute;
}
```

### C. Leaflet React Map Container Component
```tsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title: string }>;
}

export const InteractiveMap: React.FC<MapProps> = ({ center, zoom = 13, markers = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer (attribution required)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers
    markers.forEach((m) => {
      L.marker([m.lat, m.lng]).addTo(map).bindPopup(m.title);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, zoom, markers]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "400px", borderRadius: "8px" }} />;
};
```

---

## 3. Anti-Patterns to Avoid

- **Inverting Coordinate Order**: Confusing `[lat, lng]` with GeoJSON standard `[lng, lat]`, placing markers in Antarctica or the middle of the ocean.
- **Euclidean Geometry for Long Distances**: Using Pythagorean theorem sqrt(Δx² + Δy²) to calculate distances across cities, introducing severe spherical distortion errors.
- **Unbounded Geocoding Loops**: Hitting geocoding APIs inside `map()` arrays without rate limiting, resulting in HTTP 429 IP bans.

---

## 4. Verification Checklist

- [ ] Haversine distance formula tested against known benchmark coordinates.
- [ ] Map instance is properly disposed on component unmount (`map.remove()`).
- [ ] OpenStreetMap or Mapbox attribution is displayed in accordance with license terms.
- [ ] Geocoding responses are cached by address.
