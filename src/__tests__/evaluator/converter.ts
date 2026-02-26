import test from 'ava';
import { Feature } from '../../objects/feature';
import { SegmentUsers } from '../../objects/segment';
import { createFeatureWithOptions, createSegmentUsers } from '../../evaluator/converter';
import { Feature as ProtoFeature } from '@bucketeer/evaluation';

test('createFeatureWithOptions: Full Feature Object Conversion', (t) => {
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
    variations: [
      { id: 'var_1', value: 'value_1', name: 'Variation 1', description: 'desc 1' },
    ],
    targets: [
      { variation: 'var_1', users: ['user_1'] },
    ],
    rules: [
      {
        id: 'rule_1',
        strategy: {
          type: 'ROLLOUT',
          rolloutStrategy: {
            variations: [{ variation: 'var_1', weight: 100000 }],
          },
        },
        clauses: [
          { id: 'clause_1', attribute: 'attr_1', operator: 'EQUALS', values: ['val_1'] },
        ],
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
    prerequisites: [
      { featureId: 'pre_1', variationId: 'pre_var_1' },
    ],
    samplingSeed: 'seed_1',
  };

  const proto = createFeatureWithOptions(mockFeature);
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

test('createFeatureWithOptions: Missing Optional Dependencies', (t) => {
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

  const proto = createFeatureWithOptions(mockFeature);
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

test('createSegmentUsers: Full SegmentUsers Mapping', (t) => {
  const mockSegmentUsers: SegmentUsers = {
    segmentId: 'seg_1',
    updatedAt: '1690000000',
    users: [
      { id: 'su_1', segmentId: 'seg_1', userId: 'user_1', state: 'INCLUDED', deleted: false },
      { id: 'su_2', segmentId: 'seg_1', userId: 'user_2', state: 'EXCLUDED', deleted: false },
    ],
  };

  const proto = createSegmentUsers(mockSegmentUsers);
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

test('createSegmentUsers: Empty Users List', (t) => {
  const mockSegmentUsers: SegmentUsers = {
    segmentId: 'seg_empty',
    updatedAt: '1690000000',
    users: [],
  };

  const proto = createSegmentUsers(mockSegmentUsers);
  const obj = proto.toObject();

  t.is(obj.segmentId, 'seg_empty');
  t.is(obj.usersList.length, 0);
});
