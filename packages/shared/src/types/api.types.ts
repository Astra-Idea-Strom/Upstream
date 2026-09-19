import type {
  BrandInput,
  BrandName,
  LogoConcept,
  BrandProject,
  DomainAvailability,
} from './brand.types';

// ─────────────────────────────────────────────
// POST /api/brand/generate
// ─────────────────────────────────────────────
export interface GenerateBrandRequest {
  input: BrandInput;
  count?: number; // default: 12
}

export interface GenerateBrandResponse {
  projectId: string;
  names: BrandName[];
}

// ─────────────────────────────────────────────
// POST /api/brand/logos
// ─────────────────────────────────────────────
export interface GenerateLogosRequest {
  projectId: string;
  selectedName: BrandName;
  count?: number; // default: 4
}

export interface GenerateLogosResponse {
  logos: LogoConcept[];
}

// ─────────────────────────────────────────────
// POST /api/domain/check
// ─────────────────────────────────────────────
export interface CheckDomainsRequest {
  names: string[]; // raw brand name strings e.g. ["Verdant", "Leafwise"]
}

export interface CheckDomainsResponse {
  results: Record<string, DomainAvailability>; // keyed by brand name string
}

// ─────────────────────────────────────────────
// POST /api/brand/save
// ─────────────────────────────────────────────
export interface SaveProjectRequest {
  project: Omit<BrandProject, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface SaveProjectResponse {
  id: string;
  message: string;
}

// ─────────────────────────────────────────────
// GET /api/projects/:id
// ─────────────────────────────────────────────
export type GetProjectResponse = BrandProject;

// ─────────────────────────────────────────────
// Error Response (all endpoints)
// ─────────────────────────────────────────────
export interface ApiError {
  error: string;      // machine-readable error code e.g. "OPENAI_ERROR"
  message: string;    // human-readable description
  statusCode: number; // HTTP status code
}
