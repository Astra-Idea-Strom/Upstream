/**
 * Brand asset store — durable home for everything the agent produces.
 *
 * Certificates, logo marks, palettes, reference uploads and exported kits all
 * land here. Firebase is optional in this project (mock mode by default), so
 * assets are persisted to a JSON file that survives restarts instead of being
 * lost with the process. Swap `persist()` for Firestore later without touching
 * callers.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type AssetKind = 'logo' | 'certificate' | 'reference' | 'palette' | 'kit' | 'other';

export interface BrandAsset {
  id: string;
  projectId: string;
  kind: AssetKind;
  label: string;
  /** Image URL (served from /api/assets/generated/...) when the asset is visual. */
  url?: string;
  /** Inline data URI when the asset was uploaded or generated inline. */
  dataUri?: string;
  /** Arbitrary structured payload — certificate fields, palette hexes, etc. */
  data?: Record<string, unknown>;
  tags: string[];
  createdAt: string;
}

type AssetFile = Record<string, BrandAsset[]>;

const MAX_ASSETS_PER_PROJECT = 200;

function storePath(): string {
  const candidates = [
    path.resolve(__dirname, '../../data/brand-assets.json'),
    path.resolve(process.cwd(), 'data/brand-assets.json'),
    path.resolve(process.cwd(), 'apps/server/data/brand-assets.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(path.dirname(p))) return p;
  }
  fs.mkdirSync(path.dirname(candidates[0]), { recursive: true });
  return candidates[0];
}

function read(): AssetFile {
  const file = storePath();
  try {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as AssetFile;
  } catch (err: any) {
    console.warn(`[AssetStore] Could not read ${file}: ${err.message}`);
    return {};
  }
}

function write(data: AssetFile): void {
  const file = storePath();
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn(`[AssetStore] Could not write ${file}: ${err.message}`);
  }
}

export function saveAsset(input: {
  projectId: string;
  kind: AssetKind;
  label: string;
  url?: string;
  dataUri?: string;
  data?: Record<string, unknown>;
  tags?: string[];
}): BrandAsset {
  const db = read();
  const projectId = input.projectId || 'unassigned';

  const asset: BrandAsset = {
    id: `asset_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    projectId,
    kind: input.kind,
    label: input.label,
    url: input.url,
    dataUri: input.dataUri,
    data: input.data,
    tags: input.tags ?? [],
    createdAt: new Date().toISOString(),
  };

  const list = db[projectId] ?? [];
  list.unshift(asset);
  db[projectId] = list.slice(0, MAX_ASSETS_PER_PROJECT);
  write(db);

  return asset;
}

export function listAssets(projectId: string, kind?: AssetKind): BrandAsset[] {
  const list = read()[projectId] ?? [];
  const filtered = kind ? list.filter((a) => a.kind === kind) : list;
  // Never ship inline base64 in listings — it would bloat every chat reply.
  return filtered.map((a) => (a.dataUri ? { ...a, dataUri: undefined } : a));
}

export function findAsset(projectId: string, assetId: string): BrandAsset | null {
  const list = read()[projectId] ?? [];
  return list.find((a) => a.id === assetId) ?? null;
}

export function deleteAsset(projectId: string, assetId: string): boolean {
  const db = read();
  const list = db[projectId] ?? [];
  const next = list.filter((a) => a.id !== assetId);
  if (next.length === list.length) return false;
  db[projectId] = next;
  write(db);
  return true;
}

export function countAssets(projectId: string): number {
  return (read()[projectId] ?? []).length;
}
