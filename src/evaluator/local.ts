import {
  createUser,
  Evaluator,
  Feature,
  SegmentUser,
  UserEvaluations,
  Reason as ProtoReason,
} from '@bucketeer/evaluation';

import { FeaturesCache } from '../cache/features';
import { SegmentUsersCache } from '../cache/segmentUsers';
import { Evaluation } from '../objects/evaluation';
import { User } from '../objects/user';
import { Reason, ReasonType } from '../objects/reason';
import { NodeEvaluator } from './evaluator';

class LocalEvaluator implements NodeEvaluator {
  private tag: string;
  private featureCache: FeaturesCache;
  private segementUsersCache: SegmentUsersCache;

  constructor(options: {
    tag: string;
    featuresCache: FeaturesCache;
    segementUsersCache: SegmentUsersCache;
  }) {
    this.tag = options.tag;
    this.segementUsersCache = options.segementUsersCache;
    this.featureCache = options.featuresCache;
  }

  async evaluate(user: User, featureID: string): Promise<Evaluation> {
    // Get the target feature
    const feature = await this.featureCache.get(featureID);
    if (feature === null) {
      throw new Error('Feature not found');
    }
    const targetFeatures = await this.getTargetFeatures(feature);
    const evaluator = new Evaluator();
    const fIds = evaluator.listSegmentIDs(feature);
    const segmentUsersMap = new Map<string, SegmentUser[]>();
    for (const fId of fIds) {
      const segmentUser = await this.segementUsersCache.get(fId);
      if (segmentUser !== null) {
      segmentUsersMap.set(segmentUser.getSegmentId(), segmentUser.getUsersList());
      }
    }

    const protoUser = createUser(user.id, user.data);
    const userEvaluations = await evaluator.evaluateFeatures(
      targetFeatures,
      protoUser,
      segmentUsersMap,
      this.tag,
    );

    const evaluation = this.findEvaluation(userEvaluations, featureID);
    return evaluation;
  }

  findEvaluation(userEvaluations: UserEvaluations, featureId: String): Evaluation {
    for (const evaluation of userEvaluations.getEvaluationsList()) {
      if (evaluation.getFeatureId() === featureId) {
        return {
          id: evaluation.getId(),
          featureId: evaluation.getFeatureId(),
          featureVersion: evaluation.getFeatureVersion(),
          userId: evaluation.getUserId(),
          variationId: evaluation.getVariationId(),
          variationName: evaluation.getVariationName(),
          variationValue: evaluation.getVariationValue(),
          reason: protoReasonToReason(evaluation.getReason()),
        };
      }
    }

    throw new Error('Evaluation not found');
  }

  async getTargetFeatures(feature: Feature): Promise<Feature[]> {
    const targetFeatures: Feature[] = [feature];
    if (feature.getPrerequisitesList().length === 0) {
      return targetFeatures;
    }
    const prerequisiteFeatures = await this.getPrerequisiteFeatures(feature);
    return targetFeatures.concat(prerequisiteFeatures);
  }

  async getPrerequisiteFeatures(feature: Feature): Promise<Feature[]> {
    const prerequisites: Record<string, Feature> = {};
    const queue: Feature[] = [feature];

    while (queue.length > 0) {
      const f = queue.shift();
      if (!f) continue;

      for (const p of f.getPrerequisitesList()) {
        const preFeature = await this.featureCache.get(p.getFeatureId());
        if (preFeature !== null) {
          prerequisites[p.getFeatureId()] = preFeature;
          queue.push(preFeature);
        }
      }
    }

    return Object.values(prerequisites);
  }
}

function protoReasonToReason(protoReason: ProtoReason | undefined): Reason {
  if (protoReason === undefined) {
    return {
      type: 'DEFAULT',
    };
  }
  return {
    type: protoReasonTypeToReasonType(protoReason.getType()),
    ruleId: protoReason.getRuleId(),
  };
}

function protoReasonTypeToReasonType(protoReasonType: number): ReasonType {
  switch (protoReasonType) {
    case ProtoReason.Type.TARGET:
      return 'TARGET';
    case ProtoReason.Type.RULE:
      return 'RULE';
    case ProtoReason.Type.DEFAULT:
      return 'DEFAULT';
    case ProtoReason.Type.CLIENT:
      return 'CLIENT';
    case ProtoReason.Type.OFF_VARIATION:
      return 'OFF_VARIATION';
    case ProtoReason.Type.PREREQUISITE:
      return 'PREREQUISITE';
    default:
      return 'DEFAULT';
  }
}

export { LocalEvaluator };
