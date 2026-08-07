export const API_ENDPOINT = process.env.API_ENDPOINT!;
export const SCHEME = process.env.SCHEME || 'https'; // Default to https
export const CLIENT_API_KEY = process.env.CLIENT_API_KEY!;
export const SERVER_API_KEY = process.env.SERVER_API_KEY!;
export const FEATURE_TAG = 'nodejs';
export const TARGETED_USER_ID = 'bucketeer-nodejs-server-user-id-1';
export const TARGETED_SEGMENT_USER_ID = 'bucketeer-nodejs-server-user-id-2';

export const FEATURE_ID_BOOLEAN = 'feature-nodejs-server-e2e-boolean';
export const FEATURE_ID_STRING = 'feature-nodejs-server-e2e-string';
export const FEATURE_ID_INT = 'feature-nodejs-server-e2e-int';
export const FEATURE_ID_FLOAT = 'feature-nodejs-server-e2e-float';
export const FEATURE_ID_JSON = 'feature-nodejs-server-e2e-json';

// Rule-based segment fixtures (requires Bucketeer server 2.3.0+).
// See e2e/local_evaluation/evaluation_rule_based_segment.ts for the required
// dashboard configuration.
export const FEATURE_ID_RULE_SEGMENT = 'feature-nodejs-server-e2e-rule-segment';
export const FEATURE_ID_RULE_SEGMENT_AND_ATTRIBUTE =
  'feature-nodejs-server-e2e-rule-segment-attr';
export const RULE_SEGMENT_LIST_ONLY_USER_ID = 'bucketeer-nodejs-server-user-id-rule-segment-list';

export const GOAL_ID = 'goal-nodejs-server-e2e-1';
export const GOAL_VALUE = 1.0;
