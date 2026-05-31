import test from 'ava';
import sinon from 'sinon';
import { APIClient } from '../api/client';
import { FeatureFlagProcessor } from '../cache/processor/featureFlagCacheProcessor';
import { SegementUsersCacheProcessor } from '../cache/processor/segmentUsersCacheProcessor';
import { BKTClientImpl } from '../client';
import { NodeEvaluator } from '../evaluator/evaluator';
import { InternalConfig } from '../internalConfig';
import { DefaultLogger } from '../logger';
import { ApiId, NodeApiIds } from '../objects/apiId';
import { Evaluation } from '../objects/evaluation';
import { Event } from '../objects/event';
import { isMetricsEvent } from '../objects/metricsEvent';
import { GetEvaluationResponse } from '../objects/response';
import { SourceId } from '../objects/sourceId';
import { User } from '../objects/user';
import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { EventStore } from '../stores/EventStore';
import { Clock } from '../utils/clock';

type LatencyEvent = {
  latency: number;
  apiId: NodeApiIds;
};

type SizeEvent = {
  size: number;
  apiId: NodeApiIds;
};

type ErrorEvent = {
  error: any;
  apiId: NodeApiIds;
};

const createTestConfig = (enableLocalEvaluation = false): InternalConfig => ({
  apiKey: 'test-api-key',
  apiEndpoint: 'test-endpoint.example.com',
  featureTag: 'test-tag',
  eventsFlushInterval: 10000,
  eventsMaxQueueSize: 50,
  appVersion: '1.0.0',
  logger: new DefaultLogger('error'),
  enableLocalEvaluation,
  cachePollingInterval: 60000,
  sourceId: SourceId.NODE_SERVER,
  sdkVersion: '1.0.0',
  maxRetries: 0,
  retryInitialInterval: 1000,
  retryMaxInterval: 10000,
  retryMultiplier: 2.0,
});

const createMockAPIClient = (options?: {
  getEvaluation?: () => Promise<[GetEvaluationResponse, number]>;
  registerEvents?: (events: Event[]) => Promise<any>;
}): APIClient => {
  const mockClient = {
    getEvaluation:
      options?.getEvaluation ||
      (() => Promise.reject(new Error('getEvaluation should not be called in this test'))),
    registerEvents: options?.registerEvents || (() => Promise.resolve([{}, 0])),
  } as any;
  return mockClient as APIClient;
};

const createNoOpFeatureFlagProcessor = (): FeatureFlagProcessor => ({
  start: async () => undefined,
  stop: async () => undefined,
});

const createNoOpSegementUsersCacheProcessor = (): SegementUsersCacheProcessor => ({
  start: async () => undefined,
  stop: async () => undefined,
});

const observeEmitter = (eventEmitter: ProcessorEventsEmitter) => {
  const latencyEvents: LatencyEvent[] = [];
  const sizeEvents: SizeEvent[] = [];
  const errorEvents: ErrorEvent[] = [];

  eventEmitter.on('pushLatencyMetricsEvent', (event) => {
    latencyEvents.push(event);
  });

  eventEmitter.on('pushSizeMetricsEvent', (event) => {
    sizeEvents.push(event);
  });

  eventEmitter.on('error', (event) => {
    errorEvents.push(event);
  });

  return {
    latencyEvents,
    sizeEvents,
    errorEvents,
  };
};

test('getEvaluation: emits and stores latency and size metrics events for remote evaluation', async (t) => {
  const sandbox = sinon.createSandbox();
  const startMark = BigInt(100);
  const latencySecond = 0.00000123;
  const responseSize = 321;
  const featureId = 'feature-id-remote';
  const user: User = { id: 'user-id-remote', data: {} };
  const evaluation: Evaluation = {
    id: 'evaluation-id-remote',
    featureId,
    featureVersion: 1,
    userId: user.id,
    variationId: 'variation-id-remote',
    variationName: 'variation-name-remote',
    variationValue: 'value-remote',
    reason: { type: 'DEFAULT', ruleId: '' },
  };
  const response: GetEvaluationResponse = {
    evaluation,
  };
  const apiClient = createMockAPIClient({
    getEvaluation: async () => [response, responseSize],
  });
  const eventEmitter = new ProcessorEventsEmitter();
  const observedEvents = observeEmitter(eventEmitter);
  const clock = new Clock();
  const eventStore = new EventStore();
  const latencyStartStub = sandbox.stub(clock, 'latencyStart').returns(startMark);
  const latencySecondsSinceStub = sandbox
    .stub(clock, 'latencySecondsSince')
    .returns(latencySecond);
  const client = new BKTClientImpl(createTestConfig(), {
    apiClient,
    eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter,
    clock,
  });

  t.teardown(async () => {
    sandbox.restore();
    await client.destroy();
  });

  const actual = await client.getEvaluation(user, featureId);

  t.deepEqual(actual, evaluation);
  t.true(latencyStartStub.calledOnce);
  t.true(latencySecondsSinceStub.calledOnceWithExactly(startMark));
  t.deepEqual(observedEvents.latencyEvents, [
    {
      latency: latencySecond,
      apiId: ApiId.GET_EVALUATION,
    },
  ]);
  t.deepEqual(observedEvents.sizeEvents, [
    {
      size: responseSize,
      apiId: ApiId.GET_EVALUATION,
    },
  ]);
  t.deepEqual(observedEvents.errorEvents, []);

  const storedEvents = eventStore.getAll();
  t.is(storedEvents.length, 2);
  t.true(storedEvents.every((storedEvent) => isMetricsEvent(storedEvent.event)));
  t.deepEqual(
    storedEvents.map((storedEvent) => {
      const metricsEvent = storedEvent.event;
      if (!isMetricsEvent(metricsEvent) || !metricsEvent.event) {
        return null;
      }
      return {
        apiId: metricsEvent.event.apiId,
        sourceId: metricsEvent.sourceId,
        sdkVersion: metricsEvent.sdkVersion,
        tag: metricsEvent.event.labels.tag,
        type: metricsEvent.event['@type'],
        latencySecond:
          'latencySecond' in metricsEvent.event ? metricsEvent.event.latencySecond : undefined,
        sizeByte: 'sizeByte' in metricsEvent.event ? metricsEvent.event.sizeByte : undefined,
      };
    }),
    [
      {
        apiId: ApiId.GET_EVALUATION,
        sourceId: SourceId.NODE_SERVER,
        sdkVersion: '1.0.0',
        tag: 'test-tag',
        type: 'type.googleapis.com/bucketeer.event.client.LatencyMetricsEvent',
        latencySecond: latencySecond,
        sizeByte: undefined,
      },
      {
        apiId: ApiId.GET_EVALUATION,
        sourceId: SourceId.NODE_SERVER,
        sdkVersion: '1.0.0',
        tag: 'test-tag',
        type: 'type.googleapis.com/bucketeer.event.client.SizeMetricsEvent',
        latencySecond: undefined,
        sizeByte: responseSize,
      },
    ],
  );
});

test('getEvaluation: emits and stores latency metrics event for local evaluation', async (t) => {
  const sandbox = sinon.createSandbox();
  const startMark = BigInt(200);
  const latencySecond = 0.00000456;
  const featureId = 'feature-id-local';
  const user: User = { id: 'user-id-local', data: {} };
  const evaluation: Evaluation = {
    id: 'evaluation-id-local',
    featureId,
    featureVersion: 2,
    userId: user.id,
    variationId: 'variation-id-local',
    variationName: 'variation-name-local',
    variationValue: 'value-local',
    reason: { type: 'DEFAULT', ruleId: '' },
  };
  const localEvaluator = {
    evaluate: sandbox.stub().resolves(evaluation),
  } as unknown as NodeEvaluator;
  const eventEmitter = new ProcessorEventsEmitter();
  const observedEvents = observeEmitter(eventEmitter);
  const clock = new Clock();
  const eventStore = new EventStore();
  const latencyStartStub = sandbox.stub(clock, 'latencyStart').returns(startMark);
  const latencySecondsSinceStub = sandbox
    .stub(clock, 'latencySecondsSince')
    .returns(latencySecond);
  const client = new BKTClientImpl(createTestConfig(true), {
    apiClient: createMockAPIClient(),
    eventStore,
    localEvaluator,
    featureFlagProcessor: createNoOpFeatureFlagProcessor(),
    segementUsersCacheProcessor: createNoOpSegementUsersCacheProcessor(),
    eventEmitter,
    clock,
  });

  t.teardown(async () => {
    sandbox.restore();
    await client.destroy();
  });

  const actual = await client.getEvaluation(user, featureId);

  t.deepEqual(actual, evaluation);
  t.true(latencyStartStub.calledOnce);
  t.true(latencySecondsSinceStub.calledOnceWithExactly(startMark));
  t.deepEqual(observedEvents.latencyEvents, [
    {
      latency: latencySecond,
      apiId: ApiId.SDK_GET_VARIATION,
    },
  ]);
  t.deepEqual(observedEvents.sizeEvents, []);
  t.deepEqual(observedEvents.errorEvents, []);

  const storedEvents = eventStore.getAll();
  t.is(storedEvents.length, 1);
  t.true(storedEvents.every((storedEvent) => isMetricsEvent(storedEvent.event)));
  t.deepEqual(
    storedEvents.map((storedEvent) => {
      const metricsEvent = storedEvent.event;
      if (!isMetricsEvent(metricsEvent) || !metricsEvent.event) {
        return null;
      }
      return {
        apiId: metricsEvent.event.apiId,
        sourceId: metricsEvent.sourceId,
        sdkVersion: metricsEvent.sdkVersion,
        tag: metricsEvent.event.labels.tag,
        type: metricsEvent.event['@type'],
        latencySecond:
          'latencySecond' in metricsEvent.event ? metricsEvent.event.latencySecond : undefined,
        sizeByte: 'sizeByte' in metricsEvent.event ? metricsEvent.event.sizeByte : undefined,
      };
    }),
    [
      {
        apiId: ApiId.SDK_GET_VARIATION,
        sourceId: SourceId.NODE_SERVER,
        sdkVersion: '1.0.0',
        tag: 'test-tag',
        type: 'type.googleapis.com/bucketeer.event.client.LatencyMetricsEvent',
        latencySecond: latencySecond,
        sizeByte: undefined,
      },
    ],
  );
});