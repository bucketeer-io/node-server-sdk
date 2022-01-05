// package: bucketeer.feature
// file: proto/feature/feature.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as proto_feature_rule_pb from '../../proto/feature/rule_pb';
import * as proto_feature_target_pb from '../../proto/feature/target_pb';
import * as proto_feature_variation_pb from '../../proto/feature/variation_pb';
import * as proto_feature_strategy_pb from '../../proto/feature/strategy_pb';
import * as proto_feature_feature_last_used_info_pb from '../../proto/feature/feature_last_used_info_pb';

export class Feature extends jspb.Message {
  getId(): string;
  setId(value: string): Feature;
  getName(): string;
  setName(value: string): Feature;
  getDescription(): string;
  setDescription(value: string): Feature;
  getEnabled(): boolean;
  setEnabled(value: boolean): Feature;
  getDeleted(): boolean;
  setDeleted(value: boolean): Feature;
  getEvaluationUndelayable(): boolean;
  setEvaluationUndelayable(value: boolean): Feature;
  getTtl(): number;
  setTtl(value: number): Feature;
  getVersion(): number;
  setVersion(value: number): Feature;
  getCreatedAt(): number;
  setCreatedAt(value: number): Feature;
  getUpdatedAt(): number;
  setUpdatedAt(value: number): Feature;
  clearVariationsList(): void;
  getVariationsList(): Array<proto_feature_variation_pb.Variation>;
  setVariationsList(value: Array<proto_feature_variation_pb.Variation>): Feature;
  addVariations(
    value?: proto_feature_variation_pb.Variation,
    index?: number,
  ): proto_feature_variation_pb.Variation;
  clearTargetsList(): void;
  getTargetsList(): Array<proto_feature_target_pb.Target>;
  setTargetsList(value: Array<proto_feature_target_pb.Target>): Feature;
  addTargets(
    value?: proto_feature_target_pb.Target,
    index?: number,
  ): proto_feature_target_pb.Target;
  clearRulesList(): void;
  getRulesList(): Array<proto_feature_rule_pb.Rule>;
  setRulesList(value: Array<proto_feature_rule_pb.Rule>): Feature;
  addRules(value?: proto_feature_rule_pb.Rule, index?: number): proto_feature_rule_pb.Rule;

  hasDefaultStrategy(): boolean;
  clearDefaultStrategy(): void;
  getDefaultStrategy(): proto_feature_strategy_pb.Strategy | undefined;
  setDefaultStrategy(value?: proto_feature_strategy_pb.Strategy): Feature;
  getOffVariation(): string;
  setOffVariation(value: string): Feature;
  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): Feature;
  addTags(value: string, index?: number): string;

  hasLastUsedInfo(): boolean;
  clearLastUsedInfo(): void;
  getLastUsedInfo(): proto_feature_feature_last_used_info_pb.FeatureLastUsedInfo | undefined;
  setLastUsedInfo(value?: proto_feature_feature_last_used_info_pb.FeatureLastUsedInfo): Feature;
  getMaintainer(): string;
  setMaintainer(value: string): Feature;
  getVariationType(): Feature.VariationType;
  setVariationType(value: Feature.VariationType): Feature;
  getArchived(): boolean;
  setArchived(value: boolean): Feature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Feature.AsObject;
  static toObject(includeInstance: boolean, msg: Feature): Feature.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Feature, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Feature;
  static deserializeBinaryFromReader(message: Feature, reader: jspb.BinaryReader): Feature;
}

export namespace Feature {
  export type AsObject = {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    deleted: boolean;
    evaluationUndelayable: boolean;
    ttl: number;
    version: number;
    createdAt: number;
    updatedAt: number;
    variationsList: Array<proto_feature_variation_pb.Variation.AsObject>;
    targetsList: Array<proto_feature_target_pb.Target.AsObject>;
    rulesList: Array<proto_feature_rule_pb.Rule.AsObject>;
    defaultStrategy?: proto_feature_strategy_pb.Strategy.AsObject;
    offVariation: string;
    tagsList: Array<string>;
    lastUsedInfo?: proto_feature_feature_last_used_info_pb.FeatureLastUsedInfo.AsObject;
    maintainer: string;
    variationType: Feature.VariationType;
    archived: boolean;
  };

  export enum VariationType {
    STRING = 0,
    BOOLEAN = 1,
    NUMBER = 2,
    JSON = 3,
  }
}

export class TagFeatures extends jspb.Message {
  getTag(): string;
  setTag(value: string): TagFeatures;
  clearFeaturesList(): void;
  getFeaturesList(): Array<Feature>;
  setFeaturesList(value: Array<Feature>): TagFeatures;
  addFeatures(value?: Feature, index?: number): Feature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TagFeatures.AsObject;
  static toObject(includeInstance: boolean, msg: TagFeatures): TagFeatures.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: TagFeatures, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TagFeatures;
  static deserializeBinaryFromReader(message: TagFeatures, reader: jspb.BinaryReader): TagFeatures;
}

export namespace TagFeatures {
  export type AsObject = {
    tag: string;
    featuresList: Array<Feature.AsObject>;
  };
}

export class Tag extends jspb.Message {
  getId(): string;
  setId(value: string): Tag;
  getCreatedAt(): number;
  setCreatedAt(value: number): Tag;
  getUpdatedAt(): number;
  setUpdatedAt(value: number): Tag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tag.AsObject;
  static toObject(includeInstance: boolean, msg: Tag): Tag.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Tag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tag;
  static deserializeBinaryFromReader(message: Tag, reader: jspb.BinaryReader): Tag;
}

export namespace Tag {
  export type AsObject = {
    id: string;
    createdAt: number;
    updatedAt: number;
  };
}
