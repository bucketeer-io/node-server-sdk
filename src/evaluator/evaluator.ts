import {
  createUser,
  Evaluator,
  Feature,
  SegmentUser,
} from '@bucketeer/node-evaluation';

import { FeaturesCache } from '../cache/features';
import { SegmentUsersCache } from '../cache/segementUsers';
import { Evaluation } from '../objects/evaluation';
import { User } from '../objects/user';
import { UserEvaluations } from '@bucketeer/node-evaluation/lib/proto/feature/evaluation_pb';

interface NodeEvaluator {
  evaluate(user: User, featureID: string): Promise<Evaluation>;
}

class LocalEvaluator implements NodeEvaluator {
  private tag: string;
  private featureCache: FeaturesCache;
  private segementUsersCache: SegmentUsersCache;

  constructor(tag: string, featureCache: FeaturesCache, segementUsersCache: SegmentUsersCache) {
    this.tag = tag;
    this.segementUsersCache = segementUsersCache;
    this.featureCache = featureCache;
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
    fIds.forEach(async (fId) => {
      const segmentUser = await this.segementUsersCache.get(fId);
      if (segmentUser !== null) {
        segmentUsersMap.set(segmentUser.getSegmentId(), segmentUser.getUsersList());
      }
    });

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

export { LocalEvaluator, NodeEvaluator };
