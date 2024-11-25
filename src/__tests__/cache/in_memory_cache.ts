import test from 'ava';
import { InMemoryCache } from '../../cache/inMemoryCache';

test('put and get a value', async t => {
  const cache = new InMemoryCache();
  await cache.put('key1', 'value1', 1000);
  const value = await cache.get('key1');
  t.is(value, 'value1');
});

test('get returns null for non-existent key', async t => {
  const cache = new InMemoryCache();
  const value = await cache.get('nonExistentKey');
  t.is(value, null);
});

test('get returns null for expired key', async t => {
  const cache = new InMemoryCache();
  await cache.put('key1', 'value1', 1);
  await new Promise(resolve => setTimeout(resolve, 10)); // wait for the key to expire
  const value = await cache.get('key1');
  t.is(value, null);
});

test('scan returns keys with given prefix', async t => {
  const cache = new InMemoryCache();
  await cache.put('prefix_key1', 'value1', 1000);
  await cache.put('prefix_key2', 'value2', 1000);
  await cache.put('other_key', 'value3', 1000);
  const keys = await cache.scan('prefix_');
  t.deepEqual(keys, ['prefix_key1', 'prefix_key2']);
});

test('delete removes a key', async t => {
  const cache = new InMemoryCache();
  await cache.put('key1', 'value1', 1000);
  await cache.delete('key1');
  const value = await cache.get('key1');
  t.is(value, null);
});

test('destroy clears all entries', async t => {
  const cache = new InMemoryCache();
  await cache.put('key1', 'value1', 1000);
  await cache.put('key2', 'value2', 1000);
  await cache.deleteAll();
  const value1 = await cache.get('key1');
  const value2 = await cache.get('key2');
  t.is(value1, null);
  t.is(value2, null);
});