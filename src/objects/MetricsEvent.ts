import { GetEvaluationLatencyMetricsEventAsPlainObject } from './GetEvaluationLatencyMetricsEvent';
import { GetEvaluationSizeMetricsEventAsPlainObject } from './GetEvaluationSizeMetricsEvent';
import { InternalErrorCountMetricsEventAsPlainObject } from './InternalErrorCountMetricsEvent';
import { TimeoutErrorCountMetricsEventAsPlainObject } from './TimeoutErrorCountMetricsEvent';

export type MetricsEventAsPlainObject = {
  timestamp: number;
  event:
    | GetEvaluationLatencyMetricsEventAsPlainObject
    | GetEvaluationSizeMetricsEventAsPlainObject
    | InternalErrorCountMetricsEventAsPlainObject
    | TimeoutErrorCountMetricsEventAsPlainObject;
  '@type'?: string;
};

export class MetricsEvent {
  get timestamp(): number {
    return this._plainObj.timestamp;
  }

  get event():
    | GetEvaluationLatencyMetricsEventAsPlainObject
    | GetEvaluationSizeMetricsEventAsPlainObject
    | InternalErrorCountMetricsEventAsPlainObject
    | TimeoutErrorCountMetricsEventAsPlainObject {
    return this._plainObj.event;
  }

  private _plainObj: MetricsEventAsPlainObject;

  constructor(plainObj: MetricsEventAsPlainObject) {
    plainObj['@type'] = 'type.googleapis.com/bucketeer.event.client.MetricsEvent';
    this._plainObj = plainObj;
  }

  toPlainObject(): MetricsEventAsPlainObject {
    return this._plainObj;
  }
}
