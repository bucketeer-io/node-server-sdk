// package: bucketeer.gateway
// file: proto/gateway/service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from '@grpc/grpc-js';
import * as proto_gateway_service_pb from '../../proto/gateway/service_pb';
import * as proto_user_user_pb from '../../proto/user/user_pb';
import * as proto_feature_evaluation_pb from '../../proto/feature/evaluation_pb';
import * as proto_event_client_event_pb from '../../proto/event/client/event_pb';

interface IGatewayService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  ping: IGatewayService_IPing;
  getEvaluations: IGatewayService_IGetEvaluations;
  getEvaluation: IGatewayService_IGetEvaluation;
  registerEvents: IGatewayService_IRegisterEvents;
}

interface IGatewayService_IPing
  extends grpc.MethodDefinition<
    proto_gateway_service_pb.PingRequest,
    proto_gateway_service_pb.PingResponse
  > {
  path: '/bucketeer.gateway.Gateway/Ping';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_gateway_service_pb.PingRequest>;
  requestDeserialize: grpc.deserialize<proto_gateway_service_pb.PingRequest>;
  responseSerialize: grpc.serialize<proto_gateway_service_pb.PingResponse>;
  responseDeserialize: grpc.deserialize<proto_gateway_service_pb.PingResponse>;
}
interface IGatewayService_IGetEvaluations
  extends grpc.MethodDefinition<
    proto_gateway_service_pb.GetEvaluationsRequest,
    proto_gateway_service_pb.GetEvaluationsResponse
  > {
  path: '/bucketeer.gateway.Gateway/GetEvaluations';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_gateway_service_pb.GetEvaluationsRequest>;
  requestDeserialize: grpc.deserialize<proto_gateway_service_pb.GetEvaluationsRequest>;
  responseSerialize: grpc.serialize<proto_gateway_service_pb.GetEvaluationsResponse>;
  responseDeserialize: grpc.deserialize<proto_gateway_service_pb.GetEvaluationsResponse>;
}
interface IGatewayService_IGetEvaluation
  extends grpc.MethodDefinition<
    proto_gateway_service_pb.GetEvaluationRequest,
    proto_gateway_service_pb.GetEvaluationResponse
  > {
  path: '/bucketeer.gateway.Gateway/GetEvaluation';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_gateway_service_pb.GetEvaluationRequest>;
  requestDeserialize: grpc.deserialize<proto_gateway_service_pb.GetEvaluationRequest>;
  responseSerialize: grpc.serialize<proto_gateway_service_pb.GetEvaluationResponse>;
  responseDeserialize: grpc.deserialize<proto_gateway_service_pb.GetEvaluationResponse>;
}
interface IGatewayService_IRegisterEvents
  extends grpc.MethodDefinition<
    proto_gateway_service_pb.RegisterEventsRequest,
    proto_gateway_service_pb.RegisterEventsResponse
  > {
  path: '/bucketeer.gateway.Gateway/RegisterEvents';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_gateway_service_pb.RegisterEventsRequest>;
  requestDeserialize: grpc.deserialize<proto_gateway_service_pb.RegisterEventsRequest>;
  responseSerialize: grpc.serialize<proto_gateway_service_pb.RegisterEventsResponse>;
  responseDeserialize: grpc.deserialize<proto_gateway_service_pb.RegisterEventsResponse>;
}

export const GatewayService: IGatewayService;

export interface IGatewayServer extends grpc.UntypedServiceImplementation {
  ping: grpc.handleUnaryCall<
    proto_gateway_service_pb.PingRequest,
    proto_gateway_service_pb.PingResponse
  >;
  getEvaluations: grpc.handleUnaryCall<
    proto_gateway_service_pb.GetEvaluationsRequest,
    proto_gateway_service_pb.GetEvaluationsResponse
  >;
  getEvaluation: grpc.handleUnaryCall<
    proto_gateway_service_pb.GetEvaluationRequest,
    proto_gateway_service_pb.GetEvaluationResponse
  >;
  registerEvents: grpc.handleUnaryCall<
    proto_gateway_service_pb.RegisterEventsRequest,
    proto_gateway_service_pb.RegisterEventsResponse
  >;
}

export interface IGatewayClient {
  ping(
    request: proto_gateway_service_pb.PingRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.PingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  ping(
    request: proto_gateway_service_pb.PingRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.PingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  ping(
    request: proto_gateway_service_pb.PingRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.PingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getEvaluations(
    request: proto_gateway_service_pb.GetEvaluationsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getEvaluations(
    request: proto_gateway_service_pb.GetEvaluationsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getEvaluations(
    request: proto_gateway_service_pb.GetEvaluationsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getEvaluation(
    request: proto_gateway_service_pb.GetEvaluationRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getEvaluation(
    request: proto_gateway_service_pb.GetEvaluationRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getEvaluation(
    request: proto_gateway_service_pb.GetEvaluationRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  registerEvents(
    request: proto_gateway_service_pb.RegisterEventsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.RegisterEventsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  registerEvents(
    request: proto_gateway_service_pb.RegisterEventsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.RegisterEventsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  registerEvents(
    request: proto_gateway_service_pb.RegisterEventsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.RegisterEventsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}

export class GatewayClient extends grpc.Client implements IGatewayClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>,
  );
  public ping(
    request: proto_gateway_service_pb.PingRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.PingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public ping(
    request: proto_gateway_service_pb.PingRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.PingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public ping(
    request: proto_gateway_service_pb.PingRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.PingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getEvaluations(
    request: proto_gateway_service_pb.GetEvaluationsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getEvaluations(
    request: proto_gateway_service_pb.GetEvaluationsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getEvaluations(
    request: proto_gateway_service_pb.GetEvaluationsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getEvaluation(
    request: proto_gateway_service_pb.GetEvaluationRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getEvaluation(
    request: proto_gateway_service_pb.GetEvaluationRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getEvaluation(
    request: proto_gateway_service_pb.GetEvaluationRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.GetEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public registerEvents(
    request: proto_gateway_service_pb.RegisterEventsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.RegisterEventsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public registerEvents(
    request: proto_gateway_service_pb.RegisterEventsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.RegisterEventsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public registerEvents(
    request: proto_gateway_service_pb.RegisterEventsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_gateway_service_pb.RegisterEventsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}
