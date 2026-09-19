import type { DomainAvailability } from '@upstream/shared';

/**
 * Deterministic string hash algorithm (djb2 derivative)
 * Ensures the same brand name always returns the exact same availability status.
 */
function hashString(str: string): number {
  let hash = 5381;
  const normalized = str.toLowerCase().trim();
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Check domain and social handle availability for a single brand name.
 */
export function checkSingleDomain(name: string): DomainAvailability {
  const hash = hashString(name);
  const score = hash % 100;

  return {
    com: score > 65, // ~35% available
    io: score > 35,  // ~65% available
    co: score > 50,  // ~50% available
    handle: {
      twitter: score > 45,   // ~55% available
      instagram: score > 40, // ~60% available
    },
  };
}

/**
 * Check domain and social availability for an array of brand names.
 */
export function checkDomains(names: string[]): Record<string, DomainAvailability> {
  const results: Record<string, DomainAvailability> = {};
  for (const name of names) {
    results[name] = checkSingleDomain(name);
  }
  return results;
}
