import test from 'ava';
import {
  createTimestamp,
  latencySecondsSince,
  latencyStart,
} from '../utils/time';

// Regression test for: "duration is nil and latencySecond is 0".
//
// Before the fix, the Node SDK measured latency with `Date.now()`, which has
// 1ms resolution. For sub-millisecond operations (in particular
// `getEvaluationLocally`, where the work is just an `await
// localEvaluator.evaluate(...)`), `(Date.now() - startTime) / 1000` rounded
// to exactly 0, the SDK shipped `latencySecond: 0`, and the backend rejected
// the metrics event. The fix replaces the timer with
// `process.hrtime.bigint()` (sub-microsecond, monotonic).

test('latencyStart returns a bigint', (t) => {
  const start = latencyStart();
  t.is(typeof start, 'bigint');
});

test('latencySecondsSince returns a finite, non-negative number', (t) => {
  const start = latencyStart();
  const elapsed = latencySecondsSince(start);
  t.is(typeof elapsed, 'number');
  t.true(Number.isFinite(elapsed));
  t.true(elapsed >= 0);
});

test('latencySecondsSince > 0 for an awaited microtask (regression for "latencySecond is 0")', async (t) => {
  // This mirrors `client.ts::getEvaluationLocally`, which is the path that
  // most commonly produced `latencySecond: 0` in production:
  //
  //   const startMark = latencyStart();
  //   await localEvaluator.evaluate(...);
  //   const second = latencySecondsSince(startMark);
  //
  // Even an immediately-resolved `await` schedules a microtask, which always
  // takes >> 1 nanosecond. With the old `Date.now()`-based clock this
  // routinely measured 0; with the new clock it must be strictly > 0.
  for (let i = 0; i < 100; i++) {
    const start = latencyStart();
    await Promise.resolve();
    const second = latencySecondsSince(start);
    t.true(
      second > 0,
      `iteration ${i}: expected latencySecondsSince > 0 for an awaited microtask, got ${second}`,
    );
  }
});

test('latencySecondsSince has sub-millisecond resolution (proves the fix)', async (t) => {
  // The pre-fix `Date.now()` timer has 1ms granularity, so this assertion
  // would have been impossible to satisfy. Show that the new helper can
  // measure intervals smaller than 1 millisecond. We sample a few
  // microtasks; at least one is expected to come back below 1ms on any
  // reasonable hardware.
  let sawSubMs = false;
  for (let i = 0; i < 50; i++) {
    const start = latencyStart();
    await Promise.resolve();
    const second = latencySecondsSince(start);
    if (second > 0 && second < 0.001) {
      sawSubMs = true;
      break;
    }
  }
  t.true(
    sawSubMs,
    'expected at least one awaited microtask to measure < 1ms with the new helper',
  );
});

test('latencySecondsSince matches process.hrtime.bigint diff in seconds', (t) => {
  // Sanity: the helper actually divides the bigint diff by 1e9.
  const start = latencyStart();
  const hrtimeStart = process.hrtime.bigint();
  // burn a tiny amount of work
  for (let i = 0; i < 1000; i++) {
    Math.sqrt(i);
  }
  const second = latencySecondsSince(start);
  const hrtimeDiffSec = Number(process.hrtime.bigint() - hrtimeStart) / 1e9;
  // helper measured BEFORE the second hrtime read, so it must be <= the
  // independently-computed value.
  t.true(second > 0);
  t.true(second <= hrtimeDiffSec + 1e-6);
});

test('createTimestamp still returns whole seconds (unchanged)', (t) => {
  const ts = createTimestamp();
  t.is(typeof ts, 'number');
  t.true(Number.isInteger(ts));
  t.true(ts > 1_700_000_000); // > Nov 2023, sanity
});
