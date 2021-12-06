// tslint:disable no-magic-numbers
import test from 'ava';
import { EvaluationEvent } from '../../objects/EvaluationEvent';
import { GoalEvent } from '../../objects/GoalEvent';
import { MetricsEvent } from '../../objects/MetricsEvent';
import { GetEvaluationLatencyMetricsEvent } from '../../objects/GetEvaluationLatencyMetricsEvent';
import { GetEvaluationSizeMetricsEvent } from '../../objects/GetEvaluationSizeMetricsEvent';
import { ReasonType } from '../../objects/Reason';
import { EventStore } from '../EventStore';

function createEvaluationEvent(): EvaluationEvent {
  return new EvaluationEvent({
    featureId: 'featureId',
    featureVersion: 0,
    userId: 'userId',
    variationId: 'variationId',
    reason: {
      type: ReasonType.CLIENT,
    },
    timestamp: 0,
  });
}

function createGoalEvent(): GoalEvent {
  return new GoalEvent({
    goalId: 'goalId',
    userId: 'userId',
    value: 0,
    evaluations: [],
    timestamp: 0,
  });
}

function createGetEvaluationLatencyMetricsEvent(): MetricsEvent {
  return new GoalEvent({
    event: new GetEvaluationLatencyMetricsEvent({
      labels: { tag: 'web', state: 'FULL' },
      duration: '1.123s',
    }).toPlainObject(),
    timestamp: 0,
  });
}

function createGetEvaluationSizeMetricsEvent(): MetricsEvent {
  return new GoalEvent({
    event: new GetEvaluationSizeMetricsEvent({
      labels: { tag: 'web', state: 'FULL' },
      sizeByte: 12345,
    }).toPlainObject(),
    timestamp: 0,
  });
}

function createEvents(): [EvaluationEvent, GoalEvent, MetricsEvent, MetricsEvent] {
  return [
    createEvaluationEvent(),
    createGoalEvent(),
    createGetEvaluationLatencyMetricsEvent(),
    createGetEvaluationSizeMetricsEvent(),
  ];
}

test('EventStore: initialize', (t) => {
  const store = new EventStore(createEvents());
  t.is(store.size(), 4);
});

test('EventStore: add', (t) => {
  const store = new EventStore();
  store.add(createEvaluationEvent());
  store.add(createGoalEvent());
  store.add(createGetEvaluationLatencyMetricsEvent());
  store.add(createGetEvaluationSizeMetricsEvent());
  t.is(store.size(), 4);
});

test('EventStore: getAll', (t) => {
  const store = new EventStore(createEvents());
  t.is(store.getAll().length, 4);
});

test('EventStore: takeout', (t) => {
  const store = new EventStore(createEvents());
  t.is(store.takeout(1).length, 1);
  t.is(store.size(), 3);
});
