import test from 'ava';
import { User } from '../objects/user';
import { assertGetEvaluationRequest } from '../assert';

const assertGetEvaluationRequestTestCases = [
  {
    name: 'assertGetEvaluationRequest throws error for invalid user',
    user: { id: '', data: {} },
    featureID: 'feature1',
    errorMessage: 'userID is empty'
  },
  {
    name: 'assertGetEvaluationRequest throws error for missing featureID',
    user: { id: '123', data: {} },
    featureID: '',
    errorMessage: 'featureID is required'
  },
  {
    name: 'assertGetEvaluationRequest throws error for null user',
    user: null as any,
    featureID: 'feature1',
    errorMessage: 'user is null or undefined'
  },
  {
    name: 'assertGetEvaluationRequest throws error for undefined user',
    user: undefined as any,
    featureID: 'feature1',
    errorMessage: 'user is null or undefined'
  },
  {
    name: 'assertGetEvaluationRequest throws error for user with null id',
    user: { id: null as any, data: {} },
    featureID: 'feature1',
    errorMessage: 'userID is empty'
  },
  {
    name: 'assertGetEvaluationRequest throws error for user with undefined id',
    user: { id: undefined as any, data: {} },
    featureID: 'feature1',
    errorMessage: 'userID is empty'
  },
  {
    name: 'assertGetEvaluationRequest throws error for null featureID',
    user: { id: '123', data: {} },
    featureID: null as any,
    errorMessage: 'featureID is required'
  },
  {
    name: 'assertGetEvaluationRequest throws error for undefined featureID',
    user: { id: '123', data: {} },
    featureID: undefined as any,
    errorMessage: 'featureID is required'
  }
];

assertGetEvaluationRequestTestCases.forEach(testCase => {
  test(testCase.name, t => {
    const error = t.throws(() => {
      assertGetEvaluationRequest(testCase.user, testCase.featureID);
    }, { instanceOf: Error });
    t.is(error.message, testCase.errorMessage);
  });
});

test('assertGetEvaluationRequest does not throw error for valid user and featureID', t => {
  const user: User = {
    id: '123',
    data: {}
  };
  t.notThrows(() => {
    assertGetEvaluationRequest(user, 'feature1');
  });
});


