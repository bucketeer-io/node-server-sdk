import { FeaturesCache } from '../features';
import { HoldoutGroupsCache } from '../holdoutGroups';
import { Cache } from '../cache';
import { APIClient } from '../../api/client';
import { ProcessorEventsEmitter } from '../../processorEventsEmitter';
import { createSchedule, removeSchedule } from '../../schedule';
import { Feature } from '../../objects/feature';
import { ApiId } from '../../objects/apiId';
import { Clock } from '../../utils/clock';
import { SourceId } from '../../objects/sourceId';
import { toEvaluatorHoldoutGroups, toProtoFeature } from './converter';
import { PollController as PollAbortController, isOperationAbortedError, isDeadlineExceededError } from '../../utils/pollController';
import { DeadlineExceededError } from '../../objects/errors';
import { HoldoutGroup } from '@bucketeer/evaluation';

interface FeatureFlagProcessor {
  start(): Promise<void>;
  stop(): Promise<void>;
}

type FeatureFlagProcessorOptions = {
  cache: Cache;
  featureFlagCache: FeaturesCache;
  holdoutGroupsCache: HoldoutGroupsCache;
  pollingInterval: number;
  apiClient: Pick<APIClient, 'getFeatureFlags'>;
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
  private holdoutGroupsCache: HoldoutGroupsCache;
  private cache: Cache;
  private apiClient: Pick<APIClient, 'getFeatureFlags'>;
  private eventEmitter: ProcessorEventsEmitter;
  private pollingScheduleID?: NodeJS.Timeout;
  private pollingInterval: number;
  private clock: Clock;
  private pollController = new PollAbortController();
  private stopped = false;

  featureTag: string;
  sourceId: SourceId;
  sdkVersion: string;

  constructor(options: FeatureFlagProcessorOptions) {
    this.featureFlagCache = options.featureFlagCache;
    this.holdoutGroupsCache = options.holdoutGroupsCache;
    this.cache = options.cache;
    this.apiClient = options.apiClient;
    this.eventEmitter = options.eventEmitter;
    this.pollingInterval = options.pollingInterval;
    this.featureTag = options.featureTag;
    this.clock = options.clock;
    this.sourceId = options.sourceId;
    this.sdkVersion = options.sdkVersion;
  }

  async start() {
    this.stopped = false;
    // Execute immediately
    try {
      await this.getFeatureFlags();
    } catch (e) {
      this.pushErrorMetricsEvent(e);
      throw e;
    } finally {
      if (!this.stopped) {
        this.pollingScheduleID = createSchedule(() => {
          this.runUpdateCache();
        }, this.pollingInterval);
      }
    }
  }

  async stop() {
    this.stopped = true;
    if (this.pollingScheduleID) {
      removeSchedule(this.pollingScheduleID);
      this.pollingScheduleID = undefined;
    }
    this.pollController.abort();
  }

  getPollingScheduleID(): NodeJS.Timeout | undefined {
    return this.pollingScheduleID;
  }

  async runUpdateCache() {
    try {
      await this.getFeatureFlags();
    } catch (error) {
      if (isDeadlineExceededError(error)) {
        if (!this.stopped) {
          this.pushErrorMetricsEvent(new DeadlineExceededError(this.pollingInterval, 'poll timed out'));
        }
        return;
      }
      if (isOperationAbortedError(error)) return;
      this.pushErrorMetricsEvent(error);
    }
  }

  private async getFeatureFlags() {
    const signal = this.pollController.createSignal(this.pollingInterval);
    const featureFlagsId = await this.getFeatureFlagId();
    const requestedAt = await this.getFeatureFlagRequestedAt();
    const startMark = this.clock.latencyStart();
    const [featureFlags, size] = await this.apiClient.getFeatureFlags(
      this.featureTag,
      featureFlagsId,
      requestedAt,
      this.sourceId,
      this.sdkVersion,
      signal,
    );

    const latency = this.clock.latencySecondsSince(startMark);

    this.pushLatencyMetricsEvent(latency);
    this.pushSizeMetricsEvent(size);

    const responseRequestedAt = Number(featureFlags.requestedAt) || 0;
    // Every response carries the full list of serving holdout groups, also
    // when the flag diff is empty. The cached list is replaced each time, and
    // cleared when the list is empty or the backend does not send the field.
    const holdoutGroups = toEvaluatorHoldoutGroups(featureFlags.holdoutGroups);
    if (featureFlags.forceUpdate) {
      await this.deleteAllAndSaveLocalCache(
        responseRequestedAt,
        featureFlags.featureFlagsId,
        featureFlags.features,
        holdoutGroups,
      );
    } else {
      await this.updateLocalCache(
        responseRequestedAt,
        featureFlags.featureFlagsId,
        featureFlags.features,
        featureFlags.archivedFeatureFlagIds,
        holdoutGroups,
      );
    }
  }

  private async getFeatureFlagRequestedAt(): Promise<number> {
    const requestedAt = await this.cache.get(FEATURE_FLAG_REQUESTED_AT);
    return Number(requestedAt) || 0;
  }

  private async getFeatureFlagId(): Promise<string> {
    const featureFlagId = await this.cache.get(FEATURE_FLAG_ID);
    return featureFlagId || '';
  }

  private async deleteAllAndSaveLocalCache(
    requestedAt: number,
    featureFlagsId: string,
    features: Feature[],
    holdoutGroups: HoldoutGroup[],
  ) {
    await this.featureFlagCache.deleteAll();
    await this.updateLocalCache(requestedAt, featureFlagsId, features, [], holdoutGroups);
  }

  private async updateLocalCache(
    requestedAt: number,
    featureFlagsId: string,
    features: Feature[],
    archivedFeatureIds: string[],
    holdoutGroups: HoldoutGroup[],
  ) {
    for (const featureId of archivedFeatureIds) {
      await this.featureFlagCache.delete(featureId);
    }
    for (const feature of features) {
      await this.featureFlagCache.put(toProtoFeature(feature));
    }
    // featureFlagsId covers the flags and the holdout groups, so it is stored
    // only after both are in the cache.
    await this.holdoutGroupsCache.put(holdoutGroups);
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
