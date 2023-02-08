import { v4 } from 'uuid';
import { createTimestamp } from '../utils/time';
import { User } from './User';
import { version } from '../../package.json';

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
const DURATION_NAME = 'type.googleapis.com/google.protobuf.Duration';

export function createGoalEvent(tag: string, goalId: string, user: User, value: number): Event {
  const goalEvent: GoalEvent = {
    tag,
    goalId,
    user,
    value,
    sourceId: SourceId.NODE_SERVER,
    timestamp: createTimestamp(),
    userId: user.id,
    sdkVersion: version,
    metadata: {},
    '@type': GOAL_EVENT_NAME,
  };
  return createEvent(JSON.stringify(goalEvent));
}

export function createEvaluationEvent(tag: string, user: User, evaluation: Evaluation): Event {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    userId: user.id,
    featureId: evaluation.featureId,
    timestamp: createTimestamp(),
    featureVersion: evaluation.featureVersion,
    variationId: evaluation.variationId,
    sourceId: SourceId.NODE_SERVER,
    reason: evaluation.reason,
    sdkVersion: version,
    metadata: {},
    '@type': EVALUATION_EVENT_NAME,
  };
  return createEvent(JSON.stringify(evaluationEvent));
}

export function createDefaultEvaluationEvent(tag: string, user: User, featureId: string): Event {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    timestamp: createTimestamp(),
    featureId,
    featureVersion: 0,
    userId: user.id,
    variationId: '',
    sourceId: SourceId.NODE_SERVER,
    reason: {
      type: ReasonType.CLIENT,
    },
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion: version,
    metadata: {},
  };
  return createEvent(JSON.stringify(evaluationEvent));
}

export function createGetEvaluationLatencyMetricsEvent(tag: string, durationMS: number) {
  const getEvaluationLatencyMetricsEvent: GetEvaluationLatencyMetricsEvent = {
    duration: {
      value: convertMS(durationMS),
      '@type': DURATION_NAME,
    },
    labels: {
      tag,
    },
    '@type': GET_EVALUATION_LATENCY_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(JSON.stringify(getEvaluationLatencyMetricsEvent));
  return createEvent(JSON.stringify(metricsEvent));
}

function convertMS(ms: number): string {
  return (ms / 1000).toString() + 's';
}

export function createGetEvaluationSizeMetricsEvent(tag: string, size: number) {
  const getEvaluationSizeMetricsEvent: GetEvaluationSizeMetricsEvent = {
    sizeByte: size,
    labels: {
      tag,
    },
    '@type': GET_EVALUATION_SIZE_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(JSON.stringify(getEvaluationSizeMetricsEvent));
  return createEvent(JSON.stringify(metricsEvent));
}

export function createInternalErrorCountMetricsEvent(tag: string) {
  const internalErrorCountMetricsEvent: InternalErrorCountMetricsEvent = {
    tag,
    '@type': INTERNAL_ERROR_COUNT_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(JSON.stringify(internalErrorCountMetricsEvent));
  return createEvent(JSON.stringify(metricsEvent));
}

export function createTimeoutErrorCountMetricsEvent(tag: string) {
  const timeoutErrorCountMetricsEvent: TimeoutErrorCountMetricsEvent = {
    tag,
    '@type': TIMEOUT_ERROR_COUNT_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(JSON.stringify(timeoutErrorCountMetricsEvent));
  return createEvent(JSON.stringify(metricsEvent));
}

function createEvent(b: string): Event {
  return {
    id: v4(),
    event: b,
  };
}

function createMetricsEvent(b: string): MetricsEvent {
  return {
    timestamp: createTimestamp(),
    event: b,
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: version,
    metadata: {},
    '@type': METRICS_EVENT_NAME,
  };
}

export type Event = {
  id: string;
  event: string;
};

export type MetricsEvent = {
  timestamp: number;
  event?: string;
  sourceId: typeof SourceId.NODE_SERVER;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof METRICS_EVENT_NAME;
};

export type TimeoutErrorCountMetricsEvent = {
  tag: string;
  '@type': typeof TIMEOUT_ERROR_COUNT_METRICS_EVENT_NAME;
};

export type InternalErrorCountMetricsEvent = {
  tag: string;
  '@type': typeof INTERNAL_ERROR_COUNT_METRICS_EVENT_NAME;
};

export type GetEvaluationSizeMetricsEvent = {
  sizeByte: number;
  labels: { [key: string]: string };
  '@type': typeof GET_EVALUATION_SIZE_METRICS_EVENT_NAME;
};

export type GetEvaluationLatencyMetricsEvent = {
  duration: Duration;
  labels: { [key: string]: string };
  '@type': typeof GET_EVALUATION_LATENCY_METRICS_EVENT_NAME;
};

type Duration = {
  value: string;
  '@type': typeof DURATION_NAME;
};

export type GoalEvent = {
  timestamp: number;
  goalId: string;
  userId: string;
  value: number;
  user?: User;
  tag: string;
  sourceId: typeof SourceId.NODE_SERVER;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof GOAL_EVENT_NAME;
};

export type EvaluationEvent = {
  timestamp: number;
  featureId: string;
  featureVersion: number;
  userId: string;
  variationId: string;
  user?: User;
  reason?: Reason;
  tag: string;
  sourceId: typeof SourceId.NODE_SERVER;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof EVALUATION_EVENT_NAME;
};

export type Reason = {
  type: ReasonType;
  ruleId?: string;
};

enum ReasonType {
  TARGET = 0,
  RULE = 1,
  DEFAULT = 3,
  CLIENT = 4,
  OFF_VARIATION = 5,
  PREREQUISITE = 6,
}

export enum SourceId {
  UNKNOWN = 0,
  ANDROID = 1,
  IOS = 2,
  WEB = 3,
  GOAL_BATCH = 4,
  GO_SERVER = 5,
  NODE_SERVER = 6,
}

export type Evaluation = {
  id: string;
  featureId: string;
  featureVersion: number;
  userId: string;
  variationId: string;
  reason?: Reason;
  variationValue: string;
};
