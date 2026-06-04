import test from 'ava';
import sino from 'sinon';
import { NewFeatureCache } from '../../../../cache/features';
import {
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
  FEATURE_FLAG_REQUESTED_AT,
  NewFeatureFlagProcessor,
} from '../../../../cache/processor/featureFlagCacheProcessor';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { Feature } from '../../../../objects/feature';
import { GetFeatureFlagsResponse } from '../../../../objects/response';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockAPIClient } from '../../../mocks/api';
import { SourceId } from '../../../../objects/sourceId';
import { toProtoFeature } from '../../../../cache/processor/converter';
import { minimalFeature } from '../../../utils/feature';


test('polling cache', async (t) => {
  const firstStartMark = BigInt(100);
  const secondStartMark = BigInt(200);
  const thirdStartMark = BigInt(300);

  const clock = new Clock();
  const latencyStartStub = sino.stub(clock, 'latencyStart');
  latencyStartStub.onFirstCall().returns(firstStartMark);
  latencyStartStub.onSecondCall().returns(secondStartMark);
  latencyStartStub.onThirdCall().returns(thirdStartMark);

  const latencySecondsSinceStub = sino.stub(clock, 'latencySecondsSince');
  latencySecondsSinceStub.withArgs(firstStartMark).returns(3.21);
  latencySecondsSinceStub.withArgs(secondStartMark).returns(1.8);
  latencySecondsSinceStub.withArgs(thirdStartMark).returns(1.0);

  const cache = new MockCache();
  const mockCache = sino.mock(cache);
  const mockCacheStbFeatureFlagId = mockCache.expects('get').atLeast(1).withArgs(FEATURE_FLAG_ID);
  mockCacheStbFeatureFlagId.onFirstCall().returns(null);
  mockCacheStbFeatureFlagId.returns('featureFlagsId');

  mockCache
    .expects('put')
    .atLeast(1)
    .withArgs(FEATURE_FLAG_ID, 'featureFlagsId', FEATURE_FLAG_CACHE_TTL);

  const mockCacheStbFeatureFlagRequestedAt = mockCache
    .expects('get')
    .atLeast(1)
    .withArgs(FEATURE_FLAG_REQUESTED_AT);
  mockCacheStbFeatureFlagRequestedAt.onFirstCall().returns(0);
  mockCacheStbFeatureFlagRequestedAt.returns(1100);

  mockCache
    .expects('put')
    .atLeast(1)
    .withArgs(FEATURE_FLAG_REQUESTED_AT, 1100, FEATURE_FLAG_CACHE_TTL);

  const apiClient = new MockAPIClient();
  const mockAPIClient = sino.mock(apiClient);

  const sourceId = SourceId.NODE_SERVER;
  const featureFlag = 'nodejs';
  const feature1 = minimalFeature('feature1');
  const feature2 = minimalFeature('feature2');

  const featuresResponse: GetFeatureFlagsResponse = {
    featureFlagsId: 'featureFlagsId',
    requestedAt: '1100',
    forceUpdate: false,
    features: [feature1, feature2],
    archivedFeatureFlagIds: [],
  };
  const responseSize = 512;

  mockCache
    .expects('put')
    .atLeast(1)
    .withArgs('features:feature1', toProtoFeature(feature1), FEATURE_FLAG_CACHE_TTL);
  mockCache
    .expects('put')
    .atLeast(1)
    .withArgs('features:feature2', toProtoFeature(feature2), FEATURE_FLAG_CACHE_TTL);

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureFlag, '', 0, sourceId, '2.3.1', sino.match.instanceOf(AbortSignal))
    .resolves([featuresResponse, responseSize]);

  mockAPIClient
    .expects('getFeatureFlags')
    .twice()
    .withArgs(featureFlag, 'featureFlagsId', 1100, sourceId, '2.3.1', sino.match.instanceOf(AbortSignal))
    .resolves([featuresResponse, responseSize]);

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
    apiClient: apiClient,
    eventEmitter: eventEmitter,
    featureTag: featureFlag,
    clock: clock,
    sourceId: sourceId,
    sdkVersion: '2.3.1',
  });

  await processor.start();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await processor.stop();

  t.true(latencyStartStub.calledThrice);
  t.true(latencySecondsSinceStub.calledThrice);
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  mockAPIClient.verify();
  t.pass();
});
