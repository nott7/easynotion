import { describe, it, expect } from "vitest";
import { CacheManager } from "../lib/cacheManager";

describe("CacheManager", () => {
  it("should set and get a value", () => {
    const cache = new CacheManager({ ttlSeconds: 60 });
    cache.set("key", "value");

    const value = cache.get("key");
    expect(value).toBe("value");
  });

  it("should invalidate a value", () => {
    const cache = new CacheManager({ ttlSeconds: 60 });
    cache.set("key", "value");

    cache.invalidate("key");
    expect(cache.get("key")).toBeUndefined();
  });

  it("should clear the cache", () => {
    const cache = new CacheManager({ ttlSeconds: 60 });
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    cache.clear();
    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBeUndefined();
  });

  it("should expire values after TTL", async () => {
    const cache = new CacheManager({ ttlSeconds: 1 });
    cache.set("key", "value");

    await new Promise(res => setTimeout(res, 1100)); // 1.1s
    expect(cache.get("key")).toBeUndefined();
  });
});
