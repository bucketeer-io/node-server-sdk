import anyTest, { TestFn } from 'ava';
import sino from 'sinon';
import {
  DefaultSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SEGEMENT_USERS_REQUESTED_AT,
  SegementUsersCacheProcessorOptions,
} from '../../../../cache/processor/segmentUsersCacheProcessor';
import { NewSegmentUsersCache, SEGMENT_USERS_NAME_SPACE } from '../../../../cache/segmentUsers';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockAPIClient } from '../../../mocks/api';
import { SourceId } from '../../../../objects/sourceId';
import { ApiId } from '../../../../objects/apiId';
import { AbortError, TimeoutError } from '../../../../objects/errors';

const test = anyTest as TestFn<{
  processor: DefaultSegementUserCacheProcessor;
  options: SegementUsersCacheProcessorOptions;
  sandbox: sino.SinonSandbox;
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const apiClient = new MockAPIClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const options: SegementUsersCacheProcessorOptions = {
    cache,
    segmentUsersCache: NewSegmentUsersCache({ cache, ttl: SEGEMENT_USERS_CACHE_TTL }),
    pollingInterval: 5_000,
    apiClient,
    eventEmitter,
    clock,
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '1.0.0',
  };
  t.context = {
    processor: new DefaultSegementUserCacheProcessor(options),
    options,
    sandbox,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test.serial('stop() aborts an in-flight getSegmentUsers call', async (t) => {
  const { processor, options, sandbox } = t.context;

  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('scan').withArgs(SEGMENT_USERS_NAME_SPACE).returns([]);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).returns(0);

  const mockEventEmitter = sandbox.mock(options.eventEmitter);
  mockEventEmitter.expects('emit').once().withArgs('error', sino.match.any);

  // Deferred promise: capture `resolve` so the stub can signal "request started"
  // from outside the constructor. Without this, inFlightStarted would never resolve.
  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => {
    resolveInFlight = resolve;
  });

  sandbox.stub(options.apiClient, 'getSegmentUsers').callsFake(
    (_segmentIds, _requestedAt, _sourceId, _sdkVersion, signal) => {
      resolveInFlight();
      return new Promise<never>((_, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    },
  );

  const startPromise = processor.start();

  await inFlightStarted;   
  await processor.stop();

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
  sandbox.stub(options.cache, 'scan').resolves([]);

  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => { resolveInFlight = resolve; });

  const apiStub = sandbox.stub(options.apiClient, 'getSegmentUsers');
  apiStub.onFirstCall().callsFake((_segmentIds, _requestedAt, _sourceId, _sdkVersion, signal) => {
    resolveInFlight();
    return new Promise<never>((_, reject) => {
      signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
    });
  });
  apiStub.onSecondCall().resolves([
    { requestedAt: '0', forceUpdate: false, segmentUsers: [], deletedSegmentIds: [] },
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
  sandbox.stub(options.cache, 'scan').resolves([]);

  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => { resolveInFlight = resolve; });

  sandbox.stub(options.apiClient, 'getSegmentUsers').callsFake(
    (_segmentIds, _requestedAt, _sourceId, _sdkVersion, signal) => {
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
  const processor = new DefaultSegementUserCacheProcessor({ ...options, pollingInterval: shortInterval });

  sandbox.stub(options.cache, 'get').resolves('');
  sandbox.stub(options.cache, 'scan').resolves([]);

  const mockEventEmitter = sandbox.mock(options.eventEmitter);
  mockEventEmitter.expects('emit').once().withArgs(
    'error',
    sino.match({ error: sino.match.instanceOf(TimeoutError), apiId: ApiId.GET_SEGMENT_USERS }),
  );

  // Simulate a stalled network call that never resolves on its own.
  // The abort listener is required to convert the signal's abort event into a
  // promise rejection — aborting a signal does not automatically reject awaiting promises.
  sandbox.stub(options.apiClient, 'getSegmentUsers').callsFake(
    (_segmentIds, _requestedAt, _sourceId, _sdkVersion, signal) => {
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

test.serial('stop() abort reason is SDK AbortError, not TimeoutError', async (t) => {
  const { processor, options, sandbox } = t.context;

  options.eventEmitter.on('error', () => {});
  sandbox.stub(options.cache, 'get').resolves('');
  sandbox.stub(options.cache, 'scan').resolves([]);

  let capturedReason: unknown;
  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => { resolveInFlight = resolve; });

  sandbox.stub(options.apiClient, 'getSegmentUsers').callsFake(
    (_segmentIds, _requestedAt, _sourceId, _sdkVersion, signal) => {
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
  t.false(capturedReason instanceof TimeoutError);
});

test.serial('polling interval deadline aborts a hanging getSegmentUsers call', async (t) => {
  const { options, sandbox } = t.context;

  const shortInterval = 50;
  const processor = new DefaultSegementUserCacheProcessor({
    ...options,
    pollingInterval: shortInterval,
  });

  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('scan').withArgs(SEGMENT_USERS_NAME_SPACE).atLeast(1).returns([]);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).atLeast(1).returns(0);

  let errorEmitted = false;
  options.eventEmitter.on('error', ({ apiId }) => {
    if (apiId === ApiId.GET_SEGMENT_USERS) errorEmitted = true;
  });

  // Deferred promise: capture `resolve` so the stub can signal "request started"
  // from outside the constructor. Without this, inFlightStarted would never resolve.
  let resolveInFlight!: () => void;
  const inFlightStarted = new Promise<void>((resolve) => {
    resolveInFlight = resolve;
  });

  sandbox.stub(options.apiClient, 'getSegmentUsers').callsFake(
    (_segmentIds, _requestedAt, _sourceId, _sdkVersion, signal) => {
      resolveInFlight();
      return new Promise<never>((_, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    },
  );

  processor.start().catch(() => {});

  await inFlightStarted;
  await new Promise((resolve) => setTimeout(resolve, shortInterval + 20));

  await processor.stop();

  t.true(errorEmitted, 'expected an error event to be emitted when poll deadline fires');
  t.pass();
});
