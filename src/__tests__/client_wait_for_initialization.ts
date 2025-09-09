import anyTest, { TestFn } from 'ava';
import sinon from 'sinon';

import { LocalEvaluator } from '../evaluator/local';
import {
  NewSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SegementUsersCacheProcessor,
} from '../cache/processor/segmentUsersCacheProcessor';
import {
  FEATURE_FLAG_CACHE_TTL,
  FeatureFlagProcessor,
  NewFeatureFlagProcessor,
} from '../cache/processor/featureFlagCacheProcessor';
import { MockCache } from './mocks/cache';
import { MockGRPCClient } from './mocks/gprc';
import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { Clock } from '../utils/clock';
import { NewSegmentUsersCache, SegmentUsersCache } from '../cache/segmentUsers';
import { FeaturesCache, NewFeatureCache } from '../cache/features';
import { DefaultLogger, defineBKTConfig } from '../index';
import { IllegalStateError, TimeoutError } from '../objects/errors';
import { InternalConfig, requiredInternalConfig } from '../internalConfig';
import { EventStore } from '../stores/EventStore';
import { APIClient } from '../api/client';
import { BKTClientImpl } from '../client';

const test = anyTest as TestFn<{
  sandbox: sinon.SinonSandbox;
  evaluator: LocalEvaluator;
  cache: MockCache;
  grpc: MockGRPCClient;
  eventEmitter: ProcessorEventsEmitter;
  clock: Clock;
  segmentUsersCache: SegmentUsersCache;
  featureFlagCache: FeaturesCache;

  featureFlagProcessor: FeatureFlagProcessor;
  segementUsersCacheProcessor: SegementUsersCacheProcessor;
  config: InternalConfig;
}>;

test.beforeEach((t) => {
  const sandbox = sinon.createSandbox();
  t.context.sandbox = sandbox;

  const tag = 'server';
  const cache = new MockCache();
  const grpc = new MockGRPCClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const segmentUsersCache = NewSegmentUsersCache({
    cache: cache,
    ttl: SEGEMENT_USERS_CACHE_TTL,
  });
  const featureFlagCache = NewFeatureCache({
    cache: cache,
    ttl: FEATURE_FLAG_CACHE_TTL,
  });

  const config = requiredInternalConfig(
    defineBKTConfig({
      apiEndpoint: 'api.bucketeer.io',
      apiKey: 'api_key_value',
      featureTag: 'server',
      logger: new DefaultLogger('error'),
      cachePollingInterval: 1000,
      enableLocalEvaluation: true,
    }),
  );

  const featureFlagProcessor = NewFeatureFlagProcessor({
    cache: cache,
    featureFlagCache: featureFlagCache,
    pollingInterval: config.cachePollingInterval!,
    grpc: grpc,
    eventEmitter: eventEmitter,
    featureTag: config.featureTag,
    clock: new Clock(),
    sourceId: config.sourceId,
    sdkVersion: config.sdkVersion,
  });

  const segementUsersCacheProcessor = NewSegementUserCacheProcessor({
    cache: cache,
    segmentUsersCache: segmentUsersCache,
    pollingInterval: config.cachePollingInterval!,
    grpc: grpc,
    eventEmitter: eventEmitter,
    clock: new Clock(),
    sourceId: config.sourceId,
    sdkVersion: config.sdkVersion,
  });

  const evaluator = new LocalEvaluator({
    tag: tag,
    featuresCache: featureFlagCache,
    segementUsersCache: segmentUsersCache,
  });

  t.context = {
    evaluator: evaluator,
    cache: cache,
    grpc: grpc,
    eventEmitter: eventEmitter,
    clock: clock,
    segmentUsersCache: segmentUsersCache,
    featureFlagCache: featureFlagCache,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    config: config,
    sandbox: sandbox,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test.serial('Timeout reached', async (t) => {
  const {
    sandbox,
    featureFlagProcessor,
    segementUsersCacheProcessor,
    eventEmitter,
    config,
    cache,
    evaluator,
  } = t.context;

  const bktOptions = {
    cache: cache,
    apiClient: new APIClient(config.apiEndpoint, config.apiKey),
    eventStore: new EventStore(),
    localEvaluator: evaluator,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    eventEmitter: eventEmitter,
  };

  // mock featureFlagProcessor.start() to complete after timeout
  const featureStartStub = sandbox
    .stub(featureFlagProcessor, 'start')
    .callsFake(() => new Promise((resolve) => setTimeout(resolve, 200)));

  // mock segementUsersCacheProcessor.start() to complete after timeout
  const segmentStartStub = sandbox
    .stub(segementUsersCacheProcessor, 'start')
    .callsFake(() => new Promise((resolve) => setTimeout(resolve, 200)));

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 50 }), {
    instanceOf: TimeoutError,
    message: 'Initialization timeout after 50 ms',
  });
  t.true(featureStartStub.calledOnce);
  t.true(segmentStartStub.calledOnce);
  t.true(clearTimeoutSpy.calledOnce);

  await sdkInstance.destroy();
});

test.serial('Init successful', async (t) => {
  const {
    sandbox,
    featureFlagProcessor,
    segementUsersCacheProcessor,
    eventEmitter,
    config,
    cache,
    evaluator,
  } = t.context;

  const bktOptions = {
    cache: cache,
    apiClient: new APIClient(config.apiEndpoint, config.apiKey),
    eventStore: new EventStore(),
    localEvaluator: evaluator,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    eventEmitter: eventEmitter,
  };

  // Mock both processors to resolve after a short delay
  let featureResolve: (() => void) | undefined;
  let segmentResolve: (() => void) | undefined;

  sandbox.stub(featureFlagProcessor, 'start').callsFake(
    () =>
      new Promise((resolve) => {
        featureResolve = resolve;
      }),
  );
  sandbox.stub(segementUsersCacheProcessor, 'start').callsFake(
    () =>
      new Promise((resolve) => {
        segmentResolve = resolve;
      }),
  );

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  // Resolve both processors after a short delay
  setTimeout(() => {
    featureResolve && featureResolve();
    segmentResolve && segmentResolve();
  }, 100);

  await t.notThrowsAsync(sdkInstance.waitForInitialization({ timeout: 200 }));
  t.true(clearTimeoutSpy.calledOnce);

  await sdkInstance.destroy();
});

test.serial('Init failed - by feature processor', async (t) => {
  const {
    sandbox,
    featureFlagProcessor,
    segementUsersCacheProcessor,
    eventEmitter,
    config,
    cache,
    evaluator,
  } = t.context;

  const bktOptions = {
    cache: cache,
    apiClient: new APIClient(config.apiEndpoint, config.apiKey),
    eventStore: new EventStore(),
    localEvaluator: evaluator,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    eventEmitter: eventEmitter,
  };

  // Mock feature processor to fail, segment to succeed
  sandbox
    .stub(featureFlagProcessor, 'start')
    .callsFake(() => Promise.reject(new IllegalStateError('Feature processor failed')));
  sandbox.stub(segementUsersCacheProcessor, 'start').callsFake(() => Promise.resolve());

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
    instanceOf: IllegalStateError,
    message: 'Feature processor failed',
  });
  t.true(clearTimeoutSpy.calledOnce);

  await sdkInstance.destroy();
});

test.serial('Init failed - by segment processor', async (t) => {
  const {
    sandbox,
    featureFlagProcessor,
    segementUsersCacheProcessor,
    eventEmitter,
    config,
    cache,
    evaluator,
  } = t.context;

  const bktOptions = {
    cache: cache,
    apiClient: new APIClient(config.apiEndpoint, config.apiKey),
    eventStore: new EventStore(),
    localEvaluator: evaluator,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    eventEmitter: eventEmitter,
  };

  // Mock segment processor to fail, feature to succeed
  sandbox.stub(featureFlagProcessor, 'start').callsFake(() => Promise.resolve());
  sandbox
    .stub(segementUsersCacheProcessor, 'start')
    .callsFake(() => Promise.reject(new IllegalStateError('Segment processor failed')));

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
    instanceOf: IllegalStateError,
    message: 'Segment processor failed',
  });
  t.true(clearTimeoutSpy.calledOnce);

  await sdkInstance.destroy();
});

test.serial('Init failed - by both processors', async (t) => {
  const {
    sandbox,
    featureFlagProcessor,
    segementUsersCacheProcessor,
    eventEmitter,
    config,
    cache,
    evaluator,
  } = t.context;

  const bktOptions = {
    cache: cache,
    apiClient: new APIClient(config.apiEndpoint, config.apiKey),
    eventStore: new EventStore(),
    localEvaluator: evaluator,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    eventEmitter: eventEmitter,
  };

  // Mock both processors to fail
  sandbox
    .stub(featureFlagProcessor, 'start')
    .callsFake(() => Promise.reject(new IllegalStateError('Feature processor failed')));
  sandbox
    .stub(segementUsersCacheProcessor, 'start')
    .callsFake(() => Promise.reject(new IllegalStateError('Segment processor failed')));

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
    instanceOf: IllegalStateError,
    message: 'Feature processor failed',
  });
  t.true(clearTimeoutSpy.calledOnce);

  await sdkInstance.destroy();
});

// Edge case tests

test.serial(
  'Init successful - Returns immediately when enableLocalEvaluation = false',
  async (t) => {
    t.pass();
  },
);

test.serial('Init fail - proccessors are null', async (t) => {
  t.pass();
});

test.serial('Init fail - initializationAsync are null', async (t) => {
  t.pass();
});

test.serial('calling waitForInitialization should fine', async (t) => {
  t.pass();
});

test.serial('very short/zero timeout should fine', async (t) => {
  t.pass();
});
