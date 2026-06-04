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

  // start()'s finally block creates a new schedule even when aborting.
  // A second stop() is needed to clear it.
  await processor.stop();

  mockCache.verify();
  mockEventEmitter.verify();
  t.pass();
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
