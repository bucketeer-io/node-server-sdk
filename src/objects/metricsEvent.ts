import { Logger } from '../logger';
import { IllegalArgumentError, IllegalStateError, InvalidStatusError } from '../objects/errors';
import { createTimestamp } from '../utils/time';
import { NodeApiIds } from './apiId';
import { createEvent, Event } from './event';
import { SourceId } from './sourceId';
import {
  StatusMetricsEvent,
  createBadRequestErrorMetricsEvent,
  createClientClosedRequestErrorMetricsEvent,
  createForbiddenErrorMetricsEvent,
  createInternalServerErrorMetricsEvent,
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
  sourceId: SourceId;
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
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof TIMEOUT_ERROR_METRICS_EVENT_NAME;
};

export type InternalSdkErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof INTERNAL_SDK_ERROR_METRICS_EVENT_NAME;
};

export type NetworkErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof NETWORK_ERROR_METRICS_EVENT_NAME;
};

export type SizeMetricsEvent = {
  apiId: NodeApiIds;
  sizeByte: number;
  labels: { [key: string]: string };
  '@type': typeof SIZE_METRICS_EVENT_NAME;
};

export type LatencyMetricsEvent = {
  apiId: NodeApiIds;
  latencySecond: number;
  labels: { [key: string]: string };
  '@type': typeof LATENCY_METRICS_EVENT_NAME;
};

export type UnknownErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof UNKNOWN_ERROR_METRICS_EVENT_NAME;
};

export function createSizeMetricsEvent(
  tag: string,
  size: number,
  apiId: NodeApiIds,
  sourceId: SourceId,
) {
  const getEvaluationSizeMetricsEvent: SizeMetricsEvent = {
    apiId,
    sizeByte: size,
    labels: {
      tag,
    },
    '@type': SIZE_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(getEvaluationSizeMetricsEvent, sourceId);
  return createEvent(metricsEvent);
}

export function createInternalSdkErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
  errorMessage?: string,
) {
  const internalErrorMetricsEvent: InternalSdkErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': INTERNAL_SDK_ERROR_METRICS_EVENT_NAME,
  };
  if (errorMessage && errorMessage.length > 0) {
    internalErrorMetricsEvent.labels.error_message = errorMessage;
  }
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent, sourceId);
  return createEvent(metricsEvent);
}

export function createTimeoutErrorMetricsEvent(tag: string, apiId: NodeApiIds, sourceId: SourceId) {
  const timeoutErrorMetricsEvent: TimeoutErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': TIMEOUT_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(timeoutErrorMetricsEvent, sourceId);
  return createEvent(metricsEvent);
}

export function createMetricsEvent(
  b: SuccessMetricsEvent | ErrorMetricsEvent | StatusMetricsEvent,
  sourceId: SourceId,
): MetricsEvent {
  return {
    timestamp: createTimestamp(),
    event: b,
    sourceId: sourceId,
    sdkVersion: version,
    metadata: {},
    '@type': METRICS_EVENT_NAME,
  };
}

export function createLatencyMetricsEvent(
  tag: string,
  second: number,
  apiId: NodeApiIds,
  sourceId: SourceId,
) {
  const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
    apiId,
    latencySecond: second,
    labels: {
      tag,
    },
    '@type': LATENCY_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(getEvaluationLatencyMetricsEvent, sourceId);
  return createEvent(metricsEvent);
}

export function createNetworkErrorMetricsEvent(tag: string, apiId: NodeApiIds, sourceId: SourceId) {
  const networkErrorMetricsEvent: NetworkErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': NETWORK_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(networkErrorMetricsEvent, sourceId);
  return createEvent(metricsEvent);
}

export function createUnknownErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
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
  const metricsEvent = createMetricsEvent(unknownErrorMetricsEvent, sourceId);
  return createEvent(metricsEvent);
}

function convertMS(ms: number): string {
  return (ms / 1000).toString() + 's';
}

export const toErrorMetricsEvent = (
  e: any,
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
  logger?: Logger,
): Event | null => {
  if (e instanceof IllegalArgumentError || e instanceof IllegalStateError) {
    return createInternalSdkErrorMetricsEvent(tag, apiId, sourceId, e.message);
  }
  if (e instanceof InvalidStatusError) {
    const statusCode = e.code ?? 0;
    switch (true) {
      case statusCode >= 300 && statusCode < 400:
        return createRedirectRequestErrorMetricsEvent(tag, apiId, statusCode, sourceId);
      case statusCode == 400:
        return createBadRequestErrorMetricsEvent(tag, apiId, sourceId);
      case statusCode == 401:
        logger?.error('An unauthorized error occurred. Please check your API Key.');
        return null;
      case statusCode == 403:
        logger?.error('An forbidden error occurred. Please check your API Key.');
        return null;
      case statusCode == 404:
        return createNotFoundErrorMetricsEvent(tag, apiId, sourceId);
      case statusCode == 405:
        return createInternalSdkErrorMetricsEvent(tag, apiId, sourceId, e.message);
      case statusCode == 408:
        return createTimeoutErrorMetricsEvent(tag, apiId, sourceId);
      case statusCode == 413:
        return createPayloadTooLargeErrorMetricsEvent(tag, apiId, sourceId);
      case statusCode == 499:
        return createClientClosedRequestErrorMetricsEvent(tag, apiId, sourceId);
      case statusCode == 500:
        return createInternalServerErrorMetricsEvent(tag, apiId, sourceId);
      case [502, 503, 504].includes(statusCode):
        return createServiceUnavailableErrorMetricsEvent(tag, apiId, sourceId);
      default:
        return createUnknownErrorMetricsEvent(tag, apiId, sourceId, statusCode, e.message);
    }
  }
  if (isNodeError(e)) {
    switch (e.code) {
      case 'ECONNRESET':
        return createTimeoutErrorMetricsEvent(tag, apiId, sourceId);
      case 'EHOSTUNREACH':
      case 'ECONNREFUSED':
        return createNetworkErrorMetricsEvent(tag, apiId, sourceId);
      default:
        return createUnknownErrorMetricsEvent(tag, apiId, sourceId, undefined, e.message);
    }
  }
  return createUnknownErrorMetricsEvent(tag, apiId, sourceId, undefined, String(e));
};

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeUtils.isNativeError(error);
}

export function isErrorMetricsEvent(obj: any, specificErrorType?: string): obj is MetricsEvent {
  if (!isMetricsEvent(obj) || !obj.event) {
    return false;
  }
  // check event type in ErrorMetricsEvent
  if (specificErrorType) {
    return obj.event['@type'] === specificErrorType;
  }

  const errorEventTypes = [
    TIMEOUT_ERROR_METRICS_EVENT_NAME,
    INTERNAL_SDK_ERROR_METRICS_EVENT_NAME,
    NETWORK_ERROR_METRICS_EVENT_NAME,
    UNKNOWN_ERROR_METRICS_EVENT_NAME,
  ];

  return errorEventTypes.includes(obj.event['@type']);
}

export function isMetricsEvent(obj: any): obj is MetricsEvent {
  const isObject = typeof obj === 'object' && obj !== null;
  const hasTimestamp = typeof obj.timestamp === 'number';
  const hasEvent = obj.event !== undefined;
  const hasSourceId = obj.sourceId !== undefined && Object.values(SourceId).includes(obj.sourceId);
  const hasSdkVersion = typeof obj.sdkVersion === 'string';
  const hasMetadata = typeof obj.metadata === 'object' && obj.metadata !== null;
  const hasValidMetadata =
    hasMetadata && Object.values(obj.metadata).every((value) => typeof value === 'string');
  const hasCorrectType = obj['@type'] === METRICS_EVENT_NAME;

  return (
    isObject &&
    hasTimestamp &&
    hasEvent &&
    hasSourceId &&
    hasSdkVersion &&
    hasMetadata &&
    hasValidMetadata &&
    hasCorrectType
  );
}
