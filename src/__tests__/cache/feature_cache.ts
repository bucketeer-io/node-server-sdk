import test from 'ava';
import { creatFeature } from '@bucketeer/node-evaluation';
import { NewFeatureCache } from '../../cache/features';
import { InMemoryCache } from '../../cache/inMemoryCache';

test('features - in memory cache', async t => {
  const cache = NewFeatureCache({cache: new InMemoryCache(), ttl: 1000});
  const feature1 = creatFeature({id: 'feature1'});
  const feature2 = creatFeature({id: 'feature2'});
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