import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, defineBKTConfig, initializeBKTClient } from '../../lib';
import {
  HOST,
  SERVER_ROLE_TOKEN,
  FEATURE_TAG,
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_STRING,
  FEATURE_ID_INT,
  FEATURE_ID_JSON,
  FEATURE_ID_FLOAT,
} from '../constants/constants';
import { assetEvaluationDetails } from '../utils/assert';

const test = anyTest as TestFn<{ bktClient: Bucketeer; defaultUser: User }>;

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
    defaultUser: { id: 'user-1', data: {} },
  };
  // Do not call waitForInitialization, manually wait for it in each test using timeout
  await new Promise((resolve) => setTimeout(resolve, 10_000));
});

test.after(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});

test('should be fine if we do not use waitForInitialization', async (t) => {
  const { bktClient, defaultUser } = t.context;
  t.is(await bktClient.booleanVariation(defaultUser, FEATURE_ID_BOOLEAN, false), true);
  assetEvaluationDetails(
    t,
    await bktClient.booleanVariationDetails(defaultUser, FEATURE_ID_BOOLEAN, false),
    {
      featureId: FEATURE_ID_BOOLEAN,
      featureVersion: 5,
      userId: defaultUser.id,
      variationId: 'f948b6dd-c366-4828-8ee0-72edbe2c0eea',
      variationName: 'variation 1',
      variationValue: true,
      reason: 'DEFAULT',
    },
  );
});
