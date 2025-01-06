import test from 'ava';
import { BKTValue } from '../types';
import { newDefaultBKTEvaluationDetails } from '../evaluationDetails';

// List of test cases
const newDefaultBKTEvaluationDetailsTests: BKTValue[] = [
  'default true',
  1,
  12.1,
  [],
  {},
  { key1: 'value1' },
  { key1: 'value1', key2: 'value1', key3: 'value1' },
  { key1: [1, 2, 3], key2: 'value1', key3: 'value1' },
  [1, 2, 3],
  true,
  false,
];

newDefaultBKTEvaluationDetailsTests.forEach((defaultValue, index) => {
  test(`newDefaultBKTEvaluationDetails test case ${index + 1} input: ${defaultValue}`, (t) => {
    const featureId = 'test_flag';
    const userId = 'user1';
    let output = newDefaultBKTEvaluationDetails(userId, featureId, defaultValue);
    t.deepEqual(output, {
      featureId: featureId,
      featureVersion: 0,
      userId: userId,
      variationId: '',
      variationName: '',
      variationValue: defaultValue,
      reason: 'CLIENT',
    });
  });
});

test('newDefaultBKTEvaluationDetails should return correct reason `DEFAULT`', (t) => {
  const featureId = 'test_flag';
  const userId = 'user1';
  let output = newDefaultBKTEvaluationDetails(userId, featureId, 'default true', 'DEFAULT');
  t.deepEqual(output, {
    featureId: featureId,
    featureVersion: 0,
    userId: userId,
    variationId: '',
    variationName: '',
    variationValue: 'default true',
    reason: 'DEFAULT',
  });
});
