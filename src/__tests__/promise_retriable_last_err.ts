import test from 'ava';
import sinon from 'sinon';
import { promiseRetriable, isRetryable, RetryPolicy } from '../utils/promiseRetriable';
import { InvalidStatusError, DeadlineExceededError, AbortError } from '../objects/errors';

const POLICY: RetryPolicy = { maxRetries: 3, initialInterval: 100, maxInterval: 5_000 };
const NEAR_ZERO_DELAY_POLICY: RetryPolicy = { maxRetries: 3, initialInterval: 1, maxInterval: 0 };

// Path A: deadline fires during an in-flight request, lastErr = HTTP 499
test.serial('Path A: TimeoutError from fn is replaced by lastHttpError (499)', async (t) => {
  const clock = sinon.useFakeTimers();
  t.teardown(() => clock.restore());

  const controller = new AbortController();
  const fn = sinon.stub<[AbortSignal | undefined], Promise<unknown>>();
  fn.onCall(0).rejects(new InvalidStatusError('closed', 499));
  fn.onCall(1).callsFake(() => {
    controller.abort(new DeadlineExceededError(30_000));
    return Promise.reject(new DeadlineExceededError(30_000));
  });

  const p = promiseRetriable(fn, NEAR_ZERO_DELAY_POLICY, isRetryable, controller.signal);
  await clock.tickAsync(10);

  const err = await t.throwsAsync(() => p);
  t.true(err instanceof InvalidStatusError);
  t.is((err as InvalidStatusError).code, 499);
  t.is(fn.callCount, 2);
});

// Path B: deadline fires during inter-retry sleep, lastErr = HTTP 499
test.serial('Path B: TimeoutError during sleep is replaced by lastHttpError (499)', async (t) => {
  const clock = sinon.useFakeTimers();
  t.teardown(() => clock.restore());

  const controller = new AbortController();
  const fn = sinon.stub<[AbortSignal | undefined], Promise<unknown>>();
  fn.onCall(0).rejects(new InvalidStatusError('closed', 499));

  const p = promiseRetriable(fn, POLICY, isRetryable, controller.signal);

  // Allow attempt 1 to fail and enter the sleep phase
  await clock.tickAsync(0);
  // Abort the signal while still sleeping (before sleep timer fires)
  controller.abort(new DeadlineExceededError(30_000));
  await clock.tickAsync(1);

  const err = await t.throwsAsync(() => p);
  t.true(err instanceof InvalidStatusError);
  t.is((err as InvalidStatusError).code, 499);
  t.is(fn.callCount, 1); // second attempt never started
});

// Path A: lastErr = HTTP 503
test.serial('Path A: TimeoutError replaced by lastHttpError (503)', async (t) => {
  const clock = sinon.useFakeTimers();
  t.teardown(() => clock.restore());

  const controller = new AbortController();
  const fn = sinon.stub<[AbortSignal | undefined], Promise<unknown>>();
  fn.onCall(0).rejects(new InvalidStatusError('unavailable', 503));
  fn.onCall(1).callsFake(() => {
    controller.abort(new DeadlineExceededError(30_000));
    return Promise.reject(new DeadlineExceededError(30_000));
  });

  const p = promiseRetriable(fn, NEAR_ZERO_DELAY_POLICY, isRetryable, controller.signal);
  await clock.tickAsync(10);

  const err = await t.throwsAsync(() => p);
  t.true(err instanceof InvalidStatusError);
  t.is((err as InvalidStatusError).code, 503);
});

// No previous attempt: bare TimeoutError surfaced unchanged
test.serial('No prior HTTP error: bare TimeoutError is surfaced unchanged', async (t) => {
  const clock = sinon.useFakeTimers();
  t.teardown(() => clock.restore());

  const controller = new AbortController();
  const fn = sinon.stub<[AbortSignal | undefined], Promise<unknown>>();
  fn.onCall(0).callsFake(() => {
    controller.abort(new DeadlineExceededError(30_000));
    return Promise.reject(new DeadlineExceededError(30_000));
  });

  const p = promiseRetriable(fn, NEAR_ZERO_DELAY_POLICY, isRetryable, controller.signal);
  await clock.tickAsync(10);

  const err = await t.throwsAsync(() => p);
  t.true(err instanceof DeadlineExceededError);
});

// Path C: pre-aborted signal (TimeoutError) with no prior HTTP error
test.serial('Path C: pre-aborted TimeoutError signal with no prior HTTP error throws TimeoutError', async (t) => {
  const controller = new AbortController();
  controller.abort(new DeadlineExceededError(30_000));

  const fn = sinon.stub<[AbortSignal | undefined], Promise<unknown>>();

  const p = promiseRetriable(fn, NEAR_ZERO_DELAY_POLICY, isRetryable, controller.signal);

  const err = await t.throwsAsync(() => p);
  t.true(err instanceof DeadlineExceededError);
  t.is(fn.callCount, 0); // loop top check fires before fn is called
});

// AbortError is always thrown as-is, never replaced by lastHttpError
test.serial('AbortError is always thrown as-is regardless of lastHttpError', async (t) => {
  const clock = sinon.useFakeTimers();
  t.teardown(() => clock.restore());

  const controller = new AbortController();
  const fn = sinon.stub<[AbortSignal | undefined], Promise<unknown>>();
  fn.onCall(0).rejects(new InvalidStatusError('closed', 499)); // sets lastHttpError
  fn.onCall(1).callsFake(() => {
    controller.abort(new AbortError());
    return Promise.reject(new AbortError());
  });

  const p = promiseRetriable(fn, NEAR_ZERO_DELAY_POLICY, isRetryable, controller.signal);
  await clock.tickAsync(10);

  const err = await t.throwsAsync(() => p);
  t.true(err instanceof AbortError); // NOT replaced by lastHttpError
});
