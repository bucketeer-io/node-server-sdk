import test from 'ava';
import { convertRawToEvaluation, Evaluation } from '../Evaluation';

test('Evaluation: convertRawToEvaluation is ok', (t) => {
  // tslint:disable-next-line no-any
  const obj: any = {
    id: 'id',
    featureId: 'featureId',
    featureVersion: 0,
    userId: 'userId',
    user: { id: 'id', data: {} },
    variationId: 'variationId',
    variationValue: 'value',
  };
  const res = convertRawToEvaluation(obj);
  t.true(res.ok);
  t.true(res.val instanceof Evaluation);
});

test('Evaluation: convertRawToEvaluation is not ok', (t) => {
  // tslint:disable-next-line no-any
  const obj: any = {};
  const res = convertRawToEvaluation(obj);
  t.false(res.ok);
});
