export type InternalErrorCountMetricsEventAsPlainObject = {
  tag: string;
  '@type'?: string;
};

export class InternalErrorCountMetricsEvent {
  get sizeByte(): string {
    return this._plainObj.tag;
  }

  private _plainObj: InternalErrorCountMetricsEventAsPlainObject;

  constructor(plainObj: InternalErrorCountMetricsEventAsPlainObject) {
    plainObj['@type'] = 'type.googleapis.com/bucketeer.event.client.InternalErrorCountMetricsEvent';
    this._plainObj = plainObj;
  }

  toPlainObject(): InternalErrorCountMetricsEventAsPlainObject {
    return this._plainObj;
  }
}
