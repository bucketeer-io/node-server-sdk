// package: bucketeer.feature
// file: proto/feature/service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from '@grpc/grpc-js';
import * as proto_feature_service_pb from '../../proto/feature/service_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as proto_feature_command_pb from '../../proto/feature/command_pb';
import * as proto_feature_feature_pb from '../../proto/feature/feature_pb';
import * as proto_feature_evaluation_pb from '../../proto/feature/evaluation_pb';
import * as proto_user_user_pb from '../../proto/user/user_pb';
import * as proto_feature_segment_pb from '../../proto/feature/segment_pb';

interface IFeatureServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  searchFeatures: IFeatureServiceService_ISearchFeatures;
  getFeature: IFeatureServiceService_IGetFeature;
  getFeatures: IFeatureServiceService_IGetFeatures;
  listFeatures: IFeatureServiceService_IListFeatures;
  listEnabledFeatures: IFeatureServiceService_IListEnabledFeatures;
  createFeature: IFeatureServiceService_ICreateFeature;
  enableFeature: IFeatureServiceService_IEnableFeature;
  disableFeature: IFeatureServiceService_IDisableFeature;
  archiveFeature: IFeatureServiceService_IArchiveFeature;
  deleteFeature: IFeatureServiceService_IDeleteFeature;
  updateFeatureDetails: IFeatureServiceService_IUpdateFeatureDetails;
  updateFeatureVariations: IFeatureServiceService_IUpdateFeatureVariations;
  updateFeatureTargeting: IFeatureServiceService_IUpdateFeatureTargeting;
  createSegment: IFeatureServiceService_ICreateSegment;
  getSegment: IFeatureServiceService_IGetSegment;
  listSegments: IFeatureServiceService_IListSegments;
  deleteSegment: IFeatureServiceService_IDeleteSegment;
  updateSegment: IFeatureServiceService_IUpdateSegment;
  addSegmentUser: IFeatureServiceService_IAddSegmentUser;
  deleteSegmentUser: IFeatureServiceService_IDeleteSegmentUser;
  getSegmentUser: IFeatureServiceService_IGetSegmentUser;
  listSegmentUsers: IFeatureServiceService_IListSegmentUsers;
  bulkUploadSegmentUsers: IFeatureServiceService_IBulkUploadSegmentUsers;
  bulkDownloadSegmentUsers: IFeatureServiceService_IBulkDownloadSegmentUsers;
  evaluateOnAllFeatures: IFeatureServiceService_IEvaluateOnAllFeatures;
  getUserEvaluations: IFeatureServiceService_IGetUserEvaluations;
  upsertUserEvaluation: IFeatureServiceService_IUpsertUserEvaluation;
}

interface IFeatureServiceService_ISearchFeatures
  extends grpc.MethodDefinition<
    proto_feature_service_pb.SearchFeaturesRequest,
    proto_feature_service_pb.SearchFeaturesResponse
  > {
  path: '/bucketeer.feature.FeatureService/SearchFeatures';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.SearchFeaturesRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.SearchFeaturesRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.SearchFeaturesResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.SearchFeaturesResponse>;
}
interface IFeatureServiceService_IGetFeature
  extends grpc.MethodDefinition<
    proto_feature_service_pb.GetFeatureRequest,
    proto_feature_service_pb.GetFeatureResponse
  > {
  path: '/bucketeer.feature.FeatureService/GetFeature';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.GetFeatureRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.GetFeatureRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.GetFeatureResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.GetFeatureResponse>;
}
interface IFeatureServiceService_IGetFeatures
  extends grpc.MethodDefinition<
    proto_feature_service_pb.GetFeaturesRequest,
    proto_feature_service_pb.GetFeaturesResponse
  > {
  path: '/bucketeer.feature.FeatureService/GetFeatures';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.GetFeaturesRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.GetFeaturesRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.GetFeaturesResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.GetFeaturesResponse>;
}
interface IFeatureServiceService_IListFeatures
  extends grpc.MethodDefinition<
    proto_feature_service_pb.ListFeaturesRequest,
    proto_feature_service_pb.ListFeaturesResponse
  > {
  path: '/bucketeer.feature.FeatureService/ListFeatures';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.ListFeaturesRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.ListFeaturesRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.ListFeaturesResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.ListFeaturesResponse>;
}
interface IFeatureServiceService_IListEnabledFeatures
  extends grpc.MethodDefinition<
    proto_feature_service_pb.ListEnabledFeaturesRequest,
    proto_feature_service_pb.ListEnabledFeaturesResponse
  > {
  path: '/bucketeer.feature.FeatureService/ListEnabledFeatures';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.ListEnabledFeaturesRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.ListEnabledFeaturesRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.ListEnabledFeaturesResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.ListEnabledFeaturesResponse>;
}
interface IFeatureServiceService_ICreateFeature
  extends grpc.MethodDefinition<
    proto_feature_service_pb.CreateFeatureRequest,
    proto_feature_service_pb.CreateFeatureResponse
  > {
  path: '/bucketeer.feature.FeatureService/CreateFeature';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.CreateFeatureRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.CreateFeatureRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.CreateFeatureResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.CreateFeatureResponse>;
}
interface IFeatureServiceService_IEnableFeature
  extends grpc.MethodDefinition<
    proto_feature_service_pb.EnableFeatureRequest,
    proto_feature_service_pb.EnableFeatureResponse
  > {
  path: '/bucketeer.feature.FeatureService/EnableFeature';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.EnableFeatureRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.EnableFeatureRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.EnableFeatureResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.EnableFeatureResponse>;
}
interface IFeatureServiceService_IDisableFeature
  extends grpc.MethodDefinition<
    proto_feature_service_pb.DisableFeatureRequest,
    proto_feature_service_pb.DisableFeatureResponse
  > {
  path: '/bucketeer.feature.FeatureService/DisableFeature';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.DisableFeatureRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.DisableFeatureRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.DisableFeatureResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.DisableFeatureResponse>;
}
interface IFeatureServiceService_IArchiveFeature
  extends grpc.MethodDefinition<
    proto_feature_service_pb.ArchiveFeatureRequest,
    proto_feature_service_pb.ArchiveFeatureResponse
  > {
  path: '/bucketeer.feature.FeatureService/ArchiveFeature';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.ArchiveFeatureRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.ArchiveFeatureRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.ArchiveFeatureResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.ArchiveFeatureResponse>;
}
interface IFeatureServiceService_IDeleteFeature
  extends grpc.MethodDefinition<
    proto_feature_service_pb.DeleteFeatureRequest,
    proto_feature_service_pb.DeleteFeatureResponse
  > {
  path: '/bucketeer.feature.FeatureService/DeleteFeature';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.DeleteFeatureRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.DeleteFeatureRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.DeleteFeatureResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.DeleteFeatureResponse>;
}
interface IFeatureServiceService_IUpdateFeatureDetails
  extends grpc.MethodDefinition<
    proto_feature_service_pb.UpdateFeatureDetailsRequest,
    proto_feature_service_pb.UpdateFeatureDetailsResponse
  > {
  path: '/bucketeer.feature.FeatureService/UpdateFeatureDetails';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.UpdateFeatureDetailsRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateFeatureDetailsRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.UpdateFeatureDetailsResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateFeatureDetailsResponse>;
}
interface IFeatureServiceService_IUpdateFeatureVariations
  extends grpc.MethodDefinition<
    proto_feature_service_pb.UpdateFeatureVariationsRequest,
    proto_feature_service_pb.UpdateFeatureVariationsResponse
  > {
  path: '/bucketeer.feature.FeatureService/UpdateFeatureVariations';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.UpdateFeatureVariationsRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateFeatureVariationsRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.UpdateFeatureVariationsResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateFeatureVariationsResponse>;
}
interface IFeatureServiceService_IUpdateFeatureTargeting
  extends grpc.MethodDefinition<
    proto_feature_service_pb.UpdateFeatureTargetingRequest,
    proto_feature_service_pb.UpdateFeatureTargetingResponse
  > {
  path: '/bucketeer.feature.FeatureService/UpdateFeatureTargeting';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.UpdateFeatureTargetingRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateFeatureTargetingRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.UpdateFeatureTargetingResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateFeatureTargetingResponse>;
}
interface IFeatureServiceService_ICreateSegment
  extends grpc.MethodDefinition<
    proto_feature_service_pb.CreateSegmentRequest,
    proto_feature_service_pb.CreateSegmentResponse
  > {
  path: '/bucketeer.feature.FeatureService/CreateSegment';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.CreateSegmentRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.CreateSegmentRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.CreateSegmentResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.CreateSegmentResponse>;
}
interface IFeatureServiceService_IGetSegment
  extends grpc.MethodDefinition<
    proto_feature_service_pb.GetSegmentRequest,
    proto_feature_service_pb.GetSegmentResponse
  > {
  path: '/bucketeer.feature.FeatureService/GetSegment';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.GetSegmentRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.GetSegmentRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.GetSegmentResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.GetSegmentResponse>;
}
interface IFeatureServiceService_IListSegments
  extends grpc.MethodDefinition<
    proto_feature_service_pb.ListSegmentsRequest,
    proto_feature_service_pb.ListSegmentsResponse
  > {
  path: '/bucketeer.feature.FeatureService/ListSegments';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.ListSegmentsRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.ListSegmentsRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.ListSegmentsResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.ListSegmentsResponse>;
}
interface IFeatureServiceService_IDeleteSegment
  extends grpc.MethodDefinition<
    proto_feature_service_pb.DeleteSegmentRequest,
    proto_feature_service_pb.DeleteSegmentResponse
  > {
  path: '/bucketeer.feature.FeatureService/DeleteSegment';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.DeleteSegmentRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.DeleteSegmentRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.DeleteSegmentResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.DeleteSegmentResponse>;
}
interface IFeatureServiceService_IUpdateSegment
  extends grpc.MethodDefinition<
    proto_feature_service_pb.UpdateSegmentRequest,
    proto_feature_service_pb.UpdateSegmentResponse
  > {
  path: '/bucketeer.feature.FeatureService/UpdateSegment';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.UpdateSegmentRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateSegmentRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.UpdateSegmentResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.UpdateSegmentResponse>;
}
interface IFeatureServiceService_IAddSegmentUser
  extends grpc.MethodDefinition<
    proto_feature_service_pb.AddSegmentUserRequest,
    proto_feature_service_pb.AddSegmentUserResponse
  > {
  path: '/bucketeer.feature.FeatureService/AddSegmentUser';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.AddSegmentUserRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.AddSegmentUserRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.AddSegmentUserResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.AddSegmentUserResponse>;
}
interface IFeatureServiceService_IDeleteSegmentUser
  extends grpc.MethodDefinition<
    proto_feature_service_pb.DeleteSegmentUserRequest,
    proto_feature_service_pb.DeleteSegmentUserResponse
  > {
  path: '/bucketeer.feature.FeatureService/DeleteSegmentUser';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.DeleteSegmentUserRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.DeleteSegmentUserRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.DeleteSegmentUserResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.DeleteSegmentUserResponse>;
}
interface IFeatureServiceService_IGetSegmentUser
  extends grpc.MethodDefinition<
    proto_feature_service_pb.GetSegmentUserRequest,
    proto_feature_service_pb.GetSegmentUserResponse
  > {
  path: '/bucketeer.feature.FeatureService/GetSegmentUser';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.GetSegmentUserRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.GetSegmentUserRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.GetSegmentUserResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.GetSegmentUserResponse>;
}
interface IFeatureServiceService_IListSegmentUsers
  extends grpc.MethodDefinition<
    proto_feature_service_pb.ListSegmentUsersRequest,
    proto_feature_service_pb.ListSegmentUsersResponse
  > {
  path: '/bucketeer.feature.FeatureService/ListSegmentUsers';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.ListSegmentUsersRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.ListSegmentUsersRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.ListSegmentUsersResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.ListSegmentUsersResponse>;
}
interface IFeatureServiceService_IBulkUploadSegmentUsers
  extends grpc.MethodDefinition<
    proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    proto_feature_service_pb.BulkUploadSegmentUsersResponse
  > {
  path: '/bucketeer.feature.FeatureService/BulkUploadSegmentUsers';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.BulkUploadSegmentUsersRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.BulkUploadSegmentUsersRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.BulkUploadSegmentUsersResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.BulkUploadSegmentUsersResponse>;
}
interface IFeatureServiceService_IBulkDownloadSegmentUsers
  extends grpc.MethodDefinition<
    proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    proto_feature_service_pb.BulkDownloadSegmentUsersResponse
  > {
  path: '/bucketeer.feature.FeatureService/BulkDownloadSegmentUsers';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.BulkDownloadSegmentUsersRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.BulkDownloadSegmentUsersRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.BulkDownloadSegmentUsersResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.BulkDownloadSegmentUsersResponse>;
}
interface IFeatureServiceService_IEvaluateOnAllFeatures
  extends grpc.MethodDefinition<
    proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    proto_feature_service_pb.EvaluateOnAllFeaturesResponse
  > {
  path: '/bucketeer.feature.FeatureService/EvaluateOnAllFeatures';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.EvaluateOnAllFeaturesRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.EvaluateOnAllFeaturesRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.EvaluateOnAllFeaturesResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.EvaluateOnAllFeaturesResponse>;
}
interface IFeatureServiceService_IGetUserEvaluations
  extends grpc.MethodDefinition<
    proto_feature_service_pb.GetUserEvaluationsRequest,
    proto_feature_service_pb.GetUserEvaluationsResponse
  > {
  path: '/bucketeer.feature.FeatureService/GetUserEvaluations';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.GetUserEvaluationsRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.GetUserEvaluationsRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.GetUserEvaluationsResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.GetUserEvaluationsResponse>;
}
interface IFeatureServiceService_IUpsertUserEvaluation
  extends grpc.MethodDefinition<
    proto_feature_service_pb.UpsertUserEvaluationRequest,
    proto_feature_service_pb.UpsertUserEvaluationResponse
  > {
  path: '/bucketeer.feature.FeatureService/UpsertUserEvaluation';
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<proto_feature_service_pb.UpsertUserEvaluationRequest>;
  requestDeserialize: grpc.deserialize<proto_feature_service_pb.UpsertUserEvaluationRequest>;
  responseSerialize: grpc.serialize<proto_feature_service_pb.UpsertUserEvaluationResponse>;
  responseDeserialize: grpc.deserialize<proto_feature_service_pb.UpsertUserEvaluationResponse>;
}

export const FeatureServiceService: IFeatureServiceService;

export interface IFeatureServiceServer extends grpc.UntypedServiceImplementation {
  searchFeatures: grpc.handleUnaryCall<
    proto_feature_service_pb.SearchFeaturesRequest,
    proto_feature_service_pb.SearchFeaturesResponse
  >;
  getFeature: grpc.handleUnaryCall<
    proto_feature_service_pb.GetFeatureRequest,
    proto_feature_service_pb.GetFeatureResponse
  >;
  getFeatures: grpc.handleUnaryCall<
    proto_feature_service_pb.GetFeaturesRequest,
    proto_feature_service_pb.GetFeaturesResponse
  >;
  listFeatures: grpc.handleUnaryCall<
    proto_feature_service_pb.ListFeaturesRequest,
    proto_feature_service_pb.ListFeaturesResponse
  >;
  listEnabledFeatures: grpc.handleUnaryCall<
    proto_feature_service_pb.ListEnabledFeaturesRequest,
    proto_feature_service_pb.ListEnabledFeaturesResponse
  >;
  createFeature: grpc.handleUnaryCall<
    proto_feature_service_pb.CreateFeatureRequest,
    proto_feature_service_pb.CreateFeatureResponse
  >;
  enableFeature: grpc.handleUnaryCall<
    proto_feature_service_pb.EnableFeatureRequest,
    proto_feature_service_pb.EnableFeatureResponse
  >;
  disableFeature: grpc.handleUnaryCall<
    proto_feature_service_pb.DisableFeatureRequest,
    proto_feature_service_pb.DisableFeatureResponse
  >;
  archiveFeature: grpc.handleUnaryCall<
    proto_feature_service_pb.ArchiveFeatureRequest,
    proto_feature_service_pb.ArchiveFeatureResponse
  >;
  deleteFeature: grpc.handleUnaryCall<
    proto_feature_service_pb.DeleteFeatureRequest,
    proto_feature_service_pb.DeleteFeatureResponse
  >;
  updateFeatureDetails: grpc.handleUnaryCall<
    proto_feature_service_pb.UpdateFeatureDetailsRequest,
    proto_feature_service_pb.UpdateFeatureDetailsResponse
  >;
  updateFeatureVariations: grpc.handleUnaryCall<
    proto_feature_service_pb.UpdateFeatureVariationsRequest,
    proto_feature_service_pb.UpdateFeatureVariationsResponse
  >;
  updateFeatureTargeting: grpc.handleUnaryCall<
    proto_feature_service_pb.UpdateFeatureTargetingRequest,
    proto_feature_service_pb.UpdateFeatureTargetingResponse
  >;
  createSegment: grpc.handleUnaryCall<
    proto_feature_service_pb.CreateSegmentRequest,
    proto_feature_service_pb.CreateSegmentResponse
  >;
  getSegment: grpc.handleUnaryCall<
    proto_feature_service_pb.GetSegmentRequest,
    proto_feature_service_pb.GetSegmentResponse
  >;
  listSegments: grpc.handleUnaryCall<
    proto_feature_service_pb.ListSegmentsRequest,
    proto_feature_service_pb.ListSegmentsResponse
  >;
  deleteSegment: grpc.handleUnaryCall<
    proto_feature_service_pb.DeleteSegmentRequest,
    proto_feature_service_pb.DeleteSegmentResponse
  >;
  updateSegment: grpc.handleUnaryCall<
    proto_feature_service_pb.UpdateSegmentRequest,
    proto_feature_service_pb.UpdateSegmentResponse
  >;
  addSegmentUser: grpc.handleUnaryCall<
    proto_feature_service_pb.AddSegmentUserRequest,
    proto_feature_service_pb.AddSegmentUserResponse
  >;
  deleteSegmentUser: grpc.handleUnaryCall<
    proto_feature_service_pb.DeleteSegmentUserRequest,
    proto_feature_service_pb.DeleteSegmentUserResponse
  >;
  getSegmentUser: grpc.handleUnaryCall<
    proto_feature_service_pb.GetSegmentUserRequest,
    proto_feature_service_pb.GetSegmentUserResponse
  >;
  listSegmentUsers: grpc.handleUnaryCall<
    proto_feature_service_pb.ListSegmentUsersRequest,
    proto_feature_service_pb.ListSegmentUsersResponse
  >;
  bulkUploadSegmentUsers: grpc.handleUnaryCall<
    proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    proto_feature_service_pb.BulkUploadSegmentUsersResponse
  >;
  bulkDownloadSegmentUsers: grpc.handleUnaryCall<
    proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    proto_feature_service_pb.BulkDownloadSegmentUsersResponse
  >;
  evaluateOnAllFeatures: grpc.handleUnaryCall<
    proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    proto_feature_service_pb.EvaluateOnAllFeaturesResponse
  >;
  getUserEvaluations: grpc.handleUnaryCall<
    proto_feature_service_pb.GetUserEvaluationsRequest,
    proto_feature_service_pb.GetUserEvaluationsResponse
  >;
  upsertUserEvaluation: grpc.handleUnaryCall<
    proto_feature_service_pb.UpsertUserEvaluationRequest,
    proto_feature_service_pb.UpsertUserEvaluationResponse
  >;
}

export interface IFeatureServiceClient {
  searchFeatures(
    request: proto_feature_service_pb.SearchFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.SearchFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  searchFeatures(
    request: proto_feature_service_pb.SearchFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.SearchFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  searchFeatures(
    request: proto_feature_service_pb.SearchFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.SearchFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getFeature(
    request: proto_feature_service_pb.GetFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getFeature(
    request: proto_feature_service_pb.GetFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getFeature(
    request: proto_feature_service_pb.GetFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getFeatures(
    request: proto_feature_service_pb.GetFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getFeatures(
    request: proto_feature_service_pb.GetFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getFeatures(
    request: proto_feature_service_pb.GetFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listFeatures(
    request: proto_feature_service_pb.ListFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listFeatures(
    request: proto_feature_service_pb.ListFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listFeatures(
    request: proto_feature_service_pb.ListFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listEnabledFeatures(
    request: proto_feature_service_pb.ListEnabledFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListEnabledFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listEnabledFeatures(
    request: proto_feature_service_pb.ListEnabledFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListEnabledFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listEnabledFeatures(
    request: proto_feature_service_pb.ListEnabledFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListEnabledFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createFeature(
    request: proto_feature_service_pb.CreateFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createFeature(
    request: proto_feature_service_pb.CreateFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createFeature(
    request: proto_feature_service_pb.CreateFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  enableFeature(
    request: proto_feature_service_pb.EnableFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EnableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  enableFeature(
    request: proto_feature_service_pb.EnableFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EnableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  enableFeature(
    request: proto_feature_service_pb.EnableFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EnableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  disableFeature(
    request: proto_feature_service_pb.DisableFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DisableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  disableFeature(
    request: proto_feature_service_pb.DisableFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DisableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  disableFeature(
    request: proto_feature_service_pb.DisableFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DisableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  archiveFeature(
    request: proto_feature_service_pb.ArchiveFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ArchiveFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  archiveFeature(
    request: proto_feature_service_pb.ArchiveFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ArchiveFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  archiveFeature(
    request: proto_feature_service_pb.ArchiveFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ArchiveFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteFeature(
    request: proto_feature_service_pb.DeleteFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteFeature(
    request: proto_feature_service_pb.DeleteFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteFeature(
    request: proto_feature_service_pb.DeleteFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureDetails(
    request: proto_feature_service_pb.UpdateFeatureDetailsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureDetailsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureDetails(
    request: proto_feature_service_pb.UpdateFeatureDetailsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureDetailsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureDetails(
    request: proto_feature_service_pb.UpdateFeatureDetailsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureDetailsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureVariations(
    request: proto_feature_service_pb.UpdateFeatureVariationsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureVariationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureVariations(
    request: proto_feature_service_pb.UpdateFeatureVariationsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureVariationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureVariations(
    request: proto_feature_service_pb.UpdateFeatureVariationsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureVariationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureTargeting(
    request: proto_feature_service_pb.UpdateFeatureTargetingRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureTargetingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureTargeting(
    request: proto_feature_service_pb.UpdateFeatureTargetingRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureTargetingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateFeatureTargeting(
    request: proto_feature_service_pb.UpdateFeatureTargetingRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureTargetingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createSegment(
    request: proto_feature_service_pb.CreateSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createSegment(
    request: proto_feature_service_pb.CreateSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createSegment(
    request: proto_feature_service_pb.CreateSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getSegment(
    request: proto_feature_service_pb.GetSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getSegment(
    request: proto_feature_service_pb.GetSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getSegment(
    request: proto_feature_service_pb.GetSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listSegments(
    request: proto_feature_service_pb.ListSegmentsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listSegments(
    request: proto_feature_service_pb.ListSegmentsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listSegments(
    request: proto_feature_service_pb.ListSegmentsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteSegment(
    request: proto_feature_service_pb.DeleteSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteSegment(
    request: proto_feature_service_pb.DeleteSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteSegment(
    request: proto_feature_service_pb.DeleteSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateSegment(
    request: proto_feature_service_pb.UpdateSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateSegment(
    request: proto_feature_service_pb.UpdateSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  updateSegment(
    request: proto_feature_service_pb.UpdateSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  addSegmentUser(
    request: proto_feature_service_pb.AddSegmentUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.AddSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  addSegmentUser(
    request: proto_feature_service_pb.AddSegmentUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.AddSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  addSegmentUser(
    request: proto_feature_service_pb.AddSegmentUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.AddSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteSegmentUser(
    request: proto_feature_service_pb.DeleteSegmentUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteSegmentUser(
    request: proto_feature_service_pb.DeleteSegmentUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  deleteSegmentUser(
    request: proto_feature_service_pb.DeleteSegmentUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getSegmentUser(
    request: proto_feature_service_pb.GetSegmentUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getSegmentUser(
    request: proto_feature_service_pb.GetSegmentUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getSegmentUser(
    request: proto_feature_service_pb.GetSegmentUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listSegmentUsers(
    request: proto_feature_service_pb.ListSegmentUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listSegmentUsers(
    request: proto_feature_service_pb.ListSegmentUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  listSegmentUsers(
    request: proto_feature_service_pb.ListSegmentUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  bulkUploadSegmentUsers(
    request: proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkUploadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  bulkUploadSegmentUsers(
    request: proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkUploadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  bulkUploadSegmentUsers(
    request: proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkUploadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  bulkDownloadSegmentUsers(
    request: proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkDownloadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  bulkDownloadSegmentUsers(
    request: proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkDownloadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  bulkDownloadSegmentUsers(
    request: proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkDownloadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  evaluateOnAllFeatures(
    request: proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EvaluateOnAllFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  evaluateOnAllFeatures(
    request: proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EvaluateOnAllFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  evaluateOnAllFeatures(
    request: proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EvaluateOnAllFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getUserEvaluations(
    request: proto_feature_service_pb.GetUserEvaluationsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetUserEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getUserEvaluations(
    request: proto_feature_service_pb.GetUserEvaluationsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetUserEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  getUserEvaluations(
    request: proto_feature_service_pb.GetUserEvaluationsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetUserEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  upsertUserEvaluation(
    request: proto_feature_service_pb.UpsertUserEvaluationRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpsertUserEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  upsertUserEvaluation(
    request: proto_feature_service_pb.UpsertUserEvaluationRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpsertUserEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  upsertUserEvaluation(
    request: proto_feature_service_pb.UpsertUserEvaluationRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpsertUserEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}

export class FeatureServiceClient extends grpc.Client implements IFeatureServiceClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>,
  );
  public searchFeatures(
    request: proto_feature_service_pb.SearchFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.SearchFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public searchFeatures(
    request: proto_feature_service_pb.SearchFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.SearchFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public searchFeatures(
    request: proto_feature_service_pb.SearchFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.SearchFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getFeature(
    request: proto_feature_service_pb.GetFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getFeature(
    request: proto_feature_service_pb.GetFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getFeature(
    request: proto_feature_service_pb.GetFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getFeatures(
    request: proto_feature_service_pb.GetFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getFeatures(
    request: proto_feature_service_pb.GetFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getFeatures(
    request: proto_feature_service_pb.GetFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listFeatures(
    request: proto_feature_service_pb.ListFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listFeatures(
    request: proto_feature_service_pb.ListFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listFeatures(
    request: proto_feature_service_pb.ListFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listEnabledFeatures(
    request: proto_feature_service_pb.ListEnabledFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListEnabledFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listEnabledFeatures(
    request: proto_feature_service_pb.ListEnabledFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListEnabledFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listEnabledFeatures(
    request: proto_feature_service_pb.ListEnabledFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListEnabledFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createFeature(
    request: proto_feature_service_pb.CreateFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createFeature(
    request: proto_feature_service_pb.CreateFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createFeature(
    request: proto_feature_service_pb.CreateFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public enableFeature(
    request: proto_feature_service_pb.EnableFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EnableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public enableFeature(
    request: proto_feature_service_pb.EnableFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EnableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public enableFeature(
    request: proto_feature_service_pb.EnableFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EnableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public disableFeature(
    request: proto_feature_service_pb.DisableFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DisableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public disableFeature(
    request: proto_feature_service_pb.DisableFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DisableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public disableFeature(
    request: proto_feature_service_pb.DisableFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DisableFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public archiveFeature(
    request: proto_feature_service_pb.ArchiveFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ArchiveFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public archiveFeature(
    request: proto_feature_service_pb.ArchiveFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ArchiveFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public archiveFeature(
    request: proto_feature_service_pb.ArchiveFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ArchiveFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteFeature(
    request: proto_feature_service_pb.DeleteFeatureRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteFeature(
    request: proto_feature_service_pb.DeleteFeatureRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteFeature(
    request: proto_feature_service_pb.DeleteFeatureRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteFeatureResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureDetails(
    request: proto_feature_service_pb.UpdateFeatureDetailsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureDetailsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureDetails(
    request: proto_feature_service_pb.UpdateFeatureDetailsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureDetailsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureDetails(
    request: proto_feature_service_pb.UpdateFeatureDetailsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureDetailsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureVariations(
    request: proto_feature_service_pb.UpdateFeatureVariationsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureVariationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureVariations(
    request: proto_feature_service_pb.UpdateFeatureVariationsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureVariationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureVariations(
    request: proto_feature_service_pb.UpdateFeatureVariationsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureVariationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureTargeting(
    request: proto_feature_service_pb.UpdateFeatureTargetingRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureTargetingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureTargeting(
    request: proto_feature_service_pb.UpdateFeatureTargetingRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureTargetingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateFeatureTargeting(
    request: proto_feature_service_pb.UpdateFeatureTargetingRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateFeatureTargetingResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createSegment(
    request: proto_feature_service_pb.CreateSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createSegment(
    request: proto_feature_service_pb.CreateSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createSegment(
    request: proto_feature_service_pb.CreateSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.CreateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getSegment(
    request: proto_feature_service_pb.GetSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getSegment(
    request: proto_feature_service_pb.GetSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getSegment(
    request: proto_feature_service_pb.GetSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listSegments(
    request: proto_feature_service_pb.ListSegmentsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listSegments(
    request: proto_feature_service_pb.ListSegmentsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listSegments(
    request: proto_feature_service_pb.ListSegmentsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteSegment(
    request: proto_feature_service_pb.DeleteSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteSegment(
    request: proto_feature_service_pb.DeleteSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteSegment(
    request: proto_feature_service_pb.DeleteSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateSegment(
    request: proto_feature_service_pb.UpdateSegmentRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateSegment(
    request: proto_feature_service_pb.UpdateSegmentRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public updateSegment(
    request: proto_feature_service_pb.UpdateSegmentRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpdateSegmentResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public addSegmentUser(
    request: proto_feature_service_pb.AddSegmentUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.AddSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public addSegmentUser(
    request: proto_feature_service_pb.AddSegmentUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.AddSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public addSegmentUser(
    request: proto_feature_service_pb.AddSegmentUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.AddSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteSegmentUser(
    request: proto_feature_service_pb.DeleteSegmentUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteSegmentUser(
    request: proto_feature_service_pb.DeleteSegmentUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public deleteSegmentUser(
    request: proto_feature_service_pb.DeleteSegmentUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.DeleteSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getSegmentUser(
    request: proto_feature_service_pb.GetSegmentUserRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getSegmentUser(
    request: proto_feature_service_pb.GetSegmentUserRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getSegmentUser(
    request: proto_feature_service_pb.GetSegmentUserRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetSegmentUserResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listSegmentUsers(
    request: proto_feature_service_pb.ListSegmentUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listSegmentUsers(
    request: proto_feature_service_pb.ListSegmentUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public listSegmentUsers(
    request: proto_feature_service_pb.ListSegmentUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.ListSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public bulkUploadSegmentUsers(
    request: proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkUploadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public bulkUploadSegmentUsers(
    request: proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkUploadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public bulkUploadSegmentUsers(
    request: proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkUploadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public bulkDownloadSegmentUsers(
    request: proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkDownloadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public bulkDownloadSegmentUsers(
    request: proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkDownloadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public bulkDownloadSegmentUsers(
    request: proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.BulkDownloadSegmentUsersResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public evaluateOnAllFeatures(
    request: proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EvaluateOnAllFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public evaluateOnAllFeatures(
    request: proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EvaluateOnAllFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public evaluateOnAllFeatures(
    request: proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.EvaluateOnAllFeaturesResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getUserEvaluations(
    request: proto_feature_service_pb.GetUserEvaluationsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetUserEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getUserEvaluations(
    request: proto_feature_service_pb.GetUserEvaluationsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetUserEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public getUserEvaluations(
    request: proto_feature_service_pb.GetUserEvaluationsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.GetUserEvaluationsResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public upsertUserEvaluation(
    request: proto_feature_service_pb.UpsertUserEvaluationRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpsertUserEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public upsertUserEvaluation(
    request: proto_feature_service_pb.UpsertUserEvaluationRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpsertUserEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public upsertUserEvaluation(
    request: proto_feature_service_pb.UpsertUserEvaluationRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: proto_feature_service_pb.UpsertUserEvaluationResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}
