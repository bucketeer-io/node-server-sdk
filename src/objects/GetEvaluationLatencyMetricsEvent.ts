import { Duration, DurationAsPlainObject } from './Duration';

export const USER_EVALUATION_STATE_FULL = 'FULL';

export type GetEvaluationLatencyMetricsEventAsPlainObject = {
  labels: { [key: string]: string };
  duration: string;
  '@type'?: string;
};

export class GetEvaluationLatencyMetricsEvent {
  get labels(): { [key: string]: string } {
    return this._plainObj.labels;
  }

  get duration(): string {
    return this._plainObj.duration;
  }

  private _plainObj: GetEvaluationLatencyMetricsEventAsPlainObject;

  constructor(plainObj: GetEvaluationLatencyMetricsEventAsPlainObject) {
    plainObj['@type'] =
      'type.googleapis.com/bucketeer.event.client.GetEvaluationLatencyMetricsEvent';
    this._plainObj = plainObj;
  }

  toPlainObject(): GetEvaluationLatencyMetricsEventAsPlainObject {
    return this._plainObj;
  }
}
