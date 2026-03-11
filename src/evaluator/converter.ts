import {
  Feature,
  Strategy as SDKStrategy,
  Target,
  FixedStrategy,
  RolloutStrategyVariation,
  RolloutStrategy,
  Clause,
  Rule,
  Variation,
  Prerequisite,
  FeatureLastUsedInfo,
} from '../objects/feature';
import { SegmentUsers } from '../objects/segment';
import {
  Feature as ProtoFeature,
  SegmentUsers as ProtoSegmentUsers,
  SegmentUser as ProtoSegmentUser,
  Clause as ProtoClause,
  Strategy as ProtoStrategy,
} from '@bucketeer/evaluation';
import { Rule as ProtoRule } from '@bucketeer/evaluation/lib/proto/feature/rule_pb';
import { Target as ProtoTarget } from '@bucketeer/evaluation/lib/proto/feature/target_pb';
import { Variation as ProtoVariation } from '@bucketeer/evaluation/lib/proto/feature/variation_pb';
import { Prerequisite as ProtoPrerequisite } from '@bucketeer/evaluation/lib/proto/feature/prerequisite_pb';
import { FeatureLastUsedInfo as ProtoFeatureLastUsedInfo } from '@bucketeer/evaluation/lib/proto/feature/feature_last_used_info_pb';
import {
  RolloutStrategy as ProtoRolloutStrategy,
  FixedStrategy as ProtoFixedStrategy,
} from '@bucketeer/evaluation/lib/proto/feature/strategy_pb';

function mapVariationType(
  type: string,
): ProtoFeature.VariationTypeMap[keyof ProtoFeature.VariationTypeMap] {
  switch (type.toUpperCase()) {
    case 'STRING':
      return ProtoFeature.VariationType.STRING;
    case 'BOOLEAN':
      return ProtoFeature.VariationType.BOOLEAN;
    case 'NUMBER':
      return ProtoFeature.VariationType.NUMBER;
    case 'JSON':
      return ProtoFeature.VariationType.JSON;
    default:
      return ProtoFeature.VariationType.STRING;
  }
}

function mapOperator(op: string): ProtoClause.OperatorMap[keyof ProtoClause.OperatorMap] {
  // Actual operator enum values from clause_pb.d.ts:
  // EQUALS=0, IN=1, ENDS_WITH=2, STARTS_WITH=3, SEGMENT=4,
  // GREATER=5, GREATER_OR_EQUAL=6, LESS=7, LESS_OR_EQUAL=8,
  // BEFORE=9, AFTER=10, FEATURE_FLAG=11, PARTIALLY_MATCH=12, NOT_EQUALS=13
  switch (op.toUpperCase()) {
    case 'EQUALS':
      return ProtoClause.Operator.EQUALS;
    case 'IN':
      return ProtoClause.Operator.IN;
    case 'ENDS_WITH':
      return ProtoClause.Operator.ENDS_WITH;
    case 'STARTS_WITH':
      return ProtoClause.Operator.STARTS_WITH;
    case 'SEGMENT':
      return ProtoClause.Operator.SEGMENT;
    case 'GREATER':
      return ProtoClause.Operator.GREATER;
    case 'GREATER_OR_EQUAL':
      return ProtoClause.Operator.GREATER_OR_EQUAL;
    case 'LESS':
      return ProtoClause.Operator.LESS;
    case 'LESS_OR_EQUAL':
      return ProtoClause.Operator.LESS_OR_EQUAL;
    case 'BEFORE':
      return ProtoClause.Operator.BEFORE;
    case 'AFTER':
      return ProtoClause.Operator.AFTER;
    case 'FEATURE_FLAG':
      return ProtoClause.Operator.FEATURE_FLAG;
    case 'PARTIALLY_MATCH':
      return ProtoClause.Operator.PARTIALLY_MATCH;
    case 'NOT_EQUALS':
      return ProtoClause.Operator.NOT_EQUALS;
    default:
      return ProtoClause.Operator.EQUALS;
  }
}

function mapStrategyType(type: string): ProtoStrategy.TypeMap[keyof ProtoStrategy.TypeMap] {
  switch (type.toUpperCase()) {
    case 'FIXED':
      return ProtoStrategy.Type.FIXED;
    case 'ROLLOUT':
      return ProtoStrategy.Type.ROLLOUT;
    default:
      return ProtoStrategy.Type.FIXED;
  }
}

function mapSegmentUserState(
  state: string,
): ProtoSegmentUser.StateMap[keyof ProtoSegmentUser.StateMap] {
  switch (state.toUpperCase()) {
    case 'INCLUDED':
      return ProtoSegmentUser.State.INCLUDED;
    case 'EXCLUDED':
      return ProtoSegmentUser.State.EXCLUDED;
    default:
      return ProtoSegmentUser.State.INCLUDED;
  }
}

export function toProtoVariation(variation: Variation): ProtoVariation {
  const pv = new ProtoVariation();
  pv.setId(variation.id || '');
  pv.setValue(variation.value || '');
  pv.setName(variation.name || '');
  pv.setDescription(variation.description || '');
  return pv;
}

export function toProtoTarget(target: Target): ProtoTarget {
  const pt = new ProtoTarget();
  pt.setVariation(target.variation);
  pt.setUsersList(target.users);
  return pt;
}

export function toProtoClause(clause: Clause): ProtoClause {
  const pc = new ProtoClause();
  pc.setId(clause.id);
  pc.setAttribute(clause.attribute);
  pc.setOperator(mapOperator(clause.operator));
  pc.setValuesList(clause.values);
  return pc;
}

export function toProtoFixedStrategy(strategy: FixedStrategy): ProtoFixedStrategy {
  const pf = new ProtoFixedStrategy();
  pf.setVariation(strategy.variation);
  return pf;
}

export function toProtoRolloutStrategyVariation(
  variation: RolloutStrategyVariation,
): ProtoRolloutStrategy.Variation {
  const prv = new ProtoRolloutStrategy.Variation();
  prv.setVariation(variation.variation);
  prv.setWeight(variation.weight);
  return prv;
}

export function toProtoRolloutStrategy(strategy: RolloutStrategy): ProtoRolloutStrategy {
  const pr = new ProtoRolloutStrategy();
  pr.setVariationsList(strategy.variations.map(toProtoRolloutStrategyVariation));
  return pr;
}

export function toProtoStrategy(strategy: SDKStrategy): ProtoStrategy {
  const ps = new ProtoStrategy();
  ps.setType(mapStrategyType(strategy.type));

  if (strategy.fixedStrategy) {
    ps.setFixedStrategy(toProtoFixedStrategy(strategy.fixedStrategy));
  }

  if (strategy.rolloutStrategy) {
    ps.setRolloutStrategy(toProtoRolloutStrategy(strategy.rolloutStrategy));
  }

  return ps;
}

export function toProtoRule(rule: Rule): ProtoRule {
  const pr = new ProtoRule();
  pr.setId(rule.id);

  if (rule.strategy) {
    pr.setStrategy(toProtoStrategy(rule.strategy));
  }

  pr.setClausesList(rule.clauses.map(toProtoClause));

  return pr;
}

export function toProtoFeatureLastUsedInfo(info: FeatureLastUsedInfo): ProtoFeatureLastUsedInfo {
  const pInfo = new ProtoFeatureLastUsedInfo();
  pInfo.setFeatureId(info.featureId);
  pInfo.setVersion(info.version);
  pInfo.setLastUsedAt(Number(info.lastUsedAt) || 0);
  pInfo.setCreatedAt(Number(info.createdAt) || 0);
  pInfo.setClientOldestVersion(info.clientOldestVersion);
  pInfo.setClientLatestVersion(info.clientLatestVersion);
  return pInfo;
}

export function toProtoPrerequisite(prerequisite: Prerequisite): ProtoPrerequisite {
  const pp = new ProtoPrerequisite();
  pp.setFeatureId(prerequisite.featureId);
  pp.setVariationId(prerequisite.variationId);
  return pp;
}

export function toProtoFeature(feature: Feature): ProtoFeature {
  const f = new ProtoFeature();
  f.setId(feature.id);
  f.setName(feature.name);
  f.setDescription(feature.description);
  f.setEnabled(feature.enabled);
  f.setDeleted(feature.deleted);
  f.setTtl(feature.ttl);
  f.setVersion(feature.version);
  f.setCreatedAt(Number(feature.createdAt) || 0);
  f.setUpdatedAt(Number(feature.updatedAt) || 0);
  f.setVariationType(mapVariationType(feature.variationType));
  f.setOffVariation(feature.offVariation);
  f.setTagsList(feature.tags);
  f.setMaintainer(feature.maintainer);
  f.setArchived(feature.archived);
  f.setSamplingSeed(feature.samplingSeed);

  // Note: Two fields present in the Protobuf definition ('evaluationUndelayable' and 'autoOpsSummary')
  // are omitted because the current GO SDK Feature response model does not have them.

  if (feature.variations) {
    f.setVariationsList(feature.variations.map(toProtoVariation));
  }

  if (feature.targets) {
    f.setTargetsList(feature.targets.map(toProtoTarget));
  }

  if (feature.rules) {
    f.setRulesList(feature.rules.map(toProtoRule));
  }

  if (feature.defaultStrategy) {
    f.setDefaultStrategy(toProtoStrategy(feature.defaultStrategy));
  }

  if (feature.lastUsedInfo) {
    f.setLastUsedInfo(toProtoFeatureLastUsedInfo(feature.lastUsedInfo));
  }

  if (feature.prerequisites) {
    f.setPrerequisitesList(feature.prerequisites.map(toProtoPrerequisite));
  }

  return f;
}

export function toProtoSegmentUsers(segmentUsers: SegmentUsers): ProtoSegmentUsers {
  const psu = new ProtoSegmentUsers();
  psu.setSegmentId(segmentUsers.segmentId);
  psu.setUpdatedAt(Number(segmentUsers.updatedAt) || 0);

  psu.setUsersList(
    segmentUsers.users.map((u) => {
      const pu = new ProtoSegmentUser();
      pu.setId(u.id);
      pu.setSegmentId(u.segmentId);
      pu.setUserId(u.userId);
      pu.setState(mapSegmentUserState(u.state));
      pu.setDeleted(u.deleted);
      return pu;
    }),
  );

  return psu;
}
