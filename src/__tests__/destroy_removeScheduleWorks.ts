import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createStorage } from '../storage/storage';
import { createBucketeer } from './_helper';

test('destroy: removeSchedule works', (t) => {
  const EXPECTED_CLEAR_INTERVAL_CALL_COUNT = 2;
  t.plan(EXPECTED_CLEAR_INTERVAL_CALL_COUNT);
  // tslint:disable-next-line no-any
  const g: any = global;
  g.window.clearInterval = () => {
    t.pass();
  };
  const bucketeer = createBucketeer();
  bucketeer.destroy();
});
