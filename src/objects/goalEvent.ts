import { createTimestamp } from '../utils/time';
import { Event, createEvent } from './event';
import { SourceId } from './sourceId';
import { User } from './user';

const GOAL_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.GoalEvent';
const version: string = require('../../package.json').version;

export function createGoalEvent(
  tag: string,
  goalId: string,
  user: User,
  value: number,
  sourceId: SourceId,
): Event {
  const goalEvent: GoalEvent = {
    tag,
    goalId,
    user,
    value,
    sourceId: sourceId,
    timestamp: createTimestamp(),
    userId: user.id,
    sdkVersion: version,
    metadata: {},
    '@type': GOAL_EVENT_NAME,
  };
  return createEvent(goalEvent);
}

export type GoalEvent = {
  timestamp: number;
  goalId: string;
  userId: string;
  value: number;
  user?: User;
  tag: string;
  sourceId: SourceId;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof GOAL_EVENT_NAME;
};

export function isGoalEvent(obj: any): obj is GoalEvent {
  const isObject = typeof obj === 'object' && obj !== null;
  const hasTimestamp = typeof obj.timestamp === 'number';
  const hasGoalId = typeof obj.goalId === 'string';
  const hasUserId = typeof obj.userId === 'string';
  const hasValue = typeof obj.value === 'number';
  const hasUser = obj.user === undefined || typeof obj.user === 'object';
  const hasTag = typeof obj.tag === 'string';
  const hasSourceId = obj.sourceId !== undefined && Object.values(SourceId).includes(obj.sourceId);
  const hasSdkVersion = typeof obj.sdkVersion === 'string';
  const hasMetadata = typeof obj.metadata === 'object' && obj.metadata !== null;
  const hasValidMetadata =
    hasMetadata && Object.values(obj.metadata).every((value) => typeof value === 'string');
  const hasCorrectType = obj['@type'] === GOAL_EVENT_NAME;

  return (
    isObject &&
    hasTimestamp &&
    hasGoalId &&
    hasUserId &&
    hasValue &&
    hasUser &&
    hasTag &&
    hasSourceId &&
    hasSdkVersion &&
    hasMetadata &&
    hasValidMetadata &&
    hasCorrectType
  );
}
