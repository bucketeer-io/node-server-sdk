import test from 'ava';
import { Evaluation } from '../objects/evaluation';
import { SourceId } from '../objects/sourceId';
import { Reason } from '../objects/reason';
import { GoalEvent, createGoalEvent, isGoalEvent } from '../objects/goalEvent';
import { User } from '../objects/user';
import { createTimestamp } from '../utils/time';
import {
  EvaluationEvent,
  createEvaluationEvent,
  createDefaultEvaluationEvent,
  isEvaluationEvent,
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
  isMetricsEvent,
  createMetricsEvent,
} from '../objects/metricsEvent';
import { ApiId } from '../objects/apiId';
import {
  RedirectRequestErrorMetricsEvent,
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
const defaultSourceId = SourceId.NODE_SERVER;
const sourceIds = Object.values(SourceId);

const userId = user.id;
const sdkVersion = '3.1.2-test';
const metadata = {};
const featureId = 'featureId';
const reason: Reason = {
  type: 'CLIENT',
};
const id = 'id';
const featureVersion = 7;
const variationId = 'vid';
const variationValue = 'value';
const variationName = 'variationName';
const second = (new Date(2000, 1, 2).getTime() - new Date(2000, 1, 2).getTime()) / 1000;
const sizeByte = 1000;
const apiId = ApiId.GET_EVALUATION;

test('createGoalEvent', (t) => {
  for (const sourceId of sourceIds) {
    const goalEvent: GoalEvent = {
      tag,
      goalId,
      user,
      value,
      sourceId: sourceId,
      timestamp: createTimestamp(),
      userId,
      sdkVersion,
      metadata,
      '@type': GOAL_EVENT_NAME,
    };
    const actual = createGoalEvent(
      goalEvent.tag,
      goalEvent.goalId,
      user,
      goalEvent.value,
      sourceId,
      sdkVersion,
    );
    t.true(isGoalEvent(goalEvent));
    t.true(isGoalEvent(actual.event));
    t.deepEqual(actual.event, goalEvent);
  }
});

test('isNotGoalEvent', (t) => {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    timestamp: createTimestamp(),
    featureId,
    featureVersion,
    userId,
    variationId,
    sourceId: defaultSourceId,
    reason,
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion,
    metadata,
  };
  const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
    apiId,
    latencySecond: second,
    labels: {
      tag,
    },
    '@type': LATENCY_METRICS_EVENT_NAME,
  };
  t.false(isGoalEvent(evaluationEvent));
  t.false(isGoalEvent(getEvaluationLatencyMetricsEvent));
});

test('createEvaluationEvent', (t) => {
  for (const sourceId of sourceIds) {
    const evaluationEvent: EvaluationEvent = {
      tag,
      user,
      timestamp: createTimestamp(),
      featureId,
      featureVersion,
      userId,
      variationId,
      sourceId: sourceId,
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
      variationName,
    };
    const actual = createEvaluationEvent(tag, user, evaluation, sourceId, sdkVersion);
    t.true(isEvaluationEvent(actual.event));
    t.deepEqual(actual.event, evaluationEvent);
  }
});

test('isNotEvaluationEvent', (t) => {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    timestamp: createTimestamp(),
    featureId,
    featureVersion,
    userId,
    variationId,
    sourceId: defaultSourceId,
    reason,
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion,
    metadata,
  };
  const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
    apiId,
    latencySecond: second,
    labels: {
      tag,
    },
    '@type': LATENCY_METRICS_EVENT_NAME,
  };
  const goalEvent: GoalEvent = {
    tag,
    goalId,
    user,
    value,
    sourceId: defaultSourceId,
    timestamp: createTimestamp(),
    userId,
    sdkVersion,
    metadata,
    '@type': GOAL_EVENT_NAME,
  };
  t.true(isEvaluationEvent(evaluationEvent));
  t.false(isEvaluationEvent(goalEvent));
  t.false(isEvaluationEvent(getEvaluationLatencyMetricsEvent));
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
    sourceId: defaultSourceId,
    reason,
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion,
    metadata,
  };
  const actual = createDefaultEvaluationEvent(tag, user, featureId, defaultSourceId, sdkVersion);
  t.deepEqual(actual.event, evaluationEvent);
});

test('createLatencyMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
      apiId,
      latencySecond: second,
      labels: {
        tag,
      },
      '@type': LATENCY_METRICS_EVENT_NAME,
    };
    const actual = createLatencyMetricsEvent(tag, second, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.is(metrics['@type'], METRICS_EVENT_NAME);
    t.is(metrics.sourceId, sourceId);
    t.is(metrics.sdkVersion, sdkVersion);
    t.deepEqual(metrics.metadata, {});
    t.deepEqual(metrics.event, getEvaluationLatencyMetricsEvent);
    t.true(isMetricsEvent(metrics));
  }
});

test('isMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const evaluationEvent: EvaluationEvent = {
      tag,
      user,
      timestamp: createTimestamp(),
      featureId,
      featureVersion,
      userId,
      variationId,
      sourceId: sourceId,
      reason,
      '@type': EVALUATION_EVENT_NAME,
      sdkVersion,
      metadata,
    };
    const goalEvent: GoalEvent = {
      tag,
      goalId,
      user,
      value,
      sourceId: sourceId,
      timestamp: createTimestamp(),
      userId,
      sdkVersion,
      metadata,
      '@type': GOAL_EVENT_NAME,
    };
    const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
      apiId,
      latencySecond: second,
      labels: {
        tag,
      },
      '@type': LATENCY_METRICS_EVENT_NAME,
    };

    const timeoutErrorMetricsEvent: TimeoutErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': TIMEOUT_ERROR_METRICS_EVENT_NAME,
    };

    const redirectRequestErrorMetricsEvent: RedirectRequestErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
        response_code: '301',
      },
      '@type': REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME,
    };

    const successMetrics = createMetricsEvent(getEvaluationLatencyMetricsEvent, sourceId, sdkVersion);
    const errorMetrics = createMetricsEvent(timeoutErrorMetricsEvent, sourceId, sdkVersion);
    const statusMetrics = createMetricsEvent(redirectRequestErrorMetricsEvent, sourceId, sdkVersion);

    t.true(isMetricsEvent(successMetrics));
    t.true(isMetricsEvent(errorMetrics));
    t.true(isMetricsEvent(statusMetrics));

    t.false(isMetricsEvent(goalEvent));
    t.false(isMetricsEvent(evaluationEvent));
  }
});

test('createSizeMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const getEvaluationSizeMetricsEvent: SizeMetricsEvent = {
      apiId,
      sizeByte,
      labels: {
        tag,
      },
      '@type': SIZE_METRICS_EVENT_NAME,
    };
    const actual = createSizeMetricsEvent(tag, sizeByte, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, getEvaluationSizeMetricsEvent);
  }
});

test('createInternalSdkErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const internalErrorMetricsEvent: InternalSdkErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': INTERNAL_SDK_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createInternalSdkErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, internalErrorMetricsEvent);
  }
});

test('timeoutErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const timeoutErrorMetricsEvent: TimeoutErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': TIMEOUT_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createTimeoutErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, timeoutErrorMetricsEvent);
  }
});

test('createRedirectRequestErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const redirectRequestErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
        response_code: '301',
      },
      '@type': REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createRedirectRequestErrorMetricsEvent(tag, apiId, 301, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, redirectRequestErrorMetricsEvent);
  }
});

test('createPayloadTooLargeErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const payloadTooLargeErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': PAYLOAD_TOO_LARGE_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createPayloadTooLargeErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, payloadTooLargeErrorMetricsEvent);
  }
});

test('createForbiddenErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const forbidenErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': FORBIDDEN_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createForbiddenErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, forbidenErrorMetricsEvent);
  }
});

test('createNotFoundErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const requestNotFoundErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': NOT_FOUND_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createNotFoundErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, requestNotFoundErrorMetricsEvent);
  }
});

test('createServiceUnavailableErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const serviceUnavailableErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createServiceUnavailableErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, serviceUnavailableErrorMetricsEvent);
  }
});

test('createUnauthorizedErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const unauthorizedErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': UNAUTHORIZED_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createUnauthorizedErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, unauthorizedErrorMetricsEvent);
  }
});

test('createInternalServerErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const internalServerErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createInternalServerErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, internalServerErrorMetricsEvent);
  }
});

test('createClientClosedRequestErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const clientClosedRequestErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createClientClosedRequestErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, clientClosedRequestErrorMetricsEvent);
  }
});

test('createBadRequestErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const badRequestErrorMetricsEvent = {
      apiId,
      labels: {
        tag,
      },
      '@type': BAD_REQUEST_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createBadRequestErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, badRequestErrorMetricsEvent);
  }
});

test('createNetworkErrorMetricsEvent', (t) => {
  for (const sourceId of sourceIds) {
    const expectedEvent = {
      apiId,
      labels: { tag },
      '@type': NETWORK_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createNetworkErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, expectedEvent);
  }
});

test('createUnknownErrorMetricsEvent without statusCode and errorMessage', (t) => {
  for (const sourceId of sourceIds) {
    const expectedEvent = {
      apiId,
      labels: { tag },
      '@type': UNKNOWN_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createUnknownErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, expectedEvent);
  }
});

test('createUnknownErrorMetricsEvent with statusCode and errorMessage', (t) => {
  for (const sourceId of sourceIds) {
    const expectedEvent = {
      apiId,
      labels: {
        tag,
        response_code: '599',
        error_message: 'unknown error',
      },
      '@type': UNKNOWN_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createUnknownErrorMetricsEvent(tag, apiId, sourceId, sdkVersion, 599, 'unknown error');
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, expectedEvent);
  }
});

test('createInternalSdkErrorMetricsEvent with errorMessage', (t) => {
  for (const sourceId of sourceIds) {
    const expectedEvent = {
      apiId,
      labels: {
        tag,
        error_message: 'internal error',
      },
      '@type': INTERNAL_SDK_ERROR_METRICS_EVENT_NAME,
    };
    const actual = createInternalSdkErrorMetricsEvent(tag, apiId, sourceId, sdkVersion, 'internal error');
    const metrics = actual.event as MetricsEvent;
    t.deepEqual(metrics.event, expectedEvent);
  }
});
