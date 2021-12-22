// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_user_service_pb = require('../../proto/user/service_pb.js');
var proto_user_user_pb = require('../../proto/user/user_pb.js');

function serialize_bucketeer_user_GetUserRequest(arg) {
  if (!(arg instanceof proto_user_service_pb.GetUserRequest)) {
    throw new Error('Expected argument of type bucketeer.user.GetUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_user_GetUserRequest(buffer_arg) {
  return proto_user_service_pb.GetUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_user_GetUserResponse(arg) {
  if (!(arg instanceof proto_user_service_pb.GetUserResponse)) {
    throw new Error('Expected argument of type bucketeer.user.GetUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_user_GetUserResponse(buffer_arg) {
  return proto_user_service_pb.GetUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_user_ListUsersRequest(arg) {
  if (!(arg instanceof proto_user_service_pb.ListUsersRequest)) {
    throw new Error('Expected argument of type bucketeer.user.ListUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_user_ListUsersRequest(buffer_arg) {
  return proto_user_service_pb.ListUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_user_ListUsersResponse(arg) {
  if (!(arg instanceof proto_user_service_pb.ListUsersResponse)) {
    throw new Error('Expected argument of type bucketeer.user.ListUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_user_ListUsersResponse(buffer_arg) {
  return proto_user_service_pb.ListUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var UserServiceService = exports.UserServiceService = {
  getUser: {
    path: '/bucketeer.user.UserService/GetUser',
    requestStream: false,
    responseStream: false,
    requestType: proto_user_service_pb.GetUserRequest,
    responseType: proto_user_service_pb.GetUserResponse,
    requestSerialize: serialize_bucketeer_user_GetUserRequest,
    requestDeserialize: deserialize_bucketeer_user_GetUserRequest,
    responseSerialize: serialize_bucketeer_user_GetUserResponse,
    responseDeserialize: deserialize_bucketeer_user_GetUserResponse,
  },
  listUsers: {
    path: '/bucketeer.user.UserService/ListUsers',
    requestStream: false,
    responseStream: false,
    requestType: proto_user_service_pb.ListUsersRequest,
    responseType: proto_user_service_pb.ListUsersResponse,
    requestSerialize: serialize_bucketeer_user_ListUsersRequest,
    requestDeserialize: deserialize_bucketeer_user_ListUsersRequest,
    responseSerialize: serialize_bucketeer_user_ListUsersResponse,
    responseDeserialize: deserialize_bucketeer_user_ListUsersResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService);
