import anyTest, { TestFn } from 'ava';
import sinon from 'sinon';

import {
  promiseRetriable,
  RetryPolicy,
  ShouldRetryFn,
  calculateBackoff,
  isRetryable,
} from '../utils/promiseRetriable';

const test = anyTest as TestFn<{ clock: sinon.SinonFakeTimers; mathRandom: sinon.SinonStub }>;

const policy: RetryPolicy = {
  maxRetries: 3,
  initialInterval: 100,
  maxInterval: 10_000,
};

test.beforeEach((t) => {
  t.context.clock = sinon.useFakeTimers();
  // Stub Math.random to 0.5 so jitter = 0, giving deterministic backoff timing
  t.context.mathRandom = sinon.stub(Math, 'random').returns(0.5);
});

test.afterEach((t) => {
  t.context.clock.restore();
  t.context.mathRandom.restore();
});

test.serial('resolves when fn eventually succeeds', async (t) => {
  const fn = sinon.stub<[], Promise<string>>();
  fn.onCall(0).rejects(new Error('temporary'));
  fn.onCall(1).resolves('success');
  const shouldRetry = sinon.stub<[Error], boolean>().returns(true);

  const resultPromise = promiseRetriable(
    fn as () => Promise<string>,
    policy,
    shouldRetry as unknown as ShouldRetryFn,
  );

  await t.context.clock.tickAsync(200);

  t.is(await resultPromise, 'success');
  t.is(fn.callCount, 2);
  t.is(shouldRetry.callCount, 1);
});

test.serial('waits for configured delay before retrying', async (t) => {
  const fn = sinon.stub<[], Promise<string>>();
  fn.onCall(0).rejects(new Error('temporary'));
  fn.onCall(1).resolves('success');
  const shouldRetry = sinon.stub<[Error], boolean>().returns(true);
  const initialInterval = 250;

  const resultPromise = promiseRetriable(
    fn as () => Promise<string>,
    { ...policy, maxRetries: 2, initialInterval },
    shouldRetry as unknown as ShouldRetryFn,
  );

  await Promise.resolve();
  t.is(fn.callCount, 1);

  await t.context.clock.tickAsync(initialInterval - 1);
  t.is(fn.callCount, 1);

  await t.context.clock.tickAsync(1);
  t.is(fn.callCount, 2);
  t.is(shouldRetry.callCount, 1);

  t.is(await resultPromise, 'success');
});

test.serial('throws the last error after exceeding max retries', async (t) => {
  const error = new Error('permanent failure');
  const fn = sinon.stub<[], Promise<never>>().rejects(error);
  const shouldRetry = sinon.stub<[Error], boolean>().returns(true);

  const resultPromise = promiseRetriable(
    fn as () => Promise<never>,
    { ...policy, maxRetries: 2, initialInterval: 10 },
    shouldRetry as unknown as ShouldRetryFn,
  );

  await t.context.clock.tickAsync(100);

  const thrownError = await t.throwsAsync(resultPromise);
  t.is(thrownError, error);
  t.is(fn.callCount, 3);
  t.is(shouldRetry.callCount, 2);
});

test.serial('does not retry when shouldRetry returns false', async (t) => {
  const error = new Error('do not retry');
  const fn = sinon.stub<[], Promise<never>>().rejects(error);
  const shouldRetry = sinon.stub<[Error], boolean>().returns(false);

  const resultPromise = promiseRetriable(
    fn as () => Promise<never>,
    policy,
    shouldRetry as unknown as ShouldRetryFn,
  );

  const thrownError = await t.throwsAsync(resultPromise);
  t.is(thrownError, error);
  t.is(fn.callCount, 1);
  t.is(shouldRetry.callCount, 1);
});

test.serial(
  'stops retrying once shouldRetry returns false mid-sequence',
  async (t) => {
    const error = new Error('stop retrying');
    const initialInterval = 150;
    const fn = sinon.stub<[], Promise<never>>().rejects(error);
    const shouldRetry = sinon.stub<[Error], boolean>();
    shouldRetry.onCall(0).returns(true);
    shouldRetry.onCall(1).returns(true);
    shouldRetry.returns(false);

    const resultPromise = promiseRetriable(
      fn as () => Promise<never>,
      { ...policy, maxRetries: 4, initialInterval },
      shouldRetry as unknown as ShouldRetryFn,
    );

    await Promise.resolve();
    t.is(fn.callCount, 1);
    t.is(shouldRetry.callCount, 1);

    // First retry wait: initialInterval * 2^0 = 150ms
    await t.context.clock.tickAsync(initialInterval);
    t.is(fn.callCount, 2);
    t.is(shouldRetry.callCount, 2);

    // Second retry wait: initialInterval * 2^1 = 300ms
    await t.context.clock.tickAsync(initialInterval * 2 - 1);
    t.is(fn.callCount, 2);

    await t.context.clock.tickAsync(1);
    t.is(fn.callCount, 3);
    t.is(shouldRetry.callCount, 3);

    const thrownError = await t.throwsAsync(resultPromise);
    t.is(thrownError, error);
    t.is(fn.callCount, 3);
  },
);

test.serial(
  'applies exponential backoff doubling each attempt',
  async (t) => {
    const error = new Error('exponential backoff');
    const initialInterval = 75;
    const fn = sinon.stub<[], Promise<never>>().rejects(error);
    const shouldRetry = sinon.stub<[Error], boolean>();
    shouldRetry.onCall(0).returns(true);
    shouldRetry.onCall(1).returns(true);
    shouldRetry.returns(false);

    const resultPromise = promiseRetriable(
      fn as () => Promise<never>,
      { ...policy, maxRetries: 4, initialInterval },
      shouldRetry as unknown as ShouldRetryFn,
    );

    await Promise.resolve();
    t.is(fn.callCount, 1);

    // First retry wait: initialInterval * 2^0 = 75ms
    await t.context.clock.tickAsync(initialInterval);
    t.is(fn.callCount, 2);

    // Second retry wait: initialInterval * 2^1 = 150ms
    await t.context.clock.tickAsync(initialInterval * 2 - 1);
    t.is(fn.callCount, 2);

    await t.context.clock.tickAsync(1);
    t.is(fn.callCount, 3);

    await t.context.clock.tickAsync(1000);
    const thrownError = await t.throwsAsync(resultPromise);
    t.is(thrownError, error);
    t.is(shouldRetry.callCount, 3);
  },
);

// ── calculateBackoff unit tests ──────────────────────────────────────────────

test.serial('calculateBackoff - returns initialInterval for attempt 0 (no jitter)', (t) => {
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 10_000 };
  t.is(calculateBackoff(0, p), 1000);
});

test.serial('calculateBackoff - doubles for attempt 1', (t) => {
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 10_000 };
  t.is(calculateBackoff(1, p), 2000);
});

test.serial('calculateBackoff - quadruples for attempt 2', (t) => {
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 10_000 };
  t.is(calculateBackoff(2, p), 4000);
});

test.serial('calculateBackoff - applies +25% jitter when random returns 1.0', (t) => {
  t.context.mathRandom.returns(1.0); // jitter factor = +25%
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 10_000 };
  t.is(calculateBackoff(0, p), 1250);
});

test.serial('calculateBackoff - applies -25% jitter when random returns 0.0', (t) => {
  t.context.mathRandom.returns(0.0); // jitter factor = -25%
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 10_000 };
  t.is(calculateBackoff(0, p), 750);
});

test.serial('calculateBackoff - caps at maxInterval', (t) => {
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 5_000 };
  // attempt 10: 1000 * 2^10 = 1,024,000ms → capped at 5000
  t.is(calculateBackoff(10, p), 5000);
});

test.serial('calculateBackoff - returns 0 for zero initialInterval', (t) => {
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 0, maxInterval: 10_000 };
  t.is(calculateBackoff(0, p), 0);
});

test.serial('calculateBackoff - uses custom multiplier', (t) => {
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 100_000, multiplier: 3.0 };
  // attempt 1: 1000 * 3^1 = 3000
  t.is(calculateBackoff(1, p), 3000);
});

test.serial('calculateBackoff - uses default multiplier 2.0 when multiplier is undefined', (t) => {
  const p: RetryPolicy = { maxRetries: 3, initialInterval: 1000, maxInterval: 10_000 };
  t.is(calculateBackoff(1, p), 2000);
});

// ── isRetryable unit tests ───────────────────────────────────────────────────

test.serial('isRetryable - returns true for ECONNREFUSED', (t) => {
  const err = Object.assign(new Error('connect ECONNREFUSED'), { code: 'ECONNREFUSED' });
  t.true(isRetryable(err));
});

test.serial('isRetryable - returns true for ECONNRESET', (t) => {
  const err = Object.assign(new Error('read ECONNRESET'), { code: 'ECONNRESET' });
  t.true(isRetryable(err));
});

test.serial('isRetryable - returns true for ETIMEDOUT', (t) => {
  const err = Object.assign(new Error('connect ETIMEDOUT'), { code: 'ETIMEDOUT' });
  t.true(isRetryable(err));
});

test.serial('isRetryable - returns true for ENOTFOUND', (t) => {
  const err = Object.assign(new Error('getaddrinfo ENOTFOUND'), { code: 'ENOTFOUND' });
  t.true(isRetryable(err));
});

test.serial('isRetryable - returns true for EAI_AGAIN', (t) => {
  const err = Object.assign(new Error('getaddrinfo EAI_AGAIN'), { code: 'EAI_AGAIN' });
  t.true(isRetryable(err));
});

test.serial('isRetryable - returns true for ECONNABORTED', (t) => {
  const err = Object.assign(new Error('socket hang up'), { code: 'ECONNABORTED' });
  t.true(isRetryable(err));
});

test.serial('isRetryable - returns false for generic Error', (t) => {
  t.false(isRetryable(new Error('something went wrong')));
});

test.serial('isRetryable - returns false for Error without code', (t) => {
  const err = new Error('some error');
  t.false(isRetryable(err));
});

// ── promiseRetriable default shouldRetry tests ───────────────────────────────

test.serial('promiseRetriable - uses isRetryable as default shouldRetry for network errors', async (t) => {
  const fn = sinon.stub<[], Promise<string>>();
  const networkError = Object.assign(new Error('connect ECONNREFUSED'), { code: 'ECONNREFUSED' });
  fn.onCall(0).rejects(networkError);
  fn.onCall(1).resolves('success');

  const resultPromise = promiseRetriable(fn as () => Promise<string>, policy);
  await t.context.clock.tickAsync(200);

  t.is(await resultPromise, 'success');
  t.is(fn.callCount, 2);
});

test.serial('promiseRetriable - does not retry non-network errors by default', async (t) => {
  const error = new Error('non-retryable');
  const fn = sinon.stub<[], Promise<never>>().rejects(error);

  const resultPromise = promiseRetriable(fn as () => Promise<never>, policy);

  const thrownError = await t.throwsAsync(resultPromise);
  t.is(thrownError, error);
  t.is(fn.callCount, 1);
});
