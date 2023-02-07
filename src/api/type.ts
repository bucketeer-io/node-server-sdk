import { UserAsPlainObject } from '../bootstrap';

type Evaluation = {
  id: string;
  featureId: string;
  featureVersion: number;
  userId: string;
  variationId: string;
  reason?: Reason;
  variationValue: string;
};

type Reason = {
  type: ReasonType;
  ruleId?: string;
};

enum ReasonType {
  TARGET = 0,
  RULE = 1,
  DEFAULT = 3,
  CLIENT = 4,
  OFF_VARIATION = 5,
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

enum EventType {
  GOAL = 1,
  GOAL_BATCH = 2,
  EVALUATION = 3,
  METRICS = 4,
}

export type Event = {
  id: string;
  type: EventType;
  environmentNamespace: string;
  event: string;
};

type RegisterEventsResponseError = {
  retriable: boolean;
  message: string;
};

export type RegisterEventsRequest = {
  events: Event[];
};

export type RegisterEventsResponse = {
  errors: { [key: string]: RegisterEventsResponseError };
};

export type GetEvaluationRequest = {
  tag: string;
  user?: UserAsPlainObject;
  featureId: string;
  sourceId: SourceId;
};

export type GetEvaluationResponse = {
  evaluation?: Evaluation;
};
