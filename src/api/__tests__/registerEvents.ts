import test from 'ava';
import { isNullOrUndefined } from 'option-t/lib/Maybe/Maybe';
import { unwrapMaybe } from 'option-t/lib/Maybe/unwrap';
import { EvaluationEvent } from '../../objects/EvaluationEvent';
import { GoalEvent } from '../../objects/GoalEvent';
import { MetricsEvent } from '../../objects/MetricsEvent';
import { GetEvaluationLatencyMetricsEvent } from '../../objects/GetEvaluationLatencyMetricsEvent';
import { GetEvaluationSizeMetricsEvent } from '../../objects/GetEvaluationSizeMetricsEvent';
import { ReasonType } from '../../objects/Reason';
import { createRegisterEventsAPI } from '../registerEvents';
import { createMockFetch } from './_helper';

function createEvents(): [EvaluationEvent, GoalEvent] {
  return [
    new EvaluationEvent({
      featureId: 'featureId',
      featureVersion: 0,
      userId: 'userId',
      variationId: 'variationId',
      reason: {
        type: ReasonType.CLIENT,
      },
      timestamp: 0,
    }),
    new GoalEvent({
      goalId: 'goalId',
      userId: 'userId',
      value: 0,
      evaluations: [],
      timestamp: 0,
    }),
    new MetricsEvent({
      event: new GetEvaluationLatencyMetricsEvent({
        labels: { tag: 'web', state: 'FULL' },
        duration: '1.123s',
      }).toPlainObject(),
      timestamp: 0,
    }),
    new MetricsEvent({
      event: new GetEvaluationSizeMetricsEvent({
        labels: { tag: 'web', state: 'FULL' },
        sizeByte: 12345,
      }).toPlainObject(),
      timestamp: 0,
    }),
  ];
}

test('registerEvents: ok', async (t) => {
  const registerEvents = createRegisterEventsAPI('host', 'token', createMockFetch({}, true));
  const events = createEvents();
  const res = await registerEvents(events);
  t.true(res.ok);
  t.true(isNullOrUndefined(unwrapMaybe(res.val).errors));
});

test('registerEvents', async (t) => {
  const registerEvents = createRegisterEventsAPI('host', 'token', createMockFetch({}, false));
  const events = createEvents();
  const res = await registerEvents(events);
  t.false(res.ok);
});
