import { Cache } from './cache';

class NamespaceCache<T> {
  private cache: Cache;
  private ttl: number;
  private _namespace: string;

  get namespace(): string {
    return this._namespace;
  }

  constructor(cache: Cache, ttl: number, namespace: string) {
    this.cache = cache;
    this.ttl = ttl;
    this._namespace = namespace;
  }

  async get(key: string): Promise<T | null> {
    return this.cache.get(this.composeKey(key));
  }

  async put(key: string, value: T): Promise<void> {
    return this.cache.put(this.composeKey(key), value, this.ttl);
  }

  async delete(key: string): Promise<void> {
    return this.cache.delete(this.composeKey(key));
  }

  async getAll(): Promise<T[]> {
    const ids = await this.getIds();  
    const promises = ids.map(id => this.get(id));
    const results = await Promise.all(promises);
    return results.filter((result) => result !== null);
  }

  private async getInternalIds(): Promise<string[]> {
    return this.cache.scan(this.namespace);
  }

  async getIds(): Promise<string[]> {
    return (await this.getInternalIds()).map(key => key.replace(this.namespace, ''));
  }

  async deleteAll(): Promise<void> {
    const ids = await this.getIds();
    ids.map(id => this.delete(id));
  }

  composeKey(id: string): string {
    return this.namespace + id;
  }
}

export { NamespaceCache };