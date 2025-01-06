import { Cache } from './cache';

class Entry {
  value: any;
  expiration: number;

  constructor(value: any, expiration: number) {
    this.value = value;
    this.expiration = expiration;
  }
}

//Simple in-memory cache implementation
class InMemoryCache<T> implements Cache {
  private entries: Map<string, Entry>;

  constructor() {
    this.entries = new Map<string, Entry>();
  }

  private isExpired(entry: Entry): boolean {
    if (entry.expiration === 0) {
      return false;
    }
    const now = Date.now();
    return entry.expiration <= now;
  }

  async get(key: string): Promise<T | null> {
    const entry = this.entries.get(key);
    if (!entry) {
      return null;
    }

    //TODO: Implement scheduler for cleaning up of expired entries
    if (this.isExpired(entry)) {
      this.entries.delete(key); // Remove expired entry
      return null;
    }

    return entry.value;
  }

  async put(key: string, value: T, ttl: number): Promise<void> {
    const expirationTime = Date.now() + ttl;
    this.entries.set(key, new Entry(value, ttl == 0 ? 0 : expirationTime));
  }

  async scan(keyPrefix: string): Promise<string[]> {
    const keys: string[] = [];
    const allKeys = Array.from(this.entries.keys());
    const filteredKeys = allKeys.filter(key => key.startsWith(keyPrefix));
    keys.push(...filteredKeys);
    return keys;
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }

  async deleteAll(): Promise<void> {
    this.entries.clear();
  }
}

export { InMemoryCache };