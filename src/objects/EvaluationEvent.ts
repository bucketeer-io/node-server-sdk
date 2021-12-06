import { Reason, ReasonAsPlainObject } from './Reason';
import { User, UserAsPlainObject } from './User';
import { SourceId } from './SourceId';

export type EvaluationEventAsPlainObject = {
  sourceId: SourceId;
  tag: string;
  featureId: string;
  featureVersion: number;
  userId: string;
  user: UserAsPlainObject;
  variationId: string;
  reason: ReasonAsPlainObject;
  timestamp: number;
  '@type'?: string;
};

export class EvaluationEvent {
  get sourceId(): SourceId {
    return this._plainObj.sourceId;
  }

  get tag(): string {
    return this._plainObj.tag;
  }

  get featureId(): string {
    return this._plainObj.featureId;
  }

  get featureVersion(): number {
    return this._plainObj.featureVersion;
  }

  get userId(): string {
    return this._plainObj.userId;
  }

  get user(): User {
    return new User(this._plainObj.user);
  }

  get variationId(): string {
    return this._plainObj.variationId;
  }

  get reason(): Reason {
    return new Reason(this._plainObj.reason);
  }

  get timestamp(): number {
    return this._plainObj.timestamp;
  }

  private _plainObj: EvaluationEventAsPlainObject;

  constructor(plainObj: EvaluationEventAsPlainObject) {
    plainObj['@type'] = 'type.googleapis.com/bucketeer.event.client.EvaluationEvent';
    this._plainObj = plainObj;
  }

  toPlainObject(): EvaluationEventAsPlainObject {
    return this._plainObj;
  }
}
