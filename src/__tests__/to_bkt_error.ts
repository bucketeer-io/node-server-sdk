import test from 'ava';
import {
  toBKTError,
  InvalidStatusError,
  RedirectRequestError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InvalidHttpMethodError,
  TimeoutError,
  PayloadTooLargeError,
  ClientClosedRequestError,
  InternalServerError,
  ServiceUnavailableError,
  NetworkError,
  UnknownError,
} from '../objects/errors.js';
import { createNodeJSError } from './utils/native_error.js';

test('toBKTError returns BKTBaseError instance unchanged', (t) => {
  const error = new BadRequestError('test');
  const result = toBKTError(error, {});
  t.is(result, error);
});

test('toBKTError converts InvalidStatusError with 300-399 to RedirectRequestError', (t) => {
  const error = new InvalidStatusError('redirect', 301);
  const result = toBKTError(error, {}) as RedirectRequestError;
  t.true(result instanceof RedirectRequestError);
  t.is(result.statusCode, 301);
  t.is(result.message, 'redirect');
});

test('toBKTError converts InvalidStatusError with 400 to BadRequestError', (t) => {
  const error = new InvalidStatusError('bad request', 400);
  const result = toBKTError(error, {});
  t.true(result instanceof BadRequestError);
  t.is(result.message, 'bad request');
});

test('toBKTError converts InvalidStatusError with 401 to UnauthorizedError', (t) => {
  const error = new InvalidStatusError('unauthorized', 401);
  const result = toBKTError(error, {});
  t.true(result instanceof UnauthorizedError);
});

test('toBKTError converts InvalidStatusError with 403 to ForbiddenError', (t) => {
  const error = new InvalidStatusError('forbidden', 403);
  const result = toBKTError(error, {});
  t.true(result instanceof ForbiddenError);
});

test('toBKTError converts InvalidStatusError with 404 to NotFoundError', (t) => {
  const error = new InvalidStatusError('not found', 404);
  const result = toBKTError(error, {});
  t.true(result instanceof NotFoundError);
});

test('toBKTError converts InvalidStatusError with 405 to InvalidHttpMethodError', (t) => {
  const error = new InvalidStatusError('invalid method', 405);
  const result = toBKTError(error, {});
  t.true(result instanceof InvalidHttpMethodError);
});

test('toBKTError converts InvalidStatusError with 408 to TimeoutError', (t) => {
  const error = new InvalidStatusError('timeout', 408);
  const result = toBKTError(error, { timeout: 5000 }) as TimeoutError;
  t.true(result instanceof TimeoutError);
  t.is(result.timeoutMillis, 5000);
});

test('toBKTError converts InvalidStatusError with 413 to PayloadTooLargeError', (t) => {
  const error = new InvalidStatusError('payload too large', 413);
  const result = toBKTError(error, {});
  t.true(result instanceof PayloadTooLargeError);
});

test('toBKTError converts InvalidStatusError with 499 to ClientClosedRequestError', (t) => {
  const error = new InvalidStatusError('client closed', 499);
  const result = toBKTError(error, {});
  t.true(result instanceof ClientClosedRequestError);
});

test('toBKTError converts InvalidStatusError with 500 to InternalServerError', (t) => {
  const error = new InvalidStatusError('internal error', 500);
  const result = toBKTError(error, {});
  t.true(result instanceof InternalServerError);
});

test('toBKTError converts InvalidStatusError with 502/503/504 to ServiceUnavailableError', (t) => {
  const error502 = new InvalidStatusError('bad gateway', 502);
  const result502 = toBKTError(error502, {});
  t.true(result502 instanceof ServiceUnavailableError);

  const error503 = new InvalidStatusError('service unavailable', 503);
  const result503 = toBKTError(error503, {});
  t.true(result503 instanceof ServiceUnavailableError);

  const error504 = new InvalidStatusError('gateway timeout', 504);
  const result504 = toBKTError(error504, {});
  t.true(result504 instanceof ServiceUnavailableError);
});

test('toBKTError converts InvalidStatusError with unknown status to UnknownError', (t) => {
  const error = new InvalidStatusError('unknown status', 418);
  const result = toBKTError(error, {}) as UnknownError;
  t.true(result instanceof UnknownError);
  t.is(result.statusCode, 418);
});

test('toBKTError converts Node.js ECONNRESET to TimeoutError', (t) => {
  const error = createNodeJSError('connection reset', 'ECONNRESET');
  const result = toBKTError(error, { timeout: 3000 }) as TimeoutError;
  t.true(result instanceof TimeoutError);
  t.is(result.timeoutMillis, 3000);
});

test('toBKTError converts Node.js EHOSTUNREACH/ECONNREFUSED to NetworkError', (t) => {
  const error1 =  createNodeJSError('host unreachable', 'EHOSTUNREACH');
  const result1 = toBKTError(error1, {});
  t.true(result1 instanceof NetworkError);

  const error2 = createNodeJSError('connection refused', 'ECONNREFUSED');
  const result2 = toBKTError(error2, {});
  t.true(result2 instanceof NetworkError);
});

test('toBKTError converts unknown Node.js error to UnknownError', (t) => {
  const error = createNodeJSError('some node error', 'SOME_CODE');
  const result = toBKTError(error, {}) as UnknownError;
  t.true(result instanceof UnknownError);
  t.is(result.message, 'some node error');
});

test('toBKTError converts generic Error to UnknownError', (t) => {
  const error = new Error('generic error');
  const result = toBKTError(error, {});
  t.true(result instanceof UnknownError);
  t.is(result.message, 'generic error');
});

test('toBKTError converts non-Error value to UnknownError', (t) => {
  const result = toBKTError('string error', {});
  t.true(result instanceof UnknownError);
  t.is(result.message, 'string error');
});

test('toBKTError handles undefined code in InvalidStatusError', (t) => {
  const error = new InvalidStatusError('no code', undefined);
  const result = toBKTError(error, {}) as UnknownError;
  t.true(result instanceof UnknownError);
  // default status code is 0
  t.is(result.statusCode, 0);
});
