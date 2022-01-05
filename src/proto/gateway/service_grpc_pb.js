// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_gateway_service_pb = require('../../proto/gateway/service_pb.js');
var proto_user_user_pb = require('../../proto/user/user_pb.js');
var proto_feature_evaluation_pb = require('../../proto/feature/evaluation_pb.js');
var proto_event_client_event_pb = require('../../proto/event/client/event_pb.js');

function serialize_bucketeer_gateway_GetEvaluationRequest(arg) {
  if (!(arg instanceof proto_gateway_service_pb.GetEvaluationRequest)) {
    throw new Error('Expected argument of type bucketeer.gateway.GetEvaluationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_GetEvaluationRequest(buffer_arg) {
  return proto_gateway_service_pb.GetEvaluationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_gateway_GetEvaluationResponse(arg) {
  if (!(arg instanceof proto_gateway_service_pb.GetEvaluationResponse)) {
    throw new Error('Expected argument of type bucketeer.gateway.GetEvaluationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_GetEvaluationResponse(buffer_arg) {
  return proto_gateway_service_pb.GetEvaluationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_gateway_GetEvaluationsRequest(arg) {
  if (!(arg instanceof proto_gateway_service_pb.GetEvaluationsRequest)) {
    throw new Error('Expected argument of type bucketeer.gateway.GetEvaluationsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_GetEvaluationsRequest(buffer_arg) {
  return proto_gateway_service_pb.GetEvaluationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_gateway_GetEvaluationsResponse(arg) {
  if (!(arg instanceof proto_gateway_service_pb.GetEvaluationsResponse)) {
    throw new Error('Expected argument of type bucketeer.gateway.GetEvaluationsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_GetEvaluationsResponse(buffer_arg) {
  return proto_gateway_service_pb.GetEvaluationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_gateway_PingRequest(arg) {
  if (!(arg instanceof proto_gateway_service_pb.PingRequest)) {
    throw new Error('Expected argument of type bucketeer.gateway.PingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_PingRequest(buffer_arg) {
  return proto_gateway_service_pb.PingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_gateway_PingResponse(arg) {
  if (!(arg instanceof proto_gateway_service_pb.PingResponse)) {
    throw new Error('Expected argument of type bucketeer.gateway.PingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_PingResponse(buffer_arg) {
  return proto_gateway_service_pb.PingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_gateway_RegisterEventsRequest(arg) {
  if (!(arg instanceof proto_gateway_service_pb.RegisterEventsRequest)) {
    throw new Error('Expected argument of type bucketeer.gateway.RegisterEventsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_RegisterEventsRequest(buffer_arg) {
  return proto_gateway_service_pb.RegisterEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_gateway_RegisterEventsResponse(arg) {
  if (!(arg instanceof proto_gateway_service_pb.RegisterEventsResponse)) {
    throw new Error('Expected argument of type bucketeer.gateway.RegisterEventsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_gateway_RegisterEventsResponse(buffer_arg) {
  return proto_gateway_service_pb.RegisterEventsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var GatewayService = exports.GatewayService = {
  ping: {
    path: '/bucketeer.gateway.Gateway/Ping',
    requestStream: false,
    responseStream: false,
    requestType: proto_gateway_service_pb.PingRequest,
    responseType: proto_gateway_service_pb.PingResponse,
    requestSerialize: serialize_bucketeer_gateway_PingRequest,
    requestDeserialize: deserialize_bucketeer_gateway_PingRequest,
    responseSerialize: serialize_bucketeer_gateway_PingResponse,
    responseDeserialize: deserialize_bucketeer_gateway_PingResponse,
  },
  getEvaluations: {
    path: '/bucketeer.gateway.Gateway/GetEvaluations',
    requestStream: false,
    responseStream: false,
    requestType: proto_gateway_service_pb.GetEvaluationsRequest,
    responseType: proto_gateway_service_pb.GetEvaluationsResponse,
    requestSerialize: serialize_bucketeer_gateway_GetEvaluationsRequest,
    requestDeserialize: deserialize_bucketeer_gateway_GetEvaluationsRequest,
    responseSerialize: serialize_bucketeer_gateway_GetEvaluationsResponse,
    responseDeserialize: deserialize_bucketeer_gateway_GetEvaluationsResponse,
  },
  getEvaluation: {
    path: '/bucketeer.gateway.Gateway/GetEvaluation',
    requestStream: false,
    responseStream: false,
    requestType: proto_gateway_service_pb.GetEvaluationRequest,
    responseType: proto_gateway_service_pb.GetEvaluationResponse,
    requestSerialize: serialize_bucketeer_gateway_GetEvaluationRequest,
    requestDeserialize: deserialize_bucketeer_gateway_GetEvaluationRequest,
    responseSerialize: serialize_bucketeer_gateway_GetEvaluationResponse,
    responseDeserialize: deserialize_bucketeer_gateway_GetEvaluationResponse,
  },
  registerEvents: {
    path: '/bucketeer.gateway.Gateway/RegisterEvents',
    requestStream: false,
    responseStream: false,
    requestType: proto_gateway_service_pb.RegisterEventsRequest,
    responseType: proto_gateway_service_pb.RegisterEventsResponse,
    requestSerialize: serialize_bucketeer_gateway_RegisterEventsRequest,
    requestDeserialize: deserialize_bucketeer_gateway_RegisterEventsRequest,
    responseSerialize: serialize_bucketeer_gateway_RegisterEventsResponse,
    responseDeserialize: deserialize_bucketeer_gateway_RegisterEventsResponse,
  },
};

exports.GatewayClient = grpc.makeGenericClientConstructor(GatewayService);
