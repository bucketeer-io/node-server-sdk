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

  // start()'s finally block creates a new schedule even when aborting.
  // A second stop() is needed to clear it.
  await processor.stop();

  mockCache.verify();
  mockEventEmitter.verify();
  t.pass();
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
