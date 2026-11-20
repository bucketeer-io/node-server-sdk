import test from 'ava';
import {
  HoldoutAssignment,
  SegmentUser,
  holdoutSegmentIds,
  isHeldOut,
} from '@bucketeer/evaluation';
import { toEvaluatorHoldoutGroups } from '../../../cache/processor/converter';
import { HoldoutGroup } from '../../../objects/holdout';
import {
  HASH_HOLDOUT_GROUP_ID,
  HELD_OUT_USER_ID,
  HOLDOUT_ENVIRONMENT_ID,
  HOLDOUT_FEATURE_ID,
  HOLDOUT_SEGMENT_ID,
  HOLDOUT_VARIATION_ID,
  NOT_HELD_OUT_USER_ID,
  SEGMENT_HOLDOUT_GROUP_ID,
  hashHoldoutGroup,
  segmentHoldoutGroup,
} from '../../utils/holdout';
import { createSegmentUser, createUser } from '../../utils/feature';

test('toEvaluatorHoldoutGroups: converts a HASH group from the response JSON', (t) => {
  const groups = toEvaluatorHoldoutGroups([hashHoldoutGroup()]);

  t.is(groups.length, 1);
  const group = groups[0];
  t.is(group.getId(), HASH_HOLDOUT_GROUP_ID);
  t.is(group.getEnvironmentId(), HOLDOUT_ENVIRONMENT_ID);
  t.is(group.getAssignmentType(), HoldoutAssignment.HASH);
  t.is(group.getSamplingSeed(), 'sampling-seed-1');
  t.is(group.getBucketStart(), 97);
  t.is(group.getPercentage(), 5);
  t.is(group.getSegmentId(), '');
  // int64 arrives as a string and the evaluator reads a number.
  t.is(group.getUpdatedAt(), 1763539200);

  t.is(group.getFeaturesList().length, 1);
  const target = group.getFeaturesList()[0];
  t.is(target.getId(), 'holdout-feature-id-1');
  t.is(target.getFeatureId(), HOLDOUT_FEATURE_ID);
  t.is(target.getHoldoutVariationId(), HOLDOUT_VARIATION_ID);
  t.is(target.getAddedAt(), 1763539100);
  t.is(target.getRemovedAt(), 0);
});

test('toEvaluatorHoldoutGroups: the converted HASH group gives the membership of the evaluation package', (t) => {
  const [group] = toEvaluatorHoldoutGroups([hashHoldoutGroup()]);

  t.true(isHeldOut(group, createUser(HELD_OUT_USER_ID, {}), []));
  t.false(isHeldOut(group, createUser(NOT_HELD_OUT_USER_ID, {}), []));
  t.deepEqual(holdoutSegmentIds([group]), []);
});

test('toEvaluatorHoldoutGroups: converts a SEGMENT group from the response JSON', (t) => {
  const [group] = toEvaluatorHoldoutGroups([segmentHoldoutGroup()]);

  t.is(group.getId(), SEGMENT_HOLDOUT_GROUP_ID);
  t.is(group.getAssignmentType(), HoldoutAssignment.SEGMENT);
  t.is(group.getSegmentId(), HOLDOUT_SEGMENT_ID);
  t.is(group.getUpdatedAt(), 1763539300);
  t.deepEqual(holdoutSegmentIds([group]), [HOLDOUT_SEGMENT_ID]);

  const member = createSegmentUser(
    'user-id-member',
    HOLDOUT_SEGMENT_ID,
    SegmentUser.State.INCLUDED,
  );
  t.true(isHeldOut(group, createUser('user-id-member', {}), [member]));
  t.false(isHeldOut(group, createUser('user-id-other', {}), [member]));
});

test('toEvaluatorHoldoutGroups: keeps the order and every group of the list', (t) => {
  const groups = toEvaluatorHoldoutGroups([segmentHoldoutGroup(), hashHoldoutGroup()]);

  t.deepEqual(
    groups.map((group) => group.getId()),
    [SEGMENT_HOLDOUT_GROUP_ID, HASH_HOLDOUT_GROUP_ID],
  );
});

test('toEvaluatorHoldoutGroups: returns an empty list when the field is absent or empty', (t) => {
  t.deepEqual(toEvaluatorHoldoutGroups(undefined), []);
  t.deepEqual(toEvaluatorHoldoutGroups([]), []);
});

test('toEvaluatorHoldoutGroups: the assignment name is case insensitive', (t) => {
  const group: HoldoutGroup = { ...segmentHoldoutGroup(), assignmentType: 'segment' };

  const [converted] = toEvaluatorHoldoutGroups([group]);

  t.is(converted.getAssignmentType(), HoldoutAssignment.SEGMENT);
});

test('toEvaluatorHoldoutGroups: an omitted assignment type is HASH, the proto default', (t) => {
  // protojson without unpopulated fields omits a field that holds its default.
  const group: Partial<HoldoutGroup> = hashHoldoutGroup();
  delete group.assignmentType;

  const [converted] = toEvaluatorHoldoutGroups([group as HoldoutGroup]);

  t.is(converted.getAssignmentType(), HoldoutAssignment.HASH);
  t.true(isHeldOut(converted, createUser(HELD_OUT_USER_ID, {}), []));
});

test('toEvaluatorHoldoutGroups: an unknown assignment type holds nobody out', (t) => {
  const group: HoldoutGroup = {
    ...hashHoldoutGroup(),
    assignmentType: 'FUTURE_ASSIGNMENT',
    segmentId: HOLDOUT_SEGMENT_ID,
  };

  const [converted] = toEvaluatorHoldoutGroups([group]);

  t.not(converted.getAssignmentType(), HoldoutAssignment.HASH);
  t.not(converted.getAssignmentType(), HoldoutAssignment.SEGMENT);
  t.false(isHeldOut(converted, createUser(HELD_OUT_USER_ID, {}), []));
  t.deepEqual(holdoutSegmentIds([converted]), []);
});

test('toEvaluatorHoldoutGroups: keeps removedAt so the evaluator skips a removed target', (t) => {
  const group = hashHoldoutGroup();
  group.features[0].removedAt = '1763539500';

  const [converted] = toEvaluatorHoldoutGroups([group]);

  t.is(converted.getFeaturesList()[0].getRemovedAt(), 1763539500);
});

test('toEvaluatorHoldoutGroups: fields the response leaves out fall back to their zero value', (t) => {
  const group = { id: 'holdout-group-id-sparse' } as HoldoutGroup;

  const [converted] = toEvaluatorHoldoutGroups([group]);

  t.is(converted.getId(), 'holdout-group-id-sparse');
  t.is(converted.getEnvironmentId(), '');
  t.is(converted.getAssignmentType(), HoldoutAssignment.HASH);
  t.is(converted.getSamplingSeed(), '');
  t.is(converted.getBucketStart(), 0);
  t.is(converted.getPercentage(), 0);
  t.is(converted.getSegmentId(), '');
  t.is(converted.getUpdatedAt(), 0);
  t.deepEqual(converted.getFeaturesList(), []);
  // Without a seed and a percentage the evaluator holds nobody out.
  t.false(isHeldOut(converted, createUser(HELD_OUT_USER_ID, {}), []));
});
