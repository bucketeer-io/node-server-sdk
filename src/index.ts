import { tapMaybe } from 'option-t/lib/Maybe/tap';
import { Nullable } from 'option-t/lib/Nullable/Nullable';
import { tapNullable } from 'option-t/lib/Nullable/tap';
import { mapOrForNullable } from 'option-t/lib/Nullable/mapOr';
import { unwrapOrFromUndefinable } from 'option-t/lib/Undefinable/unwrapOr';
import { isErr } from 'option-t/lib/PlainResult/Result';
import { createRegisterEventsAPI } from './api/registerEvents';
import { FetchLike, setFetch } from './api/fetch';
import { UserAsPlainObject } from './objects/User';
import { Evaluation } from './objects/Evaluation';
import { EvaluationEvent } from './objects/EvaluationEvent';
import { GoalEvent } from './objects/GoalEvent';
import { MetricsEvent } from './objects/MetricsEvent';
import { EvaluationAsPlainObject } from './objects/Evaluation';
import {
  GetEvaluationLatencyMetricsEvent,
  USER_EVALUATION_STATE_FULL,
} from './objects/GetEvaluationLatencyMetricsEvent';
import { GetEvaluationSizeMetricsEvent } from './objects/GetEvaluationSizeMetricsEvent';
import { InternalErrorCountMetricsEvent } from './objects/InternalErrorCountMetricsEvent';
import { TimeoutErrorCountMetricsEvent } from './objects/TimeoutErrorCountMetricsEvent';
import { Reason, ReasonType } from './objects/Reason';
import { EventStore } from './stores/EventStore';
import { createSchedule, removeSchedule } from './schedule';
import { Host, Token, Tag, GIT_REVISION } from './shared';
import { SourceId } from './objects/SourceId';
import { createGetEvaluationAPI } from './api/getEvaluation';

export interface Config {
  host: Host;
  token: Token;
  tag: Tag;
  fetch: FetchLike;
  pollingIntervalForRegisterEvents: number;
}

export interface BuildInfo {
  readonly GIT_REVISION: string;
}

export { FetchLike, FetchRequestLike, FetchResponseLike } from './api/fetch';

export { UserAsPlainObject } from './objects/User';

export interface Bucketeer {
  getStringVariation(
    user: UserAsPlainObject,
    featureId: string,
    defaultValue: string,
  ): Promise<string>;
  track(user: UserAsPlainObject, goalId: string, value?: number): void;
  destroy(): void;
  getBuildInfo(): BuildInfo;
}

const COUNT_PER_REGISTER_EVENT = 100;

const SECOND_AS_MILLISEC = 1000;

function createTimestamp(): number {
  const millisec = Date.now();
  // It is necessary for validation at backend.
  const sec = Math.floor(millisec / SECOND_AS_MILLISEC);
  return sec;
}

function convertMS(ms: number): string {
  return (ms / 1000).toString() + 's';
}

function lengthInUtf8Bytes(str: string): number {
  return unescape(encodeURIComponent(str)).length;
}

export function initialize(config: Config): Bucketeer {
  const { host, token, tag, fetch, pollingIntervalForRegisterEvents } = config;
  setFetch(fetch);

  const _getEvaluation = createGetEvaluationAPI(host, token);
  const _registerEvents = createRegisterEventsAPI(host, token);

  const eventStore = new EventStore();

  function registerEvents(): void {
    if (eventStore.size() >= COUNT_PER_REGISTER_EVENT) {
      _registerEvents(eventStore.takeout(COUNT_PER_REGISTER_EVENT));
    }
  }
  function registerAllEvents(): void {
    _registerEvents(eventStore.getAll());
  }
  const registerEventsScheduleID = createSchedule(() => {
    if (eventStore.size() > 0) {
      _registerEvents(eventStore.takeout(eventStore.size()));
    }
  }, pollingIntervalForRegisterEvents);

  function saveDefaultEvaluationEvent(user: UserAsPlainObject, featureId: string) {
    const evaluationEvent = new EvaluationEvent({
      sourceId: SourceId.NODE_SERVER,
      tag: tag,
      featureId: featureId,
      featureVersion: 0,
      userId: user.id,
      user: user,
      variationId: '',
      reason: { type: ReasonType.CLIENT },
      timestamp: createTimestamp(),
    });
    eventStore.add(evaluationEvent);
    registerEvents();
  }

  function saveEvaluationEvent(user: UserAsPlainObject, evaluation: Evaluation) {
    const evaluationEvent = new EvaluationEvent({
      sourceId: SourceId.NODE_SERVER,
      tag: tag,
      featureId: evaluation.featureId,
      featureVersion: evaluation.featureVersion,
      userId: user.id,
      user: user,
      variationId: evaluation.variationId,
      reason: evaluation.reason.toPlainObject(),
      timestamp: createTimestamp(),
    });
    eventStore.add(evaluationEvent);
    registerEvents();
  }

  function saveEvaluationMetricsEvent(tag: string, durationMS: number, size: number) {
    const labels: { [key: string]: string } = {};
    labels['tag'] = tag;
    labels['state'] = USER_EVALUATION_STATE_FULL;
    const getEvaluationLatencyMetricsEvent: MetricsEvent = new MetricsEvent({
      event: new GetEvaluationLatencyMetricsEvent({
        labels: labels,
        duration: convertMS(durationMS),
      }).toPlainObject(),
      timestamp: createTimestamp(),
    });
    eventStore.add(getEvaluationLatencyMetricsEvent);
    const getEvaluationSizeMetricsEvent: MetricsEvent = new MetricsEvent({
      event: new GetEvaluationSizeMetricsEvent({
        labels: labels,
        sizeByte: size,
      }).toPlainObject(),
      timestamp: createTimestamp(),
    });
    eventStore.add(getEvaluationSizeMetricsEvent);
    registerEvents();
  }

  function saveInternalErrorCountMetricsEvent(tag: string) {
    const internalErrorCountMetricsEvent: MetricsEvent = new MetricsEvent({
      event: new InternalErrorCountMetricsEvent({
        tag: tag,
      }).toPlainObject(),
      timestamp: createTimestamp(),
    });
    eventStore.add(internalErrorCountMetricsEvent);
    registerEvents();
  }

  function saveTimeoutErrorCountMetricsEvent(tag: string) {
    const timeoutErrorCountMetricsEvent: MetricsEvent = new MetricsEvent({
      event: new TimeoutErrorCountMetricsEvent({
        tag: tag,
      }).toPlainObject(),
      timestamp: createTimestamp(),
    });
    eventStore.add(timeoutErrorCountMetricsEvent);
    registerEvents();
  }

  return {
    async getStringVariation(
      user: UserAsPlainObject,
      featureId: string,
      defaultValue: string,
    ): Promise<string> {
      const startTime: number = Date.now();
      const res = await _getEvaluation(tag, user, featureId);
      const durationMS: number = Date.now() - startTime;
      const size = lengthInUtf8Bytes(JSON.stringify(res));
      if (isErr(res)) {
        // TODO: Error handling
        saveDefaultEvaluationEvent(user, featureId);
        if(res.err) {
          saveInternalErrorCountMetricsEvent(tag);
        }
        return defaultValue;
      }
      saveEvaluationEvent(user, res.val.evaluation);
      saveEvaluationMetricsEvent(tag, durationMS, size);
      return res.val.evaluation.variationValue;
    },
    track(user: UserAsPlainObject, goalId: string, value?: number): void {
      const timestamp = createTimestamp();
      const goalEvent = new GoalEvent({
        sourceId: SourceId.NODE_SERVER,
        tag: tag,
        goalId,
        userId: user.id,
        value: unwrapOrFromUndefinable(value, 0),
        timestamp,
      });
      eventStore.add(goalEvent);
      registerEvents();
    },
    async destroy(): Promise<void> {
      await registerAllEvents();
      removeSchedule(registerEventsScheduleID);
    },
    getBuildInfo(): BuildInfo {
      return {
        GIT_REVISION,
      };
    },
  };
}
