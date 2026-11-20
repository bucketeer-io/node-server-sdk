// The holdout groups of a getFeatureFlags response, as the gateway sends them:
// int64 fields are strings and enums are names. Only the fields local
// evaluation reads are populated. The response carries the other fields of the
// proto message with their zero value, and they are not listed here.

export type HoldoutGroupFeature = {
  id: string;
  holdoutGroupId: string;
  featureId: string;
  environmentId: string;
  holdoutVariationId: string;
  addedAt: string;
  // '0' while the flag is a target. The backend sends current targets only.
  removedAt?: string;
};

export type HoldoutGroup = {
  id: string;
  // Part of the HASH bucketing input.
  environmentId: string;
  // 'HASH' or 'SEGMENT'.
  assignmentType: string;
  // HASH only.
  samplingSeed: string;
  // HASH only. Start of the bucket range on [0, 100).
  bucketStart: number;
  // HASH only.
  percentage: number;
  // SEGMENT only.
  segmentId: string;
  // 'RUNNING' or 'ANALYSIS'. The backend sends serving groups only, so the
  // SDK does not filter on it.
  status: string;
  updatedAt: string;
  features: HoldoutGroupFeature[];
};
