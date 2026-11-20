import { Evaluation } from './evaluation';
import { Feature } from './feature';
import { HoldoutGroup } from './holdout';
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
  // The holdout groups serving in the environment. Always the full list and
  // never a diff: an empty list means no group is serving. A backend that
  // predates holdout delivery does not send the field.
  holdoutGroups?: HoldoutGroup[];
};

export type GetSegmentUsersResponse = {
  segmentUsers: SegmentUsers[];
  deletedSegmentIds: string[];
  requestedAt: string;
  forceUpdate: boolean;
};