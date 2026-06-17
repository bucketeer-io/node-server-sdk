import test from 'ava';
import { parseRetryAfter, InvalidStatusError } from '../objects/errors.js';

// parseRetryAfter: delta-seconds

test('parseRetryAfter returns undefined for undefined input', (t) => {
  t.is(parseRetryAfter(undefined), undefined);
});

test('parseRetryAfter returns undefined for empty string', (t) => {
  t.is(parseRetryAfter(''), undefined);
});

test('parseRetryAfter converts "0" to 0', (t) => {
  t.is(parseRetryAfter('0'), 0);
});

test('parseRetryAfter converts "60" to 60_000', (t) => {
  t.is(parseRetryAfter('60'), 60_000);
});

test('parseRetryAfter converts "120" to 120_000', (t) => {
  t.is(parseRetryAfter('120'), 120_000);
});

test('parseRetryAfter handles leading/trailing whitespace for delta-seconds', (t) => {
  t.is(parseRetryAfter('  30  '), 30_000);
});

// parseRetryAfter: HTTP-date 

test('parseRetryAfter converts a future HTTP-date to positive ms', (t) => {
  // 1 hour in the future
  const future = new Date(Date.now() + 3_600_000);
  const header = future.toUTCString();
  const result = parseRetryAfter(header);
  t.not(result, undefined);
  t.true((result as number) > 0);
  // Should be approximately 3600000ms (allow ±2s for test execution time)
  t.true((result as number) >= 3_598_000 && (result as number) <= 3_602_000);
});

test('parseRetryAfter returns undefined for a past HTTP-date', (t) => {
  const past = new Date(Date.now() - 60_000);
  t.is(parseRetryAfter(past.toUTCString()), undefined);
});

//  parseRetryAfter: invalid inputs

test('parseRetryAfter returns undefined for an unparseable string', (t) => {
  t.is(parseRetryAfter('not-a-date'), undefined);
});

test('parseRetryAfter returns undefined for a float string', (t) => {
  t.is(parseRetryAfter('1.5'), undefined);
});

test('parseRetryAfter returns undefined for a negative number string', (t) => {
  t.is(parseRetryAfter('-10'), undefined);
});

//  InvalidStatusError.retryAfterMs

test('InvalidStatusError exposes retryAfterMs when provided', (t) => {
  const err = new InvalidStatusError('test', 503, 60_000);
  t.is(err.retryAfterMs, 60_000);
});

test('InvalidStatusError retryAfterMs is undefined when not provided', (t) => {
  const err = new InvalidStatusError('test', 503);
  t.is(err.retryAfterMs, undefined);
});

test('InvalidStatusError retryAfterMs is undefined when explicitly passed undefined', (t) => {
  const err = new InvalidStatusError('test', 503, undefined);
  t.is(err.retryAfterMs, undefined);
});

test('InvalidStatusError retryAfterMs does not affect code or message', (t) => {
  const err = new InvalidStatusError('test message', 503, 30_000);
  t.is(err.message, 'test message');
  t.is(err.code, 503);
  t.is(err.retryAfterMs, 30_000);
});
