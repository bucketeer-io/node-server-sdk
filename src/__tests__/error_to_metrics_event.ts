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
import { InvalidStatusError, IllegalStateError, IllegalArgumentError } from '../objects/errors';

test('toErrorMetricsEvent returns correct event for IllegalStateError', (t) => {
  const error = new IllegalStateError('Feature not found');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createInternalSdkErrorMetricsEvent(tag, apiId, 'Feature not found').event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;
  
  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for IllegalArgumentError', (t) => {
  const error = new IllegalArgumentError('Input string must be non-blank');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createInternalSdkErrorMetricsEvent(tag, apiId, 'Input string must be non-blank').event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for InvalidStatusError with 400 status code', (t) => {
  const error = new InvalidStatusError('Bad Request', 400);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createBadRequestErrorMetricsEvent(tag, apiId).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('skip generating error events for unauthorized error', (t) => {
  const error = new InvalidStatusError('Unauthorized', 401);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const actualEvent = toErrorMetricsEvent(error, tag, apiId);

  t.is(actualEvent, null);
});

test('skip generating error events for forbidden error', (t) => {
  const error = new InvalidStatusError('ForbiddenError', 403);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const actualEvent = toErrorMetricsEvent(error, tag, apiId);

  t.is(actualEvent, null);
});

test('toErrorMetricsEvent returns correct event for InvalidStatusError with 404 status code', (t) => {
  const error = new InvalidStatusError('Not Found', 404);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createNotFoundErrorMetricsEvent(tag, apiId).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for InvalidStatusError with 408 status code', (t) => {
  const error = new InvalidStatusError('Request Timeout', 408);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createTimeoutErrorMetricsEvent(tag, apiId).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for InvalidStatusError with 413 status code', (t) => {
  const error = new InvalidStatusError('Payload Too Large', 413);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createPayloadTooLargeErrorMetricsEvent(tag, apiId).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for InvalidStatusError with 500 status code', (t) => {
  const error = new InvalidStatusError('Internal Server Error', 500);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createInternalServerErrorMetricsEvent(tag, apiId).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for InvalidStatusError with 5xx ServiceUnavailableCodes status code', (t) => {
  const serviceUnavailableCodes = [502, 503, 504];
  serviceUnavailableCodes.forEach((element) => {
    const error = new InvalidStatusError('Service Unavailable', element);
    const tag = 'test-tag';
    const apiId = ApiId.GET_EVALUATION;

    const expectedEvent = createServiceUnavailableErrorMetricsEvent(tag, apiId).event;
    const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

    t.deepEqual(actualEvent, expectedEvent);
  });
});

test('toErrorMetricsEvent returns correct event for node error ECONNRESET', (t) => {
  const error = createNodeJSError('Connection reset by peer', 'ECONNRESET');
  error.code = 'ECONNRESET';
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createTimeoutErrorMetricsEvent(tag, apiId).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for node error ECONNREFUSED', (t) => {
  const error = createNodeJSError('Connection refused', 'ECONNREFUSED');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createNetworkErrorMetricsEvent(tag, apiId).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for unknown status code', (t) => {
  const error = new InvalidStatusError('Unknown Error', 999);
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createUnknownErrorMetricsEvent(tag, apiId, 999, 'Unknown Error').event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for unknown error', (t) => {
  const error = new Error('Unknown error occurred');
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createUnknownErrorMetricsEvent(
    tag,
    apiId,
    undefined,
    'Unknown error occurred',
  ).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

test('toErrorMetricsEvent returns correct event for unknown object', (t) => {
  const error = new Object();
  const tag = 'test-tag';
  const apiId = ApiId.GET_EVALUATION;

  const expectedEvent = createUnknownErrorMetricsEvent(tag, apiId, undefined, String(error)).event;
  const actualEvent = toErrorMetricsEvent(error, tag, apiId)?.event;

  t.deepEqual(actualEvent, expectedEvent);
});

class CustomError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}

function createNodeJSError(message: string, code: string): CustomError {
  return new CustomError(message, code);
}
