import anyTest, { TestFn } from 'ava';
import sino from 'sinon';

import { GetSegmentUsersResponse, SegmentUser, SegmentUsers } from '@bucketeer/evaluation';

import {
  DefaultSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SEGEMENT_USERS_REQUESTED_AT,
  SegementUsersCacheProcessorOptions,
} from '../../../../cache/processor/segmentUsersCacheProcessor';
import { MockCache } from '../../../mocks/cache';
import { MockGRPCClient } from '../../../mocks/gprc';

import { Clock } from '../../../../utils/clock';
import {
  NewSegmentUsersCache,
} from '../../../../cache/segmentUsers';
import { ApiId } from '../../../../objects/apiId';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';

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
  const grpc = new MockGRPCClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const segmentUsersCache = NewSegmentUsersCache({ cache: cache, ttl: SEGEMENT_USERS_CACHE_TTL });
  const sourceId = SourceId.OPEN_FEATURE_NODE;
  const options = {
    cache: cache,
    segmentUsersCache: segmentUsersCache,
    pollingInterval: 1000,
    grpc: grpc,
    eventEmitter: eventEmitter,
    clock: clock,
    sourceId: sourceId,
  } satisfies SegementUsersCacheProcessorOptions;

  const singleSegementUsers = new SegmentUsers();
  singleSegementUsers.setSegmentId('segment-id');
  const segementUser = new SegmentUser();
  segementUser.setId('user-id');
  singleSegementUsers.getUsersList().push(segementUser);
  singleSegementUsers.setUpdatedAt(20);

  const deletedSegmentIDs = ['segment-id-3', 'segment-id-4'];
  const processor = new DefaultSegementUserCacheProcessor(options);
  t.context = {
    processor: processor,
    options: options,
    sandbox: sandbox,
    singleSegementUser: singleSegementUsers,
    deletedSegmentIDs: deletedSegmentIDs,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test('err: failed while getting segment IDs', async (t) => {
  const { processor, sandbox, options } = t.context;
  const internalErr = new Error('internal error');

  const mockSegementUsersCache = sandbox.mock(options.segmentUsersCache);
  mockSegementUsersCache.expects('getIds').rejects(internalErr);
 
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter.expects('emit').once().withArgs('error', {
    error: internalErr,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

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
  mockProcessorEventsEmitter.expects('emit').once().withArgs('error', {
    error: internalErr,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

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

  const response = new GetSegmentUsersResponse();
  response.setSegmentUsersList([singleSegementUser]);
  response.setRequestedAt(20);
  response.setForceUpdate(true);
  response.setDeletedSegmentIdsList([]);

  const mockGRPCClient = sandbox.mock(options.grpc);
  mockGRPCClient.expects('getSegmentUsers').withArgs({
    segmentIdsList: ['segment-id'],
    requestedAt: 10,
    sourceId: options.sourceId,
  }).resolves(response);
  
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  mockSegementUsersCache.expects('deleteAll').resolves();
  mockSegementUsersCache.expects('put').withArgs(singleSegementUser).resolves();

  mockCache.expects('put').withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL).throws(internalErr);
  mockProcessorEventsEmitter.expects('emit').withArgs('error', {
    error: internalErr,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  try {
    await processor.runUpdateCache();
  } catch (err) {
    t.fail('should not throw an error');
  }
  mockGRPCClient.verify();
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

  const response = new GetSegmentUsersResponse();
  response.setSegmentUsersList([singleSegementUser]);
  response.setRequestedAt(20);
  response.setForceUpdate(false);
  response.setDeletedSegmentIdsList([]);

  const mockGRPCClient = sandbox.mock(options.grpc);
  mockGRPCClient.expects('getSegmentUsers').withArgs({
    segmentIdsList: ['segment-id'],
    requestedAt: 10,
    sourceId: options.sourceId,
  }).resolves(response);
  
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').withArgs(singleSegementUser).resolves();

  mockCache.expects('put').withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL).throws(internalErr);
  mockProcessorEventsEmitter.expects('emit').withArgs('error', {
    error: internalErr,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  try {
    await processor.runUpdateCache();
  } catch (err) {
    t.fail('should not throw an error');
  }
  mockGRPCClient.verify();
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

  const response = new GetSegmentUsersResponse();
  response.setSegmentUsersList([]);
  response.setRequestedAt(20);
  response.setForceUpdate(false);
  response.setDeletedSegmentIdsList([]);

  const mockGRPCClient = sandbox.mock(options.grpc);
  mockGRPCClient.expects('getSegmentUsers').withArgs({
    segmentIdsList: [],
    requestedAt: 10,
    sourceId: options.sourceId,
  }).resolves(response);
  
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').never();

  mockCache.expects('put').withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL).resolves();

  await processor.runUpdateCache();
  mockGRPCClient.verify();
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

  const response = new GetSegmentUsersResponse();
  response.setSegmentUsersList([singleSegementUser]);
  response.setRequestedAt(20);
  response.setForceUpdate(false);
  response.setDeletedSegmentIdsList([]);

  const mockGRPCClient = sandbox.mock(options.grpc);
  mockGRPCClient.expects('getSegmentUsers').withArgs({
    segmentIdsList: ['segment-id'],
    requestedAt: 0,
    sourceId: options.sourceId,
  }).resolves(response);
  
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').withArgs(singleSegementUser).resolves();

  mockCache.expects('put').withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL).resolves();

  await processor.runUpdateCache();
  mockGRPCClient.verify();
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

  const response = new GetSegmentUsersResponse();
  response.setSegmentUsersList([singleSegementUser]);
  response.setRequestedAt(20);
  response.setForceUpdate(true);
  response.setDeletedSegmentIdsList([]);

  const mockGRPCClient = sandbox.mock(options.grpc);
  mockGRPCClient.expects('getSegmentUsers').withArgs({
    segmentIdsList: ['segment-id'],
    requestedAt: 10,
    sourceId: options.sourceId,
  }).resolves(response);
  
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  mockSegementUsersCache.expects('deleteAll').resolves();
  mockSegementUsersCache.expects('put').withArgs(singleSegementUser).resolves();

  mockCache.expects('put').withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL).resolves();

  await processor.runUpdateCache();
  mockGRPCClient.verify();
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

  const response = new GetSegmentUsersResponse();
  response.setSegmentUsersList([singleSegementUser]);
  response.setRequestedAt(20);
  response.setForceUpdate(false);
  response.setDeletedSegmentIdsList([]);

  const mockGRPCClient = sandbox.mock(options.grpc);
  mockGRPCClient.expects('getSegmentUsers').withArgs({
    segmentIdsList: ['segment-id'],
    requestedAt: 10,
    sourceId: options.sourceId,
  }).resolves(response);
  
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_SEGMENT_USERS,
  });

  mockSegementUsersCache.expects('deleteAll').never();
  mockSegementUsersCache.expects('put').withArgs(singleSegementUser).resolves();

  mockCache.expects('put').withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL).resolves();

  await processor.runUpdateCache();
  mockGRPCClient.verify();
  mockSegementUsersCache.verify();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});