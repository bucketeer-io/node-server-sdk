// package: bucketeer.user
// file: proto/user/service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from '@grpc/grpc-js';
import * as proto_user_service_pb from '../../proto/user/service_pb';
import * as proto_user_user_pb from '../../proto/user/user_pb';

interface IUserServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getUser: IUserServiceService_IGetUser;
  listUsers: IUserServiceService_IListUsers;
}

interface IUserServiceService_IGetUser
  extends grpc.MethodDefinition<
    proto_user_service_pb.GetUserRequest,
    proto_user_service_pb.GetUserResponse
  > {
  path: '/bucketeer.user.UserService/GetUser';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_user_service_pb.GetUserRequest>;
  requestDeserialize: grpc.deserialize<proto_user_service_pb.GetUserRequest>;
  responseSerialize: grpc.serialize<proto_user_service_pb.GetUserResponse>;
  responseDeserialize: grpc.deserialize<proto_user_service_pb.GetUserResponse>;
}
interface IUserServiceService_IListUsers
  extends grpc.MethodDefinition<
    proto_user_service_pb.ListUsersRequest,
    proto_user_service_pb.ListUsersResponse
  > {
  path: '/bucketeer.user.UserService/ListUsers';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_user_service_pb.ListUsersRequest>;
  requestDeserialize: grpc.deserialize<proto_user_service_pb.ListUsersRequest>;
  responseSerialize: grpc.serialize<proto_user_service_pb.ListUsersResponse>;
  responseDeserialize: grpc.deserialize<proto_user_service_pb.ListUsersResponse>;
}

export const UserServiceService: IUserServiceService;

export interface IUserServiceServer extends grpc.UntypedServiceImplementation {
  getUser: grpc.handleUnaryCall<
    proto_user_service_pb.GetUserRequest,
    proto_user_service_pb.GetUserResponse
  >;
  listUsers: grpc.handleUnaryCall<
    proto_user_service_pb.ListUsersRequest,
    proto_user_service_pb.ListUsersResponse
  >;
}

export interface IUserServiceClient {
  getUser(
    request: proto_user_service_pb.GetUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.GetUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getUser(
    request: proto_user_service_pb.GetUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.GetUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getUser(
    request: proto_user_service_pb.GetUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.GetUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listUsers(
    request: proto_user_service_pb.ListUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.ListUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listUsers(
    request: proto_user_service_pb.ListUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.ListUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listUsers(
    request: proto_user_service_pb.ListUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.ListUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}

export class UserServiceClient extends grpc.Client implements IUserServiceClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>,
  );
  public getUser(
    request: proto_user_service_pb.GetUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.GetUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getUser(
    request: proto_user_service_pb.GetUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.GetUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getUser(
    request: proto_user_service_pb.GetUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.GetUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listUsers(
    request: proto_user_service_pb.ListUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.ListUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listUsers(
    request: proto_user_service_pb.ListUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.ListUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listUsers(
    request: proto_user_service_pb.ListUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_user_service_pb.ListUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}
