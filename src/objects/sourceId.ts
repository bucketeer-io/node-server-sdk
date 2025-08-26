export const SourceId = {
  UNKNOWN: 0,
  ANDROID: 1,
  IOS: 2,
  // WEB: 3, // deprecated
  // GOAL_BATCH: 4, // deprecated
  GO_SERVER: 5,
  NODE_SERVER: 6,
  JAVASCRIPT: 7,
  FLUTTER: 8,
  REACT: 9,
  REACT_NATIVE: 10,
  OPEN_FEATURE_KOTLIN: 100,
  OPEN_FEATURE_SWIFT: 101,
  OPEN_FEATURE_JAVASCRIPT: 102,
  OPEN_FEATURE_GO: 103,
  OPEN_FEATURE_NODE: 104,
} as const;

export type SourceId = (typeof SourceId)[keyof typeof SourceId];
// Create a Set of all valid SourceId values for efficient lookup
const SourceIdValuesSet: Set<number> = new Set(Object.values(SourceId));

export function sourceIdFromNumber(sourceId: number): SourceId {
  if (SourceIdValuesSet.has(sourceId)) {
    return sourceId as SourceId;
  }
  return SourceId.UNKNOWN;
}
