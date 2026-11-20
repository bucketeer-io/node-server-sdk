import test from 'ava';
import { APIClient } from '../api/client';
import { InMemoryCache } from '../cache/inMemoryCache';
import { NewFeatureCache } from '../cache/features';
import { NewHoldoutGroupsCache } from '../cache/holdoutGroups';
import { NewSegmentUsersCache } from '../cache/segmentUsers';
import { toEvaluatorHoldoutGroups } from '../cache/processor/converter';
import { FeatureFlagProcessor } from '../cache/processor/featureFlagCacheProcessor';
import { SegementUsersCacheProcessor } from '../cache/processor/segmentUsersCacheProcessor';
import { BKTClientImpl } from '../client';
import { LocalEvaluator } from '../evaluator/local';
import { InternalConfig } from '../internalConfig';
import { DefaultLogger } from '../logger';
import { Event } from '../objects/event';
import { isEvaluationEvent } from '../objects/evaluationEvent';
import { GetEvaluationResponse } from '../objects/response';
import { SourceId } from '../objects/sourceId';
import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { EventStore } from '../stores/EventStore';
import { Clock } from '../utils/clock';
import { createFeature } from './utils/feature';
import {
  HASH_HOLDOUT_GROUP_ID,
  HELD_OUT_USER_ID,
  HOLDOUT_FEATURE_ID,
  HOLDOUT_VARIATION_ID,
  NORMAL_VARIATION_ID,
  NOT_HELD_OUT_USER_ID,
  hashHoldoutGroup,
  holdoutTargetFeature,
} from './utils/holdout';

// The evaluation event must report reason HOLDOUT and the holdout group ID in
// both evaluation modes: measurement filters on them.

const createTestConfig = (enableLocalEvaluation: boolean): InternalConfig => ({
  apiKey: 'test-api-key',
  apiEndpoint: 'test-endpoint.example.com',
  featureTag: 'server',
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

// Records the request bodies of register_events as they go on the wire.
const createRecordingAPIClient = (
  getEvaluation?: () => Promise<[GetEvaluationResponse, number]>,
): { apiClient: APIClient; sentEvents: () => any[] } => {
  const sent: string[] = [];
  const apiClient = {
    getEvaluation:
      getEvaluation ??
      (() => Promise.reject(new Error('getEvaluation should not be called in this test'))),
    registerEvents: async (events: Event[]) => {
      sent.push(JSON.stringify(events));
      return [{ errors: {} }, 0];
    },
  } as unknown as APIClient;
  return {
    apiClient,
    sentEvents: () => sent.reduce((all, body) => all.concat(JSON.parse(body)), [] as any[]),
  };
};

const noOpFeatureFlagProcessor = (): FeatureFlagProcessor => ({
  start: async () => undefined,
  stop: async () => undefined,
});

const noOpSegementUsersCacheProcessor = (): SegementUsersCacheProcessor => ({
  start: async () => undefined,
  stop: async () => undefined,
});

function sentEvaluationEvents(sentEvents: any[]): any[] {
  return sentEvents.map((event) => event.event).filter((event) => isEvaluationEvent(event));
}

async function createLocalClient() {
  const cache = new InMemoryCache();
  const featuresCache = NewFeatureCache({ cache, ttl: 0 });
  const holdoutGroupsCache = NewHoldoutGroupsCache({ cache, ttl: 0 });
  await featuresCache.put(createFeature(holdoutTargetFeature()));
  await holdoutGroupsCache.put(toEvaluatorHoldoutGroups([hashHoldoutGroup()]));
  const { apiClient, sentEvents } = createRecordingAPIClient();
  const client = new BKTClientImpl(createTestConfig(true), {
    apiClient,
    eventStore: new EventStore(),
    localEvaluator: new LocalEvaluator({
      tag: 'server',
      featuresCache,
      segementUsersCache: NewSegmentUsersCache({ cache, ttl: 0 }),
      holdoutGroupsCache,
    }),
    featureFlagProcessor: noOpFeatureFlagProcessor(),
    segementUsersCacheProcessor: noOpSegementUsersCacheProcessor(),
    eventEmitter: new ProcessorEventsEmitter(),
    clock: new Clock(),
  });
  return { client, sentEvents };
}

test('local evaluation: the event of a held-out user reports HOLDOUT and the group ID', async (t) => {
  const { client, sentEvents } = await createLocalClient();
  const user = { id: HELD_OUT_USER_ID, data: {} };

  const details = await client.stringVariationDetails(user, HOLDOUT_FEATURE_ID, 'default');
  await client.destroy();

  t.deepEqual(details, {
    featureId: HOLDOUT_FEATURE_ID,
    featureVersion: 3,
    userId: HELD_OUT_USER_ID,
    variationId: HOLDOUT_VARIATION_ID,
    variationName: 'false-name',
    variationValue: 'false',
    reason: 'HOLDOUT',
  });
  const events = sentEvaluationEvents(sentEvents());
  t.is(events.length, 1);
  t.is(events[0].featureId, HOLDOUT_FEATURE_ID);
  t.is(events[0].featureVersion, 3);
  t.is(events[0].userId, HELD_OUT_USER_ID);
  t.is(events[0].variationId, HOLDOUT_VARIATION_ID);
  t.deepEqual(events[0].reason, {
    type: 'HOLDOUT',
    ruleId: '',
    holdoutGroupId: HASH_HOLDOUT_GROUP_ID,
  });
});

test('local evaluation: the event of a user outside the group is unchanged', async (t) => {
  const { client, sentEvents } = await createLocalClient();
  const user = { id: NOT_HELD_OUT_USER_ID, data: {} };

  const details = await client.stringVariationDetails(user, HOLDOUT_FEATURE_ID, 'default');
  await client.destroy();

  t.is(details.variationId, NORMAL_VARIATION_ID);
  t.is(details.reason, 'DEFAULT');
  const events = sentEvaluationEvents(sentEvents());
  t.is(events.length, 1);
  t.is(events[0].variationId, NORMAL_VARIATION_ID);
  t.deepEqual(events[0].reason, { type: 'DEFAULT', ruleId: '' });
});

test('remote evaluation: the event keeps the HOLDOUT reason and the group ID the server returns', async (t) => {
  // The body of a get_evaluation response for a held-out user.
  const body = `{
    "evaluation": {
      "id": "${HOLDOUT_FEATURE_ID}:3:${HELD_OUT_USER_ID}",
      "featureId": "${HOLDOUT_FEATURE_ID}",
      "featureVersion": 3,
      "userId": "${HELD_OUT_USER_ID}",
      "variationId": "${HOLDOUT_VARIATION_ID}",
      "variationName": "false-name",
      "variationValue": "false",
      "variation": null,
      "reason": { "type": "HOLDOUT", "ruleId": "", "holdoutGroupId": "${HASH_HOLDOUT_GROUP_ID}" }
    }
  }`;
  const { apiClient, sentEvents } = createRecordingAPIClient(async () => [
    JSON.parse(body),
    body.length,
  ]);
  const client = new BKTClientImpl(createTestConfig(false), {
    apiClient,
    eventStore: new EventStore(),
    localEvaluator: null,
    featureFlagProcessor: null,
    segementUsersCacheProcessor: null,
    eventEmitter: new ProcessorEventsEmitter(),
    clock: new Clock(),
  });
  const user = { id: HELD_OUT_USER_ID, data: {} };

  const details = await client.stringVariationDetails(user, HOLDOUT_FEATURE_ID, 'default');
  await client.destroy();

  t.is(details.variationId, HOLDOUT_VARIATION_ID);
  t.is(details.reason, 'HOLDOUT');
  const events = sentEvaluationEvents(sentEvents());
  t.is(events.length, 1);
  t.is(events[0].variationId, HOLDOUT_VARIATION_ID);
  t.deepEqual(events[0].reason, {
    type: 'HOLDOUT',
    ruleId: '',
    holdoutGroupId: HASH_HOLDOUT_GROUP_ID,
  });
});
