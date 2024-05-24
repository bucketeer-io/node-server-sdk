import { InvalidStatusError } from '../api/client';
import { createTimestamp } from '../utils/time';
import { ApiId, NodeApiIds } from './apiId';
import { createEvent, Event } from './event';
import { SourceId } from './sourceId';
import {
  StatusMetricsEvent,
  createBadRequestErrorMetricsEvent,
  createClientClosedRequestErrorMetricsEvent,
  createForbiddenErrorMetricsEvent,
  createNotFoundErrorMetricsEvent,
  createPayloadTooLargeErrorMetricsEvent,
  createRedirectRequestErrorMetricsEvent,
  createServiceUnavailableErrorMetricsEvent,
  createUnauthorizedErrorMetricsEvent,
} from './status';
import typeUtils from 'node:util/types';

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
  event?: SuccessMetricsEvent | ErrorMetricsEvent | StatusMetricsEvent;
  sourceId: typeof SourceId.NODE_SERVER;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof METRICS_EVENT_NAME;
};

export type ErrorMetricsEvent =
  | TimeoutErrorMetricsEvent
  | InternalSdkErrorMetricsEvent
  | NetworkErrorMetricsEvent
  | UnknownErrorMetricsEvent;

export type SuccessMetricsEvent = SizeMetricsEvent | LatencyMetricsEvent;

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

export function createMetricsEvent(
  b: SuccessMetricsEvent | ErrorMetricsEvent | StatusMetricsEvent,
): MetricsEvent {
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

export function createUnknownErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  statusCode?: number,
  errorMessage?: string,
) {
  const unknownErrorMetricsEvent: UnknownErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': UNKNOWN_ERROR_METRICS_EVENT_NAME,
  };
  if (statusCode !== undefined) {
    unknownErrorMetricsEvent.labels.response_code = statusCode.toString();
  }
  if (errorMessage !== undefined && errorMessage.length > 0) {
    unknownErrorMetricsEvent.labels.error_message = errorMessage;
  }
  const metricsEvent = createMetricsEvent(unknownErrorMetricsEvent);
  return createEvent(metricsEvent);
}

function convertMS(ms: number): string {
  return (ms / 1000).toString() + 's';
}

export const toErrorMetricsEvent = (e: any, tag: string, apiId: NodeApiIds): Event => {
  if (e instanceof InvalidStatusError) {
    const statusCode = e.code ?? 0;
    switch (true) {
      case statusCode >= 300 && statusCode < 400:
        return createRedirectRequestErrorMetricsEvent(tag, apiId, statusCode);
      case statusCode == 400:
        return createBadRequestErrorMetricsEvent(tag, apiId);
      case statusCode == 401:
        return createUnauthorizedErrorMetricsEvent(tag, apiId);
      case statusCode == 403:
        return createForbiddenErrorMetricsEvent(tag, apiId);
      case statusCode == 404:
        return createNotFoundErrorMetricsEvent(tag, apiId);
      case statusCode == 405:
        return createInternalSdkErrorMetricsEvent(tag, apiId);
      case statusCode == 408:
        return createTimeoutErrorMetricsEvent(tag, apiId);
      case statusCode == 413:
        return createPayloadTooLargeErrorMetricsEvent(tag, apiId);
      case statusCode == 499:
        return createClientClosedRequestErrorMetricsEvent(tag, apiId);
      case statusCode == 500:
        return createInternalSdkErrorMetricsEvent(tag, apiId);
      case [502, 503, 504].includes(statusCode):
        return createServiceUnavailableErrorMetricsEvent(tag, apiId);
      default:
        return createUnknownErrorMetricsEvent(tag, apiId, statusCode, e.message);
    }
  }
  if (isNodeError(e)) {
    switch (e.code) {
      case 'ECONNRESET':
        return createTimeoutErrorMetricsEvent(tag, apiId);
      case 'EHOSTUNREACH':
      case 'ECONNREFUSED':
        return createNetworkErrorMetricsEvent(tag, apiId);
      default:
        return createUnknownErrorMetricsEvent(tag, apiId, undefined, e.message);
    }
  }
  return createUnknownErrorMetricsEvent(tag, apiId, undefined, e.message);
};

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeUtils.isNativeError(error);
}
