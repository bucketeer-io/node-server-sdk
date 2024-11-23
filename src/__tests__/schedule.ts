import test from 'ava';
import { createSchedule, removeSchedule } from '../schedule';

test('createSchedule should return a NodeJS.Timeout', t => {
  const fn = () => {};
  const interval = 1000;
  const timeout = createSchedule(fn, interval);
  
  t.truthy(timeout);
  t.is(typeof timeout, 'object');
  removeSchedule(timeout); // Clean up
});

test('createSchedule should call the function at the specified interval', async t => {
  let callCount = 0;
  const fn = () => { callCount++; };
  const interval = 100;
  const timeout = createSchedule(fn, interval);

  await new Promise(resolve => setTimeout(resolve, 350));
  t.true(callCount >= 3);

  removeSchedule(timeout); // Clean up
});

test('removeSchedule should clear the interval', async t => {
  let callCount = 0;
  const fn = () => { callCount++; };
  const interval = 100;
  const timeout = createSchedule(fn, interval);

  await new Promise(resolve => setTimeout(resolve, 250));
  removeSchedule(timeout);

  const callCountAfterClear = callCount;
  await new Promise(resolve => setTimeout(resolve, 250));
  t.is(callCount, callCountAfterClear);
});