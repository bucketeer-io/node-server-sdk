// package: bucketeer.gateway
// file: proto/gateway/service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as proto_user_user_pb from '../../proto/user/user_pb';
import * as proto_feature_evaluation_pb from '../../proto/feature/evaluation_pb';
import * as proto_event_client_event_pb from '../../proto/event/client/event_pb';

export class PingRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PingRequest): PingRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: PingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingRequest;
  static deserializeBinaryFromReader(message: PingRequest, reader: jspb.BinaryReader): PingRequest;
}

export namespace PingRequest {
  export type AsObject = {};
}

export class PingResponse extends jspb.Message {
  getTime(): number;
  setTime(value: number): PingResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PingResponse): PingResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: PingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingResponse;
  static deserializeBinaryFromReader(
    message: PingResponse,
    reader: jspb.BinaryReader,
  ): PingResponse;
}

export namespace PingResponse {
  export type AsObject = {
    time: number;
  };
}

export class GetEvaluationsRequest extends jspb.Message {
  getTag(): string;
  setTag(value: string): GetEvaluationsRequest;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_user_user_pb.User | undefined;
  setUser(value?: proto_user_user_pb.User): GetEvaluationsRequest;
  getUserEvaluationsId(): string;
  setUserEvaluationsId(value: string): GetEvaluationsRequest;
  getFeatureId(): string;
  setFeatureId(value: string): GetEvaluationsRequest;
  getSourceId(): proto_event_client_event_pb.SourceId;
  setSourceId(value: proto_event_client_event_pb.SourceId): GetEvaluationsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEvaluationsRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetEvaluationsRequest,
  ): GetEvaluationsRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetEvaluationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEvaluationsRequest;
  static deserializeBinaryFromReader(
    message: GetEvaluationsRequest,
    reader: jspb.BinaryReader,
  ): GetEvaluationsRequest;
}

export namespace GetEvaluationsRequest {
  export type AsObject = {
    tag: string;
    user?: proto_user_user_pb.User.AsObject;
    userEvaluationsId: string;
    featureId: string;
    sourceId: proto_event_client_event_pb.SourceId;
  };
}

export class GetEvaluationsResponse extends jspb.Message {
  getState(): proto_feature_evaluation_pb.UserEvaluations.State;
  setState(value: proto_feature_evaluation_pb.UserEvaluations.State): GetEvaluationsResponse;

  hasEvaluations(): boolean;
  clearEvaluations(): void;
  getEvaluations(): proto_feature_evaluation_pb.UserEvaluations | undefined;
  setEvaluations(value?: proto_feature_evaluation_pb.UserEvaluations): GetEvaluationsResponse;
  getUserEvaluationsId(): string;
  setUserEvaluationsId(value: string): GetEvaluationsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEvaluationsResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetEvaluationsResponse,
  ): GetEvaluationsResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetEvaluationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEvaluationsResponse;
  static deserializeBinaryFromReader(
    message: GetEvaluationsResponse,
    reader: jspb.BinaryReader,
  ): GetEvaluationsResponse;
}

export namespace GetEvaluationsResponse {
  export type AsObject = {
    state: proto_feature_evaluation_pb.UserEvaluations.State;
    evaluations?: proto_feature_evaluation_pb.UserEvaluations.AsObject;
    userEvaluationsId: string;
  };
}

export class GetEvaluationRequest extends jspb.Message {
  getTag(): string;
  setTag(value: string): GetEvaluationRequest;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_user_user_pb.User | undefined;
  setUser(value?: proto_user_user_pb.User): GetEvaluationRequest;
  getFeatureId(): string;
  setFeatureId(value: string): GetEvaluationRequest;
  getSourceId(): proto_event_client_event_pb.SourceId;
  setSourceId(value: proto_event_client_event_pb.SourceId): GetEvaluationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEvaluationRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetEvaluationRequest,
  ): GetEvaluationRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetEvaluationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEvaluationRequest;
  static deserializeBinaryFromReader(
    message: GetEvaluationRequest,
    reader: jspb.BinaryReader,
  ): GetEvaluationRequest;
}

export namespace GetEvaluationRequest {
  export type AsObject = {
    tag: string;
    user?: proto_user_user_pb.User.AsObject;
    featureId: string;
    sourceId: proto_event_client_event_pb.SourceId;
  };
}

export class GetEvaluationResponse extends jspb.Message {
  hasEvaluation(): boolean;
  clearEvaluation(): void;
  getEvaluation(): proto_feature_evaluation_pb.Evaluation | undefined;
  setEvaluation(value?: proto_feature_evaluation_pb.Evaluation): GetEvaluationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEvaluationResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetEvaluationResponse,
  ): GetEvaluationResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GetEvaluationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEvaluationResponse;
  static deserializeBinaryFromReader(
    message: GetEvaluationResponse,
    reader: jspb.BinaryReader,
  ): GetEvaluationResponse;
}

export namespace GetEvaluationResponse {
  export type AsObject = {
    evaluation?: proto_feature_evaluation_pb.Evaluation.AsObject;
  };
}

export class RegisterEventsRequest extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<proto_event_client_event_pb.Event>;
  setEventsList(value: Array<proto_event_client_event_pb.Event>): RegisterEventsRequest;
  addEvents(
    value?: proto_event_client_event_pb.Event,
    index?: number,
  ): proto_event_client_event_pb.Event;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterEventsRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RegisterEventsRequest,
  ): RegisterEventsRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: RegisterEventsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterEventsRequest;
  static deserializeBinaryFromReader(
    message: RegisterEventsRequest,
    reader: jspb.BinaryReader,
  ): RegisterEventsRequest;
}

export namespace RegisterEventsRequest {
  export type AsObject = {
    eventsList: Array<proto_event_client_event_pb.Event.AsObject>;
  };
}

export class RegisterEventsResponse extends jspb.Message {
  getErrorsMap(): jspb.Map<string, RegisterEventsResponse.Error>;
  clearErrorsMap(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterEventsResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RegisterEventsResponse,
  ): RegisterEventsResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: RegisterEventsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterEventsResponse;
  static deserializeBinaryFromReader(
    message: RegisterEventsResponse,
    reader: jspb.BinaryReader,
  ): RegisterEventsResponse;
}

export namespace RegisterEventsResponse {
  export type AsObject = {
    errorsMap: Array<[string, RegisterEventsResponse.Error.AsObject]>;
  };

  export class Error extends jspb.Message {
    getRetriable(): boolean;
    setRetriable(value: boolean): Error;
    getMessage(): string;
    setMessage(value: string): Error;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Error.AsObject;
    static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Error;
    static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
  }

  export namespace Error {
    export type AsObject = {
      retriable: boolean;
      message: string;
    };
  }
}
