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
import {
  createFeature,
  Feature,
  GetFeatureFlagsResponse,
} from '@bucketeer/evaluation';

import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockGRPCClient } from '../../../mocks/gprc';
import { SourceId } from '../../../../objects/sourceId';
import { ApiId } from '../../../../objects/apiId';

const test = anyTest as TestFn<{
  featureTag: string;
  processor: DefaultFeatureFlagProcessor;
  options: FeatureFlagProcessorOptions;
  sandbox: sino.SinonSandbox;
  feature: Feature;
  archivedFeatureIds: string[];
  clearIntervalSpy: sino.SinonSpy;
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const grpc = new MockGRPCClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const featureFlagCache = NewFeatureCache({
    cache: cache,
    ttl: FEATURE_FLAG_CACHE_TTL,
  });
  const sourceId = SourceId.NODE_SERVER;
  const sdkVersion = '5.3.1';
  const options = {
    cache: cache,
    featureFlagCache: featureFlagCache,
    pollingInterval: 1000,
    grpc: grpc,
    eventEmitter: eventEmitter,
    featureTag: 'nodejs',
    clock: clock,
    sourceId: sourceId,
    sdkVersion: sdkVersion,
  };
  const singleFeature = createFeature({ id: 'feature-flag-id-2' });
  const archivedFeatureIds = ['feature-flags-id-3', 'feature-flags-id-4'];
  const processor = new DefaultFeatureFlagProcessor(options);
  t.context = {
    featureTag: 'nodejs',
    processor: processor,
    options: options,
    sandbox: sandbox,
    feature: singleFeature,
    archivedFeatureIds: archivedFeatureIds,
    clearIntervalSpy: sandbox.spy(global, 'clearInterval'),
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test.serial('start success', async (t) => {
  const { featureTag, processor, options, sandbox, feature, clearIntervalSpy } =
    t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns(
    'feature-flags-id-1',
  );
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = new GetFeatureFlagsResponse();
  response.setFeatureFlagsId('feature-flags-id-2');
  response.setRequestedAt(20);
  response.setForceUpdate(true);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList([]);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 10,
      sourceId: options.sourceId,
      sdkVersion: options.sdkVersion,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs(
    'pushLatencyMetricsEvent',
    {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    },
  );

  mockProcessorEventsEmitter.expects('emit').once().withArgs(
    'pushSizeMetricsEvent',
    {
      size: responseSize,
      apiId: ApiId.GET_FEATURE_FLAGS,
    },
  );

  mockCache.expects('put').withArgs(
    FEATURE_FLAG_ID,
    'feature-flags-id-2',
    FEATURE_FLAG_CACHE_TTL,
  );
  mockCache.expects('put').withArgs(
    FEATURE_FLAG_REQUESTED_AT,
    20,
    FEATURE_FLAG_CACHE_TTL,
  );

  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(feature);

  await processor.start();
  const scheduleID = processor.getPollingScheduleID();
  t.truthy(scheduleID);
  // try stop
  await processor.stop();
  t.falsy(processor.getPollingScheduleID());
  t.true(clearIntervalSpy.calledOnceWithExactly(scheduleID));

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();

  t.pass();
});

test.serial('start fail', async (t) => {
  const { featureTag, processor, options, sandbox, clearIntervalSpy } =
    t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(null);
  const error = new Error('Internal error');
  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: '',
      requestedAt: 0,
      sourceId: options.sourceId,
      sdkVersion: options.sdkVersion,
    })
    .throws(error);
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
  // try stop
  await processor.stop();
  t.falsy(processor.getPollingScheduleID());
  t.true(clearIntervalSpy.calledOnceWithExactly(scheduleID));

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});
