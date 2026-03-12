/**
 * Production Logic Reuse:
 * These helper functions re-implement the @bucketeer/evaluation helpers locally as they
 * will be restricted to internal testing only within the @bucketeer/evaluation package.
 *
 * All functions below are designed to use the same translation logic used in production
 * (via src/evaluator/converter.ts) to ensure that tests accurately simulate how data is
 * mapped in the network and evaluator layers.
 */
import {
  Feature as ProtoFeature,
  User as ProtoUser,
  SegmentUser as ProtoSegmentUser,
  Prerequisite as ProtoPrerequisite,
} from '@bucketeer/evaluation';
import {
  toProtoFeature,
  toProtoUser,
  toProtoPrerequisite,
} from '../../evaluator/converter';
import { Feature } from '../../objects/feature';

export function createUser(id: string, data: { [key: string]: string }): ProtoUser {
  return toProtoUser({ id, data });
}

export function createPrerequisite(featureId: string, variationId: string): ProtoPrerequisite {
  return toProtoPrerequisite({ featureId, variationId });
}

export function createSegmentUser(userId: string, segmentId: string, state: any): ProtoSegmentUser {
  const pu = new ProtoSegmentUser();
  pu.setId(`${segmentId}:${userId}`);
  pu.setSegmentId(segmentId);
  pu.setUserId(userId);
  pu.setState(state);
  pu.setDeleted(false);
  return pu;
}

export function createFeature(params: Partial<Feature>): ProtoFeature {
  const internalFeature: Feature = {
    id: params.id ?? '',
    name: params.name ?? '',
    description: params.description ?? '',
    enabled: params.enabled ?? true,
    deleted: params.deleted ?? false,
    ttl: params.ttl ?? 0,
    version: params.version ?? 0,
    createdAt: params.createdAt ?? '0',
    updatedAt: params.updatedAt ?? '0',
    variationType: params.variationType ?? 'STRING',
    offVariation: params.offVariation ?? '',
    tags: params.tags ?? [],
    maintainer: params.maintainer ?? '',
    archived: params.archived ?? false,
    samplingSeed: params.samplingSeed ?? '',
    variations: params.variations ?? [],
    targets: params.targets ?? [],
    rules: params.rules ?? [],
    defaultStrategy: params.defaultStrategy,
    prerequisites: params.prerequisites ?? [],
    lastUsedInfo: params.lastUsedInfo,
  };

  return toProtoFeature(internalFeature);
}

export const minimalFeature = (id: string): Feature => ({
  id,
  name: '',
  description: '',
  enabled: false,
  deleted: false,
  ttl: 0,
  version: 0,
  createdAt: '0',
  updatedAt: '0',
  variationType: 'STRING',
  offVariation: '',
  tags: [],
  maintainer: '',
  archived: false,
  samplingSeed: '',
  variations: [],
  targets: [],
  rules: [],
});
