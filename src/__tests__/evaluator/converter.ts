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

test('toProtoFeature: parameterized cases', (t) => {
  const testCases = [
    {
      name: 'Full Feature Object Conversion',
      input: {
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
      } as Feature,
      expected: {
        id: 'feature_1',
        name: 'Feature 1',
        description: 'A test feature',
        enabled: true,
        deleted: false,
        ttl: 3600,
        version: 2,
        createdAt: 1690000000,
        updatedAt: 1690000000,
        variationType: ProtoFeature.VariationType.STRING,
        offVariation: 'var_1',
        tagsList: ['tag_1'],
        maintainer: 'm1',
        archived: false,
        samplingSeed: 'seed_1',
        variationsLength: 1,
        targetsLength: 1,
        rulesLength: 1,
        defaultStrategyType: 0, // FIXED = 0
        hasLastUsedInfo: true,
        prerequisitesLength: 1,
      },
    },
    {
      name: 'Missing Optional Dependencies',
      input: {
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
      } as Feature,
      expected: {
        id: 'feature_min',
        name: 'Feature Min',
        description: '',
        enabled: true,
        deleted: false,
        ttl: 3600,
        version: 1,
        createdAt: 1690000000,
        updatedAt: 1690000000,
        variationType: ProtoFeature.VariationType.BOOLEAN,
        offVariation: '',
        tagsList: [],
        maintainer: '',
        archived: false,
        samplingSeed: '',
        variationsLength: 0,
        targetsLength: 0,
        rulesLength: 0,
        defaultStrategyType: undefined,
        hasLastUsedInfo: false,
        prerequisitesLength: 0,
      },
    },
    {
      name: 'Unknown Variation Type defaults to STRING',
      input: {
        id: 'feature_unknown_type',
        name: 'Feature Unknown',
        description: '',
        enabled: true,
        deleted: false,
        ttl: 3600,
        version: 1,
        createdAt: '1690000000',
        updatedAt: '1690000000',
        variationType: 'UNKNOWN_NEW_TYPE',
        variations: [],
        targets: [],
        rules: [],
        offVariation: '',
        tags: [],
        maintainer: '',
        archived: false,
        samplingSeed: '',
      } as Feature,
      expected: {
        id: 'feature_unknown_type',
        name: 'Feature Unknown',
        description: '',
        enabled: true,
        deleted: false,
        ttl: 3600,
        version: 1,
        createdAt: 1690000000,
        updatedAt: 1690000000,
        variationType: ProtoFeature.VariationType.STRING, // Default
        offVariation: '',
        tagsList: [],
        maintainer: '',
        archived: false,
        samplingSeed: '',
        variationsLength: 0,
        targetsLength: 0,
        rulesLength: 0,
        defaultStrategyType: undefined,
        hasLastUsedInfo: false,
        prerequisitesLength: 0,
      },
    },
    {
      name: 'Undefined timestamps defaults to 0',
      input: {
        id: 'feature_empty_times',
        name: 'Feature Empty Times',
        description: '',
        enabled: true,
        deleted: false,
        ttl: 3600,
        version: 1,
        createdAt: '',
        updatedAt: undefined as any,
        variationType: 'JSON',
        variations: [],
        targets: [],
        rules: [],
        offVariation: '',
        tags: [],
        maintainer: '',
        archived: false,
        samplingSeed: '',
      } as Feature,
      expected: {
        id: 'feature_empty_times',
        name: 'Feature Empty Times',
        description: '',
        enabled: true,
        deleted: false,
        ttl: 3600,
        version: 1,
        createdAt: 0, // Fallback to 0
        updatedAt: 0, // Fallback to 0
        variationType: ProtoFeature.VariationType.JSON,
        offVariation: '',
        tagsList: [],
        maintainer: '',
        archived: false,
        samplingSeed: '',
        variationsLength: 0,
        targetsLength: 0,
        rulesLength: 0,
        defaultStrategyType: undefined,
        hasLastUsedInfo: false,
        prerequisitesLength: 0,
      },
    }
  ];

  for (const tc of testCases) {
    const proto = toProtoFeature(tc.input);
    const obj = proto.toObject();

    t.is(obj.id, tc.expected.id, tc.name);
    t.is(obj.name, tc.expected.name, tc.name);
    t.is(obj.description, tc.expected.description, tc.name);
    t.is(obj.enabled, tc.expected.enabled, tc.name);
    t.is(obj.deleted, tc.expected.deleted, tc.name);
    t.is(obj.ttl, tc.expected.ttl, tc.name);
    t.is(obj.version, tc.expected.version, tc.name);
    t.is(obj.createdAt, tc.expected.createdAt, tc.name);
    t.is(obj.updatedAt, tc.expected.updatedAt, tc.name);
    t.is(obj.variationType as number, tc.expected.variationType, tc.name);
    t.is(obj.offVariation, tc.expected.offVariation, tc.name);
    t.deepEqual(obj.tagsList, tc.expected.tagsList, tc.name);
    t.is(obj.maintainer, tc.expected.maintainer, tc.name);
    t.is(obj.archived, tc.expected.archived, tc.name);
    t.is(obj.samplingSeed, tc.expected.samplingSeed, tc.name);

    t.is(obj.variationsList.length, tc.expected.variationsLength, tc.name);
    t.is(obj.targetsList.length, tc.expected.targetsLength, tc.name);
    t.is(obj.rulesList.length, tc.expected.rulesLength, tc.name);
    
    if (tc.expected.defaultStrategyType !== undefined) {
      t.truthy(obj.defaultStrategy, tc.name);
      t.is(obj.defaultStrategy?.type as number, tc.expected.defaultStrategyType, tc.name);
    } else {
      t.falsy(obj.defaultStrategy, tc.name);
    }

    t.is(!!obj.lastUsedInfo, tc.expected.hasLastUsedInfo, tc.name);
    
    t.is(obj.prerequisitesList.length, tc.expected.prerequisitesLength, tc.name);
  }
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

test('toProtoVariation: parameterized cases', (t) => {
  const testCases = [
    { name: 'empty', input: {}, expected: { id: '', value: '', name: '', description: '' } },
    { name: 'full', input: { id: 'v1', value: 'val1', name: 'name1', description: 'desc1' }, expected: { id: 'v1', value: 'val1', name: 'name1', description: 'desc1' } },
    { name: 'partial id only', input: { id: 'v2' }, expected: { id: 'v2', value: '', name: '', description: '' } },
    { name: 'partial value only', input: { value: 'val2' }, expected: { id: '', value: 'val2', name: '', description: '' } },
  ];

  for (const tc of testCases) {
    const obj = toProtoVariation(tc.input).toObject();
    t.is(obj.id, tc.expected.id, tc.name);
    t.is(obj.value, tc.expected.value, tc.name);
    t.is(obj.name, tc.expected.name, tc.name);
    t.is(obj.description, tc.expected.description, tc.name);
  }
});

test('toProtoTarget: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { variation: 'v1', users: ['u1', 'u2'] }, expected: { variation: 'v1', users: ['u1', 'u2'] } },
    { name: 'empty', input: { variation: '', users: [] }, expected: { variation: '', users: [] } },
    { name: 'no users', input: { variation: 'v2', users: [] }, expected: { variation: 'v2', users: [] } },
  ];

  for (const tc of testCases) {
    const obj = toProtoTarget(tc.input).toObject();
    t.is(obj.variation, tc.expected.variation, tc.name);
    t.deepEqual(obj.usersList, tc.expected.users, tc.name);
  }
});

test('toProtoClause: parameterized cases', (t) => {
  const testCases = [
    { name: 'IN operator', input: { id: 'c1', attribute: 'a1', operator: 'IN', values: ['v1'] }, expected: { id: 'c1', attribute: 'a1', operator: 1, values: ['v1'] } }, // Operator.IN = 1
    { name: 'EQUALS operator', input: { id: 'c2', attribute: 'a2', operator: 'EQUALS', values: ['v2', 'v3'] }, expected: { id: 'c2', attribute: 'a2', operator: 0, values: ['v2', 'v3'] } }, // Operator.EQUALS = 0
    { name: 'UNKNOWN operator defaults to EQUALS', input: { id: 'c3', attribute: 'a3', operator: 'FOO_BAR', values: [] }, expected: { id: 'c3', attribute: 'a3', operator: 0, values: [] } },
    { name: 'empty', input: { id: '', attribute: '', operator: '', values: [] }, expected: { id: '', attribute: '', operator: 0, values: [] } },
  ];

  for (const tc of testCases) {
    const obj = toProtoClause(tc.input as any).toObject();
    t.is(obj.id, tc.expected.id, tc.name);
    t.is(obj.attribute, tc.expected.attribute, tc.name);
    t.is(obj.operator as number, tc.expected.operator, tc.name);
    t.deepEqual(obj.valuesList, tc.expected.values, tc.name);
  }
});

test('toProtoFixedStrategy: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { variation: 'v1' }, expected: { variation: 'v1' } },
    { name: 'empty', input: { variation: '' }, expected: { variation: '' } },
  ];

  for (const tc of testCases) {
    const obj = toProtoFixedStrategy(tc.input).toObject();
    t.is(obj.variation, tc.expected.variation, tc.name);
  }
});

test('toProtoRolloutStrategyVariation: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { variation: 'v1', weight: 50 }, expected: { variation: 'v1', weight: 50 } },
    { name: 'zero weight', input: { variation: 'v2', weight: 0 }, expected: { variation: 'v2', weight: 0 } },
    { name: 'empty variation', input: { variation: '', weight: 100 }, expected: { variation: '', weight: 100 } },
  ];

  for (const tc of testCases) {
    const obj = toProtoRolloutStrategyVariation(tc.input).toObject();
    t.is(obj.variation, tc.expected.variation, tc.name);
    t.is(obj.weight, tc.expected.weight, tc.name);
  }
});

test('toProtoRolloutStrategy: parameterized cases', (t) => {
  const testCases = [
    { name: 'multiple variations', input: { variations: [{ variation: 'v1', weight: 50 }, { variation: 'v2', weight: 50 }] }, expectedLength: 2, firstVar: 'v1' },
    { name: 'single variation', input: { variations: [{ variation: 'v1', weight: 100 }] }, expectedLength: 1, firstVar: 'v1' },
    { name: 'empty variations', input: { variations: [] }, expectedLength: 0, firstVar: undefined },
  ];

  for (const tc of testCases) {
    const obj = toProtoRolloutStrategy(tc.input).toObject();
    t.is(obj.variationsList.length, tc.expectedLength, tc.name);
    if (tc.expectedLength > 0) {
      t.is(obj.variationsList[0].variation, tc.firstVar as string, tc.name);
    }
  }
});

test('toProtoStrategy: parameterized cases', (t) => {
  const testCases = [
    { name: 'FIXED', input: { type: 'FIXED', fixedStrategy: { variation: 'v1' } }, expectedType: 0, hasFixed: true, hasRollout: false }, // Type.FIXED = 0
    { name: 'ROLLOUT', input: { type: 'ROLLOUT', rolloutStrategy: { variations: [{ variation: 'v1', weight: 100 }] } }, expectedType: 1, hasFixed: false, hasRollout: true }, // Type.ROLLOUT = 1
    { name: 'ROLLOUT empty', input: { type: 'ROLLOUT', rolloutStrategy: { variations: [] } }, expectedType: 1, hasFixed: false, hasRollout: true },
    { name: 'UNKNOWN defaults to FIXED', input: { type: 'UNKNOWN' }, expectedType: 0, hasFixed: false, hasRollout: false },
    { name: 'empty type', input: { type: '' }, expectedType: 0, hasFixed: false, hasRollout: false },
  ];

  for (const tc of testCases) {
    const obj = toProtoStrategy(tc.input as any).toObject();
    t.is(obj.type as number, tc.expectedType, tc.name);
    t.is(!!obj.fixedStrategy, tc.hasFixed, tc.name);
    t.is(!!obj.rolloutStrategy, tc.hasRollout, tc.name);
  }
});

test('toProtoRule: parameterized cases', (t) => {
  const testCases = [
    { name: 'minimal', input: { id: 'r1', clauses: [] }, expectedId: 'r1', hasStrategy: false, clausesLength: 0 },
    { name: 'full', input: { id: 'r2', strategy: { type: 'FIXED', fixedStrategy: { variation: 'v1' } }, clauses: [{ id: 'c1', attribute: 'a1', operator: 'EQUALS', values: ['v1'] }] }, expectedId: 'r2', hasStrategy: true, clausesLength: 1 },
    { name: 'empty id and strategy', input: { id: '', clauses: [] }, expectedId: '', hasStrategy: false, clausesLength: 0 },
  ];

  for (const tc of testCases) {
    const obj = toProtoRule(tc.input).toObject();
    t.is(obj.id, tc.expectedId, tc.name);
    t.is(!!obj.strategy, tc.hasStrategy, tc.name);
    t.is(obj.clausesList.length, tc.clausesLength, tc.name);
  }
});

test('toProtoFeatureLastUsedInfo: parameterized cases', (t) => {
  const testCases = [
    {
      name: 'valid numbers',
      input: { featureId: 'f1', version: 1, lastUsedAt: '123', createdAt: '456', clientOldestVersion: '1.0.0', clientLatestVersion: '2.0.0' },
      expected: { featureId: 'f1', version: 1, lastUsedAt: 123, createdAt: 456, clientOldestVersion: '1.0.0', clientLatestVersion: '2.0.0' }
    },
    {
      name: 'empty timestamps',
      input: { featureId: 'f2', version: 0, lastUsedAt: '', createdAt: '', clientOldestVersion: '', clientLatestVersion: '' },
      expected: { featureId: 'f2', version: 0, lastUsedAt: 0, createdAt: 0, clientOldestVersion: '', clientLatestVersion: '' }
    },
    {
      name: 'invalid string timestamps',
      input: { featureId: 'f3', version: 9, lastUsedAt: 'invalid', createdAt: 'invalid_date', clientOldestVersion: 'v1', clientLatestVersion: 'v2' },
      expected: { featureId: 'f3', version: 9, lastUsedAt: 0, createdAt: 0, clientOldestVersion: 'v1', clientLatestVersion: 'v2' }
    },
  ];

  for (const tc of testCases) {
    const obj = toProtoFeatureLastUsedInfo(tc.input).toObject();
    t.is(obj.featureId, tc.expected.featureId, tc.name);
    t.is(obj.version, tc.expected.version, tc.name);
    t.is(obj.lastUsedAt, tc.expected.lastUsedAt, tc.name);
    t.is(obj.createdAt, tc.expected.createdAt, tc.name);
    t.is(obj.clientOldestVersion, tc.expected.clientOldestVersion, tc.name);
    t.is(obj.clientLatestVersion, tc.expected.clientLatestVersion, tc.name);
  }
});

test('toProtoPrerequisite: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { featureId: 'f1', variationId: 'v1' }, expected: { featureId: 'f1', variationId: 'v1' } },
    { name: 'empty', input: { featureId: '', variationId: '' }, expected: { featureId: '', variationId: '' } },
    { name: 'partial featureId', input: { featureId: 'f2', variationId: '' }, expected: { featureId: 'f2', variationId: '' } },
  ];

  for (const tc of testCases) {
    const obj = toProtoPrerequisite(tc.input).toObject();
    t.is(obj.featureId, tc.expected.featureId, tc.name);
    t.is(obj.variationId, tc.expected.variationId, tc.name);
  }
});
