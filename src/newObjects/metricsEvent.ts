import { createTimestamp } from '../utils/time';
import { Duration, DURATION_NAME } from './duration';
import { createEvent } from './event';
import { SourceId } from './sourceId';

const METRICS_EVENT_NAME = 'bucketeer.event.client.MetricsEvent';
const GET_EVALUATION_LATENCY_METRICS_EVENT_NAME =
  'bucketeer.event.client.GetEvaluationLatencyMetricsEvent';
const GET_EVALUATION_SIZE_METRICS_EVENT_NAME =
  'bucketeer.event.client.GetEvaluationSizeMetricsEvent';
const INTERNAL_ERROR_COUNT_METRICS_EVENT_NAME =
  'bucketeer.event.client.InternalErrorCountMetricsEvent';
const TIMEOUT_ERROR_COUNT_METRICS_EVENT_NAME =
  'bucketeer.event.client.TimeoutErrorCountMetricsEvent';

const version: string = require('../../package.json').version;

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
