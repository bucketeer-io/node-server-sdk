// package: bucketeer.user
// file: proto/user/user.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';

export class User extends jspb.Message {
  getId(): string;
  setId(value: string): User;

  getDataMap(): jspb.Map<string, string>;
  clearDataMap(): void;
  getLastSeen(): number;
  setLastSeen(value: number): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: string;

    dataMap: Array<[string, string]>;
    lastSeen: number;
  };
}

export class UserEntity extends jspb.Message {
  getId(): string;
  setId(value: string): UserEntity;
  clearDataList(): void;
  getDataList(): Array<Data>;
  setDataList(value: Array<Data>): UserEntity;
  addData(value?: Data, index?: number): Data;
  getLastSeen(): number;
  setLastSeen(value: number): UserEntity;
  clearTaggedDataList(): void;
  getTaggedDataList(): Array<TaggedData>;
  setTaggedDataList(value: Array<TaggedData>): UserEntity;
  addTaggedData(value?: TaggedData, index?: number): TaggedData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserEntity.AsObject;
  static toObject(includeInstance: boolean, msg: UserEntity): UserEntity.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: UserEntity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserEntity;
  static deserializeBinaryFromReader(message: UserEntity, reader: jspb.BinaryReader): UserEntity;
}

export namespace UserEntity {
  export type AsObject = {
    id: string;
    dataList: Array<Data.AsObject>;
    lastSeen: number;
    taggedDataList: Array<TaggedData.AsObject>;
  };
}

export class Data extends jspb.Message {
  getKey(): string;
  setKey(value: string): Data;
  getValue(): string;
  setValue(value: string): Data;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Data.AsObject;
  static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Data;
  static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
}

export namespace Data {
  export type AsObject = {
    key: string;
    value: string;
  };
}

export class TaggedData extends jspb.Message {
  getTag(): string;
  setTag(value: string): TaggedData;
  clearDataList(): void;
  getDataList(): Array<Data>;
  setDataList(value: Array<Data>): TaggedData;
  addData(value?: Data, index?: number): Data;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaggedData.AsObject;
  static toObject(includeInstance: boolean, msg: TaggedData): TaggedData.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: TaggedData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaggedData;
  static deserializeBinaryFromReader(message: TaggedData, reader: jspb.BinaryReader): TaggedData;
}

export namespace TaggedData {
  export type AsObject = {
    tag: string;
    dataList: Array<Data.AsObject>;
  };
}
