import { createTimestamp } from '../utils/time';
import { Event, createEvent } from './event';
import { SourceId } from './sourceId';
import { User } from './user';

const GOAL_EVENT_NAME = 'type.googleapis.com/bucketeer.event.client.GoalEvent';
const version: string = require('../../package.json').version;

export function createGoalEvent(tag: string, goalId: string, user: User, value: number): Event {
  const goalEvent: GoalEvent = {
    tag,
    goalId,
    user,
    value,
    sourceId: SourceId.NODE_SERVER,
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
  sourceId: typeof SourceId.NODE_SERVER;
  sdkVersion: string;
  metadata: { [key: string]: string };
  '@type': typeof GOAL_EVENT_NAME;
};
