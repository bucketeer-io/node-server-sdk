// package: bucketeer.feature
// file: proto/feature/segment.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as proto_feature_rule_pb from '../../proto/feature/rule_pb';

export class Segment extends jspb.Message {
  getId(): string;
  setId(value: string): Segment;
  getName(): string;
  setName(value: string): Segment;
  getDescription(): string;
  setDescription(value: string): Segment;
  clearRulesList(): void;
  getRulesList(): Array<proto_feature_rule_pb.Rule>;
  setRulesList(value: Array<proto_feature_rule_pb.Rule>): Segment;
  addRules(value?: proto_feature_rule_pb.Rule, index?: number): proto_feature_rule_pb.Rule;
  getCreatedAt(): number;
  setCreatedAt(value: number): Segment;
  getUpdatedAt(): number;
  setUpdatedAt(value: number): Segment;
  getVersion(): number;
  setVersion(value: number): Segment;
  getDeleted(): boolean;
  setDeleted(value: boolean): Segment;
  getIncludedUserCount(): number;
  setIncludedUserCount(value: number): Segment;
  getExcludedUserCount(): number;
  setExcludedUserCount(value: number): Segment;
  getStatus(): Segment.Status;
  setStatus(value: Segment.Status): Segment;
  getIsInUseStatus(): boolean;
  setIsInUseStatus(value: boolean): Segment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Segment.AsObject;
  static toObject(includeInstance: boolean, msg: Segment): Segment.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Segment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Segment;
  static deserializeBinaryFromReader(message: Segment, reader: jspb.BinaryReader): Segment;
}

export namespace Segment {
  export type AsObject = {
    id: string;
    name: string;
    description: string;
    rulesList: Array<proto_feature_rule_pb.Rule.AsObject>;
    createdAt: number;
    updatedAt: number;
    version: number;
    deleted: boolean;
    includedUserCount: number;
    excludedUserCount: number;
    status: Segment.Status;
    isInUseStatus: boolean;
  };

  export enum Status {
    INITIAL = 0,
    UPLOADING = 1,
    SUCEEDED = 2,
    FAILED = 3,
  }
}

export class SegmentUser extends jspb.Message {
  getId(): string;
  setId(value: string): SegmentUser;
  getSegmentId(): string;
  setSegmentId(value: string): SegmentUser;
  getUserId(): string;
  setUserId(value: string): SegmentUser;
  getState(): SegmentUser.State;
  setState(value: SegmentUser.State): SegmentUser;
  getDeleted(): boolean;
  setDeleted(value: boolean): SegmentUser;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SegmentUser.AsObject;
  static toObject(includeInstance: boolean, msg: SegmentUser): SegmentUser.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: SegmentUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SegmentUser;
  static deserializeBinaryFromReader(message: SegmentUser, reader: jspb.BinaryReader): SegmentUser;
}

export namespace SegmentUser {
  export type AsObject = {
    id: string;
    segmentId: string;
    userId: string;
    state: SegmentUser.State;
    deleted: boolean;
  };

  export enum State {
    INCLUDED = 0,
    EXCLUDED = 1,
  }
}

export class SegmentUsers extends jspb.Message {
  getSegmentId(): string;
  setSegmentId(value: string): SegmentUsers;
  clearUsersList(): void;
  getUsersList(): Array<SegmentUser>;
  setUsersList(value: Array<SegmentUser>): SegmentUsers;
  addUsers(value?: SegmentUser, index?: number): SegmentUser;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SegmentUsers.AsObject;
  static toObject(includeInstance: boolean, msg: SegmentUsers): SegmentUsers.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: SegmentUsers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SegmentUsers;
  static deserializeBinaryFromReader(
    message: SegmentUsers,
    reader: jspb.BinaryReader,
  ): SegmentUsers;
}

export namespace SegmentUsers {
  export type AsObject = {
    segmentId: string;
    usersList: Array<SegmentUser.AsObject>;
  };
}
