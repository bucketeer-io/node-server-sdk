import test from 'ava';
import sinon from 'sinon';
import { PollController, createDeadlineExceededSignal, isDeadlineExceededError, isOperationAbortedError } from '../utils/pollController';
import { DeadlineExceededError, AbortError } from '../objects/errors';

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

test.serial('createSignal timeout fires with DeadlineExceededError as abort reason', async (t) => {
  const pc = new PollController();
  const signal = pc.createSignal(50);
  await new Promise<void>((resolve) => {
    signal.addEventListener('abort', () => resolve(), { once: true });
  });
  t.true(signal.reason instanceof DeadlineExceededError);
  t.true(isDeadlineExceededError(signal.reason));
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
  t.false(isDeadlineExceededError(first.reason));
  pc.abort();
});

test('createDeadlineExceededSignal: returns a non-aborted signal initially', (t) => {
  const signal = createDeadlineExceededSignal(10_000);
  t.false(signal.aborted);
});

test.serial('createDeadlineExceededSignal: signal aborts with DeadlineExceededError after timeoutMs elapses', (t) => {
  const clock = sinon.useFakeTimers();
  try {
    const signal = createDeadlineExceededSignal(100);
    t.false(signal.aborted);
    clock.tick(100);
    t.true(signal.aborted);
  } finally {
    clock.restore();
  }
});

test.serial('createDeadlineExceededSignal: signal.reason is DeadlineExceededError with correct timeoutMillis', (t) => {
  const clock = sinon.useFakeTimers();
  try {
    const signal = createDeadlineExceededSignal(250);
    clock.tick(250);
    t.true(signal.reason instanceof DeadlineExceededError);
    t.is((signal.reason as DeadlineExceededError).timeoutMillis, 250);
    t.true(isDeadlineExceededError(signal.reason));
  } finally {
    clock.restore();
  }
});

// Predicate cause-awareness tests
//
// Node wraps the abort reason in a DOMException{name:'AbortError', cause:<reason>} when
// https.request is cancelled via its signal. These tests verify that the predicates
// correctly classify the error based on the cause, not just the outer DOMException type.

function makeDOMException(cause: unknown) {
  return Object.assign(new Error('The operation was aborted'), {
    name: 'AbortError',
    code: 'ABORT_ERR',
    cause,
  });
}

test('isDeadlineExceededError: DOMException wrapping DeadlineExceededError cause returns true', (t) => {
  t.true(isDeadlineExceededError(makeDOMException(new DeadlineExceededError(50))));
});

test('isDeadlineExceededError: DOMException wrapping AbortError cause returns false', (t) => {
  t.false(isDeadlineExceededError(makeDOMException(new AbortError())));
});

test('isOperationAbortedError: DOMException wrapping AbortError cause returns true', (t) => {
  t.true(isOperationAbortedError(makeDOMException(new AbortError())));
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
