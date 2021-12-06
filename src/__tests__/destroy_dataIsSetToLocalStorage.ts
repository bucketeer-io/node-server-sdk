import test from 'ava';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';
import { createStorage } from '../storage/storage';
import { createBucketeer } from './_helper';

test('destroy: data is set to LocalStorage', (t) => {
  const EXPECTED = 'user';
  const bucketeer = createBucketeer();
  bucketeer.destroy();
  const storage = unwrapNullable(createStorage());
  const user = unwrapNullable(storage.getUser());
  t.is(user.id, EXPECTED);
});
