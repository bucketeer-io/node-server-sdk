import test from 'ava';
import { createBucketeer } from './_helper';

test.cb('initialize: shold call callback func', (t) => {
  t.plan(1);
  const onInitialize = () => {
    t.pass();
    t.end();
  };
  const bucketeer = createBucketeer(onInitialize);
  bucketeer.destroy();
});
