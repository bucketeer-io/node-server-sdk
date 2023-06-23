import { createTimestamp } from '../utils/time';
import { ApiId, NodeApiIds } from './apiId';
import { createEvent } from './event';
import { SourceId } from './sourceId';
import { StatusMetricsEvent } from './status';

const METRICS_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.MetricsEvent';
const LATENCY_METRICS_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.LatencyMetricsEvent';
const SIZE_METRICS_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.SizeMetricsEvent';
const INTERNAL_SDK_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.InternalSdkErrorMetricsEvent';
const TIMEOUT_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.TimeoutErrorMetricsEvent';
const NETWORK_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NetworkErrorMetricsEvent';
const UNKNOWN_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.UnknownErrorMetricsEvent';

const version: string = require('../../package.json').version;

export type MetricsEvent = {
  timestamp: number;
  event?: DetailedMetricsEvent | StatusMetricsEvent;
  sourceId: typeof SourceId.NODE_SERVER;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof METRICS_EVENT_NAME;
};

export type DetailedMetricsEvent =
  | TimeoutErrorMetricsEvent
  | InternalSdkErrorMetricsEvent
  | NetworkErrorMetricsEvent
  | SizeMetricsEvent
  | LatencyMetricsEvent
  | UnknownErrorMetricsEvent;

export type TimeoutErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof TIMEOUT_ERROR_METRICS_EVENT_NAME;
};

export type InternalSdkErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof INTERNAL_SDK_ERROR_METRICS_EVENT_NAME;
};

export type NetworkErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof NETWORK_ERROR_METRICS_EVENT_NAME;
};

export type SizeMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  sizeByte: number;
  labels: { [key: string]: string };
  '@type': typeof SIZE_METRICS_EVENT_NAME;
};

export type LatencyMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  latencySecond: number;
  labels: { [key: string]: string };
  '@type': typeof LATENCY_METRICS_EVENT_NAME;
};

export type UnknownErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof UNKNOWN_ERROR_METRICS_EVENT_NAME;
};

export function createSizeMetricsEvent(tag: string, size: number, apiId: NodeApiIds) {
  const getEvaluationSizeMetricsEvent: SizeMetricsEvent = {
    apiId,
    sizeByte: size,
    labels: {
      tag,
    },
    '@type': SIZE_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(getEvaluationSizeMetricsEvent);
  return createEvent(metricsEvent);
}

export function createInternalSdkErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: InternalSdkErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': INTERNAL_SDK_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createTimeoutErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const timeoutErrorMetricsEvent: TimeoutErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': TIMEOUT_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(timeoutErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createMetricsEvent(b: DetailedMetricsEvent | StatusMetricsEvent): MetricsEvent {
  return {
    timestamp: createTimestamp(),
    event: b,
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: version,
    metadata: {},
    '@type': METRICS_EVENT_NAME,
  };
}

export function createLatencyMetricsEvent(tag: string, second: number, apiId: NodeApiIds) {
  const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
    apiId,
    latencySecond: second,
    labels: {
      tag,
    },
    '@type': LATENCY_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(getEvaluationLatencyMetricsEvent);
  return createEvent(metricsEvent);
}

export function createNetworkErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const networkErrorMetricsEvent: NetworkErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': NETWORK_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(networkErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createUnknownErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const unknownErrorMetricsEvent: UnknownErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': UNKNOWN_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(unknownErrorMetricsEvent);
  return createEvent(metricsEvent);
}

function convertMS(ms: number): string {
  return (ms / 1000).toString() + 's';
}
