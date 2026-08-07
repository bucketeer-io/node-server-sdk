import test from 'ava';
import { SegmentUsers, Rule, Clause } from '@bucketeer/evaluation';
import { InMemoryCache } from '../../cache/inMemoryCache';
import { NewSegmentUsersCache } from '../../cache/segmentUsers';

function createSegmentUsers(
  id: string,
): SegmentUsers {
  const segmentUsers = new SegmentUsers();
  segmentUsers.setSegmentId(id);
  return segmentUsers;
}

function createSegmentUsersWithRules(id: string): SegmentUsers {
  const clause = new Clause();
  clause.setId('clause-1');
  clause.setAttribute('plan');
  clause.setOperator(Clause.Operator.EQUALS);
  clause.setValuesList(['premium']);

  const rule = new Rule();
  rule.setId('segment-rule-1');
  rule.setClausesList([clause]);

  const segmentUsers = createSegmentUsers(id);
  segmentUsers.setRulesList([rule]);
  return segmentUsers;
}

test('get should return null if key does not exist', async t => {
  const cache = new InMemoryCache<SegmentUsers>();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 1000 });

  const result = await segmentUsersCache.get('nonexistent');
  t.is(result, null);
});

test('put should store the value in the cache', async t => {
  const cache = new InMemoryCache<SegmentUsers>();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 1000 });
  const segmentUser = createSegmentUsers('segment1');

  await segmentUsersCache.put(segmentUser);
  const result = await segmentUsersCache.get('segment1');
  t.deepEqual(result, segmentUser);
});

test('put should preserve rule-based segment rules across put/get', async t => {
  const cache = new InMemoryCache<SegmentUsers>();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 1000 });
  const segmentUsers = createSegmentUsersWithRules('segment1');

  await segmentUsersCache.put(segmentUsers);
  const result = await segmentUsersCache.get('segment1');
  t.deepEqual(result, segmentUsers);
  t.is(result?.getRulesList().length, 1);
  t.is(result?.getRulesList()[0].getId(), 'segment-rule-1');
  const clauses = result?.getRulesList()[0].getClausesList() ?? [];
  t.is(clauses.length, 1);
  t.is(clauses[0].getAttribute(), 'plan');
  t.deepEqual(clauses[0].getValuesList(), ['premium']);
});

test('delete should remove the value from the cache', async t => {
  const cache = new InMemoryCache<SegmentUsers>();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 1000 });
  const segmentUser = createSegmentUsers('segment1');

  await segmentUsersCache.put(segmentUser);
  await segmentUsersCache.delete('segment1');
  const result = await segmentUsersCache.get('segment1');
  t.is(result, null);
});

test('clear should remove all values from the cache', async t => {
  const cache = new InMemoryCache<SegmentUsers>();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 1000 });
  const segmentUser1 = createSegmentUsers('segment1');
  const segmentUser2 = createSegmentUsers('segment2');

  await segmentUsersCache.put(segmentUser1);
  await segmentUsersCache.put(segmentUser2);
  await segmentUsersCache.deleteAll();
  const result1 = await segmentUsersCache.get('segment1');
  const result2 = await segmentUsersCache.get('segment2');
  t.is(result1, null);
  t.is(result2, null);
});

test('getAll should return all values from the cache', async t => {
  const cache = new InMemoryCache<SegmentUsers>();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 1000 });
  const segmentUser1 = createSegmentUsers('segment1');
  const segmentUser2 = createSegmentUsers('segment2');

  await segmentUsersCache.put(segmentUser1);
  await segmentUsersCache.put(segmentUser2);
  const result = await segmentUsersCache.getAll();
  t.deepEqual(result, [segmentUser1, segmentUser2]);
});

test('getIds should return all keys from the cache', async t => {
  const cache = new InMemoryCache<SegmentUsers>();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 1000 });
  const segmentUser1 = createSegmentUsers('segment1');
  const segmentUser2 = createSegmentUsers('segment2');

  await segmentUsersCache.put(segmentUser1);
  await segmentUsersCache.put(segmentUser2);
  const result = await segmentUsersCache.getIds();
  t.deepEqual(result, ['segment1', 'segment2']);
});
