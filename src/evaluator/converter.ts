import { Feature, Strategy as SDKStrategy } from '../objects/feature';
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
  switch (op.toUpperCase()) {
    case 'EQUALS':
      return ProtoClause.Operator.EQUALS;
    case 'IN':
      return ProtoClause.Operator.IN;
    case 'STARTS_WITH':
      return ProtoClause.Operator.STARTS_WITH;
    case 'ENDS_WITH':
      return ProtoClause.Operator.ENDS_WITH;
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
    case 'PARTIALLY_MATCH':
      return ProtoClause.Operator.PARTIALLY_MATCH;
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

export function toProtoFeature(feature: Feature): ProtoFeature {
  const f = new ProtoFeature();
  f.setId(feature.id);
  f.setName(feature.name);
  f.setDescription(feature.description);
  f.setEnabled(feature.enabled);
  f.setDeleted(feature.deleted);
  f.setTtl(feature.ttl);
  f.setVersion(feature.version);
  f.setCreatedAt(parseInt(feature.createdAt, 10));
  f.setUpdatedAt(parseInt(feature.updatedAt, 10));
  f.setVariationType(mapVariationType(feature.variationType));
  f.setOffVariation(feature.offVariation);
  f.setTagsList(feature.tags);
  f.setMaintainer(feature.maintainer);
  f.setArchived(feature.archived);
  f.setSamplingSeed(feature.samplingSeed);

  // Note: Two fields present in the Protobuf definition ('evaluationUndelayable' and 'autoOpsSummary')
  // are omitted because the current Node SDK Feature response model does not return them.
  // Verify with backend team if these are needed for evaluation payload matching.

  if (feature.variations) {
    f.setVariationsList(
      feature.variations.map((v) => {
        const pv = new ProtoVariation();
        pv.setId(v.id || '');
        pv.setValue(v.value || '');
        pv.setName(v.name || '');
        pv.setDescription(v.description || '');
        return pv;
      }),
    );
  }

  if (feature.targets) {
    f.setTargetsList(
      feature.targets.map((t) => {
        const pt = new ProtoTarget();
        pt.setVariation(t.variation);
        pt.setUsersList(t.users);
        return pt;
      }),
    );
  }

  if (feature.rules) {
    f.setRulesList(
      feature.rules.map((r) => {
        const pr = new ProtoRule();
        pr.setId(r.id);

        if (r.strategy) {
          pr.setStrategy(mapStrategy(r.strategy));
        }

        pr.setClausesList(
          r.clauses.map((c) => {
            const pc = new ProtoClause();
            pc.setId(c.id);
            pc.setAttribute(c.attribute);
            pc.setOperator(mapOperator(c.operator));
            pc.setValuesList(c.values);
            return pc;
          }),
        );

        return pr;
      }),
    );
  }

  if (feature.defaultStrategy) {
    f.setDefaultStrategy(mapStrategy(feature.defaultStrategy));
  }

  if (feature.lastUsedInfo) {
    const pInfo = new ProtoFeatureLastUsedInfo();
    pInfo.setFeatureId(feature.lastUsedInfo.featureId);
    pInfo.setVersion(feature.lastUsedInfo.version);
    pInfo.setLastUsedAt(parseInt(feature.lastUsedInfo.lastUsedAt, 10));
    pInfo.setCreatedAt(parseInt(feature.lastUsedInfo.createdAt, 10));
    pInfo.setClientOldestVersion(feature.lastUsedInfo.clientOldestVersion);
    pInfo.setClientLatestVersion(feature.lastUsedInfo.clientLatestVersion);
    f.setLastUsedInfo(pInfo);
  }

  if (feature.prerequisites) {
    f.setPrerequisitesList(
      feature.prerequisites.map((p) => {
        const pp = new ProtoPrerequisite();
        pp.setFeatureId(p.featureId);
        pp.setVariationId(p.variationId);
        return pp;
      }),
    );
  }

  return f;
}

function mapStrategy(s: SDKStrategy): ProtoStrategy {
  const ps = new ProtoStrategy();
  ps.setType(mapStrategyType(s.type));

  if (s.fixedStrategy) {
    const pf = new ProtoFixedStrategy();
    pf.setVariation(s.fixedStrategy.variation);
    ps.setFixedStrategy(pf);
  }

  if (s.rolloutStrategy) {
    const pr = new ProtoRolloutStrategy();
    pr.setVariationsList(
      s.rolloutStrategy.variations.map((v) => {
        const prv = new ProtoRolloutStrategy.Variation();
        prv.setVariation(v.variation);
        prv.setWeight(v.weight);
        return prv;
      }),
    );
    ps.setRolloutStrategy(pr);
  }

  return ps;
}

export function toProtoSegmentUsers(segmentUsers: SegmentUsers): ProtoSegmentUsers {
  const psu = new ProtoSegmentUsers();
  psu.setSegmentId(segmentUsers.segmentId);
  psu.setUpdatedAt(parseInt(segmentUsers.updatedAt, 10));

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
