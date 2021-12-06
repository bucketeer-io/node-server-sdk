import test from 'ava';
import fetch from 'node-fetch';
import { unwrapMaybe } from 'option-t/lib/Maybe/unwrap';
import { User } from '../lib/objects/User';
import { ReasonType } from '../lib/objects/Reason';
import { Evaluation } from '../lib/objects/Evaluation';
import { EvaluationEvent } from '../lib/objects/EvaluationEvent';
import { GoalEvent } from '../lib/objects/GoalEvent';
import { SourceId } from '../lib/objects/SourceId';
import { GetEvaluationsState, createGetEvaluationsAPI } from '../lib/api/getEvaluations';
import { createRegisterEventsAPI } from '../lib/api/registerEvents';
import { Bucketeer, initialize } from '../lib/index';

const HOST = process.env.HOST!;
const TOKEN = process.env.TOKEN!;

const TAG = 'web';
const USER_ID_1 = 'bucketeer-web-user-id-1';
const USER_EVALUATIONS_ID = 'user-evaluations-id';
const FEATURE_FLAG_ID_1 = 'feature-web-e2e-1';
const FEATURE_FLAG_VERSION_1 = 3;
const FEATURE_FLAG_1_VARIATION_ID = '9496643b-50e7-4db2-ba27-44d141c831ac';
const FEATURE_FLAG_1_VARIATION_VALUE = 'value-2';

const GOAL_ID_1 = 'goal-web-e2e-1';

let bucketeer: Bucketeer;

function createTimestamp(): number {
  const SECOND_AS_MILLISEC = 1000;
  const millisec = Date.now();
  // It is necessary for validation at backend.
  const sec = Math.floor(millisec / SECOND_AS_MILLISEC);
  return sec;
}

function isEmpty(obj: any): boolean {
  return !Object.keys(obj).length;
}

test.before((_) => {
  bucketeer = initialize({
    host: HOST,
    token: TOKEN,
    tag: TAG,
    user: {
      id: 'init-user-id',
      data: {},
    },
    fetch: fetch,
    pollingIntervalForGetEvaluations: 2 * 60 * 1000,
    pollingIntervalForRegisterEvents: 2 * 60 * 1000,
  });
});

test.after((_) => {
  bucketeer.destroy();
});

test('getEvaluations', async (t) => {
  const getEvaluations = createGetEvaluationsAPI(HOST, TOKEN);
  const user = new User({
    id: USER_ID_1,
    data: { test: 'e2e' },
  });
  const res = await getEvaluations(TAG, user, USER_EVALUATIONS_ID);
  t.true(res.ok);
  t.is(unwrapMaybe(res.val).state, GetEvaluationsState.FULL);
  t.true(unwrapMaybe(res.val).evaluations.length >= 1);
  t.true(unwrapMaybe(res.val).userEvaluationsId !== '');
});
test('registerEvents', async (t) => {
  const registerEvents = createRegisterEventsAPI(HOST, TOKEN);
  const evaluation = new Evaluation({
    id: FEATURE_FLAG_ID_1 + ':' + FEATURE_FLAG_VERSION_1 + ':' + USER_ID_1,
    featureId: FEATURE_FLAG_ID_1,
    featureVersion: FEATURE_FLAG_VERSION_1,
    userId: USER_ID_1,
    variationId: FEATURE_FLAG_1_VARIATION_ID,
    variationValue: FEATURE_FLAG_1_VARIATION_VALUE,
    reason: {
      type: ReasonType.DEFAULT,
    },
  });
  const events = [
    new EvaluationEvent({
      sourceId: SourceId.WEB,
      tag: TAG,
      featureId: FEATURE_FLAG_ID_1,
      featureVersion: FEATURE_FLAG_VERSION_1,
      userId: USER_ID_1,
      user: {
        id: USER_ID_1,
        data: { test: 'e2e' },
      },
      variationId: FEATURE_FLAG_1_VARIATION_ID,
      reason: {
        type: ReasonType.DEFAULT,
      },
      timestamp: createTimestamp(),
    }),
    new GoalEvent({
      sourceId: SourceId.WEB,
      tag: TAG,
      goalId: GOAL_ID_1,
      userId: USER_ID_1,
      value: 0,
      evaluations: [evaluation],
      timestamp: createTimestamp(),
    }),
  ];
  const res = await registerEvents(events);
  t.true(res.ok);
  t.true(isEmpty(unwrapMaybe(res.val).errors));
});

test.cb('getStringVariation', (t) => {
  t.plan(1);
  const onGetEvaluations = () => {
    const variation = bucketeer.getStringVariation(FEATURE_FLAG_ID_1, 'default');
    t.is(variation, FEATURE_FLAG_1_VARIATION_VALUE);
    t.end();
  };
  bucketeer.setUser(
    {
      id: USER_ID_1,
      data: { test: 'e2e' },
    },
    onGetEvaluations,
  );
});
