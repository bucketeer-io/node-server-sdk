import anyTest, { TestFn } from 'ava';
import sino from 'sinon';
import { isHeldOut } from '@bucketeer/evaluation';
import { InMemoryCache } from '../../cache/inMemoryCache';
import { FeaturesCache, NewFeatureCache } from '../../cache/features';
import { HoldoutGroupsCache, NewHoldoutGroupsCache } from '../../cache/holdoutGroups';
import { NewSegmentUsersCache, SegmentUsersCache } from '../../cache/segmentUsers';
import { toEvaluatorHoldoutGroups } from '../../cache/processor/converter';
import { LocalEvaluator } from '../../evaluator/local';
import { IllegalStateError } from '../../objects/errors';
import { Evaluation } from '../../objects/evaluation';
import { HoldoutGroup } from '../../objects/holdout';
import { createFeature, createSegmentUsers, createUser } from '../utils/feature';
import {
  HASH_HOLDOUT_GROUP_ID,
  HELD_OUT_USER_ID,
  HOLDOUT_FEATURE_ID,
  HOLDOUT_SEGMENT_ID,
  HOLDOUT_VARIATION_ID,
  NORMAL_VARIATION_ID,
  NOT_HELD_OUT_USER_ID,
  SEGMENT_HOLDOUT_GROUP_ID,
  hashHoldoutGroup,
  holdoutTargetFeature,
  segmentHoldoutGroup,
} from '../utils/holdout';

// Local evaluation with the holdout groups the feature flag processor caches.
// Membership itself belongs to @bucketeer/evaluation; these tests cover what
// the SDK feeds it and what it reports back.

const SEGMENT_MEMBER_USER_ID = 'user-id-segment-member';
const SEGMENT_OTHER_USER_ID = 'user-id-segment-other';

const test = anyTest as TestFn<{
  sandbox: sino.SinonSandbox;
  evaluator: LocalEvaluator;
  featuresCache: FeaturesCache;
  segmentUsersCache: SegmentUsersCache;
  holdoutGroupsCache: HoldoutGroupsCache;
  warn: sino.SinonSpy;
}>;

test.beforeEach(async (t) => {
  const sandbox = sino.createSandbox();
  const cache = new InMemoryCache();
  const featuresCache = NewFeatureCache({ cache, ttl: 0 });
  const segmentUsersCache = NewSegmentUsersCache({ cache, ttl: 0 });
  const holdoutGroupsCache = NewHoldoutGroupsCache({ cache, ttl: 0 });
  const warn = sandbox.spy();
  const evaluator = new LocalEvaluator({
    tag: 'server',
    featuresCache,
    segementUsersCache: segmentUsersCache,
    holdoutGroupsCache,
    logger: { error: sandbox.spy(), warn, info: sandbox.spy(), debug: sandbox.spy() },
  });
  await featuresCache.put(createFeature(holdoutTargetFeature()));

  t.context = { sandbox, evaluator, featuresCache, segmentUsersCache, holdoutGroupsCache, warn };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

async function cacheGroups(holdoutGroupsCache: HoldoutGroupsCache, groups: HoldoutGroup[]) {
  await holdoutGroupsCache.put(toEvaluatorHoldoutGroups(groups));
}

async function cacheHoldoutSegment(segmentUsersCache: SegmentUsersCache) {
  await segmentUsersCache.put(
    createSegmentUsers({
      segmentId: HOLDOUT_SEGMENT_ID,
      users: [
        {
          id: `${HOLDOUT_SEGMENT_ID}:${SEGMENT_MEMBER_USER_ID}`,
          segmentId: HOLDOUT_SEGMENT_ID,
          userId: SEGMENT_MEMBER_USER_ID,
          state: 'INCLUDED',
          deleted: false,
        },
      ],
    }),
  );
}

function normalEvaluation(userId: string): Evaluation {
  return {
    id: `${HOLDOUT_FEATURE_ID}:3:${userId}`,
    featureId: HOLDOUT_FEATURE_ID,
    featureVersion: 3,
    userId,
    variationId: NORMAL_VARIATION_ID,
    variationName: 'true-name',
    variationValue: 'true',
    reason: { type: 'DEFAULT', ruleId: '' },
  };
}

function holdoutEvaluation(userId: string, holdoutGroupId: string): Evaluation {
  return {
    id: `${HOLDOUT_FEATURE_ID}:3:${userId}`,
    featureId: HOLDOUT_FEATURE_ID,
    featureVersion: 3,
    userId,
    variationId: HOLDOUT_VARIATION_ID,
    variationName: 'false-name',
    variationValue: 'false',
    reason: { type: 'HOLDOUT', ruleId: '', holdoutGroupId },
  };
}

test('fixture: the users are on the expected side of the HASH group', (t) => {
  const [group] = toEvaluatorHoldoutGroups([hashHoldoutGroup()]);

  t.true(isHeldOut(group, createUser(HELD_OUT_USER_ID, {}), []));
  t.false(isHeldOut(group, createUser(NOT_HELD_OUT_USER_ID, {}), []));
});

test('evaluate | holdout HASH: a held-out user gets the holdout variation with reason HOLDOUT and the group ID', async (t) => {
  const { evaluator, holdoutGroupsCache } = t.context;
  await cacheGroups(holdoutGroupsCache, [hashHoldoutGroup()]);

  const evaluation = await evaluator.evaluate(
    { id: HELD_OUT_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );

  t.deepEqual(evaluation, holdoutEvaluation(HELD_OUT_USER_ID, HASH_HOLDOUT_GROUP_ID));
});

test('evaluate | holdout HASH: a user outside the group is evaluated as without a group', async (t) => {
  const { evaluator, holdoutGroupsCache } = t.context;
  const user = { id: NOT_HELD_OUT_USER_ID, data: {} };
  const before = await evaluator.evaluate(user, HOLDOUT_FEATURE_ID);
  await cacheGroups(holdoutGroupsCache, [hashHoldoutGroup()]);

  const evaluation = await evaluator.evaluate(user, HOLDOUT_FEATURE_ID);

  t.deepEqual(evaluation, before);
  t.deepEqual(evaluation, normalEvaluation(NOT_HELD_OUT_USER_ID));
  // The reason of a normal evaluation does not gain a holdoutGroupId key.
  t.false('holdoutGroupId' in (evaluation.reason ?? {}));
});

test('evaluate | holdout HASH: a held-out user is evaluated normally without a cached group', async (t) => {
  const { evaluator } = t.context;

  const evaluation = await evaluator.evaluate(
    { id: HELD_OUT_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );

  t.deepEqual(evaluation, normalEvaluation(HELD_OUT_USER_ID));
});

test('evaluate | holdout HASH: a held-out user is evaluated normally after the group is cleared', async (t) => {
  const { evaluator, holdoutGroupsCache } = t.context;
  const user = { id: HELD_OUT_USER_ID, data: {} };
  await cacheGroups(holdoutGroupsCache, [hashHoldoutGroup()]);
  t.is((await evaluator.evaluate(user, HOLDOUT_FEATURE_ID)).reason?.type, 'HOLDOUT');

  await holdoutGroupsCache.put([]);

  t.deepEqual(
    await evaluator.evaluate(user, HOLDOUT_FEATURE_ID),
    normalEvaluation(HELD_OUT_USER_ID),
  );
});

test('evaluate | holdout HASH: a flag the group does not target is evaluated normally', async (t) => {
  const { evaluator, featuresCache, holdoutGroupsCache } = t.context;
  const otherFeatureId = 'feature-id-not-targeted';
  await featuresCache.put(createFeature(holdoutTargetFeature({ id: otherFeatureId })));
  await cacheGroups(holdoutGroupsCache, [hashHoldoutGroup()]);

  const evaluation = await evaluator.evaluate({ id: HELD_OUT_USER_ID, data: {} }, otherFeatureId);

  t.is(evaluation.variationId, NORMAL_VARIATION_ID);
  t.deepEqual(evaluation.reason, { type: 'DEFAULT', ruleId: '' });
});

test('evaluate | holdout HASH: the holdout is applied before the enabled check', async (t) => {
  const { evaluator, featuresCache, holdoutGroupsCache } = t.context;
  await featuresCache.put(createFeature(holdoutTargetFeature({ enabled: false })));
  await cacheGroups(holdoutGroupsCache, [hashHoldoutGroup()]);

  const heldOut = await evaluator.evaluate({ id: HELD_OUT_USER_ID, data: {} }, HOLDOUT_FEATURE_ID);
  const other = await evaluator.evaluate(
    { id: NOT_HELD_OUT_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );

  t.is(heldOut.variationId, HOLDOUT_VARIATION_ID);
  t.deepEqual(heldOut.reason, {
    type: 'HOLDOUT',
    ruleId: '',
    holdoutGroupId: HASH_HOLDOUT_GROUP_ID,
  });
  t.is(other.variationId, NORMAL_VARIATION_ID);
  t.deepEqual(other.reason, { type: 'OFF_VARIATION', ruleId: '' });
});

test('evaluate | holdout HASH: a downstream flag sees the holdout variation of its prerequisite', async (t) => {
  const { evaluator, featuresCache, holdoutGroupsCache } = t.context;
  const downstreamFeatureId = 'feature-id-downstream';
  const downstream = holdoutTargetFeature({ id: downstreamFeatureId });
  downstream.offVariation = HOLDOUT_VARIATION_ID;
  downstream.prerequisites = [{ featureId: HOLDOUT_FEATURE_ID, variationId: NORMAL_VARIATION_ID }];
  await featuresCache.put(createFeature(downstream));
  await cacheGroups(holdoutGroupsCache, [hashHoldoutGroup()]);

  const heldOut = await evaluator.evaluate({ id: HELD_OUT_USER_ID, data: {} }, downstreamFeatureId);
  const other = await evaluator.evaluate(
    { id: NOT_HELD_OUT_USER_ID, data: {} },
    downstreamFeatureId,
  );

  // The group targets the prerequisite only. Its holdout variation does not
  // satisfy the prerequisite, so the downstream flag serves its off variation.
  t.is(heldOut.variationId, HOLDOUT_VARIATION_ID);
  t.deepEqual(heldOut.reason, { type: 'PREREQUISITE', ruleId: '' });
  t.is(other.variationId, NORMAL_VARIATION_ID);
  t.deepEqual(other.reason, { type: 'DEFAULT', ruleId: '' });
});

test('evaluate | holdout SEGMENT: a member of the cached segment gets the holdout variation', async (t) => {
  const { evaluator, segmentUsersCache, holdoutGroupsCache, warn } = t.context;
  await cacheGroups(holdoutGroupsCache, [segmentHoldoutGroup()]);
  // No flag rule references this segment. Only the group does.
  await cacheHoldoutSegment(segmentUsersCache);

  const member = await evaluator.evaluate(
    { id: SEGMENT_MEMBER_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );
  const other = await evaluator.evaluate(
    { id: SEGMENT_OTHER_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );

  t.deepEqual(member, holdoutEvaluation(SEGMENT_MEMBER_USER_ID, SEGMENT_HOLDOUT_GROUP_ID));
  t.deepEqual(other, normalEvaluation(SEGMENT_OTHER_USER_ID));
  t.true(warn.notCalled);
});

test('evaluate | holdout SEGMENT: without the segment in the cache the user is not held out and nothing throws', async (t) => {
  const { evaluator, holdoutGroupsCache, warn } = t.context;
  await cacheGroups(holdoutGroupsCache, [segmentHoldoutGroup()]);

  const evaluation = await evaluator.evaluate(
    { id: SEGMENT_MEMBER_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );

  t.deepEqual(evaluation, normalEvaluation(SEGMENT_MEMBER_USER_ID));
  t.true(warn.calledOnce);
  t.true(String(warn.firstCall.args[0]).includes(HOLDOUT_SEGMENT_ID));
  t.true(String(warn.firstCall.args[0]).includes(SEGMENT_HOLDOUT_GROUP_ID));
});

test('evaluate | holdout SEGMENT: the missing segment is logged once, and again only after it was cached in between', async (t) => {
  const { evaluator, segmentUsersCache, holdoutGroupsCache, warn } = t.context;
  const user = { id: SEGMENT_MEMBER_USER_ID, data: {} };
  await cacheGroups(holdoutGroupsCache, [segmentHoldoutGroup()]);

  await evaluator.evaluate(user, HOLDOUT_FEATURE_ID);
  await evaluator.evaluate(user, HOLDOUT_FEATURE_ID);
  await evaluator.evaluate({ id: SEGMENT_OTHER_USER_ID, data: {} }, HOLDOUT_FEATURE_ID);
  t.is(warn.callCount, 1);

  // The segment users poll catches up: the member is held out from now on.
  await cacheHoldoutSegment(segmentUsersCache);
  const heldOut = await evaluator.evaluate(user, HOLDOUT_FEATURE_ID);
  t.deepEqual(heldOut, holdoutEvaluation(SEGMENT_MEMBER_USER_ID, SEGMENT_HOLDOUT_GROUP_ID));
  t.is(warn.callCount, 1);

  await segmentUsersCache.delete(HOLDOUT_SEGMENT_ID);
  const notHeldOut = await evaluator.evaluate(user, HOLDOUT_FEATURE_ID);
  t.deepEqual(notHeldOut, normalEvaluation(SEGMENT_MEMBER_USER_ID));
  t.is(warn.callCount, 2);
});

test('evaluate | holdout SEGMENT: a segment that a flag rule also references is read once', async (t) => {
  const { sandbox, evaluator, featuresCache, segmentUsersCache, holdoutGroupsCache } = t.context;
  const feature = holdoutTargetFeature();
  feature.rules = [
    {
      id: 'rule-id-segment',
      strategy: { type: 'FIXED', fixedStrategy: { variation: NORMAL_VARIATION_ID } },
      clauses: [
        {
          id: 'clause-id-segment',
          attribute: '',
          operator: 'SEGMENT',
          values: [HOLDOUT_SEGMENT_ID],
        },
      ],
    },
  ];
  await featuresCache.put(createFeature(feature));
  await cacheGroups(holdoutGroupsCache, [segmentHoldoutGroup()]);
  await cacheHoldoutSegment(segmentUsersCache);
  const getSegmentUsers = sandbox.spy(segmentUsersCache, 'get');

  const evaluation = await evaluator.evaluate(
    { id: SEGMENT_MEMBER_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );

  // The holdout is evaluated before the flag rules.
  t.deepEqual(evaluation, holdoutEvaluation(SEGMENT_MEMBER_USER_ID, SEGMENT_HOLDOUT_GROUP_ID));
  t.is(getSegmentUsers.callCount, 1);
});

test('evaluate | holdout: without a logger a missing segment still does not throw', async (t) => {
  const { featuresCache, segmentUsersCache, holdoutGroupsCache } = t.context;
  const evaluator = new LocalEvaluator({
    tag: 'server',
    featuresCache,
    segementUsersCache: segmentUsersCache,
    holdoutGroupsCache,
  });
  await cacheGroups(holdoutGroupsCache, [segmentHoldoutGroup()]);

  const evaluation = await evaluator.evaluate(
    { id: SEGMENT_MEMBER_USER_ID, data: {} },
    HOLDOUT_FEATURE_ID,
  );

  t.deepEqual(evaluation, normalEvaluation(SEGMENT_MEMBER_USER_ID));
});

test('evaluate | holdout | err: failed to get the holdout groups from the cache', async (t) => {
  const { sandbox, evaluator, holdoutGroupsCache } = t.context;
  sandbox.stub(holdoutGroupsCache, 'get').rejects(new Error('internal error'));

  const error = await t.throwsAsync(
    evaluator.evaluate({ id: HELD_OUT_USER_ID, data: {} }, HOLDOUT_FEATURE_ID),
  );

  t.deepEqual(error, new IllegalStateError('Failed to get holdout groups: internal error'));
});

test('evaluate | holdout SEGMENT | err: failed to read the segment from the cache', async (t) => {
  const { sandbox, evaluator, segmentUsersCache, holdoutGroupsCache } = t.context;
  await cacheGroups(holdoutGroupsCache, [segmentHoldoutGroup()]);
  // A read failure is not a cache miss: it is reported like any other
  // segment read failure instead of being treated as "not cached yet".
  sandbox.stub(segmentUsersCache, 'get').rejects(new Error('internal error'));

  const error = await t.throwsAsync(
    evaluator.evaluate({ id: SEGMENT_MEMBER_USER_ID, data: {} }, HOLDOUT_FEATURE_ID),
  );

  t.deepEqual(error, new IllegalStateError('Failed to get segment users: internal error'));
});
