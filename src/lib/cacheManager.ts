/**
 * CacheManager
 * 
 * A smart in-memory cache with TTL expiration and LRU size limits.
 * 
 * Automatically removes expired entries and evicts least recently used
 * entries when exceeding the size limit.
 */

import { LRUCache } from "lru-cache";

interface CacheOptions {
  ttlSeconds?: number;
  maxEntries?: number;
}

export class CacheManager {
  private cache: LRUCache<string, any>;
  private defaultTTL: number; // milliseconds

  constructor({ ttlSeconds = 3600, maxEntries = 500 }: CacheOptions = {}) {
    this.defaultTTL = ttlSeconds * 1000; // seconds -> milliseconds

    this.cache = new LRUCache<string, any>({
      max: maxEntries,           // Max number of items before eviction
      ttl: this.defaultTTL,       // Default TTL in milliseconds
      allowStale: false,          // Don't allow stale reads
      updateAgeOnGet: true,       // Move item to top on access (true LRU)
      updateAgeOnHas: false,
    });
  }

  /**
   * Retrieve an item from the cache.
   * @param key - Cache key
   * @returns Cached value or undefined if missing or expired
   */
  get<T = any>(key: string): T | undefined {
    return this.cache.get(key);
  }

  /**
   * Save an item into the cache.
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlSeconds - Optional per-item TTL override
   */
  set(key: string, value: any, ttlSeconds?: number): void {
    const ttlMs = (ttlSeconds ?? this.defaultTTL / 1000) * 1000;
    this.cache.set(key, value, { ttl: ttlMs });
  }

  /**
   * Check if a key exists in the cache.
   * @param key - Cache key
   * @returns True if exists and valid
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Invalidate a specific cache entry.
   * @param key - Cache key to remove
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.cache.clear();
  }
}
