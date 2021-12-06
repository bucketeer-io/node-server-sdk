export type TimeoutErrorCountMetricsEventAsPlainObject = {
  tag: string;
  '@type'?: string;
};

export class TimeoutErrorCountMetricsEvent {
  get sizeByte(): string {
    return this._plainObj.tag;
  }

  private _plainObj: TimeoutErrorCountMetricsEventAsPlainObject;

  constructor(plainObj: TimeoutErrorCountMetricsEventAsPlainObject) {
    plainObj['@type'] = 'type.googleapis.com/bucketeer.event.client.TimeoutErrorCountMetricsEvent';
    this._plainObj = plainObj;
  }

  toPlainObject(): TimeoutErrorCountMetricsEventAsPlainObject {
    return this._plainObj;
  }
}
