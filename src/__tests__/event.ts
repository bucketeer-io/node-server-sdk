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
  createUnknownErrorMetricsEvent,
  createNetworkErrorMetricsEvent,
} from '../objects/metricsEvent';
import { ApiId } from '../objects/apiId';
import {
  createBadRequestErrorMetricsEvent,
  createClientClosedRequestErrorMetricsEvent,
  createForbiddenErrorMetricsEvent,
  createInternalServerErrorMetricsEvent,
  createNotFoundErrorMetricsEvent,
  createPayloadTooLargeErrorMetricsEvent,
  createRedirectRequestErrorMetricsEvent,
  createServiceUnavailableErrorMetricsEvent,
  createUnauthorizedErrorMetricsEvent,
} from '../objects/status';

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
const BAD_REQUEST_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.BadRequestErrorMetricsEvent';
const UNAUTHORIZED_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.UnauthorizedErrorMetricsEvent';
const FORBIDDEN_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ForbiddenErrorMetricsEvent';
const NOT_FOUND_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NotFoundErrorMetricsEvent';
const CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ClientClosedRequestErrorMetricsEvent';
const INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.InternalServerErrorMetricsEvent';
const SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ServiceUnavailableErrorMetricsEvent';
const REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.RedirectionRequestExceptionEvent';
const PAYLOAD_TOO_LARGE_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.PayloadTooLargeExceptionEvent';
const NETWORK_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NetworkErrorMetricsEvent';
const UNKNOWN_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.UnknownErrorMetricsEvent';

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
  t.is(metrics['@type'], METRICS_EVENT_NAME);
  t.is(metrics.sourceId, SourceId.NODE_SERVER);
  t.is(metrics.sdkVersion, version);
  t.deepEqual(metrics.metadata, {});
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

test('createRedirectRequestErrorMetricsEvent', (t) => {
  const redirectRequestErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
      response_code: '301',
    },
    '@type': REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createRedirectRequestErrorMetricsEvent(tag, apiId, 301);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, redirectRequestErrorMetricsEvent);
});

test('createPayloadTooLargeErrorMetricsEvent', (t) => {
  const payloadTooLargeErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': PAYLOAD_TOO_LARGE_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createPayloadTooLargeErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, payloadTooLargeErrorMetricsEvent);
});

test('createForbiddenErrorMetricsEvent', (t) => {
  const forbidenErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': FORBIDDEN_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createForbiddenErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, forbidenErrorMetricsEvent);
});

test('createNotFoundErrorMetricsEvent', (t) => {
  const requestNotFoundErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': NOT_FOUND_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createNotFoundErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, requestNotFoundErrorMetricsEvent);
});

test('createServiceUnavailableErrorMetricsEvent', (t) => {
  const serviceUnavailableErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createServiceUnavailableErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, serviceUnavailableErrorMetricsEvent);
});

test('createUnauthorizedErrorMetricsEvent', (t) => {
  const unauthorizedErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': UNAUTHORIZED_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createUnauthorizedErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, unauthorizedErrorMetricsEvent);
});

test('createInternalServerErrorMetricsEvent', (t) => {
  const internalServerErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createInternalServerErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, internalServerErrorMetricsEvent);
});

test('createClientClosedRequestErrorMetricsEvent', (t) => {
  const clientClosedRequestErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createClientClosedRequestErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, clientClosedRequestErrorMetricsEvent);
});

test('createBadRequestErrorMetricsEvent', (t) => {
  const badRequestErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': BAD_REQUEST_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createBadRequestErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, badRequestErrorMetricsEvent);
});

test('createNetworkErrorMetricsEvent', (t) => {
  const expectedEvent = {
    apiId,
    labels: { tag },
    '@type': NETWORK_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createNetworkErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, expectedEvent);
});

test('createUnknownErrorMetricsEvent without statusCode and errorMessage', (t) => {
  const expectedEvent = {
    apiId,
    labels: { tag },
    '@type': UNKNOWN_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createUnknownErrorMetricsEvent(tag, apiId);
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, expectedEvent);
});

test('createUnknownErrorMetricsEvent with statusCode and errorMessage', (t) => {
  const expectedEvent = {
    apiId,
    labels: {
      tag,
      response_code: '599',
      error_message: 'unknown error',
    },
    '@type': UNKNOWN_ERROR_METRICS_EVENT_NAME,
  };
  const actual = createUnknownErrorMetricsEvent(tag, apiId, 599, 'unknown error');
  const metrics = actual.event as MetricsEvent;
  t.deepEqual(metrics.event, expectedEvent);
});
