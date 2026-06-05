import test from 'ava';
import sino from 'sinon';
import { GetSegmentUsersResponse } from '../../../../objects/response';
import { SegmentUsers } from '../../../../objects/segment';
import {
  NewSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SEGEMENT_USERS_REQUESTED_AT,
} from '../../../../cache/processor/segmentUsersCacheProcessor';
import { MockCache } from '../../../mocks/cache';
import { MockAPIClient } from '../../../mocks/api';
import { Clock } from '../../../../utils/clock';
import {
  NewSegmentUsersCache,
  SEGMENT_USERS_NAME_SPACE as SEGMENT_USERS_CACHE_NAME_SPACE,
} from '../../../../cache/segmentUsers';
import { ApiId } from '../../../../objects/apiId';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';
import { toProtoSegmentUsers } from '../../../../cache/processor/converter';

test('polling cache', async (t) => {
  const firstStartMark = BigInt(10);
  const secondStartMark = BigInt(20);
  const thirdStartMark = BigInt(30);

  const cache = new MockCache();
  const apiClient = new MockAPIClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const sourceId = SourceId.OPEN_FEATURE_NODE;
  const sdkVersion = '0.1.0';

  const options = {
    cache,
    segmentUsersCache: NewSegmentUsersCache({ cache: cache, ttl: SEGEMENT_USERS_CACHE_TTL }),
    pollingInterval: 1000,
    apiClient,
    eventEmitter,
    clock,
    sourceId,
    sdkVersion,
  };

  const latencyStartStub = sino.stub(clock, 'latencyStart');
  latencyStartStub.onFirstCall().returns(firstStartMark);
  latencyStartStub.onSecondCall().returns(secondStartMark);
  latencyStartStub.onThirdCall().returns(thirdStartMark);

  const latencySecondsSinceStub = sino.stub(clock, 'latencySecondsSince');
  latencySecondsSinceStub.withArgs(firstStartMark).returns(2.21);
  latencySecondsSinceStub.withArgs(secondStartMark).returns(2.8);
  latencySecondsSinceStub.withArgs(thirdStartMark).returns(1.0);

  const mockCache = sino.mock(cache);
  const mockCacheGetAllExpect = mockCache
    .expects('scan')
    .withArgs(SEGMENT_USERS_CACHE_NAME_SPACE)
    .thrice();
  mockCacheGetAllExpect.onFirstCall().resolves([]);
  mockCacheGetAllExpect.resolves([]);

  const mockCacheLastUpdatedExpect = mockCache.expects('get').thrice();
  mockCacheLastUpdatedExpect.withArgs(SEGEMENT_USERS_REQUESTED_AT).onFirstCall().resolves(null);
  mockCacheLastUpdatedExpect.resolves(1100);

  const segementUser1: SegmentUsers = { segmentId: 'segmentId1', updatedAt: '1200', users: [] };
  const segementUser2: SegmentUsers = { segmentId: 'segmentId2', updatedAt: '1200', users: [] };

  const response: GetSegmentUsersResponse = {
    requestedAt: '1200',
    segmentUsers: [segementUser1, segementUser2],
    forceUpdate: false,
    deletedSegmentIds: [],
  };
  const responseSize = 256;

  const mockAPIClient = sino.mock(apiClient);
  mockAPIClient
    .expects('getSegmentUsers')
    .once()
    .withArgs([], 0, sourceId, sdkVersion, sino.match.instanceOf(AbortSignal))
    .resolves([response, responseSize]);
  mockAPIClient
    .expects('getSegmentUsers')
    .twice()
    .withArgs([], 1100, sourceId, sdkVersion, sino.match.instanceOf(AbortSignal))
    .resolves([response, responseSize]);

  mockCache.expects('put').thrice().withArgs(SEGEMENT_USERS_REQUESTED_AT, 1200, SEGEMENT_USERS_CACHE_TTL);
  mockCache
    .expects('put')
    .thrice()
    .withArgs(`${SEGMENT_USERS_CACHE_NAME_SPACE}segmentId1`, toProtoSegmentUsers(segementUser1), SEGEMENT_USERS_CACHE_TTL);
  mockCache
    .expects('put')
    .thrice()
    .withArgs(`${SEGMENT_USERS_CACHE_NAME_SPACE}segmentId2`, toProtoSegmentUsers(segementUser2), SEGEMENT_USERS_CACHE_TTL);

  const mockEventEmitter = sino.mock(eventEmitter);
  mockEventEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', { latency: 2.21, apiId: ApiId.GET_SEGMENT_USERS });
  mockEventEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', { latency: 2.8, apiId: ApiId.GET_SEGMENT_USERS });
  mockEventEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', { latency: 1.0, apiId: ApiId.GET_SEGMENT_USERS });
  mockEventEmitter
    .expects('emit')
    .thrice()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  const processor = NewSegementUserCacheProcessor(options);

  await processor.start();
  await new Promise((resolve) => setTimeout(resolve, 2100));
  await processor.stop();

  t.true(latencyStartStub.calledThrice);
  t.true(latencySecondsSinceStub.calledThrice);
  mockCache.verify();
  mockEventEmitter.verify();
  mockAPIClient.verify();
  t.pass();
});
