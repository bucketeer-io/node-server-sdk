import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createStorage } from '../storage/storage';
import { User } from '../objects/User';
import { createBucketeer } from './_helper';

test('getUser', (t) => {
  const EXPECTED_USER_ID = 'user';
  const bucketeer = createBucketeer();
  const user = unwrapNullable(bucketeer.getUser());
  bucketeer.destroy();
  t.is(user.id, EXPECTED_USER_ID);
});

test('getUser: use storage data', (t) => {
  const EXPECTED_USER_DATA = { foo: 'bar', baz: 'qux' };
  const storage = unwrapNullable(createStorage());
  storage.setUser(new User({ id: 'user', data: { baz: 'qux' } }));
  storage.save();
  const bucketeer = createBucketeer();
  const user = unwrapNullable(bucketeer.getUser());
  bucketeer.destroy();
  t.deepEqual(user.data, EXPECTED_USER_DATA);
});
