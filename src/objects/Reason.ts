export enum ReasonType {
  TARGET = 'TARGET',
  RULE = 'RULE',
  DEFAULT = 'DEFAULT',
  CLIENT = 'CLIENT',
  OFF_VARIATION = 'OFF_VARIATION',
}

export type ReasonAsPlainObject = {
  type: ReasonType;
};

export class Reason {
  get type(): ReasonType {
    return this._plainObj.type;
  }

  static convTypeToNumber(type: ReasonType): number {
    switch (type) {
      case ReasonType.TARGET:
        return 0;
      case ReasonType.RULE:
        return 1;
      case ReasonType.DEFAULT:
        return 3;
      case ReasonType.CLIENT:
        return 4;
      case ReasonType.OFF_VARIATION:
        return 5;
    }
  }

  private _plainObj: ReasonAsPlainObject;

  constructor(plainObj: ReasonAsPlainObject) {
    this._plainObj = plainObj;
  }

  toPlainObject(): ReasonAsPlainObject {
    return this._plainObj;
  }
}
