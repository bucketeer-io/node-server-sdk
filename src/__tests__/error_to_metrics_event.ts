import test from 'ava';
import {
  createTimeoutErrorMetricsEvent,
  createUnknownErrorMetricsEvent,
  createNetworkErrorMetricsEvent,
  toErrorMetricsEvent,
  createInternalSdkErrorMetricsEvent,
} from '../objects/metricsEvent';
import { ApiId } from '../objects/apiId';
import {
  createBadRequestErrorMetricsEvent,
  createInternalServerErrorMetricsEvent,
  createNotFoundErrorMetricsEvent,
  createPayloadTooLargeErrorMetricsEvent,
  createServiceUnavailableErrorMetricsEvent,
} from '../objects/status';
import {
  IllegalStateError,
  IllegalArgumentError,
  TimeoutError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  PayloadTooLargeError,
  InternalServerError,
  ServiceUnavailableError,
  NetworkError,
  UnknownError,
} from '../objects/errors';
import { SourceId } from '../objects/sourceId';

const sdkVersion = '3.0.1-test';

test('toErrorMetricsEvent returns correct event for IllegalStateError', (t) => {
  const error = new IllegalStateError('Feature not found');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createInternalSdkErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
    'Feature not found',
  ).event;
  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for IllegalArgumentError', (t) => {
  const error = new IllegalArgumentError('Input string must be non-blank');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createInternalSdkErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
    'Input string must be non-blank',
  ).event;
  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for BadRequestError (400)', (t) => {
  const error = new BadRequestError('Bad Request');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createBadRequestErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  ).event;

  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('skip generating error events for UnauthorizedError (401)', (t) => {
  const error = new UnauthorizedError('Unauthorized');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  );

  t.is(actualEvent, null);
});

test('skip generating error events for ForbiddenError (403)', (t) => {
  const error = new ForbiddenError('ForbiddenError');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  );

  t.is(actualEvent, null);
});

test('toErrorMetricsEvent returns correct event for NotFoundError (404)', (t) => {
  const error = new NotFoundError('Not Found');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createNotFoundErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  ).event;
  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for TimeoutError (408)', (t) => {
  const error = new TimeoutError(0, 'Request Timeout');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createTimeoutErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  ).event;

  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for PayloadTooLargeError (413)', (t) => {
  const error = new PayloadTooLargeError('Payload Too Large');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createPayloadTooLargeErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  ).event;
  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for InternalServerError (500)', (t) => {
  const error = new InternalServerError('Internal Server Error');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createInternalServerErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  ).event;

  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for ServiceUnavailableError (502/503/504)', (t) => {
  const codes = [502, 503, 504];
  codes.forEach(() => {
    const error = new ServiceUnavailableError('Service Unavailable');
    const tag = 'test-tag';
    const apiId = ApiId.GET_EVALUATION;

    const expectedEvent = createServiceUnavailableErrorMetricsEvent(
      tag,
      apiId,
      SourceId.OPEN_FEATURE_NODE,
      sdkVersion,
    ).event;

    const actualEvent = toErrorMetricsEvent(
      error,
      tag,
      apiId,
      SourceId.OPEN_FEATURE_NODE,
      sdkVersion,
    )?.event;

    t.deepEqual(actualEvent, expectedEvent);
  });
});

test('toErrorMetricsEvent returns correct event for NetworkError (ECONNREFUSED / EHOSTUNREACH)', (t) => {
  const error = new NetworkError('Connection refused');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createNetworkErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  ).event;

  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for UnknownError with status code', (t) => {
  const error = new UnknownError('Unknown Error', 999);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createUnknownErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
    999,
    'Unknown Error',
  ).event;
  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for UnknownError without status code', (t) => {
  const error = new UnknownError('Unknown error occurred');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createUnknownErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
    undefined,
    'Unknown error occurred',
  ).event;
  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for TimeoutError (SDK class)', (t) => {
  const error = new TimeoutError(5000, 'poll timed out');
  const tag = 'test-tag';
  const apiId = ApiId.GET_FEATURE_FLAGS;

  const expectedEvent = createTimeoutErrorMetricsEvent(
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  ).event;
  const actualEvent = toErrorMetricsEvent(
    error,
    tag,
    apiId,
    SourceId.OPEN_FEATURE_NODE,
    sdkVersion,
  )?.event;

  t.deepEqual(actualEvent, expectedEvent);
});
