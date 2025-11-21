import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initializeBKTClient, defineBKTConfig } from '../lib';
import {
  API_ENDPOINT,
  SCHEME,
  CLIENT_API_KEY,
  FEATURE_TAG,
  TARGETED_USER_ID,
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_STRING,
  FEATURE_ID_INT,
  FEATURE_ID_JSON,
  FEATURE_ID_FLOAT,
  GOAL_ID,
  GOAL_VALUE,
} from './constants/constants';
import { BKTClientImpl } from '../lib/client';
import { isGoalEvent } from '../lib/objects/goalEvent';
import { isMetricsEvent } from '../lib/objects/metricsEvent';
import { isEvaluationEvent } from '../lib/objects/evaluationEvent';
import { isStatusErrorMetricsEvent } from '../lib/objects/status';
import { SourceId } from '../lib/objects/sourceId';
import { nodeSDKVersion } from '../lib/objects/version';

const test = anyTest as TestFn<{ bktClient: Bucketeer; targetedUser: User }>;

test.beforeEach((t) => {
  const config = defineBKTConfig({
    apiEndpoint: API_ENDPOINT,
  SCHEME,
    apiKey: CLIENT_API_KEY,
    featureTag: FEATURE_TAG,
    logger: new DefaultLogger('error'),
  });
  t.context = {
    bktClient: initializeBKTClient(config),
    targetedUser: { id: TARGETED_USER_ID, data: {} },
  };
});

test('goal event', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.booleanVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
  bktClient.track(targetedUser, GOAL_ID, GOAL_VALUE);
  const bktClientImpl = bktClient as BKTClientImpl;
  const events = bktClientImpl.eventStore.getAll();
  // (EvaluationEvent, Metrics Event - Latency, Metrics Event - Metrics Size, Goal Event)
  t.is(events.length, 4);
  t.true(events.some((e: { event: any }) => isGoalEvent(e.event)));
  t.true(
    events.every(
      (e) => e.event.sourceId === SourceId.NODE_SERVER && e.event.sdkVersion === nodeSDKVersion,
    ),
  );
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
  // (EvaluationEvent, Metrics Event - Latency, Metrics Event - Metrics Size) x 6
  t.is(events.length, 18);
  t.true(events.some((e) => isEvaluationEvent(e.event)));
  t.true(events.some((e) => isMetricsEvent(e.event)));
  t.true(
    events.every(
      (e) => e.event.sourceId === SourceId.NODE_SERVER && e.event.sdkVersion === nodeSDKVersion,
    ),
  );
});

test('default evaluation event', async (t) => {
  const { bktClient, targetedUser } = t.context;
  const notFoundFeatureId = 'not-found-feature-id';
  t.is(await bktClient.booleanVariation(targetedUser, notFoundFeatureId, true), true);
  t.deepEqual(await bktClient.getJsonVariation(targetedUser, notFoundFeatureId, { str: 'str2' }), {
    str: 'str2',
  });
  t.deepEqual(await bktClient.objectVariation(targetedUser, notFoundFeatureId, { str: 'str2' }), {
    str: 'str2',
  });
  t.is(await bktClient.numberVariation(targetedUser, notFoundFeatureId, 10), 10);
  t.is(await bktClient.numberVariation(targetedUser, notFoundFeatureId, 3.3), 3.3);
  t.is(await bktClient.stringVariation(targetedUser, notFoundFeatureId, 'value-9'), 'value-9');
  const bktClientImpl = bktClient as BKTClientImpl;
  const events = bktClientImpl.eventStore.getAll();
  // (DefaultEvaluationEvent, Error Event) x 6
  t.is(events.length, 12);
  t.true(events.some((e) => isEvaluationEvent(e.event)));
  t.true(events.some((e) => isMetricsEvent(e.event)));
  t.true(
    events.some((e) => isStatusErrorMetricsEvent(e.event, NOT_FOUND_ERROR_METRICS_EVENT_NAME)),
  );
  t.true(
    events.every(
      (e) => e.event.sourceId === SourceId.NODE_SERVER && e.event.sdkVersion === nodeSDKVersion,
    ),
  );
});

test.afterEach(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});

const NOT_FOUND_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NotFoundErrorMetricsEvent';
