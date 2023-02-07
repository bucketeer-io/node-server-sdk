import { UserAsPlainObject } from '../bootstrap';
import { Evaluation, Event, Reason, SourceId } from '../newObjects/Event';

enum EventType {
  GOAL = 1,
  GOAL_BATCH = 2,
  EVALUATION = 3,
  METRICS = 4,
}

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
