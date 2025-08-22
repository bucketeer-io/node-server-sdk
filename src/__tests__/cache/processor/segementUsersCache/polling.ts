import test from 'ava';
import sino from 'sinon';

import { GetSegmentUsersResponse, SegmentUsers } from '@bucketeer/evaluation';

import {
  NewSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SEGEMENT_USERS_REQUESTED_AT,
} from '../../../../cache/processor/segmentUsersCacheProcessor';
import { MockCache } from '../../../mocks/cache';
import { MockGRPCClient } from '../../../mocks/gprc';

import { Clock } from '../../../../utils/clock';
import {
  NewSegmentUsersCache,
  SEGMENT_USERS_NAME_SPACE as SEGMENT_USERS_CACHE_NAME_SPACE,
} from '../../../../cache/segmentUsers';
import { ApiId } from '../../../../objects/apiId';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';

test('polling cache', async (t) => {
  const cache = new MockCache();
  const grpc = new MockGRPCClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const featureTag = 'featureTag';
  const sourceId = SourceId.OPEN_FEATURE_NODE;

  const options = {
    cache,
    segmentUsersCache: NewSegmentUsersCache({ cache: cache, ttl: SEGEMENT_USERS_CACHE_TTL }),
    pollingInterval: 1000,
    grpc,
    eventEmitter,
    featureTag: featureTag,
    clock,
    sourceId: sourceId,
  };

  const mockClock = sino.mock(clock);
  const mockClockExpected = mockClock.expects('getTime').atLeast(2);
  mockClockExpected.onFirstCall().returns(0);
  mockClockExpected.onSecondCall().returns(2210);
  mockClockExpected.onThirdCall().returns(4200);
  mockClockExpected.onCall(3).returns(7000);

  const mockCache = sino.mock(cache);
  const mockCacheGetAllExpect = mockCache
    .expects('scan')
    .withArgs(SEGMENT_USERS_CACHE_NAME_SPACE)
    .twice();
  mockCacheGetAllExpect.onFirstCall().resolves([]);
  mockCacheGetAllExpect.resolves([]);

  const mockCacheLastUpdatedExpect = mockCache.expects('get').twice();

  mockCacheLastUpdatedExpect.withArgs(SEGEMENT_USERS_REQUESTED_AT).onFirstCall().resolves(null);
  mockCacheLastUpdatedExpect.resolves(1100);

  const segementUser1 = new SegmentUsers();
  segementUser1.setSegmentId('segmentId1');

  const segementUser2 = new SegmentUsers();
  segementUser2.setSegmentId('segmentId2');

  const response = new GetSegmentUsersResponse();
  response.setRequestedAt(1200);
  response.setSegmentUsersList([segementUser1, segementUser2]);
  response.setForceUpdate(false);

  const responseSize = response.serializeBinary().length;

  const mockGRPCClient = sino.mock(grpc);
  //TODO: should verify arguments for twice calls
  const mockGRPCClientGetSegmentUsersExpect = mockGRPCClient.expects('getSegmentUsers').twice();
  mockGRPCClientGetSegmentUsersExpect.onFirstCall().resolves(response);
  mockGRPCClientGetSegmentUsersExpect.resolves(response);
  
  mockCache.expects('put').twice().withArgs(SEGEMENT_USERS_REQUESTED_AT, 1200);
  mockCache
    .expects('put')
    .twice()
    .withArgs(`${SEGMENT_USERS_CACHE_NAME_SPACE}segmentId1`, segementUser1);
  mockCache
    .expects('put')
    .twice()
    .withArgs(`${SEGMENT_USERS_CACHE_NAME_SPACE}segmentId2`, segementUser2);

  const mockEventEmitter = sino.mock(eventEmitter);
  mockEventEmitter.expects('emit').twice().withArgs('pushLatencyMetricsEvent', {
    latency: 2.21,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockEventEmitter.expects('emit').twice().withArgs('pushLatencyMetricsEvent', {
    latency: 2.8,
    apiId: ApiId.GET_SEGMENT_USERS,
  });
  mockEventEmitter
    .expects('emit')
    .twice()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_SEGMENT_USERS });

  const processor = NewSegementUserCacheProcessor(options);

  processor.start();

  await new Promise((resolve) => setTimeout(resolve, 2100));

  processor.stop();

  mockCache.verify();
  mockGRPCClient.verify();
  t.pass();
});
