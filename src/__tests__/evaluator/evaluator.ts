import anyTest, { TestFn } from 'ava';
import sino from 'sinon';

import {
  Feature,
  SegmentUser,
  SegmentUsers,
  User,
  createEvaluation,
  Reason,
  createReason,
  NewUserEvaluations,
} from '@bucketeer/evaluation';

import {
  createFeature,
  createUser,
  createSegmentUser,
  createSegmentUsers,
} from '../utils/feature';

import { LocalEvaluator, protoReasonToReason } from '../../evaluator/local';
import { SEGEMENT_USERS_CACHE_TTL } from '../../cache/processor/segmentUsersCacheProcessor';
import { FEATURE_FLAG_CACHE_TTL } from '../../cache/processor/featureFlagCacheProcessor';
import { MockCache } from '../mocks/cache';

import { Clock } from '../../utils/clock';
import { NewSegmentUsersCache, SegmentUsersCache } from '../../cache/segmentUsers';
import { NewFeatureCache, FeaturesCache } from '../../cache/features';
import { ProcessorEventsEmitter } from '../../processorEventsEmitter';
import { IllegalStateError, InvalidStatusError } from '../../objects/errors';

const test = anyTest as TestFn<{
  sandbox: sino.SinonSandbox;
  evaluator: LocalEvaluator;
  cache: MockCache;
  eventEmitter: ProcessorEventsEmitter;
  clock: Clock;
  segmentUsersCache: SegmentUsersCache;
  featureFlagCache: FeaturesCache;
  data: {
    feature1: Feature;
    feature2: Feature;
    feature3: Feature;
    feature4: Feature;
    feature5: Feature;

    segmentUser1: SegmentUsers;
    segmentUser2: SegmentUsers;

    user1: User;
    user2: User;
  };
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  t.context.sandbox = sandbox;

  const user1 = createUser('user-id-1', {});
  const user2 = createUser('user-id-2', {});

  const sgUser1 = createSegmentUser('user-id-1', '', SegmentUser.State.INCLUDED);
  const sgUser2 = createSegmentUser('user-id-2', 'segment-id-2', SegmentUser.State.INCLUDED);
  const sgUser3 = createSegmentUser('user-id-3', 'segment-id-2', SegmentUser.State.INCLUDED);

  const segmentUsers1 = new SegmentUsers();
  segmentUsers1.setSegmentId('segment-id-1');
  segmentUsers1.setUsersList([sgUser1]);

  const segmentUsers2 = new SegmentUsers();
  segmentUsers2.setSegmentId('segment-id-2');
  segmentUsers2.setUsersList([sgUser2, sgUser3]);

  const feature5Id = 'feature-id-5';
  const feature5VariationFirstId = 'variation-true-id';

  const feature1 = createFeature({
    id: 'feature-id-1',
    version: 0,
    name: 'feature1',
    enabled: true,
    tags: ['server'],
    prerequisites: [{ featureId: 'feature-id-2', variationId: 'variation-true-id' }],
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    defaultStrategy: {
      type: 'FIXED',
      fixedStrategy: { variation: 'variation-true-id' },
    },
    offVariation: 'variation-false-id',
  });

  const feature2 = createFeature({
    id: 'feature-id-2',
    version: 0,
    name: 'feature2',
    enabled: true,
    tags: ['server'],
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    defaultStrategy: {
      type: 'FIXED',
      fixedStrategy: { variation: 'variation-true-id' },
    },
    offVariation: 'variation-false-id',
  });

  const feature3 = createFeature({
    id: 'feature-id-3',
    version: 0,
    name: 'feature3',
    enabled: true,
    tags: ['server'],
    prerequisites: [{ featureId: 'feature-id-4', variationId: 'variation-true-id' }],
    rules: [
      {
        id: '',
        strategy: { type: 'FIXED', fixedStrategy: { variation: '' } },
        clauses: [{
          id: '',
          attribute: '',
          operator: 'SEGMENT',
          values: [segmentUsers1.getSegmentId()],
        }],
      },
      {
        id: '',
        strategy: { type: 'FIXED', fixedStrategy: { variation: '' } },
        clauses: [{
          id: '',
          attribute: '',
          operator: 'SEGMENT',
          values: [segmentUsers2.getSegmentId()],
        }],
      },
      {
        id: '',
        strategy: { type: 'FIXED', fixedStrategy: { variation: '' } },
        clauses: [{
          id: '',
          attribute: feature5Id,
          operator: 'FEATURE_FLAG',
          values: [feature5VariationFirstId],
        }],
      },
    ],
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    defaultStrategy: {
      type: 'FIXED',
      fixedStrategy: { variation: 'variation-true-id' },
    },
    offVariation: 'variation-false-id',
  });

  const feature4 = createFeature({
    id: 'feature-id-4',
    version: 0,
    name: 'feature4',
    enabled: false,
    tags: ['server'],
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    defaultStrategy: {
      type: 'FIXED',
      fixedStrategy: { variation: 'variation-true-id' },
    },
    offVariation: 'variation-false-id',
  });

  const feature5 = createFeature({
    id: 'feature-id-5',
    version: 0,
    name: 'feature5',
    enabled: true,
    tags: ['server'],
    variations: [
      {
        id: feature5VariationFirstId,
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    rules: [
      {
        id: 'clause-id',
        strategy: { type: 'FIXED', fixedStrategy: { variation: 'variation-true-id' } },
        clauses: [{
          id: 'clause-id',
          attribute: '',
          operator: 'SEGMENT',
          values: [segmentUsers2.getSegmentId()],
        }],
      },
    ],
    defaultStrategy: {
      type: 'FIXED',
      fixedStrategy: { variation: 'variation-true-id' },
    },
    offVariation: 'variation-false-id',
  });

  const tag = 'server';
  const cache = new MockCache();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const segmentUsersCache = NewSegmentUsersCache({ cache: cache, ttl: SEGEMENT_USERS_CACHE_TTL });
  const featureFlagCache = NewFeatureCache({ cache: cache, ttl: FEATURE_FLAG_CACHE_TTL });
  const evaluator = new LocalEvaluator({
    tag: tag,
    featuresCache: featureFlagCache,
    segementUsersCache: segmentUsersCache,
  });

  t.context = {
    data: {
      feature1: feature1,
      feature2: feature2,
      feature3: feature3,
      feature4: feature4,
      feature5: feature5,
      segmentUser1: segmentUsers1,
      segmentUser2: segmentUsers2,
      user1: user1,
      user2: user2,
    },
    evaluator: evaluator,
    cache: cache,
    eventEmitter: eventEmitter,
    clock: clock,
    segmentUsersCache: segmentUsersCache,
    featureFlagCache: featureFlagCache,
    sandbox: sandbox,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test('evaluate | err: failed to get feature flag from cache', async (t) => {
  const { evaluator, featureFlagCache } = t.context;
  const { feature1 } = t.context.data;
  const err = new Error('internal error');
  const mock = t.context.sandbox.mock(featureFlagCache).expects('get');
  mock.rejects(err);
  try {
    await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature1.getId(),
    )
    t.fail('Expected error was not thrown');
  } catch (e) {
    t.deepEqual(e, new IllegalStateError(`Failed to get feature: ${err.message}`));
  }
  mock.verify();
  t.pass();
});

test('evaluate | err: get feature flag from cache | cache missing', async (t) => {
  const { evaluator, featureFlagCache } = t.context;
  const { feature1 } = t.context.data;
  const mock = t.context.sandbox.mock(featureFlagCache).expects('get');
  mock.resolves(null);

  try {
    await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature1.getId(),
    )
    t.fail('Expected error was not thrown');
  } catch (e) {
    t.deepEqual(e, new InvalidStatusError(`Feature not found: ${feature1.getId()}`, 404));
  }

  mock.verify();
  t.pass();
});

test('evaluate | err: failed to get prerequisite feature flag from cache', async (t) => {
  const { evaluator, featureFlagCache, sandbox } = t.context;
  const { feature1, feature2 } = t.context.data;
  const err = new Error('internal error');
  const mock = sandbox.mock(featureFlagCache);
  mock.expects('get').withArgs(feature2.getId()).exactly(1).rejects(err);
  mock.expects('get').withArgs(feature1.getId()).exactly(1).resolves(feature1);
  
  try {
    await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature1.getId(),
    )
    t.fail('Expected error was not thrown');
  } catch (e) {
    t.deepEqual(e, new IllegalStateError(`Failed to get feature: ${err.message}`));
  }

  mock.verify();
  t.pass();
});

test ('evaluate | err: failed to get segment from cache', async (t) => {
  const { evaluator, featureFlagCache, segmentUsersCache, sandbox } = t.context;
  const { feature5, segmentUser2 } = t.context.data;
  const err = new Error('internal error');
  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature5.getId()).resolves(feature5);
  
  const segmentUsersCacheMock = sandbox.mock(segmentUsersCache);
  segmentUsersCacheMock.expects('get').withArgs(segmentUser2.getSegmentId()).rejects(err);
  
  try {
    await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature5.getId(),
    )
    t.fail('Expected error was not thrown');
  } catch (e) {
    t.deepEqual(e, new IllegalStateError(`Failed to get segment users: ${err.message}`));
  }

  featuresCacheMock.verify();
  segmentUsersCacheMock.verify();
  
  t.pass();
});

test ('evaluate | err: get segment from cache | cache missing', async (t) => {
  const { evaluator, featureFlagCache, segmentUsersCache, sandbox } = t.context;
  const { feature5, segmentUser2 } = t.context.data;
  const err = new Error('internal error');
  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature5.getId()).resolves(feature5);
  
  const segmentUsersCacheMock = sandbox.mock(segmentUsersCache);
  segmentUsersCacheMock.expects('get').withArgs(segmentUser2.getSegmentId()).resolves(null);
  
  try {
    await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature5.getId(),
    )
    t.fail('Expected error was not thrown');
  } catch (e) {
    t.deepEqual(e, new InvalidStatusError(`Segment users not found: ${segmentUser2.getSegmentId()}`, 404));
  }

  featuresCacheMock.verify();
  segmentUsersCacheMock.verify();
  
  t.pass();
});

test ('evaluate | success: with no prerequisites', async (t) => {
  const { evaluator, featureFlagCache, segmentUsersCache, sandbox } = t.context;
  const { feature5, segmentUser2 } = t.context.data;
  
  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature5.getId()).resolves(feature5);
  
  const segmentUsersCacheMock = sandbox.mock(segmentUsersCache);
  segmentUsersCacheMock.expects('get').withArgs(segmentUser2.getSegmentId()).resolves(segmentUser2);
  
  const evaluation = await evaluator
    .evaluate(
      {
        id: 'user-id-1',
        data: {},
      },
      feature5.getId(),
    );

  t.deepEqual(evaluation, {
    id: 'feature-id-5:0:user-id-1',
    featureId: 'feature-id-5',
    featureVersion: 0,
    userId: 'user-id-1',
    variationId: 'variation-true-id',
    reason: {
      ruleId: '',
      type: 'DEFAULT',
    },
    variationValue: 'true',
    variationName: 'true-name',
  });
  featuresCacheMock.verify();
  segmentUsersCacheMock.verify();
  
  t.pass();
});

test ('evaluate | success: with prerequisite feature disabled (It must return the off variation)', async (t) => {
  const { evaluator, featureFlagCache, segmentUsersCache, sandbox } = t.context;
  const { feature3, feature4, feature5, segmentUser1, segmentUser2 } = t.context.data;
  
  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature3.getId()).resolves(feature3);
  featuresCacheMock.expects('get').withArgs(feature4.getId()).resolves(feature4);
  featuresCacheMock.expects('get').withArgs(feature5.getId()).resolves(feature5);

  const segmentUsersCacheMock = sandbox.mock(segmentUsersCache);
  segmentUsersCacheMock.expects('get').withArgs(segmentUser1.getSegmentId()).resolves(segmentUser1);
  segmentUsersCacheMock.expects('get').withArgs(segmentUser2.getSegmentId()).resolves(segmentUser2);

  const evaluation = await evaluator
    .evaluate(
      {
        id: 'user-id-1',
        data: {},
      },
      feature3.getId(),
    );

  t.deepEqual(evaluation, {
    id: 'feature-id-3:0:user-id-1',
    featureId: 'feature-id-3',
    featureVersion: 0,
    userId: 'user-id-1',
    variationId: 'variation-false-id',
    reason: {
      ruleId: '',
      type: 'PREREQUISITE',
    },
    variationValue: 'false',
    variationName: 'false-name',
  });

  featuresCacheMock.verify();
  segmentUsersCacheMock.verify();

  t.pass();
});

test ('evaluate | success: with prerequisite feature enabled (It must return the default strategy variation)', async (t) => {

  const { evaluator, featureFlagCache, sandbox } = t.context;
  const { feature1, feature2 } = t.context.data;

  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature1.getId()).resolves(feature1);
  featuresCacheMock.expects('get').withArgs(feature2.getId()).resolves(feature2);

  const evaluation = await evaluator
    .evaluate(
      {
        id: 'user-id-1',
        data: {},
      },
      feature1.getId(),
    );

  t.deepEqual(evaluation, {
    id: 'feature-id-1:0:user-id-1',
    featureId: 'feature-id-1',
    featureVersion: 0,
    userId: 'user-id-1',
    variationId: 'variation-true-id',
    reason: {
      ruleId: '',
      type: 'DEFAULT',
    },
    variationValue: 'true',
    variationName: 'true-name',
  });

  featuresCacheMock.verify();

  t.pass();
});

test ('evaluate | success: with segment user', async (t) => {
  const { evaluator, featureFlagCache, segmentUsersCache, sandbox } = t.context;
  const { feature5, segmentUser2 } = t.context.data;

  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature5.getId()).resolves(feature5);

  const segmentUsersCacheMock = sandbox.mock(segmentUsersCache);
  segmentUsersCacheMock.expects('get').withArgs(segmentUser2.getSegmentId()).resolves(segmentUser2);

  const evaluation = await evaluator
    .evaluate(
      {
        id: 'user-id-2',
        data: {},
      },
      feature5.getId(),
    );

  t.deepEqual(evaluation, {
    id: 'feature-id-5:0:user-id-2',
    featureId: 'feature-id-5',
    featureVersion: 0,
    userId: 'user-id-2',
    variationId: 'variation-true-id',
    reason: {
      //TODO: check this again, the GO SDK test has a different value for this ruleId (it is empty)
      ruleId: 'clause-id',
      type: 'RULE',
    },
    variationValue: 'true',
    variationName: 'true-name',
  });

  featuresCacheMock.verify();
  segmentUsersCacheMock.verify();

  t.pass();
});

// Rule-based segments (Bucketeer server 2.3.0+): a segment carries rules in
// addition to its included-user list. A user is in the segment when they are
// in the list OR match any rule (clauses in a rule are AND-ed).
function createRuleBasedSegmentFixture() {
  const segmentId = 'segment-id-rule-based';
  const segmentUsers = createSegmentUsers({
    segmentId: segmentId,
    updatedAt: '0',
    users: [
      {
        id: `${segmentId}:user-id-list`,
        segmentId: segmentId,
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
  });

  const feature = createFeature({
    id: 'feature-id-rule-based-segment',
    version: 0,
    name: 'feature-rule-based-segment',
    enabled: true,
    tags: ['server'],
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    rules: [
      {
        id: 'flag-rule-1',
        strategy: { type: 'FIXED', fixedStrategy: { variation: 'variation-true-id' } },
        clauses: [{
          id: 'flag-clause-1',
          attribute: '',
          operator: 'SEGMENT',
          values: [segmentId],
        }],
      },
    ],
    defaultStrategy: {
      type: 'FIXED',
      fixedStrategy: { variation: 'variation-false-id' },
    },
    offVariation: 'variation-false-id',
  });

  return { feature, segmentUsers };
}

const ruleBasedSegmentTestCases: {
  desc: string;
  user: { id: string; data: { [key: string]: string } };
  expectedVariationId: string;
  expectedReason: { ruleId: string; type: string };
}[] = [
  {
    desc: 'user matches by segment rule (AND clauses in one rule)',
    user: { id: 'user-id-rule', data: { plan: 'premium', country: 'japan' } },
    expectedVariationId: 'variation-true-id',
    expectedReason: { ruleId: 'flag-rule-1', type: 'RULE' },
  },
  {
    desc: 'user matches by the second segment rule (OR across rules)',
    user: { id: 'user-id-rule-2', data: { age: '30' } },
    expectedVariationId: 'variation-true-id',
    expectedReason: { ruleId: 'flag-rule-1', type: 'RULE' },
  },
  {
    desc: 'user matches by included-user list even when no rule matches',
    user: { id: 'user-id-list', data: { plan: 'free' } },
    expectedVariationId: 'variation-true-id',
    expectedReason: { ruleId: 'flag-rule-1', type: 'RULE' },
  },
  {
    desc: 'user matching only one of the AND clauses does not match',
    user: { id: 'user-id-partial', data: { plan: 'premium', country: 'usa' } },
    expectedVariationId: 'variation-false-id',
    expectedReason: { ruleId: '', type: 'DEFAULT' },
  },
  {
    desc: 'user missing the rule attributes does not match',
    user: { id: 'user-id-no-attr', data: {} },
    expectedVariationId: 'variation-false-id',
    expectedReason: { ruleId: '', type: 'DEFAULT' },
  },
];

for (const tc of ruleBasedSegmentTestCases) {
  test(`evaluate | rule-based segment: ${tc.desc}`, async (t) => {
    const { evaluator, featureFlagCache, segmentUsersCache, sandbox } = t.context;
    const { feature, segmentUsers } = createRuleBasedSegmentFixture();

    const featuresCacheMock = sandbox.mock(featureFlagCache);
    featuresCacheMock.expects('get').withArgs(feature.getId()).resolves(feature);

    const segmentUsersCacheMock = sandbox.mock(segmentUsersCache);
    segmentUsersCacheMock
      .expects('get')
      .withArgs(segmentUsers.getSegmentId())
      .resolves(segmentUsers);

    const evaluation = await evaluator.evaluate(tc.user, feature.getId());

    t.is(evaluation.variationId, tc.expectedVariationId);
    t.deepEqual(evaluation.reason, tc.expectedReason);

    featuresCacheMock.verify();
    segmentUsersCacheMock.verify();
  });
}

test('evaluate | rule-based segment: list-only segment without rules keeps working (backward compat)', async (t) => {
  const { evaluator, featureFlagCache, segmentUsersCache, sandbox } = t.context;
  const { feature } = createRuleBasedSegmentFixture();
  // Same segment ID, but only an included-user list, as pre-2.3.0 servers send it.
  const listOnlySegmentUsers = createSegmentUsers({
    segmentId: 'segment-id-rule-based',
    updatedAt: '0',
    users: [
      {
        id: 'segment-id-rule-based:user-id-list',
        segmentId: 'segment-id-rule-based',
        userId: 'user-id-list',
        state: 'INCLUDED',
        deleted: false,
      },
    ],
  });

  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature.getId()).twice().resolves(feature);

  const segmentUsersCacheMock = sandbox.mock(segmentUsersCache);
  segmentUsersCacheMock
    .expects('get')
    .withArgs(listOnlySegmentUsers.getSegmentId())
    .twice()
    .resolves(listOnlySegmentUsers);

  const listedUserEvaluation = await evaluator.evaluate(
    { id: 'user-id-list', data: {} },
    feature.getId(),
  );
  t.is(listedUserEvaluation.variationId, 'variation-true-id');
  t.deepEqual(listedUserEvaluation.reason, { ruleId: 'flag-rule-1', type: 'RULE' });

  // A user with matching attributes must NOT match when the segment has no rules.
  const attributeUserEvaluation = await evaluator.evaluate(
    { id: 'user-id-rule', data: { plan: 'premium', country: 'japan' } },
    feature.getId(),
  );
  t.is(attributeUserEvaluation.variationId, 'variation-false-id');
  t.deepEqual(attributeUserEvaluation.reason, { ruleId: '', type: 'DEFAULT' });

  featuresCacheMock.verify();
  segmentUsersCacheMock.verify();
});

test ('getTargetFeatures | err: failed to get feature flag from cache', async (t) => {
  const { evaluator, featureFlagCache, sandbox } = t.context;
  const { feature3, feature4 } = t.context.data;
  const err = new Error('internal error');
  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature4.getId()).rejects(err);
  
  try {
    await evaluator.getTargetFeatures(feature3);
    t.fail('Expected error was not thrown');
  } catch (e) {
    t.deepEqual(e, new IllegalStateError('Failed to get feature: internal error'));
  }
  featuresCacheMock.verify();
  
  t.pass();
});

test ('getTargetFeatures | success', async (t) => {
  const { evaluator, featureFlagCache, sandbox } = t.context;
  const { feature3, feature4, feature5 } = t.context.data;

  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature4.getId()).resolves(feature4);
  featuresCacheMock.expects('get').withArgs(feature5.getId()).resolves(feature5);
  
  const targetFeatures = await evaluator
    .getTargetFeatures(
      feature3,
    );

  t.deepEqual(targetFeatures, [feature3, feature4, feature5]);

  featuresCacheMock.verify();
  t.pass();
});

test ('findEvaluation | found', async (t) => {
  const { evaluator } = t.context;

  const evaluation = createEvaluation(
    'feature1:1:user1',
    'feature-id-1',
    1,
    'user1',
    'variation-B',
    'B',
    'Variation B',
    createReason('1', Reason.Type.DEFAULT),
  );

  const userEvaluations = NewUserEvaluations('user1', [evaluation], [], false);

  const result = evaluator.findEvaluation(userEvaluations, 'feature-id-1');
  const evaluationObject = {
    id: evaluation.getId(),
    featureId: evaluation.getFeatureId(),
    featureVersion: evaluation.getFeatureVersion(),
    userId: evaluation.getUserId(),
    variationId: evaluation.getVariationId(),
    variationName: evaluation.getVariationName(),
    variationValue: evaluation.getVariationValue(),
    reason: protoReasonToReason(evaluation.getReason()),
  }
  t.deepEqual(result, evaluationObject);

  t.pass();
});

test ('findEvaluation | evaluation not found', async (t) => {
  const { evaluator } = t.context;

  const evaluation = createEvaluation(
    'feature1:1:user1',
    'feature-id-1',
    1,
    'user1',
    'variation-B',
    'B',
    'Variation B',
    createReason('1', Reason.Type.DEFAULT),
  );

  const userEvaluations = NewUserEvaluations('user1', [evaluation], [], false);

  try {
    evaluator.findEvaluation(userEvaluations, 'feature-id-2');
    t.fail('Expected error was not thrown');
  } catch(e) {
    t.deepEqual(e, new InvalidStatusError('Evaluation not found for feature: feature-id-2', 404));
  }

  t.pass();
});