export type UserAsPlainObject = {
  id: string;
  data: { [key: string]: string };
};

export class User {
  get id(): string {
    return this._plainObj.id;
  }

  get data(): { [key: string]: string } {
    return this._plainObj.data;
  }

  private _plainObj: UserAsPlainObject;

  constructor(plainObj: UserAsPlainObject) {
    this._plainObj = plainObj;
  }

  toPlainObject(): UserAsPlainObject {
    return this._plainObj;
  }
}
