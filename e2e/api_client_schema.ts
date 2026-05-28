/**
 * This test suite provides deep schema validation for the Bucketeer API responses.
 *
 * It uses a bottom-up assertion pattern to verify the presence and type of every field
 * in the API responses, including nested objects and arrays. This ensures that any
 * breaking changes or unexpected field removals in the backend are caught immediately
 * at the SDK level, preventing silent failures in production.
 *
 * Why this test is necessary
 *
 * `JSON.parse` returns `unknown` / `any` at runtime. TypeScript types are erased at
 * compile time and provide no protection against what the server actually sends.
 * If the backend removes a field or changes its type, the SDK receives `undefined` or an
 * unexpected value and silently propagates it — potentially breaking evaluations in
 * production without any error being thrown. This test suite acts as the runtime contract
 * that TypeScript's type system cannot enforce on its own.
 */

import test, { ExecutionContext } from 'ava';
import { APIClient } from '../lib/api/client';
import {
  API_ENDPOINT,
  SERVER_API_KEY,
  CLIENT_API_KEY,
  FEATURE_TAG,
  TARGETED_USER_ID,
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_STRING,
  FEATURE_ID_INT,
  FEATURE_ID_FLOAT,
  FEATURE_ID_JSON,
} from './constants/constants';
import { SourceId } from '../lib/objects/sourceId';
import { nodeSDKVersion } from '../lib/objects/version';

const FEATURE_IDS = [
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_STRING,
  FEATURE_ID_INT,
  FEATURE_ID_FLOAT,
  FEATURE_ID_JSON,
] as const;

const CLAUSE_OPERATORS = [
  'EQUALS',
  'IN',
  'ENDS_WITH',
  'STARTS_WITH',
  'SEGMENT',
  'GREATER',
  'GREATER_OR_EQUAL',
  'LESS',
  'LESS_OR_EQUAL',
  'BEFORE',
  'AFTER',
  'FEATURE_FLAG',
  'PARTIALLY_MATCH',
  'NOT_EQUALS',
] as const;

const STRATEGY_TYPES = ['FIXED', 'ROLLOUT'] as const;
const VARIATION_TYPES = ['STRING', 'BOOLEAN', 'NUMBER', 'JSON', 'YAML'] as const;
const SEGMENT_USER_STATES = ['INCLUDED', 'EXCLUDED'] as const;
const REASON_TYPES = [
  'TARGET',
  'RULE',
  'DEFAULT',
  'CLIENT',
  'OFF_VARIATION',
  'PREREQUISITE',
] as const;

function assertStringArray(t: ExecutionContext, values: unknown): void {
  t.true(Array.isArray(values));
  (values as unknown[]).forEach((value) => t.is(typeof value, 'string'));
}

function assertAllowedString(
  t: ExecutionContext,
  value: unknown,
  allowedValues: readonly string[],
): void {
  t.is(typeof value, 'string');
  const stringValue = value as string;
  t.true(allowedValues.includes(stringValue));
}

// Leaf helpers

function assertVariation(t: ExecutionContext, v: unknown): void {
  t.truthy(v);
  const obj = v as Record<string, unknown>;
  t.is(typeof obj.id, 'string');
  t.is(typeof obj.value, 'string');
  // name and description are optional, so only check type if they are present
  if (obj.name !== undefined) {
    t.is(typeof obj.name, 'string');
  }
  if (obj.description !== undefined) {
    t.is(typeof obj.description, 'string');
  }
}

function assertTarget(t: ExecutionContext, target: unknown): void {
  t.truthy(target);
  const obj = target as Record<string, unknown>;
  t.is(typeof obj.variation, 'string');
  assertStringArray(t, obj.users);
}

function assertClause(t: ExecutionContext, clause: unknown): void {
  t.truthy(clause);
  const obj = clause as Record<string, unknown>;
  t.is(typeof obj.id, 'string');
  t.is(typeof obj.attribute, 'string');
  assertAllowedString(t, obj.operator, CLAUSE_OPERATORS);
  assertStringArray(t, obj.values);
}

function assertFixedStrategy(t: ExecutionContext, fs: unknown): void {
  t.truthy(fs);
  const obj = fs as Record<string, unknown>;
  t.is(typeof obj.variation, 'string');
}

function assertRolloutStrategyVariation(t: ExecutionContext, rsv: unknown): void {
  t.truthy(rsv);
  const obj = rsv as Record<string, unknown>;
  t.is(typeof obj.variation, 'string');
  t.is(typeof obj.weight, 'number');
}

function assertFeatureLastUsedInfo(t: ExecutionContext, info: unknown): void {
  t.truthy(info);
  const obj = info as Record<string, unknown>;
  t.is(typeof obj.featureId, 'string');
  t.is(typeof obj.version, 'number');
  t.is(typeof obj.lastUsedAt, 'string');
  t.is(typeof obj.createdAt, 'string');
  t.is(typeof obj.clientOldestVersion, 'string');
  t.is(typeof obj.clientLatestVersion, 'string');
}

function assertPrerequisite(t: ExecutionContext, p: unknown): void {
  t.truthy(p);
  const obj = p as Record<string, unknown>;
  t.is(typeof obj.featureId, 'string');
  t.is(typeof obj.variationId, 'string');
}

function assertSegmentUser(t: ExecutionContext, user: unknown): void {
  t.truthy(user);
  const obj = user as Record<string, unknown>;
  t.is(typeof obj.id, 'string');
  t.is(typeof obj.segmentId, 'string');
  t.is(typeof obj.userId, 'string');
  assertAllowedString(t, obj.state, SEGMENT_USER_STATES);
  t.is(typeof obj.deleted, 'boolean');
}

function assertReason(t: ExecutionContext, reason: unknown): void {
  t.truthy(reason);
  const obj = reason as Record<string, unknown>;
  assertAllowedString(t, obj.type, REASON_TYPES);
  if (obj.ruleId != null) {
    t.is(typeof obj.ruleId, 'string');
  }
}

// Composed helpers

function assertRolloutStrategy(t: ExecutionContext, rs: unknown): void {
  t.truthy(rs);
  const obj = rs as Record<string, unknown>;
  t.true(Array.isArray(obj.variations));
  (obj.variations as unknown[]).forEach((rsv) => assertRolloutStrategyVariation(t, rsv));
}

function assertStrategy(t: ExecutionContext, s: unknown): void {
  t.truthy(s);
  const obj = s as Record<string, unknown>;
  assertAllowedString(t, obj.type, STRATEGY_TYPES);
  if (obj.fixedStrategy != null) assertFixedStrategy(t, obj.fixedStrategy);
  if (obj.rolloutStrategy != null) assertRolloutStrategy(t, obj.rolloutStrategy);
}

function assertRule(t: ExecutionContext, rule: unknown): void {
  t.truthy(rule);
  const obj = rule as Record<string, unknown>;
  t.is(typeof obj.id, 'string');
  t.true(Array.isArray(obj.clauses));
  if (obj.strategy != null) assertStrategy(t, obj.strategy);
  (obj.clauses as unknown[]).forEach((clause) => assertClause(t, clause));
}

function assertFeature(t: ExecutionContext, feature: unknown): void {
  t.truthy(feature);
  const obj = feature as Record<string, unknown>;
  t.is(typeof obj.id, 'string');
  t.is(typeof obj.name, 'string');
  t.is(typeof obj.description, 'string');
  t.is(typeof obj.enabled, 'boolean');
  t.is(typeof obj.deleted, 'boolean');
  t.is(typeof obj.ttl, 'number');
  t.is(typeof obj.version, 'number');
  t.is(typeof obj.createdAt, 'string');
  t.is(typeof obj.updatedAt, 'string');
  t.true(Array.isArray(obj.variations));
  t.true(Array.isArray(obj.targets));
  t.true(Array.isArray(obj.rules));
  t.is(typeof obj.offVariation, 'string');
  assertStringArray(t, obj.tags);
  t.is(typeof obj.maintainer, 'string');
  assertAllowedString(t, obj.variationType, VARIATION_TYPES);
  t.is(typeof obj.archived, 'boolean');
  t.is(typeof obj.samplingSeed, 'string');
  (obj.variations as unknown[]).forEach((v) => assertVariation(t, v));
  (obj.targets as unknown[]).forEach((target) => assertTarget(t, target));
  (obj.rules as unknown[]).forEach((rule) => assertRule(t, rule));
  if (obj.defaultStrategy != null) assertStrategy(t, obj.defaultStrategy);
  if (obj.lastUsedInfo != null) assertFeatureLastUsedInfo(t, obj.lastUsedInfo);
  if (obj.prerequisites != null) {
    t.true(Array.isArray(obj.prerequisites));
    (obj.prerequisites as unknown[]).forEach((p) => assertPrerequisite(t, p));
  }
}

function assertSegmentUsers(t: ExecutionContext, su: unknown): void {
  t.truthy(su);
  const obj = su as Record<string, unknown>;
  t.is(typeof obj.segmentId, 'string');
  t.is(typeof obj.updatedAt, 'string');
  t.true(Array.isArray(obj.users));
  (obj.users as unknown[]).forEach((user) => assertSegmentUser(t, user));
}

function assertEvaluation(t: ExecutionContext, e: unknown): void {
  t.truthy(e);
  const obj = e as Record<string, unknown>;
  t.is(typeof obj.id, 'string');
  t.is(typeof obj.featureId, 'string');
  t.is(typeof obj.featureVersion, 'number');
  t.is(typeof obj.userId, 'string');
  t.is(typeof obj.variationId, 'string');
  t.is(typeof obj.variationName, 'string');
  t.is(typeof obj.variationValue, 'string');
  if (obj.reason !== undefined) {
    assertReason(t, obj.reason);
  }
}

// Tests

test('getFeatureFlags: response schema is valid', async (t) => {
  const client = new APIClient(API_ENDPOINT, SERVER_API_KEY);

  const [res] = await client.getFeatureFlags(
    FEATURE_TAG,
    '',
    1,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.is(typeof res.featureFlagsId, 'string');
  t.true(Array.isArray(res.features));
  assertStringArray(t, res.archivedFeatureFlagIds);
  t.is(typeof res.requestedAt, 'string');
  t.is(typeof res.forceUpdate, 'boolean');

  t.true(res.features.length >= FEATURE_IDS.length);
  res.features.forEach((feature) => assertFeature(t, feature));

  const featuresById = new Map(res.features.map((feature) => [feature.id, feature]));
  FEATURE_IDS.forEach((featureId) => t.true(featuresById.has(featureId)));

  t.true((featuresById.get(FEATURE_ID_BOOLEAN)?.targets.length ?? 0) > 0);
  t.true((featuresById.get(FEATURE_ID_STRING)?.rules.length ?? 0) > 0);
});

test('getSegmentUsers: response schema is valid', async (t) => {
  const client = new APIClient(API_ENDPOINT, SERVER_API_KEY);

  const [res] = await client.getSegmentUsers(
    [],
    1,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.true(Array.isArray(res.segmentUsers));
  assertStringArray(t, res.deletedSegmentIds);
  t.is(typeof res.requestedAt, 'string');
  t.is(typeof res.forceUpdate, 'boolean');

  t.true(res.segmentUsers.length > 0);
  res.segmentUsers.forEach((segmentUsers) => assertSegmentUsers(t, segmentUsers));
});

test('getEvaluation: response schema is valid', async (t) => {
  const client = new APIClient(API_ENDPOINT, CLIENT_API_KEY);
  const user = { id: TARGETED_USER_ID, data: {} };

  const [res] = await client.getEvaluation(
    FEATURE_TAG,
    user,
    FEATURE_ID_BOOLEAN,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.truthy(res.evaluation);
  assertEvaluation(t, res.evaluation);
});
