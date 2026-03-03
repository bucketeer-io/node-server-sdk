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

// ─── toProtoFeature ──────────────────────────────────────────────────────────

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
        firstVariation: { id: 'var_1', value: 'value_1', name: 'Variation 1', description: 'desc 1' },
        targetsLength: 1,
        firstTarget: { variation: 'var_1', usersList: ['user_1'] },
        rulesLength: 1,
        firstRule: {
          id: 'rule_1',
          strategyType: 1, // ROLLOUT
          clausesLength: 1,
          firstClause: { id: 'clause_1', attribute: 'attr_1', operator: 0, valuesList: ['val_1'] },
          rolloutVariationsLength: 1,
        },
        defaultStrategyType: 0, // FIXED = 0
        defaultStrategyFixedVariation: 'var_1',
        lastUsedInfo: {
          featureId: 'feature_1',
          version: 2,
          lastUsedAt: 1690001000,
          createdAt: 1690000000,
          clientOldestVersion: '1.0.0',
          clientLatestVersion: '2.0.0',
        },
        prerequisitesLength: 1,
        firstPrerequisite: { featureId: 'pre_1', variationId: 'pre_var_1' },
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
        firstVariation: null,
        targetsLength: 0,
        firstTarget: null,
        rulesLength: 0,
        firstRule: null,
        defaultStrategyType: undefined,
        defaultStrategyFixedVariation: undefined,
        lastUsedInfo: null,
        prerequisitesLength: 0,
        firstPrerequisite: null,
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
        firstVariation: null,
        targetsLength: 0,
        firstTarget: null,
        rulesLength: 0,
        firstRule: null,
        defaultStrategyType: undefined,
        defaultStrategyFixedVariation: undefined,
        lastUsedInfo: null,
        prerequisitesLength: 0,
        firstPrerequisite: null,
      },
    },
    {
      name: 'NUMBER variation type',
      input: {
        id: 'feature_num',
        name: 'Feature Number',
        description: '',
        enabled: true,
        deleted: false,
        ttl: 0,
        version: 1,
        createdAt: '1690000000',
        updatedAt: '1690000000',
        variationType: 'NUMBER',
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
        id: 'feature_num',
        name: 'Feature Number',
        description: '',
        enabled: true,
        deleted: false,
        ttl: 0,
        version: 1,
        createdAt: 1690000000,
        updatedAt: 1690000000,
        variationType: ProtoFeature.VariationType.NUMBER,
        offVariation: '',
        tagsList: [],
        maintainer: '',
        archived: false,
        samplingSeed: '',
        variationsLength: 0,
        firstVariation: null,
        targetsLength: 0,
        firstTarget: null,
        rulesLength: 0,
        firstRule: null,
        defaultStrategyType: undefined,
        defaultStrategyFixedVariation: undefined,
        lastUsedInfo: null,
        prerequisitesLength: 0,
        firstPrerequisite: null,
      },
    },
    {
      name: 'Disabled and deleted feature',
      input: {
        id: 'feature_disabled',
        name: 'Feature Disabled',
        description: '',
        enabled: false,
        deleted: true,
        ttl: 0,
        version: 3,
        createdAt: '1690000000',
        updatedAt: '1690000000',
        variationType: 'STRING',
        variations: [],
        targets: [],
        rules: [],
        offVariation: 'off_var',
        tags: [],
        maintainer: '',
        archived: true,
        samplingSeed: '',
      } as Feature,
      expected: {
        id: 'feature_disabled',
        name: 'Feature Disabled',
        description: '',
        enabled: false,
        deleted: true,
        ttl: 0,
        version: 3,
        createdAt: 1690000000,
        updatedAt: 1690000000,
        variationType: ProtoFeature.VariationType.STRING,
        offVariation: 'off_var',
        tagsList: [],
        maintainer: '',
        archived: true, // archived: true exercised
        samplingSeed: '',
        variationsLength: 0,
        firstVariation: null,
        targetsLength: 0,
        firstTarget: null,
        rulesLength: 0,
        firstRule: null,
        defaultStrategyType: undefined,
        defaultStrategyFixedVariation: undefined,
        lastUsedInfo: null,
        prerequisitesLength: 0,
        firstPrerequisite: null,
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
        firstVariation: null,
        targetsLength: 0,
        firstTarget: null,
        rulesLength: 0,
        firstRule: null,
        defaultStrategyType: undefined,
        defaultStrategyFixedVariation: undefined,
        lastUsedInfo: null,
        prerequisitesLength: 0,
        firstPrerequisite: null,
      },
    },
  ];

  for (const tc of testCases) {
    const proto = toProtoFeature(tc.input);
    const obj = proto.toObject();

    t.is(obj.id, tc.expected.id, `${tc.name}: id`);
    t.is(obj.name, tc.expected.name, `${tc.name}: name`);
    t.is(obj.description, tc.expected.description, `${tc.name}: description`);
    t.is(obj.enabled, tc.expected.enabled, `${tc.name}: enabled`);
    t.is(obj.deleted, tc.expected.deleted, `${tc.name}: deleted`);
    t.is(obj.ttl, tc.expected.ttl, `${tc.name}: ttl`);
    t.is(obj.version, tc.expected.version, `${tc.name}: version`);
    t.is(obj.createdAt, tc.expected.createdAt, `${tc.name}: createdAt`);
    t.is(obj.updatedAt, tc.expected.updatedAt, `${tc.name}: updatedAt`);
    t.is(obj.variationType as number, tc.expected.variationType, `${tc.name}: variationType`);
    t.is(obj.offVariation, tc.expected.offVariation, `${tc.name}: offVariation`);
    t.deepEqual(obj.tagsList, tc.expected.tagsList, `${tc.name}: tagsList`);
    t.is(obj.maintainer, tc.expected.maintainer, `${tc.name}: maintainer`);
    t.is(obj.archived, tc.expected.archived, `${tc.name}: archived`);
    t.is(obj.samplingSeed, tc.expected.samplingSeed, `${tc.name}: samplingSeed`);

    t.is(obj.variationsList.length, tc.expected.variationsLength, `${tc.name}: variationsLength`);
    if (tc.expected.firstVariation) {
      t.is(obj.variationsList[0].id, tc.expected.firstVariation.id, `${tc.name}: variation[0].id`);
      t.is(obj.variationsList[0].value, tc.expected.firstVariation.value, `${tc.name}: variation[0].value`);
      t.is(obj.variationsList[0].name, tc.expected.firstVariation.name, `${tc.name}: variation[0].name`);
      t.is(obj.variationsList[0].description, tc.expected.firstVariation.description, `${tc.name}: variation[0].description`);
    }

    t.is(obj.targetsList.length, tc.expected.targetsLength, `${tc.name}: targetsLength`);
    if (tc.expected.firstTarget) {
      t.is(obj.targetsList[0].variation, tc.expected.firstTarget.variation, `${tc.name}: target[0].variation`);
      t.deepEqual(obj.targetsList[0].usersList, tc.expected.firstTarget.usersList, `${tc.name}: target[0].usersList`);
    }

    t.is(obj.rulesList.length, tc.expected.rulesLength, `${tc.name}: rulesLength`);
    if (tc.expected.firstRule) {
      const rule = obj.rulesList[0];
      t.is(rule.id, tc.expected.firstRule.id, `${tc.name}: rule[0].id`);
      t.is(rule.strategy?.type as number, tc.expected.firstRule.strategyType, `${tc.name}: rule[0].strategy.type`);
      t.is(rule.clausesList.length, tc.expected.firstRule.clausesLength, `${tc.name}: rule[0].clausesLength`);
      if (tc.expected.firstRule.firstClause) {
        const clause = rule.clausesList[0];
        t.is(clause.id, tc.expected.firstRule.firstClause.id, `${tc.name}: clause[0].id`);
        t.is(clause.attribute, tc.expected.firstRule.firstClause.attribute, `${tc.name}: clause[0].attribute`);
        t.is(clause.operator as number, tc.expected.firstRule.firstClause.operator, `${tc.name}: clause[0].operator`);
        t.deepEqual(clause.valuesList, tc.expected.firstRule.firstClause.valuesList, `${tc.name}: clause[0].valuesList`);
      }
      if (rule.strategy?.rolloutStrategy) {
        t.is(rule.strategy.rolloutStrategy.variationsList.length, tc.expected.firstRule.rolloutVariationsLength, `${tc.name}: rolloutVariationsLength`);
      }
    }

    if (tc.expected.defaultStrategyType !== undefined) {
      t.truthy(obj.defaultStrategy, `${tc.name}: defaultStrategy present`);
      t.is(obj.defaultStrategy?.type as number, tc.expected.defaultStrategyType, `${tc.name}: defaultStrategy.type`);
      if (tc.expected.defaultStrategyFixedVariation !== undefined) {
        t.is(obj.defaultStrategy?.fixedStrategy?.variation, tc.expected.defaultStrategyFixedVariation, `${tc.name}: defaultStrategy.fixedStrategy.variation`);
      }
    } else {
      t.falsy(obj.defaultStrategy, `${tc.name}: no defaultStrategy`);
    }

    if (tc.expected.lastUsedInfo) {
      t.truthy(obj.lastUsedInfo, `${tc.name}: lastUsedInfo present`);
      t.is(obj.lastUsedInfo?.featureId, tc.expected.lastUsedInfo.featureId, `${tc.name}: lastUsedInfo.featureId`);
      t.is(obj.lastUsedInfo?.version, tc.expected.lastUsedInfo.version, `${tc.name}: lastUsedInfo.version`);
      t.is(obj.lastUsedInfo?.lastUsedAt, tc.expected.lastUsedInfo.lastUsedAt, `${tc.name}: lastUsedInfo.lastUsedAt`);
      t.is(obj.lastUsedInfo?.createdAt, tc.expected.lastUsedInfo.createdAt, `${tc.name}: lastUsedInfo.createdAt`);
      t.is(obj.lastUsedInfo?.clientOldestVersion, tc.expected.lastUsedInfo.clientOldestVersion, `${tc.name}: lastUsedInfo.clientOldestVersion`);
      t.is(obj.lastUsedInfo?.clientLatestVersion, tc.expected.lastUsedInfo.clientLatestVersion, `${tc.name}: lastUsedInfo.clientLatestVersion`);
    } else {
      t.falsy(obj.lastUsedInfo, `${tc.name}: no lastUsedInfo`);
    }

    t.is(obj.prerequisitesList.length, tc.expected.prerequisitesLength, `${tc.name}: prerequisitesLength`);
    if (tc.expected.firstPrerequisite) {
      t.is(obj.prerequisitesList[0].featureId, tc.expected.firstPrerequisite.featureId, `${tc.name}: prereq[0].featureId`);
      t.is(obj.prerequisitesList[0].variationId, tc.expected.firstPrerequisite.variationId, `${tc.name}: prereq[0].variationId`);
    }
  }
});

// ─── toProtoSegmentUsers ─────────────────────────────────────────────────────

test('toProtoSegmentUsers: parameterized cases', (t) => {
  const testCases = [
    {
      name: 'Full mapping with INCLUDED and EXCLUDED',
      input: {
        segmentId: 'seg_1',
        updatedAt: '1690000000',
        users: [
          { id: 'su_1', segmentId: 'seg_1', userId: 'user_1', state: 'INCLUDED', deleted: false },
          { id: 'su_2', segmentId: 'seg_1', userId: 'user_2', state: 'EXCLUDED', deleted: false },
        ],
      } as SegmentUsers,
      expected: {
        segmentId: 'seg_1',
        updatedAt: 1690000000,
        usersLength: 2,
        users: [
          { id: 'su_1', segmentId: 'seg_1', userId: 'user_1', state: 0, deleted: false }, // INCLUDED = 0
          { id: 'su_2', segmentId: 'seg_1', userId: 'user_2', state: 1, deleted: false }, // EXCLUDED = 1
        ],
      },
    },
    {
      name: 'Empty users list',
      input: {
        segmentId: 'seg_empty',
        updatedAt: '1690000000',
        users: [],
      } as SegmentUsers,
      expected: {
        segmentId: 'seg_empty',
        updatedAt: 1690000000,
        usersLength: 0,
        users: [],
      },
    },
    {
      name: 'Invalid timestamp defaults to 0',
      input: {
        segmentId: 'seg_badtime',
        updatedAt: 'not-a-number',
        users: [],
      } as SegmentUsers,
      expected: {
        segmentId: 'seg_badtime',
        updatedAt: 0,
        usersLength: 0,
        users: [],
      },
    },
    {
      name: 'Unknown state defaults to INCLUDED',
      input: {
        segmentId: 'seg_unknown_state',
        updatedAt: '1690000000',
        users: [
          { id: 'su_3', segmentId: 'seg_unknown_state', userId: 'user_3', state: 'SOME_FUTURE_STATE', deleted: false },
        ],
      } as SegmentUsers,
      expected: {
        segmentId: 'seg_unknown_state',
        updatedAt: 1690000000,
        usersLength: 1,
        users: [
          { id: 'su_3', segmentId: 'seg_unknown_state', userId: 'user_3', state: 0, deleted: false }, // falls back to INCLUDED = 0
        ],
      },
    },
    {
      name: 'User with deleted: true',
      input: {
        segmentId: 'seg_deleted',
        updatedAt: '1690000000',
        users: [
          { id: 'su_4', segmentId: 'seg_deleted', userId: 'user_4', state: 'INCLUDED', deleted: true },
        ],
      } as SegmentUsers,
      expected: {
        segmentId: 'seg_deleted',
        updatedAt: 1690000000,
        usersLength: 1,
        users: [
          { id: 'su_4', segmentId: 'seg_deleted', userId: 'user_4', state: 0, deleted: true },
        ],
      },
    },
  ];

  for (const tc of testCases) {
    const obj = toProtoSegmentUsers(tc.input).toObject();
    t.is(obj.segmentId, tc.expected.segmentId, `${tc.name}: segmentId`);
    t.is(obj.updatedAt, tc.expected.updatedAt, `${tc.name}: updatedAt`);
    t.is(obj.usersList.length, tc.expected.usersLength, `${tc.name}: usersLength`);

    for (let i = 0; i < tc.expected.users.length; i++) {
      const eu = tc.expected.users[i];
      const au = obj.usersList[i];
      t.is(au.id, eu.id, `${tc.name}: user[${i}].id`);
      t.is(au.segmentId, eu.segmentId, `${tc.name}: user[${i}].segmentId`);
      t.is(au.userId, eu.userId, `${tc.name}: user[${i}].userId`);
      t.is(au.state as number, eu.state, `${tc.name}: user[${i}].state`);
      t.is(au.deleted, eu.deleted, `${tc.name}: user[${i}].deleted`);
    }
  }
});

// ─── toProtoVariation ────────────────────────────────────────────────────────

test('toProtoVariation: parameterized cases', (t) => {
  const testCases = [
    { name: 'empty', input: {}, expected: { id: '', value: '', name: '', description: '' } },
    { name: 'full', input: { id: 'v1', value: 'val1', name: 'name1', description: 'desc1' }, expected: { id: 'v1', value: 'val1', name: 'name1', description: 'desc1' } },
    { name: 'partial id only', input: { id: 'v2' }, expected: { id: 'v2', value: '', name: '', description: '' } },
    { name: 'partial value only', input: { value: 'val2' }, expected: { id: '', value: 'val2', name: '', description: '' } },
  ];

  for (const tc of testCases) {
    const obj = toProtoVariation(tc.input).toObject();
    t.is(obj.id, tc.expected.id, `${tc.name}: id`);
    t.is(obj.value, tc.expected.value, `${tc.name}: value`);
    t.is(obj.name, tc.expected.name, `${tc.name}: name`);
    t.is(obj.description, tc.expected.description, `${tc.name}: description`);
  }
});

// ─── toProtoTarget ───────────────────────────────────────────────────────────

test('toProtoTarget: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { variation: 'v1', users: ['u1', 'u2'] }, expected: { variation: 'v1', users: ['u1', 'u2'] } },
    { name: 'empty', input: { variation: '', users: [] }, expected: { variation: '', users: [] } },
    { name: 'no users', input: { variation: 'v2', users: [] }, expected: { variation: 'v2', users: [] } },
  ];

  for (const tc of testCases) {
    const obj = toProtoTarget(tc.input).toObject();
    t.is(obj.variation, tc.expected.variation, `${tc.name}: variation`);
    t.deepEqual(obj.usersList, tc.expected.users, `${tc.name}: usersList`);
  }
});

// ─── toProtoClause ───────────────────────────────────────────────────────────

test('toProtoClause: all operators parameterized', (t) => {
  // Actual operator enum values from clause_pb.d.ts:
  // EQUALS=0, IN=1, ENDS_WITH=2, STARTS_WITH=3, SEGMENT=4,
  // GREATER=5, GREATER_OR_EQUAL=6, LESS=7, LESS_OR_EQUAL=8,
  // BEFORE=9, AFTER=10, FEATURE_FLAG=11, PARTIALLY_MATCH=12, NOT_EQUALS=13
  const testCases = [
    { name: 'EQUALS', operator: 'EQUALS', expected: 0 },
    { name: 'IN', operator: 'IN', expected: 1 },
    { name: 'ENDS_WITH', operator: 'ENDS_WITH', expected: 2 },
    { name: 'STARTS_WITH', operator: 'STARTS_WITH', expected: 3 },
    { name: 'SEGMENT', operator: 'SEGMENT', expected: 4 },
    { name: 'GREATER', operator: 'GREATER', expected: 5 },
    { name: 'GREATER_OR_EQUAL', operator: 'GREATER_OR_EQUAL', expected: 6 },
    { name: 'LESS', operator: 'LESS', expected: 7 },
    { name: 'LESS_OR_EQUAL', operator: 'LESS_OR_EQUAL', expected: 8 },
    { name: 'BEFORE', operator: 'BEFORE', expected: 9 },
    { name: 'AFTER', operator: 'AFTER', expected: 10 },
    { name: 'PARTIALLY_MATCH', operator: 'PARTIALLY_MATCH', expected: 12 },
    { name: 'unknown defaults to EQUALS', operator: 'FOO_BAR', expected: 0 },
    { name: 'empty defaults to EQUALS', operator: '', expected: 0 },
  ];

  for (const tc of testCases) {
    const obj = toProtoClause({ id: 'c1', attribute: 'a1', operator: tc.operator, values: ['v'] } as any).toObject();
    t.is(obj.operator as number, tc.expected, `${tc.name}: operator`);
  }
});

test('toProtoClause: full field mapping', (t) => {
  const obj = toProtoClause({ id: 'c1', attribute: 'attr', operator: 'IN', values: ['a', 'b'] }).toObject();
  t.is(obj.id, 'c1');
  t.is(obj.attribute, 'attr');
  t.is(obj.operator as number, 1); // IN
  t.deepEqual(obj.valuesList, ['a', 'b']);
});

// ─── toProtoFixedStrategy ────────────────────────────────────────────────────

test('toProtoFixedStrategy: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { variation: 'v1' }, expected: { variation: 'v1' } },
    { name: 'empty', input: { variation: '' }, expected: { variation: '' } },
  ];

  for (const tc of testCases) {
    const obj = toProtoFixedStrategy(tc.input).toObject();
    t.is(obj.variation, tc.expected.variation, `${tc.name}: variation`);
  }
});

// ─── toProtoRolloutStrategyVariation ─────────────────────────────────────────

test('toProtoRolloutStrategyVariation: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { variation: 'v1', weight: 50000 }, expected: { variation: 'v1', weight: 50000 } },
    { name: 'zero weight', input: { variation: 'v2', weight: 0 }, expected: { variation: 'v2', weight: 0 } },
    { name: 'full weight', input: { variation: 'v3', weight: 100000 }, expected: { variation: 'v3', weight: 100000 } },
    { name: 'empty variation', input: { variation: '', weight: 100 }, expected: { variation: '', weight: 100 } },
  ];

  for (const tc of testCases) {
    const obj = toProtoRolloutStrategyVariation(tc.input).toObject();
    t.is(obj.variation, tc.expected.variation, `${tc.name}: variation`);
    t.is(obj.weight, tc.expected.weight, `${tc.name}: weight`);
  }
});

// ─── toProtoRolloutStrategy ──────────────────────────────────────────────────

test('toProtoRolloutStrategy: parameterized cases', (t) => {
  const testCases = [
    {
      name: 'multiple variations with weights',
      input: { variations: [{ variation: 'v1', weight: 50000 }, { variation: 'v2', weight: 50000 }] },
      expected: [{ variation: 'v1', weight: 50000 }, { variation: 'v2', weight: 50000 }],
    },
    {
      name: 'single variation full weight',
      input: { variations: [{ variation: 'v1', weight: 100000 }] },
      expected: [{ variation: 'v1', weight: 100000 }],
    },
    {
      name: 'empty variations',
      input: { variations: [] },
      expected: [],
    },
  ];

  for (const tc of testCases) {
    const obj = toProtoRolloutStrategy(tc.input).toObject();
    t.is(obj.variationsList.length, tc.expected.length, `${tc.name}: length`);
    for (let i = 0; i < tc.expected.length; i++) {
      t.is(obj.variationsList[i].variation, tc.expected[i].variation, `${tc.name}: [${i}].variation`);
      t.is(obj.variationsList[i].weight, tc.expected[i].weight, `${tc.name}: [${i}].weight`);
    }
  }
});

// ─── toProtoStrategy ─────────────────────────────────────────────────────────

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
    t.is(obj.type as number, tc.expectedType, `${tc.name}: type`);
    t.is(!!obj.fixedStrategy, tc.hasFixed, `${tc.name}: hasFixed`);
    t.is(!!obj.rolloutStrategy, tc.hasRollout, `${tc.name}: hasRollout`);
  }
});

// ─── toProtoRule ─────────────────────────────────────────────────────────────

test('toProtoRule: parameterized cases', (t) => {
  const testCases = [
    {
      name: 'minimal (no strategy)',
      input: { id: 'r1', clauses: [] },
      expectedId: 'r1',
      hasStrategy: false,
      clausesLength: 0,
    },
    {
      name: 'full with FIXED strategy and multiple clauses',
      input: {
        id: 'r2',
        strategy: { type: 'FIXED', fixedStrategy: { variation: 'v1' } },
        clauses: [
          { id: 'c1', attribute: 'a1', operator: 'EQUALS', values: ['v1'] },
          { id: 'c2', attribute: 'a2', operator: 'IN', values: ['v2', 'v3'] },
        ],
      },
      expectedId: 'r2',
      hasStrategy: true,
      clausesLength: 2,
    },
    {
      name: 'with ROLLOUT strategy',
      input: {
        id: 'r3',
        strategy: { type: 'ROLLOUT', rolloutStrategy: { variations: [{ variation: 'v1', weight: 100000 }] } },
        clauses: [{ id: 'c3', attribute: 'a3', operator: 'SEGMENT', values: ['seg_1'] }],
      },
      expectedId: 'r3',
      hasStrategy: true,
      clausesLength: 1,
    },
    {
      name: 'empty id',
      input: { id: '', clauses: [] },
      expectedId: '',
      hasStrategy: false,
      clausesLength: 0,
    },
  ];

  for (const tc of testCases) {
    const obj = toProtoRule(tc.input).toObject();
    t.is(obj.id, tc.expectedId, `${tc.name}: id`);
    t.is(!!obj.strategy, tc.hasStrategy, `${tc.name}: hasStrategy`);
    t.is(obj.clausesList.length, tc.clausesLength, `${tc.name}: clausesLength`);
  }
});

// ─── toProtoFeatureLastUsedInfo ───────────────────────────────────────────────

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
      name: 'invalid string timestamps default to 0',
      input: { featureId: 'f3', version: 9, lastUsedAt: 'invalid', createdAt: 'invalid_date', clientOldestVersion: 'v1', clientLatestVersion: 'v2' },
      expected: { featureId: 'f3', version: 9, lastUsedAt: 0, createdAt: 0, clientOldestVersion: 'v1', clientLatestVersion: 'v2' }
    },
  ];

  for (const tc of testCases) {
    const obj = toProtoFeatureLastUsedInfo(tc.input).toObject();
    t.is(obj.featureId, tc.expected.featureId, `${tc.name}: featureId`);
    t.is(obj.version, tc.expected.version, `${tc.name}: version`);
    t.is(obj.lastUsedAt, tc.expected.lastUsedAt, `${tc.name}: lastUsedAt`);
    t.is(obj.createdAt, tc.expected.createdAt, `${tc.name}: createdAt`);
    t.is(obj.clientOldestVersion, tc.expected.clientOldestVersion, `${tc.name}: clientOldestVersion`);
    t.is(obj.clientLatestVersion, tc.expected.clientLatestVersion, `${tc.name}: clientLatestVersion`);
  }
});

// ─── toProtoPrerequisite ─────────────────────────────────────────────────────

test('toProtoPrerequisite: parameterized cases', (t) => {
  const testCases = [
    { name: 'basic', input: { featureId: 'f1', variationId: 'v1' }, expected: { featureId: 'f1', variationId: 'v1' } },
    { name: 'empty', input: { featureId: '', variationId: '' }, expected: { featureId: '', variationId: '' } },
    { name: 'partial featureId only', input: { featureId: 'f2', variationId: '' }, expected: { featureId: 'f2', variationId: '' } },
  ];

  for (const tc of testCases) {
    const obj = toProtoPrerequisite(tc.input).toObject();
    t.is(obj.featureId, tc.expected.featureId, `${tc.name}: featureId`);
    t.is(obj.variationId, tc.expected.variationId, `${tc.name}: variationId`);
  }
});
