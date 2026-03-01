import anyTest, { TestFn } from 'ava';
import sino from 'sinon';
import { NewFeatureCache } from '../../../../cache/features';
import {
  DefaultFeatureFlagProcessor,
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
  FEATURE_FLAG_REQUESTED_AT,
  FeatureFlagProcessorOptions,
} from '../../../../cache/processor/featureFlagCacheProcessor';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { Feature } from '../../../../objects/feature';
import { GetFeatureFlagsResponse } from '../../../../objects/response';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockAPIClient } from '../../../mocks/api';
import { SourceId } from '../../../../objects/sourceId';
import { ApiId } from '../../../../objects/apiId';
import { toProtoFeature } from '../../../../evaluator/converter';

const test = anyTest as TestFn<{
  featureTag: string;
  processor: DefaultFeatureFlagProcessor;
  options: FeatureFlagProcessorOptions;
  sandbox: sino.SinonSandbox;
  feature: Feature;
  archivedFeatureIds: string[];
  clearIntervalSpy: sino.SinonSpy;
}>;

const minimalFeature = (id: string): Feature => ({
  id,
  name: '',
  description: '',
  enabled: false,
  deleted: false,
  ttl: 0,
  version: 0,
  createdAt: '0',
  updatedAt: '0',
  variationType: 'STRING',
  offVariation: '',
  tags: [],
  maintainer: '',
  archived: false,
  samplingSeed: '',
  variations: [],
  targets: [],
  rules: [],
});

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const apiClient = new MockAPIClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const featureFlagCache = NewFeatureCache({ cache: cache, ttl: FEATURE_FLAG_CACHE_TTL });
  const sourceId = SourceId.NODE_SERVER;
  const sdkVersion = '5.3.1';
  const options = {
    cache,
    featureFlagCache,
    pollingInterval: 1000,
    apiClient,
    eventEmitter,
    featureTag: 'nodejs',
    clock,
    sourceId,
    sdkVersion,
  };
  const processor = new DefaultFeatureFlagProcessor(options);
  t.context = {
    featureTag: 'nodejs',
    processor,
    options,
    sandbox,
    feature: minimalFeature('feature-flag-id-2'),
    archivedFeatureIds: ['feature-flags-id-3', 'feature-flags-id-4'],
    clearIntervalSpy: sandbox.spy(global, 'clearInterval'),
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test.serial('start success', async (t) => {
  const { featureTag, processor, options, sandbox, feature, clearIntervalSpy } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response: GetFeatureFlagsResponse = {
    featureFlagsId: 'feature-flags-id-2',
    requestedAt: '20',
    forceUpdate: true,
    features: [feature],
    archivedFeatureFlagIds: [],
  };
  const responseSize = 512;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 10, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL);
  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(toProtoFeature(feature));

  await processor.start();
  const scheduleID = processor.getPollingScheduleID();
  t.truthy(scheduleID);
  await processor.stop();
  t.falsy(processor.getPollingScheduleID());
  t.true(clearIntervalSpy.calledOnceWithExactly(scheduleID));
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockFeatureFlagCache.verify();
  t.pass();
});

test.serial('start fail', async (t) => {
  const { featureTag, processor, options, sandbox, clearIntervalSpy } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(null);
  const error = new Error('Internal error');
  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, '', 0, options.sourceId, options.sdkVersion)
    .rejects(error);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: error, apiId: ApiId.GET_FEATURE_FLAGS });

  const actualError = await t.throwsAsync(async () => {
    await processor.start();
  });
  t.is(actualError, error);
  const scheduleID = processor.getPollingScheduleID();
  t.truthy(scheduleID);
  await processor.stop();
  t.falsy(processor.getPollingScheduleID());
  t.true(clearIntervalSpy.calledOnceWithExactly(scheduleID));
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});
