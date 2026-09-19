---
name: caching
description: >-
  Redis and in-memory caching: cache-aside, write-through, TTL jitter, cache stampede
  prevention (singleflight), negative caching, and eviction policies. Use when designing
  caching layers, mitigating database load, preventing thundering herds, or configuring
  Redis memory eviction. Not for primary durable relational storage (that is sql or postgresql).
---

# Caching: Redis Architecture, Invalidation & Stampede Defense

## 1. Caching Strategies & Topologies

### The Cache-Aside Pattern (Standard)
1. Read request arrives; inspect Redis cache first.
2. **Cache Hit**: Return cached data immediately.
3. **Cache Miss**: Query database, write result to Redis with TTL, and return.
4. **Data Mutation**: Update the primary database first, then **delete (evict)** the cached key. Never update cache directly in parallel unless applying strict write-through consistency.

```typescript
// Cache-aside with 10% jitter and graceful DB fallback
export async function getCachedUser(userId: string): Promise<User | null> {
  const cacheKey = `user:${userId}:profile`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      if (cached === "__NULL__") return null; // Negative caching hit
      return JSON.parse(cached); // Note: Date strings must be revived
    }
  } catch (err) {
    console.warn("Redis unavailable, falling back to database:", err);
  }

  // Database query on cache miss or Redis outage
  const user = await db.user.findUnique({ where: { id: userId } });

  try {
    if (user) {
      // 10% random jitter on 3600s TTL (3600s to 3960s) prevents stampedes
      const baseTtl = 3600;
      const jitter = Math.floor(Math.random() * (baseTtl * 0.10));
      await redis.set(cacheKey, JSON.stringify(user), "EX", baseTtl + jitter);
    } else {
      // Negative caching: cache non-existent records briefly (60s)
      await redis.set(cacheKey, "__NULL__", "EX", 60);
    }
  } catch (err) {
    console.warn("Failed to write to Redis:", err);
  }

  return user;
}
```

### Write-Through vs Write-Behind Trade-Offs
- **Write-Through**: The application writes synchronously to both the cache and the primary database. Guarantees immediate cache consistency at the expense of higher write latency.
- **Write-Behind (Write-Back)**: Writes are acknowledged immediately to the in-memory cache, and asynchronously flushed to disk/database via a worker queue. Maximizes throughput but risks data loss if the cache node crashes before flushing.

---

## 2. Stampede Defense: Singleflight & Mutex Locks

When hot keys expire under heavy traffic, thousands of concurrent requests can hammer the database (thundering herd):

### Singleflight Mutex Lock Implementation
Ensure only a single worker executes the expensive database fetch while concurrent requests wait:
```typescript
export async function getWithSingleflight<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = `lock:${key}`;
  // Acquire distributed mutex lock with 10s automatic release
  const acquired = await redis.set(lockKey, "1", "NX", "EX", 10);

  if (acquired) {
    try {
      const data = await fetcher();
      await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
      return data;
    } finally {
      await redis.del(lockKey);
    }
  }

  // Lock held by another thread: poll with backoff
  await new Promise((resolve) => setTimeout(resolve, 80));
  return getWithSingleflight(key, fetcher, ttlSeconds);
}
```

---

## 3. The Stale-Write Race Condition

A race condition occurs when:
1. Reader A encounters a cache miss and queries the database (sees `v1`).
2. Writer B updates the database to `v2` and deletes the cache key.
3. Reader A writes the stale `v1` back into the cache, persisting obsolete data.

### Mitigations:
- **Delayed Dual-Deletion**: The writer updates the database, deletes the cache key, waits 500ms, and deletes the cache key a second time to purge any in-flight reads.
- **Short TTLs**: Always enforce reasonable TTLs even on permanent records.

---

## 4. Redis Eviction Policies (`maxmemory-policy`)

When Redis memory limits are reached, `maxmemory-policy` dictates key eviction:
- **`allkeys-lru`** (Recommended for Caches): Evicts least recently used keys across all keys. Ideal for caching layers.
- **`volatile-ttl`**: Evicts keys with an explicit TTL, targeting shortest remaining TTL first.
- **`volatile-lru`**: Evicts least recently used keys only among keys configured with a TTL.
- **`noeviction`**: Rejects writes with memory errors when full. Dangerous for caching; appropriate only for durable stores.

---

## 5. Serialization Pitfalls & Core Invariants

- **`JSON.parse` Date Trap**: `JSON.stringify(new Date())` serializes dates as ISO strings. `JSON.parse()` does not restore `Date` instances. Validate or revive cached data with Zod:
```typescript
import { z } from "zod";
const UserSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date()
});
```
- **Fallback Invariant**: The cache is **never** the single source of truth. Always catch Redis exceptions and fall back gracefully to the primary database.

---

## 6. Anti-Patterns to Avoid

- **Caching Without a TTL**: Storing keys without expiration causes unbounded RAM growth and stale records.
- **Unsynchronized Jitter Comments**: Claiming 10% jitter while adding arbitrary constants.
- **Neglecting Cache Outages**: Failing the entire user request when Redis connection is lost.
- **Re-Fetching Non-Existent Records**: Omitting negative caching, allowing attackers to DoS database with invalid IDs.

---

## 7. Verification Checklist

- [ ] TTL jitter percentage strictly matches code calculations (e.g. 10% = `baseTtl * 0.10`).
- [ ] Redis failures are caught, falling back safely to the primary database.
- [ ] Mutex locking (singleflight) or probabilistic early expiration mitigates stampedes on hot keys.
- [ ] Non-existent lookups utilize negative caching with short expiration.
- [ ] `maxmemory-policy` is explicitly configured (`allkeys-lru` for pure caches).
