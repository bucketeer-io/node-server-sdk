import { HoldoutGroup } from '../../objects/holdout';
import { Feature } from '../../objects/feature';
import { minimalFeature } from './feature';

// Fixtures for the holdout groups of a getFeatureFlags response.
//
// The JSON below is what the gateway sends: protojson with unpopulated fields
// emitted, so the fields the backend leaves empty (name, goals, timestamps
// other than updatedAt) are present with their zero value. int64 fields are
// strings and enums are names.

export const HOLDOUT_ENVIRONMENT_ID = 'environment-id-1';
export const HOLDOUT_FEATURE_ID = 'feature-id-holdout';
export const HOLDOUT_VARIATION_ID = 'variation-false-id';
export const NORMAL_VARIATION_ID = 'variation-true-id';
export const HOLDOUT_SEGMENT_ID = 'segment-id-holdout';

// With HASH_HOLDOUT_GROUP_JSON this user falls inside the bucket range.
export const HELD_OUT_USER_ID = 'user-id-27';
// With HASH_HOLDOUT_GROUP_JSON this user falls outside the bucket range.
export const NOT_HELD_OUT_USER_ID = 'user-id-1';

export const HASH_HOLDOUT_GROUP_ID = 'holdout-group-id-hash';
export const SEGMENT_HOLDOUT_GROUP_ID = 'holdout-group-id-segment';

// The range wraps at 100: it covers [97, 100) and [0, 2).
export const HASH_HOLDOUT_GROUP_JSON = `{
  "id": "${HASH_HOLDOUT_GROUP_ID}",
  "environmentId": "${HOLDOUT_ENVIRONMENT_ID}",
  "name": "",
  "description": "",
  "assignmentType": "HASH",
  "samplingSeed": "sampling-seed-1",
  "bucketStart": 97,
  "percentage": 5,
  "segmentId": "",
  "status": "RUNNING",
  "startAt": "0",
  "stopAt": "0",
  "startAnalysisAt": "0",
  "analysisStartedAt": "0",
  "stoppedAt": "0",
  "goalIds": [],
  "experimentId": "",
  "analysisExperimentId": "",
  "createdBy": "",
  "updatedBy": "",
  "createdAt": "0",
  "updatedAt": "1763539200",
  "archived": false,
  "deleted": false,
  "features": [
    {
      "id": "holdout-feature-id-1",
      "holdoutGroupId": "${HASH_HOLDOUT_GROUP_ID}",
      "featureId": "${HOLDOUT_FEATURE_ID}",
      "environmentId": "${HOLDOUT_ENVIRONMENT_ID}",
      "holdoutVariationId": "${HOLDOUT_VARIATION_ID}",
      "addedAt": "1763539100",
      "removedAt": "0"
    }
  ]
}`;

export const SEGMENT_HOLDOUT_GROUP_JSON = `{
  "id": "${SEGMENT_HOLDOUT_GROUP_ID}",
  "environmentId": "${HOLDOUT_ENVIRONMENT_ID}",
  "name": "",
  "description": "",
  "assignmentType": "SEGMENT",
  "samplingSeed": "",
  "bucketStart": 0,
  "percentage": 0,
  "segmentId": "${HOLDOUT_SEGMENT_ID}",
  "status": "ANALYSIS",
  "startAt": "0",
  "stopAt": "0",
  "startAnalysisAt": "0",
  "analysisStartedAt": "0",
  "stoppedAt": "0",
  "goalIds": [],
  "experimentId": "",
  "analysisExperimentId": "",
  "createdBy": "",
  "updatedBy": "",
  "createdAt": "0",
  "updatedAt": "1763539300",
  "archived": false,
  "deleted": false,
  "features": [
    {
      "id": "holdout-feature-id-2",
      "holdoutGroupId": "${SEGMENT_HOLDOUT_GROUP_ID}",
      "featureId": "${HOLDOUT_FEATURE_ID}",
      "environmentId": "${HOLDOUT_ENVIRONMENT_ID}",
      "holdoutVariationId": "${HOLDOUT_VARIATION_ID}",
      "addedAt": "1763539250",
      "removedAt": "0"
    }
  ]
}`;

export function hashHoldoutGroup(): HoldoutGroup {
  return JSON.parse(HASH_HOLDOUT_GROUP_JSON);
}

export function segmentHoldoutGroup(): HoldoutGroup {
  return JSON.parse(SEGMENT_HOLDOUT_GROUP_JSON);
}

// A flag that serves NORMAL_VARIATION_ID to everyone through its default
// strategy. The holdout groups above target it with HOLDOUT_VARIATION_ID.
export function holdoutTargetFeature(options: { id?: string; enabled?: boolean } = {}): Feature {
  return {
    ...minimalFeature(options.id ?? HOLDOUT_FEATURE_ID),
    name: 'feature-holdout',
    enabled: options.enabled ?? true,
    version: 3,
    tags: ['server'],
    variations: [
      { id: NORMAL_VARIATION_ID, name: 'true-name', value: 'true', description: '' },
      { id: HOLDOUT_VARIATION_ID, name: 'false-name', value: 'false', description: '' },
    ],
    defaultStrategy: { type: 'FIXED', fixedStrategy: { variation: NORMAL_VARIATION_ID } },
    offVariation: NORMAL_VARIATION_ID,
  };
}
