/**
 * Production Logic Reuse:
 * These helper functions re-implement the @bucketeer/evaluation helpers locally as they
 * will be restricted to internal testing only within the @bucketeer/evaluation package.
 *
 * All functions below are designed to use the same translation logic used in production
 * (via src/evaluator/converter.ts) to ensure that tests accurately simulate how data is
 * mapped in the network and evaluator layers.
 */
import {
  Feature as ProtoFeature,
  User as ProtoUser,
  SegmentUser as ProtoSegmentUser,
  Prerequisite as ProtoPrerequisite,
  Strategy as ProtoStrategy,
  Clause as ProtoClause,
} from '@bucketeer/evaluation';
import {
  toProtoFeature,
  toProtoUser,
  toProtoPrerequisite,
} from '../../evaluator/converter';
import { Feature, Rule } from '../../objects/feature';

export function createUser(id: string, data: { [key: string]: string }): ProtoUser {
  return toProtoUser({ id, data });
}

export function createPrerequisite(featureId: string, variationId: string): ProtoPrerequisite {
  return toProtoPrerequisite({ featureId, variationId });
}

export function createSegmentUser(userId: string, segmentId: string, state: any): ProtoSegmentUser {
  const pu = new ProtoSegmentUser();
  pu.setId(`${segmentId}:${userId}`);
  pu.setSegmentId(segmentId);
  pu.setUserId(userId);
  pu.setState(state);
  pu.setDeleted(false);
  return pu;
}

const VariationTypeMap: Record<number, string> = {
  [ProtoFeature.VariationType.STRING]: 'STRING',
  [ProtoFeature.VariationType.BOOLEAN]: 'BOOLEAN',
  [ProtoFeature.VariationType.NUMBER]: 'NUMBER',
  [ProtoFeature.VariationType.JSON]: 'JSON',
};

const StrategyTypeMap: Record<number, string> = {
  [ProtoStrategy.Type.FIXED]: 'FIXED',
  [ProtoStrategy.Type.ROLLOUT]: 'ROLLOUT',
};

const OperatorMap: Record<number, string> = {
  [ProtoClause.Operator.EQUALS]: 'EQUALS',
  [ProtoClause.Operator.IN]: 'IN',
  [ProtoClause.Operator.ENDS_WITH]: 'ENDS_WITH',
  [ProtoClause.Operator.STARTS_WITH]: 'STARTS_WITH',
  [ProtoClause.Operator.SEGMENT]: 'SEGMENT',
  [ProtoClause.Operator.GREATER]: 'GREATER',
  [ProtoClause.Operator.GREATER_OR_EQUAL]: 'GREATER_OR_EQUAL',
  [ProtoClause.Operator.LESS]: 'LESS',
  [ProtoClause.Operator.LESS_OR_EQUAL]: 'LESS_OR_EQUAL',
  [ProtoClause.Operator.BEFORE]: 'BEFORE',
  [ProtoClause.Operator.AFTER]: 'AFTER',
  [ProtoClause.Operator.FEATURE_FLAG]: 'FEATURE_FLAG',
  [ProtoClause.Operator.PARTIALLY_MATCH]: 'PARTIALLY_MATCH',
  [ProtoClause.Operator.NOT_EQUALS]: 'NOT_EQUALS',
};

export function createFeature(params: any): ProtoFeature {
  const internalFeature: Feature = {
    id: params.id || '',
    name: params.name || '',
    description: params.description || '',
    enabled: params.enabled !== undefined ? params.enabled : true,
    deleted: params.deleted || false,
    ttl: params.ttl || 0,
    version: params.version || 0,
    createdAt: params.createdAt || '0',
    updatedAt: params.updatedAt || '0',
    variationType: params.variationType !== undefined ? (VariationTypeMap[params.variationType] || 'STRING') : 'STRING',
    offVariation: params.offVariation || '',
    tags: params.tagList || [],
    maintainer: params.maintainer || '',
    archived: params.archived || false,
    samplingSeed: params.samplingSeed || '',
    variations: (params.variations || []).map((v: any) => ({
      id: v.id || '',
      value: v.value || '',
      name: v.name || '',
      description: v.description || '',
    })),
    targets: (params.targets || []).map((t: any) => ({
      variation: t.variation || '',
      users: t.users || [],
    })),
    rules: (params.rules || []).map((r: any) => {
      const rule: Rule = {
        id: r.id || '',
        clauses: [{
          id: r.id || '',
          attribute: r.attribute || '',
          operator: r.operator !== undefined ? (OperatorMap[r.operator] || 'EQUALS') : 'EQUALS',
          values: r.values || [],
        }],
      };
      if (r.fixedVariation) {
        rule.strategy = {
          type: 'FIXED',
          fixedStrategy: { variation: r.fixedVariation }
        };
      }
      return rule;
    }),
    defaultStrategy: params.defaultStrategy ? {
      type: params.defaultStrategy.type !== undefined ? (StrategyTypeMap[params.defaultStrategy.type] || 'FIXED') : 'FIXED', 
      fixedStrategy: params.defaultStrategy.variation ? { variation: params.defaultStrategy.variation } : undefined,
    } : undefined,
    prerequisites: (params.prerequisitesList || []).map((p: any) => ({
      featureId: p.getFeatureId ? p.getFeatureId() : p.featureId,
      variationId: p.getVariationId ? p.getVariationId() : p.variationId,
    })),
  };

  return toProtoFeature(internalFeature);
}
