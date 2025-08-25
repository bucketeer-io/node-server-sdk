import { createTimestamp } from '../utils/time';
import { Evaluation } from './evaluation';
import { Event, createEvent } from './event';
import { Reason } from './reason';
import { SourceId } from './sourceId';
import { User } from './user';

const EVALUATION_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.EvaluationEvent';

export function createEvaluationEvent(
  tag: string,
  user: User,
  evaluation: Evaluation,
  sourceId: SourceId,
  sdkVersion: string,
): Event {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    userId: user.id,
    featureId: evaluation.featureId,
    timestamp: createTimestamp(),
    featureVersion: evaluation.featureVersion,
    variationId: evaluation.variationId,
    sourceId: sourceId,
    reason: evaluation.reason,
    sdkVersion: sdkVersion,
    metadata: {},
    '@type': EVALUATION_EVENT_NAME,
  };
  return createEvent(evaluationEvent);
}

export type EvaluationEvent = {
  timestamp: number;
  featureId: string;
  featureVersion: number;
  userId: string;
  variationId: string;
  user?: User;
  reason?: Reason;
  tag: string;
  sourceId: SourceId;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof EVALUATION_EVENT_NAME;
};

export function createDefaultEvaluationEvent(
  tag: string,
  user: User,
  featureId: string,
  sourceId: SourceId,
  sdkVersion: string,
): Event {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    timestamp: createTimestamp(),
    featureId,
    featureVersion: 0,
    userId: user.id,
    variationId: '',
    sourceId: sourceId,
    reason: {
      type: 'CLIENT',
    },
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion: sdkVersion,
    metadata: {},
  };
  return createEvent(evaluationEvent);
}

export function isEvaluationEvent(obj: any): obj is EvaluationEvent {
  const isObject = typeof obj === 'object' && obj !== null;
  const hasTimestamp = typeof obj.timestamp === 'number';
  const hasFeatureId = typeof obj.featureId === 'string';
  const hasFeatureVersion = typeof obj.featureVersion === 'number';
  const hasUserId = typeof obj.userId === 'string';
  const hasVariationId = typeof obj.variationId === 'string';
  const hasUser = obj.user === undefined || typeof obj.user === 'object';
  const hasReason = obj.reason === undefined || typeof obj.reason === 'object';
  const hasTag = typeof obj.tag === 'string';
  const hasSourceId = obj.sourceId !== undefined && Object.values(SourceId).includes(obj.sourceId);
  const hasSdkVersion = typeof obj.sdkVersion === 'string';
  const hasMetadata = typeof obj.metadata === 'object' && obj.metadata !== null;
  const hasValidMetadata =
    hasMetadata && Object.values(obj.metadata).every((value) => typeof value === 'string');
  const hasCorrectType = obj['@type'] === EVALUATION_EVENT_NAME;

  return (
    isObject &&
    hasTimestamp &&
    hasFeatureId &&
    hasFeatureVersion &&
    hasUserId &&
    hasVariationId &&
    hasUser &&
    hasReason &&
    hasTag &&
    hasSourceId &&
    hasSdkVersion &&
    hasMetadata &&
    hasValidMetadata &&
    hasCorrectType
  );
}
