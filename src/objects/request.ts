import { Event } from './event';
import { SourceId } from './sourceId';
import { User } from './user';

export type RegisterEventsRequest = {
  events: Event[];
  sdkVersion: String;
  sourceId: SourceId;
};

export type GetEvaluationRequest = {
  tag: string;
  user?: User;
  featureId: string;
  sourceId: SourceId;
  sdkVersion: String;
};
