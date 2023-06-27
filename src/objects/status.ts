import { createTimestamp } from '../utils/time';
import { ApiId, NodeApiIds } from './apiId';
import { createEvent } from './event';
import { createMetricsEvent } from './metricsEvent';
import { SourceId } from './sourceId';

const BAD_REQUEST_ERROR_METRICSEVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.BadRequestErrorMetricsEvent';
const UNAUTHORIZED_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.UnauthorizedErrorMetricsEvent';
const FORBIDDEN_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ForbiddenErrorMetricsEvent';
const NOT_FOUND_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NotFoundErrorMetricsEvent';
const CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ClientClosedRequestErrorMetricsEvent';
const INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.InternalServerErrorMetricsEvent';
const SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ServiceUnavailableErrorMetricsEvent';

export type BadRequestErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof BAD_REQUEST_ERROR_METRICSEVENT_NAME;
};

export type UnauthorizedErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof UNAUTHORIZED_ERROR_METRICS_EVENT_NAME;
};

export type ForbiddenErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof FORBIDDEN_ERROR_METRICS_EVENT_NAME;
};

export type NotFoundErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof NOT_FOUND_ERROR_METRICS_EVENT_NAME;
};

export type ClientClosedRequestErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof CLIENT_CLOSED_REQUEST_ERROR_METRICS_EVENT_NAME;
};

export type InternalServerErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof INTERNAL_SERVER_ERROR_METRICS_EVENT_NAME;
};

export type ServiceUnavailableErrorMetricsEvent = {
  apiId: ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
  labels: { [key: string]: string };
  '@type': typeof SERVICE_UNAVAILABLE_ERROR_METRICS_EVENT_NAME;
};

export type StatusMetricsEvent =
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
    '@type': BAD_REQUEST_ERROR_METRICSEVENT_NAME,
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
