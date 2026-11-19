import { HoldoutGroup } from '@bucketeer/evaluation';
import { Cache } from './cache';

// The holdout groups serving in the environment, as the evaluator reads them.
// The backend sends the full list on every getFeatureFlags response, so the
// list is stored under one key and replaced as a whole.
interface HoldoutGroupsCache {
  // Returns an empty list when no group is serving.
  get(): Promise<HoldoutGroup[]>;
  // Replaces the stored list. An empty list clears it.
  put(groups: HoldoutGroup[]): Promise<void>;
}

// The key shares the cache with the flags and the segment users. It must not
// start with their namespaces: the segment users cache scans its namespace to
// list the segment IDs it sends to the backend.
const HOLDOUT_GROUPS_KEY = 'bucketeer_holdout_groups';

function NewHoldoutGroupsCache(options: { cache: Cache; ttl: number }): HoldoutGroupsCache {
  return new DefaultHoldoutGroupsCache(options.cache, options.ttl);
}

class DefaultHoldoutGroupsCache implements HoldoutGroupsCache {
  private cache: Cache;
  private ttl: number;

  constructor(cache: Cache, ttl: number) {
    this.cache = cache;
    this.ttl = ttl;
  }

  async get(): Promise<HoldoutGroup[]> {
    const groups: HoldoutGroup[] | null = await this.cache.get(HOLDOUT_GROUPS_KEY);
    return groups ?? [];
  }

  async put(groups: HoldoutGroup[]): Promise<void> {
    return this.cache.put(HOLDOUT_GROUPS_KEY, groups, this.ttl);
  }
}

export { HoldoutGroupsCache, NewHoldoutGroupsCache, HOLDOUT_GROUPS_KEY };
