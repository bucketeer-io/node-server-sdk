import anyTest, { TestFn } from 'ava';
import sino from 'sinon';
import { GetSegmentUsersResponse } from '../../../../objects/response';
import { SegmentUsers } from '../../../../objects/segment';
import {
  DefaultSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
} from '../../../../cache/processor/segmentUsersCacheProcessor';
import { InMemoryCache } from '../../../../cache/inMemoryCache';
import { MockAPIClient } from '../../../mocks/api';
import { Clock } from '../../../../utils/clock';
import { NewSegmentUsersCache, SegmentUsersCache } from '../../../../cache/segmentUsers';
import { NewFeatureCache } from '../../../../cache/features';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';
import { LocalEvaluator } from '../../../../evaluator/local';
import { createFeature } from '../../../utils/feature';

// Verifies that rule-based segment rules survive the
// whole local-evaluation data path:
//   API response parse -> cache processor -> segment users cache -> evaluator.

const test = anyTest as TestFn<{
  sandbox: sino.SinonSandbox;
  processor: DefaultSegementUserCacheProcessor;
  segmentUsersCache: SegmentUsersCache;
  apiClient: MockAPIClient;
  cache: InMemoryCache<unknown>;
}>;

const segmentUsersResponse: SegmentUsers = {
  segmentId: 'segment-id-rule-based',
  updatedAt: '20',
  users: [
    {
      id: 'segment-id-rule-based:user-id-list',
      segmentId: 'segment-id-rule-based',
      userId: 'user-id-list',
      state: 'INCLUDED',
      deleted: false,
    },
  ],
  rules: [
    {
      id: 'segment-rule-1',
      clauses: [
        { id: 'clause-1', attribute: 'plan', operator: 'EQUALS', values: ['premium'] },
        { id: 'clause-2', attribute: 'country', operator: 'IN', values: ['japan', 'vietnam'] },
      ],
    },
    {
      id: 'segment-rule-2',
      clauses: [{ id: 'clause-3', attribute: 'age', operator: 'GREATER', values: ['18'] }],
    },
  ],
};

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new InMemoryCache();
  const apiClient = new MockAPIClient();
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: SEGEMENT_USERS_CACHE_TTL });
  const processor = new DefaultSegementUserCacheProcessor({
    cache,
    segmentUsersCache,
    pollingInterval: 1000,
    apiClient,
    eventEmitter: new ProcessorEventsEmitter(),
    clock: new Clock(),
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '1.0.0',
  });

  t.context = { sandbox, processor, segmentUsersCache, apiClient, cache };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

function stubGetSegmentUsers(
  sandbox: sino.SinonSandbox,
  apiClient: MockAPIClient,
  response: GetSegmentUsersResponse,
) {
  sandbox.stub(apiClient, 'getSegmentUsers').resolves([response, 256]);
}

test('full-state update (forceUpdate: true) carries segment rules into the cache', async (t) => {
  const { sandbox, processor, segmentUsersCache, apiClient } = t.context;
  stubGetSegmentUsers(sandbox, apiClient, {
    segmentUsers: [segmentUsersResponse],
    deletedSegmentIds: [],
    requestedAt: '20',
    forceUpdate: true,
  });

  await processor.runUpdateCache();

  const cached = await segmentUsersCache.get('segment-id-rule-based');
  t.truthy(cached);
  t.is(cached?.getUsersList().length, 1);
  t.is(cached?.getRulesList().length, 2);
  t.is(cached?.getRulesList()[0].getId(), 'segment-rule-1');
  t.is(cached?.getRulesList()[0].getClausesList().length, 2);
  t.is(cached?.getRulesList()[1].getId(), 'segment-rule-2');
});

test('diff update (forceUpdate: false) carries segment rules into the cache', async (t) => {
  const { sandbox, processor, segmentUsersCache, apiClient } = t.context;
  stubGetSegmentUsers(sandbox, apiClient, {
    segmentUsers: [segmentUsersResponse],
    deletedSegmentIds: [],
    requestedAt: '20',
    forceUpdate: false,
  });

  await processor.runUpdateCache();

  const cached = await segmentUsersCache.get('segment-id-rule-based');
  t.truthy(cached);
  t.is(cached?.getRulesList().length, 2);
});

test('cached rules reach the evaluator: user matches the segment by rules only', async (t) => {
  const { sandbox, processor, segmentUsersCache, cache, apiClient } = t.context;
  stubGetSegmentUsers(sandbox, apiClient, {
    segmentUsers: [segmentUsersResponse],
    deletedSegmentIds: [],
    requestedAt: '20',
    forceUpdate: true,
  });
  await processor.runUpdateCache();

  const featureFlagCache = NewFeatureCache({ cache, ttl: 0 });
  const feature = createFeature({
    id: 'feature-id-rule-based-segment',
    version: 0,
    name: 'feature-rule-based-segment',
    enabled: true,
    tags: ['server'],
    variations: [
      { id: 'variation-true-id', name: 'true-name', value: 'true', description: '' },
      { id: 'variation-false-id', name: 'false-name', value: 'false', description: '' },
    ],
    rules: [
      {
        id: 'flag-rule-1',
        strategy: { type: 'FIXED', fixedStrategy: { variation: 'variation-true-id' } },
        clauses: [{
          id: 'flag-clause-1',
          attribute: '',
          operator: 'SEGMENT',
          values: ['segment-id-rule-based'],
        }],
      },
    ],
    defaultStrategy: { type: 'FIXED', fixedStrategy: { variation: 'variation-false-id' } },
    offVariation: 'variation-false-id',
  });
  await featureFlagCache.put(feature);

  const evaluator = new LocalEvaluator({
    tag: 'server',
    featuresCache: featureFlagCache,
    segementUsersCache: segmentUsersCache,
  });

  // Not in the included-user list, matches segment-rule-1 by attributes.
  const ruleMatch = await evaluator.evaluate(
    { id: 'user-id-rule', data: { plan: 'premium', country: 'japan' } },
    feature.getId(),
  );
  t.is(ruleMatch.variationId, 'variation-true-id');
  t.deepEqual(ruleMatch.reason, { ruleId: 'flag-rule-1', type: 'RULE' });

  // In the included-user list, matches no rule.
  const listMatch = await evaluator.evaluate(
    { id: 'user-id-list', data: {} },
    feature.getId(),
  );
  t.is(listMatch.variationId, 'variation-true-id');
  t.deepEqual(listMatch.reason, { ruleId: 'flag-rule-1', type: 'RULE' });

  // Neither in the list nor matching any rule.
  const noMatch = await evaluator.evaluate(
    { id: 'user-id-none', data: { plan: 'free' } },
    feature.getId(),
  );
  t.is(noMatch.variationId, 'variation-false-id');
  t.deepEqual(noMatch.reason, { ruleId: '', type: 'DEFAULT' });
});
