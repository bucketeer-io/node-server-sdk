import test from 'ava';
import { Evaluation } from '../objects/evaluation';
import { SourceId } from '../objects/sourceId';
import { ReasonType, Reason } from '../objects/reason';
import { GoalEvent, createGoalEvent } from '../objects/goalEvent';
import { User } from '../objects/user';
import { createTimestamp } from '../utils/time';
import {
  EvaluationEvent,
  createEvaluationEvent,
  createDefaultEvaluationEvent,
} from '../objects/evaluationEvent';
import {
  createInternalErrorCountMetricsEvent,
  GetEvaluationLatencyMetricsEvent,
  createGetEvaluationSizeMetricsEvent,
  createTimeoutErrorCountMetricsEvent,
  createGetEvaluationLatencyMetricsEvent,
  GetEvaluationSizeMetricsEvent,
  InternalErrorCountMetricsEvent,
  TimeoutErrorCountMetricsEvent,
} from '../objects/metricsEvent';

const version: string = require('../../package.json').version;

const GOAL_EVENT_NAME = 'bucketeer.event.client.GoalEvent';
const EVALUATION_EVENT_NAME = 'bucketeer.event.client.EvaluationEvent';
const METRICS_EVENT_NAME = 'bucketeer.event.client.MetricsEvent';
const GET_EVALUATION_LATENCY_METRICS_EVENT_NAME =
  'bucketeer.event.client.GetEvaluationLatencyMetricsEvent';
const GET_EVALUATION_SIZE_METRICS_EVENT_NAME =
  'bucketeer.event.client.GetEvaluationSizeMetricsEvent';
const INTERNAL_ERROR_COUNT_METRICS_EVENT_NAME =
  'bucketeer.event.client.InternalErrorCountMetricsEvent';
const TIMEOUT_ERROR_COUNT_METRICS_EVENT_NAME =
  'bucketeer.event.client.TimeoutErrorCountMetricsEvent';
const DURATION_NAME = 'type.googleapis.com/google.protobuf.Duration';

const tag = 'tag';
const goalId = 'goalId';
const user: User = {
  id: 'user_id',
  data: {},
};
const value = 3;
const sourceId = SourceId.NODE_SERVER;
const userId = user.id;
const sdkVersion = version;
const metadata = {};
const featureId = 'featureId';
const reason: Reason = {
  type: ReasonType.CLIENT,
};
const id = 'id';
const featureVersion = 7;
const variationId = 'vid';
const variationValue = 'value';
const durationMS = new Date(2000, 1, 2).getTime() - new Date(2000, 1, 2).getTime();
const sizeByte = 1000;

test('createGoalEvent', (t) => {
  const goalEvent: GoalEvent = {
    tag,
    goalId,
    user,
    value,
    sourceId,
    timestamp: createTimestamp(),
    userId,
    sdkVersion,
    metadata,
    '@type': GOAL_EVENT_NAME,
  };
  const actual = createGoalEvent(goalEvent.tag, goalEvent.goalId, user, goalEvent.value);
  t.deepEqual(JSON.parse(actual.event), goalEvent);
});

test('createEvaluationEvent', (t) => {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    timestamp: createTimestamp(),
    featureId,
    featureVersion,
    userId,
    variationId,
    sourceId,
    reason,
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion,
    metadata,
  };
  const evaluation: Evaluation = {
    id,
    featureId,
    featureVersion,
    userId,
    variationId,
    reason,
    variationValue,
  };
  const actual = createEvaluationEvent(tag, user, evaluation);
  t.deepEqual(JSON.parse(actual.event), evaluationEvent);
});

test('createDefaultEvaluationEvent', (t) => {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    timestamp: createTimestamp(),
    featureId,
    featureVersion: 0,
    userId,
    variationId: '',
    sourceId,
    reason,
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion,
    metadata,
  };
  const actual = createDefaultEvaluationEvent(tag, user, featureId);
  t.deepEqual(JSON.parse(actual.event), evaluationEvent);
});

test('createGetEvaluationLatencyMetricsEvent', (t) => {
  const getEvaluationLatencyMetricsEvent: GetEvaluationLatencyMetricsEvent = {
    duration: {
      value: convertMS(durationMS),
      '@type': DURATION_NAME,
    },
    labels: {
      tag,
    },
    '@type': GET_EVALUATION_LATENCY_METRICS_EVENT_NAME,
  };
  const actual = createGetEvaluationLatencyMetricsEvent(tag, durationMS);
  const metrics = JSON.parse(actual.event);
  t.deepEqual(JSON.parse(metrics.event), getEvaluationLatencyMetricsEvent);
});

test('createGetEvaluationSizeMetricsEvent', (t) => {
  const getEvaluationSizeMetricsEvent: GetEvaluationSizeMetricsEvent = {
    sizeByte,
    labels: {
      tag,
    },
    '@type': GET_EVALUATION_SIZE_METRICS_EVENT_NAME,
  };
  const actual = createGetEvaluationSizeMetricsEvent(tag, sizeByte);
  const metrics = JSON.parse(actual.event);
  t.deepEqual(JSON.parse(metrics.event), getEvaluationSizeMetricsEvent);
});

test('createInternalErrorCountMetricsEvent', (t) => {
  const internalErrorCountMetricsEvent: InternalErrorCountMetricsEvent = {
    tag,
    '@type': INTERNAL_ERROR_COUNT_METRICS_EVENT_NAME,
  };
  const actual = createInternalErrorCountMetricsEvent(tag);
  const metrics = JSON.parse(actual.event);
  t.deepEqual(JSON.parse(metrics.event), internalErrorCountMetricsEvent);
});

test('timeoutErrorCountMetricsEvent', (t) => {
  const timeoutErrorCountMetricsEvent: TimeoutErrorCountMetricsEvent = {
    tag,
    '@type': TIMEOUT_ERROR_COUNT_METRICS_EVENT_NAME,
  };
  const actual = createTimeoutErrorCountMetricsEvent(tag);
  const metrics = JSON.parse(actual.event);
  t.deepEqual(JSON.parse(metrics.event), timeoutErrorCountMetricsEvent);
});

function convertMS(ms: number): string {
  return (ms / 1000).toString() + 's';
}
