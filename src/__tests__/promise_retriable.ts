import anyTest, { TestFn } from 'ava';
import sinon from 'sinon';

import {
  promiseRetriable,
  RetryPolicy,
  RetryDecision,
  ShouldRetryFn,
  calculateBackoff,
  isRetryable,
} from '../utils/promiseRetriable';
import { InvalidStatusError } from '../objects/errors';

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
  const shouldRetry = sinon.stub<[Error], RetryDecision>().returns({ retry: true });

  const resultPromise = promiseRetriable(
    fn as () => Promise<string>,
    policy,
    shouldRetry as ShouldRetryFn,
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
  const shouldRetry = sinon.stub<[Error], RetryDecision>().returns({ retry: true });
  const initialInterval = 250;

  const resultPromise = promiseRetriable(
    fn as () => Promise<string>,
    { ...policy, maxRetries: 2, initialInterval },
    shouldRetry as ShouldRetryFn,
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

test.serial('does not retry when maxRetries is 0', async (t) => {
  const error = new Error('fail immediately');
  const fn = sinon.stub<[], Promise<never>>().rejects(error);
  const shouldRetry = sinon.stub<[Error], RetryDecision>().returns({ retry: true });

  const resultPromise = promiseRetriable(
    fn as () => Promise<never>,
    { ...policy, maxRetries: 0 },
    shouldRetry as ShouldRetryFn,
  );

  const thrownError = await t.throwsAsync(resultPromise);
  t.is(thrownError, error);
  t.is(fn.callCount, 1);
  // Optional: shouldRetry might still be called once for the first failure
  t.is(shouldRetry.callCount, 1);
});

test.serial('throws the last error after exceeding max retries', async (t) => {
  const error = new Error('permanent failure');
  const fn = sinon.stub<[], Promise<never>>().rejects(error);
  const shouldRetry = sinon.stub<[Error], RetryDecision>().returns({ retry: true });

  const resultPromise = promiseRetriable(
    fn as () => Promise<never>,
    { ...policy, maxRetries: 2, initialInterval: 10 },
    shouldRetry as ShouldRetryFn,
  );

  await t.context.clock.tickAsync(100);

  const thrownError = await t.throwsAsync(resultPromise);
  t.is(thrownError, error);
  t.is(fn.callCount, 3);
  t.is(shouldRetry.callCount, 3);
});

test.serial('does not retry when shouldRetry returns false', async (t) => {
  const error = new Error('do not retry');
  const fn = sinon.stub<[], Promise<never>>().rejects(error);
  const shouldRetry = sinon.stub<[Error], RetryDecision>().returns({ retry: false });

  const resultPromise = promiseRetriable(
    fn as () => Promise<never>,
    policy,
    shouldRetry as ShouldRetryFn,
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
    const shouldRetry = sinon.stub<[Error], RetryDecision>();
    shouldRetry.onCall(0).returns({ retry: true });
    shouldRetry.onCall(1).returns({ retry: true });
    shouldRetry.returns({ retry: false });

    const resultPromise = promiseRetriable(
      fn as () => Promise<never>,
      { ...policy, maxRetries: 4, initialInterval },
      shouldRetry as ShouldRetryFn,
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
    const shouldRetry = sinon.stub<[Error], RetryDecision>();
    shouldRetry.onCall(0).returns({ retry: true });
    shouldRetry.onCall(1).returns({ retry: true });
    shouldRetry.returns({ retry: false });

    const resultPromise = promiseRetriable(
      fn as () => Promise<never>,
      { ...policy, maxRetries: 4, initialInterval },
      shouldRetry as ShouldRetryFn,
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

// calculateBackoff unit tests

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

// isRetryable unit tests

const RETRYABLE_TEST_CASES = [
  { code: 'ECONNREFUSED', msg: 'connect ECONNREFUSED' },
  { code: 'ECONNRESET', msg: 'read ECONNRESET' },
  { code: 'ETIMEDOUT', msg: 'connect ETIMEDOUT' },
  { code: 'ENOTFOUND', msg: 'getaddrinfo ENOTFOUND' },
  { code: 'EAI_AGAIN', msg: 'getaddrinfo EAI_AGAIN' },
  { code: 'ECONNABORTED', msg: 'socket hang up' },
  { code: 'EHOSTUNREACH', msg: 'connect EHOSTUNREACH' },
  { code: 'ENETUNREACH', msg: 'connect ENETUNREACH' },
  { code: 'EPIPE', msg: 'write EPIPE' },
];

for (const { code, msg } of RETRYABLE_TEST_CASES) {
  test.serial(`isRetryable - returns true for ${code}`, (t) => {
    const err = Object.assign(new Error(msg), { code });
    t.true(isRetryable(err).retry);
  });
}

test.serial('isRetryable - returns false for generic Error', (t) => {
  t.false(isRetryable(new Error('something went wrong')).retry);
});

test.serial('isRetryable - returns false for Error without code', (t) => {
  const err = new Error('some error');
  t.false(isRetryable(err).retry);
});

// promiseRetriable default shouldRetry tests

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

// RetryDecision support

test.serial('RetryDecision { retry: false } stops retrying immediately', async (t) => {
  const error = new Error('stop');
  const fn = sinon.stub<[], Promise<never>>().rejects(error);
  const shouldRetry: ShouldRetryFn = () => ({ retry: false });

  const thrownError = await t.throwsAsync(
    promiseRetriable(fn as () => Promise<never>, policy, shouldRetry),
  );
  t.is(thrownError, error);
  t.is(fn.callCount, 1);
});

test.serial('RetryDecision { retry: true, delayOverrideMs } uses the override delay', async (t) => {
  const overrideMs = 5_000;
  const error = new Error('override delay');
  const fn = sinon.stub<[], Promise<string>>();
  fn.onCall(0).rejects(error);
  fn.onCall(1).resolves('success');

  const shouldRetry: ShouldRetryFn = () => ({ retry: true, delayOverrideMs: overrideMs });

  const resultPromise = promiseRetriable(fn as () => Promise<string>, policy, shouldRetry);

  await Promise.resolve();
  t.is(fn.callCount, 1);

  // Should NOT retry before the override delay elapses
  await t.context.clock.tickAsync(overrideMs - 1);
  t.is(fn.callCount, 1);

  // Should retry after the override delay elapses
  await t.context.clock.tickAsync(1);
  t.is(fn.callCount, 2);

  t.is(await resultPromise, 'success');
});

test.serial('RetryDecision delayOverrideMs is capped at maxInterval', async (t) => {
  const overrideMs = 30_000;
  const maxInterval = 10_000;
  const error = new Error('capped override');
  const fn = sinon.stub<[], Promise<string>>();
  fn.onCall(0).rejects(error);
  fn.onCall(1).resolves('success');

  const shouldRetry: ShouldRetryFn = () => ({ retry: true, delayOverrideMs: overrideMs });
  const cappedPolicy: RetryPolicy = { ...policy, maxInterval };

  const resultPromise = promiseRetriable(fn as () => Promise<string>, cappedPolicy, shouldRetry);

  await Promise.resolve();
  t.is(fn.callCount, 1);

  // Should not fire before maxInterval
  await t.context.clock.tickAsync(maxInterval - 1);
  t.is(fn.callCount, 1);

  // Should fire at maxInterval (capped), not at overrideMs (30s)
  await t.context.clock.tickAsync(1);
  t.is(fn.callCount, 2);

  t.is(await resultPromise, 'success');
});

test.serial('RetryDecision delayOverrideMs is not capped when maxInterval is 0', async (t) => {
  const overrideMs = 7_000;
  const error = new Error('uncapped override');
  const fn = sinon.stub<[], Promise<string>>();
  fn.onCall(0).rejects(error);
  fn.onCall(1).resolves('success');

  const shouldRetry: ShouldRetryFn = () => ({ retry: true, delayOverrideMs: overrideMs });
  const uncappedPolicy: RetryPolicy = { ...policy, maxInterval: 0 };

  const resultPromise = promiseRetriable(fn as () => Promise<string>, uncappedPolicy, shouldRetry);

  await Promise.resolve();
  t.is(fn.callCount, 1);

  await t.context.clock.tickAsync(overrideMs - 1);
  t.is(fn.callCount, 1);

  await t.context.clock.tickAsync(1);
  t.is(fn.callCount, 2);

  t.is(await resultPromise, 'success');
});

//  isRetryable HTTP 5xx (Step 5) ────────────────────────────────────────────

const RETRYABLE_STATUS_CASES = [
  { code: 429, name: 'Too Many Requests' },
  { code: 499, name: 'Client Closed Request' },
  { code: 500, name: 'Internal Server Error' },
  { code: 502, name: 'Bad Gateway' },
  { code: 503, name: 'Service Unavailable' },
  { code: 504, name: 'Gateway Timeout' },
];

for (const { code, name } of RETRYABLE_STATUS_CASES) {
  test.serial(`isRetryable returns RetryDecision for ${code} (${name})`, (t) => {
    const err = new InvalidStatusError(name.toLowerCase(), code);
    t.deepEqual(isRetryable(err), { retry: true, delayOverrideMs: undefined });
  });
}

test.serial('isRetryable returns RetryDecision for 503 with retryAfterMs', (t) => {
  const err = new InvalidStatusError('service unavailable', 503, 30_000);
  t.deepEqual(isRetryable(err), { retry: true, delayOverrideMs: 30_000 });
});

test.serial('isRetryable returns false for 404', (t) => {
  const err = new InvalidStatusError('not found', 404);
  t.false(isRetryable(err).retry);
});

test.serial('isRetryable returns false for 401', (t) => {
  const err = new InvalidStatusError('unauthorized', 401);
  t.false(isRetryable(err).retry);
});

// AbortSignal support

test.serial('throws immediately if signal is already aborted', async (t) => {
  const controller = new AbortController();
  const abortReason = new Error('pre-aborted');
  controller.abort(abortReason);

  const fn = sinon.stub<[AbortSignal | undefined], Promise<string>>().resolves('should not reach');

  const thrownError = await t.throwsAsync(
    promiseRetriable(fn as (signal: AbortSignal | undefined) => Promise<string>, policy, () => ({ retry: true }), controller.signal),
  );
  t.is(thrownError, abortReason);
  t.is(fn.callCount, 0);
});

test.serial('signal firing mid-backoff cancels sleep and rejects', async (t) => {
  const controller = new AbortController();
  const abortReason = new Error('aborted mid-backoff');
  const error = new Error('temporary');
  const fn = sinon.stub<[AbortSignal | undefined], Promise<never>>().rejects(error);

  const resultPromise = promiseRetriable(
    fn as (signal: AbortSignal | undefined) => Promise<never>,
    { ...policy, maxRetries: 3, initialInterval: 5_000 },
    () => ({ retry: true }),
    controller.signal,
  );

  // First call fails; backoff sleep begins (5000ms)
  await Promise.resolve();
  t.is(fn.callCount, 1);

  // Abort during the sleep
  controller.abort(abortReason);

  const thrownError = await t.throwsAsync(resultPromise);
  t.is(thrownError, abortReason);
  // fn should not have been called again after abort
  t.is(fn.callCount, 1);
});

test.serial('signal is forwarded to fn on each attempt', async (t) => {
  const controller = new AbortController();
  const receivedSignals: (AbortSignal | undefined)[] = [];

  const fn = async (signal: AbortSignal | undefined) => {
    receivedSignals.push(signal);
    return 'success';
  };

  await promiseRetriable(fn, policy, () => ({ retry: false }), controller.signal);

  t.is(receivedSignals.length, 1);
  t.is(receivedSignals[0], controller.signal);
});
