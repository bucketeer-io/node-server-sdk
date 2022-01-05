// package: bucketeer.event.client
// file: proto/event/client/event.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';
import * as proto_feature_evaluation_pb from '../../../proto/feature/evaluation_pb';
import * as proto_feature_reason_pb from '../../../proto/feature/reason_pb';
import * as proto_user_user_pb from '../../../proto/user/user_pb';

export class Event extends jspb.Message {
  getId(): string;
  setId(value: string): Event;

  hasEvent(): boolean;
  clearEvent(): void;
  getEvent(): google_protobuf_any_pb.Any | undefined;
  setEvent(value?: google_protobuf_any_pb.Any): Event;
  getEnvironmentNamespace(): string;
  setEnvironmentNamespace(value: string): Event;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    id: string;
    event?: google_protobuf_any_pb.Any.AsObject;
    environmentNamespace: string;
  };
}

export class EvaluationEvent extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): EvaluationEvent;
  getFeatureId(): string;
  setFeatureId(value: string): EvaluationEvent;
  getFeatureVersion(): number;
  setFeatureVersion(value: number): EvaluationEvent;
  getUserId(): string;
  setUserId(value: string): EvaluationEvent;
  getVariationId(): string;
  setVariationId(value: string): EvaluationEvent;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_user_user_pb.User | undefined;
  setUser(value?: proto_user_user_pb.User): EvaluationEvent;

  hasReason(): boolean;
  clearReason(): void;
  getReason(): proto_feature_reason_pb.Reason | undefined;
  setReason(value?: proto_feature_reason_pb.Reason): EvaluationEvent;
  getTag(): string;
  setTag(value: string): EvaluationEvent;
  getSourceId(): SourceId;
  setSourceId(value: SourceId): EvaluationEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluationEvent.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluationEvent): EvaluationEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: EvaluationEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluationEvent;
  static deserializeBinaryFromReader(
    message: EvaluationEvent,
    reader: jspb.BinaryReader,
  ): EvaluationEvent;
}

export namespace EvaluationEvent {
  export type AsObject = {
    timestamp: number;
    featureId: string;
    featureVersion: number;
    userId: string;
    variationId: string;
    user?: proto_user_user_pb.User.AsObject;
    reason?: proto_feature_reason_pb.Reason.AsObject;
    tag: string;
    sourceId: SourceId;
  };
}

export class GoalEvent extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): GoalEvent;
  getGoalId(): string;
  setGoalId(value: string): GoalEvent;
  getUserId(): string;
  setUserId(value: string): GoalEvent;
  getValue(): number;
  setValue(value: number): GoalEvent;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): proto_user_user_pb.User | undefined;
  setUser(value?: proto_user_user_pb.User): GoalEvent;
  clearEvaluationsList(): void;
  getEvaluationsList(): Array<proto_feature_evaluation_pb.Evaluation>;
  setEvaluationsList(value: Array<proto_feature_evaluation_pb.Evaluation>): GoalEvent;
  addEvaluations(
    value?: proto_feature_evaluation_pb.Evaluation,
    index?: number,
  ): proto_feature_evaluation_pb.Evaluation;
  getTag(): string;
  setTag(value: string): GoalEvent;
  getSourceId(): SourceId;
  setSourceId(value: SourceId): GoalEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GoalEvent.AsObject;
  static toObject(includeInstance: boolean, msg: GoalEvent): GoalEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GoalEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GoalEvent;
  static deserializeBinaryFromReader(message: GoalEvent, reader: jspb.BinaryReader): GoalEvent;
}

export namespace GoalEvent {
  export type AsObject = {
    timestamp: number;
    goalId: string;
    userId: string;
    value: number;
    user?: proto_user_user_pb.User.AsObject;
    evaluationsList: Array<proto_feature_evaluation_pb.Evaluation.AsObject>;
    tag: string;
    sourceId: SourceId;
  };
}

export class MetricsEvent extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): MetricsEvent;

  hasEvent(): boolean;
  clearEvent(): void;
  getEvent(): google_protobuf_any_pb.Any | undefined;
  setEvent(value?: google_protobuf_any_pb.Any): MetricsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: MetricsEvent): MetricsEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: MetricsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricsEvent;
  static deserializeBinaryFromReader(
    message: MetricsEvent,
    reader: jspb.BinaryReader,
  ): MetricsEvent;
}

export namespace MetricsEvent {
  export type AsObject = {
    timestamp: number;
    event?: google_protobuf_any_pb.Any.AsObject;
  };
}

export class GetEvaluationLatencyMetricsEvent extends jspb.Message {
  getLabelsMap(): jspb.Map<string, string>;
  clearLabelsMap(): void;

  hasDuration(): boolean;
  clearDuration(): void;
  getDuration(): google_protobuf_duration_pb.Duration | undefined;
  setDuration(value?: google_protobuf_duration_pb.Duration): GetEvaluationLatencyMetricsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEvaluationLatencyMetricsEvent.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetEvaluationLatencyMetricsEvent,
  ): GetEvaluationLatencyMetricsEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: GetEvaluationLatencyMetricsEvent,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetEvaluationLatencyMetricsEvent;
  static deserializeBinaryFromReader(
    message: GetEvaluationLatencyMetricsEvent,
    reader: jspb.BinaryReader,
  ): GetEvaluationLatencyMetricsEvent;
}

export namespace GetEvaluationLatencyMetricsEvent {
  export type AsObject = {
    labelsMap: Array<[string, string]>;
    duration?: google_protobuf_duration_pb.Duration.AsObject;
  };
}

export class GetEvaluationSizeMetricsEvent extends jspb.Message {
  getLabelsMap(): jspb.Map<string, string>;
  clearLabelsMap(): void;
  getSizeByte(): number;
  setSizeByte(value: number): GetEvaluationSizeMetricsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEvaluationSizeMetricsEvent.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetEvaluationSizeMetricsEvent,
  ): GetEvaluationSizeMetricsEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: GetEvaluationSizeMetricsEvent,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetEvaluationSizeMetricsEvent;
  static deserializeBinaryFromReader(
    message: GetEvaluationSizeMetricsEvent,
    reader: jspb.BinaryReader,
  ): GetEvaluationSizeMetricsEvent;
}

export namespace GetEvaluationSizeMetricsEvent {
  export type AsObject = {
    labelsMap: Array<[string, string]>;
    sizeByte: number;
  };
}

export class TimeoutErrorCountMetricsEvent extends jspb.Message {
  getTag(): string;
  setTag(value: string): TimeoutErrorCountMetricsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoutErrorCountMetricsEvent.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TimeoutErrorCountMetricsEvent,
  ): TimeoutErrorCountMetricsEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: TimeoutErrorCountMetricsEvent,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TimeoutErrorCountMetricsEvent;
  static deserializeBinaryFromReader(
    message: TimeoutErrorCountMetricsEvent,
    reader: jspb.BinaryReader,
  ): TimeoutErrorCountMetricsEvent;
}

export namespace TimeoutErrorCountMetricsEvent {
  export type AsObject = {
    tag: string;
  };
}

export class InternalErrorCountMetricsEvent extends jspb.Message {
  getTag(): string;
  setTag(value: string): InternalErrorCountMetricsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InternalErrorCountMetricsEvent.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: InternalErrorCountMetricsEvent,
  ): InternalErrorCountMetricsEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: InternalErrorCountMetricsEvent,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): InternalErrorCountMetricsEvent;
  static deserializeBinaryFromReader(
    message: InternalErrorCountMetricsEvent,
    reader: jspb.BinaryReader,
  ): InternalErrorCountMetricsEvent;
}

export namespace InternalErrorCountMetricsEvent {
  export type AsObject = {
    tag: string;
  };
}

export class OpsEvent extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): OpsEvent;
  getFeatureId(): string;
  setFeatureId(value: string): OpsEvent;
  getFeatureVersion(): number;
  setFeatureVersion(value: number): OpsEvent;
  getVariationId(): string;
  setVariationId(value: string): OpsEvent;
  getGoalId(): string;
  setGoalId(value: string): OpsEvent;
  getUserId(): string;
  setUserId(value: string): OpsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: OpsEvent): OpsEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: OpsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpsEvent;
  static deserializeBinaryFromReader(message: OpsEvent, reader: jspb.BinaryReader): OpsEvent;
}

export namespace OpsEvent {
  export type AsObject = {
    timestamp: number;
    featureId: string;
    featureVersion: number;
    variationId: string;
    goalId: string;
    userId: string;
  };
}

export class GoalBatchEvent extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GoalBatchEvent;
  clearUserGoalEventsOverTagsList(): void;
  getUserGoalEventsOverTagsList(): Array<UserGoalEventsOverTag>;
  setUserGoalEventsOverTagsList(value: Array<UserGoalEventsOverTag>): GoalBatchEvent;
  addUserGoalEventsOverTags(value?: UserGoalEventsOverTag, index?: number): UserGoalEventsOverTag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GoalBatchEvent.AsObject;
  static toObject(includeInstance: boolean, msg: GoalBatchEvent): GoalBatchEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GoalBatchEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GoalBatchEvent;
  static deserializeBinaryFromReader(
    message: GoalBatchEvent,
    reader: jspb.BinaryReader,
  ): GoalBatchEvent;
}

export namespace GoalBatchEvent {
  export type AsObject = {
    userId: string;
    userGoalEventsOverTagsList: Array<UserGoalEventsOverTag.AsObject>;
  };
}

export class UserGoalEventsOverTag extends jspb.Message {
  getTag(): string;
  setTag(value: string): UserGoalEventsOverTag;
  clearUserGoalEventsList(): void;
  getUserGoalEventsList(): Array<UserGoalEvent>;
  setUserGoalEventsList(value: Array<UserGoalEvent>): UserGoalEventsOverTag;
  addUserGoalEvents(value?: UserGoalEvent, index?: number): UserGoalEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserGoalEventsOverTag.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: UserGoalEventsOverTag,
  ): UserGoalEventsOverTag.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: UserGoalEventsOverTag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserGoalEventsOverTag;
  static deserializeBinaryFromReader(
    message: UserGoalEventsOverTag,
    reader: jspb.BinaryReader,
  ): UserGoalEventsOverTag;
}

export namespace UserGoalEventsOverTag {
  export type AsObject = {
    tag: string;
    userGoalEventsList: Array<UserGoalEvent.AsObject>;
  };
}

export class UserGoalEvent extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): UserGoalEvent;
  getGoalId(): string;
  setGoalId(value: string): UserGoalEvent;
  getValue(): number;
  setValue(value: number): UserGoalEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserGoalEvent.AsObject;
  static toObject(includeInstance: boolean, msg: UserGoalEvent): UserGoalEvent.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: UserGoalEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserGoalEvent;
  static deserializeBinaryFromReader(
    message: UserGoalEvent,
    reader: jspb.BinaryReader,
  ): UserGoalEvent;
}

export namespace UserGoalEvent {
  export type AsObject = {
    timestamp: number;
    goalId: string;
    value: number;
  };
}

export enum SourceId {
  UNKNOWN = 0,
  ANDROID = 1,
  IOS = 2,
  WEB = 3,
  GOAL_BATCH = 4,
  GO_SERVER = 5,
  NODE_SERVER = 6,
}
