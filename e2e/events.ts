import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initialize } from '../lib';
import { HOST, TOKEN, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN, FEATURE_ID_STRING, FEATURE_ID_INT, FEATURE_ID_JSON, FEATURE_ID_FLOAT, GOAL_ID, GOAL_VALUE } from './constants/constants';
import { BKTClientImpl } from '../lib';
import { isGoalEvent } from '../lib/objects/goalEvent';
import { isMetricsEvent } from '../lib/objects/metricsEvent';
import { isEvaluationEvent } from '../lib/objects/evaluationEvent';

const test = anyTest as TestFn<{ bktClient: Bucketeer; targetedUser: User }>;

test.beforeEach((t) => {
  t.context = {
    bktClient: initialize({
      host: HOST,
      token: TOKEN,
      tag: FEATURE_TAG,
      logger: new DefaultLogger("error")
    }),
    targetedUser: { id: TARGETED_USER_ID, data: {} }
  };
});


test('goal event', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.booleanVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
  bktClient.track(targetedUser, GOAL_ID, GOAL_VALUE)
  const bktClientImpl = bktClient as BKTClientImpl
  const events = bktClientImpl.eventStore.getAll()
  // (EvaluationEvent, Metrics Event - Latency, Metrics Event - Metrics Size, Goal Event)
  t.is(events.length, 4);
  t.true(events.some((e: { event: any; }) => (isGoalEvent(e.event))))
});

test('default evaluation event', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.booleanVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
  t.deepEqual(await bktClient.getJsonVariation(targetedUser, FEATURE_ID_JSON, {}), { "str": "str2", "int": "int2" });
  t.deepEqual(await bktClient.objectVariation(targetedUser, FEATURE_ID_JSON, {}), { "str": "str2", "int": "int2" });
  t.is(await bktClient.numberVariation(targetedUser, FEATURE_ID_INT, 0), 20);
  t.is(await bktClient.numberVariation(targetedUser, FEATURE_ID_FLOAT, 0.0), 3.1);
  t.is(await bktClient.stringVariation(targetedUser, FEATURE_ID_STRING, ''), 'value-2');
  const bktClientImpl = bktClient as BKTClientImpl
  const events = bktClientImpl.eventStore.getAll()
  // (EvaluationEvent, Metrics Event - Latency, Metrics Event - Metrics Size) x 6
  t.is(events.length, 18);
  t.true(events.some((e) => (isEvaluationEvent(e.event))));
  t.true(events.some((e) => (isMetricsEvent(e.event))));
});

test.afterEach(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});

