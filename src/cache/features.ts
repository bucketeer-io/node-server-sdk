import { Feature } from '@kenji71089/evaluation';
import { Cache } from './cache';
import { NamespaceCache } from './namespace';

interface FeaturesCache {
  get(key: string): Promise<Feature | null>;
  put(value: Feature): Promise<void>;
  delete(key: string): Promise<void>;
  deleteAll(): Promise<void>;
}

function NewFeatureCache(options: { cache: Cache; ttl: number; }): FeaturesCache {
  return new FeatureNamespaceCache(options.cache, options.ttl);
}

class FeatureNamespaceCache implements FeaturesCache {
  private cache: NamespaceCache<Feature>;
  
  constructor(cache: Cache, ttl: number) {
    this.cache = new NamespaceCache<Feature>(cache, ttl, 'features:');
  }

  async get(key: string): Promise<Feature | null> {
    return this.cache.get(key);
  }

  async put(value: Feature): Promise<void> {
    return this.cache.put(value.getId(), value);
  }

  async delete(key: string): Promise<void> {
    return this.cache.delete(key);
  }

  async deleteAll(): Promise<void> {
    return this.cache.deleteAll();
  }
}

export { FeaturesCache, NewFeatureCache };