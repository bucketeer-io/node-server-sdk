import anyTest, { TestFn } from 'ava';
import sinon from 'sinon';

import {
  promiseRetriable,
  RetryPolicy,
  ShouldRetryFn,
} from '../utils/promiseRetriable';

const test = anyTest as TestFn<{ clock: sinon.SinonFakeTimers }>;

const policy: RetryPolicy = {
  maxRetries: 3,
  delay: 100,
};

test.beforeEach((t) => {
  t.context.clock = sinon.useFakeTimers();
});

test.afterEach((t) => {
  t.context.clock.restore();
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
  const delay = 250;

  const resultPromise = promiseRetriable(
    fn as () => Promise<string>,
    { ...policy, maxRetries: 2, delay },
    shouldRetry as unknown as ShouldRetryFn,
  );

  await Promise.resolve();
  t.is(fn.callCount, 1);

  await t.context.clock.tickAsync(delay - 1);
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
    { ...policy, maxRetries: 2, delay: 10 },
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
    const delay = 150;
    const fn = sinon.stub<[], Promise<never>>().rejects(error);
    const shouldRetry = sinon.stub<[Error], boolean>();
    shouldRetry.onCall(0).returns(true);
    shouldRetry.onCall(1).returns(true);
    shouldRetry.returns(false);

    const resultPromise = promiseRetriable(
      fn as () => Promise<never>,
      { ...policy, maxRetries: 4, delay },
      shouldRetry as unknown as ShouldRetryFn,
    );

    await Promise.resolve();
    t.is(fn.callCount, 1);
    t.is(shouldRetry.callCount, 1);

    await t.context.clock.tickAsync(delay);
    t.is(fn.callCount, 2);
    t.is(shouldRetry.callCount, 2);

    await t.context.clock.tickAsync(delay * 2);
    t.is(fn.callCount, 3);
    t.is(shouldRetry.callCount, 3);

    const thrownError = await t.throwsAsync(resultPromise);
    t.is(thrownError, error);
    t.is(fn.callCount, 3);
  },
);

test.serial(
  'applies linear backoff by scaling the delay with each attempt',
  async (t) => {
    const error = new Error('linear backoff');
    const delay = 75;
    const fn = sinon.stub<[], Promise<never>>().rejects(error);
    const shouldRetry = sinon.stub<[Error], boolean>();
    shouldRetry.onCall(0).returns(true);
    shouldRetry.onCall(1).returns(true);
    shouldRetry.returns(false);

    const resultPromise = promiseRetriable(
      fn as () => Promise<never>,
      { ...policy, maxRetries: 4, delay },
      shouldRetry as unknown as ShouldRetryFn,
    );

    await Promise.resolve();
    t.is(fn.callCount, 1);

    await t.context.clock.tickAsync(delay);
    t.is(fn.callCount, 2);

    await t.context.clock.tickAsync(delay * 2 - 1);
    t.is(fn.callCount, 2);

    await t.context.clock.tickAsync(1);
    t.is(fn.callCount, 3);

    await t.context.clock.tickAsync(1000);
    const thrownError = await t.throwsAsync(resultPromise);
    t.is(thrownError, error);
    t.is(shouldRetry.callCount, 3);
  },
);

test.serial(
  'supports constant backoff strategy when configured',
  async (t) => {
    const error = new Error('constant backoff');
    const delay = 60;
    const fn = sinon.stub<[], Promise<never>>().rejects(error);
    const shouldRetry = sinon.stub<[Error], boolean>();
    shouldRetry.onCall(0).returns(true);
    shouldRetry.onCall(1).returns(true);
    shouldRetry.returns(false);

    const resultPromise = promiseRetriable(
      fn as () => Promise<never>,
      { ...policy, maxRetries: 4, delay, backoffStrategy: 'constant' },
      shouldRetry as unknown as ShouldRetryFn,
    );

    await Promise.resolve();
    t.is(fn.callCount, 1);

    await t.context.clock.tickAsync(delay);
    t.is(fn.callCount, 2);

    await t.context.clock.tickAsync(delay - 1);
    t.is(fn.callCount, 2);

    await t.context.clock.tickAsync(1);
    t.is(fn.callCount, 3);

    await t.context.clock.tickAsync(1000);
    const thrownError = await t.throwsAsync(resultPromise);
    t.is(thrownError, error);
    t.is(shouldRetry.callCount, 3);
  },
);
