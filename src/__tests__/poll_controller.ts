import test from 'ava';
import sinon from 'sinon';
import { PollController, createTimeoutSignal, isOperationTimedOutError, isOperationAbortedError } from '../utils/pollController';
import { TimeoutError, AbortError } from '../objects/errors';

test('createSignal returns a non-aborted signal', (t) => {
  const pc = new PollController();
  const signal = pc.createSignal(1000);
  t.false(signal.aborted);
  pc.abort();
});

test('createSignal aborts the previous signal when called again', (t) => {
  const pc = new PollController();
  const first = pc.createSignal(1000);
  t.false(first.aborted);
  pc.createSignal(1000);
  t.true(first.aborted);
  pc.abort();
});

test('abort() aborts the current signal', (t) => {
  const pc = new PollController();
  const signal = pc.createSignal(1000);
  t.false(signal.aborted);
  pc.abort();
  t.true(signal.aborted);
});

test('abort() is a no-op when no signal has been created', (t) => {
  const pc = new PollController();
  t.notThrows(() => pc.abort());
});

test('abort() is a no-op when called a second time', (t) => {
  const pc = new PollController();
  pc.createSignal(1000);
  pc.abort();
  t.notThrows(() => pc.abort());
});

test.serial('signal is aborted after pollingInterval elapses', (t) => {
  const clock = sinon.useFakeTimers();
  try {
    const pc = new PollController();
    const signal = pc.createSignal(100);
    t.false(signal.aborted);
    clock.tick(100);
    t.true(signal.aborted);
  } finally {
    clock.restore();
  }
});

test.serial('createSignal timeout fires with TimeoutError as abort reason', async (t) => {
  const pc = new PollController();
  const signal = pc.createSignal(50);
  await new Promise<void>((resolve) => {
    signal.addEventListener('abort', () => resolve(), { once: true });
  });
  t.true(signal.reason instanceof TimeoutError);
  t.true(isOperationTimedOutError(signal.reason));
});

test('abort() fires with AbortError as abort reason', (t) => {
  const pc = new PollController();
  const signal = pc.createSignal(10_000);
  pc.abort();
  t.true(signal.reason instanceof AbortError);
  t.true(isOperationAbortedError(signal.reason));
});

test('createSignal replacing previous gives old signal AbortError reason', (t) => {
  const pc = new PollController();
  const first = pc.createSignal(10_000);
  pc.createSignal(10_000);
  t.true(isOperationAbortedError(first.reason));
  t.false(isOperationTimedOutError(first.reason));
  pc.abort();
});

test('createTimeoutSignal: returns a non-aborted signal initially', (t) => {
  const signal = createTimeoutSignal(10_000);
  t.false(signal.aborted);
});

test.serial('createTimeoutSignal: signal aborts with TimeoutError after timeoutMs elapses', (t) => {
  const clock = sinon.useFakeTimers();
  try {
    const signal = createTimeoutSignal(100);
    t.false(signal.aborted);
    clock.tick(100);
    t.true(signal.aborted);
  } finally {
    clock.restore();
  }
});

test.serial('createTimeoutSignal: signal.reason is TimeoutError with correct timeoutMillis', (t) => {
  const clock = sinon.useFakeTimers();
  try {
    const signal = createTimeoutSignal(250);
    clock.tick(250);
    t.true(signal.reason instanceof TimeoutError);
    t.is((signal.reason as TimeoutError).timeoutMillis, 250);
    t.true(isOperationTimedOutError(signal.reason));
  } finally {
    clock.restore();
  }
});

test.serial('replacing signal before timeout fires clears the old timer and arms a new one', (t) => {
  const clock = sinon.useFakeTimers();
  try {
    const pc = new PollController();
    pc.createSignal(100);
    const second = pc.createSignal(100);
    clock.tick(50);
    t.false(second.aborted, 'new signal should not be aborted yet');
    clock.tick(50);
    t.true(second.aborted, 'new signal should be aborted by its own timer');
  } finally {
    clock.restore();
  }
});
