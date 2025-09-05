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

test('polling cache', async () => {

  const clock = new Clock();
  const mockClock = sino.mock(clock);
  const mockClockExpected = mockClock.expects('getTime').atLeast(5);
  mockClockExpected.onFirstCall().returns(0);
  mockClockExpected.onSecondCall().returns(3210);
  mockClockExpected.onThirdCall().returns(4200);
  mockClockExpected.onCall(3).returns(6000);
  mockClockExpected.onCall(4).returns(8700);
  mockClockExpected.onCall(5).returns(9700);

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
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', { latency: 3.21, apiId: 4 });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', { latency: 1.8, apiId: 4 });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', { latency: 1.0, apiId: 4 });
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

  processor.start();

  await new Promise((resolve) => setTimeout(resolve, 3000));

  processor.stop();
  mockClock.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  mockGRPCClient.verify();
});
