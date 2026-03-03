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

export type GetFeatureFlagsRequest = BaseRequest & {
  tag: string;
  featureFlagsId: string;
  requestedAt: number;
};

export type GetSegmentUsersRequest = BaseRequest & {
  segmentIds: string[];
  requestedAt: number;
};