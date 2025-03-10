import anyTest, { TestFn } from 'ava';
import { Bucketeer, initialize } from '..';
import { Config, User } from '../bootstrap';
import { DefaultLogger } from '../logger';
import { newDefaultBKTEvaluationDetails } from '../evaluationDetails';
import { BKTClientImpl } from '../client';

const test = anyTest as TestFn<{
  bktClient: Bucketeer;
  targetedUser: User;
  config: Config;
}>;

test.beforeEach((t) => {
  const config = {
    host: 'api.bucketeer.io',
    token: 'api_key_value',
    tag: 'feature_tag_value',
    logger: new DefaultLogger('expected'),
  };
  t.context = {
    bktClient: initialize(config),
    targetedUser: { id: 'user_id', data: {} },
    config: config,
  };
});

const testCases = [
  {
    description: 'return default value when featureID is empty',
    featureId: '',
    user: { id: 'user_id', data: {} },
    expected: newDefaultBKTEvaluationDetails('user_id', '', 'default-test', 'DEFAULT'),
  },
  {
    description: 'return default value when userID is empty',
    featureId: 'stringEvaluationDetails',
    user: { id: '', data: {} },
    expected: newDefaultBKTEvaluationDetails('', 'stringEvaluationDetails', 'default-test', 'DEFAULT'),
  },
  {
    description: 'return default value when userID & featureID is empty',
    featureId: '',
    user: { id: '', data: {} },
    expected: newDefaultBKTEvaluationDetails('', '', 'default-test', 'DEFAULT'),
  },
  // Simulate the case where the object is null when passed from JavaScript code.
  {
    description: 'return default value when userID is null',
    featureId: 'featureId',
    user: null,
    expected: newDefaultBKTEvaluationDetails('', 'featureId', 'default-test', 'DEFAULT'),
  },
  {
    description: 'return default value when featureId is null',
    featureId: null,
    user: { id: 'user_id', data: {} },
    expected: newDefaultBKTEvaluationDetails('user_id', '', 'default-test', 'DEFAULT'),
  },
  {
    description: 'return default value when featureId & userID is null',
    featureId: null,
    user: null,
    expected: newDefaultBKTEvaluationDetails('', '', 'default-test', 'DEFAULT'),
  },
  // Simulate the case where the user.id is null when passed from JavaScript code.
  {
    description: 'return default value when user.id is null',
    featureId: 'featureId',
    user: { id: null, data: {} },
    expected: newDefaultBKTEvaluationDetails('', 'featureId', 'default-test', 'DEFAULT'),
  },
  // Simulate the case where the user.id is undefined when passed from JavaScript code.
  {
    description: 'return default value when user.id is undefined',
    featureId: 'featureId',
    user: { id: undefined, data: {} },
    expected: newDefaultBKTEvaluationDetails('', 'featureId', 'default-test', 'DEFAULT'),
  },
  // Simulate the case where the object is undefined when passed from JavaScript code.
  {
    description: 'return default value when userID is undefined',
    featureId: 'featureId',
    user: undefined,
    expected: newDefaultBKTEvaluationDetails('', 'featureId', 'default-test', 'DEFAULT'),
  },
  {
    description: 'return default value when featureId is undefined',
    featureId: undefined,
    user: { id: 'user_id', data: {} },
    expected: newDefaultBKTEvaluationDetails('user_id', '', 'default-test', 'DEFAULT'),
  },
  {
    description: 'return default value when featureId & userID is undefined',
    featureId: undefined,
    user: undefined,
    expected: newDefaultBKTEvaluationDetails('', '', 'default-test', 'DEFAULT'),
  },
];

for (const testCase of testCases) {
  test.serial(`getEvaluation: ${testCase.description}`, async (t) => {
    const client = t.context.bktClient;
    const clientImpl = client as BKTClientImpl;

    t.deepEqual(
      // Type cast for simulate the case where the user object is null when passed from JavaScript code.
      await client.stringVariationDetails(testCase.user as User, testCase.featureId as string, 'default-test'),
      testCase.expected,
    );
    t.true(clientImpl.eventStore.size() == 0, 'eventStore should be empty and not contain any error events');
  });
}

test.afterEach.always((t) => {
  t.context.bktClient.destroy();
});