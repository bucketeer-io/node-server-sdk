import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initialize } from '../../lib';
import { HOST, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN, FEATURE_ID_STRING, FEATURE_ID_INT, FEATURE_ID_JSON, FEATURE_ID_FLOAT, SERVER_ROLE_TOKEN } from '../constants/constants';

const test = anyTest as TestFn<{ bktClient: Bucketeer; targetedUser: User }>;

test.before( async (t) => {
  t.context = {
    bktClient: initialize({
      host: HOST,
      token: SERVER_ROLE_TOKEN,
      tag: FEATURE_TAG,
      logger: new DefaultLogger('error'),
      enableLocalEvaluation: true,
      cachePollingInterval: 3000,
    }),
    targetedUser: { id: TARGETED_USER_ID, data: {} },
  };   

  await new Promise(resolve => {
    setTimeout(resolve, 5000);
  });
});

test.after(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});


test('boolVariation', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.booleanVariation(targetedUser, FEATURE_ID_BOOLEAN, true), false);
  t.deepEqual(
    await bktClient.booleanVariationDetails(targetedUser, FEATURE_ID_BOOLEAN, true),
    {
      featureId: FEATURE_ID_BOOLEAN,
      featureVersion: 5,
      userId: targetedUser.id,
      variationId: '29f318b0-d770-48a5-8ae5-c1c692ed6cec',
      variationName: 'variation 2',
      variationValue: false,
      reason: 'TARGET',
    }
  )
});

test('stringVariation', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.stringVariation(targetedUser, FEATURE_ID_STRING, ''), 'value-2');
  t.deepEqual(
    await bktClient.stringVariationDetails(targetedUser, FEATURE_ID_STRING, 'true'),
    {
      featureId: FEATURE_ID_STRING,
      featureVersion: 22,
      userId: targetedUser.id,
      variationId: 'a3336346-931e-40f4-923a-603c642285d7',
      variationName: 'variation 2',
      variationValue: 'value-2',
      reason: 'TARGET',
    }
  )
});

test('numberVariation', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.is(await bktClient.numberVariation(targetedUser, FEATURE_ID_INT, 0), 20);
  t.deepEqual(
    await bktClient.numberVariationDetails(targetedUser, FEATURE_ID_INT, 99),
    {
      featureId: FEATURE_ID_INT,
      featureVersion: 5,
      userId: targetedUser.id,
      variationId: '125380f8-5c18-4a80-b37d-a41331acf075',
      variationName: 'variation 2',
      variationValue: 20,
      reason: 'TARGET',
    }
  )

  t.is(await bktClient.numberVariation(targetedUser, FEATURE_ID_FLOAT, 0.0), 3.1);
  t.deepEqual(
    await bktClient.numberVariationDetails(targetedUser, FEATURE_ID_FLOAT, 99),
    {
      featureId: FEATURE_ID_FLOAT,
      featureVersion: 5,
      userId: targetedUser.id,
      variationId: 'fdd0585b-dde4-4c2b-8f41-a1ca8f25d6a3',
      variationName: 'variation 2',
      variationValue: 3.1,
      reason: 'TARGET',
    }
  )

});

test('objectVariation', async (t) => {
  const { bktClient, targetedUser } = t.context;
  t.deepEqual(await bktClient.getJsonVariation(targetedUser, FEATURE_ID_JSON, {}), { "str": "str2", "int": "int2" });
  t.deepEqual(await bktClient.objectVariation(targetedUser, FEATURE_ID_JSON, {}), { "str": "str2", "int": "int2" });
  t.deepEqual(
    await bktClient.objectVariationDetails(targetedUser, FEATURE_ID_JSON, 99),
    {
      featureId: FEATURE_ID_JSON,
      featureVersion: 5,
      userId: targetedUser.id,
      variationId: '636e08e5-7ecd-4c91-88f7-4443c8486767',
      variationName: 'variation 2',
      variationValue: { str: 'str2', int: 'int2' },
      reason: 'TARGET',
    }
  )
});