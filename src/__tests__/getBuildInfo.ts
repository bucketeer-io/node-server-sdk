import test from 'ava';
import { createBucketeer } from './_helper';

test('getBuildInfo', (t) => {
  const bucketeer = createBucketeer();
  const buildInfo = bucketeer.getBuildInfo();
  t.true(typeof buildInfo.GIT_REVISION === 'string');
  bucketeer.destroy();
});
