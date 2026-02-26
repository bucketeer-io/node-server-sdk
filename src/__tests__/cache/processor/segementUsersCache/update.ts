import anyTest, { TestFn } from 'ava';
import sino from 'sinon';
import { GetSegmentUsersResponse } from '../../../../objects/response';
import { SegmentUsers } from '../../../../objects/segment';
import {
  DefaultSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SEGEMENT_USERS_REQUESTED_AT,
  SegementUsersCacheProcessorOptions,
} from '../../../../cache/processor/segmentUsersCacheProcessor';
import { MockCache } from '../../../mocks/cache';
import { MockAPIClient } from '../../../mocks/api';
import { Clock } from '../../../../utils/clock';
import { NewSegmentUsersCache } from '../../../../cache/segmentUsers';
import { ApiId } from '../../../../objects/apiId';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';
import { toProtoSegmentUsers } from '../../../../evaluator/converter';

const test = anyTest as TestFn<{
  processor: DefaultSegementUserCacheProcessor;
  options: SegementUsersCacheProcessorOptions;
  sandbox: sino.SinonSandbox;
  singleSegementUser: SegmentUsers;
  deletedSegmentIDs: string[];
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const apiClient = new MockAPIClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const segmentUsersCache = NewSegmentUsersCache({ cache: cache, ttl: SEGEMENT_USERS_CACHE_TTL });
  const sourceId = SourceId.OPEN_FEATURE_NODE;
  const sdkVersion = '10.1.1';
  const options = {
    cache,
    segmentUsersCache,
    pollingInterval: 1000,
    apiClient,
    eventEmitter,
    clock,
    sourceId,
    sdkVersion,
  } satisfies SegementUsersCacheProcessorOptions;

  const singleSegementUsers: SegmentUsers = {
    segmentId: 'segment-id',
    updatedAt: '20',
    users: [
      {
        id: 'user-id',
        segmentId: 'segment-id',
        userId: 'user-id',
        state: 'INCLUDED',
        deleted: false,
      },
    ],
  };

  const deletedSegmentIDs = ['segment-id-3', 'segment-id-4'];
  const processor = new DefaultSegementUserCacheProcessor(options);
  t.context = {
    processor,
    options,
    sandbox,
    singleSegementUser: singleSegementUsers,
    deletedSegmentIDs,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

function buildSegmentResponse(
  segmentUsers: SegmentUsers[],
  requestedAt: string,
  forceUpdate: boolean,
  deletedSegmentIds: string[],
): GetSegmentUsersResponse {
  return { segmentUsers, requestedAt, forceUpdate, deletedSegmentIds };
}

test('err: failed while getting segment IDs', async (t) => {
  const { processor, sandbox, options } = t.context;
  const internalErr = new Error('internal error');
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').rejects(internalErr);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalErr, apiId: ApiId.GET_SEGMENT_USERS });
  await processor.runUpdateCache();
  mockProcessorEventsEmitter.verify();
  mockSegementUsersCache.verify();
  t.pass();
});

test('err: failed while getting requestedAt', async (t) => {
  const { processor, sandbox, options } = t.context;
  const internalErr = new Error('internal error');
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').resolves([]);
  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).rejects(internalErr);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalErr, apiId: ApiId.GET_SEGMENT_USERS });
  await processor.runUpdateCache();
  mockProcessorEventsEmitter.verify();
  mockSegementUsersCache.verify();
  t.pass();
});

test('err: failed while putting requestedAt, and the forceUpdate is true', async (t) => {
  const { processor, sandbox, options, singleSegementUser } = t.context;
  const internalErr = new Error('internal error');
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').resolves(['segment-id']);
  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const response = buildSegmentResponse([singleSegementUser], '20', true, []);
  const responseSize = 256;
  const mockAPIClient = sandbox.mock(options.apiClient);
  mockAPIClient
    .expects('getSegmentUsers')
    .withArgs(['segment-id'], 10, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_SEGMENT_USERS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  mockSegementUsersCache.expects('deleteAll').resolves();
  mockSegementUsersCache.expects('put').withArgs(toProtoSegmentUsers(singleSegementUser)).resolves();
  mockCache
    .expects('put')
    .withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL)
    .throws(internalErr);
  mockProcessorEventsEmitter
    .expects('emit')
    .withArgs('error', { error: internalErr, apiId: ApiId.GET_SEGMENT_USERS });

  await processor.runUpdateCache();
  mockAPIClient.verify();
  mockSegementUsersCache.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('err: failed while putting requestedAt, and the forceUpdate is false', async (t) => {
  const { processor, sandbox, options, singleSegementUser } = t.context;
  const internalErr = new Error('internal error');
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').resolves(['segment-id']);
  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const response = buildSegmentResponse([singleSegementUser], '20', false, []);
  const responseSize = 256;
  const mockAPIClient = sandbox.mock(options.apiClient);
  mockAPIClient
    .expects('getSegmentUsers')
    .withArgs(['segment-id'], 10, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_SEGMENT_USERS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').withArgs(toProtoSegmentUsers(singleSegementUser)).resolves();
  mockCache
    .expects('put')
    .withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL)
    .throws(internalErr);
  mockProcessorEventsEmitter
    .expects('emit')
    .withArgs('error', { error: internalErr, apiId: ApiId.GET_SEGMENT_USERS });

  await processor.runUpdateCache();
  mockAPIClient.verify();
  mockSegementUsersCache.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('success: get segment IDs not found', async (t) => {
  const { processor, sandbox, options } = t.context;
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').resolves([]);
  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const response = buildSegmentResponse([], '20', false, []);
  const responseSize = 0;
  const mockAPIClient = sandbox.mock(options.apiClient);
  mockAPIClient
    .expects('getSegmentUsers')
    .withArgs([], 10, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_SEGMENT_USERS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').never();
  mockCache
    .expects('put')
    .withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL)
    .resolves();

  await processor.runUpdateCache();
  mockAPIClient.verify();
  mockSegementUsersCache.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('success: requestedAt not found', async (t) => {
  const { processor, sandbox, options, singleSegementUser } = t.context;
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').resolves(['segment-id']);
  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(null);

  const response = buildSegmentResponse([singleSegementUser], '20', false, []);
  const responseSize = 256;
  const mockAPIClient = sandbox.mock(options.apiClient);
  mockAPIClient
    .expects('getSegmentUsers')
    .withArgs(['segment-id'], 0, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_SEGMENT_USERS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').withArgs(toProtoSegmentUsers(singleSegementUser)).resolves();
  mockCache
    .expects('put')
    .withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL)
    .resolves();

  await processor.runUpdateCache();
  mockAPIClient.verify();
  mockSegementUsersCache.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('success: force update is true', async (t) => {
  const { processor, sandbox, options, singleSegementUser } = t.context;
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').resolves(['segment-id']);
  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const response = buildSegmentResponse([singleSegementUser], '20', true, []);
  const responseSize = 256;
  const mockAPIClient = sandbox.mock(options.apiClient);
  mockAPIClient
    .expects('getSegmentUsers')
    .withArgs(['segment-id'], 10, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_SEGMENT_USERS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  mockSegementUsersCache.expects('deleteAll').resolves();
  mockSegementUsersCache.expects('put').withArgs(toProtoSegmentUsers(singleSegementUser)).resolves();
  mockCache
    .expects('put')
    .withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL)
    .resolves();

  await processor.runUpdateCache();
  mockAPIClient.verify();
  mockSegementUsersCache.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('success: force update is false', async (t) => {
  const { processor, sandbox, options, singleSegementUser } = t.context;
  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').resolves(['segment-id']);
  const mockCache = sandbox.mock(options.cache);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const response = buildSegmentResponse([singleSegementUser], '20', false, []);
  const responseSize = 256;
  const mockAPIClient = sandbox.mock(options.apiClient);
  mockAPIClient
    .expects('getSegmentUsers')
    .withArgs(['segment-id'], 10, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_SEGMENT_USERS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').withArgs(toProtoSegmentUsers(singleSegementUser)).resolves();
  mockCache
    .expects('put')
    .withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL)
    .resolves();

  await processor.runUpdateCache();
  mockAPIClient.verify();
  mockSegementUsersCache.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});
