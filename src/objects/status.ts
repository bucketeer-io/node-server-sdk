import { ApiId, NodeApiIds } from './apiId';
import { createEvent } from './event';
import { createMetricsEvent, isMetricsEvent, MetricsEvent } from './metricsEvent';

const FORBIDDEN_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ForbiddenErrorMetricsEvent';
const BAD_REQUEST_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.BadRequestErrorMetricsEvent';
const UNAUTHORIZED_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.UnauthorizedErrorMetricsEvent';
const NOT_FOUND_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NotFoundErrorMetricsEvent';
const CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ClientClosedRequestErrorMetricsEvent';
const INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.InternalServerErrorMetricsEvent';
const SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ServiceUnavailableErrorMetricsEvent';
const REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.RedirectionRequestExceptionEvent';
const PAYLOAD_TOO_LARGE_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.PayloadTooLargeExceptionEvent';

export type BadRequestErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof BAD_REQUEST_ERROR_METRICS_EVENT_NAME;
};

export type UnauthorizedErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof UNAUTHORIZED_ERROR_METRICS_EVENT_NAME;
};

export type ForbiddenErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof FORBIDDEN_ERROR_METRICS_EVENT_NAME;
};

export type NotFoundErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof NOT_FOUND_ERROR_METRICS_EVENT_NAME;
};

export type ClientClosedRequestErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME;
};

export type InternalServerErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME;
};

export type ServiceUnavailableErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME;
};

export type RedirectRequestErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME;
};

export type PayLoadTooLargetErrorMetricsEvent = {
  apiId: NodeApiIds;
  labels: { [key: string]: string };
  '@type': typeof PAYLOAD_TOO_LARGE_ERROR_METRICS_EVENT_NAME;
};

export type StatusMetricsEvent =
  | RedirectRequestErrorMetricsEvent
  | PayLoadTooLargetErrorMetricsEvent
  | BadRequestErrorMetricsEvent
  | UnauthorizedErrorMetricsEvent
  | ForbiddenErrorMetricsEvent
  | NotFoundErrorMetricsEvent
  | ClientClosedRequestErrorMetricsEvent
  | InternalServerErrorMetricsEvent
  | ServiceUnavailableErrorMetricsEvent;

export function createBadRequestErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: BadRequestErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': BAD_REQUEST_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createUnauthorizedErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: UnauthorizedErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': UNAUTHORIZED_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createForbiddenErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: ForbiddenErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': FORBIDDEN_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createNotFoundErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: NotFoundErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': NOT_FOUND_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createClientClosedRequestErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: ClientClosedRequestErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createInternalServerErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: InternalServerErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createServiceUnavailableErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const internalErrorMetricsEvent: ServiceUnavailableErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(internalErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createRedirectRequestErrorMetricsEvent(
  tag: string,
  apiId: NodeApiIds,
  statusCode: number,
) {
  const redirectRequestErrorMetricsEvent: RedirectRequestErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
      response_code: statusCode.toString(),
    },
    '@type': REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(redirectRequestErrorMetricsEvent);
  return createEvent(metricsEvent);
}

export function createPayloadTooLargeErrorMetricsEvent(tag: string, apiId: NodeApiIds) {
  const payloadTooLargeMetricsEvent: PayLoadTooLargetErrorMetricsEvent = {
    apiId,
    labels: {
      tag,
    },
    '@type': PAYLOAD_TOO_LARGE_ERROR_METRICS_EVENT_NAME,
  };
  const metricsEvent = createMetricsEvent(payloadTooLargeMetricsEvent);
  return createEvent(metricsEvent);
}

export function isStatusErrorMetricsEvent(obj: any, specificErrorType?: string): obj is MetricsEvent {
  if (!isMetricsEvent(obj) || !obj.event) {
    return false;
  }
  // check event type in ErrorMetricsEvent
  if (specificErrorType) {
    return obj.event['@type'] === specificErrorType;
  }

  const statusErrorEventTypes =  [
    FORBIDDEN_ERROR_METRICS_EVENT_NAME,
    BAD_REQUEST_ERROR_METRICS_EVENT_NAME,
    UNAUTHORIZED_ERROR_METRICS_EVENT_NAME,
    NOT_FOUND_ERROR_METRICS_EVENT_NAME,
    CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME,
    INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME,
    SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME,
    REDIRECT_REQUEST_ERROR_METRICS_EVENT_NAME,
    PAYLOAD_TOO_LARGE_ERROR_METRICS_EVENT_NAME,
  ];
    
  return statusErrorEventTypes.includes(obj.event['@type']);
}
