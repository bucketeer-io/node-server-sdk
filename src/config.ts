import { InternalConfig, resolveSDKVersion, resolveSourceId } from './internalConfig';
import { DefaultLogger, Logger } from './logger';
import { IllegalArgumentError } from './objects/errors';
import { SourceId } from './objects/sourceId';
import { nodeSDKVersion } from './objects/version';

/**
 * @deprecated use BKTConfig instead
 */
interface Config {
  /**
   * API request destination. If you don't know what it should be, ask Bucketeer team.
   */
  host: string;
  /**
   * Optional property. Authentication token when requesting. You can copy from the admin console.
   */
  token: string;
  /**
   * Grouping set of feature flags.
   */
  tag: string;
  /**
   *  Optional property. Interval for registering track events in internal API. Specify in milliseconds.
   */
  pollingIntervalForRegisterEvents?: number;
  logger?: Logger;

  /**
   * Evaluate the end user locally in the SDK instead of on the server.
   * Note: To evaluate the user locally, you must create an API key and select the server-side role.
   */
  enableLocalEvaluation?: boolean;

  /**
   * Sets the polling interval for cache updating. Default: 1 min - specify in milliseconds.
   */
  cachePollingInterval?: number;
}

/**
 * @deprecated use BKTConfig instead
 */
const defaultConfig = {
  host: '',
  port: '443',
  token: '',
  tag: '',
  pollingIntervalForRegisterEvents: 1 * 60 * 1000,
  logger: new DefaultLogger(),

  enableLocalEvaluation: false,
  cachePollingInterval: 1 * 60 * 1000,
};

interface BKTConfig {
  /**
   * API key to use for the SDK.
   * This is used to authenticate requests to the Bucketeer server.
   */
  apiKey: string;
  /**
   * API endpoint to use for the SDK.
   * This is the base URL for all API requests.
   *
   * Supported formats:
   * - Full URL with scheme: 'https://api.example.com' or 'http://localhost:9000'
   *   (scheme will be extracted and used, overriding the `scheme` config if provided)
   * - Bare hostname: 'api.example.com' (will use the `scheme` config, defaults to https)
   *
   * Note: Only http and https schemes are supported.
   */
  apiEndpoint: string;
  /**
   * Feature tag to use for feature flag evaluation.
   * This is used to group feature flags and should match the tag used in the Bucketeer console.
   */
  featureTag: string;
  /**
   * Interval for flushing events to the server. Specify in milliseconds.
   * Default: 30 seconds
   */
  eventsFlushInterval: number;
  /**
   * Maximum number of events to batch per request.
   * Events are automatically sent when the queue reaches this size.
   * Default: 50
   */
  eventsMaxQueueSize: number;

  /**
   * Optional property. Application version.
   * If not provided, '1.0.0' will be used as default.
   */
  appVersion: string;

  /**
   * Optional property. Logger for the SDK.
   * If not provided, DefaultLogger will be used.
   */
  logger: Logger;

  /**
   * Evaluate the end user locally in the SDK instead of on the server.
   * Note: To evaluate the user locally, you must create an API key and select the server-side role.
   */
  enableLocalEvaluation: boolean;

  /**
   * Sets the polling interval for cache updating. Default: 1 min - specify in milliseconds.
   */
  cachePollingInterval: number;

  /**
   * Maximum number of retry attempts for HTTP requests. (Default: 3)
   * Set to 0 to disable retries.
   */
  maxRetries: number;

  /**
   * Initial backoff interval between retries in milliseconds. (Default: 1000)
   * Uses exponential backoff: interval = retryInitialInterval × (retryMultiplier ^ attemptNumber) ±25% jitter.
   */
  retryInitialInterval: number;

  /**
   * Maximum backoff interval between retries in milliseconds. (Default: 10000)
   * The exponential backoff is capped at this value. Set to 0 for no cap.
   */
  retryMaxInterval: number;

  /**
   * Exponential backoff multiplier for retries. (Default: 2.0)
   * Controls how quickly the backoff interval grows between retries.
   * Must be greater than 0.
   */
  retryMultiplier: number;

  /**
   * Optional property. Scheme to use for API requests. (Default: 'https')
   * This is useful for local development when you want to use 'http' instead of 'https'.
   *
   * Note: If the apiEndpoint includes a scheme (e.g., 'https://api.example.com'),
   * the scheme from apiEndpoint will take precedence over this setting.
   */
  scheme?: string;

  // Use wrapperSdkVersion to set the SDK version explicitly.
  // IMPORTANT: This option is intended for internal use only.
  // It should NOT be set by developers directly integrating this SDK.
  // Use this option ONLY when another SDK acts as a proxy and wraps this native SDK.
  // In such cases, set this value to the version of the proxy SDK.
  wrapperSdkVersion?: string;
  // Use wrapperSdkSourceId to set the source ID explicitly.
  // IMPORTANT: This option is intended for internal use only.
  // It should NOT be set by developers directly integrating this SDK.
  // Use this option ONLY when another SDK acts as a proxy and wraps this native SDK.
  // In such cases, set this value to the sourceID of the proxy SDK.
  // The sourceID is used to identify the origin of the request.
  wrapperSdkSourceId?: number;
}

// The minimum flush interval is 10 seconds, while the default flush interval is 30 seconds.
// They are defined separately because the default must not be lower than the enforced minimum.
const MINIMUM_FLUSH_INTERVAL_MILLIS = 10_000; // 10 seconds
const DEFAULT_FLUSH_INTERVAL_MILLIS = 30_000; // 30 seconds
const DEFAULT_MAX_QUEUE_SIZE = 50;
const MINIMUM_POLLING_INTERVAL_MILLIS = 60_000; // 60 seconds
const DEFAULT_POLLING_INTERVAL_MILLIS = 60_000; // 60 seconds
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_RETRY_INITIAL_INTERVAL_MILLIS = 1_000; // 1 second
export const DEFAULT_RETRY_MAX_INTERVAL_MILLIS = 10_000; // 10 seconds
export const DEFAULT_RETRY_MULTIPLIER = 2.0;

const defineBKTConfig = (config: Partial<BKTConfig>): BKTConfig => {
  let baseConfig: BKTConfig = {
    apiKey: config.apiKey ?? '',
    apiEndpoint: config.apiEndpoint ?? '',
    featureTag: config.featureTag ?? '',
    eventsFlushInterval: config.eventsFlushInterval ?? DEFAULT_FLUSH_INTERVAL_MILLIS,
    eventsMaxQueueSize: config.eventsMaxQueueSize ?? DEFAULT_MAX_QUEUE_SIZE,
    appVersion: config.appVersion ?? '1.0.0',
    logger: config.logger ?? new DefaultLogger(),
    enableLocalEvaluation: config.enableLocalEvaluation ?? false,
    cachePollingInterval: config.cachePollingInterval ?? DEFAULT_POLLING_INTERVAL_MILLIS,
    maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
    retryInitialInterval: config.retryInitialInterval ?? DEFAULT_RETRY_INITIAL_INTERVAL_MILLIS,
    retryMaxInterval: config.retryMaxInterval ?? DEFAULT_RETRY_MAX_INTERVAL_MILLIS,
    retryMultiplier: config.retryMultiplier ?? DEFAULT_RETRY_MULTIPLIER,
    scheme: config.scheme ?? 'https',
  };

  // Advanced properties: only included when explicitly set (not undefined)
  // to prevent overriding internal defaults or leaking undefined values
  if (config.wrapperSdkVersion !== undefined) {
    baseConfig.wrapperSdkVersion = config.wrapperSdkVersion;
  }
  if (config.wrapperSdkSourceId !== undefined) {
    baseConfig.wrapperSdkSourceId = config.wrapperSdkSourceId;
  }

  // Validate required fields
  if (!baseConfig.apiKey) {
    throw new IllegalArgumentError('apiKey is required');
  }
  if (!baseConfig.apiEndpoint) {
    throw new IllegalArgumentError('apiEndpoint is required');
  }

  // Validate apiEndpoint format and extract scheme if present
  // If apiEndpoint contains a scheme, extract it and override the scheme config
  if (baseConfig.apiEndpoint.includes('://')) {
    try {
      const url = new URL(baseConfig.apiEndpoint);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new IllegalArgumentError(
          `Invalid scheme in apiEndpoint: ${url.protocol}. Must be http or https`,
        );
      }
      // Extract scheme from URL (remove trailing ':')
      baseConfig.scheme = url.protocol.slice(0, -1);
      // Update apiEndpoint to be just hostname and port (without scheme)
      baseConfig.apiEndpoint = url.host;
    } catch (error) {
      if (error instanceof IllegalArgumentError) {
        throw error;
      }
      throw new IllegalArgumentError(`Invalid apiEndpoint URL: ${baseConfig.apiEndpoint}`);
    }
  }

  // Validate scheme
  if (baseConfig.scheme !== 'http' && baseConfig.scheme !== 'https') {
    throw new IllegalArgumentError(`Invalid scheme: ${baseConfig.scheme}. Must be http or https`);
  }

  if (!baseConfig.appVersion) {
    throw new IllegalArgumentError('appVersion is required');
  }

  // Validate eventsFlushInterval
  //
  // Note: The SDK enforces a deadline of 80% of the flush interval for retry operations.
  // Very short intervals (e.g., <20s) may limit the number of actual retry attempts
  // if requests fail, even when MaxRetries is set to 3. However, failed events are
  // automatically re-queued and will be retried in the next flush cycle.
  if (baseConfig.eventsFlushInterval < MINIMUM_FLUSH_INTERVAL_MILLIS) {
    baseConfig.logger?.warn?.(
      `eventsFlushInterval (${baseConfig.eventsFlushInterval}) is less than the minimum allowed (${MINIMUM_FLUSH_INTERVAL_MILLIS}). Using default value (${DEFAULT_FLUSH_INTERVAL_MILLIS}).`,
    );
    baseConfig.eventsFlushInterval = DEFAULT_FLUSH_INTERVAL_MILLIS;
  }

  // Validate eventsMaxQueueSize
  if (baseConfig.eventsMaxQueueSize <= 0) {
    baseConfig.logger?.warn?.(
      `eventsMaxQueueSize (${baseConfig.eventsMaxQueueSize}) must be greater than 0. Using default value (${DEFAULT_MAX_QUEUE_SIZE}).`,
    );
    baseConfig.eventsMaxQueueSize = DEFAULT_MAX_QUEUE_SIZE;
  }

  // Validate cachePollingInterval
  if (baseConfig.cachePollingInterval < MINIMUM_POLLING_INTERVAL_MILLIS) {
    baseConfig.logger?.warn?.(
      `cachePollingInterval (${baseConfig.cachePollingInterval}) is less than the minimum allowed (${MINIMUM_POLLING_INTERVAL_MILLIS}). Using default value (${DEFAULT_POLLING_INTERVAL_MILLIS}).`,
    );
    baseConfig.cachePollingInterval = DEFAULT_POLLING_INTERVAL_MILLIS;
  }

  // Validate retry configuration
  if (baseConfig.maxRetries < 0) {
    baseConfig.logger?.warn?.(
      `maxRetries (${baseConfig.maxRetries}) must be >= 0. Using default value (${DEFAULT_MAX_RETRIES}).`,
    );
    baseConfig.maxRetries = DEFAULT_MAX_RETRIES;
  }

  if (baseConfig.retryInitialInterval <= 0) {
    baseConfig.logger?.warn?.(
      `retryInitialInterval (${baseConfig.retryInitialInterval}) must be > 0. Using default value (${DEFAULT_RETRY_INITIAL_INTERVAL_MILLIS}).`,
    );
    baseConfig.retryInitialInterval = DEFAULT_RETRY_INITIAL_INTERVAL_MILLIS;
  }

  if (baseConfig.retryMaxInterval < 0) {
    baseConfig.logger?.warn?.(
      `retryMaxInterval (${baseConfig.retryMaxInterval}) must be >= 0. Using default value (${DEFAULT_RETRY_MAX_INTERVAL_MILLIS}).`,
    );
    baseConfig.retryMaxInterval = DEFAULT_RETRY_MAX_INTERVAL_MILLIS;
  }

  if (baseConfig.retryMaxInterval > 0 && baseConfig.retryMaxInterval < baseConfig.retryInitialInterval) {
    const adjusted = Math.max(baseConfig.retryInitialInterval, DEFAULT_RETRY_MAX_INTERVAL_MILLIS);
    baseConfig.logger?.warn?.(
      `retryMaxInterval (${baseConfig.retryMaxInterval}) must be >= retryInitialInterval (${baseConfig.retryInitialInterval}). Adjusting to ${adjusted}.`,
    );
    baseConfig.retryMaxInterval = adjusted;
  }

  if (baseConfig.retryMultiplier <= 0) {
    baseConfig.logger?.warn?.(
      `retryMultiplier (${baseConfig.retryMultiplier}) must be > 0. Using default value (${DEFAULT_RETRY_MULTIPLIER}).`,
    );
    baseConfig.retryMultiplier = DEFAULT_RETRY_MULTIPLIER;
  }

  // Resolve SDK version and sourceId without exposing SourceId to outside
  const sourceId = resolveSourceId(baseConfig);
  const sdkVersion = resolveSDKVersion(baseConfig, sourceId);
  const internalConfig = {
    ...baseConfig,
    sourceId: sourceId,
    sdkVersion: sdkVersion,
  } satisfies InternalConfig;
  return internalConfig;
};

/**
 * Converts deprecated Config interface to BKTConfig interface
 * @param config Deprecated Config object
 * @returns BKTConfig object that is valid for the SDK
 */
const convertConfigToBKTConfig = (config: Config): InternalConfig => {
  return {
    apiKey: config.token, // token -> apiKey
    apiEndpoint: config.host, // host -> apiEndpoint
    featureTag: config.tag, // tag -> featureTag
    eventsFlushInterval: config.pollingIntervalForRegisterEvents ?? DEFAULT_FLUSH_INTERVAL_MILLIS,
    eventsMaxQueueSize: DEFAULT_MAX_QUEUE_SIZE,
    appVersion: '1.0.0', // Default since Config doesn't have appVersion
    logger: config.logger ?? new DefaultLogger(),
    enableLocalEvaluation: config.enableLocalEvaluation ?? false,
    cachePollingInterval: config.cachePollingInterval ?? DEFAULT_POLLING_INTERVAL_MILLIS,
    maxRetries: DEFAULT_MAX_RETRIES,
    retryInitialInterval: DEFAULT_RETRY_INITIAL_INTERVAL_MILLIS,
    retryMaxInterval: DEFAULT_RETRY_MAX_INTERVAL_MILLIS,
    retryMultiplier: DEFAULT_RETRY_MULTIPLIER,
    // Advanced properties
    wrapperSdkVersion: undefined, // Not applicable in Config
    wrapperSdkSourceId: undefined, // Not applicable in Config
    // Resolve sourceId and sdkVersion
    sourceId: SourceId.NODE_SERVER, // Default sourceId
    sdkVersion: nodeSDKVersion, // Default SDK version
  };
};

export { Config, BKTConfig, defaultConfig, defineBKTConfig, convertConfigToBKTConfig };
