import {
  Evaluator,
  Feature,
  SegmentUser,
  SegmentUsers,
  UserEvaluations,
  Reason as ProtoReason,
  getFeatureIDsDependsOn,
} from '@bucketeer/evaluation';
// The Segment message is not re-exported from the package root,
// so it is imported directly from the generated proto module.
import { Segment } from '@bucketeer/evaluation/lib/proto/feature/segment_pb';

import { FeaturesCache } from '../cache/features';
import { SegmentUsersCache } from '../cache/segmentUsers';
import { Evaluation } from '../objects/evaluation';
import { User } from '../objects/user';
import { Reason, ReasonType } from '../objects/reason';
import { NodeEvaluator } from './evaluator';
import { IllegalStateError, InvalidStatusError } from '../objects/errors';
import { toProtoUser } from '../cache/processor/converter';

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
    const feature = await this.getFeatures(featureID);
    const userEvaluations = await this.evaluateFeatures(user, feature);

    const evaluation = this.findEvaluation(userEvaluations, featureID);
    return evaluation;
  }

  private async getFeatures(featureID: string): Promise<Feature> {
    return this.getFeaturesFromCache(featureID).then((feature) => {
      if (feature === null) {
        throw new InvalidStatusError(`Feature not found: ${featureID}`, 404);
      }
      return feature;
    });
  }

  private async getFeaturesFromCache(featureID: string): Promise<Feature | null> {
    return this.featureCache.get(featureID).catch((error) => {
      throw new IllegalStateError(
        `Failed to get feature: ${error instanceof Error ? error.message : String(error)}`,
      );
    });
  }

  private async getSegmentUsers(segmentUserId: string): Promise<SegmentUsers> {
    return this.getSegmentUsersFromCache(segmentUserId).then((segmentUsers) => {
      if (segmentUsers === null) {
        throw new InvalidStatusError(`Segment users not found: ${segmentUserId}`, 404);
      }
      return segmentUsers;
    });
  }

  private async getSegmentUsersFromCache(segmentUserId: string): Promise<SegmentUsers | null> {
    return this.segementUsersCache.get(segmentUserId).catch((error) => {
      throw new IllegalStateError(
        `Failed to get segment users: ${error instanceof Error ? error.message : String(error)}`,
      );
    });
  }

  private async evaluateFeatures(user: User, feature: Feature): Promise<UserEvaluations> {
    try {
      const targetFeatures = await this.getTargetFeatures(feature);
      const evaluator = new Evaluator();
      const fIds = evaluator.listSegmentIDs(feature);
      const segmentUsersMap = new Map<string, SegmentUser[]>();
      const segmentsMap = new Map<string, Segment>();
      for (const fId of fIds) {
        const segmentUsers = await this.getSegmentUsers(fId);
        if (segmentUsers !== null) {
          segmentUsersMap.set(segmentUsers.getSegmentId(), segmentUsers.getUsersList());
          // Rule-based segments: the segment rules are delivered inside the
          // SegmentUsers message. Rebuild the Segment so the evaluator can
          // match users by rules in addition to the included-user list.
          if (segmentUsers.getRulesList().length > 0) {
            const segment = new Segment();
            segment.setId(segmentUsers.getSegmentId());
            segment.setRulesList(segmentUsers.getRulesList());
            segmentsMap.set(segmentUsers.getSegmentId(), segment);
          }
        }
      }

      const protoUser = toProtoUser(user);
      const userEvaluations = await evaluator.evaluateFeatures(
        targetFeatures,
        protoUser,
        segmentUsersMap,
        segmentsMap,
        this.tag,
      );
      return userEvaluations;
    } catch (error) {
      if (error instanceof InvalidStatusError || error instanceof IllegalStateError) {
        throw error;
      }
      throw new IllegalStateError(
        `Failed to evaluate feature: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
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

    throw new InvalidStatusError(`Evaluation not found for feature: ${featureId}`, 404);
  }

  async getTargetFeatures(feature: Feature): Promise<Feature[]> {
    // Check if the flag depends on other flags.
    // If not, we return only the target flag
    const preFlagIDs = getFeatureIDsDependsOn(feature);
    if (preFlagIDs.length === 0) {
      return [feature];
    }
  
    const prerequisiteFeatures = await this.getPrerequisiteFeaturesFromCache(preFlagIDs);
    return [
      feature,
      ...prerequisiteFeatures,
    ];
  }

  private async getPrerequisiteFeaturesFromCache(preFlagIDs: string[]): Promise<Feature[]> {
    const prerequisites: Record<string, Feature> = {};
    for (const preFlagID of preFlagIDs) {
      const preFeature = await this.getFeatures(preFlagID);
      prerequisites[preFlagID] = preFeature
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

export { LocalEvaluator, protoReasonToReason };
