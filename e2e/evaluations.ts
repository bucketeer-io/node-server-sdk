import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initialize } from '../lib';
import { HOST, TOKEN, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN, FEATURE_ID_STRING, FEATURE_ID_INT, FEATURE_ID_JSON, FEATURE_ID_FLOAT } from './constants/constants';


const test = anyTest as TestFn<{ bktClient: Bucketeer; targetedUser: User; defaultUser: User }>;

test.beforeEach((t) => {
  t.context = {
    bktClient: initialize({
      host: HOST,
      token: TOKEN,
      tag: FEATURE_TAG,
      logger: new DefaultLogger("error")
    }),
    targetedUser: { id: TARGETED_USER_ID, data: {} },
    defaultUser: { id: 'user-1', data: {} },
  };
});

test('boolVariation', async (t) => {
  const { bktClient, targetedUser, defaultUser } = t.context;
  t.is(await bktClient.getBoolVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
  t.is(await bktClient.getBoolVariation(defaultUser, FEATURE_ID_BOOLEAN, false), true);
});

test('stringVariation', async (t) => {
  const { bktClient, targetedUser, defaultUser } = t.context;
  t.is(await bktClient.getStringVariation(targetedUser, FEATURE_ID_STRING, ''), 'value-2');
  t.is(await bktClient.getStringVariation(defaultUser, FEATURE_ID_STRING, ''), 'value-1');
});

test('numberVariation', async (t) => {
  const { bktClient, targetedUser, defaultUser } = t.context;
  t.is(await bktClient.getNumberVariation(targetedUser, FEATURE_ID_INT, 0), 20);
  t.is(await bktClient.getNumberVariation(targetedUser, FEATURE_ID_FLOAT, 0.0), 3.1);

  t.is(await bktClient.getNumberVariation(defaultUser, FEATURE_ID_INT, 0), 10);
  t.is(await bktClient.getNumberVariation(defaultUser, FEATURE_ID_FLOAT, 0.0), 2.1);
});

test('jsonVariation', async (t) => {
  const { bktClient, targetedUser, defaultUser } = t.context;
  t.deepEqual(await bktClient.getJsonVariation(targetedUser, FEATURE_ID_JSON, {}),  {"str":"str2", "int": "int2"});
  t.deepEqual(await bktClient.getJsonVariation(defaultUser, FEATURE_ID_JSON, {}),  {"str":"str1", "int": "int1"});
});

test.afterEach(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});

