/**
 * apiService.ts
 * Client-side API service with transparent offline fallback.
 * If the backend is unreachable (no /api/health), all calls fall back
 * to the client-side mock data engine silently.
 */

const API_BASE = '/api';
let _backendAlive: boolean | null = null;

/** Check once whether the backend is reachable. Result is cached. */
async function isBackendAlive(): Promise<boolean> {
  if (_backendAlive !== null) return _backendAlive;
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    _backendAlive = res.ok;
  } catch {
    _backendAlive = false;
  }
  return _backendAlive!;
}

/** Generic JSON POST with fallback value. */
async function apiPost<T>(path: string, body: unknown, fallback: T): Promise<T> {
  const alive = await isBackendAlive();
  if (!alive) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[apiService] POST ${path} failed, using fallback:`, err);
    return fallback;
  }
}

// ---------------------------------------------
// Brand Generation
// ---------------------------------------------

export interface GenerateBrandRequest {
  input: {
    businessName?: string;
    industry: string;
    targetAudience: string;
    mission: string;
    tone: string;
    constraints: string;
  };
  count?: number;
}

export interface GenerateBrandResponse {
  projectId: string;
  names: unknown[];
}

export async function generateBrands(
  request: GenerateBrandRequest,
  fallbackNames: unknown[],
): Promise<GenerateBrandResponse> {
  return apiPost<GenerateBrandResponse>(
    '/brand/generate',
    request,
    { projectId: `local_${Date.now()}`, names: fallbackNames },
  );
}

// ---------------------------------------------
// Logo Generation
// ---------------------------------------------

export interface GenerateLogosRequest {
  brandName: string;
  palette: { hex: string }[];
}

export async function generateLogos(
  request: GenerateLogosRequest,
  fallbackLogos: unknown[],
): Promise<{ logos: unknown[] }> {
  return apiPost<{ logos: unknown[] }>('/brand/logos', request, { logos: fallbackLogos });
}

// ---------------------------------------------
// Domain Availability Check
// ---------------------------------------------

export interface DomainCheckResult {
  com: boolean;
  io: boolean;
  co: boolean;
  handle: { twitter: boolean; instagram: boolean };
}

export async function checkDomains(
  names: string[],
  fallbackResults: Record<string, DomainCheckResult>,
): Promise<{ results: Record<string, DomainCheckResult> }> {
  return apiPost<{ results: Record<string, DomainCheckResult> }>(
    '/domain/check',
    { names },
    { results: fallbackResults },
  );
}

// ---------------------------------------------
// Save Project
// ---------------------------------------------

export async function saveProject(data: unknown): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>('/brand/save', data, { ok: false });
}
