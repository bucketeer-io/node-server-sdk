import test from 'ava';
import { createFeature } from '@kenji71089/evaluation';
import { NewFeatureCache } from '../../cache/features';
import { InMemoryCache } from '../../cache/inMemoryCache';

test('put - delete - get', async t => {
  const cache = NewFeatureCache({cache: new InMemoryCache(), ttl: 1000});
  const feature1 = createFeature({id: 'feature1'});
  const feature2 = createFeature({id: 'feature2'});
  await cache.put(feature1);
  await cache.put(feature2);

  t.deepEqual(await cache.get('feature1'), feature1);
  t.deepEqual(await cache.get('feature2'), feature2);

  await cache.delete('feature1');
  const deletedValue = await cache.get('feature1');
  t.is(deletedValue, null);

  await cache.deleteAll();
  const clearedValue = await cache.get('feature2');
  t.is(clearedValue, null);
});

test('get should return null if key does not exist', async t => {
  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });

  const result = await featureCache.get('nonexistent');
  t.is(result, null);
});

test('put should store the value in the cache', async t => {
  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });
  const feature = createFeature({id: 'feature1'});

  await featureCache.put(feature);
  const result = await featureCache.get('feature1');
  t.deepEqual(result, feature);
});

test('delete should remove the value from the cache', async t => {
  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });
  const feature = createFeature({id: 'feature1'});

  await featureCache.put(feature);
  await featureCache.delete('feature1');
  const result = await featureCache.get('feature1');
  t.is(result, null);
});

test('clear should remove all values from the cache', async t => {
  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });
  const feature1 = createFeature({id: 'feature1'});
  const feature2 = createFeature({id: 'feature2'});

  await featureCache.put(feature1);
  await featureCache.put(feature2);
  await featureCache.deleteAll();
  const result1 = await featureCache.get('feature1');
  const result2 = await featureCache.get('feature2');
  t.is(result1, null);
  t.is(result2, null);
});