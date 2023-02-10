import { Event } from './Event';
import { SourceId } from './sourceId';
import { User } from './User';

export type RegisterEventsRequest = {
  events: Event[];
};

export type GetEvaluationRequest = {
  tag: string;
  user?: User;
  featureId: string;
  sourceId: SourceId;
};
