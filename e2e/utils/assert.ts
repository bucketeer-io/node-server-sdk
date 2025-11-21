import { ExecutionContext } from 'ava';
import { BKTValue } from '../../src/types';
import { BKTEvaluationDetails } from '../../lib/evaluationDetails';

function assetEvaluationDetails(
  t: ExecutionContext<unknown>,
  actual: BKTEvaluationDetails<BKTValue>,
  expected: BKTEvaluationDetails<BKTValue>,
) {
  // Skipped check on the featureVersion
  t.is(actual.featureId, expected.featureId);
  t.is(actual.userId, expected.userId);
  t.is(actual.variationId, expected.variationId);
  t.is(actual.variationName, expected.variationName);
  t.deepEqual(actual.variationValue, expected.variationValue);
  t.is(actual.reason, expected.reason);
}

export { assetEvaluationDetails };
