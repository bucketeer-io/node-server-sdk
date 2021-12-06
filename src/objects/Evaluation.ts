import { isNotNullAndUndefined } from 'option-t/lib/Maybe/Maybe';
import { createOk, createErr, Result } from 'option-t/lib/PlainResult/Result';
import { Reason, ReasonAsPlainObject } from './Reason';

const requiredProps: Array<keyof EvaluationAsPlainObject> = [
  'id',
  'featureId',
  'featureVersion',
  'userId',
  'variationId',
  'variationValue',
];

// tslint:disable-next-line no-any
export function existsRequiredEvaluationProps(obj: any): boolean {
  return requiredProps.every((prop) => isNotNullAndUndefined(obj[prop]));
}

// tslint:disable-next-line no-any
export function convertRawToEvaluation(obj: any): Result<Evaluation, Error> {
  const ok = existsRequiredEvaluationProps(obj);
  return ok ? createOk(new Evaluation(obj)) : createErr(new Error('requiredProps not exist'));
}

export type EvaluationAsPlainObject = {
  id: string;
  featureId: string;
  featureVersion: number;
  userId: string;
  variationId: string;
  variationValue: string;
  reason: ReasonAsPlainObject;
};

export class Evaluation {
  get id(): string {
    return this._plainObj.id;
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

  get variationId(): string {
    return this._plainObj.variationId;
  }

  get variationValue(): string {
    return this._plainObj.variationValue;
  }

  get reason(): Reason {
    return new Reason(this._plainObj.reason);
  }

  private _plainObj: EvaluationAsPlainObject;

  constructor(plainObj: EvaluationAsPlainObject) {
    this._plainObj = plainObj;
  }

  toPlainObject(): EvaluationAsPlainObject {
    return this._plainObj;
  }
}
