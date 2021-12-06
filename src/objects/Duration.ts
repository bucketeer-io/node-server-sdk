export type DurationAsPlainObject = {
  value: string;
  '@type'?: string;
};

export class Duration {
  get value(): string {
    return this._plainObj.value;
  }

  private _plainObj: DurationAsPlainObject;

  constructor(plainObj: DurationAsPlainObject) {
    plainObj['@type'] = 'type.googleapis.com/google.protobuf.Duration';
    this._plainObj = plainObj;
  }

  toPlainObject(): DurationAsPlainObject {
    return this._plainObj;
  }
}
