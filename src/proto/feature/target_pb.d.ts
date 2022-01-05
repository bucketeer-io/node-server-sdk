// package: bucketeer.feature
// file: proto/feature/target.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';

export class Target extends jspb.Message {
  getVariation(): string;
  setVariation(value: string): Target;
  clearUsersList(): void;
  getUsersList(): Array<string>;
  setUsersList(value: Array<string>): Target;
  addUsers(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Target.AsObject;
  static toObject(includeInstance: boolean, msg: Target): Target.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Target, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Target;
  static deserializeBinaryFromReader(message: Target, reader: jspb.BinaryReader): Target;
}

export namespace Target {
  export type AsObject = {
    variation: string;
    usersList: Array<string>;
  };
}
