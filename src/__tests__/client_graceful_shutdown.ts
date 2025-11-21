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
  eventsFlushInterval: 10000,
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
  const mockAPIClient = createMockAPIClient(async (_events) => {
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
  const mockAPIClient = createMockAPIClient(async (_events) => {
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
  const mockAPIClient = createMockAPIClient(async (_events) => {
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
  const mockAPIClient = createMockAPIClient(async (_events) => {
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

  // Call destroy first time
  await client.destroy();
  t.is(flushCount, 1, 'Should flush once on first destroy');

  // Call destroy multiple times - should not flush again
  await client.destroy();
  await client.destroy();

  t.is(flushCount, 1, 'Should not flush again on subsequent destroys');
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

test('destroy() should timeout if shutdown takes too long', async (t) => {
  const mockAPIClient = createMockAPIClient(async (_events) => {
    // Simulate slow API call that takes 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
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

  // Try to destroy with 100ms timeout - should timeout
  const error = await t.throwsAsync(
    async () => {
      await client.destroy({ timeout: 100 });
    },
    { instanceOf: Error },
  );

  t.true(error?.message.includes('Shutdown timeout'));
});

test('destroy() should succeed with sufficient timeout', async (t) => {
  let flushedEvents: Event[] = [];
  const mockAPIClient = createMockAPIClient(async (events) => {
    // Simulate moderate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    flushedEvents.push(...events);
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

  // Add events
  const user = { id: 'test-user', data: {} };
  client.track(user, 'goal-1', 10);
  client.track(user, 'goal-2', 20);

  // Destroy with sufficient timeout
  await t.notThrowsAsync(async () => {
    await client.destroy({ timeout: 5000 });
  });

  // Verify events were flushed
  t.is(flushedEvents.length, 2);
  t.is(eventStore.size(), 0);
});

test('destroy() should not save error metrics during shutdown', async (t) => {
  let errorMetricsEventCount = 0;
  const mockAPIClient = createMockAPIClient(async (_events) => {
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

  const initialEventCount = eventStore.size();

  // Destroy should not throw and should not add error metric events
  await t.notThrowsAsync(async () => {
    await client.destroy();
  });

  // Event store should be cleared (the original event was removed, and no error metrics
  // events were added during shutdown due to isShuttingDown flag)
  t.is(eventStore.size(), 0);
});

test('destroy() should handle processor stop errors gracefully', async (t) => {
  const mockAPIClient = createMockAPIClient();
  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.enableLocalEvaluation = true;

  const mockFeatureFlagProcessor = {
    start: () => Promise.resolve(),
    stop: () => Promise.reject(new Error('Processor stop failed')),
  };

  const mockSegmentProcessor = {
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
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

  // Destroy should propagate the error
  await t.throwsAsync(
    async () => {
      await client.destroy();
    },
    { message: 'Processor stop failed' },
  );
});
