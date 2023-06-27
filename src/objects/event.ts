import { v4 } from 'uuid';
import { EvaluationEvent } from './evaluationEvent';
import { GoalEvent } from './goalEvent';
import { MetricsEvent } from './metricsEvent';

export function createEvent(b: EvaluationEvent | GoalEvent | MetricsEvent): Event {
  return {
    id: v4(),
    event: b,
  };
}

export type Event = {
  id: string;
  event: EvaluationEvent | GoalEvent | MetricsEvent;
};
