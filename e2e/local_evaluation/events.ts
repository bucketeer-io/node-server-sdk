import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initialize } from '../../lib';
import {
  HOST,
  TOKEN,
  FEATURE_TAG,
  TARGETED_USER_ID,
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_STRING,
  FEATURE_ID_INT,
  FEATURE_ID_JSON,
  FEATURE_ID_FLOAT,
  GOAL_ID,
  GOAL_VALUE,
  SERVER_ROLE_TOKEN,
} from '../constants/constants';
import { BKTClientImpl } from '../../lib/client';
import { isGoalEvent } from '../../lib/objects/goalEvent';
import { isErrorMetricsEvent, isMetricsEvent } from '../../lib/objects/metricsEvent';
import { isEvaluationEvent } from '../../lib/objects/evaluationEvent';
import { defineBKTConfig } from '../../src/config';
import { initializeBKTClient } from '../../src';

const test = anyTest as TestFn<{ bktClient: Bucketeer; targetedUser: User }>;

test.beforeEach(async (t) => {
  const config = defineBKTConfig({
    apiEndpoint: HOST,
    apiKey: SERVER_ROLE_TOKEN,
    featureTag: FEATURE_TAG,
    logger: new DefaultLogger('error'),
    enableLocalEvaluation: true,
    cachePollingInterval: 3000,
  });
  t.context = {
    bktClient: initializeBKTClient(config),
    targetedUser: { id: TARGETED_USER_ID, data: {} },
  };
  // Waiting for the cache available
  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });
});

test('goal event', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.booleanVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
  bktClient.track(targetedUser, GOAL_ID, GOAL_VALUE);
  const bktClientImpl = bktClient as BKTClientImpl;
  const events = bktClientImpl.eventStore.getAll();
  // Feature Cache : 2 events (Metrics Event - Latency, Metrics Event - Metrics Size)
  // Segment User Cache : 2 events (Metrics Event - Latency, Metrics Event - Metrics Size)
  // booleanVariation : 2 event (EvaluationEvent,  Metrics Event - Latency)
  // goal : 1 event (GoalEvent)
  // SUM : 7 events
  t.is(events.length, 7);
  t.true(events.some((e: { event: any }) => isGoalEvent(e.event)));
});

test('evaluation event', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.booleanVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
  t.deepEqual(await bktClient.getJsonVariation(targetedUser, FEATURE_ID_JSON, {}), {
    str: 'str2',
    int: 'int2',
  });
  t.deepEqual(await bktClient.objectVariation(targetedUser, FEATURE_ID_JSON, {}), {
    str: 'str2',
    int: 'int2',
  });
  t.is(await bktClient.numberVariation(targetedUser, FEATURE_ID_INT, 0), 20);
  t.is(await bktClient.numberVariation(targetedUser, FEATURE_ID_FLOAT, 0.0), 3.1);
  t.is(await bktClient.stringVariation(targetedUser, FEATURE_ID_STRING, ''), 'value-2');
  const bktClientImpl = bktClient as BKTClientImpl;
  const events = bktClientImpl.eventStore.getAll();
  // Feature Cache : 2 events (Metrics Event - Latency, Metrics Event - Metrics Size)
  // Segment User Cache : 2 events (Metrics Event - Latency, Metrics Event - Metrics Size)
  // (EvaluationEvent, Metrics Event - Latency) x 6
  t.is(events.length, 16);
  t.true(events.some((e) => isEvaluationEvent(e.event)));
  t.true(events.some((e) => isMetricsEvent(e.event)));
});

test('default evaluation event', async (t) => {
  const { bktClient, targetedUser } = t.context;
  const notFoundFeatureId = 'not-found-feature-id';
  t.is(await bktClient.booleanVariation(targetedUser, notFoundFeatureId, true), true);
  t.deepEqual(await bktClient.getJsonVariation(targetedUser, notFoundFeatureId, { "str": "str2", }), { "str": "str2" });
  t.deepEqual(await bktClient.objectVariation(targetedUser, notFoundFeatureId, { "str": "str2" }), { "str": "str2" });
  t.is(await bktClient.numberVariation(targetedUser, notFoundFeatureId, 10), 10);
  t.is(await bktClient.numberVariation(targetedUser, notFoundFeatureId, 3.3), 3.3);
  t.is(await bktClient.stringVariation(targetedUser, notFoundFeatureId, 'value-9'), 'value-9');
  const bktClientImpl = bktClient as BKTClientImpl
  const events = bktClientImpl.eventStore.getAll()
  // Feature Cache : 2 events (Metrics Event - Latency, Metrics Event - Metrics Size)
  // Segment User Cache : 2 events (Metrics Event - Latency, Metrics Event - Metrics Size)
  // (DefaultEvaluationEvent, Error Event) x 6
  t.is(events.length, 16);
  t.true(events.some((e) => (isEvaluationEvent(e.event))));
  t.true(events.some((e) => (isMetricsEvent(e.event))));
  t.true(events.some((e) => (isErrorMetricsEvent(e.event, NOT_FOUND_ERROR_METRICS_EVENT_NAME))));
});

test.afterEach(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});

const NOT_FOUND_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NotFoundErrorMetricsEvent';