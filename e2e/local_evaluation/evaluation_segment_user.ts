import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, defineBKTConfig, initializeBKTClient } from '../../lib';
import {
  HOST,
  FEATURE_TAG,
  TARGETED_SEGMENT_USER_ID,
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_STRING,
  FEATURE_ID_INT,
  FEATURE_ID_JSON,
  FEATURE_ID_FLOAT,
  SERVER_ROLE_TOKEN,
} from '../constants/constants';
import { assetEvaluationDetails } from '../utils/assert';

const test = anyTest as TestFn<{ bktClient: Bucketeer; targetedSegmentUser: User }>;

test.before(async (t) => {
  const config = defineBKTConfig({
    apiEndpoint: HOST,
    apiKey: SERVER_ROLE_TOKEN,
    featureTag: FEATURE_TAG,
    logger: new DefaultLogger('error'),
    enableLocalEvaluation: true,
    cachePollingInterval: 15000,
  });
  t.context = {
    bktClient: initializeBKTClient(config),
    targetedSegmentUser: { id: TARGETED_SEGMENT_USER_ID, data: {} },
  };
  // Waiting for the cache available
  await t.context.bktClient.waitForInitialization({ timeout: 5000 });
});

test.after(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});

test('boolVariation', async (t) => {
  const { bktClient, targetedSegmentUser } = t.context;
  t.is(await bktClient.booleanVariation(targetedSegmentUser, FEATURE_ID_BOOLEAN, false), true);
  assetEvaluationDetails(
    t,
    await bktClient.booleanVariationDetails(targetedSegmentUser, FEATURE_ID_BOOLEAN, false),
    {
      featureId: FEATURE_ID_BOOLEAN,
      featureVersion: 5,
      userId: targetedSegmentUser.id,
      variationId: 'f948b6dd-c366-4828-8ee0-72edbe2c0eea',
      variationName: 'variation 1',
      variationValue: true,
      reason: 'DEFAULT',
    },
  );
});

// This testcase `stringVariation` is setup for testing
test('stringVariation', async (t) => {
  const { bktClient, targetedSegmentUser } = t.context;
  t.is(await bktClient.stringVariation(targetedSegmentUser, FEATURE_ID_STRING, ''), 'value-3');
  assetEvaluationDetails(
    t,
    await bktClient.stringVariationDetails(targetedSegmentUser, FEATURE_ID_STRING, 'true'),
    {
      featureId: FEATURE_ID_STRING,
      featureVersion: 22,
      userId: targetedSegmentUser.id,
      variationId: 'e92fa326-2c7a-45f2-aaf7-ab9eb59f0ccf',
      variationName: 'variation 3',
      variationValue: 'value-3',
      reason: 'RULE',
    },
  );
});

test('numberVariation', async (t) => {
  const { bktClient, targetedSegmentUser } = t.context;
  t.is(await bktClient.numberVariation(targetedSegmentUser, FEATURE_ID_INT, 0), 10);
  assetEvaluationDetails(
    t,
    await bktClient.numberVariationDetails(targetedSegmentUser, FEATURE_ID_INT, 1),
    {
      featureId: FEATURE_ID_INT,
      featureVersion: 5,
      userId: targetedSegmentUser.id,
      variationId: '935ac588-c3ef-4bc8-915b-666369cdcada',
      variationName: 'variation 1',
      variationValue: 10,
      reason: 'DEFAULT',
    },
  );

  t.is(await bktClient.numberVariation(targetedSegmentUser, FEATURE_ID_FLOAT, 0.0), 2.1);
  assetEvaluationDetails(
    t,
    await bktClient.numberVariationDetails(targetedSegmentUser, FEATURE_ID_FLOAT, 1.1),
    {
      featureId: FEATURE_ID_FLOAT,
      featureVersion: 5,
      userId: targetedSegmentUser.id,
      variationId: '0b04a309-31cd-471f-acf0-0ea662d16737',
      variationName: 'variation 1',
      variationValue: 2.1,
      reason: 'DEFAULT',
    },
  );
});

test('objectVariation', async (t) => {
  const { bktClient, targetedSegmentUser } = t.context;
  t.deepEqual(await bktClient.getJsonVariation(targetedSegmentUser, FEATURE_ID_JSON, {}), {
    str: 'str1',
    int: 'int1',
  });
  t.deepEqual(await bktClient.objectVariation(targetedSegmentUser, FEATURE_ID_JSON, {}), {
    str: 'str1',
    int: 'int1',
  });
  assetEvaluationDetails(
    t,
    await bktClient.objectVariationDetails(targetedSegmentUser, FEATURE_ID_JSON, {}),
    {
      featureId: FEATURE_ID_JSON,
      featureVersion: 5,
      userId: targetedSegmentUser.id,
      variationId: 'ff8299ed-80c9-4d30-9e92-a55750ad3ffb',
      variationName: 'variation 1',
      variationValue: { str: 'str1', int: 'int1' },
      reason: 'DEFAULT',
    },
  );
});
