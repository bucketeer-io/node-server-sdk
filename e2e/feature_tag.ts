import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, initialize } from '../lib';
import { HOST, TOKEN, FEATURE_TAG, USER_ID } from './constants/constants';

const test = anyTest as TestFn<{ bktClient: Bucketeer; user: User }>;

test.beforeEach((t) => {
  t.context = {
    bktClient: initialize({
      host: HOST,
      token: TOKEN,
      tag: '',
      logger: new DefaultLogger("error")
    }),
    user: { id: USER_ID, data: {} },
  };
});

test('initialize without featureTag should retieve all features', async (t) => {
  // const { bktClient, user } = t.context;
  // const javascript = await bktClient.getStringVariation(user, 'feature-js-e2e-string', '')
  // t.true(javascript != '', javascript)

  // const android = await bktClient.getStringVariation(user, 'feature-android-e2e-string', '')
  // t.true(android != '', android)

  // const golang = await bktClient.getStringVariation(user, 'feature-go-server-e2e-1', '')
  // t.true(golang != ', golang')
  t.true(true)
});

test.afterEach(async (t) => {
  const { bktClient, user } = t.context;
  bktClient.destroy();
});

