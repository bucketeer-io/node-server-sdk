import test from 'ava';
import { Feature } from '../../objects/feature';
import { SegmentUsers } from '../../objects/segment';
import {
  toProtoFeature,
  toProtoSegmentUsers,
  toProtoTarget,
  toProtoVariation,
  toProtoClause,
  toProtoFixedStrategy,
  toProtoRolloutStrategyVariation,
  toProtoRolloutStrategy,
  toProtoStrategy,
  toProtoRule,
  toProtoFeatureLastUsedInfo,
  toProtoPrerequisite,
} from '../../evaluator/converter';
import { Feature as ProtoFeature } from '@bucketeer/evaluation';

test('toProtoFeature: Full Feature Object Conversion', (t) => {
  const mockFeature: Feature = {
    id: 'feature_1',
    name: 'Feature 1',
    description: 'A test feature',
    enabled: true,
    deleted: false,
    ttl: 3600,
    version: 2,
    createdAt: '1690000000',
    updatedAt: '1690000000',
    variationType: 'STRING',
    variations: [{ id: 'var_1', value: 'value_1', name: 'Variation 1', description: 'desc 1' }],
    targets: [{ variation: 'var_1', users: ['user_1'] }],
    rules: [
      {
        id: 'rule_1',
        strategy: {
          type: 'ROLLOUT',
          rolloutStrategy: {
            variations: [{ variation: 'var_1', weight: 100000 }],
          },
        },
        clauses: [{ id: 'clause_1', attribute: 'attr_1', operator: 'EQUALS', values: ['val_1'] }],
      },
    ],
    defaultStrategy: {
      type: 'FIXED',
      fixedStrategy: { variation: 'var_1' },
    },
    offVariation: 'var_1',
    tags: ['tag_1'],
    lastUsedInfo: {
      featureId: 'feature_1',
      version: 2,
      lastUsedAt: '1690001000',
      createdAt: '1690000000',
      clientOldestVersion: '1.0.0',
      clientLatestVersion: '2.0.0',
    },
    maintainer: 'm1',
    archived: false,
    prerequisites: [{ featureId: 'pre_1', variationId: 'pre_var_1' }],
    samplingSeed: 'seed_1',
  };

  const proto = toProtoFeature(mockFeature);
  const obj = proto.toObject();

  t.is(obj.id, 'feature_1');
  t.is(obj.name, 'Feature 1');
  t.is(obj.description, 'A test feature');
  t.is(obj.enabled, true);
  t.is(obj.deleted, false);
  t.is(obj.ttl, 3600);
  t.is(obj.version, 2);
  t.is(obj.createdAt, 1690000000); // Parsed string to number
  t.is(obj.updatedAt, 1690000000); // Parsed string to number
  t.is(obj.variationType, ProtoFeature.VariationType.STRING);
  t.is(obj.offVariation, 'var_1');
  t.deepEqual(obj.tagsList, ['tag_1']);
  t.is(obj.maintainer, 'm1');
  t.is(obj.archived, false);
  t.is(obj.samplingSeed, 'seed_1');

  t.is(obj.variationsList.length, 1);
  t.is(obj.variationsList[0].id, 'var_1');
  t.is(obj.variationsList[0].value, 'value_1');
  t.is(obj.variationsList[0].name, 'Variation 1');
  t.is(obj.variationsList[0].description, 'desc 1');

  t.is(obj.targetsList.length, 1);
  t.is(obj.targetsList[0].variation, 'var_1');
  t.deepEqual(obj.targetsList[0].usersList, ['user_1']);

  t.is(obj.rulesList.length, 1);
  t.is(obj.rulesList[0].id, 'rule_1');
  t.is(obj.rulesList[0].clausesList.length, 1);
  t.is(obj.rulesList[0].clausesList[0].id, 'clause_1');
  t.is(obj.rulesList[0].clausesList[0].attribute, 'attr_1');
  // Clause.Operator enum values are defined in @bucketeer/evaluation/lib/proto/feature/clause_pb.d.ts
  // EQUALS = 0, IN = 1, STARTS_WITH = 2, ENDS_WITH = 3, SEGMENT = 4, ...
  t.is(obj.rulesList[0].clausesList[0].operator, 0); // Clause.Operator.EQUALS = 0
  t.deepEqual(obj.rulesList[0].clausesList[0].valuesList, ['val_1']);

  t.truthy(obj.rulesList[0].strategy);
  // Strategy.Type enum values are defined in @bucketeer/evaluation/lib/proto/feature/strategy_pb.d.ts
  // FIXED = 0, ROLLOUT = 1
  t.is(obj.rulesList[0].strategy?.type, 1); // Strategy.Type.ROLLOUT = 1
  t.truthy(obj.rulesList[0].strategy?.rolloutStrategy);
  t.is(obj.rulesList[0].strategy?.rolloutStrategy?.variationsList.length, 1);
  t.is(obj.rulesList[0].strategy?.rolloutStrategy?.variationsList[0].variation, 'var_1');
  t.is(obj.rulesList[0].strategy?.rolloutStrategy?.variationsList[0].weight, 100000);

  t.truthy(obj.defaultStrategy);
  t.is(obj.defaultStrategy?.type, 0); // Strategy.Type.FIXED = 0
  t.truthy(obj.defaultStrategy?.fixedStrategy);
  t.is(obj.defaultStrategy?.fixedStrategy?.variation, 'var_1');

  t.is(obj.lastUsedInfo?.featureId, 'feature_1');
  t.is(obj.lastUsedInfo?.version, 2);
  t.is(obj.lastUsedInfo?.lastUsedAt, 1690001000); // Parsed text timestamp to number
  t.is(obj.lastUsedInfo?.createdAt, 1690000000); // Parsed text timestamp to number
  t.is(obj.lastUsedInfo?.clientOldestVersion, '1.0.0');
  t.is(obj.lastUsedInfo?.clientLatestVersion, '2.0.0');

  t.is(obj.prerequisitesList.length, 1);
  t.is(obj.prerequisitesList[0].featureId, 'pre_1');
  t.is(obj.prerequisitesList[0].variationId, 'pre_var_1');
});

test('toProtoFeature: Missing Optional Dependencies', (t) => {
  const mockFeature: Feature = {
    id: 'feature_min',
    name: 'Feature Min',
    description: '',
    enabled: true,
    deleted: false,
    ttl: 3600,
    version: 1,
    createdAt: '1690000000',
    updatedAt: '1690000000',
    variationType: 'BOOLEAN',
    variations: [],
    targets: [],
    rules: [],
    offVariation: '',
    tags: [],
    maintainer: '',
    archived: false,
    samplingSeed: '',
  };

  const proto = toProtoFeature(mockFeature);
  const obj = proto.toObject();

  t.is(obj.id, 'feature_min');
  t.is(obj.variationType, ProtoFeature.VariationType.BOOLEAN);
  t.is(obj.variationsList.length, 0);
  t.is(obj.targetsList.length, 0);
  t.deepEqual(obj.tagsList, []);
  t.is(obj.rulesList.length, 0);
  t.is(obj.prerequisitesList.length, 0);
  t.falsy(obj.lastUsedInfo);
  t.falsy(obj.defaultStrategy);
});

test('toProtoSegmentUsers: Full SegmentUsers Mapping', (t) => {
  const mockSegmentUsers: SegmentUsers = {
    segmentId: 'seg_1',
    updatedAt: '1690000000',
    users: [
      { id: 'su_1', segmentId: 'seg_1', userId: 'user_1', state: 'INCLUDED', deleted: false },
      { id: 'su_2', segmentId: 'seg_1', userId: 'user_2', state: 'EXCLUDED', deleted: false },
    ],
  };

  const proto = toProtoSegmentUsers(mockSegmentUsers);
  const obj = proto.toObject();

  t.is(obj.segmentId, 'seg_1');
  t.is(obj.updatedAt, 1690000000); // parsed to number
  t.is(obj.usersList.length, 2);

  t.is(obj.usersList[0].id, 'su_1');
  t.is(obj.usersList[0].segmentId, 'seg_1');
  t.is(obj.usersList[0].userId, 'user_1');
  // SegmentUser.State enum values are defined in @bucketeer/evaluation/lib/proto/feature/segment_pb.d.ts
  // INCLUDED = 0, EXCLUDED = 1
  t.is(obj.usersList[0].state, 0); // SegmentUser.State.INCLUDED = 0
  t.is(obj.usersList[0].deleted, false);

  t.is(obj.usersList[1].id, 'su_2');
  t.is(obj.usersList[1].segmentId, 'seg_1');
  t.is(obj.usersList[1].userId, 'user_2');
  t.is(obj.usersList[1].state, 1); // SegmentUser.State.EXCLUDED = 1
  t.is(obj.usersList[1].deleted, false);
});

test('toProtoSegmentUsers: Empty Users List', (t) => {
  const mockSegmentUsers: SegmentUsers = {
    segmentId: 'seg_empty',
    updatedAt: '1690000000',
    users: [],
  };

  const proto = toProtoSegmentUsers(mockSegmentUsers);
  const obj = proto.toObject();

  t.is(obj.segmentId, 'seg_empty');
  t.is(obj.usersList.length, 0);
});

test('toProtoVariation: minimal', (t) => {
  const result = toProtoVariation({ id: 'v1' });
  t.is(result.toObject().id, 'v1');
});

test('toProtoTarget: basic', (t) => {
  const result = toProtoTarget({ variation: 'v1', users: ['u1', 'u2'] });
  const obj = result.toObject();
  t.is(obj.variation, 'v1');
  t.deepEqual(obj.usersList, ['u1', 'u2']);
});

test('toProtoClause: IN operator', (t) => {
  const result = toProtoClause({ id: 'c1', attribute: 'a1', operator: 'IN', values: ['v1'] });
  const obj = result.toObject();
  t.is(obj.id, 'c1');
  t.is(obj.attribute, 'a1');
  t.is(obj.operator, 1); // Clause.Operator.IN
  t.deepEqual(obj.valuesList, ['v1']);
});

test('toProtoFixedStrategy: basic', (t) => {
  const result = toProtoFixedStrategy({ variation: 'v1' });
  t.is(result.toObject().variation, 'v1');
});

test('toProtoRolloutStrategyVariation: basic', (t) => {
  const result = toProtoRolloutStrategyVariation({ variation: 'v1', weight: 50 });
  const obj = result.toObject();
  t.is(obj.variation, 'v1');
  t.is(obj.weight, 50);
});

test('toProtoRolloutStrategy: basic', (t) => {
  const result = toProtoRolloutStrategy({
    variations: [
      { variation: 'v1', weight: 50 },
      { variation: 'v2', weight: 50 },
    ],
  });
  const obj = result.toObject();
  t.is(obj.variationsList.length, 2);
  t.is(obj.variationsList[0].variation, 'v1');
});

test('toProtoStrategy: FIXED', (t) => {
  const result = toProtoStrategy({ type: 'FIXED', fixedStrategy: { variation: 'v1' } });
  const obj = result.toObject();
  t.is(obj.type, 0); // Type.FIXED = 0
  t.is(obj.fixedStrategy?.variation, 'v1');
});

test('toProtoRule: minimal', (t) => {
  const result = toProtoRule({ id: 'r1', clauses: [] });
  t.is(result.toObject().id, 'r1');
});

test('toProtoFeatureLastUsedInfo: minimal text numbers', (t) => {
  const result = toProtoFeatureLastUsedInfo({
    featureId: 'f1',
    version: 1,
    lastUsedAt: '123',
    createdAt: '456',
    clientOldestVersion: '1.0.0',
    clientLatestVersion: '2.0.0',
  });
  const obj = result.toObject();
  t.is(obj.lastUsedAt, 123);
  t.is(obj.createdAt, 456);
});

test('toProtoPrerequisite: basic', (t) => {
  const result = toProtoPrerequisite({ featureId: 'f1', variationId: 'v1' });
  const obj = result.toObject();
  t.is(obj.featureId, 'f1');
  t.is(obj.variationId, 'v1');
});
