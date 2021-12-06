import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createStorage } from '../storage/storage';
import { EvaluationEvent } from '../objects/EvaluationEvent';
import { GoalEvent } from '../objects/GoalEvent';
import { createBucketeer } from './_helper';
import { ReasonType } from '../objects/Reason';
import { MetricsEvent } from '../objects/MetricsEvent';
import { SourceId } from '../objects/SourceId';

function isEvaluationEvent(
  event: EvaluationEvent | GoalEvent | MetricsEvent,
): event is EvaluationEvent {
  return event instanceof EvaluationEvent;
}

test('getStringVariation: default evaluation', (t) => {
  const EXPECTED_FEATURE_ID = 'feature-id-1';
  const EXPECTED_VARIATION_VALUE = 'default-value-1';
  const bucketeer = createBucketeer();
  const variationValue = bucketeer.getStringVariation(
    EXPECTED_FEATURE_ID,
    EXPECTED_VARIATION_VALUE,
  );
  bucketeer.destroy();
  const storage = unwrapNullable(createStorage());
  const events = storage.getEvents();
  const event = isEvaluationEvent(events[0]) ? events[0] : null;
  t.is(variationValue, EXPECTED_VARIATION_VALUE);
  t.is(event.sourceId, SourceId.WEB);
  t.is(event.tag, 'web');
  t.is(event.featureId, EXPECTED_FEATURE_ID);
  t.is(event.featureVersion, 0);
  t.is(event.userId, bucketeer.getUser().id);
  t.deepEqual(event.user.toPlainObject(), bucketeer.getUser());
  t.is(event.variationId, '');
  t.is(event.reason.type, ReasonType.CLIENT);
});
