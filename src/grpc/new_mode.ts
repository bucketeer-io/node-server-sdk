/**
 * Models to be used instead of proto-generated classes.
 * These mirror the AsObject shapes produced by the proto definitions
 * but are plain TypeScript interfaces so the rest of the codebase
 * can avoid depending on proto models directly.
 */

// Minimal nested types for features. Keep these small and permissive
// — consumers can extend them later if they need more fields.
export interface Variation {
  id?: string;
  value?: unknown;
  // other fields may exist depending on proto; keep optional
  [key: string]: unknown;
}

export interface Target {
  // shape depends on the proto Target.AsObject; keep permissive
  values?: Array<string>;
  variation?: string;
  [key: string]: unknown;
}

export interface Rule {
  id?: string;
  // rule specifics are left as a generic object
  [key: string]: unknown;
}

export interface Strategy {
  // Strategy.AsObject is left permissive
  name?: string;
  [key: string]: unknown;
}

export interface FeatureLastUsedInfo {
  featureId?: string;
  lastUsedAt?: number;
  [key: string]: unknown;
}

export interface Prerequisite {
  id?: string;
  variation?: string;
  [key: string]: unknown;
}

export interface AutoOpsSummary {
  progressiveRolloutCount: number;
  scheduleCount: number;
  killSwitchCount: number;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  deleted: boolean;
  evaluationUndelayable: boolean;
  ttl: number;
  version: number;
  createdAt: number;
  updatedAt: number;
  variationsList: Array<Variation>;
  targetsList: Array<Target>;
  rulesList: Array<Rule>;
  defaultStrategy?: Strategy;
  offVariation: string;
  tagsList: Array<string>;
  lastUsedInfo?: FeatureLastUsedInfo;
  maintainer: string;
  variationType: number;
  archived: boolean;
  prerequisitesList: Array<Prerequisite>;
  samplingSeed: string;
  autoOpsSummary?: AutoOpsSummary;
  // allow additional fields without breaking
  [key: string]: unknown;
}

export interface Features {
  id: string;
  featuresList: Array<Feature>;
}

export interface SegmentUser {
  id: string;
  segmentId: string;
  userId: string;
  state: number;
  deleted: boolean;
  [key: string]: unknown;
}

export interface SegmentUsers {
  segmentId: string;
  usersList: Array<SegmentUser>;
  updatedAt: number;
}

export interface GetFeatureFlagsResponse {
  featureFlagsId: string;
  featuresList: Array<Feature>;
  archivedFeatureFlagIdsList: Array<string>;
  requestedAt: number;
  forceUpdate: boolean;
}

export interface GetSegmentUsersResponse {
  segmentUsersList: Array<SegmentUsers>;
  deletedSegmentIdsList: Array<string>;
  requestedAt: number;
  forceUpdate: boolean;
}

// Helper: accept either a proto message with toObject() or a plain object
function ensureObject<T = any>(msg: any): T {
  if (!msg) return msg as T;
  if (typeof msg.toObject === 'function') {
    return msg.toObject();
  }
  return msg as T;
}

export function fromGetFeatureFlagsResponse(msg: any): GetFeatureFlagsResponse {
  const obj = ensureObject<any>(msg);
  return {
    featureFlagsId: obj.featureFlagsId || '',
    featuresList: (obj.featuresList || []).map((f: any) => ensureObject<Feature>(f)),
    archivedFeatureFlagIdsList: obj.archivedFeatureFlagIdsList || [],
    requestedAt: obj.requestedAt || 0,
    forceUpdate: !!obj.forceUpdate,
  };
}

export function fromGetSegmentUsersResponse(msg: any): GetSegmentUsersResponse {
  const obj = ensureObject<any>(msg);
  const segmentUsersList = (obj.segmentUsersList || []).map((s: any) => {
    const so = ensureObject<any>(s);
    return {
      segmentId: so.segmentId || '',
      usersList: (so.usersList || []).map((u: any) => ensureObject<SegmentUser>(u)),
      updatedAt: so.updatedAt || 0,
  } as SegmentUsers;
  });

  return {
    segmentUsersList,
    deletedSegmentIdsList: obj.deletedSegmentIdsList || [],
    requestedAt: obj.requestedAt || 0,
    forceUpdate: !!obj.forceUpdate,
  };
}
