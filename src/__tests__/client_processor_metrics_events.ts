import test from 'ava';
import sinon from 'sinon';
import {
  createFeature,
  GetFeatureFlagsResponse,
  GetSegmentUsersResponse,
  SegmentUsers,
} from '@bucketeer/evaluation';
import { APIClient } from '../api/client';
import {
  DefaultFeatureFlagProcessor,
  FEATURE_FLAG_CACHE_TTL,
} from '../cache/processor/featureFlagCacheProcessor';
import {
  DefaultSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
} from '../cache/processor/segmentUsersCacheProcessor';
import { NewFeatureCache } from '../cache/features';
import { InMemoryCache } from '../cache/inMemoryCache';
import { NewSegmentUsersCache } from '../cache/segmentUsers';
import { BKTClientImpl } from '../client';
import { NodeEvaluator } from '../evaluator/evaluator';
import { InternalConfig } from '../internalConfig';
import { DefaultLogger } from '../logger';
import { ApiId, NodeApiIds } from '../objects/apiId';
import { Event } from '../objects/event';
import { isMetricsEvent } from '../objects/metricsEvent';
import { SourceId } from '../objects/sourceId';
import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { EventStore } from '../stores/EventStore';
import { Clock } from '../utils/clock';
import { MockGRPCClient } from './mocks/gprc';

type StoredMetricsEvent = {
  apiId: NodeApiIds;
  sourceId: SourceId;
  sdkVersion: string;
  tag: string;
  type: string;
  latencySecond?: number;
  sizeByte?: number;
};

type ProcessorMetricsHarness = {
  client: BKTClientImpl;
  eventStore: EventStore;
  grpc: MockGRPCClient;
  featureFlagProcessor: DefaultFeatureFlagProcessor;
  segementUsersCacheProcessor: DefaultSegementUserCacheProcessor;
  featureFlagProcessorClock: Clock;
  segementUsersProcessorClock: Clock;
};

const createTestConfig = (): InternalConfig => ({
  apiKey: 'test-api-key',
  apiEndpoint: 'test-endpoint.example.com',
  featureTag: 'test-tag',
  eventsFlushInterval: 10000,
  eventsMaxQueueSize: 50,
  appVersion: '1.0.0',
  logger: new DefaultLogger('error'),
  enableLocalEvaluation: true,
  cachePollingInterval: 60000,
  sourceId: SourceId.NODE_SERVER,
  sdkVersion: '1.0.0',
});

const createMockAPIClient = (): APIClient => {
  const mockClient = {
    getEvaluation: () => Promise.reject(new Error('getEvaluation should not be called in this test')),
    registerEvents: (_events: Event[]) => Promise.resolve([{}, 0]),
  } as any;
  return mockClient as APIClient;
};

const getStoredMetricsEvents = (eventStore: EventStore): StoredMetricsEvent[] => {
  const storedMetricsEvents: StoredMetricsEvent[] = [];

  for (const storedEvent of eventStore.getAll()) {
    const metricsEvent = storedEvent.event;
    if (!isMetricsEvent(metricsEvent) || !metricsEvent.event) {
      continue;
    }

    storedMetricsEvents.push({
      apiId: metricsEvent.event.apiId,
      sourceId: metricsEvent.sourceId,
      sdkVersion: metricsEvent.sdkVersion,
      tag: metricsEvent.event.labels.tag,
      type: metricsEvent.event['@type'],
      latencySecond:
        'latencySecond' in metricsEvent.event ? metricsEvent.event.latencySecond : undefined,
      sizeByte: 'sizeByte' in metricsEvent.event ? metricsEvent.event.sizeByte : undefined,
    });
  }

  return storedMetricsEvents;
};

const createProcessorMetricsHarness = (sandbox: sinon.SinonSandbox): ProcessorMetricsHarness => {
  const config = createTestConfig();
  const cache = new InMemoryCache();
  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const grpc = new MockGRPCClient();
  const featureFlagProcessorClock = new Clock();
  const segementUsersProcessorClock = new Clock();
  const featureFlagCache = NewFeatureCache({
    cache,
    ttl: FEATURE_FLAG_CACHE_TTL,
  });
  const segmentUsersCache = NewSegmentUsersCache({
    cache,
    ttl: SEGEMENT_USERS_CACHE_TTL,
  });
  const featureFlagProcessor = new DefaultFeatureFlagProcessor({
    cache,
    featureFlagCache,
    pollingInterval: config.cachePollingInterval!,
    grpc,
    eventEmitter,
    featureTag: config.featureTag,
    clock: featureFlagProcessorClock,
    sourceId: config.sourceId,
    sdkVersion: config.sdkVersion,
  });
  const segementUsersCacheProcessor = new DefaultSegementUserCacheProcessor({
    cache,
    segmentUsersCache,
    pollingInterval: config.cachePollingInterval!,
    grpc,
    eventEmitter,
    clock: segementUsersProcessorClock,
    sourceId: config.sourceId,
    sdkVersion: config.sdkVersion,
  });

  sandbox.stub(featureFlagProcessor, 'start').resolves();
  sandbox.stub(segementUsersCacheProcessor, 'start').resolves();

  const client = new BKTClientImpl(config, {
    apiClient: createMockAPIClient(),
    eventStore,
    localEvaluator: {
      evaluate: async () => null,
    } as unknown as NodeEvaluator,
    featureFlagProcessor,
    segementUsersCacheProcessor,
    eventEmitter,
    clock: new Clock(),
  });

  return {
    client,
    eventStore,
    grpc,
    featureFlagProcessor,
    segementUsersCacheProcessor,
    featureFlagProcessorClock,
    segementUsersProcessorClock,
  };
};

test.serial('feature flag processor: stores emitted latency and size metrics events', async (t) => {
  const sandbox = sinon.createSandbox();
  const harness = createProcessorMetricsHarness(sandbox);
  const startMark = BigInt(100);
  const latencySecond = 0.00000321;
  const feature = createFeature({ id: 'feature-flag-id-1' });
  const response = new GetFeatureFlagsResponse();

  response.setFeatureFlagsId('feature-flags-id-1');
  response.setRequestedAt(123);
  response.setForceUpdate(false);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList([]);

  const responseSize = response.serializeBinary().length;
  const latencyStartStub = sandbox
    .stub(harness.featureFlagProcessorClock, 'latencyStart')
    .returns(startMark);
  const latencySecondsSinceStub = sandbox
    .stub(harness.featureFlagProcessorClock, 'latencySecondsSince')
    .returns(latencySecond);
  const getFeatureFlagsStub = sandbox.stub(harness.grpc, 'getFeatureFlags').resolves(response);

  t.teardown(async () => {
    sandbox.restore();
    await harness.client.destroy();
  });

  t.is(harness.eventStore.size(), 0);

  await harness.featureFlagProcessor.runUpdateCache();

  t.true(latencyStartStub.calledOnce);
  t.true(latencySecondsSinceStub.calledOnceWithExactly(startMark));
  t.deepEqual(getFeatureFlagsStub.firstCall.args[0], {
    requestedAt: 0,
    tag: 'test-tag',
    featureFlagsId: '',
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '1.0.0',
  });
  t.deepEqual(getStoredMetricsEvents(harness.eventStore), [
    {
      apiId: ApiId.GET_FEATURE_FLAGS,
      sourceId: SourceId.NODE_SERVER,
      sdkVersion: '1.0.0',
      tag: 'test-tag',
      type: 'type.googleapis.com/bucketeer.event.client.LatencyMetricsEvent',
      latencySecond: latencySecond,
      sizeByte: undefined,
    },
    {
      apiId: ApiId.GET_FEATURE_FLAGS,
      sourceId: SourceId.NODE_SERVER,
      sdkVersion: '1.0.0',
      tag: 'test-tag',
      type: 'type.googleapis.com/bucketeer.event.client.SizeMetricsEvent',
      latencySecond: undefined,
      sizeByte: responseSize,
    },
  ]);
});

test.serial('segment users processor: stores emitted latency and size metrics events', async (t) => {
  const sandbox = sinon.createSandbox();
  const harness = createProcessorMetricsHarness(sandbox);
  const startMark = BigInt(200);
  const latencySecond = 0.00000456;
  const segmentUsers = new SegmentUsers();
  const response = new GetSegmentUsersResponse();

  segmentUsers.setSegmentId('segment-id-1');
  response.setRequestedAt(456);
  response.setForceUpdate(false);
  response.setSegmentUsersList([segmentUsers]);
  response.setDeletedSegmentIdsList([]);

  const responseSize = response.serializeBinary().length;
  const latencyStartStub = sandbox
    .stub(harness.segementUsersProcessorClock, 'latencyStart')
    .returns(startMark);
  const latencySecondsSinceStub = sandbox
    .stub(harness.segementUsersProcessorClock, 'latencySecondsSince')
    .returns(latencySecond);
  const getSegmentUsersStub = sandbox.stub(harness.grpc, 'getSegmentUsers').resolves(response);

  t.teardown(async () => {
    sandbox.restore();
    await harness.client.destroy();
  });

  t.is(harness.eventStore.size(), 0);

  await harness.segementUsersCacheProcessor.runUpdateCache();

  t.true(latencyStartStub.calledOnce);
  t.true(latencySecondsSinceStub.calledOnceWithExactly(startMark));
  t.deepEqual(getSegmentUsersStub.firstCall.args[0], {
    segmentIdsList: [],
    requestedAt: 0,
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '1.0.0',
  });
  t.deepEqual(getStoredMetricsEvents(harness.eventStore), [
    {
      apiId: ApiId.GET_SEGMENT_USERS,
      sourceId: SourceId.NODE_SERVER,
      sdkVersion: '1.0.0',
      tag: 'test-tag',
      type: 'type.googleapis.com/bucketeer.event.client.LatencyMetricsEvent',
      latencySecond: latencySecond,
      sizeByte: undefined,
    },
    {
      apiId: ApiId.GET_SEGMENT_USERS,
      sourceId: SourceId.NODE_SERVER,
      sdkVersion: '1.0.0',
      tag: 'test-tag',
      type: 'type.googleapis.com/bucketeer.event.client.SizeMetricsEvent',
      latencySecond: undefined,
      sizeByte: responseSize,
    },
  ]);
});