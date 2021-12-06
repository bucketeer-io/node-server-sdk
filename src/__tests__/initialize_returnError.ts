import test from 'ava';
import { createBucketeer } from './_helper';

test.cb('initialize: shold call callback func with error', (t) => {
  t.plan(1);
  const onInitialize = (error?: Error) => {
    if (error) {
      t.is(error.message, 'Network response was not ok.');
    }
    t.end();
  };
  const makeReturnError = true;
  const bucketeer = createBucketeer(onInitialize, makeReturnError);
  bucketeer.destroy();
});
