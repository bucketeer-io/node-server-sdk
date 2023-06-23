import { createTimestamp } from '../utils/time';
import { Evaluation } from './evaluation';
import { Event, createEvent } from './event';
import { Reason, ReasonType } from './reason';
import { SourceId } from './sourceId';
import { User } from './user';
const version: string = require('../../package.json').version;

const EVALUATION_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.EvaluationEvent';

export function createEvaluationEvent(tag: string, user: User, evaluation: Evaluation): Event {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    userId: user.id,
    featureId: evaluation.featureId,
    timestamp: createTimestamp(),
    featureVersion: evaluation.featureVersion,
    variationId: evaluation.variationId,
    sourceId: SourceId.NODE_SERVER,
    reason: evaluation.reason,
    sdkVersion: version,
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
  sourceId: typeof SourceId.NODE_SERVER;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof EVALUATION_EVENT_NAME;
};

export function createDefaultEvaluationEvent(tag: string, user: User, featureId: string): Event {
  const evaluationEvent: EvaluationEvent = {
    tag,
    user,
    timestamp: createTimestamp(),
    featureId,
    featureVersion: 0,
    userId: user.id,
    variationId: '',
    sourceId: SourceId.NODE_SERVER,
    reason: {
      type: ReasonType.CLIENT,
    },
    '@type': EVALUATION_EVENT_NAME,
    sdkVersion: version,
    metadata: {},
  };
  return createEvent(evaluationEvent);
}
