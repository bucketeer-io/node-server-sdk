import { SegmentUsers } from '@kenji71089/evaluation';
import { Cache } from './cache';
import { NamespaceCache } from './namespace';

interface SegmentUsersCache {
  get(key: string): Promise<SegmentUsers | null>;
  put(value: SegmentUsers): Promise<void>;
  delete(key: string): Promise<void>;
  deleteAll(): Promise<void>;

  getAll(): Promise<SegmentUsers[]>;
  getIds(): Promise<string[]>;
}

function NewSegmentUsersCache(options: {cache: Cache, ttl: number}): SegmentUsersCache {
  return new SegmentUsersNamespaceCache(options.cache, options.ttl);
}

const SEGMENT_USERS_NAME_SPACE = 'segment_users:';

class SegmentUsersNamespaceCache implements SegmentUsersCache {
  private nameSpaceCache: NamespaceCache<SegmentUsers>;

  constructor(cache: Cache, ttl: number) {
    this.nameSpaceCache = new NamespaceCache<SegmentUsers>(cache, ttl, SEGMENT_USERS_NAME_SPACE);
  }

  get(key: string): Promise<SegmentUsers | null> {
    return this.nameSpaceCache.get(key);
  }

  delete(key: string): Promise<void> {
    return this.nameSpaceCache.delete(key);
  }

  getAll(): Promise<SegmentUsers[]> {
    return this.nameSpaceCache.getAll();
  }

  getIds(): Promise<string[]> {
    return this.nameSpaceCache.getIds();
  }

  deleteAll(): Promise<void> {
    return this.nameSpaceCache.deleteAll();
  }

  put(value: SegmentUsers): Promise<void> {
    return this.nameSpaceCache.put(value.getSegmentId(), value);
  }
}

export { SegmentUsersCache, NewSegmentUsersCache, SEGMENT_USERS_NAME_SPACE };