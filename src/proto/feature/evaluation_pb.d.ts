// package: bucketeer.feature
// file: proto/feature/evaluation.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as proto_feature_variation_pb from '../../proto/feature/variation_pb';
import * as proto_feature_reason_pb from '../../proto/feature/reason_pb';

export class Evaluation extends jspb.Message {
  getId(): string;
  setId(value: string): Evaluation;
  getFeatureId(): string;
  setFeatureId(value: string): Evaluation;
  getFeatureVersion(): number;
  setFeatureVersion(value: number): Evaluation;
  getUserId(): string;
  setUserId(value: string): Evaluation;
  getVariationId(): string;
  setVariationId(value: string): Evaluation;

  hasVariation(): boolean;
  clearVariation(): void;
  getVariation(): proto_feature_variation_pb.Variation | undefined;
  setVariation(value?: proto_feature_variation_pb.Variation): Evaluation;

  hasReason(): boolean;
  clearReason(): void;
  getReason(): proto_feature_reason_pb.Reason | undefined;
  setReason(value?: proto_feature_reason_pb.Reason): Evaluation;
  getVariationValue(): string;
  setVariationValue(value: string): Evaluation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Evaluation.AsObject;
  static toObject(includeInstance: boolean, msg: Evaluation): Evaluation.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Evaluation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Evaluation;
  static deserializeBinaryFromReader(message: Evaluation, reader: jspb.BinaryReader): Evaluation;
}

export namespace Evaluation {
  export type AsObject = {
    id: string;
    featureId: string;
    featureVersion: number;
    userId: string;
    variationId: string;
    variation?: proto_feature_variation_pb.Variation.AsObject;
    reason?: proto_feature_reason_pb.Reason.AsObject;
    variationValue: string;
  };
}

export class UserEvaluations extends jspb.Message {
  getId(): string;
  setId(value: string): UserEvaluations;
  clearEvaluationsList(): void;
  getEvaluationsList(): Array<Evaluation>;
  setEvaluationsList(value: Array<Evaluation>): UserEvaluations;
  addEvaluations(value?: Evaluation, index?: number): Evaluation;
  getCreatedAt(): number;
  setCreatedAt(value: number): UserEvaluations;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserEvaluations.AsObject;
  static toObject(includeInstance: boolean, msg: UserEvaluations): UserEvaluations.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: UserEvaluations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserEvaluations;
  static deserializeBinaryFromReader(
    message: UserEvaluations,
    reader: jspb.BinaryReader,
  ): UserEvaluations;
}

export namespace UserEvaluations {
  export type AsObject = {
    id: string;
    evaluationsList: Array<Evaluation.AsObject>;
    createdAt: number;
  };

  export enum State {
    QUEUED = 0,
    PARTIAL = 1,
    FULL = 2,
  }
}
