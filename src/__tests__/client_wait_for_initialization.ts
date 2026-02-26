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
import { MockAPIClient } from './mocks/api';
import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { Clock } from '../utils/clock';
import { NewSegmentUsersCache, SegmentUsersCache } from '../cache/segmentUsers';
import { FeaturesCache, NewFeatureCache } from '../cache/features';
import { DefaultLogger, defineBKTConfig } from '../index';
import { ForbiddenError, IllegalStateError, TimeoutError } from '../objects/errors';
import { InternalConfig, requiredInternalConfig } from '../internalConfig';
import { EventStore } from '../stores/EventStore';
import { APIClient } from '../api/client';
import { BKTClientImpl } from '../client';
import { InvalidStatusError } from '../objects/errors';
import { createNodeJSError } from './utils/native_error';

const test = anyTest as TestFn<{
  sandbox: sinon.SinonSandbox;
  evaluator: LocalEvaluator;
  cache: MockCache;
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
  const apiClient = new MockAPIClient();
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
    apiClient: apiClient,
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
    apiClient: apiClient,
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
    .callsFake(() => Promise.reject(new InvalidStatusError('Timeout', 408)));
  sandbox.stub(segementUsersCacheProcessor, 'start').callsFake(() => Promise.resolve());

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
    instanceOf: TimeoutError,
    message: 'Timeout',
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
    .callsFake(() => Promise.reject(new InvalidStatusError('Segment processor failed', 403)));

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
    instanceOf: ForbiddenError,
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
    .callsFake(() => Promise.reject(createNodeJSError('Connection reset by peer', 'ECONNRESET')));
  sandbox
    .stub(segementUsersCacheProcessor, 'start')
    .callsFake(() => Promise.reject(new IllegalStateError('Segment processor failed')));

  const sdkInstance = new BKTClientImpl(config, bktOptions);
  t.truthy(sdkInstance.initializationAsync);

  const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
    instanceOf: TimeoutError,
    message: 'Connection reset by peer',
  });
  t.true(clearTimeoutSpy.calledOnce);

  await sdkInstance.destroy();
});

// Edge case tests

test.serial(
  'Init successful - Returns immediately when enableLocalEvaluation = false',
  async (t) => {
    const {
      sandbox,
      featureFlagProcessor,
      segementUsersCacheProcessor,
      eventEmitter,
      config,
      cache,
      evaluator,
    } = t.context;

    const editConfig = { ...config, enableLocalEvaluation: false };

    const bktOptions = {
      cache: cache,
      apiClient: new APIClient(config.apiEndpoint, config.apiKey),
      eventStore: new EventStore(),
      localEvaluator: evaluator,
      featureFlagProcessor: featureFlagProcessor,
      segementUsersCacheProcessor: segementUsersCacheProcessor,
      eventEmitter: eventEmitter,
    };

    const sdkInstance = new BKTClientImpl(editConfig, bktOptions);
    // initializationAsync should be null as we are not initializing processors
    t.falsy(sdkInstance.initializationAsync);

    const clearTimeoutSpy = sandbox.spy(global, 'clearTimeout');
    const setTimeoutSpy = sandbox.spy(global, 'setTimeout');

    await t.notThrowsAsync(sdkInstance.waitForInitialization({ timeout: 200 }));

    // clearTimeout should not be called as there is no timeout to clear
    t.true(setTimeoutSpy.notCalled);
    t.true(clearTimeoutSpy.notCalled);

    await sdkInstance.destroy();

    t.pass();
  },
);

test.serial('Client with none local evaluation should not have initializationAsync Promises', async (t) => {
  const { eventEmitter, config, cache, evaluator } = t.context;
  const editConfig = { ...config, enableLocalEvaluation: false };
  const bktOptions = {
    cache: cache,
    apiClient: new APIClient(config.apiEndpoint, config.apiKey),
    eventStore: new EventStore(),
    localEvaluator: evaluator,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  };

  const sdkInstance = new BKTClientImpl(editConfig, bktOptions);
  // initializationAsync should be null as we are not initializing processors
  t.falsy(sdkInstance.initializationAsync);
  await sdkInstance.destroy();
  t.pass();
});

test.serial(
  'Init success - calling waitForInitialization mutilple times should fine',
  async (t) => {
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
    // Call again should return immediately
    await t.notThrowsAsync(sdkInstance.waitForInitialization({ timeout: 200 }));
    await t.notThrowsAsync(sdkInstance.waitForInitialization({ timeout: 200 }));
    t.true(clearTimeoutSpy.callCount == 3);

    await sdkInstance.destroy();
  },
);

test.serial(
  'Init fail - calling waitForInitialization after initialized should keep throwing',
  async (t) => {
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

    // Call again should keep throwing the same error
    await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
      instanceOf: IllegalStateError,
      message: 'Feature processor failed',
    });
    await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 100 }), {
      instanceOf: IllegalStateError,
      message: 'Feature processor failed',
    });

    t.true(clearTimeoutSpy.callCount == 3);

    await sdkInstance.destroy();
  },
);

test.serial('very short/zero timeout should fine', async (t) => {
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

  await t.throwsAsync(sdkInstance.waitForInitialization({ timeout: 0 }), {
    instanceOf: TimeoutError,
    message: 'Initialization timeout after 0 ms',
  });
  t.true(clearTimeoutSpy.calledOnce);

  await sdkInstance.destroy();
});
