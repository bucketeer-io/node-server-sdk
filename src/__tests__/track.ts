import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createStorage } from '../storage/storage';
import { EvaluationEvent } from '../objects/EvaluationEvent';
import { SourceId } from '../objects/SourceId';
import { GoalEvent } from '../objects/GoalEvent';
import { createBucketeer } from './_helper';
import { MetricsEvent } from '../objects/MetricsEvent';

function isGoalEvent(event: EvaluationEvent | GoalEvent | MetricsEvent): event is GoalEvent {
  return event instanceof GoalEvent;
}

test('track', (t) => {
  const EXPECTED_GOAL_ID = 'goal-id-1';
  const EXPECTED_USER_ID = 'user';
  const EXPECTED_GOAL_VALUE = 1;
  const bucketeer = createBucketeer();
  bucketeer.track(EXPECTED_GOAL_ID, EXPECTED_GOAL_VALUE);
  bucketeer.destroy();
  const storage = unwrapNullable(createStorage());
  const events = storage.getEvents();
  t.is(events.length, 1);
  const event = isGoalEvent(events[0]) ? events[0] : null;
  t.is(event.sourceId, SourceId.WEB);
  t.is(event.tag, 'web');
  t.is(event.userId, EXPECTED_USER_ID);
  t.is(event.goalId, EXPECTED_GOAL_ID);
  t.is(event.value, EXPECTED_GOAL_VALUE);
  t.true(event.timestamp > 0);
});
