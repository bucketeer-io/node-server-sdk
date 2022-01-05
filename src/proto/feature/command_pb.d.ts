// package: bucketeer.feature
// file: proto/feature/command.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from 'google-protobuf';
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as proto_feature_clause_pb from '../../proto/feature/clause_pb';
import * as proto_feature_feature_pb from '../../proto/feature/feature_pb';
import * as proto_feature_rule_pb from '../../proto/feature/rule_pb';
import * as proto_feature_variation_pb from '../../proto/feature/variation_pb';
import * as proto_feature_strategy_pb from '../../proto/feature/strategy_pb';
import * as proto_feature_segment_pb from '../../proto/feature/segment_pb';

export class Command extends jspb.Message {
  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): google_protobuf_any_pb.Any | undefined;
  setCommand(value?: google_protobuf_any_pb.Any): Command;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Command.AsObject;
  static toObject(includeInstance: boolean, msg: Command): Command.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Command, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Command;
  static deserializeBinaryFromReader(message: Command, reader: jspb.BinaryReader): Command;
}

export namespace Command {
  export type AsObject = {
    command?: google_protobuf_any_pb.Any.AsObject;
  };
}

export class CreateFeatureCommand extends jspb.Message {
  getId(): string;
  setId(value: string): CreateFeatureCommand;
  getName(): string;
  setName(value: string): CreateFeatureCommand;
  getDescription(): string;
  setDescription(value: string): CreateFeatureCommand;
  clearVariationsList(): void;
  getVariationsList(): Array<proto_feature_variation_pb.Variation>;
  setVariationsList(value: Array<proto_feature_variation_pb.Variation>): CreateFeatureCommand;
  addVariations(
    value?: proto_feature_variation_pb.Variation,
    index?: number,
  ): proto_feature_variation_pb.Variation;
  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): CreateFeatureCommand;
  addTags(value: string, index?: number): string;

  hasDefaultOnVariationIndex(): boolean;
  clearDefaultOnVariationIndex(): void;
  getDefaultOnVariationIndex(): google_protobuf_wrappers_pb.Int32Value | undefined;
  setDefaultOnVariationIndex(value?: google_protobuf_wrappers_pb.Int32Value): CreateFeatureCommand;

  hasDefaultOffVariationIndex(): boolean;
  clearDefaultOffVariationIndex(): void;
  getDefaultOffVariationIndex(): google_protobuf_wrappers_pb.Int32Value | undefined;
  setDefaultOffVariationIndex(value?: google_protobuf_wrappers_pb.Int32Value): CreateFeatureCommand;
  getVariationType(): proto_feature_feature_pb.Feature.VariationType;
  setVariationType(value: proto_feature_feature_pb.Feature.VariationType): CreateFeatureCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFeatureCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateFeatureCommand,
  ): CreateFeatureCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: CreateFeatureCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFeatureCommand;
  static deserializeBinaryFromReader(
    message: CreateFeatureCommand,
    reader: jspb.BinaryReader,
  ): CreateFeatureCommand;
}

export namespace CreateFeatureCommand {
  export type AsObject = {
    id: string;
    name: string;
    description: string;
    variationsList: Array<proto_feature_variation_pb.Variation.AsObject>;
    tagsList: Array<string>;
    defaultOnVariationIndex?: google_protobuf_wrappers_pb.Int32Value.AsObject;
    defaultOffVariationIndex?: google_protobuf_wrappers_pb.Int32Value.AsObject;
    variationType: proto_feature_feature_pb.Feature.VariationType;
  };
}

export class ArchiveFeatureCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArchiveFeatureCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ArchiveFeatureCommand,
  ): ArchiveFeatureCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: ArchiveFeatureCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArchiveFeatureCommand;
  static deserializeBinaryFromReader(
    message: ArchiveFeatureCommand,
    reader: jspb.BinaryReader,
  ): ArchiveFeatureCommand;
}

export namespace ArchiveFeatureCommand {
  export type AsObject = {};
}

export class DeleteFeatureCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFeatureCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteFeatureCommand,
  ): DeleteFeatureCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteFeatureCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFeatureCommand;
  static deserializeBinaryFromReader(
    message: DeleteFeatureCommand,
    reader: jspb.BinaryReader,
  ): DeleteFeatureCommand;
}

export namespace DeleteFeatureCommand {
  export type AsObject = {};
}

export class RenameFeatureCommand extends jspb.Message {
  getName(): string;
  setName(value: string): RenameFeatureCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RenameFeatureCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RenameFeatureCommand,
  ): RenameFeatureCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: RenameFeatureCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RenameFeatureCommand;
  static deserializeBinaryFromReader(
    message: RenameFeatureCommand,
    reader: jspb.BinaryReader,
  ): RenameFeatureCommand;
}

export namespace RenameFeatureCommand {
  export type AsObject = {
    name: string;
  };
}

export class ChangeDescriptionCommand extends jspb.Message {
  getDescription(): string;
  setDescription(value: string): ChangeDescriptionCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeDescriptionCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeDescriptionCommand,
  ): ChangeDescriptionCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeDescriptionCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeDescriptionCommand;
  static deserializeBinaryFromReader(
    message: ChangeDescriptionCommand,
    reader: jspb.BinaryReader,
  ): ChangeDescriptionCommand;
}

export namespace ChangeDescriptionCommand {
  export type AsObject = {
    description: string;
  };
}

export class ChangeBulkUploadSegmentUsersStatusCommand extends jspb.Message {
  getStatus(): proto_feature_segment_pb.Segment.Status;
  setStatus(
    value: proto_feature_segment_pb.Segment.Status,
  ): ChangeBulkUploadSegmentUsersStatusCommand;
  getState(): proto_feature_segment_pb.SegmentUser.State;
  setState(
    value: proto_feature_segment_pb.SegmentUser.State,
  ): ChangeBulkUploadSegmentUsersStatusCommand;
  getCount(): number;
  setCount(value: number): ChangeBulkUploadSegmentUsersStatusCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeBulkUploadSegmentUsersStatusCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeBulkUploadSegmentUsersStatusCommand,
  ): ChangeBulkUploadSegmentUsersStatusCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeBulkUploadSegmentUsersStatusCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeBulkUploadSegmentUsersStatusCommand;
  static deserializeBinaryFromReader(
    message: ChangeBulkUploadSegmentUsersStatusCommand,
    reader: jspb.BinaryReader,
  ): ChangeBulkUploadSegmentUsersStatusCommand;
}

export namespace ChangeBulkUploadSegmentUsersStatusCommand {
  export type AsObject = {
    status: proto_feature_segment_pb.Segment.Status;
    state: proto_feature_segment_pb.SegmentUser.State;
    count: number;
  };
}

export class AddTagCommand extends jspb.Message {
  getTag(): string;
  setTag(value: string): AddTagCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddTagCommand.AsObject;
  static toObject(includeInstance: boolean, msg: AddTagCommand): AddTagCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddTagCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddTagCommand;
  static deserializeBinaryFromReader(
    message: AddTagCommand,
    reader: jspb.BinaryReader,
  ): AddTagCommand;
}

export namespace AddTagCommand {
  export type AsObject = {
    tag: string;
  };
}

export class RemoveTagCommand extends jspb.Message {
  getTag(): string;
  setTag(value: string): RemoveTagCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveTagCommand.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveTagCommand): RemoveTagCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: RemoveTagCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveTagCommand;
  static deserializeBinaryFromReader(
    message: RemoveTagCommand,
    reader: jspb.BinaryReader,
  ): RemoveTagCommand;
}

export namespace RemoveTagCommand {
  export type AsObject = {
    tag: string;
  };
}

export class EnableFeatureCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnableFeatureCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EnableFeatureCommand,
  ): EnableFeatureCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: EnableFeatureCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnableFeatureCommand;
  static deserializeBinaryFromReader(
    message: EnableFeatureCommand,
    reader: jspb.BinaryReader,
  ): EnableFeatureCommand;
}

export namespace EnableFeatureCommand {
  export type AsObject = {};
}

export class DisableFeatureCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisableFeatureCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DisableFeatureCommand,
  ): DisableFeatureCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DisableFeatureCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisableFeatureCommand;
  static deserializeBinaryFromReader(
    message: DisableFeatureCommand,
    reader: jspb.BinaryReader,
  ): DisableFeatureCommand;
}

export namespace DisableFeatureCommand {
  export type AsObject = {};
}

export class AddVariationCommand extends jspb.Message {
  getValue(): string;
  setValue(value: string): AddVariationCommand;
  getName(): string;
  setName(value: string): AddVariationCommand;
  getDescription(): string;
  setDescription(value: string): AddVariationCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddVariationCommand.AsObject;
  static toObject(includeInstance: boolean, msg: AddVariationCommand): AddVariationCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddVariationCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddVariationCommand;
  static deserializeBinaryFromReader(
    message: AddVariationCommand,
    reader: jspb.BinaryReader,
  ): AddVariationCommand;
}

export namespace AddVariationCommand {
  export type AsObject = {
    value: string;
    name: string;
    description: string;
  };
}

export class RemoveVariationCommand extends jspb.Message {
  getId(): string;
  setId(value: string): RemoveVariationCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveVariationCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RemoveVariationCommand,
  ): RemoveVariationCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: RemoveVariationCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveVariationCommand;
  static deserializeBinaryFromReader(
    message: RemoveVariationCommand,
    reader: jspb.BinaryReader,
  ): RemoveVariationCommand;
}

export namespace RemoveVariationCommand {
  export type AsObject = {
    id: string;
  };
}

export class ChangeVariationValueCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeVariationValueCommand;
  getValue(): string;
  setValue(value: string): ChangeVariationValueCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeVariationValueCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeVariationValueCommand,
  ): ChangeVariationValueCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeVariationValueCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeVariationValueCommand;
  static deserializeBinaryFromReader(
    message: ChangeVariationValueCommand,
    reader: jspb.BinaryReader,
  ): ChangeVariationValueCommand;
}

export namespace ChangeVariationValueCommand {
  export type AsObject = {
    id: string;
    value: string;
  };
}

export class ChangeVariationNameCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeVariationNameCommand;
  getName(): string;
  setName(value: string): ChangeVariationNameCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeVariationNameCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeVariationNameCommand,
  ): ChangeVariationNameCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeVariationNameCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeVariationNameCommand;
  static deserializeBinaryFromReader(
    message: ChangeVariationNameCommand,
    reader: jspb.BinaryReader,
  ): ChangeVariationNameCommand;
}

export namespace ChangeVariationNameCommand {
  export type AsObject = {
    id: string;
    name: string;
  };
}

export class ChangeVariationDescriptionCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeVariationDescriptionCommand;
  getDescription(): string;
  setDescription(value: string): ChangeVariationDescriptionCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeVariationDescriptionCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeVariationDescriptionCommand,
  ): ChangeVariationDescriptionCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeVariationDescriptionCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeVariationDescriptionCommand;
  static deserializeBinaryFromReader(
    message: ChangeVariationDescriptionCommand,
    reader: jspb.BinaryReader,
  ): ChangeVariationDescriptionCommand;
}

export namespace ChangeVariationDescriptionCommand {
  export type AsObject = {
    id: string;
    description: string;
  };
}

export class ChangeOffVariationCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeOffVariationCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeOffVariationCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeOffVariationCommand,
  ): ChangeOffVariationCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeOffVariationCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeOffVariationCommand;
  static deserializeBinaryFromReader(
    message: ChangeOffVariationCommand,
    reader: jspb.BinaryReader,
  ): ChangeOffVariationCommand;
}

export namespace ChangeOffVariationCommand {
  export type AsObject = {
    id: string;
  };
}

export class AddUserToVariationCommand extends jspb.Message {
  getId(): string;
  setId(value: string): AddUserToVariationCommand;
  getUser(): string;
  setUser(value: string): AddUserToVariationCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddUserToVariationCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AddUserToVariationCommand,
  ): AddUserToVariationCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: AddUserToVariationCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): AddUserToVariationCommand;
  static deserializeBinaryFromReader(
    message: AddUserToVariationCommand,
    reader: jspb.BinaryReader,
  ): AddUserToVariationCommand;
}

export namespace AddUserToVariationCommand {
  export type AsObject = {
    id: string;
    user: string;
  };
}

export class RemoveUserFromVariationCommand extends jspb.Message {
  getId(): string;
  setId(value: string): RemoveUserFromVariationCommand;
  getUser(): string;
  setUser(value: string): RemoveUserFromVariationCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveUserFromVariationCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RemoveUserFromVariationCommand,
  ): RemoveUserFromVariationCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: RemoveUserFromVariationCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RemoveUserFromVariationCommand;
  static deserializeBinaryFromReader(
    message: RemoveUserFromVariationCommand,
    reader: jspb.BinaryReader,
  ): RemoveUserFromVariationCommand;
}

export namespace RemoveUserFromVariationCommand {
  export type AsObject = {
    id: string;
    user: string;
  };
}

export class ChangeDefaultStrategyCommand extends jspb.Message {
  hasStrategy(): boolean;
  clearStrategy(): void;
  getStrategy(): proto_feature_strategy_pb.Strategy | undefined;
  setStrategy(value?: proto_feature_strategy_pb.Strategy): ChangeDefaultStrategyCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeDefaultStrategyCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeDefaultStrategyCommand,
  ): ChangeDefaultStrategyCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeDefaultStrategyCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeDefaultStrategyCommand;
  static deserializeBinaryFromReader(
    message: ChangeDefaultStrategyCommand,
    reader: jspb.BinaryReader,
  ): ChangeDefaultStrategyCommand;
}

export namespace ChangeDefaultStrategyCommand {
  export type AsObject = {
    strategy?: proto_feature_strategy_pb.Strategy.AsObject;
  };
}

export class AddRuleCommand extends jspb.Message {
  hasRule(): boolean;
  clearRule(): void;
  getRule(): proto_feature_rule_pb.Rule | undefined;
  setRule(value?: proto_feature_rule_pb.Rule): AddRuleCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddRuleCommand.AsObject;
  static toObject(includeInstance: boolean, msg: AddRuleCommand): AddRuleCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddRuleCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddRuleCommand;
  static deserializeBinaryFromReader(
    message: AddRuleCommand,
    reader: jspb.BinaryReader,
  ): AddRuleCommand;
}

export namespace AddRuleCommand {
  export type AsObject = {
    rule?: proto_feature_rule_pb.Rule.AsObject;
  };
}

export class ChangeRuleStrategyCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeRuleStrategyCommand;
  getRuleId(): string;
  setRuleId(value: string): ChangeRuleStrategyCommand;

  hasStrategy(): boolean;
  clearStrategy(): void;
  getStrategy(): proto_feature_strategy_pb.Strategy | undefined;
  setStrategy(value?: proto_feature_strategy_pb.Strategy): ChangeRuleStrategyCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeRuleStrategyCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeRuleStrategyCommand,
  ): ChangeRuleStrategyCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeRuleStrategyCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeRuleStrategyCommand;
  static deserializeBinaryFromReader(
    message: ChangeRuleStrategyCommand,
    reader: jspb.BinaryReader,
  ): ChangeRuleStrategyCommand;
}

export namespace ChangeRuleStrategyCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
    strategy?: proto_feature_strategy_pb.Strategy.AsObject;
  };
}

export class DeleteRuleCommand extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteRuleCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteRuleCommand.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteRuleCommand): DeleteRuleCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteRuleCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteRuleCommand;
  static deserializeBinaryFromReader(
    message: DeleteRuleCommand,
    reader: jspb.BinaryReader,
  ): DeleteRuleCommand;
}

export namespace DeleteRuleCommand {
  export type AsObject = {
    id: string;
  };
}

export class AddClauseCommand extends jspb.Message {
  getRuleId(): string;
  setRuleId(value: string): AddClauseCommand;

  hasClause(): boolean;
  clearClause(): void;
  getClause(): proto_feature_clause_pb.Clause | undefined;
  setClause(value?: proto_feature_clause_pb.Clause): AddClauseCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddClauseCommand.AsObject;
  static toObject(includeInstance: boolean, msg: AddClauseCommand): AddClauseCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddClauseCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddClauseCommand;
  static deserializeBinaryFromReader(
    message: AddClauseCommand,
    reader: jspb.BinaryReader,
  ): AddClauseCommand;
}

export namespace AddClauseCommand {
  export type AsObject = {
    ruleId: string;
    clause?: proto_feature_clause_pb.Clause.AsObject;
  };
}

export class DeleteClauseCommand extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteClauseCommand;
  getRuleId(): string;
  setRuleId(value: string): DeleteClauseCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteClauseCommand.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteClauseCommand): DeleteClauseCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteClauseCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteClauseCommand;
  static deserializeBinaryFromReader(
    message: DeleteClauseCommand,
    reader: jspb.BinaryReader,
  ): DeleteClauseCommand;
}

export namespace DeleteClauseCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
  };
}

export class ChangeClauseAttributeCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeClauseAttributeCommand;
  getRuleId(): string;
  setRuleId(value: string): ChangeClauseAttributeCommand;
  getAttribute(): string;
  setAttribute(value: string): ChangeClauseAttributeCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeClauseAttributeCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeClauseAttributeCommand,
  ): ChangeClauseAttributeCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeClauseAttributeCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeClauseAttributeCommand;
  static deserializeBinaryFromReader(
    message: ChangeClauseAttributeCommand,
    reader: jspb.BinaryReader,
  ): ChangeClauseAttributeCommand;
}

export namespace ChangeClauseAttributeCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
    attribute: string;
  };
}

export class ChangeClauseOperatorCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeClauseOperatorCommand;
  getRuleId(): string;
  setRuleId(value: string): ChangeClauseOperatorCommand;
  getOperator(): proto_feature_clause_pb.Clause.Operator;
  setOperator(value: proto_feature_clause_pb.Clause.Operator): ChangeClauseOperatorCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeClauseOperatorCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeClauseOperatorCommand,
  ): ChangeClauseOperatorCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeClauseOperatorCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeClauseOperatorCommand;
  static deserializeBinaryFromReader(
    message: ChangeClauseOperatorCommand,
    reader: jspb.BinaryReader,
  ): ChangeClauseOperatorCommand;
}

export namespace ChangeClauseOperatorCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
    operator: proto_feature_clause_pb.Clause.Operator;
  };
}

export class AddClauseValueCommand extends jspb.Message {
  getId(): string;
  setId(value: string): AddClauseValueCommand;
  getRuleId(): string;
  setRuleId(value: string): AddClauseValueCommand;
  getValue(): string;
  setValue(value: string): AddClauseValueCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddClauseValueCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AddClauseValueCommand,
  ): AddClauseValueCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddClauseValueCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddClauseValueCommand;
  static deserializeBinaryFromReader(
    message: AddClauseValueCommand,
    reader: jspb.BinaryReader,
  ): AddClauseValueCommand;
}

export namespace AddClauseValueCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
    value: string;
  };
}

export class RemoveClauseValueCommand extends jspb.Message {
  getId(): string;
  setId(value: string): RemoveClauseValueCommand;
  getRuleId(): string;
  setRuleId(value: string): RemoveClauseValueCommand;
  getValue(): string;
  setValue(value: string): RemoveClauseValueCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveClauseValueCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RemoveClauseValueCommand,
  ): RemoveClauseValueCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: RemoveClauseValueCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RemoveClauseValueCommand;
  static deserializeBinaryFromReader(
    message: RemoveClauseValueCommand,
    reader: jspb.BinaryReader,
  ): RemoveClauseValueCommand;
}

export namespace RemoveClauseValueCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
    value: string;
  };
}

export class ChangeFixedStrategyCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeFixedStrategyCommand;
  getRuleId(): string;
  setRuleId(value: string): ChangeFixedStrategyCommand;

  hasStrategy(): boolean;
  clearStrategy(): void;
  getStrategy(): proto_feature_strategy_pb.FixedStrategy | undefined;
  setStrategy(value?: proto_feature_strategy_pb.FixedStrategy): ChangeFixedStrategyCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeFixedStrategyCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeFixedStrategyCommand,
  ): ChangeFixedStrategyCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeFixedStrategyCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeFixedStrategyCommand;
  static deserializeBinaryFromReader(
    message: ChangeFixedStrategyCommand,
    reader: jspb.BinaryReader,
  ): ChangeFixedStrategyCommand;
}

export namespace ChangeFixedStrategyCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
    strategy?: proto_feature_strategy_pb.FixedStrategy.AsObject;
  };
}

export class ChangeRolloutStrategyCommand extends jspb.Message {
  getId(): string;
  setId(value: string): ChangeRolloutStrategyCommand;
  getRuleId(): string;
  setRuleId(value: string): ChangeRolloutStrategyCommand;

  hasStrategy(): boolean;
  clearStrategy(): void;
  getStrategy(): proto_feature_strategy_pb.RolloutStrategy | undefined;
  setStrategy(value?: proto_feature_strategy_pb.RolloutStrategy): ChangeRolloutStrategyCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeRolloutStrategyCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeRolloutStrategyCommand,
  ): ChangeRolloutStrategyCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeRolloutStrategyCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeRolloutStrategyCommand;
  static deserializeBinaryFromReader(
    message: ChangeRolloutStrategyCommand,
    reader: jspb.BinaryReader,
  ): ChangeRolloutStrategyCommand;
}

export namespace ChangeRolloutStrategyCommand {
  export type AsObject = {
    id: string;
    ruleId: string;
    strategy?: proto_feature_strategy_pb.RolloutStrategy.AsObject;
  };
}

export class CreateSegmentCommand extends jspb.Message {
  getName(): string;
  setName(value: string): CreateSegmentCommand;
  getDescription(): string;
  setDescription(value: string): CreateSegmentCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateSegmentCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateSegmentCommand,
  ): CreateSegmentCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: CreateSegmentCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateSegmentCommand;
  static deserializeBinaryFromReader(
    message: CreateSegmentCommand,
    reader: jspb.BinaryReader,
  ): CreateSegmentCommand;
}

export namespace CreateSegmentCommand {
  export type AsObject = {
    name: string;
    description: string;
  };
}

export class DeleteSegmentCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSegmentCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteSegmentCommand,
  ): DeleteSegmentCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: DeleteSegmentCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSegmentCommand;
  static deserializeBinaryFromReader(
    message: DeleteSegmentCommand,
    reader: jspb.BinaryReader,
  ): DeleteSegmentCommand;
}

export namespace DeleteSegmentCommand {
  export type AsObject = {};
}

export class ChangeSegmentNameCommand extends jspb.Message {
  getName(): string;
  setName(value: string): ChangeSegmentNameCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeSegmentNameCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeSegmentNameCommand,
  ): ChangeSegmentNameCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeSegmentNameCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeSegmentNameCommand;
  static deserializeBinaryFromReader(
    message: ChangeSegmentNameCommand,
    reader: jspb.BinaryReader,
  ): ChangeSegmentNameCommand;
}

export namespace ChangeSegmentNameCommand {
  export type AsObject = {
    name: string;
  };
}

export class ChangeSegmentDescriptionCommand extends jspb.Message {
  getDescription(): string;
  setDescription(value: string): ChangeSegmentDescriptionCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeSegmentDescriptionCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChangeSegmentDescriptionCommand,
  ): ChangeSegmentDescriptionCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: ChangeSegmentDescriptionCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChangeSegmentDescriptionCommand;
  static deserializeBinaryFromReader(
    message: ChangeSegmentDescriptionCommand,
    reader: jspb.BinaryReader,
  ): ChangeSegmentDescriptionCommand;
}

export namespace ChangeSegmentDescriptionCommand {
  export type AsObject = {
    description: string;
  };
}

export class AddSegmentUserCommand extends jspb.Message {
  clearUserIdsList(): void;
  getUserIdsList(): Array<string>;
  setUserIdsList(value: Array<string>): AddSegmentUserCommand;
  addUserIds(value: string, index?: number): string;
  getState(): proto_feature_segment_pb.SegmentUser.State;
  setState(value: proto_feature_segment_pb.SegmentUser.State): AddSegmentUserCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddSegmentUserCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AddSegmentUserCommand,
  ): AddSegmentUserCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: AddSegmentUserCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddSegmentUserCommand;
  static deserializeBinaryFromReader(
    message: AddSegmentUserCommand,
    reader: jspb.BinaryReader,
  ): AddSegmentUserCommand;
}

export namespace AddSegmentUserCommand {
  export type AsObject = {
    userIdsList: Array<string>;
    state: proto_feature_segment_pb.SegmentUser.State;
  };
}

export class DeleteSegmentUserCommand extends jspb.Message {
  clearUserIdsList(): void;
  getUserIdsList(): Array<string>;
  setUserIdsList(value: Array<string>): DeleteSegmentUserCommand;
  addUserIds(value: string, index?: number): string;
  getState(): proto_feature_segment_pb.SegmentUser.State;
  setState(value: proto_feature_segment_pb.SegmentUser.State): DeleteSegmentUserCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSegmentUserCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DeleteSegmentUserCommand,
  ): DeleteSegmentUserCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: DeleteSegmentUserCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSegmentUserCommand;
  static deserializeBinaryFromReader(
    message: DeleteSegmentUserCommand,
    reader: jspb.BinaryReader,
  ): DeleteSegmentUserCommand;
}

export namespace DeleteSegmentUserCommand {
  export type AsObject = {
    userIdsList: Array<string>;
    state: proto_feature_segment_pb.SegmentUser.State;
  };
}

export class BulkUploadSegmentUsersCommand extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): BulkUploadSegmentUsersCommand;
  getState(): proto_feature_segment_pb.SegmentUser.State;
  setState(value: proto_feature_segment_pb.SegmentUser.State): BulkUploadSegmentUsersCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BulkUploadSegmentUsersCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BulkUploadSegmentUsersCommand,
  ): BulkUploadSegmentUsersCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: BulkUploadSegmentUsersCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BulkUploadSegmentUsersCommand;
  static deserializeBinaryFromReader(
    message: BulkUploadSegmentUsersCommand,
    reader: jspb.BinaryReader,
  ): BulkUploadSegmentUsersCommand;
}

export namespace BulkUploadSegmentUsersCommand {
  export type AsObject = {
    data: Uint8Array | string;
    state: proto_feature_segment_pb.SegmentUser.State;
  };
}

export class IncrementFeatureVersionCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IncrementFeatureVersionCommand.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: IncrementFeatureVersionCommand,
  ): IncrementFeatureVersionCommand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(
    message: IncrementFeatureVersionCommand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): IncrementFeatureVersionCommand;
  static deserializeBinaryFromReader(
    message: IncrementFeatureVersionCommand,
    reader: jspb.BinaryReader,
  ): IncrementFeatureVersionCommand;
}

export namespace IncrementFeatureVersionCommand {
  export type AsObject = {};
}
