import { User } from './objects/user';
import { EventStore } from './stores/EventStore';
import { createSchedule, removeSchedule } from './schedule';
import { GIT_REVISION } from './shared';
import { APIClient } from './api/client';
import { createDefaultEvaluationEvent, createEvaluationEvent } from './objects/evaluationEvent';
import { createGoalEvent } from './objects/goalEvent';
import {
  createLatencyMetricsEvent,
  createSizeMetricsEvent,
  toErrorMetricsEvent,
} from './objects/metricsEvent';
import { Evaluation } from './objects/evaluation';
import { Event } from './objects/event';
import { GetEvaluationResponse } from './objects/response';
import { ApiId, NodeApiIds } from './objects/apiId';
import { BKTEvaluationDetails, newDefaultBKTEvaluationDetails } from './evaluationDetails';
import { BKTValue } from './types';
import {
  defaultStringToTypeConverter,
  stringToBoolConverter,
  stringToNumberConverter,
  stringToObjectConverter,
  StringToTypeConverter,
} from './converter';
import { FeatureFlagProcessor } from './cache/processor/featureFlagCacheProcessor';
import { SegementUsersCacheProcessor } from './cache/processor/segmentUsersCacheProcessor';
import { ProcessorEventsEmitter } from './processorEventsEmitter';
import { NodeEvaluator } from './evaluator/evaluator';
import { Bucketeer, BuildInfo } from '.';
import { IllegalStateError, TimeoutError, toBKTError } from './objects/errors';
import { assertGetEvaluationRequest } from './assert';
import { InternalConfig } from './internalConfig';

// Default timeout for graceful shutdown in milliseconds (30 seconds)
// For high-traffic applications with large event queues, consider increasing this value
const DEFAULT_DESTROY_TIMEOUT_MILLIS = 30000;

export class BKTClientImpl implements Bucketeer {
  apiClient: APIClient;
  eventStore: EventStore;
  config: InternalConfig;
  registerEventsScheduleID: NodeJS.Timeout;

  eventEmitter: ProcessorEventsEmitter;
  featureFlagProcessor: FeatureFlagProcessor | null = null;
  segementUsersCacheProcessor: SegementUsersCacheProcessor | null = null;
  localEvaluator: NodeEvaluator | null = null;

  initializationAsync: Promise<any[]> | undefined;

  /**
   * Indicates whether the client is in the process of shutting down.
   * This flag is used to prevent infinite loops during error metric event saves,
   * especially when errors occur while saving events during shutdown.
   */
  private isShuttingDown = false;

  /**
   * Indicates whether the client has been destroyed.
   * Used to ensure destroy() is idempotent.
   */
  private isDestroyed = false;

  constructor(
    config: InternalConfig,
    options: {
      apiClient: APIClient;
      eventStore: EventStore;
      localEvaluator: NodeEvaluator | null;
      featureFlagProcessor: FeatureFlagProcessor | null;
      segementUsersCacheProcessor: SegementUsersCacheProcessor | null;
      eventEmitter: ProcessorEventsEmitter;
    },
  ) {
    this.config = config;
    this.apiClient = options.apiClient;
    this.eventStore = options.eventStore;
    this.registerEventsScheduleID = createSchedule(() => {
      // Flush events in batches to avoid exceeding gRPC message size limits
      while (this.eventStore.size() > 0) {
        const batchSize = Math.min(this.config.eventsMaxQueueSize, this.eventStore.size());
        this.callRegisterEvents(this.eventStore.takeout(batchSize));
      }
    }, this.config.eventsFlushInterval!);

    this.eventEmitter = options.eventEmitter;

    if (this.config.enableLocalEvaluation === true) {
      if (
        !options.featureFlagProcessor ||
        !options.segementUsersCacheProcessor ||
        !options.localEvaluator
      ) {
        // For catching early initialization errors on the development phase
        // This should never happen in production
        throw new IllegalStateError('Cache processors or LocalEvaluator are not provided');
      }
      this.featureFlagProcessor = options.featureFlagProcessor!;
      this.segementUsersCacheProcessor = options.segementUsersCacheProcessor!;
      this.localEvaluator = options.localEvaluator;

      this.initializationAsync = Promise.all(
        [this.featureFlagProcessor.start(), this.segementUsersCacheProcessor.start()]
          // Default handle errors here to wait for all promises to settle
          // This will prevent unhandled promise rejection
          .map((p) => p.catch((e) => e)),
      );
    }

    const featureTag = this.config.featureTag;
    this.eventEmitter.on('error', ({ error, apiId }) => {
      this.saveErrorMetricsEvent(featureTag, error, apiId);
    });

    this.eventEmitter.on('pushDefaultEvaluationEvent', ({ user, featureId }) => {
      this.saveDefaultEvaluationEvent(user, featureId);
    });

    this.eventEmitter.on('pushLatencyMetricsEvent', ({ latency, apiId }) => {
      this.saveLatencyMetricsEvent(featureTag, latency, apiId);
    });

    this.eventEmitter.on('pushSizeMetricsEvent', ({ size, apiId }) => {
      this.saveSizeMetricsEvent(featureTag, size, apiId);
    });

    this.eventEmitter.on('pushEvaluationEvent', ({ user, evaluation }) => {
      this.saveEvaluationEvent(user, evaluation);
    });
  }

  async waitForInitialization(options: { timeout: number }): Promise<void> {
    if (this.config.enableLocalEvaluation !== true) {
      return;
    }

    if (!this.initializationAsync) {
      throw new IllegalStateError('Initialization promise is not set');
    }

    let results: any[] = [];
    const timeout = options.timeout;
    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new TimeoutError(timeout, `Initialization timeout after ${timeout} ms`));
      }, timeout);
    });

    try {
      results = await Promise.race([this.initializationAsync, timeoutPromise]);
    } catch (e) {
      results = [e];
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    for (const result of results) {
      if (result instanceof Error) {
        const e = toBKTError(result, { timeout: options.timeout });
        throw e;
      }
    }
  }

  async stringVariation(user: User, featureId: string, defaultValue: string): Promise<string> {
    return (await this.stringVariationDetails(user, featureId, defaultValue)).variationValue;
  }

  async booleanVariationDetails(
    user: User,
    featureId: string,
    defaultValue: boolean,
  ): Promise<BKTEvaluationDetails<boolean>> {
    return this.getVariationDetails(user, featureId, defaultValue, stringToBoolConverter);
  }

  async booleanVariation(user: User, featureId: string, defaultValue: boolean): Promise<boolean> {
    return (await this.booleanVariationDetails(user, featureId, defaultValue)).variationValue;
  }

  async stringVariationDetails(
    user: User,
    featureId: string,
    defaultValue: string,
  ): Promise<BKTEvaluationDetails<string>> {
    return this.getVariationDetails(user, featureId, defaultValue, defaultStringToTypeConverter);
  }

  async numberVariation(user: User, featureId: string, defaultValue: number): Promise<number> {
    return (await this.numberVariationDetails(user, featureId, defaultValue)).variationValue;
  }

  async numberVariationDetails(
    user: User,
    featureId: string,
    defaultValue: number,
  ): Promise<BKTEvaluationDetails<number>> {
    return this.getVariationDetails(user, featureId, defaultValue, stringToNumberConverter);
  }

  async objectVariation(user: User, featureId: string, defaultValue: BKTValue): Promise<BKTValue> {
    return (await this.objectVariationDetails(user, featureId, defaultValue)).variationValue;
  }

  async objectVariationDetails(
    user: User,
    featureId: string,
    defaultValue: BKTValue,
  ): Promise<BKTEvaluationDetails<BKTValue>> {
    return this.getVariationDetails(user, featureId, defaultValue, stringToObjectConverter);
  }

  private registerEvents(): void {
    if (this.eventStore.size() >= this.config.eventsMaxQueueSize) {
      this.callRegisterEvents(this.eventStore.takeout(this.config.eventsMaxQueueSize));
    }
  }

  private callRegisterEvents(events: Array<Event>): void {
    this.apiClient
      .registerEvents(events, this.config.sourceId, this.config.sdkVersion)
      .catch((e) => {
        this.saveErrorMetricsEvent(this.config.featureTag, e, ApiId.REGISTER_EVENTS);
        this.config.logger?.warn('register events failed', e);
      });
  }

  /**
   * Flush all remaining events in the event store in batches.
   * This method waits for the events to be sent before resolving.
   * Events are sent in batches of eventsMaxQueueSize to avoid
   * exceeding gRPC message size limits (default 2MB).
   *
   * Note: During shutdown, if a batch fails to send, those events are lost.
   * This is by design to prevent infinite loops when the server is down or
   * returning errors. For normal operation (non-shutdown), events are retried
   * via the scheduled flush mechanism.
   *
   * @returns Promise that resolves when all events are flushed
   */
  private async flushAllEvents(): Promise<void> {
    const totalEvents = this.eventStore.size();
    if (totalEvents === 0) {
      return;
    }

    const totalBatches = Math.ceil(totalEvents / this.config.eventsMaxQueueSize);
    this.config.logger?.info(
      `[EventFlusher] Starting to flush ${totalEvents} events in ` +
        `${totalBatches} batch(es) of ${this.config.eventsMaxQueueSize}...`,
    );

    let flushedCount = 0;
    let failedCount = 0;
    let batchNumber = 0;

    // Flush events in batches to avoid exceeding gRPC message size limits
    while (this.eventStore.size() > 0) {
      batchNumber++;
      const batchSize = Math.min(this.config.eventsMaxQueueSize, this.eventStore.size());
      const eventsToFlush = this.eventStore.takeout(batchSize);

      try {
        await this.apiClient.registerEvents(
          eventsToFlush,
          this.config.sourceId,
          this.config.sdkVersion,
        );
        flushedCount += eventsToFlush.length;
        this.config.logger?.debug(
          `[EventFlusher] Flushed batch ${batchNumber}/${totalBatches}: ` +
            `${eventsToFlush.length} events (${flushedCount}/${totalEvents} total)`,
        );
      } catch (e) {
        failedCount += eventsToFlush.length;
        this.saveErrorMetricsEvent(this.config.featureTag, e, ApiId.REGISTER_EVENTS);
        this.config.logger?.warn(
          `[EventFlusher] Failed to flush batch ${batchNumber}/${totalBatches}: ` +
            `${eventsToFlush.length} events`,
          e,
        );
        // Continue flushing remaining batches even if one fails
      }
    }

    if (failedCount > 0) {
      this.config.logger?.warn(
        `[EventFlusher] Shutdown flush completed: ${flushedCount} succeeded, ` +
          `${failedCount} failed out of ${totalEvents} total`,
      );
    } else {
      this.config.logger?.info(
        `[EventFlusher] Successfully flushed all ${flushedCount} events during shutdown`,
      );
    }
  }

  private saveDefaultEvaluationEvent(user: User, featureId: string) {
    this.eventStore.add(
      createDefaultEvaluationEvent(
        this.config.featureTag,
        user,
        featureId,
        this.config.sourceId,
        this.config.sdkVersion,
      ),
    );
    this.registerEvents();
  }

  private saveEvaluationEvent(user: User, evaluation: Evaluation) {
    this.eventStore.add(
      createEvaluationEvent(
        this.config.featureTag,
        user,
        evaluation,
        this.config.sourceId,
        this.config.sdkVersion,
      ),
    );
    this.registerEvents();
  }

  private saveGoalEvent(user: User, goalId: string, value?: number) {
    this.eventStore.add(
      createGoalEvent(
        this.config.featureTag,
        goalId,
        user,
        value ? value : 0,
        this.config.sourceId,
        this.config.sdkVersion,
      ),
    );
    this.registerEvents();
  }

  private saveLatencyMetricsEvent(tag: string, second: number, apiId: NodeApiIds) {
    this.eventStore.add(
      createLatencyMetricsEvent(tag, second, apiId, this.config.sourceId, this.config.sdkVersion),
    );
    this.registerEvents();
  }

  private saveSizeMetricsEvent(tag: string, size: number, apiId: NodeApiIds) {
    this.eventStore.add(
      createSizeMetricsEvent(tag, size, apiId, this.config.sourceId, this.config.sdkVersion),
    );
    this.registerEvents();
  }

  private saveErrorMetricsEvent(tag: string, e: any, apiId: NodeApiIds) {
    // Don't save error metrics events during shutdown to avoid infinite loops
    if (this.isShuttingDown) {
      return;
    }

    const event = toErrorMetricsEvent(
      e,
      tag,
      apiId,
      this.config.sourceId,
      this.config.sdkVersion,
      this.config.logger,
    );
    if (event) {
      this.eventStore.add(event);
      this.registerEvents();
    }
  }

  async getEvaluation(user: User, featureId: string): Promise<Evaluation | null> {
    if (this.config.enableLocalEvaluation === true) {
      return this.getEvaluationLocally(user, featureId);
    }
    return this.getEvaluationRemotely(user, featureId);
  }

  private async getEvaluationRemotely(user: User, featureId: string): Promise<Evaluation | null> {
    const startTime: number = Date.now();
    let res: GetEvaluationResponse;
    let size: number;
    try {
      [res, size] = await this.apiClient.getEvaluation(
        this.config.featureTag,
        user,
        featureId,
        this.config.sourceId,
        this.config.sdkVersion,
      );
      const second = (Date.now() - startTime) / 1000;
      this.eventEmitter.emit('pushLatencyMetricsEvent', {
        latency: second,
        apiId: ApiId.GET_EVALUATION,
      });
      this.eventEmitter.emit('pushSizeMetricsEvent', {
        size: size,
        apiId: ApiId.GET_EVALUATION,
      });

      const evaluation = res?.evaluation;
      if (evaluation == null) {
        throw Error('Fail to get evaluation. Reason: null response.');
      }
      return evaluation;
    } catch (error) {
      this.eventEmitter.emit('error', {
        error: error,
        apiId: ApiId.GET_EVALUATION,
      });
    }

    return null;
  }

  private async getEvaluationLocally(user: User, featureId: string): Promise<Evaluation | null> {
    const startTime: number = Date.now();
    try {
      if (this.localEvaluator) {
        let evaluation = await this.localEvaluator.evaluate(user, featureId);

        const second = (Date.now() - startTime) / 1000;
        // don't log size of the local evaluation because it will log from
        // the feature flag processor
        this.eventEmitter.emit('pushLatencyMetricsEvent', {
          latency: second,
          apiId: ApiId.SDK_GET_VARIATION,
        });

        return evaluation;
      } else {
        throw new IllegalStateError('LocalEvaluator is not initialized');
      }
    } catch (error) {
      this.eventEmitter.emit('error', {
        error: error,
        apiId: ApiId.SDK_GET_VARIATION,
      });
    }

    return null;
  }

  private async getVariationDetails<T extends BKTValue>(
    user: User,
    featureId: string,
    defaultValue: T,
    typeConverter: StringToTypeConverter<T>,
  ): Promise<BKTEvaluationDetails<T>> {
    try {
      assertGetEvaluationRequest(user, featureId);
    } catch (error) {
      this.config.logger?.error('getVariationDetails failed', error);
      return newDefaultBKTEvaluationDetails(
        user && user.id ? user.id : '',
        featureId ?? '',
        defaultValue,
        'DEFAULT',
      );
    }

    const evaluation = await this.getEvaluation(user, featureId);
    const variationValue = evaluation?.variationValue;

    // Handle conversion based on the type of T
    let result: T | null = null;

    if (variationValue !== undefined && variationValue !== null) {
      try {
        result = typeConverter(variationValue);
      } catch (err) {
        result = null;
        this.eventEmitter.emit('error', {
          error: err,
          apiId: ApiId.SDK_GET_VARIATION,
        });

        this.config.logger?.error(
          `getVariationDetails failed to parse: ${variationValue} using: ` +
            `${typeof typeConverter} with error: ${err}`,
        );
      }
    }

    try {
      if (evaluation !== null && result !== null) {
        this.eventEmitter.emit('pushEvaluationEvent', {
          user: user,
          evaluation: evaluation,
        });
        return {
          featureId: evaluation.featureId,
          featureVersion: evaluation.featureVersion,
          userId: evaluation.userId,
          variationId: evaluation.variationId,
          variationName: evaluation.variationName,
          variationValue: result,
          reason: evaluation.reason?.type || 'DEFAULT',
        } satisfies BKTEvaluationDetails<T>;
      }
    } catch (error) {
      this.eventEmitter.emit('error', {
        error: error,
        apiId: ApiId.SDK_GET_VARIATION,
      });
      this.config.logger?.error('getVariationDetails failed to save event', error);
    }

    this.eventEmitter.emit('pushDefaultEvaluationEvent', { user, featureId });
    return newDefaultBKTEvaluationDetails(user.id, featureId, defaultValue);
  }

  async getStringVariation(user: User, featureId: string, defaultValue: string): Promise<string> {
    return this.stringVariation(user, featureId, defaultValue);
  }

  async getBoolVariation(user: User, featureId: string, defaultValue: boolean): Promise<boolean> {
    return this.booleanVariation(user, featureId, defaultValue);
  }

  async getNumberVariation(user: User, featureId: string, defaultValue: number): Promise<number> {
    return this.numberVariation(user, featureId, defaultValue);
  }

  async getJsonVariation(user: User, featureId: string, defaultValue: object): Promise<object> {
    const valueStr = await this.getStringVariation(user, featureId, '');
    try {
      return JSON.parse(valueStr);
    } catch (e) {
      this.config.logger?.debug('getJsonVariation failed to parse', e);
      return defaultValue;
    }
  }

  track(user: User, goalId: string, value?: number): void {
    this.config.logger?.debug('track is called', goalId, value);
    this.saveGoalEvent(user, goalId, value);
  }

  /**
   * Gracefully shuts down the SDK by:
   * 1. Stopping the scheduled event flush
   * 2. Flushing all remaining events to the server
   * 3. Stopping all background processors
   * 4. Closing the event emitter
   *
   * This method should be called before your application exits to ensure
   * no events are lost.
   *
   * @param options Optional configuration for shutdown behavior
   * @param options.timeout Maximum time in milliseconds to wait for shutdown to complete.
   *                         Default is 30000ms (30 seconds). For high-traffic applications
   *                         with large event queues, consider increasing this value.
   * @throws {TimeoutError} If shutdown doesn't complete within the specified timeout
   */
  async destroy(options?: { timeout?: number }): Promise<void> {
    if (this.isDestroyed) {
      this.config.logger?.debug('[Client] Already destroyed, skipping...');
      return;
    }

    this.isDestroyed = true;
    this.isShuttingDown = true;

    const timeout = options?.timeout ?? DEFAULT_DESTROY_TIMEOUT_MILLIS;
    let timeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new TimeoutError(timeout, `Shutdown timeout after ${timeout}ms`));
      }, timeout);
    });

    const destroyPromise = this._doDestroy();

    try {
      await Promise.race([destroyPromise, timeoutPromise]);
    } catch (error) {
      this.config.logger?.error('[Client] Shutdown failed or timed out', error);
      throw error;
    } finally {
      // Always clear the timeout to prevent hanging
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Internal implementation of destroy logic.
   * Separated to allow timeout wrapping.
   */
  private async _doDestroy(): Promise<void> {
    this.config.logger?.info('[Client] Starting graceful shutdown...');

    // Stop the scheduled flush to prevent new flush attempts
    removeSchedule(this.registerEventsScheduleID);
    this.config.logger?.debug('[Client] Stopped scheduled event flush');

    // Flush all remaining events synchronously
    await this.flushAllEvents();

    // Stop all background processors
    if (this.featureFlagProcessor) {
      await this.featureFlagProcessor.stop();
      this.config.logger?.debug('[Client] Stopped feature flag processor');
    }

    if (this.segementUsersCacheProcessor) {
      await this.segementUsersCacheProcessor.stop();
      this.config.logger?.debug('[Client] Stopped segment users cache processor');
    }

    // Close the event emitter
    this.eventEmitter.close();
    this.config.logger?.debug('[Client] Closed event emitter');

    this.config.logger?.info('[Client] Graceful shutdown completed');
  }

  getBuildInfo(): BuildInfo {
    return {
      GIT_REVISION,
    };
  }
}
