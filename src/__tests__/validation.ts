import test from 'ava';
import { User } from '../objects/user';
import { isValidUser, assertGetEvaluationRequest } from '../validation';

test('isValidUser returns true for valid user', t => {
  const user: User = {
    id: '123',
    data: {}
  };
  t.true(isValidUser(user));
});

test('isValidUser returns false for user without id', t => {
  const user: User = {
    id: '',
    data: {}
  };
  t.false(isValidUser(user));
});

test('assertGetEvaluationRequest throws error for invalid user', t => {
  const user: User = {
    id: '',
    data: {}
  };
  const error = t.throws(() => {
    assertGetEvaluationRequest(user, 'feature1');
  }, { instanceOf: Error });
  t.is(error.message, 'invalid user: [object Object]');
});

test('assertGetEvaluationRequest throws error for missing featureID', t => {
  const user: User = {
    id: '123',
    data: {}
  };
  const error = t.throws(() => {
    assertGetEvaluationRequest(user, '');
  }, { instanceOf: Error });
  t.is(error.message, 'featureID is required');
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


