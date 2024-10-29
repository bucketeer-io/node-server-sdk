import test from 'ava';
import { InMemoryCache } from '../../cache/inMemoryCache';
import { NewFeatureCache } from '../../cache/features';
import { NewFeatureFlagProcessor } from '../../cache/processor/featureFlagCacheProcessor';
import { MockGRPCClient } from '../mocks/gprc';
import { ProcessorEventsEmitter } from '../../cache/processor/processorEvents';
import { GetFeatureFlagsResponse, creatFeature } from '@bucketeer/node-evaluation';
import { version } from '../../objects/version';

// Helper function to wait for a specified amount of time
const delayFn = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('polling cache', async t => {
  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });
  const eventEmitter = new ProcessorEventsEmitter();
  const featureFlag = 'nodejs';
  const grpc = new MockGRPCClient();

  const featuresResponse = new GetFeatureFlagsResponse();
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
  await delayFn(2000);

  processor.stop();

  t.deepEqual(await featureCache.get('feature1'), feature1);
  t.deepEqual(await featureCache.get('feature2'), feature2);
  
  t.deepEqual(grpc.getFeatureFlagsRequest, {
    tag: featureFlag,
    featureFlagsId: [],
    requestedAt: 0,
    version: version,
  });

});

function delay(arg0: number) {
  throw new Error('Function not implemented.');
}
