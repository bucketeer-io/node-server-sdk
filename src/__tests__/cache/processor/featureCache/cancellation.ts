import anyTest, { TestFn } from 'ava';
import sino from 'sinon';
import {
  DefaultFeatureFlagProcessor,
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
  FEATURE_FLAG_REQUESTED_AT,
  FeatureFlagProcessorOptions,
} from '../../../../cache/processor/featureFlagCacheProcessor';
import { NewFeatureCache } from '../../../../cache/features';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockAPIClient } from '../../../mocks/api';
import { SourceId } from '../../../../objects/sourceId';
import { ApiId } from '../../../../objects/apiId';
import { AbortError, DeadlineExceededError } from '../../../../objects/errors';

const test = anyTest as TestFn<{
  processor: DefaultFeatureFlagProcessor;
  options: FeatureFlagProcessorOptions;
  sandbox: sino.SinonSandbox;
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const apiClient = new MockAPIClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const options: FeatureFlagProcessorOptions = {
    cache,
    featureFlagCache: NewFeatureCache({ cache, ttl: FEATURE_FLAG_CACHE_TTL }),
    pollingInterval: 5_000,
    apiClient,
    eventEmitter,
    featureTag: 'nodejs',
    clock,
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '1.0.0',
  };
  t.context = {
    processor: new DefaultFeatureFlagProcessor(options),
    options,
    sandbox,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test.serial('stop() aborts an in-flight getFeatureFlags call', async (t) => {
  const { processor, options, sandbox } = t.context;

  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(0);

  const mockEventEmitter = sandbox.mock(options.eventEmitter);
  mockEventEmitter.expects('emit').once().withArgs('error', sino.match.any);

  // Signal that the stub has started so we know when to call stop()
  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => {
    resolveInFlight = resolve;
  });

  // Simulate a stalled network call that never resolves on its own.
  // The abort listener is required to convert the signal's abort event into a
  // promise rejection — aborting a signal does not automatically reject awaiting promises.
  sandbox.stub(options.apiClient, 'getFeatureFlags').callsFake(
    (_tag, _id, _requestedAt, _sourceId, _sdkVersion, signal) => {
      resolveInFlight();
      return new Promise<never>((_, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    },
  );

  // start() will hang until the signal is aborted
  const startPromise = processor.start();

  // Wait until the stub is actually in-flight before stopping
  await inFlightStarted;
  await processor.stop();

  // start() should reject because the abort propagates through getFeatureFlags → start().
  // DOMException (the default abort reason) is not instanceof Error in Node.js, so we cannot
  // use t.throwsAsync here. Verify rejection manually instead.
  const startError = await startPromise.then(() => null, (e) => e);
  t.truthy(startError, 'expected start() to reject');
  t.falsy(processor.getPollingScheduleID(), 'no schedule should be created after stop()');

  mockCache.verify();
  mockEventEmitter.verify();
  t.pass();
});

test.serial('start() creates a polling schedule after stop() and restart', async (t) => {
  const { processor, options, sandbox } = t.context;

  // Absorb the error event emitted when the first start() is aborted
  options.eventEmitter.on('error', () => {});

  sandbox.stub(options.cache, 'get').resolves('');
  sandbox.stub(options.cache, 'put').resolves();

  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => { resolveInFlight = resolve; });

  const apiStub = sandbox.stub(options.apiClient, 'getFeatureFlags');
  // Simulate a stalled network call that never resolves on its own.
  // The abort listener is required to convert the signal's abort event into a
  // promise rejection — aborting a signal does not automatically reject awaiting promises.
  apiStub.onFirstCall().callsFake((_tag, _id, _requestedAt, _sourceId, _sdkVersion, signal) => {
    resolveInFlight();
    return new Promise<never>((_, reject) => {
      signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
    });
  });
  apiStub.onSecondCall().resolves([
    { featureFlagsId: '', requestedAt: '0', forceUpdate: false, features: [], archivedFeatureFlagIds: [] },
    0,
  ]);

  const firstStart = processor.start();
  await inFlightStarted;
  await processor.stop();
  await firstStart.catch(() => {});

  t.falsy(processor.getPollingScheduleID(), 'no schedule after stop()');

  await processor.start();
  t.truthy(processor.getPollingScheduleID(), 'schedule should be created after restart');

  await processor.stop();
  t.pass();
});

test.serial('runUpdateCache(): stop() abort is silently dropped', async (t) => {
  const { processor, options, sandbox } = t.context;

  sandbox.stub(options.cache, 'get').resolves('');

  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => { resolveInFlight = resolve; });

  // Simulate a stalled network call that never resolves on its own.
  // The abort listener is required to convert the signal's abort event into a
  // promise rejection — aborting a signal does not automatically reject awaiting promises.
  sandbox.stub(options.apiClient, 'getFeatureFlags').callsFake(
    (_tag, _id, _requestedAt, _sourceId, _sdkVersion, signal) => {
      resolveInFlight();
      return new Promise<never>((_, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    },
  );

  const mockEventEmitter = sandbox.mock(options.eventEmitter);
  mockEventEmitter.expects('emit').withArgs('error', sino.match.any).never();

  const updatePromise = processor.runUpdateCache();
  await inFlightStarted;
  await processor.stop();
  await updatePromise;

  mockEventEmitter.verify();
  t.pass();
});

test.serial('runUpdateCache(): poll abort emits an error metric', async (t) => {
  const { options, sandbox } = t.context;

  const shortInterval = 50;
  const processor = new DefaultFeatureFlagProcessor({ ...options, pollingInterval: shortInterval });

  sandbox.stub(options.cache, 'get').resolves('');

  const mockEventEmitter = sandbox.mock(options.eventEmitter);
  mockEventEmitter.expects('emit').once().withArgs(
    'error',
    sino.match({ error: sino.match.instanceOf(DeadlineExceededError), apiId: ApiId.GET_FEATURE_FLAGS }),
  );

  // Simulate a stalled network call that never resolves on its own.
  // The abort listener is required to convert the signal's abort event into a
  // promise rejection — aborting a signal does not automatically reject awaiting promises.
  sandbox.stub(options.apiClient, 'getFeatureFlags').callsFake(
    (_tag, _id, _requestedAt, _sourceId, _sdkVersion, signal) => {
      return new Promise<never>((_, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    },
  );

  const updatePromise = processor.runUpdateCache();
  await new Promise((resolve) => setTimeout(resolve, shortInterval + 20));
  await updatePromise;

  mockEventEmitter.verify();
  t.pass();
});

test.serial('stop() abort reason is SDK AbortError, not DeadlineExceededError', async (t) => {
  const { processor, options, sandbox } = t.context;

  options.eventEmitter.on('error', () => {});
  sandbox.stub(options.cache, 'get').resolves('');

  let capturedReason: unknown;
  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => { resolveInFlight = resolve; });

  sandbox.stub(options.apiClient, 'getFeatureFlags').callsFake(
    (_tag, _id, _requestedAt, _sourceId, _sdkVersion, signal) => {
      resolveInFlight();
      return new Promise<never>((_, reject) => {
        signal?.addEventListener('abort', () => {
          capturedReason = signal.reason;
          reject(signal.reason);
        }, { once: true });
      });
    },
  );

  const startPromise = processor.start();
  await inFlightStarted;
  await processor.stop();
  await startPromise.catch(() => {});

  t.true(capturedReason instanceof AbortError);
  t.false(capturedReason instanceof DeadlineExceededError);
});

test.serial('polling interval deadline aborts a hanging getFeatureFlags call', async (t) => {
  const { options, sandbox } = t.context;

  // Short polling interval so the PollController timeout fires quickly
  const shortInterval = 50;
  const processor = new DefaultFeatureFlagProcessor({ ...options, pollingInterval: shortInterval });

  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).atLeast(1).returns('');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).atLeast(1).returns(0);

  let errorEmitted = false;
  options.eventEmitter.on('error', ({ apiId }) => {
    if (apiId === ApiId.GET_FEATURE_FLAGS) errorEmitted = true;
  });

  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => {
    resolveInFlight = resolve;
  });

  // Simulate a stalled network call that never resolves on its own.
  // The abort listener is required to convert the signal's abort event into a
  // promise rejection — aborting a signal does not automatically reject awaiting promises.
  sandbox.stub(options.apiClient, 'getFeatureFlags').callsFake(
    (_tag, _id, _requestedAt, _sourceId, _sdkVersion, signal) => {
      resolveInFlight();
      return new Promise<never>((_, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    },
  );

  // start() will fail because the stub never resolves
  processor.start().catch(() => {});

  // Wait until the stub is in-flight, then wait for the polling interval to fire
  await inFlightStarted;
  await new Promise((resolve) => setTimeout(resolve, shortInterval + 20));

  await processor.stop();

  t.true(errorEmitted, 'expected an error event to be emitted when poll deadline fires');
  t.pass();
});
