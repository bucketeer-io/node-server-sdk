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

test('destroy() should flush events in batches to avoid gRPC size limit', async (t) => {
  const batches: Event[][] = [];
  const mockAPIClient = createMockAPIClient(async (events) => {
    batches.push(events);
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.eventsMaxQueueSize = 100; // Set batch size to 100

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add 250 events directly to store (should be split into 3 batches: 100, 100, 50)
  const user = { id: 'test-user', data: {} };
  for (let i = 0; i < 250; i++) {
    eventStore.add(
      createGoalEvent('test-tag', `goal-${i}`, user, i, SourceId.NODE_SERVER, '1.0.0'),
    );
  }

  // Verify events are in the store
  t.is(eventStore.size(), 250);

  // Destroy should flush all events in batches
  await client.destroy();

  // Verify all events were flushed
  t.is(eventStore.size(), 0);

  // Verify events were sent in batches
  t.true(batches.length >= 3, `Expected at least 3 batches, got ${batches.length}`);

  // Verify batch sizes (should be max 100 per batch)
  for (const batch of batches) {
    t.true(batch.length <= 100, `Batch size ${batch.length} exceeds limit of 100`);
  }

  // Verify total count
  const totalFlushed = batches.reduce((sum, batch) => sum + batch.length, 0);
  t.is(totalFlushed, 250);
});

test('destroy() should handle large event queues (10k events)', async (t) => {
  const batches: Event[][] = [];
  const mockAPIClient = createMockAPIClient(async (events) => {
    batches.push(events);
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.eventsMaxQueueSize = 100; // Set batch size to 100

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Simulate high-traffic scenario: 10,000 events
  const user = { id: 'test-user', data: {} };
  for (let i = 0; i < 10000; i++) {
    eventStore.add(
      createGoalEvent('test-tag', `goal-${i}`, user, i, SourceId.NODE_SERVER, '1.0.0'),
    );
  }

  t.is(eventStore.size(), 10000);

  // Destroy should flush all events
  await client.destroy();

  // Verify all events were flushed
  t.is(eventStore.size(), 0);

  // Verify batching
  t.true(batches.length === 100, `Expected 100 batches, got ${batches.length}`);

  // Verify all batches respect size limit
  for (const batch of batches) {
    t.true(batch.length <= 100, `Batch size ${batch.length} exceeds limit of 100`);
  }

  // Verify total
  const totalFlushed = batches.reduce((sum, batch) => sum + batch.length, 0);
  t.is(totalFlushed, 10000);
});

test('destroy() should continue flushing even if one batch fails', async (t) => {
  const batches: Event[][] = [];
  let callCount = 0;

  const mockAPIClient = createMockAPIClient(async (events) => {
    batches.push(events);
    callCount++;
    // Fail the second batch
    if (callCount === 2) {
      throw new Error('Network error');
    }
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.eventsMaxQueueSize = 100; // Set batch size to 100

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add 250 events
  const user = { id: 'test-user', data: {} };
  for (let i = 0; i < 250; i++) {
    eventStore.add(
      createGoalEvent('test-tag', `goal-${i}`, user, i, SourceId.NODE_SERVER, '1.0.0'),
    );
  }

  // Destroy should flush all batches even if one fails
  await t.notThrowsAsync(async () => {
    await client.destroy();
  });

  // Verify all batches were attempted (3 batches)
  t.is(batches.length, 3);

  // Event store should be empty (all events removed even if some failed)
  t.is(eventStore.size(), 0);
});

test('scheduled flush should also batch events', async (t) => {
  const batches: Event[][] = [];
  const mockAPIClient = createMockAPIClient(async (events) => {
    batches.push(events);
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.eventsFlushInterval = 100; // 100ms for fast testing
  config.eventsMaxQueueSize = 100; // Set batch size to 100

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add 250 events directly to the store (bypassing track which also flushes)
  const user = { id: 'test-user', data: {} };
  for (let i = 0; i < 250; i++) {
    eventStore.add(
      createGoalEvent('test-tag', `goal-${i}`, user, i, SourceId.NODE_SERVER, '1.0.0'),
    );
  }

  // Wait for scheduled flush
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Verify events were flushed in batches
  t.true(batches.length >= 3, `Expected at least 3 batches, got ${batches.length}`);

  // Verify batch sizes
  for (const batch of batches) {
    t.true(batch.length <= 100, `Batch size ${batch.length} exceeds limit of 100`);
  }

  // Cleanup
  await client.destroy();
});

test('batching should respect exact eventsMaxQueueSize limit', async (t) => {
  const batchSizes: number[] = [];
  const mockAPIClient = createMockAPIClient(async (events) => {
    batchSizes.push(events.length);
    return [{}, 0];
  });

  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  const config = createTestConfig();
  config.eventsMaxQueueSize = 100; // Set batch size to 100

  const client = new BKTClientImpl(config, {
    apiClient: mockAPIClient,
    eventStore: eventStore,
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: eventEmitter,
  });

  // Add exactly 300 events (should be 3 batches of 100)
  const user = { id: 'test-user', data: {} };
  for (let i = 0; i < 300; i++) {
    eventStore.add(
      createGoalEvent('test-tag', `goal-${i}`, user, i, SourceId.NODE_SERVER, '1.0.0'),
    );
  }

  await client.destroy();

  // Should be exactly 3 batches
  t.is(batchSizes.length, 3);

  // Each batch should be exactly 100
  t.deepEqual(batchSizes, [100, 100, 100]);
});
