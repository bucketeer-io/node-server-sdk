import { User } from './objects/user';
import { EventStore } from './stores/EventStore';
import { createSchedule, removeSchedule } from './schedule';
import { GIT_REVISION } from './shared';
import { APIClient } from './api/client';
import { Config, defaultConfig } from './config';
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

export interface BuildInfo {
  readonly GIT_REVISION: string;
}

export { Config } from './config';

export { Logger, DefaultLogger } from './logger';

export { User } from './objects/user';

export interface Bucketeer {
  /**
   * getStringVariation returns variation as string.
   * If a variation returned by server is not string, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not string.
   * @returns The variation value returned from server or default value.
   */
  getStringVariation(user: User, featureId: string, defaultValue: string): Promise<string>;
  /**
   * getBoolVariation returns variation as boolean.
   * If a variation returned by server is not boolean, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not boolean.
   * @returns The variation value returned from server or default value.
   */
  getBoolVariation(user: User, featureId: string, defaultValue: boolean): Promise<boolean>;
  /**
   * getNumberVariation returns variation as number.
   * If a variation returned by server is not number, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not number.
   * @returns The variation value returned from server or default value.
   */
  getNumberVariation(user: User, featureId: string, defaultValue: number): Promise<number>;
  /**
   * getJsonVariation returns variation as json object.
   * If a variation returned by server is not json, defaultValue is retured.
   * @param user User information.
   * @param featureId Feature flag ID to use.
   * @param defaultValue The variation value that is retured if SDK fails to fetch the variation or the variation is not json.
   * @returns The variation value returned from server or default value.
   */
  getJsonVariation(user: User, featureId: string, defaultValue: object): Promise<object>;
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

const COUNT_PER_REGISTER_EVENT = 100;

/**
 * initialize initializes a Bucketeer instance and returns it.
 * @param config Configurations of the SDK.
 * @returns Bucketeer SDK instance.
 */
export function initialize(config: Config): Bucketeer {
  return new BKTClientImpl(config);
}

export class BKTClientImpl implements Bucketeer {
  apiClient: APIClient;
  eventStore: EventStore;
  config: Config;
  registerEventsScheduleID: NodeJS.Timeout;

  constructor(config: Config) {
    this.config = {
      ...defaultConfig,
      ...config,
    };

    this.apiClient = new APIClient(this.config.host, this.config.token);
    this.eventStore = new EventStore();
    this.registerEventsScheduleID = createSchedule(() => {
      if (this.eventStore.size() > 0) {
        this.callRegisterEvents(this.eventStore.takeout(this.eventStore.size()));
      }
    }, this.config.pollingIntervalForRegisterEvents!);
  }

  registerEvents(): void {
    if (this.eventStore.size() >= COUNT_PER_REGISTER_EVENT) {
      this.callRegisterEvents(this.eventStore.takeout(COUNT_PER_REGISTER_EVENT));
    }
  }

  registerAllEvents(): void {
    if (this.eventStore.size() > 0) {
      this.callRegisterEvents(this.eventStore.getAll());
    }
  }

  callRegisterEvents(events: Array<Event>): void {
    this.apiClient.registerEvents(events).catch((e) => {
      this.saveErrorMetricsEvent(this.config.tag, e, ApiId.REGISTER_EVENTS);
      this.config.logger?.warn('register events failed', e);
    });
  }

  saveDefaultEvaluationEvent(user: User, featureId: string) {
    this.eventStore.add(createDefaultEvaluationEvent(this.config.tag, user, featureId));
    this.registerEvents();
  }

  saveEvaluationEvent(user: User, evaluation: Evaluation) {
    this.eventStore.add(createEvaluationEvent(this.config.tag, user, evaluation));
    this.registerEvents();
  }

  saveGoalEvent(user: User, goalId: string, value?: number) {
    this.eventStore.add(createGoalEvent(this.config.tag, goalId, user, value ? value : 0));
    this.registerEvents();
  }

  saveEvaluationMetricsEvent(tag: string, second: number, size: number) {
    this.saveLatencyMetricsEvent(tag, second, ApiId.GET_EVALUATION);
    this.saveSizeMetricsEvent(tag, size, ApiId.GET_EVALUATION);
  }

  saveLatencyMetricsEvent(tag: string, second: number, apiId: NodeApiIds) {
    this.eventStore.add(createLatencyMetricsEvent(tag, second, apiId));
    this.registerEvents();
  }

  saveSizeMetricsEvent(tag: string, size: number, apiId: NodeApiIds) {
    this.eventStore.add(createSizeMetricsEvent(tag, size, apiId));
    this.registerEvents();
  }

  saveErrorMetricsEvent(tag: string, e: any, apiId: NodeApiIds) {
    const event = toErrorMetricsEvent(e, tag, apiId);
    this.eventStore.add(event);
    this.registerEvents();
  }

  async getStringVariation(user: User, featureId: string, defaultValue: string): Promise<string> {
    const startTime: number = Date.now();
    let res: GetEvaluationResponse;
    let size: number;
    try {
      [res, size] = await this.apiClient.getEvaluation(this.config.tag, user, featureId);
    } catch (error) {
      this.saveErrorMetricsEvent(this.config.tag, error, ApiId.GET_EVALUATION);
      this.saveDefaultEvaluationEvent(user, featureId);
      return defaultValue;
    }
    const evaluation = res?.evaluation;
    if (evaluation == null) {
      this.saveDefaultEvaluationEvent(user, featureId);
      return defaultValue;
    }
    const second = (Date.now() - startTime) / 1000;
    this.saveEvaluationEvent(user, evaluation);
    this.saveEvaluationMetricsEvent(this.config.tag, second, size);
    return evaluation.variationValue;
  }

  async getBoolVariation(user: User, featureId: string, defaultValue: boolean): Promise<boolean> {
    const valueStr = await this.getStringVariation(user, featureId, '');
    switch (valueStr.toLowerCase()) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return defaultValue;
    }
  }

  async getNumberVariation(user: User, featureId: string, defaultValue: number): Promise<number> {
    const valueStr = await this.getStringVariation(user, featureId, '');
    const value = parseFloat(valueStr);
    if (isNaN(value)) {
      this.config.logger?.debug('getNumberVariation failed to parseFloat');
      return defaultValue;
    }
    return value;
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
    this.config.logger?.info('destroy finished', this.registerEventsScheduleID);
  }

  getBuildInfo(): BuildInfo {
    return {
      GIT_REVISION,
    };
  }
}
