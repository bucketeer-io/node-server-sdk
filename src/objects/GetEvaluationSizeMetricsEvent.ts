export type GetEvaluationSizeMetricsEventAsPlainObject = {
  labels: { [key: string]: string };
  sizeByte: number;
  '@type'?: string;
};

export class GetEvaluationSizeMetricsEvent {
  get labels(): { [key: string]: string } {
    return this._plainObj.labels;
  }

  get sizeByte(): number {
    return this._plainObj.sizeByte;
  }

  private _plainObj: GetEvaluationSizeMetricsEventAsPlainObject;

  constructor(plainObj: GetEvaluationSizeMetricsEventAsPlainObject) {
    plainObj['@type'] = 'type.googleapis.com/bucketeer.event.client.GetEvaluationSizeMetricsEvent';
    this._plainObj = plainObj;
  }

  toPlainObject(): GetEvaluationSizeMetricsEventAsPlainObject {
    return this._plainObj;
  }
}
