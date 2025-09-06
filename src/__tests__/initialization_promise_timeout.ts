import test from 'ava';
import sinon from 'sinon';
import { InitializationPromise } from '../utils/initializationPromise';

let clearTimeoutSpy: sinon.SinonSpy;

test.beforeEach(() => {
  clearTimeoutSpy = sinon.spy(global, 'clearTimeout');
});

test.afterEach(() => {
  clearTimeoutSpy.restore();
});

test.serial('clearTimeout is called on success', async t => {
  const initPromise = new InitializationPromise();

  const waitPromise = initPromise.waitForInitialization(1000);
  setTimeout(() => initPromise.markAsInitialized(), 10);

  await waitPromise;
  t.true(clearTimeoutSpy.calledOnce);
});

test.serial('clearTimeout is called on failure', async t => {
  const initPromise = new InitializationPromise();

  const waitPromise = initPromise.waitForInitialization(1000);
  setTimeout(() => initPromise.markAsFailed(new Error('fail')), 10);

  await t.throwsAsync(waitPromise);
  t.true(clearTimeoutSpy.calledOnce);
});

test.serial('clearTimeout is called on timeout and not twice', async t => {
  const initPromise = new InitializationPromise();

  await t.throwsAsync(() => initPromise.waitForInitialization(10));
  t.true(clearTimeoutSpy.calledOnce);
});