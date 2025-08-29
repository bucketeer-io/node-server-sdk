import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initializeBKTClient, defineBKTConfig } from '../lib';
import {
  HOST,
  TOKEN,
  FEATURE_TAG,
  TARGETED_USER_ID,
  GOAL_ID,
  GOAL_VALUE,
} from './constants/constants';
import { BKTClientImpl } from '../lib/client';
import { SourceId } from '../lib/objects/sourceId';

const test = anyTest as TestFn<{ bktClient: Bucketeer; targetedUser: User }>;
const wrapperSdkSourceId = SourceId.OPEN_FEATURE_NODE;
const wrapperSdkVersion = '1.0.1';

test.beforeEach((t) => {
  const config = defineBKTConfig({
    apiEndpoint: HOST,
    apiKey: TOKEN,
    featureTag: FEATURE_TAG,
    logger: new DefaultLogger('error'),
    wrapperSdkSourceId: wrapperSdkSourceId,
    wrapperSdkVersion: wrapperSdkVersion,
  });
  t.context = {
    bktClient: initializeBKTClient(config),
    targetedUser: { id: TARGETED_USER_ID, data: {} },
  };
});

test('should use wrapper SDK sourceId', async (t) => {
  const { bktClient, targetedUser } = t.context;
  const notFoundFeatureId = 'not-found-feature-id';
  t.is(await bktClient.booleanVariation(targetedUser, notFoundFeatureId, true), true);
  t.deepEqual(await bktClient.objectVariation(targetedUser, notFoundFeatureId, { str: 'str2' }), {
    str: 'str2',
  });
  t.is(await bktClient.numberVariation(targetedUser, notFoundFeatureId, 10), 10);
  t.is(await bktClient.numberVariation(targetedUser, notFoundFeatureId, 3.3), 3.3);
  t.is(await bktClient.stringVariation(targetedUser, notFoundFeatureId, 'value-9'), 'value-9');
  bktClient.track(targetedUser, GOAL_ID, GOAL_VALUE);
  const bktClientImpl = bktClient as BKTClientImpl;
  const events = bktClientImpl.eventStore.getAll();
  t.true(
    events.every(
      (e) => e.event.sourceId === wrapperSdkSourceId && e.event.sdkVersion === wrapperSdkVersion,
    ),
  );
});

test.afterEach(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});
