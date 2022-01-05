// package: bucketeer.user
// file: proto/user/service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as proto_user_user_pb from '../../proto/user/user_pb';

export class GetUserRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetUserRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): GetUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserRequest): GetUserRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserRequest;
  static deserializeBinaryFromReader(
    message: GetUserRequest,
    reader: jspb.BinaryReader,
  ): GetUserRequest;
}

export namespace GetUserRequest {
  export type AsObject = {
    userId: string;
    environmentNamespace: string;
  };
}

export class GetUserResponse extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_user_user_pb.User | undefined;
  setUser(value?: proto_user_user_pb.User): GetUserResponse;

  hasUserEntity(): boolean;
  clearUserEntity(): void;
  getUserEntity(): proto_user_user_pb.UserEntity | undefined;
  setUserEntity(value?: proto_user_user_pb.UserEntity): GetUserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserResponse): GetUserResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserResponse;
  static deserializeBinaryFromReader(
    message: GetUserResponse,
    reader: jspb.BinaryReader,
  ): GetUserResponse;
}

export namespace GetUserResponse {
  export type AsObject = {
    user?: proto_user_user_pb.User.AsObject;
    userEntity?: proto_user_user_pb.UserEntity.AsObject;
  };
}

export class ListUsersRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): ListUsersRequest;
  getCursor(): string;
  setCursor(value: string): ListUsersRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): ListUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListUsersRequest): ListUsersRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ListUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUsersRequest;
  static deserializeBinaryFromReader(
    message: ListUsersRequest,
    reader: jspb.BinaryReader,
  ): ListUsersRequest;
}

export namespace ListUsersRequest {
  export type AsObject = {
    pageSize: number;
    cursor: string;
    environmentNamespace: string;
  };
}

export class ListUsersResponse extends jspb.Message {
  clearUsersList(): void;
  getUsersList(): Array<proto_user_user_pb.User>;
  setUsersList(value: Array<proto_user_user_pb.User>): ListUsersResponse;
  addUsers(value?: proto_user_user_pb.User, index?: number): proto_user_user_pb.User;
  getCursor(): string;
  setCursor(value: string): ListUsersResponse;
  clearUserEntitiesList(): void;
  getUserEntitiesList(): Array<proto_user_user_pb.UserEntity>;
  setUserEntitiesList(value: Array<proto_user_user_pb.UserEntity>): ListUsersResponse;
  addUserEntities(
    value?: proto_user_user_pb.UserEntity,
    index?: number,
  ): proto_user_user_pb.UserEntity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListUsersResponse): ListUsersResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ListUsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUsersResponse;
  static deserializeBinaryFromReader(
    message: ListUsersResponse,
    reader: jspb.BinaryReader,
  ): ListUsersResponse;
}

export namespace ListUsersResponse {
  export type AsObject = {
    usersList: Array<proto_user_user_pb.User.AsObject>;
    cursor: string;
    userEntitiesList: Array<proto_user_user_pb.UserEntity.AsObject>;
  };
}
