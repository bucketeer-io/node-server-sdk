import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { Evaluation } from '../../objects/Evaluation';
import { ReasonType } from '../../objects/Reason';
import { EvaluationStore } from '../EvaluationStore';

function createEvaluation(): Evaluation {
  return new Evaluation({
    id: 'id',
    featureId: 'featureId',
    featureVersion: 0,
    userId: 'userId',
    variationId: 'variationId',
    variationValue: 'value',
    reason: {
      type: ReasonType.DEFAULT,
    },
  });
}

test('EvaluationStore: initialize', (t) => {
  const store = new EvaluationStore([createEvaluation()]);
  t.is(store.getAll().length, 1);
});

test('EvaluationStore: set', (t) => {
  const store = new EvaluationStore();
  store.set(createEvaluation());
  t.is(store.getAll().length, 1);
});

test('EvaluationStore: setFromList', (t) => {
  const store = new EvaluationStore();
  store.setFromList([createEvaluation()]);
  t.is(store.getAll().length, 1);
});

test('EvaluationStore: get', (t) => {
  const store = new EvaluationStore([createEvaluation()]);
  t.true(unwrapNullable(store.get('featureId')) instanceof Evaluation);
});

test('EvaluationStore: getAllKeys', (t) => {
  const store = new EvaluationStore([createEvaluation()]);
  t.is(store.getAllKeys()[0], 'featureId');
});

test('EvaluationStore: sift', (t) => {
  const store = new EvaluationStore([createEvaluation()]);
  store.sift(['featureId']);
  t.is(store.getAll().length, 1);
});

test('EvaluationStore: clear', (t) => {
  const store = new EvaluationStore([createEvaluation()]);
  store.clear();
  t.is(store.getAll().length, 0);
});
