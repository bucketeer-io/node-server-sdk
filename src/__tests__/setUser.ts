import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createBucketeer } from './_helper';

test.cb('setUser', (t) => {
  const EXPECTED_USER_ID = 'user-1';
  t.plan(2);
  const onGetEvaluations = () => {
    t.pass();
    t.end();
  };
  const bucketeer = createBucketeer();
  bucketeer.setUser(
    {
      id: EXPECTED_USER_ID,
      data: {},
    },
    onGetEvaluations,
  );
  const user = unwrapNullable(bucketeer.getUser());
  bucketeer.destroy();
  t.is(user.id, EXPECTED_USER_ID);
});
