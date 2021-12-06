import { tapUndefinable } from 'option-t/lib/Undefinable/tap';
import { EvaluationEvent } from '../objects/EvaluationEvent';
import { GoalEvent } from '../objects/GoalEvent';
import { MetricsEvent } from '../objects/MetricsEvent';

export class EventStore {
  private _events: Array<EvaluationEvent | GoalEvent | MetricsEvent>;

  constructor() {
    this._events = [];
  }

  add(event: EvaluationEvent | GoalEvent | MetricsEvent) {
    this._events.push(event);
  }

  getAll(): Array<EvaluationEvent | GoalEvent | MetricsEvent> {
    return this._events;
  }

  takeout(size: number): Array<EvaluationEvent | GoalEvent | MetricsEvent> {
    return this._events.splice(0, size);
  }

  size(): number {
    return this._events.length;
  }
}
