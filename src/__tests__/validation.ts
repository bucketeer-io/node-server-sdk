import test from 'ava';
import { Client } from '../rest/client';
import { v4 } from 'uuid';

const port = 9999;
const host = `localhost:${port}`;
const apiKey = '';

test('validateGetEvaluation: featureVersion is invalid', async (t) => {
  const client = new Client(host, apiKey);
  const res = {
    evaluation: {
      id: v4(),
      featureId: 'feature_id',
      featureVersion: '2',
      userId: 'user_id',
      variationId: v4(),
      variation: {
        id: v4(),
        value: 'value-1',
      },
      reason: {
        type: 3,
      },
      variationValue: 'value-1',
    },
  };
  let err = '';
  try {
    (client as any).validateGetEvaluation(res);
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'featureVersion is invalid');
});

test('validateGetEvaluation: evaluationId is invalid', async (t) => {
  const client = new Client(host, apiKey);
  const res = {
    evaluation: {
      featureId: 'feature_id',
      featureVersion: 2,
      userId: 'user_id',
      variationId: v4(),
      variation: {
        id: v4(),
        value: 'value-1',
      },
      reason: {
        type: 3,
      },
      variationValue: 'value-1',
    },
  };
  let err = '';
  try {
    (client as any).validateGetEvaluation(res);
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'id is invalid');
});

test('validateGetEvaluation: variationValue is invalid', async (t) => {
  const client = new Client(host, apiKey);
  const res = {
    evaluation: {
      id: v4(),
      featureId: 'feature_id',
      featureVersion: 2,
      userId: 'user_id',
      variationId: v4(),
      reason: {
        type: 3,
      },
      variationValue: 1,
    },
  };
  let err = '';
  try {
    (client as any).validateGetEvaluation(res);
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'variationValue is invalid');
});

test('validateRegisterEvents: errors is invalid', async (t) => {
  const client = new Client(host, apiKey);
  const res = {};
  let err = '';
  try {
    (client as any).validateRegisterEvents(res);
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'errors is invalid');
});

test('validateRegisterEvents: retriable is invalid', async (t) => {
  const client = new Client(host, apiKey);
  const res = {
    errors: { key: { message: 'Invalid message type' } },
  };
  let err = '';
  try {
    (client as any).validateRegisterEvents(res);
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'error retriable is invalid');
});
