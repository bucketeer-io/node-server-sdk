import { Evaluation } from './evaluation';
import { Feature } from './feature';
import { SegmentUsers } from './segment';

export type RegisterEventsResponseError = {
  retriable: boolean;
  message: string;
};

export type RegisterEventsResponse = {
  errors: { [key: string]: RegisterEventsResponseError };
};

export type GetEvaluationResponse = {
  evaluation?: Evaluation;
};

export type GetFeatureFlagsResponse = {
  featureFlagsId: string;
  features: Feature[];
  archivedFeatureFlagIds: string[];
  requestedAt: string;
  forceUpdate: boolean;
};

export type GetSegmentUsersResponse = {
  segmentUsers: SegmentUsers[];
  deletedSegmentIds: string[];
  requestedAt: string;
  forceUpdate: boolean;
};