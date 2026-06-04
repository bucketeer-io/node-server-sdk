import test from 'ava';
import sinon from 'sinon';
import { PollController } from '../utils/pollController';

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
