import { Evaluation, EvaluationAsPlainObject } from './Evaluation';
import { SourceId } from './SourceId';

export type GoalEventAsPlainObject = {
  sourceId: SourceId;
  tag: string;
  goalId: string;
  userId: string;
  value: number;
  timestamp: number;
  '@type'?: string;
};

export class GoalEvent {
  get sourceId(): SourceId {
    return this._plainObj.sourceId;
  }

  get tag(): string {
    return this._plainObj.tag;
  }

  get goalId(): string {
    return this._plainObj.goalId;
  }

  get userId(): string {
    return this._plainObj.userId;
  }

  get value(): number {
    return this._plainObj.value;
  }

  get timestamp(): number {
    return this._plainObj.timestamp;
  }

  private _plainObj: GoalEventAsPlainObject;

  constructor(plainObj: GoalEventAsPlainObject) {
    plainObj['@type'] = 'type.googleapis.com/bucketeer.event.client.GoalEvent';
    this._plainObj = plainObj;
  }

  toPlainObject(): GoalEventAsPlainObject {
    return this._plainObj;
  }
}
