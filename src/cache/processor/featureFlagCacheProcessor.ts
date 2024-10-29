import { FeaturesCache } from '../features';
import { Cache } from '../cache';
import { GRPCClient } from '../../grpc/client';
import { ProcessorEventsEmitter } from './processorEvents';
import { createSchedule, removeSchedule } from '../../schedule';
import { Feature } from '@bucketeer/node-evaluation';
import { ApiId } from '../../objects/apiId';

interface FeatureFlagProcessor {
  start(): void;
  stop(): void;
}

type FeatureFlagProcessorOptions = {
  cache: Cache;
  featureFlagCache: FeaturesCache;
  pollingInterval: number;
  grpc: GRPCClient;
  eventEmitter: ProcessorEventsEmitter;
  featureTag: string;
};

function NewFeatureFlagProcessor(options: FeatureFlagProcessorOptions): FeatureFlagProcessor {
  return new DefaultFeatureFlagProcessor(options);
}

const FEATURE_FLAG_CACHE_TTL = 0;
const FEATURE_FLAG_REQUESTED_AT = 'bucketeer_feature_flag_requested_at';
const FEATURE_FLAG_ID = 'bucketeer_feature_flag_id';

class DefaultFeatureFlagProcessor implements FeatureFlagProcessor {
  private featureFlagCache: FeaturesCache;
  private cache: Cache;
  private grpc: GRPCClient;
  private eventEmitter: ProcessorEventsEmitter;
  private pollingScheduleID?: NodeJS.Timeout;
  private pollingInterval: number;
  featureTag: string;

  constructor(options: FeatureFlagProcessorOptions) {
    this.featureFlagCache = options.featureFlagCache;
    this.cache = options.cache;
    this.grpc = options.grpc;
    this.eventEmitter = options.eventEmitter;
    this.pollingInterval = options.pollingInterval;
    this.featureTag = options.featureTag;
  }

  start() {
    this.pollingScheduleID = createSchedule(() => {
      this.runUpdateCache();
    }, this.pollingInterval);
    console.log('pollingScheduleID', this.pollingScheduleID);
  }

  stop() {
    if (this.pollingScheduleID) removeSchedule(this.pollingScheduleID);
  }

  private async runUpdateCache() {
    try {
      await this.updateCache();
    } catch (error) {
      this.pushErrorMetricsEvent(this.internalError(error));
    }
  }

  private async updateCache() {
    const requestedAt = await this.getFeatureFlagRequestedAt();
    const featureFlagsId = await this.getFeatureFlagId();
    const startTime: number = Date.now();
    const featureFlags = await this.grpc.getFeatureFlags({
      requestedAt: requestedAt,
      tag: this.featureTag,
      featureFlagsId: featureFlagsId,
    });
    const latency = (Date.now() - startTime) / 1000;

    this.pushLatencyMetricsEvent(latency);
    this.pushSizeMetricsEvent(featureFlags.serializeBinary().length);

    const forceUpdate = featureFlags.getForceUpdate();
    if (forceUpdate) {
      this.deleteAllAndSaveLocalCache(
        requestedAt,
        featureFlags.getFeatureFlagsId(),
        featureFlags.getFeaturesList(),
      );
    } else {
      this.updateLocalCache(
        requestedAt,
        featureFlags.getFeatureFlagsId(),
        featureFlags.getFeaturesList(),
        featureFlags.getArchivedFeatureFlagIdsList(),
      );
    }
  }

  private internalError(error: any): Error {
    return new Error(`internal error while updating feature flags: ${error}`);
  }

  private async getFeatureFlagRequestedAt(): Promise<number> {
    return this.cache.get(FEATURE_FLAG_REQUESTED_AT) || 0;
  }

  private async getFeatureFlagId(): Promise<string> {
    return this.cache.get(FEATURE_FLAG_ID) || '';
  }

  private async deleteAllAndSaveLocalCache(
    requestedAt: number,
    featureFlagsId: string,
    features: Feature[],
  ) {
    await this.featureFlagCache.deleteAll();
    await this.updateLocalCache(requestedAt, featureFlagsId, features, []);
  }

  private async updateLocalCache(
    requestedAt: number,
    featureFlagsId: string,
    features: Feature[],
    archivedFeatureIds: string[],
  ) {
    archivedFeatureIds.forEach(async (featureId) => {
      await this.featureFlagCache.delete(featureId);
    });
    features.forEach(async (feature) => {
      await this.featureFlagCache.put(feature);
    });
    await this.cache.put(FEATURE_FLAG_ID, featureFlagsId, FEATURE_FLAG_CACHE_TTL);
    await this.cache.put(FEATURE_FLAG_REQUESTED_AT, requestedAt, FEATURE_FLAG_CACHE_TTL);
  }

  async pushLatencyMetricsEvent(latency: number) {
    this.eventEmitter.emit('pushLatencyMetricsEvent', {
      latency: latency,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  }

  async pushErrorMetricsEvent(error: any) {
    this.eventEmitter.emit('error', { error: error, apiId: ApiId.GET_FEATURE_FLAGS });
  }

  async pushSizeMetricsEvent(size: number) {
    this.eventEmitter.emit('pushSizeMetricsEvent', { size: size, apiId: ApiId.GET_FEATURE_FLAGS });
  }
}

export { FeatureFlagProcessor, NewFeatureFlagProcessor, FEATURE_FLAG_CACHE_TTL };
