import { Logger } from '../logger';
import {
  BKTBaseError,
  BadRequestError,
  ClientClosedRequestError,
  ForbiddenError,
  IllegalArgumentError,
  IllegalStateError,
  InternalServerError,
  InvalidHttpMethodError,
  NetworkError,
  NotFoundError,
  PayloadTooLargeError,
  RedirectRequestError,
  ServiceUnavailableError,
  TimeoutError,
  UnauthorizedError,
  UnknownError,
} from '../objects/errors';
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

//TODO: missing tests
export function createSizeMetricsEvent(
  tag: string,
  size: number,
  apiId: NodeApiIds,
  sourceId: SourceId,
  sdkVersion: string,
) {
  const getEvaluationSizeMetricsEvent: SizeMetricsEvent = {
    apiId,
    sizeByte: size,
    labels: {
      tag,
    },
    '@type': SIZE_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(getEvaluationSizeMetricsEvent, sourceId, sdkVersion);
  return createEvent(metricsEvent);
}

export function createInternalSdkErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
  sdkVersion: string,
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
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent, sourceId, sdkVersion);
  return createEvent(metricsEvent);
}

export function createTimeoutErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
  sdkVersion: string,
) {
  const timeoutErrorMetricsEvent: TimeoutErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': TIMEOUT_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(timeoutErrorMetricsEvent, sourceId, sdkVersion);
  return createEvent(metricsEvent);
}

export function createMetricsEvent(
  b: SuccessMetricsEvent | ErrorMetricsEvent | StatusMetricsEvent,
  sourceId: SourceId,
  sdkVersion: string,
): MetricsEvent {
  return {
    timestamp: createTimestamp(),
    event: b,
    sourceId: sourceId,
    sdkVersion: sdkVersion,
    metadata: {},
    '@type': METRICS_EVENT_NAME,
  };
}

//TODO: missing tests
export function createLatencyMetricsEvent(
  tag: string,
  second: number,
  apiId: NodeApiIds,
  sourceId: SourceId,
  sdkVersion: string,
) {
  const getEvaluationLatencyMetricsEvent: LatencyMetricsEvent = {
    apiId,
    latencySecond: second,
    labels: {
      tag,
    },
    '@type': LATENCY_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(getEvaluationLatencyMetricsEvent, sourceId, sdkVersion);
  return createEvent(metricsEvent);
}

export function createNetworkErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
  sdkVersion: string,
) {
  const networkErrorMetricsEvent: NetworkErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': NETWORK_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(networkErrorMetricsEvent, sourceId, sdkVersion);
  return createEvent(metricsEvent);
}

export function createUnknownErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
  sdkVersion: string,
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
  const metricsEvent = createMetricsEvent(unknownErrorMetricsEvent, sourceId, sdkVersion);
  return createEvent(metricsEvent);
}

export const toErrorMetricsEvent = (
  e: BKTBaseError,
  tag: string,
  apiId: NodeApiIds,
  sourceId: SourceId,
  sdkVersion: string,
  logger?: Logger,
): Event | null => {
  if (e instanceof TimeoutError) {
    return createTimeoutErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  if (e instanceof IllegalArgumentError || e instanceof IllegalStateError) {
    return createInternalSdkErrorMetricsEvent(tag, apiId, sourceId, sdkVersion, e.message);
  }
  if (e instanceof RedirectRequestError) {
    return createRedirectRequestErrorMetricsEvent(tag, apiId, e.statusCode, sourceId, sdkVersion);
  }
  if (e instanceof BadRequestError) {
    return createBadRequestErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  if (e instanceof UnauthorizedError) {
    logger?.error('An unauthorized error occurred. Please check your API Key.');
    return null;
  }
  if (e instanceof ForbiddenError) {
    logger?.error('An forbidden error occurred. Please check your API Key.');
    return null;
  }
  if (e instanceof NotFoundError) {
    return createNotFoundErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  if (e instanceof InvalidHttpMethodError) {
    return createInternalSdkErrorMetricsEvent(tag, apiId, sourceId, sdkVersion, e.message);
  }
  if (e instanceof PayloadTooLargeError) {
    return createPayloadTooLargeErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  if (e instanceof ClientClosedRequestError) {
    return createClientClosedRequestErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  if (e instanceof InternalServerError) {
    return createInternalServerErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  if (e instanceof ServiceUnavailableError) {
    return createServiceUnavailableErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  if (e instanceof NetworkError) {
    return createNetworkErrorMetricsEvent(tag, apiId, sourceId, sdkVersion);
  }
  return createUnknownErrorMetricsEvent(
    tag,
    apiId,
    sourceId,
    sdkVersion,
    e instanceof UnknownError ? e.statusCode : undefined,
    e.message,
  );
};

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
