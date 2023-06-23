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
  createInternalSdkErrorMetricsEvent,
  LatencyMetricsEvent,
  createSizeMetricsEvent,
  createTimeoutErrorMetricsEvent,
  createLatencyMetricsEvent,
  SizeMetricsEvent,
  InternalSdkErrorMetricsEvent,
  TimeoutErrorMetricsEvent,
	MetricsEvent,
} from '../objects/metricsEvent';
import { ApiId } from '../objects/apiId';

const version: string = require('../../package.json').version;

const GOAL_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.GoalEvent';
const EVALUATION_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.EvaluationEvent';
const METRICS_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.MetricsEvent';
const LATENCY_METRICS_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.LatencyMetricsEvent';
const SIZE_METRICS_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.SizeMetricsEvent';
const INTERNAL_SDK_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.InternalSdkErrorMetricsEvent';
const TIMEOUT_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.TimeoutErrorMetricsEvent';

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
const second = (new Date(2000, 1, 2).getTime() - new Date(2000, 1, 2).getTime()) / 1000;
const sizeByte = 1000;
const apiId = ApiId.GET_EVALUATION;

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
  t.deepEqual(actual.event, goalEvent);
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
  t.deepEqual(actual.event, evaluationEvent);
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
  t.deepEqual(actual.event, evaluationEvent);
});

test('createLatencyMetricsEvent', (t) => {
  const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
    apiId,
    latencySecond: second,
    labels: {
      tag,
    },
    '@type': LATENCY_METRICS_EVENT_NAME,
  };
  const actual = createLatencyMetricsEvent(tag, second, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, getEvaluationLatencyMetricsEvent);
});

test('createSizeMetricsEvent', (t) => {
  const getEvaluationSizeMetricsEvent: SizeMetricsEvent = {
    apiId,
    sizeByte,
    labels: {
      tag,
    },
    '@type': SIZE_METRICS_EVENT_NAME,
  };
  const actual = createSizeMetricsEvent(tag, sizeByte, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, getEvaluationSizeMetricsEvent);
});

test('createInternalSdkErrorMetricsEvent', (t) => {
  const internalErrorMetricsEvent: InternalSdkErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': INTERNAL_SDK_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createInternalSdkErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, internalErrorMetricsEvent);
});

test('timeoutErrorMetricsEvent', (t) => {
  const timeoutErrorMetricsEvent: TimeoutErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': TIMEOUT_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createTimeoutErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, timeoutErrorMetricsEvent);
});

function convertMS(ms: number): string {
  return (ms / 1000).toString() + 's';
}
