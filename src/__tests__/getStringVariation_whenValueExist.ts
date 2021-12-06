import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createStorage } from '../storage/storage';
import { Evaluation } from '../objects/Evaluation';
import { ReasonType } from '../objects/Reason';
import { createBucketeer } from './_helper';
import { EvaluationEvent } from '../objects/EvaluationEvent';
import { GoalEvent } from '../objects/GoalEvent';
import { MetricsEvent } from '../objects/MetricsEvent';
import { SourceId } from '../objects/SourceId';

function isEvaluationEvent(
  event: EvaluationEvent | GoalEvent | MetricsEvent,
): event is EvaluationEvent {
  return event instanceof EvaluationEvent;
}

test('getStringVariation: when a value exists', (t) => {
  const EVALUATION_ID = 'id';
  const EXPECTED_FEATURE_ID = 'feature-id';
  const EXPECTED_FEATURE_VERSION = 1;
  const EXPECTED_USER_ID = 'user';
  const EXPECTED_VARIATION_ID = 'variation-id';
  const EXPECTED_VARIATION_VALUE = 'variation-value';
  const EXPECTED_REASON = ReasonType.DEFAULT;
  let storage = unwrapNullable(createStorage());
  storage.setLatestEvaluations([
    new Evaluation({
      id: EVALUATION_ID,
      featureId: EXPECTED_FEATURE_ID,
      featureVersion: EXPECTED_FEATURE_VERSION,
      userId: EXPECTED_USER_ID,
      variationId: EXPECTED_VARIATION_ID,
      variationValue: EXPECTED_VARIATION_VALUE,
      reason: {
        type: EXPECTED_REASON,
      },
    }),
  ]);
  storage.save();
  const bucketeer = createBucketeer();
  const variationValue = bucketeer.getStringVariation(EXPECTED_FEATURE_ID, 'default-value-1');
  bucketeer.destroy();
  storage = unwrapNullable(createStorage());
  const events = storage.getEvents();
  const event = isEvaluationEvent(events[0]) ? events[0] : null;
  t.is(variationValue, EXPECTED_VARIATION_VALUE);
  t.is(events.length, 1);
  t.is(event.sourceId, SourceId.WEB);
  t.is(event.tag, 'web');
  t.is(event.featureId, EXPECTED_FEATURE_ID);
  t.is(event.featureVersion, EXPECTED_FEATURE_VERSION);
  t.is(event.userId, EXPECTED_USER_ID);
  t.deepEqual(event.user.toPlainObject(), bucketeer.getUser());
  t.is(event.variationId, EXPECTED_VARIATION_ID);
  t.is(event.reason.type, EXPECTED_REASON);
  t.true(event.timestamp > 0);
});
