import { User } from './objects/user';
import { EventStore } from './stores/EventStore';
import { APIClient } from './api/client';
import { Config, defaultConfig, defineBKTConfig } from './config';
import { BKTEvaluationDetails } from './evaluationDetails';
import { BKTValue } from './types';
import { InMemoryCache } from './cache/inMemoryCache';
import { NewFeatureCache } from './cache/features';
import {
  FEATURE_FLAG_CACHE_TTL,
  FeatureFlagProcessor,
  NewFeatureFlagProcessor,
} from './cache/processor/featureFlagCacheProcessor';
import { NewSegmentUsersCache } from './cache/segmentUsers';
import {
  NewSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SegementUsersCacheProcessor,
} from './cache/processor/segmentUsersCacheProcessor';
import { DefaultGRPCClient } from './grpc/client';
import { ProcessorEventsEmitter } from './processorEventsEmitter';
import { Clock } from './utils/clock';
import { LocalEvaluator } from './evaluator/local';
import { BKTClientImpl } from './client';

export interface BuildInfo {
  readonly GIT_REVISION: string;
}

export { Config } from './config';

export { Logger, DefaultLogger } from './logger';

export { User } from './objects/user';

export interface Bucketeer {
  /**
   * @deprecated use stringVariation(featureId: string, defaultValue: string) instead.
   */
  getStringVariation(user: User, featureId: string, defaultValue: string): Promise<string>;

  /**
   * @deprecated use booleanVariation(featureId: string, defaultValue: string) instead.
   */
  getBoolVariation(user: User, featureId: string, defaultValue: boolean): Promise<boolean>;

  /**
   * @deprecated use objectVariation(featureId: string, defaultValue: string) instead.
   */
  getJsonVariation(user: User, featureId: string, defaultValue: object): Promise<object>;

  /**
   * @deprecated use numberVariation(featureId: string, defaultValue: string) instead.
   */
  getNumberVariation(user: User, featureId: string, defaultValue: number): Promise<number>;

  /**
   * booleanVariation returns variation as boolean.
   * If a variation returned by server is not boolean, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not boolean.
   * @returns The variation value returned from server or default value.
   */
  booleanVariation(user: User, featureId: string, defaultValue: boolean): Promise<boolean>;

  booleanVariationDetails(
    user: User,
    featureId: string,
    defaultValue: boolean,
  ): Promise<BKTEvaluationDetails<boolean>>;

  /**
   * stringVariation returns variation as string.
   * If a variation returned by server is not string, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not string.
   * @returns The variation value returned from server or default value.
   */
  stringVariation(user: User, featureId: string, defaultValue: string): Promise<string>;

  stringVariationDetails(
    user: User,
    featureId: string,
    defaultValue: string,
  ): Promise<BKTEvaluationDetails<string>>;

  /**
   * numberVariation returns variation as number.
   * If a variation returned by server is not number, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not number.
   * @returns The variation value returned from server or default value.
   */
  numberVariation(user: User, featureId: string, defaultValue: number): Promise<number>;

  numberVariationDetails(
    user: User,
    featureId: string,
    defaultValue: number,
  ): Promise<BKTEvaluationDetails<number>>;

  /**
   * objectVariation returns variation as json object.
   * If a variation returned by server is not json, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not json.
   * @returns The variation value returned from server or default value.
   */
  objectVariation(user: User, featureId: string, defaultValue: BKTValue): Promise<BKTValue>;

  objectVariationDetails(
    user: User,
    featureId: string,
    defaultValue: BKTValue,
  ): Promise<BKTEvaluationDetails<BKTValue>>;

  /**
   * track records a goal event.
   * @param user User information.
   * @param goalId Goal ID to record.
   * @param value The value that is the additional information that user can add to goal event.
   * @returns The variation value returned from server or default value.
   */
  track(user: User, goalId: string, value?: number): void;
  /**
   * destroy finalizes Bucketeer instance.
   * It sends all event in memory and stop workers.
   * The application should call destroy before the application stops, otherwise remaining events can be lost.
   */
  destroy(): void;
  /**
   * getBuildInfo returns the SDK's build information.
   * @returns The SDK's build information.
   */
  getBuildInfo(): BuildInfo;
}

/**
 * initialize initializes a Bucketeer instance and returns it.
 * @param config Configurations of the SDK.
 * @returns Bucketeer SDK instance.
 */
export function initialize(config: Config): Bucketeer {
  // Merge user-provided config with default config
  // We have intent to deprecate initialize in the future and reafactor the initialization process
  // like other SDKs, so its fine to not add any assertions here.
  const resolvedConfig = defineBKTConfig(config);
  return defaultInitialize(resolvedConfig);
}

function defaultInitialize(resolvedConfig: Config): Bucketeer {
  const apiClient = new APIClient(resolvedConfig.host, resolvedConfig.token);
  const eventStore = new EventStore();
  const eventEmitter = new ProcessorEventsEmitter();
  
  let featureFlagProcessor: FeatureFlagProcessor | null = null;
  let segementUsersCacheProcessor: SegementUsersCacheProcessor | null = null;
  let localEvaluator: LocalEvaluator | null = null;
  if (resolvedConfig.enableLocalEvaluation === true) {
    const grpcClient = new DefaultGRPCClient(resolvedConfig.host, resolvedConfig.token);
    const cache = new InMemoryCache();
    const featureFlagCache = NewFeatureCache({ cache: cache, ttl: FEATURE_FLAG_CACHE_TTL });

    const segementUsersCache = NewSegmentUsersCache({
      cache: cache,
      ttl: SEGEMENT_USERS_CACHE_TTL,
    });

    featureFlagProcessor = NewFeatureFlagProcessor({
      cache: cache,
      featureFlagCache: featureFlagCache,
      pollingInterval: resolvedConfig.cachePollingInterval!,
      grpc: grpcClient,
      eventEmitter: eventEmitter,
      featureTag: resolvedConfig.tag,
      clock: new Clock(),
    });

    segementUsersCacheProcessor = NewSegementUserCacheProcessor({
      cache: cache,
      segmentUsersCache: segementUsersCache,
      pollingInterval: resolvedConfig.cachePollingInterval!,
      grpc: grpcClient,
      eventEmitter: eventEmitter,
      clock: new Clock(),
    });

    localEvaluator = new LocalEvaluator({
      tag: resolvedConfig.tag,
      featuresCache: featureFlagCache,
      segementUsersCache: segementUsersCache,
    });
  }

  const options = {
    apiClient: apiClient,
    eventStore: eventStore,
    localEvaluator: localEvaluator,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    eventEmitter: eventEmitter,
  };

  return new BKTClientImpl(resolvedConfig, options);
}
