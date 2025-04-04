import test from 'ava';
import sino from 'sinon';
import { NewFeatureCache } from '../../../../cache/features';
import {
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
  NewFeatureFlagProcessor,
} from '../../../../cache/processor/featureFlagCacheProcessor';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import {
  GetFeatureFlagsResponse,
  createFeature,
} from '@bucketeer/evaluation';

import { FEATURE_FLAG_REQUESTED_AT } from '../../../../../__test/cache/processor/featureFlagCacheProcessor';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockGRPCClient } from '../../../mocks/gprc';

test('polling cache', async (t) => {

  const clock = new Clock();
  const mockClock = sino.mock(clock);
  const mockClockExpected = mockClock.expects('getTime').atLeast(1);
  mockClockExpected.onFirstCall().returns(0);
  mockClockExpected.onSecondCall().returns(3210);
  mockClockExpected.onThirdCall().returns(4200);
  mockClockExpected.onCall(3).returns(6000);

  const cache = new MockCache();
  const mockCache = sino.mock(cache);
  const mockCacheStbFeatureFlagId = mockCache.expects('get').atLeast(1).withArgs(FEATURE_FLAG_ID);
  mockCacheStbFeatureFlagId.onFirstCall().returns(null);
  mockCacheStbFeatureFlagId.returns('featureFlagsId');

  mockCache.expects('put').atLeast(1).withArgs(FEATURE_FLAG_ID, 'featureFlagsId', FEATURE_FLAG_CACHE_TTL); 

  const mockCacheStbFeatureFlagRequestedAt = mockCache.expects('get').atLeast(1).withArgs(FEATURE_FLAG_REQUESTED_AT);
  mockCacheStbFeatureFlagRequestedAt.onFirstCall().returns(0);
  mockCacheStbFeatureFlagRequestedAt.returns(1100);

  mockCache.expects('put').atLeast(1).withArgs(FEATURE_FLAG_REQUESTED_AT, 1100, FEATURE_FLAG_CACHE_TTL); 

  const gRPCClient = new MockGRPCClient();
  const mockGRPCClient = sino.mock(gRPCClient);

  const featureFlag = 'nodejs';
  const featuresResponse = new GetFeatureFlagsResponse();
  featuresResponse.setFeatureFlagsId('featureFlagsId');
  featuresResponse.setRequestedAt(1100);
  const featureList = featuresResponse.getFeaturesList();
  const feature1 = createFeature({ id: 'feature1' });
  const feature2 = createFeature({ id: 'feature2' });

  featureList.push(feature1);
  featureList.push(feature2);

  const responseSize = featuresResponse.serializeBinary().length;

  mockCache.expects('put').atLeast(1).withArgs('features:feature1', feature1, FEATURE_FLAG_CACHE_TTL); 
  mockCache.expects('put').atLeast(1).withArgs('features:feature2', feature2, FEATURE_FLAG_CACHE_TTL); 

  mockGRPCClient
  .expects('getFeatureFlags')
  .atLeast(1)
  .withArgs({
    tag: featureFlag,
    featureFlagsId: '',
    requestedAt: 0,
  })
  .resolves(featuresResponse);

  mockGRPCClient
  .expects('getFeatureFlags')
  .atLeast(1)
  .withArgs({
    tag: featureFlag,
    featureFlagsId: 'featureFlagsId',
    requestedAt: 1100,
  })
  .resolves(featuresResponse);


  mockGRPCClient.expects('getSegmentUsers').never();

  const eventEmitter = new ProcessorEventsEmitter();
  const mockProcessorEventsEmitter = sino.mock(eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .atLeast(1)
    .withArgs('pushLatencyMetricsEvent', { latency: 3.21, apiId: 4 });
  mockProcessorEventsEmitter
    .expects('emit')
    .atLeast(1)
    .withArgs('pushLatencyMetricsEvent', { latency: 1.8, apiId: 4 });
  mockProcessorEventsEmitter
    .expects('emit')
    .atLeast(1)
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: 4 });
  mockProcessorEventsEmitter.expects('emit').never().withArgs('error', sino.match.any);

  const processor = NewFeatureFlagProcessor({
    cache: cache,
    featureFlagCache: NewFeatureCache({ cache: cache, ttl: 0 }),
    pollingInterval: 1000,
    grpc: gRPCClient,
    eventEmitter: eventEmitter,
    featureTag: featureFlag,
    clock: clock,
  });

  processor.start();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  processor.stop();
  mockClock.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  mockGRPCClient.verify();
});
