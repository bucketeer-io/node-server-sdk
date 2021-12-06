import test from 'ava';
import { unwrapMaybe } from 'option-t/lib/Maybe/unwrap';
import { User } from '../../objects/User';
import { Evaluation } from '../../objects/Evaluation';
import { GetEvaluationsState, PlainResponse, createGetEvaluationsAPI } from '../getEvaluations';
import { ReasonType } from '../../objects/Reason';
import { createMockFetch } from './_helper';

function createFixture(): PlainResponse {
  return {
    state: GetEvaluationsState.FULL,
    evaluations: {
      evaluations: [
        {
          id: 'id',
          featureId: 'featureId',
          featureVersion: 0,
          userId: 'userId',
          user: { id: 'id', data: {} },
          variationId: 'variationId',
          variationValue: 'value',
          reason: {
            type: ReasonType.DEFAULT,
          },
        },
      ],
    },
    userEvaluationsId: 'user-evaluations-id',
  };
}

test('getEvaluations: ok', async (t) => {
  const getEvaluations = createGetEvaluationsAPI(
    'host',
    'token',
    createMockFetch(createFixture(), true),
  );
  const user = new User({ id: 'id', data: {} });
  const userEvaluationsId = 'user-evaluations-id';
  const res = await getEvaluations('tag', user, userEvaluationsId);
  t.true(res.ok);
  t.true(unwrapMaybe(res.val).evaluations[0] instanceof Evaluation);
});

test('getEvaluations: false', async (t) => {
  const getEvaluations = createGetEvaluationsAPI(
    'host',
    'token',
    createMockFetch(createFixture(), false),
  );
  const user = new User({ id: 'id', data: {} });
  const userEvaluationsId = 'user-evaluations-id';
  const res = await getEvaluations('tag', user, userEvaluationsId);
  t.false(res.ok);
});
