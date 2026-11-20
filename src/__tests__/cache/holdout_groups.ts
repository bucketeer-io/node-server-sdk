import test from 'ava';
import { InMemoryCache } from '../../cache/inMemoryCache';
import { NewFeatureCache } from '../../cache/features';
import { NewHoldoutGroupsCache } from '../../cache/holdoutGroups';
import { NewSegmentUsersCache } from '../../cache/segmentUsers';
import { toEvaluatorHoldoutGroups } from '../../cache/processor/converter';
import {
  HASH_HOLDOUT_GROUP_ID,
  SEGMENT_HOLDOUT_GROUP_ID,
  hashHoldoutGroup,
  holdoutTargetFeature,
  segmentHoldoutGroup,
} from '../utils/holdout';
import { createFeature, createSegmentUsers } from '../utils/feature';

test('get: returns an empty list when nothing is stored', async (t) => {
  const cache = NewHoldoutGroupsCache({ cache: new InMemoryCache(), ttl: 0 });

  t.deepEqual(await cache.get(), []);
});

test('put: stores the list', async (t) => {
  const cache = NewHoldoutGroupsCache({ cache: new InMemoryCache(), ttl: 0 });

  await cache.put(toEvaluatorHoldoutGroups([hashHoldoutGroup()]));

  const groups = await cache.get();
  t.deepEqual(
    groups.map((group) => group.getId()),
    [HASH_HOLDOUT_GROUP_ID],
  );
});

test('put: replaces the previous list instead of merging into it', async (t) => {
  const cache = NewHoldoutGroupsCache({ cache: new InMemoryCache(), ttl: 0 });
  await cache.put(toEvaluatorHoldoutGroups([hashHoldoutGroup()]));

  await cache.put(toEvaluatorHoldoutGroups([segmentHoldoutGroup()]));

  const groups = await cache.get();
  t.deepEqual(
    groups.map((group) => group.getId()),
    [SEGMENT_HOLDOUT_GROUP_ID],
  );
});

test('put: an empty list clears the stored groups', async (t) => {
  const cache = NewHoldoutGroupsCache({ cache: new InMemoryCache(), ttl: 0 });
  await cache.put(toEvaluatorHoldoutGroups([hashHoldoutGroup()]));

  await cache.put([]);

  t.deepEqual(await cache.get(), []);
});

test('the groups share a cache with flags and segments without appearing among them', async (t) => {
  const cache = new InMemoryCache();
  const holdoutGroupsCache = NewHoldoutGroupsCache({ cache, ttl: 0 });
  const featuresCache = NewFeatureCache({ cache, ttl: 0 });
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 0 });
  await featuresCache.put(createFeature(holdoutTargetFeature()));
  await segmentUsersCache.put(createSegmentUsers({ segmentId: 'segment-id-1' }));

  await holdoutGroupsCache.put(toEvaluatorHoldoutGroups([hashHoldoutGroup()]));

  // The segment IDs are sent to the backend on every getSegmentUsers request.
  t.deepEqual(await segmentUsersCache.getIds(), ['segment-id-1']);
  t.deepEqual(await cache.scan('features:'), ['features:feature-id-holdout']);

  // Clearing the flags, as a forced update does, keeps the groups.
  await featuresCache.deleteAll();
  await segmentUsersCache.deleteAll();
  t.is((await holdoutGroupsCache.get()).length, 1);
});
