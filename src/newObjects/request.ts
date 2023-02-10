import { Event } from './event';
import { SourceId } from './sourceId';
import { User } from './user';

export type RegisterEventsRequest = {
  events: Event[];
};

export type GetEvaluationRequest = {
  tag: string;
  user?: User;
  featureId: string;
  sourceId: SourceId;
};
