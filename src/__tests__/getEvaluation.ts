import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createStorage } from '../storage/storage';
import { Evaluation } from '../objects/Evaluation';
import { createBucketeer } from './_helper';
import { ReasonType } from '../objects/Reason';

test('getEvaluation: evaluation exists', (t) => {
  const EXPECTED_EVALUATION_DATA = {
    id: 'id',
    featureId: 'fid',
    featureVersion: 1,
    userId: 'uid',
    variationId: 'vid',
    variationValue: 'val',
    reason: 4,
  };
  const storage = unwrapNullable(createStorage());
  storage.setLatestEvaluations([
    new Evaluation({
      id: 'id',
      featureId: 'fid',
      featureVersion: 1,
      userId: 'uid',
      variationId: 'vid',
      variationValue: 'val',
      reason: {
        type: ReasonType.CLIENT,
      },
    }),
  ]);
  storage.save();
  const bucketeer = createBucketeer();
  const evaluation = bucketeer.getEvaluation('fid');
  bucketeer.destroy();
  t.deepEqual(evaluation, EXPECTED_EVALUATION_DATA);
});

test('getEvaluation: evaluation does not exists', (t) => {
  const storage = unwrapNullable(createStorage());
  storage.setLatestEvaluations([
    new Evaluation({
      id: 'id',
      featureId: 'fid',
      featureVersion: 1,
      userId: 'uid',
      variationId: 'vid',
      variationValue: 'val',
      reason: {
        type: ReasonType.CLIENT,
      },
    }),
  ]);
  storage.save();
  const bucketeer = createBucketeer();
  const evaluation = bucketeer.getEvaluation('noexist');
  bucketeer.destroy();
  t.is(evaluation, null);
});
