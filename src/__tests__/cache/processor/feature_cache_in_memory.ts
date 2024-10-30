import test from 'ava';
import { InMemoryCache } from '../../../cache/inMemoryCache';
import { NewFeatureCache } from '../../../cache/features';
import { FEATURE_FLAG_ID, FEATURE_FLAG_REQUESTED_AT, NewFeatureFlagProcessor } from '../../../cache/processor/featureFlagCacheProcessor';
import { MockGRPCClient } from '../../mocks/gprc';
import { ProcessorEventsEmitter } from '../../../cache/processor/processorEvents';
import { GetFeatureFlagsResponse, creatFeature } from '@bucketeer/node-evaluation';

// Test with no mock
test('polling cache - using InMemoryCache()', async t => {
  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });
  const eventEmitter = new ProcessorEventsEmitter();
  const featureFlag = 'nodejs';
  const grpc = new MockGRPCClient();

  const featuresResponse = new GetFeatureFlagsResponse();
  featuresResponse.setFeatureFlagsId('featureFlagsId');
  const featureList = featuresResponse.getFeaturesList();
  const feature1 = creatFeature({ id: 'feature1' });
  const feature2 = creatFeature({ id: 'feature2' });

  featureList.push(feature1);
  featureList.push(feature2);

  grpc.featureFlags = featuresResponse;

  const processor = NewFeatureFlagProcessor({
    cache: cache,
    featureFlagCache: featureCache,
    pollingInterval: 10,
    grpc: grpc,
    eventEmitter: eventEmitter,
    featureTag: featureFlag,
  });

  processor.start();

  // Wait for 2 seconds before continuing the test
  await new Promise(resolve => setTimeout(resolve, 2000));

  processor.stop();

  t.deepEqual(await featureCache.get('feature1'), feature1);
  t.deepEqual(await featureCache.get('feature2'), feature2);

  const featureFlagId = await cache.get(FEATURE_FLAG_ID);
  t.is(featureFlagId, 'featureFlagsId');
  
  const requestedAt = await cache.get(FEATURE_FLAG_REQUESTED_AT);
  t.false(requestedAt != '');

  t.deepEqual(grpc.getFeatureFlagsRequest, {
    tag: featureFlag,
    featureFlagsId: 'featureFlagsId',
    requestedAt: 0,
  });
});