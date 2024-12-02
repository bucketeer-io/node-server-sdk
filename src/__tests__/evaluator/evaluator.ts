import anyTest, { TestFn } from 'ava';
import sino from 'sinon';

import {
  createFeature,
  Feature,
  SegmentUser,
  SegmentUsers,
  User,
  createPrerequisite,
  Strategy,
  Clause,
  createUser,
  createSegmentUser,
} from '@bucketeer/evaluation';

import { LocalEvaluator } from '../../evaluator/local';
import { SEGEMENT_USERS_CACHE_TTL } from '../../cache/processor/segmentUsersCacheProcessor';
import { FEATURE_FLAG_CACHE_TTL } from '../../cache/processor/featureFlagCacheProcessor';
import { MockCache } from '../mocks/cache';
import { MockGRPCClient } from '../mocks/gprc';

import { Clock } from '../../utils/clock';
import { NewSegmentUsersCache, SegmentUsersCache } from '../../cache/segmentUsers';
import { NewFeatureCache, FeaturesCache } from '../../cache/features';
import { ProcessorEventsEmitter } from '../../processorEventsEmitter';
import { IllegalStateError } from '../../objects/errors';

const test = anyTest as TestFn<{
  sandbox: sino.SinonSandbox;
  evaluator: LocalEvaluator;
  cache: MockCache;
  grpc: MockGRPCClient;
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

  const feature1 = createFeature({
    id: 'feature-id-1',
    version: 0,
    name: 'feature1',
    enabled: true,
    tagList: ['server'],
    prerequisitesList: [createPrerequisite('feature-id-2', 'variation-true-id')],
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
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const feature2 = createFeature({
    id: 'feature-id-2',
    version: 0,
    name: 'feature2',
    enabled: true,
    tagList: ['server'],
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
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const feature3 = createFeature({
    id: 'feature-id-3',
    version: 0,
    name: 'feature3',
    enabled: true,
    tagList: ['server'],
    prerequisitesList: [createPrerequisite('feature-id-4', 'variation-true-id')],
    rules: [
      {
        id: '',
        attribute: '',
        fixedVariation: '',
        operator: Clause.Operator.SEGMENT,
        values: [segmentUsers1.getSegmentId()],
      },
      {
        id: '',
        attribute: '',
        fixedVariation: '',
        operator: Clause.Operator.SEGMENT,
        values: [segmentUsers2.getSegmentId()],
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
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const feature4 = createFeature({
    id: 'feature-id-4',
    version: 0,
    name: 'feature4',
    enabled: false,
    tagList: ['server'],
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
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const feature5 = createFeature({
    id: 'feature-id-5',
    version: 0,
    name: 'feature5',
    enabled: true,
    tagList: ['server'],
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
        id: 'clause-id',
        attribute: '',
        operator: Clause.Operator.SEGMENT,
        values: [segmentUsers2.getSegmentId()],
        fixedVariation: 'variation-true-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const tag = 'server';
  const cache = new MockCache();
  const grpc = new MockGRPCClient();
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
    grpc: grpc,
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
  await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature1.getId(),
    )
    .catch((e) => {
      t.deepEqual(e, new IllegalStateError(`Failed to evaluate feature: ${err.message}`));
    });
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
  
  await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature1.getId(),
    )
    .catch((e) => {
      t.deepEqual(e, new IllegalStateError(`Failed to evaluate feature: ${err.message}`));
    });

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
  
  await evaluator
    .evaluate(
      {
        id: 'id',
        data: {},
      },
      feature5.getId(),
    )
    .catch((e) => {
      t.deepEqual(e, new IllegalStateError(`Failed to evaluate feature: ${err.message}`));
    });

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
  const { feature3, feature4, segmentUser1, segmentUser2 } = t.context.data;
  
  const featuresCacheMock = sandbox.mock(featureFlagCache);
  featuresCacheMock.expects('get').withArgs(feature3.getId()).resolves(feature3);
  featuresCacheMock.expects('get').withArgs(feature4.getId()).resolves(feature4);

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