import { FeaturesCache } from '../features';
import { Cache } from '../cache';
import { GRPCClient } from '../../grpc/client';
import { ProcessorEventsEmitter } from '../../processorEventsEmitter';
import { createSchedule, removeSchedule } from '../../schedule';
import { Feature } from '@bucketeer/evaluation';
import { ApiId } from '../../objects/apiId';
import { Clock } from '../../utils/clock';
import { SourceId } from '../../objects/sourceId';

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
  clock: Clock;
  sourceId: SourceId;
  sdkVersion: string;
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
  private clock: Clock;
  featureTag: string;
  sourceId: SourceId;
  sdkVersion: string;

  constructor(options: FeatureFlagProcessorOptions) {
    this.featureFlagCache = options.featureFlagCache;
    this.cache = options.cache;
    this.grpc = options.grpc;
    this.eventEmitter = options.eventEmitter;
    this.pollingInterval = options.pollingInterval;
    this.featureTag = options.featureTag;
    this.clock = options.clock;
    this.sourceId = options.sourceId;
    this.sdkVersion = options.sdkVersion;
  }

  start() {
    // Execute immediately
    this.runUpdateCache();
    this.pollingScheduleID = createSchedule(() => {
      this.runUpdateCache();
    }, this.pollingInterval);
  }

  stop() {
    if (this.pollingScheduleID) removeSchedule(this.pollingScheduleID);
  }

  async runUpdateCache() {
    try {
      await this.updateCache();
    } catch (error) {
      this.pushErrorMetricsEvent(error);
    }
  }

  private async updateCache() {
    const featureFlagsId = await this.getFeatureFlagId();
    const requestedAt = await this.getFeatureFlagRequestedAt();
    const startTime: number = this.clock.getTime();
    const featureFlags = await this.grpc.getFeatureFlags({
      requestedAt: requestedAt,
      tag: this.featureTag,
      featureFlagsId: featureFlagsId,
      sourceId: this.sourceId,
      sdkVersion: this.sdkVersion,
    });

    const endTime = this.clock.getTime();
    const latency = (endTime - startTime) / 1000;

    this.pushLatencyMetricsEvent(latency);
    this.pushSizeMetricsEvent(featureFlags.serializeBinary().length);

    const forceUpdate = featureFlags.getForceUpdate();
    if (forceUpdate) {
      await this.deleteAllAndSaveLocalCache(
        featureFlags.getRequestedAt(),
        featureFlags.getFeatureFlagsId(),
        featureFlags.getFeaturesList(),
      );
    } else {
      await this.updateLocalCache(
        featureFlags.getRequestedAt(),
        featureFlags.getFeatureFlagsId(),
        featureFlags.getFeaturesList(),
        featureFlags.getArchivedFeatureFlagIdsList(),
      );
    }
  }

  private async getFeatureFlagRequestedAt(): Promise<number> {
    const requestedAt = await this.cache.get(FEATURE_FLAG_REQUESTED_AT);
    return requestedAt || 0;
  }

  private async getFeatureFlagId(): Promise<string> {
    const featureFlagId = await this.cache.get(FEATURE_FLAG_ID);
    return featureFlagId || '';
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
    for (const featureId of archivedFeatureIds) {
      await this.featureFlagCache.delete(featureId);
    }
    for (const feature of features) {
      await this.featureFlagCache.put(feature);
    }
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

export {
  FeatureFlagProcessor,
  NewFeatureFlagProcessor,
  DefaultFeatureFlagProcessor,
  FeatureFlagProcessorOptions,
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
  FEATURE_FLAG_REQUESTED_AT,
};
