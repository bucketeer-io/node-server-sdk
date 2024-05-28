import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initialize } from '../lib';
import { HOST, TOKEN, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN, FEATURE_ID_STRING, FEATURE_ID_INT, FEATURE_ID_JSON, FEATURE_ID_FLOAT, GOAL_ID, GOAL_VALUE } from './constants/constants';
import { BKTClientImpl } from '../lib';
import { isGoalEvent } from '../lib/objects/goalEvent';

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
    t.is(await bktClient.getBoolVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
    bktClient.track(targetedUser, GOAL_ID, GOAL_VALUE)
    const bktClientImpl = bktClient as BKTClientImpl
    const events = bktClientImpl.eventStore.getAll()
  // EvaluationEvent, Metrics Event - Latency, Metrics Event - Metrics Size, Goal Event
    t.is(events.length, 4);
    t.true(events.some((e) => (isGoalEvent(e.event))))
  });