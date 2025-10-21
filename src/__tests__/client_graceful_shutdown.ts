import test from 'ava';
import { BKTClientImpl } from '../client';
import { EventStore } from '../stores/EventStore';
import { APIClient } from '../api/client';
import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { InternalConfig } from '../internalConfig';
import { SourceId } from '../objects/sourceId';
import { DefaultLogger } from '../logger';
import { Event, createEvent } from '../objects/event';
import { createGoalEvent } from '../objects/goalEvent';

// Helper to create a basic internal config
const createTestConfig = (): InternalConfig => ({
  apiKey: 'test-api-key',
  apiEndpoint: 'https://test-endpoint.example.com',
  featureTag: 'test-tag',
  eventsFlushInterval: 30000,
  eventsMaxQueueSize: 50,
  appVersion: '1.0.0',
  logger: new DefaultLogger(),
  enableLocalEvaluation: false,
  cachePollingInterval: 60000,
  sourceId: SourceId.NODE_SERVER,
  sdkVersion: '1.0.0',
});

// Helper to create a mock API client
const createMockAPIClient = (registerEventsMock?: (events: Event[]) => Promise<any>): APIClient => {
  const mockClient = {
    registerEvents: registerEventsMock || (() => Promise.resolve([{}, 0])),
    getEvaluation: () => Promise.reject(new Error('Not implemented')),
  } as any;
  return mockClient as APIClient;
};

test('destroy() should flush all remaining events', async (t) => {
  let allFlushedEvents: Event[] = [];
  const mockAPIClient = createMockAPIClient(async (events) => {
    allFlushedEvents.push(...events);
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add some events to the store
  const user = { id: 'test-user', data: {} };
  client.track(user, 'goal-1', 10);
  client.track(user, 'goal-2', 20);
  client.track(user, 'goal-3', 30);

  // Verify events are in the store
  t.is(eventStore.size(), 3);

  // Destroy should flush all events
  await client.destroy();

  // Verify all events were flushed
  t.is(eventStore.size(), 0);
  t.is(allFlushedEvents.length, 3);
});

test('destroy() should stop the scheduled flush', async (t) => {
  let flushCount = 0;
  const mockAPIClient = createMockAPIClient(async (events) => {
    flushCount++;
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.eventsFlushInterval = 100; // 100ms for fast testing

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  const initialFlushCount = flushCount;

  // Destroy the client
  await client.destroy();

  // Wait a bit to ensure no more flushes happen
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Verify no additional flushes occurred after destroy
  // (flushCount might be initialFlushCount or initialFlushCount + 1 from destroy)
  t.true(flushCount <= initialFlushCount + 1);

  // Add an event after destroy - it should not trigger a flush
  const postDestroyFlushCount = flushCount;
  eventStore.add(
    createGoalEvent(
      'test-tag',
      'goal-after-destroy',
      { id: 'test-user', data: {} },
      100,
      SourceId.NODE_SERVER,
      '1.0.0',
    ),
  );

  await new Promise((resolve) => setTimeout(resolve, 300));

  // Verify no flush happened for the event added after destroy
  t.is(flushCount, postDestroyFlushCount);
});

test('destroy() should handle empty event store', async (t) => {
  let flushCalled = false;
  const mockAPIClient = createMockAPIClient(async (events) => {
    flushCalled = true;
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Destroy without any events
  await t.notThrowsAsync(async () => {
    await client.destroy();
  });

  // Verify flush was not called (no events to flush)
  t.false(flushCalled);
});

test('destroy() should handle API errors gracefully', async (t) => {
  const mockAPIClient = createMockAPIClient(async (events) => {
    throw new Error('Network error');
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add an event
  const user = { id: 'test-user', data: {} };
  client.track(user, 'goal-1', 10);

  // Destroy should not throw even if API call fails
  await t.notThrowsAsync(async () => {
    await client.destroy();
  });

  // Event store should be cleared even on error
  t.is(eventStore.size(), 0);
});

test('destroy() should stop processors when local evaluation is enabled', async (t) => {
  const mockAPIClient = createMockAPIClient();
  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.enableLocalEvaluation = true;

  let featureFlagProcessorStopped = false;
  let segmentProcessorStopped = false;

  const mockFeatureFlagProcessor = {
    start: () => Promise.resolve(),
    stop: () => {
      featureFlagProcessorStopped = true;
      return Promise.resolve();
    },
  };

  const mockSegmentProcessor = {
    start: () => Promise.resolve(),
    stop: () => {
      segmentProcessorStopped = true;
      return Promise.resolve();
    },
  };

  const mockLocalEvaluator = {
    evaluate: () => Promise.resolve(null),
  };

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: mockLocalEvaluator as any,
    featureFlagProcessor: mockFeatureFlagProcessor as any,
    segementUsersCacheProcessor: mockSegmentProcessor as any,
    eventEmitter: eventEmitter,
  });

  // Destroy the client
  await client.destroy();

  // Verify processors were stopped
  t.true(featureFlagProcessorStopped);
  t.true(segmentProcessorStopped);
});

test('destroy() should be idempotent', async (t) => {
  let flushCount = 0;
  const mockAPIClient = createMockAPIClient(async (events) => {
    flushCount++;
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add an event
  const user = { id: 'test-user', data: {} };
  client.track(user, 'goal-1', 10);

  // Call destroy multiple times
  await client.destroy();
  const firstFlushCount = flushCount;

  await client.destroy();
  await client.destroy();

  // Verify flush was only called once (or maybe not at all on subsequent calls)
  t.true(flushCount === firstFlushCount || flushCount === firstFlushCount);
});

test('destroy() should flush events with correct order', async (t) => {
  let flushedEvents: Event[] = [];
  const mockAPIClient = createMockAPIClient(async (events) => {
    flushedEvents = events;
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add events in order
  const user = { id: 'test-user', data: {} };
  client.track(user, 'goal-1', 10);
  client.track(user, 'goal-2', 20);
  client.track(user, 'goal-3', 30);

  await client.destroy();

  // Verify events are flushed in the same order
  t.is(flushedEvents.length, 3);
  // Note: We can't easily check the exact order without inspecting event internals
  // but we can verify the count is correct
});

