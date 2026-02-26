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
  clearIntervalSpy: sino.SinonSpy;
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
    clearIntervalSpy: sandbox.spy(global, 'clearInterval'),
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test.serial('start success', async (t) => {
  const { processor, options, sandbox, singleSegementUser, clearIntervalSpy } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockSegmentUsersCache = sandbox.mock(options.segmentUsersCache);

  mockSegmentUsersCache.expects('getIds').resolves(['segment-id']);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const response: GetSegmentUsersResponse = {
    segmentUsers: [singleSegementUser],
    requestedAt: '20',
    forceUpdate: true,
    deletedSegmentIds: [],
  };
  const responseSize = 256;

  mockAPIClient
    .expects('getSegmentUsers')
    .once()
    .withArgs(['segment-id'], 10, options.sourceId, options.sdkVersion)
    .resolves([response, responseSize]);

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

  mockCache.expects('put').withArgs(SEGEMENT_USERS_REQUESTED_AT, 20, SEGEMENT_USERS_CACHE_TTL);
  mockSegmentUsersCache.expects('deleteAll').once();
  mockSegmentUsersCache.expects('put').withArgs(toProtoSegmentUsers(singleSegementUser));

  await processor.start();
  const scheduleID = processor.getPollingScheduleID();
  t.truthy(scheduleID);
  await processor.stop();
  t.falsy(processor.getPollingScheduleID());
  t.true(clearIntervalSpy.calledOnceWithExactly(scheduleID));

  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockSegmentUsersCache.verify();
  t.pass();
});

test.serial('start fail', async (t) => {
  const { processor, options, sandbox, clearIntervalSpy } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockSegmentUsersCache = sandbox.mock(options.segmentUsersCache);

  mockSegmentUsersCache.expects('getIds').resolves(['segment-id']);
  mockCache.expects('get').withArgs(SEGEMENT_USERS_REQUESTED_AT).resolves(10);

  const error = new Error('Internal error');
  mockAPIClient
    .expects('getSegmentUsers')
    .once()
    .withArgs(['segment-id'], 10, options.sourceId, options.sdkVersion)
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
  await processor.stop();
  t.falsy(processor.getPollingScheduleID());
  t.true(clearIntervalSpy.calledOnceWithExactly(scheduleID));

  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockSegmentUsersCache.verify();
  t.pass();
});
