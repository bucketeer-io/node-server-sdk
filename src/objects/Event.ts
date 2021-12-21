import {
  Event,
  EvaluationEvent,
  GoalEvent,
  MetricsEvent,
  InternalErrorCountMetricsEvent,
  TimeoutErrorCountMetricsEvent,
  GetEvaluationLatencyMetricsEvent,
  GetEvaluationSizeMetricsEvent,
  SourceId,
} from '../proto/event/client/event_pb';
import { Any } from 'google-protobuf/google/protobuf/any_pb';
import { Duration } from 'google-protobuf/google/protobuf/duration_pb';
import { v4 } from 'uuid';
import { createTimestamp } from '../utils/time';
import { Reason } from '../proto/feature/reason_pb';
import { Evaluation, UserEvaluations } from '../proto/feature/evaluation_pb';
import { User } from '../proto/user/user_pb';

const EVALUATION_EVENT_NAME = 'bucketeer.event.client.EvaluationEvent';
const GOAL_EVENT_NAME = 'bucketeer.event.client.GoalEvent';
const METRICS_EVENT_NAME = 'bucketeer.event.client.MetricsEvent';
const GET_EVALUATION_LATENCY_METRICS_EVENT_NAME =
  'bucketeer.event.client.GetEvaluationLatencyMetricsEvent';
const GET_EVALUATION_SIZE_METRICS_EVENT_NAME =
  'bucketeer.event.client.GetEvaluationSizeMetricsEvent';
const INTERNAL_ERROR_COUNT_METRICS_EVENT_NAME =
  'bucketeer.event.client.InternalErrorCountMetricsEvent';
const TIMEOUT_ERROR_COUNT_METRICS_EVENT_NAME =
  'bucketeer.event.client.TimeoutErrorCountMetricsEvent';

export function createGoalEvent(tag: string, goalId: string, user: User, value: number): Event {
  const goalEvent = new GoalEvent();
  goalEvent.setSourceId(SourceId.NODE_SERVER);
  goalEvent.setTag(tag);
  goalEvent.setGoalId(goalId);
  goalEvent.setUserId(user.getId());
  goalEvent.setValue(value);
  goalEvent.setTimestamp(createTimestamp());
  return createEvent(goalEvent.serializeBinary(), GOAL_EVENT_NAME);
}

export function createEvaluationEvent(tag: string, user: User, evaluation: Evaluation): Event {
  const evaluationEvent = new EvaluationEvent();
  evaluationEvent.setSourceId(SourceId.NODE_SERVER);
  evaluationEvent.setTag(tag);
  evaluationEvent.setFeatureId(evaluation.getFeatureId());
  evaluationEvent.setFeatureVersion(evaluation.getFeatureVersion());
  evaluationEvent.setVariationId(evaluation.getVariationId());
  evaluationEvent.setUserId(user.getId());
  evaluationEvent.setUser(user);
  const reason = new Reason();
  if (evaluation.getReason()) {
    const type = evaluation.getReason()?.getType();
    if (type) {
      reason.setType(type);
    }
    evaluationEvent.setReason(reason);
  }
  evaluationEvent.setTimestamp(createTimestamp());
  return createEvent(evaluationEvent.serializeBinary(), EVALUATION_EVENT_NAME);
}

export function createDefaultEvaluationEvent(tag: string, user: User, featureId: string): Event {
  const evaluationEvent = new EvaluationEvent();
  evaluationEvent.setSourceId(SourceId.NODE_SERVER);
  evaluationEvent.setTag(tag);
  evaluationEvent.setFeatureId(featureId);
  evaluationEvent.setUserId(user.getId());
  evaluationEvent.setUser(user);
  const reason = new Reason();
  reason.setType(Reason.Type.CLIENT);
  evaluationEvent.setReason(reason);
  evaluationEvent.setTimestamp(createTimestamp());
  return createEvent(evaluationEvent.serializeBinary(), EVALUATION_EVENT_NAME);
}

export function createGetEvaluationLatencyMetricsEvent(tag: string, durationMS: number) {
  const getEvaluationLatencyMetricsEvent = new GetEvaluationLatencyMetricsEvent();
  getEvaluationLatencyMetricsEvent.getLabelsMap().set('tag', tag);
  getEvaluationLatencyMetricsEvent
    .getLabelsMap()
    .set('state', UserEvaluations.State[UserEvaluations.State.FULL]);
  const duration = new Duration().setNanos(durationMS * 1e6);
  getEvaluationLatencyMetricsEvent.setDuration(duration);
  const metricsEvent = createMetricsEvent(
    getEvaluationLatencyMetricsEvent.serializeBinary(),
    GET_EVALUATION_LATENCY_METRICS_EVENT_NAME,
  );
  return createEvent(metricsEvent.serializeBinary(), METRICS_EVENT_NAME);
}

export function createGetEvaluationSizeMetricsEvent(tag: string, size: number) {
  const getEvaluationSizeMetricsEvent = new GetEvaluationSizeMetricsEvent();
  getEvaluationSizeMetricsEvent.getLabelsMap().set('tag', tag);
  getEvaluationSizeMetricsEvent
    .getLabelsMap()
    .set('state', UserEvaluations.State[UserEvaluations.State.FULL]);
  getEvaluationSizeMetricsEvent.setSizeByte(size);
  const metricsEvent = createMetricsEvent(
    getEvaluationSizeMetricsEvent.serializeBinary(),
    GET_EVALUATION_SIZE_METRICS_EVENT_NAME,
  );
  return createEvent(metricsEvent.serializeBinary(), METRICS_EVENT_NAME);
}

export function createInternalErrorCountMetricsEvent(tag: string) {
  const internalErrorCountMetricsEvent = new InternalErrorCountMetricsEvent();
  internalErrorCountMetricsEvent.setTag(tag);
  const metricsEvent = createMetricsEvent(
    internalErrorCountMetricsEvent.serializeBinary(),
    INTERNAL_ERROR_COUNT_METRICS_EVENT_NAME,
  );
  return createEvent(metricsEvent.serializeBinary(), METRICS_EVENT_NAME);
}

export function createTimeoutErrorCountMetricsEvent(tag: string) {
  const timeoutErrorCountMetricsEvent = new TimeoutErrorCountMetricsEvent();
  timeoutErrorCountMetricsEvent.setTag(tag);
  const metricsEvent = createMetricsEvent(
    timeoutErrorCountMetricsEvent.serializeBinary(),
    TIMEOUT_ERROR_COUNT_METRICS_EVENT_NAME,
  );
  return createEvent(metricsEvent.serializeBinary(), METRICS_EVENT_NAME);
}

function createEvent(b: Uint8Array, name: string) {
  const event = new Event();
  const any = new Any();
  any.pack(b, name);
  event.setEvent(any);
  event.setId(v4());
  return event;
}

function createMetricsEvent(b: Uint8Array, name: string) {
  const event = new MetricsEvent();
  const any = new Any();
  any.pack(b, name);
  event.setEvent(any);
  event.setTimestamp(createTimestamp());
  return event;
}
