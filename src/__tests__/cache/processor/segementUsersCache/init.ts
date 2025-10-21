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
  clearIntervalSpy: sino.SinonSpy;
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const grpc = new MockGRPCClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const segmentUsersCache = NewSegmentUsersCache({ cache: cache, ttl: SEGEMENT_USERS_CACHE_TTL });
  const sourceId = SourceId.OPEN_FEATURE_NODE;
  const sdkVersion = '10.1.1';
  const options = {
    cache: cache,
    segmentUsersCache: segmentUsersCache,
    pollingInterval: 1000,
    grpc: grpc,
    eventEmitter: eventEmitter,
    clock: clock,
    sourceId: sourceId,
    sdkVersion: sdkVersion,
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
    clearIntervalSpy: sandbox.spy(global, 'clearInterval'),
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test.serial('start success', async (t) => {
  const { processor, options, sandbox, singleSegementUser, clearIntervalSpy } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockSegmentUsersCache = sandbox.mock(options.segmentUsersCache);

  mockSegmentUsersCache.expects('getIds').resolves(['segment-id']);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const response = new GetSegmentUsersResponse();
  response.setSegmentUsersList([singleSegementUser]);
  response.setRequestedAt(20);
  response.setForceUpdate(true);
  response.setDeletedSegmentIdsList([]);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getSegmentUsers')
    .once()
    .withArgs({
      segmentIdsList: ['segment-id'],
      requestedAt: 10,
      sourceId: options.sourceId,
      sdkVersion: options.sdkVersion,
    })
    .resolves(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs(
    'pushLatencyMetricsEvent',
    {
      latency: sino.match.any,
      apiId: ApiId.GET_SEGMENT_USERS,
    },
  );

  mockProcessorEventsEmitter.expects('emit').once().withArgs(
    'pushSizeMetricsEvent',
    {
      size: responseSize,
      apiId: ApiId.GET_SEGMENT_USERS,
    },
  );

  mockCache.expects('put').withArgs(
    SEGEMENT_USERS_REQUESTED_AT,
    20,
    SEGEMENT_USERS_CACHE_TTL,
  );

  mockSegmentUsersCache.expects('deleteAll').once();
  mockSegmentUsersCache.expects('put').withArgs(singleSegementUser);

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
  mockSegmentUsersCache.verify();

  t.pass();
});

test.serial('start fail', async (t) => {
  const { processor, options, sandbox, clearIntervalSpy } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockSegmentUsersCache = sandbox.mock(options.segmentUsersCache);

  mockSegmentUsersCache.expects('getIds').resolves(['segment-id']);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);
  
  const error = new Error('Internal error');
  mockGRPCClient
    .expects('getSegmentUsers')
    .once()
    .withArgs({
      segmentIdsList: ['segment-id'],
      requestedAt: 10,
      sourceId: options.sourceId,
      sdkVersion: options.sdkVersion,
    })
    .rejects(error);
  
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: error, apiId: ApiId.GET_SEGMENT_USERS });

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
  mockSegmentUsersCache.verify();
  t.pass();
});
