// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_feature_service_pb = require('../../proto/feature/service_pb.js');
var google_protobuf_wrappers_pb = require('google-protobuf/google/protobuf/wrappers_pb.js');
var proto_feature_command_pb = require('../../proto/feature/command_pb.js');
var proto_feature_feature_pb = require('../../proto/feature/feature_pb.js');
var proto_feature_evaluation_pb = require('../../proto/feature/evaluation_pb.js');
var proto_user_user_pb = require('../../proto/user/user_pb.js');
var proto_feature_segment_pb = require('../../proto/feature/segment_pb.js');

function serialize_bucketeer_feature_AddSegmentUserRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.AddSegmentUserRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.AddSegmentUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_AddSegmentUserRequest(buffer_arg) {
  return proto_feature_service_pb.AddSegmentUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_AddSegmentUserResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.AddSegmentUserResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.AddSegmentUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_AddSegmentUserResponse(buffer_arg) {
  return proto_feature_service_pb.AddSegmentUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ArchiveFeatureRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.ArchiveFeatureRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.ArchiveFeatureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ArchiveFeatureRequest(buffer_arg) {
  return proto_feature_service_pb.ArchiveFeatureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ArchiveFeatureResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.ArchiveFeatureResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.ArchiveFeatureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ArchiveFeatureResponse(buffer_arg) {
  return proto_feature_service_pb.ArchiveFeatureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_BulkDownloadSegmentUsersRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.BulkDownloadSegmentUsersRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.BulkDownloadSegmentUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_BulkDownloadSegmentUsersRequest(buffer_arg) {
  return proto_feature_service_pb.BulkDownloadSegmentUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_BulkDownloadSegmentUsersResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.BulkDownloadSegmentUsersResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.BulkDownloadSegmentUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_BulkDownloadSegmentUsersResponse(buffer_arg) {
  return proto_feature_service_pb.BulkDownloadSegmentUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_BulkUploadSegmentUsersRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.BulkUploadSegmentUsersRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.BulkUploadSegmentUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_BulkUploadSegmentUsersRequest(buffer_arg) {
  return proto_feature_service_pb.BulkUploadSegmentUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_BulkUploadSegmentUsersResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.BulkUploadSegmentUsersResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.BulkUploadSegmentUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_BulkUploadSegmentUsersResponse(buffer_arg) {
  return proto_feature_service_pb.BulkUploadSegmentUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_CreateFeatureRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.CreateFeatureRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.CreateFeatureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_CreateFeatureRequest(buffer_arg) {
  return proto_feature_service_pb.CreateFeatureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_CreateFeatureResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.CreateFeatureResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.CreateFeatureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_CreateFeatureResponse(buffer_arg) {
  return proto_feature_service_pb.CreateFeatureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_CreateSegmentRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.CreateSegmentRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.CreateSegmentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_CreateSegmentRequest(buffer_arg) {
  return proto_feature_service_pb.CreateSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_CreateSegmentResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.CreateSegmentResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.CreateSegmentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_CreateSegmentResponse(buffer_arg) {
  return proto_feature_service_pb.CreateSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DeleteFeatureRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.DeleteFeatureRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.DeleteFeatureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DeleteFeatureRequest(buffer_arg) {
  return proto_feature_service_pb.DeleteFeatureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DeleteFeatureResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.DeleteFeatureResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.DeleteFeatureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DeleteFeatureResponse(buffer_arg) {
  return proto_feature_service_pb.DeleteFeatureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DeleteSegmentRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.DeleteSegmentRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.DeleteSegmentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DeleteSegmentRequest(buffer_arg) {
  return proto_feature_service_pb.DeleteSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DeleteSegmentResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.DeleteSegmentResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.DeleteSegmentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DeleteSegmentResponse(buffer_arg) {
  return proto_feature_service_pb.DeleteSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DeleteSegmentUserRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.DeleteSegmentUserRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.DeleteSegmentUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DeleteSegmentUserRequest(buffer_arg) {
  return proto_feature_service_pb.DeleteSegmentUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DeleteSegmentUserResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.DeleteSegmentUserResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.DeleteSegmentUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DeleteSegmentUserResponse(buffer_arg) {
  return proto_feature_service_pb.DeleteSegmentUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DisableFeatureRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.DisableFeatureRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.DisableFeatureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DisableFeatureRequest(buffer_arg) {
  return proto_feature_service_pb.DisableFeatureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_DisableFeatureResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.DisableFeatureResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.DisableFeatureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_DisableFeatureResponse(buffer_arg) {
  return proto_feature_service_pb.DisableFeatureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_EnableFeatureRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.EnableFeatureRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.EnableFeatureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_EnableFeatureRequest(buffer_arg) {
  return proto_feature_service_pb.EnableFeatureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_EnableFeatureResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.EnableFeatureResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.EnableFeatureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_EnableFeatureResponse(buffer_arg) {
  return proto_feature_service_pb.EnableFeatureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_EvaluateOnAllFeaturesRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.EvaluateOnAllFeaturesRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.EvaluateOnAllFeaturesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_EvaluateOnAllFeaturesRequest(buffer_arg) {
  return proto_feature_service_pb.EvaluateOnAllFeaturesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_EvaluateOnAllFeaturesResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.EvaluateOnAllFeaturesResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.EvaluateOnAllFeaturesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_EvaluateOnAllFeaturesResponse(buffer_arg) {
  return proto_feature_service_pb.EvaluateOnAllFeaturesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetFeatureRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetFeatureRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.GetFeatureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetFeatureRequest(buffer_arg) {
  return proto_feature_service_pb.GetFeatureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetFeatureResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetFeatureResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.GetFeatureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetFeatureResponse(buffer_arg) {
  return proto_feature_service_pb.GetFeatureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetFeaturesRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetFeaturesRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.GetFeaturesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetFeaturesRequest(buffer_arg) {
  return proto_feature_service_pb.GetFeaturesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetFeaturesResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetFeaturesResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.GetFeaturesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetFeaturesResponse(buffer_arg) {
  return proto_feature_service_pb.GetFeaturesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetSegmentRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetSegmentRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.GetSegmentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetSegmentRequest(buffer_arg) {
  return proto_feature_service_pb.GetSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetSegmentResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetSegmentResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.GetSegmentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetSegmentResponse(buffer_arg) {
  return proto_feature_service_pb.GetSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetSegmentUserRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetSegmentUserRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.GetSegmentUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetSegmentUserRequest(buffer_arg) {
  return proto_feature_service_pb.GetSegmentUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetSegmentUserResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetSegmentUserResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.GetSegmentUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetSegmentUserResponse(buffer_arg) {
  return proto_feature_service_pb.GetSegmentUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetUserEvaluationsRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetUserEvaluationsRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.GetUserEvaluationsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetUserEvaluationsRequest(buffer_arg) {
  return proto_feature_service_pb.GetUserEvaluationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_GetUserEvaluationsResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.GetUserEvaluationsResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.GetUserEvaluationsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_GetUserEvaluationsResponse(buffer_arg) {
  return proto_feature_service_pb.GetUserEvaluationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListEnabledFeaturesRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListEnabledFeaturesRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.ListEnabledFeaturesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListEnabledFeaturesRequest(buffer_arg) {
  return proto_feature_service_pb.ListEnabledFeaturesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListEnabledFeaturesResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListEnabledFeaturesResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.ListEnabledFeaturesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListEnabledFeaturesResponse(buffer_arg) {
  return proto_feature_service_pb.ListEnabledFeaturesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListFeaturesRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListFeaturesRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.ListFeaturesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListFeaturesRequest(buffer_arg) {
  return proto_feature_service_pb.ListFeaturesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListFeaturesResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListFeaturesResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.ListFeaturesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListFeaturesResponse(buffer_arg) {
  return proto_feature_service_pb.ListFeaturesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListSegmentUsersRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListSegmentUsersRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.ListSegmentUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListSegmentUsersRequest(buffer_arg) {
  return proto_feature_service_pb.ListSegmentUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListSegmentUsersResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListSegmentUsersResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.ListSegmentUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListSegmentUsersResponse(buffer_arg) {
  return proto_feature_service_pb.ListSegmentUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListSegmentsRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListSegmentsRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.ListSegmentsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListSegmentsRequest(buffer_arg) {
  return proto_feature_service_pb.ListSegmentsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_ListSegmentsResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.ListSegmentsResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.ListSegmentsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_ListSegmentsResponse(buffer_arg) {
  return proto_feature_service_pb.ListSegmentsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_SearchFeaturesRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.SearchFeaturesRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.SearchFeaturesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_SearchFeaturesRequest(buffer_arg) {
  return proto_feature_service_pb.SearchFeaturesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_SearchFeaturesResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.SearchFeaturesResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.SearchFeaturesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_SearchFeaturesResponse(buffer_arg) {
  return proto_feature_service_pb.SearchFeaturesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateFeatureDetailsRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateFeatureDetailsRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateFeatureDetailsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateFeatureDetailsRequest(buffer_arg) {
  return proto_feature_service_pb.UpdateFeatureDetailsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateFeatureDetailsResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateFeatureDetailsResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateFeatureDetailsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateFeatureDetailsResponse(buffer_arg) {
  return proto_feature_service_pb.UpdateFeatureDetailsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateFeatureTargetingRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateFeatureTargetingRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateFeatureTargetingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateFeatureTargetingRequest(buffer_arg) {
  return proto_feature_service_pb.UpdateFeatureTargetingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateFeatureTargetingResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateFeatureTargetingResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateFeatureTargetingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateFeatureTargetingResponse(buffer_arg) {
  return proto_feature_service_pb.UpdateFeatureTargetingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateFeatureVariationsRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateFeatureVariationsRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateFeatureVariationsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateFeatureVariationsRequest(buffer_arg) {
  return proto_feature_service_pb.UpdateFeatureVariationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateFeatureVariationsResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateFeatureVariationsResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateFeatureVariationsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateFeatureVariationsResponse(buffer_arg) {
  return proto_feature_service_pb.UpdateFeatureVariationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateSegmentRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateSegmentRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateSegmentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateSegmentRequest(buffer_arg) {
  return proto_feature_service_pb.UpdateSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpdateSegmentResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpdateSegmentResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.UpdateSegmentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpdateSegmentResponse(buffer_arg) {
  return proto_feature_service_pb.UpdateSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpsertUserEvaluationRequest(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpsertUserEvaluationRequest)) {
    throw new Error('Expected argument of type bucketeer.feature.UpsertUserEvaluationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpsertUserEvaluationRequest(buffer_arg) {
  return proto_feature_service_pb.UpsertUserEvaluationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bucketeer_feature_UpsertUserEvaluationResponse(arg) {
  if (!(arg instanceof proto_feature_service_pb.UpsertUserEvaluationResponse)) {
    throw new Error('Expected argument of type bucketeer.feature.UpsertUserEvaluationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bucketeer_feature_UpsertUserEvaluationResponse(buffer_arg) {
  return proto_feature_service_pb.UpsertUserEvaluationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var FeatureServiceService = exports.FeatureServiceService = {
  searchFeatures: {
    path: '/bucketeer.feature.FeatureService/SearchFeatures',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.SearchFeaturesRequest,
    responseType: proto_feature_service_pb.SearchFeaturesResponse,
    requestSerialize: serialize_bucketeer_feature_SearchFeaturesRequest,
    requestDeserialize: deserialize_bucketeer_feature_SearchFeaturesRequest,
    responseSerialize: serialize_bucketeer_feature_SearchFeaturesResponse,
    responseDeserialize: deserialize_bucketeer_feature_SearchFeaturesResponse,
  },
  getFeature: {
    path: '/bucketeer.feature.FeatureService/GetFeature',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.GetFeatureRequest,
    responseType: proto_feature_service_pb.GetFeatureResponse,
    requestSerialize: serialize_bucketeer_feature_GetFeatureRequest,
    requestDeserialize: deserialize_bucketeer_feature_GetFeatureRequest,
    responseSerialize: serialize_bucketeer_feature_GetFeatureResponse,
    responseDeserialize: deserialize_bucketeer_feature_GetFeatureResponse,
  },
  getFeatures: {
    path: '/bucketeer.feature.FeatureService/GetFeatures',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.GetFeaturesRequest,
    responseType: proto_feature_service_pb.GetFeaturesResponse,
    requestSerialize: serialize_bucketeer_feature_GetFeaturesRequest,
    requestDeserialize: deserialize_bucketeer_feature_GetFeaturesRequest,
    responseSerialize: serialize_bucketeer_feature_GetFeaturesResponse,
    responseDeserialize: deserialize_bucketeer_feature_GetFeaturesResponse,
  },
  listFeatures: {
    path: '/bucketeer.feature.FeatureService/ListFeatures',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.ListFeaturesRequest,
    responseType: proto_feature_service_pb.ListFeaturesResponse,
    requestSerialize: serialize_bucketeer_feature_ListFeaturesRequest,
    requestDeserialize: deserialize_bucketeer_feature_ListFeaturesRequest,
    responseSerialize: serialize_bucketeer_feature_ListFeaturesResponse,
    responseDeserialize: deserialize_bucketeer_feature_ListFeaturesResponse,
  },
  listEnabledFeatures: {
    path: '/bucketeer.feature.FeatureService/ListEnabledFeatures',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.ListEnabledFeaturesRequest,
    responseType: proto_feature_service_pb.ListEnabledFeaturesResponse,
    requestSerialize: serialize_bucketeer_feature_ListEnabledFeaturesRequest,
    requestDeserialize: deserialize_bucketeer_feature_ListEnabledFeaturesRequest,
    responseSerialize: serialize_bucketeer_feature_ListEnabledFeaturesResponse,
    responseDeserialize: deserialize_bucketeer_feature_ListEnabledFeaturesResponse,
  },
  createFeature: {
    path: '/bucketeer.feature.FeatureService/CreateFeature',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.CreateFeatureRequest,
    responseType: proto_feature_service_pb.CreateFeatureResponse,
    requestSerialize: serialize_bucketeer_feature_CreateFeatureRequest,
    requestDeserialize: deserialize_bucketeer_feature_CreateFeatureRequest,
    responseSerialize: serialize_bucketeer_feature_CreateFeatureResponse,
    responseDeserialize: deserialize_bucketeer_feature_CreateFeatureResponse,
  },
  enableFeature: {
    path: '/bucketeer.feature.FeatureService/EnableFeature',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.EnableFeatureRequest,
    responseType: proto_feature_service_pb.EnableFeatureResponse,
    requestSerialize: serialize_bucketeer_feature_EnableFeatureRequest,
    requestDeserialize: deserialize_bucketeer_feature_EnableFeatureRequest,
    responseSerialize: serialize_bucketeer_feature_EnableFeatureResponse,
    responseDeserialize: deserialize_bucketeer_feature_EnableFeatureResponse,
  },
  disableFeature: {
    path: '/bucketeer.feature.FeatureService/DisableFeature',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.DisableFeatureRequest,
    responseType: proto_feature_service_pb.DisableFeatureResponse,
    requestSerialize: serialize_bucketeer_feature_DisableFeatureRequest,
    requestDeserialize: deserialize_bucketeer_feature_DisableFeatureRequest,
    responseSerialize: serialize_bucketeer_feature_DisableFeatureResponse,
    responseDeserialize: deserialize_bucketeer_feature_DisableFeatureResponse,
  },
  archiveFeature: {
    path: '/bucketeer.feature.FeatureService/ArchiveFeature',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.ArchiveFeatureRequest,
    responseType: proto_feature_service_pb.ArchiveFeatureResponse,
    requestSerialize: serialize_bucketeer_feature_ArchiveFeatureRequest,
    requestDeserialize: deserialize_bucketeer_feature_ArchiveFeatureRequest,
    responseSerialize: serialize_bucketeer_feature_ArchiveFeatureResponse,
    responseDeserialize: deserialize_bucketeer_feature_ArchiveFeatureResponse,
  },
  deleteFeature: {
    path: '/bucketeer.feature.FeatureService/DeleteFeature',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.DeleteFeatureRequest,
    responseType: proto_feature_service_pb.DeleteFeatureResponse,
    requestSerialize: serialize_bucketeer_feature_DeleteFeatureRequest,
    requestDeserialize: deserialize_bucketeer_feature_DeleteFeatureRequest,
    responseSerialize: serialize_bucketeer_feature_DeleteFeatureResponse,
    responseDeserialize: deserialize_bucketeer_feature_DeleteFeatureResponse,
  },
  updateFeatureDetails: {
    path: '/bucketeer.feature.FeatureService/UpdateFeatureDetails',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.UpdateFeatureDetailsRequest,
    responseType: proto_feature_service_pb.UpdateFeatureDetailsResponse,
    requestSerialize: serialize_bucketeer_feature_UpdateFeatureDetailsRequest,
    requestDeserialize: deserialize_bucketeer_feature_UpdateFeatureDetailsRequest,
    responseSerialize: serialize_bucketeer_feature_UpdateFeatureDetailsResponse,
    responseDeserialize: deserialize_bucketeer_feature_UpdateFeatureDetailsResponse,
  },
  updateFeatureVariations: {
    path: '/bucketeer.feature.FeatureService/UpdateFeatureVariations',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.UpdateFeatureVariationsRequest,
    responseType: proto_feature_service_pb.UpdateFeatureVariationsResponse,
    requestSerialize: serialize_bucketeer_feature_UpdateFeatureVariationsRequest,
    requestDeserialize: deserialize_bucketeer_feature_UpdateFeatureVariationsRequest,
    responseSerialize: serialize_bucketeer_feature_UpdateFeatureVariationsResponse,
    responseDeserialize: deserialize_bucketeer_feature_UpdateFeatureVariationsResponse,
  },
  updateFeatureTargeting: {
    path: '/bucketeer.feature.FeatureService/UpdateFeatureTargeting',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.UpdateFeatureTargetingRequest,
    responseType: proto_feature_service_pb.UpdateFeatureTargetingResponse,
    requestSerialize: serialize_bucketeer_feature_UpdateFeatureTargetingRequest,
    requestDeserialize: deserialize_bucketeer_feature_UpdateFeatureTargetingRequest,
    responseSerialize: serialize_bucketeer_feature_UpdateFeatureTargetingResponse,
    responseDeserialize: deserialize_bucketeer_feature_UpdateFeatureTargetingResponse,
  },
  createSegment: {
    path: '/bucketeer.feature.FeatureService/CreateSegment',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.CreateSegmentRequest,
    responseType: proto_feature_service_pb.CreateSegmentResponse,
    requestSerialize: serialize_bucketeer_feature_CreateSegmentRequest,
    requestDeserialize: deserialize_bucketeer_feature_CreateSegmentRequest,
    responseSerialize: serialize_bucketeer_feature_CreateSegmentResponse,
    responseDeserialize: deserialize_bucketeer_feature_CreateSegmentResponse,
  },
  getSegment: {
    path: '/bucketeer.feature.FeatureService/GetSegment',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.GetSegmentRequest,
    responseType: proto_feature_service_pb.GetSegmentResponse,
    requestSerialize: serialize_bucketeer_feature_GetSegmentRequest,
    requestDeserialize: deserialize_bucketeer_feature_GetSegmentRequest,
    responseSerialize: serialize_bucketeer_feature_GetSegmentResponse,
    responseDeserialize: deserialize_bucketeer_feature_GetSegmentResponse,
  },
  listSegments: {
    path: '/bucketeer.feature.FeatureService/ListSegments',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.ListSegmentsRequest,
    responseType: proto_feature_service_pb.ListSegmentsResponse,
    requestSerialize: serialize_bucketeer_feature_ListSegmentsRequest,
    requestDeserialize: deserialize_bucketeer_feature_ListSegmentsRequest,
    responseSerialize: serialize_bucketeer_feature_ListSegmentsResponse,
    responseDeserialize: deserialize_bucketeer_feature_ListSegmentsResponse,
  },
  deleteSegment: {
    path: '/bucketeer.feature.FeatureService/DeleteSegment',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.DeleteSegmentRequest,
    responseType: proto_feature_service_pb.DeleteSegmentResponse,
    requestSerialize: serialize_bucketeer_feature_DeleteSegmentRequest,
    requestDeserialize: deserialize_bucketeer_feature_DeleteSegmentRequest,
    responseSerialize: serialize_bucketeer_feature_DeleteSegmentResponse,
    responseDeserialize: deserialize_bucketeer_feature_DeleteSegmentResponse,
  },
  updateSegment: {
    path: '/bucketeer.feature.FeatureService/UpdateSegment',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.UpdateSegmentRequest,
    responseType: proto_feature_service_pb.UpdateSegmentResponse,
    requestSerialize: serialize_bucketeer_feature_UpdateSegmentRequest,
    requestDeserialize: deserialize_bucketeer_feature_UpdateSegmentRequest,
    responseSerialize: serialize_bucketeer_feature_UpdateSegmentResponse,
    responseDeserialize: deserialize_bucketeer_feature_UpdateSegmentResponse,
  },
  addSegmentUser: {
    path: '/bucketeer.feature.FeatureService/AddSegmentUser',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.AddSegmentUserRequest,
    responseType: proto_feature_service_pb.AddSegmentUserResponse,
    requestSerialize: serialize_bucketeer_feature_AddSegmentUserRequest,
    requestDeserialize: deserialize_bucketeer_feature_AddSegmentUserRequest,
    responseSerialize: serialize_bucketeer_feature_AddSegmentUserResponse,
    responseDeserialize: deserialize_bucketeer_feature_AddSegmentUserResponse,
  },
  deleteSegmentUser: {
    path: '/bucketeer.feature.FeatureService/DeleteSegmentUser',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.DeleteSegmentUserRequest,
    responseType: proto_feature_service_pb.DeleteSegmentUserResponse,
    requestSerialize: serialize_bucketeer_feature_DeleteSegmentUserRequest,
    requestDeserialize: deserialize_bucketeer_feature_DeleteSegmentUserRequest,
    responseSerialize: serialize_bucketeer_feature_DeleteSegmentUserResponse,
    responseDeserialize: deserialize_bucketeer_feature_DeleteSegmentUserResponse,
  },
  getSegmentUser: {
    path: '/bucketeer.feature.FeatureService/GetSegmentUser',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.GetSegmentUserRequest,
    responseType: proto_feature_service_pb.GetSegmentUserResponse,
    requestSerialize: serialize_bucketeer_feature_GetSegmentUserRequest,
    requestDeserialize: deserialize_bucketeer_feature_GetSegmentUserRequest,
    responseSerialize: serialize_bucketeer_feature_GetSegmentUserResponse,
    responseDeserialize: deserialize_bucketeer_feature_GetSegmentUserResponse,
  },
  listSegmentUsers: {
    path: '/bucketeer.feature.FeatureService/ListSegmentUsers',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.ListSegmentUsersRequest,
    responseType: proto_feature_service_pb.ListSegmentUsersResponse,
    requestSerialize: serialize_bucketeer_feature_ListSegmentUsersRequest,
    requestDeserialize: deserialize_bucketeer_feature_ListSegmentUsersRequest,
    responseSerialize: serialize_bucketeer_feature_ListSegmentUsersResponse,
    responseDeserialize: deserialize_bucketeer_feature_ListSegmentUsersResponse,
  },
  bulkUploadSegmentUsers: {
    path: '/bucketeer.feature.FeatureService/BulkUploadSegmentUsers',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.BulkUploadSegmentUsersRequest,
    responseType: proto_feature_service_pb.BulkUploadSegmentUsersResponse,
    requestSerialize: serialize_bucketeer_feature_BulkUploadSegmentUsersRequest,
    requestDeserialize: deserialize_bucketeer_feature_BulkUploadSegmentUsersRequest,
    responseSerialize: serialize_bucketeer_feature_BulkUploadSegmentUsersResponse,
    responseDeserialize: deserialize_bucketeer_feature_BulkUploadSegmentUsersResponse,
  },
  bulkDownloadSegmentUsers: {
    path: '/bucketeer.feature.FeatureService/BulkDownloadSegmentUsers',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.BulkDownloadSegmentUsersRequest,
    responseType: proto_feature_service_pb.BulkDownloadSegmentUsersResponse,
    requestSerialize: serialize_bucketeer_feature_BulkDownloadSegmentUsersRequest,
    requestDeserialize: deserialize_bucketeer_feature_BulkDownloadSegmentUsersRequest,
    responseSerialize: serialize_bucketeer_feature_BulkDownloadSegmentUsersResponse,
    responseDeserialize: deserialize_bucketeer_feature_BulkDownloadSegmentUsersResponse,
  },
  evaluateOnAllFeatures: {
    path: '/bucketeer.feature.FeatureService/EvaluateOnAllFeatures',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.EvaluateOnAllFeaturesRequest,
    responseType: proto_feature_service_pb.EvaluateOnAllFeaturesResponse,
    requestSerialize: serialize_bucketeer_feature_EvaluateOnAllFeaturesRequest,
    requestDeserialize: deserialize_bucketeer_feature_EvaluateOnAllFeaturesRequest,
    responseSerialize: serialize_bucketeer_feature_EvaluateOnAllFeaturesResponse,
    responseDeserialize: deserialize_bucketeer_feature_EvaluateOnAllFeaturesResponse,
  },
  getUserEvaluations: {
    path: '/bucketeer.feature.FeatureService/GetUserEvaluations',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.GetUserEvaluationsRequest,
    responseType: proto_feature_service_pb.GetUserEvaluationsResponse,
    requestSerialize: serialize_bucketeer_feature_GetUserEvaluationsRequest,
    requestDeserialize: deserialize_bucketeer_feature_GetUserEvaluationsRequest,
    responseSerialize: serialize_bucketeer_feature_GetUserEvaluationsResponse,
    responseDeserialize: deserialize_bucketeer_feature_GetUserEvaluationsResponse,
  },
  upsertUserEvaluation: {
    path: '/bucketeer.feature.FeatureService/UpsertUserEvaluation',
    requestStream: false,
    responseStream: false,
    requestType: proto_feature_service_pb.UpsertUserEvaluationRequest,
    responseType: proto_feature_service_pb.UpsertUserEvaluationResponse,
    requestSerialize: serialize_bucketeer_feature_UpsertUserEvaluationRequest,
    requestDeserialize: deserialize_bucketeer_feature_UpsertUserEvaluationRequest,
    responseSerialize: serialize_bucketeer_feature_UpsertUserEvaluationResponse,
    responseDeserialize: deserialize_bucketeer_feature_UpsertUserEvaluationResponse,
  },
};

exports.FeatureServiceClient = grpc.makeGenericClientConstructor(FeatureServiceService);
