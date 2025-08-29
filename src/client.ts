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
import { IllegalStateError, toBKTError } from './objects/errors';
import { assertGetEvaluationRequest } from './assert';
import { InternalConfig } from './internalConfig';

const COUNT_PER_REGISTER_EVENT = 100;

export class BKTClientImpl implements Bucketeer {
  apiClient: APIClient;
  eventStore: EventStore;
  config: InternalConfig;
  registerEventsScheduleID: NodeJS.Timeout;

  eventEmitter: ProcessorEventsEmitter;
  featureFlagProcessor: FeatureFlagProcessor | null = null;
  segementUsersCacheProcessor: SegementUsersCacheProcessor | null = null;
  localEvaluator: NodeEvaluator | null = null;

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
      if (this.eventStore.size() > 0) {
        this.callRegisterEvents(this.eventStore.takeout(this.eventStore.size()));
      }
    }, this.config.eventsFlushInterval!);

    this.eventEmitter = options.eventEmitter;

    if (this.config.enableLocalEvaluation === true) {
      this.featureFlagProcessor = options.featureFlagProcessor;
      this.segementUsersCacheProcessor = options.segementUsersCacheProcessor;
      this.localEvaluator = options.localEvaluator;

      this.featureFlagProcessor?.start();
      this.segementUsersCacheProcessor?.start();
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
    if (this.featureFlagProcessor === null || this.segementUsersCacheProcessor === null) {
      throw new IllegalStateError('Cache processors are not initialized');
    }

    // Keep compatibility with older versions below ES2020, we use Promise.all with catch.
    // Note: This code can be replaced with Promise.allSettled in the future.
    const results = await Promise.all(
      [
        this.featureFlagProcessor.waitForInitialization({ timeout: options.timeout }),
        this.segementUsersCacheProcessor.waitForInitialization({ timeout: options.timeout }),
      ].map((p) => p.catch((e) => e)),
    );

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
    if (this.eventStore.size() >= COUNT_PER_REGISTER_EVENT) {
      this.callRegisterEvents(this.eventStore.takeout(COUNT_PER_REGISTER_EVENT));
    }
  }

  private registerAllEvents(): void {
    if (this.eventStore.size() > 0) {
      this.callRegisterEvents(this.eventStore.getAll());
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
      this.eventEmitter.emit('pushSizeMetricsEvent', { size: size, apiId: ApiId.GET_EVALUATION });

      const evaluation = res?.evaluation;
      if (evaluation == null) {
        throw Error('Fail to get evaluation. Reason: null response.');
      }
      return evaluation;
    } catch (error) {
      this.eventEmitter.emit('error', { error: error, apiId: ApiId.GET_EVALUATION });
    }

    return null;
  }

  private async getEvaluationLocally(user: User, featureId: string): Promise<Evaluation | null> {
    const startTime: number = Date.now();
    try {
      if (this.localEvaluator) {
        let evaluation = await this.localEvaluator.evaluate(user, featureId);

        const second = (Date.now() - startTime) / 1000;
        // don't log size of the local evaluation because it will log from the feature flag processor
        this.eventEmitter.emit('pushLatencyMetricsEvent', {
          latency: second,
          apiId: ApiId.SDK_GET_VARIATION,
        });

        return evaluation;
      } else {
        throw new IllegalStateError('LocalEvaluator is not initialized');
      }
    } catch (error) {
      this.eventEmitter.emit('error', { error: error, apiId: ApiId.SDK_GET_VARIATION });
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
        this.eventEmitter.emit('error', { error: err, apiId: ApiId.SDK_GET_VARIATION });

        this.config.logger?.error(
          `getVariationDetails failed to parse: ${variationValue} using: ${typeof typeConverter} with error: ${err}`,
        );
      }
    }

    try {
      if (evaluation !== null && result !== null) {
        this.eventEmitter.emit('pushEvaluationEvent', { user: user, evaluation: evaluation });
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
      this.eventEmitter.emit('error', { error: error, apiId: ApiId.SDK_GET_VARIATION });
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

  async destroy(): Promise<void> {
    this.registerAllEvents();
    removeSchedule(this.registerEventsScheduleID);
    this.eventEmitter.close();
    this.featureFlagProcessor?.stop();
    this.segementUsersCacheProcessor?.stop();
    this.config.logger?.info('destroy finished');
  }

  getBuildInfo(): BuildInfo {
    return {
      GIT_REVISION,
    };
  }
}
