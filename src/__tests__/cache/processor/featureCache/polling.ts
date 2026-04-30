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

import { FEATURE_FLAG_REQUESTED_AT } from '../../../../cache/processor/featureFlagCacheProcessor';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockGRPCClient } from '../../../mocks/gprc';
import { SourceId } from '../../../../objects/sourceId';

test('polling cache', async (t) => {

  const clock = new Clock();
  const mockClock = sino.mock(clock);
  // The processor no longer calls clock.getTime() to measure latency
  // (it uses process.hrtime.bigint() so sub-millisecond local-evaluation
  // latencies don't round to 0). The clock dependency is kept on the
  // processor options for source compatibility but is unused, so the mock
  // intentionally has no expectations.

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

  const sourceId = SourceId.NODE_SERVER;
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
    .once()
    .withArgs({
      tag: featureFlag,
      featureFlagsId: '',
      requestedAt: 0,
      sourceId: sourceId,
      sdkVersion: '2.3.1',
    })
    .resolves(featuresResponse);

  mockGRPCClient
    .expects('getFeatureFlags')
    .twice()
    .withArgs({
      tag: featureFlag,
      featureFlagsId: 'featureFlagsId',
      requestedAt: 1100,
      sourceId: sourceId,
      sdkVersion: '2.3.1',
    })
    .resolves(featuresResponse);


  mockGRPCClient.expects('getSegmentUsers').never();

  const eventEmitter = new ProcessorEventsEmitter();
  const mockProcessorEventsEmitter = sino.mock(eventEmitter);
  // Latency is now measured from process.hrtime.bigint() (real elapsed
  // time), so we can no longer assert specific latency values; we only
  // verify that the event is emitted thrice with a numeric latency.
  mockProcessorEventsEmitter
    .expects('emit')
    .thrice()
    .withArgs('pushLatencyMetricsEvent', sino.match({ apiId: 4, latency: sino.match.number }));
  mockProcessorEventsEmitter
    .expects('emit')
    .thrice()
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
    sourceId: sourceId,
    sdkVersion: '2.3.1',
  });

  await processor.start();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await processor.stop();
  mockClock.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  mockGRPCClient.verify();
  t.pass();
});
