import { Event } from './event';
import { SourceId } from './sourceId';
import { User } from './user';

export type BaseRequest = {
  sourceId: SourceId;
  sdkVersion: string;
};

export type RegisterEventsRequest = BaseRequest & {
  events: Event[];
};

export type GetEvaluationRequest = BaseRequest & {
  tag: string;
  user?: User;
  featureId: string;
};