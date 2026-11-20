import anyTest, { TestFn } from 'ava';
import sino from 'sinon';
import { InMemoryCache } from '../../../../cache/inMemoryCache';
import { FeaturesCache, NewFeatureCache } from '../../../../cache/features';
import { HoldoutGroupsCache, NewHoldoutGroupsCache } from '../../../../cache/holdoutGroups';
import {
  DefaultFeatureFlagProcessor,
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
} from '../../../../cache/processor/featureFlagCacheProcessor';
import { GetFeatureFlagsResponse } from '../../../../objects/response';
import { SourceId } from '../../../../objects/sourceId';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { Clock } from '../../../../utils/clock';
import { MockAPIClient } from '../../../mocks/api';
import {
  HASH_HOLDOUT_GROUP_ID,
  HASH_HOLDOUT_GROUP_JSON,
  HOLDOUT_FEATURE_ID,
  SEGMENT_HOLDOUT_GROUP_ID,
  SEGMENT_HOLDOUT_GROUP_JSON,
  holdoutTargetFeature,
} from '../../../utils/holdout';

// Verifies how the feature flag processor keeps the holdout groups of the
// getFeatureFlags response in the cache. The backend sends the full list on
// every response, so the cached list is replaced each time and never merged.

const OTHER_FEATURE_ID = 'feature-id-other';

const test = anyTest as TestFn<{
  sandbox: sino.SinonSandbox;
  processor: DefaultFeatureFlagProcessor;
  cache: InMemoryCache<unknown>;
  featureFlagCache: FeaturesCache;
  holdoutGroupsCache: HoldoutGroupsCache;
  getFeatureFlags: sino.SinonStub;
  errors: unknown[];
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new InMemoryCache();
  const apiClient = new MockAPIClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const featureFlagCache = NewFeatureCache({ cache, ttl: FEATURE_FLAG_CACHE_TTL });
  const holdoutGroupsCache = NewHoldoutGroupsCache({ cache, ttl: FEATURE_FLAG_CACHE_TTL });
  const processor = new DefaultFeatureFlagProcessor({
    cache,
    featureFlagCache,
    holdoutGroupsCache,
    pollingInterval: 1000,
    apiClient,
    eventEmitter,
    featureTag: 'server',
    clock: new Clock(),
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '1.0.0',
  });
  const errors: unknown[] = [];
  eventEmitter.on('error', ({ error }) => errors.push(error));

  t.context = {
    sandbox,
    processor,
    cache,
    featureFlagCache,
    holdoutGroupsCache,
    getFeatureFlags: sandbox.stub(apiClient, 'getFeatureFlags'),
    errors,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

// Builds the response from JSON text, as the API client does, so the groups
// have the shape the gateway sends. holdoutGroupsJSON is the JSON of the
// `holdoutGroups` value; undefined leaves the field out of the response.
function response(options: {
  featureFlagsId: string;
  forceUpdate: boolean;
  featureIds?: string[];
  archivedFeatureFlagIds?: string[];
  holdoutGroupsJSON?: string;
}): [GetFeatureFlagsResponse, number] {
  const features = (options.featureIds ?? []).map((id) => holdoutTargetFeature({ id }));
  const holdoutGroups =
    options.holdoutGroupsJSON === undefined
      ? ''
      : `, "holdoutGroups": ${options.holdoutGroupsJSON}`;
  const body = `{
    "featureFlagsId": ${JSON.stringify(options.featureFlagsId)},
    "features": ${JSON.stringify(features)},
    "archivedFeatureFlagIds": ${JSON.stringify(options.archivedFeatureFlagIds ?? [])},
    "requestedAt": "1763539400",
    "forceUpdate": ${options.forceUpdate}
    ${holdoutGroups}
  }`;
  return [JSON.parse(body), body.length];
}

async function cachedGroupIds(holdoutGroupsCache: HoldoutGroupsCache): Promise<string[]> {
  return (await holdoutGroupsCache.get()).map((group) => group.getId());
}

test('stores the holdout groups of a response next to the flags', async (t) => {
  const { processor, featureFlagCache, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );

  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.truthy(await featureFlagCache.get(HOLDOUT_FEATURE_ID));
  const groups = await holdoutGroupsCache.get();
  t.is(groups.length, 1);
  t.is(groups[0].getId(), HASH_HOLDOUT_GROUP_ID);
  t.is(groups[0].getUpdatedAt(), 1763539200);
  t.is(groups[0].getFeaturesList()[0].getFeatureId(), HOLDOUT_FEATURE_ID);
});

test('replaces the list on an empty flag diff', async (t) => {
  const { processor, featureFlagCache, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.onFirstCall().resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  // A holdout-only change: no flags, not forced, and the new full list.
  getFeatureFlags.onSecondCall().resolves(
    response({
      featureFlagsId: '111:333',
      forceUpdate: false,
      holdoutGroupsJSON: `[${SEGMENT_HOLDOUT_GROUP_JSON}]`,
    }),
  );

  await processor.runUpdateCache();
  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.deepEqual(await cachedGroupIds(holdoutGroupsCache), [SEGMENT_HOLDOUT_GROUP_ID]);
  // The flags of the first response are untouched.
  t.truthy(await featureFlagCache.get(HOLDOUT_FEATURE_ID));
});

test('clears the list when the response carries an empty list', async (t) => {
  const { processor, featureFlagCache, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.onFirstCall().resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  // The group stopped: the ID is the flags part alone and the list is empty.
  getFeatureFlags
    .onSecondCall()
    .resolves(response({ featureFlagsId: '111', forceUpdate: false, holdoutGroupsJSON: '[]' }));

  await processor.runUpdateCache();
  t.deepEqual(await cachedGroupIds(holdoutGroupsCache), [HASH_HOLDOUT_GROUP_ID]);
  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.deepEqual(await holdoutGroupsCache.get(), []);
  t.truthy(await featureFlagCache.get(HOLDOUT_FEATURE_ID));
});

test('clears the list when the response has no holdoutGroups field', async (t) => {
  const { processor, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.onFirstCall().resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  // A backend that predates holdout delivery does not send the field.
  getFeatureFlags.onSecondCall().resolves(response({ featureFlagsId: '111', forceUpdate: false }));

  await processor.runUpdateCache();
  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.deepEqual(await holdoutGroupsCache.get(), []);
});

test('forced update replaces the flags and the list', async (t) => {
  const { processor, featureFlagCache, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.onFirstCall().resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: true,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  getFeatureFlags.onSecondCall().resolves(
    response({
      featureFlagsId: '444:555',
      forceUpdate: true,
      featureIds: [OTHER_FEATURE_ID],
      holdoutGroupsJSON: `[${SEGMENT_HOLDOUT_GROUP_JSON}]`,
    }),
  );

  await processor.runUpdateCache();
  t.deepEqual(await cachedGroupIds(holdoutGroupsCache), [HASH_HOLDOUT_GROUP_ID]);
  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.deepEqual(await cachedGroupIds(holdoutGroupsCache), [SEGMENT_HOLDOUT_GROUP_ID]);
  t.is(await featureFlagCache.get(HOLDOUT_FEATURE_ID), null);
  t.truthy(await featureFlagCache.get(OTHER_FEATURE_ID));
});

test('forced update keeps the list of the response when the flags are replaced', async (t) => {
  const { processor, featureFlagCache, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.onFirstCall().resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  // The same group is still serving while the flags are resent in full.
  getFeatureFlags.onSecondCall().resolves(
    response({
      featureFlagsId: '444:222',
      forceUpdate: true,
      featureIds: [HOLDOUT_FEATURE_ID, OTHER_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );

  await processor.runUpdateCache();
  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.deepEqual(await cachedGroupIds(holdoutGroupsCache), [HASH_HOLDOUT_GROUP_ID]);
  t.truthy(await featureFlagCache.get(HOLDOUT_FEATURE_ID));
  t.truthy(await featureFlagCache.get(OTHER_FEATURE_ID));
});

test('forced update clears the list when the response carries no group', async (t) => {
  const { processor, featureFlagCache, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.onFirstCall().resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  getFeatureFlags.onSecondCall().resolves(
    response({
      featureFlagsId: '444',
      forceUpdate: true,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: '[]',
    }),
  );

  await processor.runUpdateCache();
  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.deepEqual(await holdoutGroupsCache.get(), []);
  t.truthy(await featureFlagCache.get(HOLDOUT_FEATURE_ID));
});

test('a featureFlagsId with a holdout part is stored and sent back unchanged', async (t) => {
  const { processor, cache, getFeatureFlags, errors } = t.context;
  const featureFlagsId = '14693258423917466407:9841735018622114411';
  getFeatureFlags.resolves(
    response({
      featureFlagsId,
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );

  await processor.runUpdateCache();
  await processor.runUpdateCache();

  t.deepEqual(errors, []);
  t.is(await cache.get(FEATURE_FLAG_ID), featureFlagsId);
  t.is(getFeatureFlags.firstCall.args[1], '');
  t.is(getFeatureFlags.secondCall.args[1], featureFlagsId);
});

test('does not advance featureFlagsId when the list cannot be stored', async (t) => {
  const { sandbox, processor, cache, holdoutGroupsCache, getFeatureFlags, errors } = t.context;
  getFeatureFlags.onFirstCall().resolves(
    response({
      featureFlagsId: '111:222',
      forceUpdate: false,
      featureIds: [HOLDOUT_FEATURE_ID],
      holdoutGroupsJSON: `[${HASH_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  getFeatureFlags.onSecondCall().resolves(
    response({
      featureFlagsId: '111:333',
      forceUpdate: false,
      holdoutGroupsJSON: `[${SEGMENT_HOLDOUT_GROUP_JSON}]`,
    }),
  );
  await processor.runUpdateCache();
  const storeError = new Error('internal error');
  sandbox.stub(holdoutGroupsCache, 'put').rejects(storeError);

  await processor.runUpdateCache();

  // The ID still describes the list the cache holds, so the next poll asks
  // for the change again instead of reporting that it is up to date.
  t.deepEqual(errors, [storeError]);
  t.is(await cache.get(FEATURE_FLAG_ID), '111:222');
  t.deepEqual(await cachedGroupIds(holdoutGroupsCache), [HASH_HOLDOUT_GROUP_ID]);
});
