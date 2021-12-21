import { createUser, UserAsPlainObject } from './objects/User';
import { Event } from './proto/event/client/event_pb';
import { Evaluation } from './proto/feature/evaluation_pb';
import { EventStore } from './stores/EventStore';
import { createSchedule, removeSchedule } from './schedule';
import { GIT_REVISION } from './shared';
import { Client } from './grpc/client';
import {
  createDefaultEvaluationEvent,
  createEvaluationEvent,
  createGetEvaluationLatencyMetricsEvent,
  createGetEvaluationSizeMetricsEvent,
  createGoalEvent,
  createInternalErrorCountMetricsEvent,
  createTimeoutErrorCountMetricsEvent,
} from './objects/Event';
import { lengthInUtf8Bytes } from './utils/byte';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { GetEvaluationResponse } from './proto/gateway/service_pb';
import { Config, defaultConfig } from './config';

export interface BuildInfo {
  readonly GIT_REVISION: string;
}

export { Logger, DefaultLogger } from './logger';

export { UserAsPlainObject } from './objects/User';

export interface Bucketeer {
  getStringVariation(
    user: UserAsPlainObject,
    featureId: string,
    defaultValue: string,
  ): Promise<string>;
  getBoolVariation(
    user: UserAsPlainObject,
    featureId: string,
    defaultValue: boolean,
  ): Promise<boolean>;
  getNumberVariation(
    user: UserAsPlainObject,
    featureId: string,
    defaultValue: number,
  ): Promise<number>;
  getJsonVariation(
    user: UserAsPlainObject,
    featureId: string,
    defaultValue: object,
  ): Promise<object>;
  track(user: UserAsPlainObject, goalId: string, value?: number): void;
  destroy(): void;
  getBuildInfo(): BuildInfo;
}

const COUNT_PER_REGISTER_EVENT = 100;

export function initialize(config: Config): Bucketeer {
  const { host, port, token, tag, pollingIntervalForRegisterEvents, logger } = {
    ...defaultConfig,
    ...config,
  };

  const client = new Client(host, port, token);

  const eventStore = new EventStore();

  function registerEvents(): void {
    if (eventStore.size() >= COUNT_PER_REGISTER_EVENT) {
      callRegisterEvents(eventStore.takeout(COUNT_PER_REGISTER_EVENT));
    }
  }

  function registerAllEvents(): void {
    if (eventStore.size() > 0) {
      callRegisterEvents(eventStore.getAll());
    }
  }

  const registerEventsScheduleID = createSchedule(() => {
    if (eventStore.size() > 0) {
      callRegisterEvents(eventStore.takeout(eventStore.size()));
    }
  }, pollingIntervalForRegisterEvents);

  function callRegisterEvents(events: Array<Event>): void {
    client.registerEvents(events).catch((e) => {
      logger.warn('register events failed', e);
    });
  }

  function saveDefaultEvaluationEvent(user: UserAsPlainObject, featureId: string) {
    eventStore.add(createDefaultEvaluationEvent(tag, createUser(user), featureId));
    registerEvents();
  }

  function saveEvaluationEvent(user: UserAsPlainObject, evaluation: Evaluation) {
    eventStore.add(createEvaluationEvent(tag, createUser(user), evaluation));
    registerEvents();
  }

  function saveGoalEvent(user: UserAsPlainObject, goalId: string, value?: number) {
    eventStore.add(createGoalEvent(tag, goalId, createUser(user), value ? value : 0));
    registerEvents();
  }

  function saveEvaluationMetricsEvent(tag: string, durationMS: number, size: number) {
    saveGetEvaluationLatencyMetricsEvent(tag, durationMS);
    saveGetEvaluationSizeMetricsEvent(tag, size);
  }

  function saveGetEvaluationLatencyMetricsEvent(tag: string, durationMS: number) {
    eventStore.add(createGetEvaluationLatencyMetricsEvent(tag, durationMS));
    registerEvents();
  }

  function saveGetEvaluationSizeMetricsEvent(tag: string, size: number) {
    eventStore.add(createGetEvaluationSizeMetricsEvent(tag, size));
    registerEvents();
  }

  function saveInternalErrorCountMetricsEvent(tag: string) {
    eventStore.add(createInternalErrorCountMetricsEvent(tag));
    registerEvents();
  }

  function saveTimeoutErrorCountMetricsEvent(tag: string) {
    eventStore.add(createTimeoutErrorCountMetricsEvent(tag));
    registerEvents();
  }

  return {
    async getStringVariation(
      user: UserAsPlainObject,
      featureId: string,
      defaultValue: string,
    ): Promise<string> {
      const startTime: number = Date.now();
      const res: GetEvaluationResponse | null = await client
        .getEvaluation(tag, user, featureId)
        .catch((e) => {
          if (e.code === Status.DEADLINE_EXCEEDED) {
            saveTimeoutErrorCountMetricsEvent(tag);
            logger.warn('getEvaluation failed', e);
          } else {
            saveInternalErrorCountMetricsEvent(tag);
            logger.error('getEvaluation failed', e);
          }
          return null;
        });
      const evaluation = res?.getEvaluation();
      if (evaluation == null) {
        saveDefaultEvaluationEvent(user, featureId);
        return defaultValue;
      }
      const durationMS: number = Date.now() - startTime;
      const size = lengthInUtf8Bytes(JSON.stringify(res));
      saveEvaluationEvent(user, evaluation);
      saveEvaluationMetricsEvent(tag, durationMS, size);
      return evaluation.getVariationValue();
    },
    async getBoolVariation(
      user: UserAsPlainObject,
      featureId: string,
      defaultValue: boolean,
    ): Promise<boolean> {
      const valueStr = await this.getStringVariation(user, featureId, '');
      switch (valueStr.toLowerCase()) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return defaultValue;
      }
    },
    async getNumberVariation(
      user: UserAsPlainObject,
      featureId: string,
      defaultValue: number,
    ): Promise<number> {
      const valueStr = await this.getStringVariation(user, featureId, '');
      const value = parseFloat(valueStr);
      if (isNaN(value)) {
        logger.debug('getNumberVariation failed to parseFloat');
        return defaultValue;
      }
      return value;
    },
    async getJsonVariation(
      user: UserAsPlainObject,
      featureId: string,
      defaultValue: object,
    ): Promise<object> {
      const valueStr = await this.getStringVariation(user, featureId, '');
      try {
        return JSON.parse(valueStr);
      } catch (e) {
        logger.debug('getJsonVariation failed to parse', e);
        return defaultValue;
      }
    },
    track(user: UserAsPlainObject, goalId: string, value?: number): void {
      logger.debug('track is called', goalId, value);
      saveGoalEvent(user, goalId, value);
    },
    async destroy(): Promise<void> {
      await registerAllEvents();
      removeSchedule(registerEventsScheduleID);
      logger.info('destroy finished', registerEventsScheduleID);
    },
    getBuildInfo(): BuildInfo {
      return {
        GIT_REVISION,
      };
    },
  };
}
