// package: bucketeer.feature
// file: proto/feature/service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as proto_feature_command_pb from '../../proto/feature/command_pb';
import * as proto_feature_feature_pb from '../../proto/feature/feature_pb';
import * as proto_feature_evaluation_pb from '../../proto/feature/evaluation_pb';
import * as proto_user_user_pb from '../../proto/user/user_pb';
import * as proto_feature_segment_pb from '../../proto/feature/segment_pb';

export class SearchFeaturesRequest extends jspb.Message {
  getKeyword(): string;
  setKeyword(value: string): SearchFeaturesRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): SearchFeaturesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchFeaturesRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SearchFeaturesRequest,
  ): SearchFeaturesRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: SearchFeaturesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchFeaturesRequest;
  static deserializeBinaryFromReader(
    message: SearchFeaturesRequest,
    reader: jspb.BinaryReader,
  ): SearchFeaturesRequest;
}

export namespace SearchFeaturesRequest {
  export type AsObject = {
    keyword: string;
    environmentNamespace: string;
  };
}

export class SearchFeaturesResponse extends jspb.Message {
  clearFeaturesList(): void;
  getFeaturesList(): Array<proto_feature_feature_pb.Feature>;
  setFeaturesList(value: Array<proto_feature_feature_pb.Feature>): SearchFeaturesResponse;
  addFeatures(
    value?: proto_feature_feature_pb.Feature,
    index?: number,
  ): proto_feature_feature_pb.Feature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchFeaturesResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SearchFeaturesResponse,
  ): SearchFeaturesResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: SearchFeaturesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchFeaturesResponse;
  static deserializeBinaryFromReader(
    message: SearchFeaturesResponse,
    reader: jspb.BinaryReader,
  ): SearchFeaturesResponse;
}

export namespace SearchFeaturesResponse {
  export type AsObject = {
    featuresList: Array<proto_feature_feature_pb.Feature.AsObject>;
  };
}

export class GetFeatureRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetFeatureRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): GetFeatureRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeatureRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeatureRequest): GetFeatureRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetFeatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeatureRequest;
  static deserializeBinaryFromReader(
    message: GetFeatureRequest,
    reader: jspb.BinaryReader,
  ): GetFeatureRequest;
}

export namespace GetFeatureRequest {
  export type AsObject = {
    id: string;
    environmentNamespace: string;
  };
}

export class GetFeatureResponse extends jspb.Message {
  hasFeature(): boolean;
  clearFeature(): void;
  getFeature(): proto_feature_feature_pb.Feature | undefined;
  setFeature(value?: proto_feature_feature_pb.Feature): GetFeatureResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeatureResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeatureResponse): GetFeatureResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetFeatureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeatureResponse;
  static deserializeBinaryFromReader(
    message: GetFeatureResponse,
    reader: jspb.BinaryReader,
  ): GetFeatureResponse;
}

export namespace GetFeatureResponse {
  export type AsObject = {
    feature?: proto_feature_feature_pb.Feature.AsObject;
  };
}

export class GetFeaturesRequest extends jspb.Message {
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): GetFeaturesRequest;
  clearIdsList(): void;
  getIdsList(): Array<string>;
  setIdsList(value: Array<string>): GetFeaturesRequest;
  addIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeaturesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeaturesRequest): GetFeaturesRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetFeaturesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeaturesRequest;
  static deserializeBinaryFromReader(
    message: GetFeaturesRequest,
    reader: jspb.BinaryReader,
  ): GetFeaturesRequest;
}

export namespace GetFeaturesRequest {
  export type AsObject = {
    environmentNamespace: string;
    idsList: Array<string>;
  };
}

export class GetFeaturesResponse extends jspb.Message {
  clearFeaturesList(): void;
  getFeaturesList(): Array<proto_feature_feature_pb.Feature>;
  setFeaturesList(value: Array<proto_feature_feature_pb.Feature>): GetFeaturesResponse;
  addFeatures(
    value?: proto_feature_feature_pb.Feature,
    index?: number,
  ): proto_feature_feature_pb.Feature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeaturesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeaturesResponse): GetFeaturesResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetFeaturesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeaturesResponse;
  static deserializeBinaryFromReader(
    message: GetFeaturesResponse,
    reader: jspb.BinaryReader,
  ): GetFeaturesResponse;
}

export namespace GetFeaturesResponse {
  export type AsObject = {
    featuresList: Array<proto_feature_feature_pb.Feature.AsObject>;
  };
}

export class ListFeaturesRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): ListFeaturesRequest;
  getCursor(): string;
  setCursor(value: string): ListFeaturesRequest;
  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): ListFeaturesRequest;
  addTags(value: string, index?: number): string;
  getOrderBy(): ListFeaturesRequest.OrderBy;
  setOrderBy(value: ListFeaturesRequest.OrderBy): ListFeaturesRequest;
  getOrderDirection(): ListFeaturesRequest.OrderDirection;
  setOrderDirection(value: ListFeaturesRequest.OrderDirection): ListFeaturesRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): ListFeaturesRequest;
  getMaintainer(): string;
  setMaintainer(value: string): ListFeaturesRequest;

  hasEnabled(): boolean;
  clearEnabled(): void;
  getEnabled(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setEnabled(value?: google_protobuf_wrappers_pb.BoolValue): ListFeaturesRequest;

  hasHasExperiment(): boolean;
  clearHasExperiment(): void;
  getHasExperiment(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setHasExperiment(value?: google_protobuf_wrappers_pb.BoolValue): ListFeaturesRequest;
  getSearchKeyword(): string;
  setSearchKeyword(value: string): ListFeaturesRequest;

  hasArchived(): boolean;
  clearArchived(): void;
  getArchived(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setArchived(value?: google_protobuf_wrappers_pb.BoolValue): ListFeaturesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListFeaturesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListFeaturesRequest): ListFeaturesRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ListFeaturesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListFeaturesRequest;
  static deserializeBinaryFromReader(
    message: ListFeaturesRequest,
    reader: jspb.BinaryReader,
  ): ListFeaturesRequest;
}

export namespace ListFeaturesRequest {
  export type AsObject = {
    pageSize: number;
    cursor: string;
    tagsList: Array<string>;
    orderBy: ListFeaturesRequest.OrderBy;
    orderDirection: ListFeaturesRequest.OrderDirection;
    environmentNamespace: string;
    maintainer: string;
    enabled?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    hasExperiment?: google_protobuf_wrappers_pb.BoolValue.AsObject;
    searchKeyword: string;
    archived?: google_protobuf_wrappers_pb.BoolValue.AsObject;
  };

  export enum OrderBy {
    DEFAULT = 0,
    NAME = 1,
    CREATED_AT = 2,
    UPDATED_AT = 3,
    TAGS = 4,
    ENABLED = 5,
  }

  export enum OrderDirection {
    ASC = 0,
    DESC = 1,
  }
}

export class ListFeaturesResponse extends jspb.Message {
  clearFeaturesList(): void;
  getFeaturesList(): Array<proto_feature_feature_pb.Feature>;
  setFeaturesList(value: Array<proto_feature_feature_pb.Feature>): ListFeaturesResponse;
  addFeatures(
    value?: proto_feature_feature_pb.Feature,
    index?: number,
  ): proto_feature_feature_pb.Feature;
  getCursor(): string;
  setCursor(value: string): ListFeaturesResponse;
  getTotalCount(): number;
  setTotalCount(value: number): ListFeaturesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListFeaturesResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ListFeaturesResponse,
  ): ListFeaturesResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ListFeaturesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListFeaturesResponse;
  static deserializeBinaryFromReader(
    message: ListFeaturesResponse,
    reader: jspb.BinaryReader,
  ): ListFeaturesResponse;
}

export namespace ListFeaturesResponse {
  export type AsObject = {
    featuresList: Array<proto_feature_feature_pb.Feature.AsObject>;
    cursor: string;
    totalCount: number;
  };
}

export class ListEnabledFeaturesRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): ListEnabledFeaturesRequest;
  getCursor(): string;
  setCursor(value: string): ListEnabledFeaturesRequest;
  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): ListEnabledFeaturesRequest;
  addTags(value: string, index?: number): string;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): ListEnabledFeaturesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListEnabledFeaturesRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ListEnabledFeaturesRequest,
  ): ListEnabledFeaturesRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ListEnabledFeaturesRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ListEnabledFeaturesRequest;
  static deserializeBinaryFromReader(
    message: ListEnabledFeaturesRequest,
    reader: jspb.BinaryReader,
  ): ListEnabledFeaturesRequest;
}

export namespace ListEnabledFeaturesRequest {
  export type AsObject = {
    pageSize: number;
    cursor: string;
    tagsList: Array<string>;
    environmentNamespace: string;
  };
}

export class ListEnabledFeaturesResponse extends jspb.Message {
  clearFeaturesList(): void;
  getFeaturesList(): Array<proto_feature_feature_pb.Feature>;
  setFeaturesList(value: Array<proto_feature_feature_pb.Feature>): ListEnabledFeaturesResponse;
  addFeatures(
    value?: proto_feature_feature_pb.Feature,
    index?: number,
  ): proto_feature_feature_pb.Feature;
  getCursor(): string;
  setCursor(value: string): ListEnabledFeaturesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListEnabledFeaturesResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ListEnabledFeaturesResponse,
  ): ListEnabledFeaturesResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ListEnabledFeaturesResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ListEnabledFeaturesResponse;
  static deserializeBinaryFromReader(
    message: ListEnabledFeaturesResponse,
    reader: jspb.BinaryReader,
  ): ListEnabledFeaturesResponse;
}

export namespace ListEnabledFeaturesResponse {
  export type AsObject = {
    featuresList: Array<proto_feature_feature_pb.Feature.AsObject>;
    cursor: string;
  };
}

export class CreateFeatureRequest extends jspb.Message {
  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.CreateFeatureCommand | undefined;
  setCommand(value?: proto_feature_command_pb.CreateFeatureCommand): CreateFeatureRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): CreateFeatureRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFeatureRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateFeatureRequest,
  ): CreateFeatureRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: CreateFeatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFeatureRequest;
  static deserializeBinaryFromReader(
    message: CreateFeatureRequest,
    reader: jspb.BinaryReader,
  ): CreateFeatureRequest;
}

export namespace CreateFeatureRequest {
  export type AsObject = {
    command?: proto_feature_command_pb.CreateFeatureCommand.AsObject;
    environmentNamespace: string;
  };
}

export class CreateFeatureResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFeatureResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateFeatureResponse,
  ): CreateFeatureResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: CreateFeatureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFeatureResponse;
  static deserializeBinaryFromReader(
    message: CreateFeatureResponse,
    reader: jspb.BinaryReader,
  ): CreateFeatureResponse;
}

export namespace CreateFeatureResponse {
  export type AsObject = {};
}

export class EnableFeatureRequest extends jspb.Message {
  getId(): string;
  setId(value: string): EnableFeatureRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.EnableFeatureCommand | undefined;
  setCommand(value?: proto_feature_command_pb.EnableFeatureCommand): EnableFeatureRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): EnableFeatureRequest;
  getComment(): string;
  setComment(value: string): EnableFeatureRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnableFeatureRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EnableFeatureRequest,
  ): EnableFeatureRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: EnableFeatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnableFeatureRequest;
  static deserializeBinaryFromReader(
    message: EnableFeatureRequest,
    reader: jspb.BinaryReader,
  ): EnableFeatureRequest;
}

export namespace EnableFeatureRequest {
  export type AsObject = {
    id: string;
    command?: proto_feature_command_pb.EnableFeatureCommand.AsObject;
    environmentNamespace: string;
    comment: string;
  };
}

export class EnableFeatureResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnableFeatureResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EnableFeatureResponse,
  ): EnableFeatureResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: EnableFeatureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnableFeatureResponse;
  static deserializeBinaryFromReader(
    message: EnableFeatureResponse,
    reader: jspb.BinaryReader,
  ): EnableFeatureResponse;
}

export namespace EnableFeatureResponse {
  export type AsObject = {};
}

export class DisableFeatureRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DisableFeatureRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.DisableFeatureCommand | undefined;
  setCommand(value?: proto_feature_command_pb.DisableFeatureCommand): DisableFeatureRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): DisableFeatureRequest;
  getComment(): string;
  setComment(value: string): DisableFeatureRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisableFeatureRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DisableFeatureRequest,
  ): DisableFeatureRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DisableFeatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisableFeatureRequest;
  static deserializeBinaryFromReader(
    message: DisableFeatureRequest,
    reader: jspb.BinaryReader,
  ): DisableFeatureRequest;
}

export namespace DisableFeatureRequest {
  export type AsObject = {
    id: string;
    command?: proto_feature_command_pb.DisableFeatureCommand.AsObject;
    environmentNamespace: string;
    comment: string;
  };
}

export class DisableFeatureResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisableFeatureResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DisableFeatureResponse,
  ): DisableFeatureResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DisableFeatureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisableFeatureResponse;
  static deserializeBinaryFromReader(
    message: DisableFeatureResponse,
    reader: jspb.BinaryReader,
  ): DisableFeatureResponse;
}

export namespace DisableFeatureResponse {
  export type AsObject = {};
}

export class ArchiveFeatureRequest extends jspb.Message {
  getId(): string;
  setId(value: string): ArchiveFeatureRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.ArchiveFeatureCommand | undefined;
  setCommand(value?: proto_feature_command_pb.ArchiveFeatureCommand): ArchiveFeatureRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): ArchiveFeatureRequest;
  getComment(): string;
  setComment(value: string): ArchiveFeatureRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArchiveFeatureRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ArchiveFeatureRequest,
  ): ArchiveFeatureRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ArchiveFeatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArchiveFeatureRequest;
  static deserializeBinaryFromReader(
    message: ArchiveFeatureRequest,
    reader: jspb.BinaryReader,
  ): ArchiveFeatureRequest;
}

export namespace ArchiveFeatureRequest {
  export type AsObject = {
    id: string;
    command?: proto_feature_command_pb.ArchiveFeatureCommand.AsObject;
    environmentNamespace: string;
    comment: string;
  };
}

export class ArchiveFeatureResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArchiveFeatureResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ArchiveFeatureResponse,
  ): ArchiveFeatureResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ArchiveFeatureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArchiveFeatureResponse;
  static deserializeBinaryFromReader(
    message: ArchiveFeatureResponse,
    reader: jspb.BinaryReader,
  ): ArchiveFeatureResponse;
}

export namespace ArchiveFeatureResponse {
  export type AsObject = {};
}

export class DeleteFeatureRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteFeatureRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.DeleteFeatureCommand | undefined;
  setCommand(value?: proto_feature_command_pb.DeleteFeatureCommand): DeleteFeatureRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): DeleteFeatureRequest;
  getComment(): string;
  setComment(value: string): DeleteFeatureRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFeatureRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteFeatureRequest,
  ): DeleteFeatureRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteFeatureRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFeatureRequest;
  static deserializeBinaryFromReader(
    message: DeleteFeatureRequest,
    reader: jspb.BinaryReader,
  ): DeleteFeatureRequest;
}

export namespace DeleteFeatureRequest {
  export type AsObject = {
    id: string;
    command?: proto_feature_command_pb.DeleteFeatureCommand.AsObject;
    environmentNamespace: string;
    comment: string;
  };
}

export class DeleteFeatureResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFeatureResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteFeatureResponse,
  ): DeleteFeatureResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteFeatureResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFeatureResponse;
  static deserializeBinaryFromReader(
    message: DeleteFeatureResponse,
    reader: jspb.BinaryReader,
  ): DeleteFeatureResponse;
}

export namespace DeleteFeatureResponse {
  export type AsObject = {};
}

export class UpdateFeatureDetailsRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateFeatureDetailsRequest;

  hasRenameFeatureCommand(): boolean;
  clearRenameFeatureCommand(): void;
  getRenameFeatureCommand(): proto_feature_command_pb.RenameFeatureCommand | undefined;
  setRenameFeatureCommand(
    value?: proto_feature_command_pb.RenameFeatureCommand,
  ): UpdateFeatureDetailsRequest;

  hasChangeDescriptionCommand(): boolean;
  clearChangeDescriptionCommand(): void;
  getChangeDescriptionCommand(): proto_feature_command_pb.ChangeDescriptionCommand | undefined;
  setChangeDescriptionCommand(
    value?: proto_feature_command_pb.ChangeDescriptionCommand,
  ): UpdateFeatureDetailsRequest;
  clearAddTagCommandsList(): void;
  getAddTagCommandsList(): Array<proto_feature_command_pb.AddTagCommand>;
  setAddTagCommandsList(
    value: Array<proto_feature_command_pb.AddTagCommand>,
  ): UpdateFeatureDetailsRequest;
  addAddTagCommands(
    value?: proto_feature_command_pb.AddTagCommand,
    index?: number,
  ): proto_feature_command_pb.AddTagCommand;
  clearRemoveTagCommandsList(): void;
  getRemoveTagCommandsList(): Array<proto_feature_command_pb.RemoveTagCommand>;
  setRemoveTagCommandsList(
    value: Array<proto_feature_command_pb.RemoveTagCommand>,
  ): UpdateFeatureDetailsRequest;
  addRemoveTagCommands(
    value?: proto_feature_command_pb.RemoveTagCommand,
    index?: number,
  ): proto_feature_command_pb.RemoveTagCommand;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): UpdateFeatureDetailsRequest;
  getComment(): string;
  setComment(value: string): UpdateFeatureDetailsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFeatureDetailsRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateFeatureDetailsRequest,
  ): UpdateFeatureDetailsRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpdateFeatureDetailsRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFeatureDetailsRequest;
  static deserializeBinaryFromReader(
    message: UpdateFeatureDetailsRequest,
    reader: jspb.BinaryReader,
  ): UpdateFeatureDetailsRequest;
}

export namespace UpdateFeatureDetailsRequest {
  export type AsObject = {
    id: string;
    renameFeatureCommand?: proto_feature_command_pb.RenameFeatureCommand.AsObject;
    changeDescriptionCommand?: proto_feature_command_pb.ChangeDescriptionCommand.AsObject;
    addTagCommandsList: Array<proto_feature_command_pb.AddTagCommand.AsObject>;
    removeTagCommandsList: Array<proto_feature_command_pb.RemoveTagCommand.AsObject>;
    environmentNamespace: string;
    comment: string;
  };
}

export class UpdateFeatureDetailsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFeatureDetailsResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateFeatureDetailsResponse,
  ): UpdateFeatureDetailsResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpdateFeatureDetailsResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFeatureDetailsResponse;
  static deserializeBinaryFromReader(
    message: UpdateFeatureDetailsResponse,
    reader: jspb.BinaryReader,
  ): UpdateFeatureDetailsResponse;
}

export namespace UpdateFeatureDetailsResponse {
  export type AsObject = {};
}

export class UpdateFeatureVariationsRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateFeatureVariationsRequest;
  clearCommandsList(): void;
  getCommandsList(): Array<proto_feature_command_pb.Command>;
  setCommandsList(value: Array<proto_feature_command_pb.Command>): UpdateFeatureVariationsRequest;
  addCommands(
    value?: proto_feature_command_pb.Command,
    index?: number,
  ): proto_feature_command_pb.Command;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): UpdateFeatureVariationsRequest;
  getComment(): string;
  setComment(value: string): UpdateFeatureVariationsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFeatureVariationsRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateFeatureVariationsRequest,
  ): UpdateFeatureVariationsRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpdateFeatureVariationsRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFeatureVariationsRequest;
  static deserializeBinaryFromReader(
    message: UpdateFeatureVariationsRequest,
    reader: jspb.BinaryReader,
  ): UpdateFeatureVariationsRequest;
}

export namespace UpdateFeatureVariationsRequest {
  export type AsObject = {
    id: string;
    commandsList: Array<proto_feature_command_pb.Command.AsObject>;
    environmentNamespace: string;
    comment: string;
  };
}

export class UpdateFeatureVariationsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFeatureVariationsResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateFeatureVariationsResponse,
  ): UpdateFeatureVariationsResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpdateFeatureVariationsResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFeatureVariationsResponse;
  static deserializeBinaryFromReader(
    message: UpdateFeatureVariationsResponse,
    reader: jspb.BinaryReader,
  ): UpdateFeatureVariationsResponse;
}

export namespace UpdateFeatureVariationsResponse {
  export type AsObject = {};
}

export class UpdateFeatureTargetingRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateFeatureTargetingRequest;
  clearCommandsList(): void;
  getCommandsList(): Array<proto_feature_command_pb.Command>;
  setCommandsList(value: Array<proto_feature_command_pb.Command>): UpdateFeatureTargetingRequest;
  addCommands(
    value?: proto_feature_command_pb.Command,
    index?: number,
  ): proto_feature_command_pb.Command;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): UpdateFeatureTargetingRequest;
  getComment(): string;
  setComment(value: string): UpdateFeatureTargetingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFeatureTargetingRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateFeatureTargetingRequest,
  ): UpdateFeatureTargetingRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpdateFeatureTargetingRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFeatureTargetingRequest;
  static deserializeBinaryFromReader(
    message: UpdateFeatureTargetingRequest,
    reader: jspb.BinaryReader,
  ): UpdateFeatureTargetingRequest;
}

export namespace UpdateFeatureTargetingRequest {
  export type AsObject = {
    id: string;
    commandsList: Array<proto_feature_command_pb.Command.AsObject>;
    environmentNamespace: string;
    comment: string;
  };
}

export class UpdateFeatureTargetingResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFeatureTargetingResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateFeatureTargetingResponse,
  ): UpdateFeatureTargetingResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpdateFeatureTargetingResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFeatureTargetingResponse;
  static deserializeBinaryFromReader(
    message: UpdateFeatureTargetingResponse,
    reader: jspb.BinaryReader,
  ): UpdateFeatureTargetingResponse;
}

export namespace UpdateFeatureTargetingResponse {
  export type AsObject = {};
}

export class CreateSegmentRequest extends jspb.Message {
  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.CreateSegmentCommand | undefined;
  setCommand(value?: proto_feature_command_pb.CreateSegmentCommand): CreateSegmentRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): CreateSegmentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateSegmentRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateSegmentRequest,
  ): CreateSegmentRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: CreateSegmentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateSegmentRequest;
  static deserializeBinaryFromReader(
    message: CreateSegmentRequest,
    reader: jspb.BinaryReader,
  ): CreateSegmentRequest;
}

export namespace CreateSegmentRequest {
  export type AsObject = {
    command?: proto_feature_command_pb.CreateSegmentCommand.AsObject;
    environmentNamespace: string;
  };
}

export class CreateSegmentResponse extends jspb.Message {
  hasSegment(): boolean;
  clearSegment(): void;
  getSegment(): proto_feature_segment_pb.Segment | undefined;
  setSegment(value?: proto_feature_segment_pb.Segment): CreateSegmentResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateSegmentResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateSegmentResponse,
  ): CreateSegmentResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: CreateSegmentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateSegmentResponse;
  static deserializeBinaryFromReader(
    message: CreateSegmentResponse,
    reader: jspb.BinaryReader,
  ): CreateSegmentResponse;
}

export namespace CreateSegmentResponse {
  export type AsObject = {
    segment?: proto_feature_segment_pb.Segment.AsObject;
  };
}

export class GetSegmentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetSegmentRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): GetSegmentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSegmentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSegmentRequest): GetSegmentRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetSegmentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSegmentRequest;
  static deserializeBinaryFromReader(
    message: GetSegmentRequest,
    reader: jspb.BinaryReader,
  ): GetSegmentRequest;
}

export namespace GetSegmentRequest {
  export type AsObject = {
    id: string;
    environmentNamespace: string;
  };
}

export class GetSegmentResponse extends jspb.Message {
  hasSegment(): boolean;
  clearSegment(): void;
  getSegment(): proto_feature_segment_pb.Segment | undefined;
  setSegment(value?: proto_feature_segment_pb.Segment): GetSegmentResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSegmentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSegmentResponse): GetSegmentResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetSegmentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSegmentResponse;
  static deserializeBinaryFromReader(
    message: GetSegmentResponse,
    reader: jspb.BinaryReader,
  ): GetSegmentResponse;
}

export namespace GetSegmentResponse {
  export type AsObject = {
    segment?: proto_feature_segment_pb.Segment.AsObject;
  };
}

export class ListSegmentsRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): ListSegmentsRequest;
  getCursor(): string;
  setCursor(value: string): ListSegmentsRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): ListSegmentsRequest;
  getOrderBy(): ListSegmentsRequest.OrderBy;
  setOrderBy(value: ListSegmentsRequest.OrderBy): ListSegmentsRequest;
  getOrderDirection(): ListSegmentsRequest.OrderDirection;
  setOrderDirection(value: ListSegmentsRequest.OrderDirection): ListSegmentsRequest;
  getSearchKeyword(): string;
  setSearchKeyword(value: string): ListSegmentsRequest;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): google_protobuf_wrappers_pb.Int32Value | undefined;
  setStatus(value?: google_protobuf_wrappers_pb.Int32Value): ListSegmentsRequest;

  hasIsInUseStatus(): boolean;
  clearIsInUseStatus(): void;
  getIsInUseStatus(): google_protobuf_wrappers_pb.BoolValue | undefined;
  setIsInUseStatus(value?: google_protobuf_wrappers_pb.BoolValue): ListSegmentsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSegmentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListSegmentsRequest): ListSegmentsRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ListSegmentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSegmentsRequest;
  static deserializeBinaryFromReader(
    message: ListSegmentsRequest,
    reader: jspb.BinaryReader,
  ): ListSegmentsRequest;
}

export namespace ListSegmentsRequest {
  export type AsObject = {
    pageSize: number;
    cursor: string;
    environmentNamespace: string;
    orderBy: ListSegmentsRequest.OrderBy;
    orderDirection: ListSegmentsRequest.OrderDirection;
    searchKeyword: string;
    status?: google_protobuf_wrappers_pb.Int32Value.AsObject;
    isInUseStatus?: google_protobuf_wrappers_pb.BoolValue.AsObject;
  };

  export enum OrderBy {
    DEFAULT = 0,
    NAME = 1,
    CREATED_AT = 2,
    UPDATED_AT = 3,
  }

  export enum OrderDirection {
    ASC = 0,
    DESC = 1,
  }
}

export class ListSegmentsResponse extends jspb.Message {
  clearSegmentsList(): void;
  getSegmentsList(): Array<proto_feature_segment_pb.Segment>;
  setSegmentsList(value: Array<proto_feature_segment_pb.Segment>): ListSegmentsResponse;
  addSegments(
    value?: proto_feature_segment_pb.Segment,
    index?: number,
  ): proto_feature_segment_pb.Segment;
  getCursor(): string;
  setCursor(value: string): ListSegmentsResponse;
  getTotalCount(): number;
  setTotalCount(value: number): ListSegmentsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSegmentsResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ListSegmentsResponse,
  ): ListSegmentsResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ListSegmentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSegmentsResponse;
  static deserializeBinaryFromReader(
    message: ListSegmentsResponse,
    reader: jspb.BinaryReader,
  ): ListSegmentsResponse;
}

export namespace ListSegmentsResponse {
  export type AsObject = {
    segmentsList: Array<proto_feature_segment_pb.Segment.AsObject>;
    cursor: string;
    totalCount: number;
  };
}

export class DeleteSegmentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteSegmentRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.DeleteSegmentCommand | undefined;
  setCommand(value?: proto_feature_command_pb.DeleteSegmentCommand): DeleteSegmentRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): DeleteSegmentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSegmentRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteSegmentRequest,
  ): DeleteSegmentRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteSegmentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSegmentRequest;
  static deserializeBinaryFromReader(
    message: DeleteSegmentRequest,
    reader: jspb.BinaryReader,
  ): DeleteSegmentRequest;
}

export namespace DeleteSegmentRequest {
  export type AsObject = {
    id: string;
    command?: proto_feature_command_pb.DeleteSegmentCommand.AsObject;
    environmentNamespace: string;
  };
}

export class DeleteSegmentResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSegmentResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteSegmentResponse,
  ): DeleteSegmentResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteSegmentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSegmentResponse;
  static deserializeBinaryFromReader(
    message: DeleteSegmentResponse,
    reader: jspb.BinaryReader,
  ): DeleteSegmentResponse;
}

export namespace DeleteSegmentResponse {
  export type AsObject = {};
}

export class UpdateSegmentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateSegmentRequest;
  clearCommandsList(): void;
  getCommandsList(): Array<proto_feature_command_pb.Command>;
  setCommandsList(value: Array<proto_feature_command_pb.Command>): UpdateSegmentRequest;
  addCommands(
    value?: proto_feature_command_pb.Command,
    index?: number,
  ): proto_feature_command_pb.Command;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): UpdateSegmentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateSegmentRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateSegmentRequest,
  ): UpdateSegmentRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: UpdateSegmentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateSegmentRequest;
  static deserializeBinaryFromReader(
    message: UpdateSegmentRequest,
    reader: jspb.BinaryReader,
  ): UpdateSegmentRequest;
}

export namespace UpdateSegmentRequest {
  export type AsObject = {
    id: string;
    commandsList: Array<proto_feature_command_pb.Command.AsObject>;
    environmentNamespace: string;
  };
}

export class UpdateSegmentResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateSegmentResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpdateSegmentResponse,
  ): UpdateSegmentResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: UpdateSegmentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateSegmentResponse;
  static deserializeBinaryFromReader(
    message: UpdateSegmentResponse,
    reader: jspb.BinaryReader,
  ): UpdateSegmentResponse;
}

export namespace UpdateSegmentResponse {
  export type AsObject = {};
}

export class AddSegmentUserRequest extends jspb.Message {
  getId(): string;
  setId(value: string): AddSegmentUserRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.AddSegmentUserCommand | undefined;
  setCommand(value?: proto_feature_command_pb.AddSegmentUserCommand): AddSegmentUserRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): AddSegmentUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddSegmentUserRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AddSegmentUserRequest,
  ): AddSegmentUserRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddSegmentUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddSegmentUserRequest;
  static deserializeBinaryFromReader(
    message: AddSegmentUserRequest,
    reader: jspb.BinaryReader,
  ): AddSegmentUserRequest;
}

export namespace AddSegmentUserRequest {
  export type AsObject = {
    id: string;
    command?: proto_feature_command_pb.AddSegmentUserCommand.AsObject;
    environmentNamespace: string;
  };
}

export class AddSegmentUserResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddSegmentUserResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AddSegmentUserResponse,
  ): AddSegmentUserResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddSegmentUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddSegmentUserResponse;
  static deserializeBinaryFromReader(
    message: AddSegmentUserResponse,
    reader: jspb.BinaryReader,
  ): AddSegmentUserResponse;
}

export namespace AddSegmentUserResponse {
  export type AsObject = {};
}

export class DeleteSegmentUserRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteSegmentUserRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.DeleteSegmentUserCommand | undefined;
  setCommand(value?: proto_feature_command_pb.DeleteSegmentUserCommand): DeleteSegmentUserRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): DeleteSegmentUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSegmentUserRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteSegmentUserRequest,
  ): DeleteSegmentUserRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: DeleteSegmentUserRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSegmentUserRequest;
  static deserializeBinaryFromReader(
    message: DeleteSegmentUserRequest,
    reader: jspb.BinaryReader,
  ): DeleteSegmentUserRequest;
}

export namespace DeleteSegmentUserRequest {
  export type AsObject = {
    id: string;
    command?: proto_feature_command_pb.DeleteSegmentUserCommand.AsObject;
    environmentNamespace: string;
  };
}

export class DeleteSegmentUserResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSegmentUserResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteSegmentUserResponse,
  ): DeleteSegmentUserResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: DeleteSegmentUserResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSegmentUserResponse;
  static deserializeBinaryFromReader(
    message: DeleteSegmentUserResponse,
    reader: jspb.BinaryReader,
  ): DeleteSegmentUserResponse;
}

export namespace DeleteSegmentUserResponse {
  export type AsObject = {};
}

export class GetSegmentUserRequest extends jspb.Message {
  getSegmentId(): string;
  setSegmentId(value: string): GetSegmentUserRequest;
  getUserId(): string;
  setUserId(value: string): GetSegmentUserRequest;
  getState(): proto_feature_segment_pb.SegmentUser.State;
  setState(value: proto_feature_segment_pb.SegmentUser.State): GetSegmentUserRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): GetSegmentUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSegmentUserRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetSegmentUserRequest,
  ): GetSegmentUserRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetSegmentUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSegmentUserRequest;
  static deserializeBinaryFromReader(
    message: GetSegmentUserRequest,
    reader: jspb.BinaryReader,
  ): GetSegmentUserRequest;
}

export namespace GetSegmentUserRequest {
  export type AsObject = {
    segmentId: string;
    userId: string;
    state: proto_feature_segment_pb.SegmentUser.State;
    environmentNamespace: string;
  };
}

export class GetSegmentUserResponse extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_feature_segment_pb.SegmentUser | undefined;
  setUser(value?: proto_feature_segment_pb.SegmentUser): GetSegmentUserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSegmentUserResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetSegmentUserResponse,
  ): GetSegmentUserResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetSegmentUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSegmentUserResponse;
  static deserializeBinaryFromReader(
    message: GetSegmentUserResponse,
    reader: jspb.BinaryReader,
  ): GetSegmentUserResponse;
}

export namespace GetSegmentUserResponse {
  export type AsObject = {
    user?: proto_feature_segment_pb.SegmentUser.AsObject;
  };
}

export class ListSegmentUsersRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): ListSegmentUsersRequest;
  getCursor(): string;
  setCursor(value: string): ListSegmentUsersRequest;
  getSegmentId(): string;
  setSegmentId(value: string): ListSegmentUsersRequest;

  hasState(): boolean;
  clearState(): void;
  getState(): google_protobuf_wrappers_pb.Int32Value | undefined;
  setState(value?: google_protobuf_wrappers_pb.Int32Value): ListSegmentUsersRequest;
  getUserId(): string;
  setUserId(value: string): ListSegmentUsersRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): ListSegmentUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSegmentUsersRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ListSegmentUsersRequest,
  ): ListSegmentUsersRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ListSegmentUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSegmentUsersRequest;
  static deserializeBinaryFromReader(
    message: ListSegmentUsersRequest,
    reader: jspb.BinaryReader,
  ): ListSegmentUsersRequest;
}

export namespace ListSegmentUsersRequest {
  export type AsObject = {
    pageSize: number;
    cursor: string;
    segmentId: string;
    state?: google_protobuf_wrappers_pb.Int32Value.AsObject;
    userId: string;
    environmentNamespace: string;
  };
}

export class ListSegmentUsersResponse extends jspb.Message {
  clearUsersList(): void;
  getUsersList(): Array<proto_feature_segment_pb.SegmentUser>;
  setUsersList(value: Array<proto_feature_segment_pb.SegmentUser>): ListSegmentUsersResponse;
  addUsers(
    value?: proto_feature_segment_pb.SegmentUser,
    index?: number,
  ): proto_feature_segment_pb.SegmentUser;
  getCursor(): string;
  setCursor(value: string): ListSegmentUsersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSegmentUsersResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ListSegmentUsersResponse,
  ): ListSegmentUsersResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ListSegmentUsersResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ListSegmentUsersResponse;
  static deserializeBinaryFromReader(
    message: ListSegmentUsersResponse,
    reader: jspb.BinaryReader,
  ): ListSegmentUsersResponse;
}

export namespace ListSegmentUsersResponse {
  export type AsObject = {
    usersList: Array<proto_feature_segment_pb.SegmentUser.AsObject>;
    cursor: string;
  };
}

export class BulkUploadSegmentUsersRequest extends jspb.Message {
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): BulkUploadSegmentUsersRequest;
  getSegmentId(): string;
  setSegmentId(value: string): BulkUploadSegmentUsersRequest;

  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): proto_feature_command_pb.BulkUploadSegmentUsersCommand | undefined;
  setCommand(
    value?: proto_feature_command_pb.BulkUploadSegmentUsersCommand,
  ): BulkUploadSegmentUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BulkUploadSegmentUsersRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BulkUploadSegmentUsersRequest,
  ): BulkUploadSegmentUsersRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BulkUploadSegmentUsersRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BulkUploadSegmentUsersRequest;
  static deserializeBinaryFromReader(
    message: BulkUploadSegmentUsersRequest,
    reader: jspb.BinaryReader,
  ): BulkUploadSegmentUsersRequest;
}

export namespace BulkUploadSegmentUsersRequest {
  export type AsObject = {
    environmentNamespace: string;
    segmentId: string;
    command?: proto_feature_command_pb.BulkUploadSegmentUsersCommand.AsObject;
  };
}

export class BulkUploadSegmentUsersResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BulkUploadSegmentUsersResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BulkUploadSegmentUsersResponse,
  ): BulkUploadSegmentUsersResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BulkUploadSegmentUsersResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BulkUploadSegmentUsersResponse;
  static deserializeBinaryFromReader(
    message: BulkUploadSegmentUsersResponse,
    reader: jspb.BinaryReader,
  ): BulkUploadSegmentUsersResponse;
}

export namespace BulkUploadSegmentUsersResponse {
  export type AsObject = {};
}

export class BulkDownloadSegmentUsersRequest extends jspb.Message {
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): BulkDownloadSegmentUsersRequest;
  getSegmentId(): string;
  setSegmentId(value: string): BulkDownloadSegmentUsersRequest;
  getState(): proto_feature_segment_pb.SegmentUser.State;
  setState(value: proto_feature_segment_pb.SegmentUser.State): BulkDownloadSegmentUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BulkDownloadSegmentUsersRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BulkDownloadSegmentUsersRequest,
  ): BulkDownloadSegmentUsersRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BulkDownloadSegmentUsersRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BulkDownloadSegmentUsersRequest;
  static deserializeBinaryFromReader(
    message: BulkDownloadSegmentUsersRequest,
    reader: jspb.BinaryReader,
  ): BulkDownloadSegmentUsersRequest;
}

export namespace BulkDownloadSegmentUsersRequest {
  export type AsObject = {
    environmentNamespace: string;
    segmentId: string;
    state: proto_feature_segment_pb.SegmentUser.State;
  };
}

export class BulkDownloadSegmentUsersResponse extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): BulkDownloadSegmentUsersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BulkDownloadSegmentUsersResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BulkDownloadSegmentUsersResponse,
  ): BulkDownloadSegmentUsersResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BulkDownloadSegmentUsersResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BulkDownloadSegmentUsersResponse;
  static deserializeBinaryFromReader(
    message: BulkDownloadSegmentUsersResponse,
    reader: jspb.BinaryReader,
  ): BulkDownloadSegmentUsersResponse;
}

export namespace BulkDownloadSegmentUsersResponse {
  export type AsObject = {
    data: Uint8Array | string;
  };
}

export class EvaluateOnAllFeaturesRequest extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_user_user_pb.User | undefined;
  setUser(value?: proto_user_user_pb.User): EvaluateOnAllFeaturesRequest;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): EvaluateOnAllFeaturesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateOnAllFeaturesRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EvaluateOnAllFeaturesRequest,
  ): EvaluateOnAllFeaturesRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: EvaluateOnAllFeaturesRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateOnAllFeaturesRequest;
  static deserializeBinaryFromReader(
    message: EvaluateOnAllFeaturesRequest,
    reader: jspb.BinaryReader,
  ): EvaluateOnAllFeaturesRequest;
}

export namespace EvaluateOnAllFeaturesRequest {
  export type AsObject = {
    user?: proto_user_user_pb.User.AsObject;
    environmentNamespace: string;
  };
}

export class EvaluateOnAllFeaturesResponse extends jspb.Message {
  hasUserEvaluations(): boolean;
  clearUserEvaluations(): void;
  getUserEvaluations(): proto_feature_evaluation_pb.UserEvaluations | undefined;
  setUserEvaluations(
    value?: proto_feature_evaluation_pb.UserEvaluations,
  ): EvaluateOnAllFeaturesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateOnAllFeaturesResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EvaluateOnAllFeaturesResponse,
  ): EvaluateOnAllFeaturesResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: EvaluateOnAllFeaturesResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateOnAllFeaturesResponse;
  static deserializeBinaryFromReader(
    message: EvaluateOnAllFeaturesResponse,
    reader: jspb.BinaryReader,
  ): EvaluateOnAllFeaturesResponse;
}

export namespace EvaluateOnAllFeaturesResponse {
  export type AsObject = {
    userEvaluations?: proto_feature_evaluation_pb.UserEvaluations.AsObject;
  };
}

export class GetUserEvaluationsRequest extends jspb.Message {
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): GetUserEvaluationsRequest;
  getTag(): string;
  setTag(value: string): GetUserEvaluationsRequest;
  getUserId(): string;
  setUserId(value: string): GetUserEvaluationsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserEvaluationsRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetUserEvaluationsRequest,
  ): GetUserEvaluationsRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: GetUserEvaluationsRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetUserEvaluationsRequest;
  static deserializeBinaryFromReader(
    message: GetUserEvaluationsRequest,
    reader: jspb.BinaryReader,
  ): GetUserEvaluationsRequest;
}

export namespace GetUserEvaluationsRequest {
  export type AsObject = {
    environmentNamespace: string;
    tag: string;
    userId: string;
  };
}

export class GetUserEvaluationsResponse extends jspb.Message {
  clearEvaluationsList(): void;
  getEvaluationsList(): Array<proto_feature_evaluation_pb.Evaluation>;
  setEvaluationsList(
    value: Array<proto_feature_evaluation_pb.Evaluation>,
  ): GetUserEvaluationsResponse;
  addEvaluations(
    value?: proto_feature_evaluation_pb.Evaluation,
    index?: number,
  ): proto_feature_evaluation_pb.Evaluation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserEvaluationsResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetUserEvaluationsResponse,
  ): GetUserEvaluationsResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: GetUserEvaluationsResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetUserEvaluationsResponse;
  static deserializeBinaryFromReader(
    message: GetUserEvaluationsResponse,
    reader: jspb.BinaryReader,
  ): GetUserEvaluationsResponse;
}

export namespace GetUserEvaluationsResponse {
  export type AsObject = {
    evaluationsList: Array<proto_feature_evaluation_pb.Evaluation.AsObject>;
  };
}

export class UpsertUserEvaluationRequest extends jspb.Message {
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): UpsertUserEvaluationRequest;
  getTag(): string;
  setTag(value: string): UpsertUserEvaluationRequest;

  hasEvaluation(): boolean;
  clearEvaluation(): void;
  getEvaluation(): proto_feature_evaluation_pb.Evaluation | undefined;
  setEvaluation(value?: proto_feature_evaluation_pb.Evaluation): UpsertUserEvaluationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpsertUserEvaluationRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpsertUserEvaluationRequest,
  ): UpsertUserEvaluationRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpsertUserEvaluationRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpsertUserEvaluationRequest;
  static deserializeBinaryFromReader(
    message: UpsertUserEvaluationRequest,
    reader: jspb.BinaryReader,
  ): UpsertUserEvaluationRequest;
}

export namespace UpsertUserEvaluationRequest {
  export type AsObject = {
    environmentNamespace: string;
    tag: string;
    evaluation?: proto_feature_evaluation_pb.Evaluation.AsObject;
  };
}

export class UpsertUserEvaluationResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpsertUserEvaluationResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UpsertUserEvaluationResponse,
  ): UpsertUserEvaluationResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: UpsertUserEvaluationResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): UpsertUserEvaluationResponse;
  static deserializeBinaryFromReader(
    message: UpsertUserEvaluationResponse,
    reader: jspb.BinaryReader,
  ): UpsertUserEvaluationResponse;
}

export namespace UpsertUserEvaluationResponse {
  export type AsObject = {};
}
