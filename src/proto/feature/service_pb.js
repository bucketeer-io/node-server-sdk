// source: proto/feature/service.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var google_protobuf_wrappers_pb = require('google-protobuf/google/protobuf/wrappers_pb.js');
goog.object.extend(proto, google_protobuf_wrappers_pb);
var proto_feature_command_pb = require('../../proto/feature/command_pb.js');
goog.object.extend(proto, proto_feature_command_pb);
var proto_feature_feature_pb = require('../../proto/feature/feature_pb.js');
goog.object.extend(proto, proto_feature_feature_pb);
var proto_feature_evaluation_pb = require('../../proto/feature/evaluation_pb.js');
goog.object.extend(proto, proto_feature_evaluation_pb);
var proto_user_user_pb = require('../../proto/user/user_pb.js');
goog.object.extend(proto, proto_user_user_pb);
var proto_feature_segment_pb = require('../../proto/feature/segment_pb.js');
goog.object.extend(proto, proto_feature_segment_pb);
goog.exportSymbol('proto.bucketeer.feature.AddSegmentUserRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.AddSegmentUserResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.ArchiveFeatureRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.ArchiveFeatureResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.BulkDownloadSegmentUsersRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.BulkDownloadSegmentUsersResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.BulkUploadSegmentUsersRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.BulkUploadSegmentUsersResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.CreateFeatureRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.CreateFeatureResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.CreateSegmentRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.CreateSegmentResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.DeleteFeatureRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.DeleteFeatureResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.DeleteSegmentRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.DeleteSegmentResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.DeleteSegmentUserRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.DeleteSegmentUserResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.DisableFeatureRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.DisableFeatureResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.EnableFeatureRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.EnableFeatureResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.EvaluateOnAllFeaturesRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.EvaluateOnAllFeaturesResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetFeatureRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetFeatureResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetFeaturesRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetFeaturesResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetSegmentRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetSegmentResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetSegmentUserRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetSegmentUserResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetUserEvaluationsRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.GetUserEvaluationsResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListEnabledFeaturesRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListEnabledFeaturesResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListFeaturesRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListFeaturesRequest.OrderBy', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListFeaturesRequest.OrderDirection', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListFeaturesResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListSegmentUsersRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListSegmentUsersResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListSegmentsRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListSegmentsRequest.OrderBy', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListSegmentsRequest.OrderDirection', null, global);
goog.exportSymbol('proto.bucketeer.feature.ListSegmentsResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.SearchFeaturesRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.SearchFeaturesResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateFeatureDetailsRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateFeatureDetailsResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateFeatureTargetingRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateFeatureTargetingResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateFeatureVariationsRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateFeatureVariationsResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateSegmentRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpdateSegmentResponse', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpsertUserEvaluationRequest', null, global);
goog.exportSymbol('proto.bucketeer.feature.UpsertUserEvaluationResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.SearchFeaturesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.SearchFeaturesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.SearchFeaturesRequest.displayName = 'proto.bucketeer.feature.SearchFeaturesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.SearchFeaturesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.SearchFeaturesResponse.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.SearchFeaturesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.SearchFeaturesResponse.displayName = 'proto.bucketeer.feature.SearchFeaturesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetFeatureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.GetFeatureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetFeatureRequest.displayName = 'proto.bucketeer.feature.GetFeatureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetFeatureResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.GetFeatureResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetFeatureResponse.displayName = 'proto.bucketeer.feature.GetFeatureResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetFeaturesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.GetFeaturesRequest.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.GetFeaturesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetFeaturesRequest.displayName = 'proto.bucketeer.feature.GetFeaturesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetFeaturesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.GetFeaturesResponse.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.GetFeaturesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetFeaturesResponse.displayName = 'proto.bucketeer.feature.GetFeaturesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListFeaturesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.ListFeaturesRequest.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.ListFeaturesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListFeaturesRequest.displayName = 'proto.bucketeer.feature.ListFeaturesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListFeaturesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.ListFeaturesResponse.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.ListFeaturesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListFeaturesResponse.displayName = 'proto.bucketeer.feature.ListFeaturesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.ListEnabledFeaturesRequest.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.ListEnabledFeaturesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListEnabledFeaturesRequest.displayName = 'proto.bucketeer.feature.ListEnabledFeaturesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.ListEnabledFeaturesResponse.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.ListEnabledFeaturesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListEnabledFeaturesResponse.displayName = 'proto.bucketeer.feature.ListEnabledFeaturesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.CreateFeatureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.CreateFeatureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.CreateFeatureRequest.displayName = 'proto.bucketeer.feature.CreateFeatureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.CreateFeatureResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.CreateFeatureResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.CreateFeatureResponse.displayName = 'proto.bucketeer.feature.CreateFeatureResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.EnableFeatureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.EnableFeatureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.EnableFeatureRequest.displayName = 'proto.bucketeer.feature.EnableFeatureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.EnableFeatureResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.EnableFeatureResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.EnableFeatureResponse.displayName = 'proto.bucketeer.feature.EnableFeatureResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DisableFeatureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DisableFeatureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DisableFeatureRequest.displayName = 'proto.bucketeer.feature.DisableFeatureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DisableFeatureResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DisableFeatureResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DisableFeatureResponse.displayName = 'proto.bucketeer.feature.DisableFeatureResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ArchiveFeatureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.ArchiveFeatureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ArchiveFeatureRequest.displayName = 'proto.bucketeer.feature.ArchiveFeatureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ArchiveFeatureResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.ArchiveFeatureResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ArchiveFeatureResponse.displayName = 'proto.bucketeer.feature.ArchiveFeatureResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DeleteFeatureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DeleteFeatureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DeleteFeatureRequest.displayName = 'proto.bucketeer.feature.DeleteFeatureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DeleteFeatureResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DeleteFeatureResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DeleteFeatureResponse.displayName = 'proto.bucketeer.feature.DeleteFeatureResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.UpdateFeatureDetailsRequest.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.UpdateFeatureDetailsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateFeatureDetailsRequest.displayName = 'proto.bucketeer.feature.UpdateFeatureDetailsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateFeatureDetailsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.UpdateFeatureDetailsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateFeatureDetailsResponse.displayName = 'proto.bucketeer.feature.UpdateFeatureDetailsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.UpdateFeatureVariationsRequest.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.UpdateFeatureVariationsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateFeatureVariationsRequest.displayName = 'proto.bucketeer.feature.UpdateFeatureVariationsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateFeatureVariationsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.UpdateFeatureVariationsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateFeatureVariationsResponse.displayName = 'proto.bucketeer.feature.UpdateFeatureVariationsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.UpdateFeatureTargetingRequest.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.UpdateFeatureTargetingRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateFeatureTargetingRequest.displayName = 'proto.bucketeer.feature.UpdateFeatureTargetingRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateFeatureTargetingResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.UpdateFeatureTargetingResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateFeatureTargetingResponse.displayName = 'proto.bucketeer.feature.UpdateFeatureTargetingResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.CreateSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.CreateSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.CreateSegmentRequest.displayName = 'proto.bucketeer.feature.CreateSegmentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.CreateSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.CreateSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.CreateSegmentResponse.displayName = 'proto.bucketeer.feature.CreateSegmentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.GetSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetSegmentRequest.displayName = 'proto.bucketeer.feature.GetSegmentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.GetSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetSegmentResponse.displayName = 'proto.bucketeer.feature.GetSegmentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListSegmentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.ListSegmentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListSegmentsRequest.displayName = 'proto.bucketeer.feature.ListSegmentsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListSegmentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.ListSegmentsResponse.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.ListSegmentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListSegmentsResponse.displayName = 'proto.bucketeer.feature.ListSegmentsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DeleteSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DeleteSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DeleteSegmentRequest.displayName = 'proto.bucketeer.feature.DeleteSegmentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DeleteSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DeleteSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DeleteSegmentResponse.displayName = 'proto.bucketeer.feature.DeleteSegmentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateSegmentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.UpdateSegmentRequest.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.UpdateSegmentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateSegmentRequest.displayName = 'proto.bucketeer.feature.UpdateSegmentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpdateSegmentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.UpdateSegmentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpdateSegmentResponse.displayName = 'proto.bucketeer.feature.UpdateSegmentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.AddSegmentUserRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.AddSegmentUserRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.AddSegmentUserRequest.displayName = 'proto.bucketeer.feature.AddSegmentUserRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.AddSegmentUserResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.AddSegmentUserResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.AddSegmentUserResponse.displayName = 'proto.bucketeer.feature.AddSegmentUserResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DeleteSegmentUserRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DeleteSegmentUserRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DeleteSegmentUserRequest.displayName = 'proto.bucketeer.feature.DeleteSegmentUserRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.DeleteSegmentUserResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.DeleteSegmentUserResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.DeleteSegmentUserResponse.displayName = 'proto.bucketeer.feature.DeleteSegmentUserResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetSegmentUserRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.GetSegmentUserRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetSegmentUserRequest.displayName = 'proto.bucketeer.feature.GetSegmentUserRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetSegmentUserResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.GetSegmentUserResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetSegmentUserResponse.displayName = 'proto.bucketeer.feature.GetSegmentUserResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListSegmentUsersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.ListSegmentUsersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListSegmentUsersRequest.displayName = 'proto.bucketeer.feature.ListSegmentUsersRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.ListSegmentUsersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.ListSegmentUsersResponse.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.ListSegmentUsersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.ListSegmentUsersResponse.displayName = 'proto.bucketeer.feature.ListSegmentUsersResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.BulkUploadSegmentUsersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.BulkUploadSegmentUsersRequest.displayName = 'proto.bucketeer.feature.BulkUploadSegmentUsersRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.BulkUploadSegmentUsersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.BulkUploadSegmentUsersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.BulkUploadSegmentUsersResponse.displayName = 'proto.bucketeer.feature.BulkUploadSegmentUsersResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.BulkDownloadSegmentUsersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.displayName = 'proto.bucketeer.feature.BulkDownloadSegmentUsersRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.BulkDownloadSegmentUsersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.displayName = 'proto.bucketeer.feature.BulkDownloadSegmentUsersResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.EvaluateOnAllFeaturesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.displayName = 'proto.bucketeer.feature.EvaluateOnAllFeaturesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.EvaluateOnAllFeaturesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.displayName = 'proto.bucketeer.feature.EvaluateOnAllFeaturesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetUserEvaluationsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.GetUserEvaluationsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetUserEvaluationsRequest.displayName = 'proto.bucketeer.feature.GetUserEvaluationsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.GetUserEvaluationsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.bucketeer.feature.GetUserEvaluationsResponse.repeatedFields_, null);
};
goog.inherits(proto.bucketeer.feature.GetUserEvaluationsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.GetUserEvaluationsResponse.displayName = 'proto.bucketeer.feature.GetUserEvaluationsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.UpsertUserEvaluationRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpsertUserEvaluationRequest.displayName = 'proto.bucketeer.feature.UpsertUserEvaluationRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.bucketeer.feature.UpsertUserEvaluationResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.bucketeer.feature.UpsertUserEvaluationResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.bucketeer.feature.UpsertUserEvaluationResponse.displayName = 'proto.bucketeer.feature.UpsertUserEvaluationResponse';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.SearchFeaturesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.SearchFeaturesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.SearchFeaturesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.SearchFeaturesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    keyword: jspb.Message.getFieldWithDefault(msg, 1, ""),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.SearchFeaturesRequest}
 */
proto.bucketeer.feature.SearchFeaturesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.SearchFeaturesRequest;
  return proto.bucketeer.feature.SearchFeaturesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.SearchFeaturesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.SearchFeaturesRequest}
 */
proto.bucketeer.feature.SearchFeaturesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyword(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.SearchFeaturesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.SearchFeaturesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.SearchFeaturesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.SearchFeaturesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getKeyword();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string keyword = 1;
 * @return {string}
 */
proto.bucketeer.feature.SearchFeaturesRequest.prototype.getKeyword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.SearchFeaturesRequest} returns this
 */
proto.bucketeer.feature.SearchFeaturesRequest.prototype.setKeyword = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string environment_namespace = 2;
 * @return {string}
 */
proto.bucketeer.feature.SearchFeaturesRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.SearchFeaturesRequest} returns this
 */
proto.bucketeer.feature.SearchFeaturesRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.SearchFeaturesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.SearchFeaturesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.SearchFeaturesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.SearchFeaturesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.SearchFeaturesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    featuresList: jspb.Message.toObjectList(msg.getFeaturesList(),
    proto_feature_feature_pb.Feature.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.SearchFeaturesResponse}
 */
proto.bucketeer.feature.SearchFeaturesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.SearchFeaturesResponse;
  return proto.bucketeer.feature.SearchFeaturesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.SearchFeaturesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.SearchFeaturesResponse}
 */
proto.bucketeer.feature.SearchFeaturesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_feature_pb.Feature;
      reader.readMessage(value,proto_feature_feature_pb.Feature.deserializeBinaryFromReader);
      msg.addFeatures(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.SearchFeaturesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.SearchFeaturesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.SearchFeaturesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.SearchFeaturesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFeaturesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_feature_feature_pb.Feature.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Feature features = 1;
 * @return {!Array<!proto.bucketeer.feature.Feature>}
 */
proto.bucketeer.feature.SearchFeaturesResponse.prototype.getFeaturesList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Feature>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_feature_pb.Feature, 1));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Feature>} value
 * @return {!proto.bucketeer.feature.SearchFeaturesResponse} returns this
*/
proto.bucketeer.feature.SearchFeaturesResponse.prototype.setFeaturesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.bucketeer.feature.Feature=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Feature}
 */
proto.bucketeer.feature.SearchFeaturesResponse.prototype.addFeatures = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.bucketeer.feature.Feature, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.SearchFeaturesResponse} returns this
 */
proto.bucketeer.feature.SearchFeaturesResponse.prototype.clearFeaturesList = function() {
  return this.setFeaturesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetFeatureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetFeatureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetFeatureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeatureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetFeatureRequest}
 */
proto.bucketeer.feature.GetFeatureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetFeatureRequest;
  return proto.bucketeer.feature.GetFeatureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetFeatureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetFeatureRequest}
 */
proto.bucketeer.feature.GetFeatureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetFeatureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetFeatureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetFeatureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeatureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.GetFeatureRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetFeatureRequest} returns this
 */
proto.bucketeer.feature.GetFeatureRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string environment_namespace = 2;
 * @return {string}
 */
proto.bucketeer.feature.GetFeatureRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetFeatureRequest} returns this
 */
proto.bucketeer.feature.GetFeatureRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetFeatureResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetFeatureResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetFeatureResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeatureResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    feature: (f = msg.getFeature()) && proto_feature_feature_pb.Feature.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetFeatureResponse}
 */
proto.bucketeer.feature.GetFeatureResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetFeatureResponse;
  return proto.bucketeer.feature.GetFeatureResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetFeatureResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetFeatureResponse}
 */
proto.bucketeer.feature.GetFeatureResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_feature_pb.Feature;
      reader.readMessage(value,proto_feature_feature_pb.Feature.deserializeBinaryFromReader);
      msg.setFeature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetFeatureResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetFeatureResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetFeatureResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeatureResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFeature();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_feature_feature_pb.Feature.serializeBinaryToWriter
    );
  }
};


/**
 * optional Feature feature = 1;
 * @return {?proto.bucketeer.feature.Feature}
 */
proto.bucketeer.feature.GetFeatureResponse.prototype.getFeature = function() {
  return /** @type{?proto.bucketeer.feature.Feature} */ (
    jspb.Message.getWrapperField(this, proto_feature_feature_pb.Feature, 1));
};


/**
 * @param {?proto.bucketeer.feature.Feature|undefined} value
 * @return {!proto.bucketeer.feature.GetFeatureResponse} returns this
*/
proto.bucketeer.feature.GetFeatureResponse.prototype.setFeature = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.GetFeatureResponse} returns this
 */
proto.bucketeer.feature.GetFeatureResponse.prototype.clearFeature = function() {
  return this.setFeature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.GetFeatureResponse.prototype.hasFeature = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.GetFeaturesRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetFeaturesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetFeaturesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeaturesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
    idsList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetFeaturesRequest}
 */
proto.bucketeer.feature.GetFeaturesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetFeaturesRequest;
  return proto.bucketeer.feature.GetFeaturesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetFeaturesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetFeaturesRequest}
 */
proto.bucketeer.feature.GetFeaturesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addIds(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetFeaturesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetFeaturesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeaturesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getIdsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
};


/**
 * optional string environment_namespace = 1;
 * @return {string}
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetFeaturesRequest} returns this
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string ids = 2;
 * @return {!Array<string>}
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.getIdsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.bucketeer.feature.GetFeaturesRequest} returns this
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.setIdsList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.GetFeaturesRequest} returns this
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.addIds = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.GetFeaturesRequest} returns this
 */
proto.bucketeer.feature.GetFeaturesRequest.prototype.clearIdsList = function() {
  return this.setIdsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.GetFeaturesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetFeaturesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetFeaturesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetFeaturesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeaturesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    featuresList: jspb.Message.toObjectList(msg.getFeaturesList(),
    proto_feature_feature_pb.Feature.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetFeaturesResponse}
 */
proto.bucketeer.feature.GetFeaturesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetFeaturesResponse;
  return proto.bucketeer.feature.GetFeaturesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetFeaturesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetFeaturesResponse}
 */
proto.bucketeer.feature.GetFeaturesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_feature_pb.Feature;
      reader.readMessage(value,proto_feature_feature_pb.Feature.deserializeBinaryFromReader);
      msg.addFeatures(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetFeaturesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetFeaturesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetFeaturesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetFeaturesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFeaturesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_feature_feature_pb.Feature.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Feature features = 1;
 * @return {!Array<!proto.bucketeer.feature.Feature>}
 */
proto.bucketeer.feature.GetFeaturesResponse.prototype.getFeaturesList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Feature>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_feature_pb.Feature, 1));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Feature>} value
 * @return {!proto.bucketeer.feature.GetFeaturesResponse} returns this
*/
proto.bucketeer.feature.GetFeaturesResponse.prototype.setFeaturesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.bucketeer.feature.Feature=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Feature}
 */
proto.bucketeer.feature.GetFeaturesResponse.prototype.addFeatures = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.bucketeer.feature.Feature, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.GetFeaturesResponse} returns this
 */
proto.bucketeer.feature.GetFeaturesResponse.prototype.clearFeaturesList = function() {
  return this.setFeaturesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.ListFeaturesRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListFeaturesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListFeaturesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListFeaturesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pageSize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, ""),
    tagsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
    orderBy: jspb.Message.getFieldWithDefault(msg, 4, 0),
    orderDirection: jspb.Message.getFieldWithDefault(msg, 5, 0),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 6, ""),
    maintainer: jspb.Message.getFieldWithDefault(msg, 7, ""),
    enabled: (f = msg.getEnabled()) && google_protobuf_wrappers_pb.BoolValue.toObject(includeInstance, f),
    hasExperiment: (f = msg.getHasExperiment()) && google_protobuf_wrappers_pb.BoolValue.toObject(includeInstance, f),
    searchKeyword: jspb.Message.getFieldWithDefault(msg, 10, ""),
    archived: (f = msg.getArchived()) && google_protobuf_wrappers_pb.BoolValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListFeaturesRequest}
 */
proto.bucketeer.feature.ListFeaturesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListFeaturesRequest;
  return proto.bucketeer.feature.ListFeaturesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListFeaturesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListFeaturesRequest}
 */
proto.bucketeer.feature.ListFeaturesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPageSize(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addTags(value);
      break;
    case 4:
      var value = /** @type {!proto.bucketeer.feature.ListFeaturesRequest.OrderBy} */ (reader.readEnum());
      msg.setOrderBy(value);
      break;
    case 5:
      var value = /** @type {!proto.bucketeer.feature.ListFeaturesRequest.OrderDirection} */ (reader.readEnum());
      msg.setOrderDirection(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaintainer(value);
      break;
    case 8:
      var value = new google_protobuf_wrappers_pb.BoolValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.BoolValue.deserializeBinaryFromReader);
      msg.setEnabled(value);
      break;
    case 9:
      var value = new google_protobuf_wrappers_pb.BoolValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.BoolValue.deserializeBinaryFromReader);
      msg.setHasExperiment(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setSearchKeyword(value);
      break;
    case 11:
      var value = new google_protobuf_wrappers_pb.BoolValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.BoolValue.deserializeBinaryFromReader);
      msg.setArchived(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListFeaturesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListFeaturesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListFeaturesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPageSize();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTagsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
  f = message.getOrderBy();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
  f = message.getOrderDirection();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getMaintainer();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getEnabled();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      google_protobuf_wrappers_pb.BoolValue.serializeBinaryToWriter
    );
  }
  f = message.getHasExperiment();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      google_protobuf_wrappers_pb.BoolValue.serializeBinaryToWriter
    );
  }
  f = message.getSearchKeyword();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getArchived();
  if (f != null) {
    writer.writeMessage(
      11,
      f,
      google_protobuf_wrappers_pb.BoolValue.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.bucketeer.feature.ListFeaturesRequest.OrderBy = {
  DEFAULT: 0,
  NAME: 1,
  CREATED_AT: 2,
  UPDATED_AT: 3,
  TAGS: 4,
  ENABLED: 5
};

/**
 * @enum {number}
 */
proto.bucketeer.feature.ListFeaturesRequest.OrderDirection = {
  ASC: 0,
  DESC: 1
};

/**
 * optional int64 page_size = 1;
 * @return {number}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getPageSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setPageSize = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string tags = 3;
 * @return {!Array<string>}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getTagsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setTagsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.addTags = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.clearTagsList = function() {
  return this.setTagsList([]);
};


/**
 * optional OrderBy order_by = 4;
 * @return {!proto.bucketeer.feature.ListFeaturesRequest.OrderBy}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getOrderBy = function() {
  return /** @type {!proto.bucketeer.feature.ListFeaturesRequest.OrderBy} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.bucketeer.feature.ListFeaturesRequest.OrderBy} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setOrderBy = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};


/**
 * optional OrderDirection order_direction = 5;
 * @return {!proto.bucketeer.feature.ListFeaturesRequest.OrderDirection}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getOrderDirection = function() {
  return /** @type {!proto.bucketeer.feature.ListFeaturesRequest.OrderDirection} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {!proto.bucketeer.feature.ListFeaturesRequest.OrderDirection} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setOrderDirection = function(value) {
  return jspb.Message.setProto3EnumField(this, 5, value);
};


/**
 * optional string environment_namespace = 6;
 * @return {string}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string maintainer = 7;
 * @return {string}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getMaintainer = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setMaintainer = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional google.protobuf.BoolValue enabled = 8;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getEnabled = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.BoolValue, 8));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
*/
proto.bucketeer.feature.ListFeaturesRequest.prototype.setEnabled = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.clearEnabled = function() {
  return this.setEnabled(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.hasEnabled = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional google.protobuf.BoolValue has_experiment = 9;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getHasExperiment = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.BoolValue, 9));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
*/
proto.bucketeer.feature.ListFeaturesRequest.prototype.setHasExperiment = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.clearHasExperiment = function() {
  return this.setHasExperiment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.hasHasExperiment = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional string search_keyword = 10;
 * @return {string}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getSearchKeyword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.setSearchKeyword = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional google.protobuf.BoolValue archived = 11;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.getArchived = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.BoolValue, 11));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
*/
proto.bucketeer.feature.ListFeaturesRequest.prototype.setArchived = function(value) {
  return jspb.Message.setWrapperField(this, 11, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.ListFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.clearArchived = function() {
  return this.setArchived(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.ListFeaturesRequest.prototype.hasArchived = function() {
  return jspb.Message.getField(this, 11) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.ListFeaturesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListFeaturesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListFeaturesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListFeaturesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    featuresList: jspb.Message.toObjectList(msg.getFeaturesList(),
    proto_feature_feature_pb.Feature.toObject, includeInstance),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, ""),
    totalCount: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListFeaturesResponse}
 */
proto.bucketeer.feature.ListFeaturesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListFeaturesResponse;
  return proto.bucketeer.feature.ListFeaturesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListFeaturesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListFeaturesResponse}
 */
proto.bucketeer.feature.ListFeaturesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_feature_pb.Feature;
      reader.readMessage(value,proto_feature_feature_pb.Feature.deserializeBinaryFromReader);
      msg.addFeatures(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalCount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListFeaturesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListFeaturesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListFeaturesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFeaturesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_feature_feature_pb.Feature.serializeBinaryToWriter
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTotalCount();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * repeated Feature features = 1;
 * @return {!Array<!proto.bucketeer.feature.Feature>}
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.getFeaturesList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Feature>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_feature_pb.Feature, 1));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Feature>} value
 * @return {!proto.bucketeer.feature.ListFeaturesResponse} returns this
*/
proto.bucketeer.feature.ListFeaturesResponse.prototype.setFeaturesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.bucketeer.feature.Feature=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Feature}
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.addFeatures = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.bucketeer.feature.Feature, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.ListFeaturesResponse} returns this
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.clearFeaturesList = function() {
  return this.setFeaturesList([]);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListFeaturesResponse} returns this
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 total_count = 3;
 * @return {number}
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.bucketeer.feature.ListFeaturesResponse} returns this
 */
proto.bucketeer.feature.ListFeaturesResponse.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListEnabledFeaturesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListEnabledFeaturesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pageSize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, ""),
    tagsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListEnabledFeaturesRequest;
  return proto.bucketeer.feature.ListEnabledFeaturesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListEnabledFeaturesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPageSize(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addTags(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListEnabledFeaturesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListEnabledFeaturesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPageSize();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTagsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional int64 page_size = 1;
 * @return {number}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.getPageSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.setPageSize = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string tags = 3;
 * @return {!Array<string>}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.getTagsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.setTagsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.addTags = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.clearTagsList = function() {
  return this.setTagsList([]);
};


/**
 * optional string environment_namespace = 4;
 * @return {string}
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesRequest} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListEnabledFeaturesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListEnabledFeaturesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    featuresList: jspb.Message.toObjectList(msg.getFeaturesList(),
    proto_feature_feature_pb.Feature.toObject, includeInstance),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesResponse}
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListEnabledFeaturesResponse;
  return proto.bucketeer.feature.ListEnabledFeaturesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListEnabledFeaturesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesResponse}
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_feature_pb.Feature;
      reader.readMessage(value,proto_feature_feature_pb.Feature.deserializeBinaryFromReader);
      msg.addFeatures(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListEnabledFeaturesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListEnabledFeaturesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFeaturesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_feature_feature_pb.Feature.serializeBinaryToWriter
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * repeated Feature features = 1;
 * @return {!Array<!proto.bucketeer.feature.Feature>}
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.getFeaturesList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Feature>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_feature_pb.Feature, 1));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Feature>} value
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesResponse} returns this
*/
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.setFeaturesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.bucketeer.feature.Feature=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Feature}
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.addFeatures = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.bucketeer.feature.Feature, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesResponse} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.clearFeaturesList = function() {
  return this.setFeaturesList([]);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListEnabledFeaturesResponse} returns this
 */
proto.bucketeer.feature.ListEnabledFeaturesResponse.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.CreateFeatureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.CreateFeatureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.CreateFeatureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateFeatureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    command: (f = msg.getCommand()) && proto_feature_command_pb.CreateFeatureCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.CreateFeatureRequest}
 */
proto.bucketeer.feature.CreateFeatureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.CreateFeatureRequest;
  return proto.bucketeer.feature.CreateFeatureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.CreateFeatureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.CreateFeatureRequest}
 */
proto.bucketeer.feature.CreateFeatureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_command_pb.CreateFeatureCommand;
      reader.readMessage(value,proto_feature_command_pb.CreateFeatureCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.CreateFeatureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.CreateFeatureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.CreateFeatureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateFeatureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_feature_command_pb.CreateFeatureCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional CreateFeatureCommand command = 1;
 * @return {?proto.bucketeer.feature.CreateFeatureCommand}
 */
proto.bucketeer.feature.CreateFeatureRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.CreateFeatureCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.CreateFeatureCommand, 1));
};


/**
 * @param {?proto.bucketeer.feature.CreateFeatureCommand|undefined} value
 * @return {!proto.bucketeer.feature.CreateFeatureRequest} returns this
*/
proto.bucketeer.feature.CreateFeatureRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.CreateFeatureRequest} returns this
 */
proto.bucketeer.feature.CreateFeatureRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.CreateFeatureRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string environment_namespace = 2;
 * @return {string}
 */
proto.bucketeer.feature.CreateFeatureRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.CreateFeatureRequest} returns this
 */
proto.bucketeer.feature.CreateFeatureRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.CreateFeatureResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.CreateFeatureResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.CreateFeatureResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateFeatureResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.CreateFeatureResponse}
 */
proto.bucketeer.feature.CreateFeatureResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.CreateFeatureResponse;
  return proto.bucketeer.feature.CreateFeatureResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.CreateFeatureResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.CreateFeatureResponse}
 */
proto.bucketeer.feature.CreateFeatureResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.CreateFeatureResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.CreateFeatureResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.CreateFeatureResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateFeatureResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.EnableFeatureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.EnableFeatureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EnableFeatureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.EnableFeatureCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, ""),
    comment: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.EnableFeatureRequest}
 */
proto.bucketeer.feature.EnableFeatureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.EnableFeatureRequest;
  return proto.bucketeer.feature.EnableFeatureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.EnableFeatureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.EnableFeatureRequest}
 */
proto.bucketeer.feature.EnableFeatureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.EnableFeatureCommand;
      reader.readMessage(value,proto_feature_command_pb.EnableFeatureCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setComment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.EnableFeatureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.EnableFeatureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EnableFeatureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.EnableFeatureCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getComment();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.EnableFeatureRequest} returns this
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional EnableFeatureCommand command = 2;
 * @return {?proto.bucketeer.feature.EnableFeatureCommand}
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.EnableFeatureCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.EnableFeatureCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.EnableFeatureCommand|undefined} value
 * @return {!proto.bucketeer.feature.EnableFeatureRequest} returns this
*/
proto.bucketeer.feature.EnableFeatureRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.EnableFeatureRequest} returns this
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.EnableFeatureRequest} returns this
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string comment = 4;
 * @return {string}
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.getComment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.EnableFeatureRequest} returns this
 */
proto.bucketeer.feature.EnableFeatureRequest.prototype.setComment = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.EnableFeatureResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.EnableFeatureResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.EnableFeatureResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EnableFeatureResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.EnableFeatureResponse}
 */
proto.bucketeer.feature.EnableFeatureResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.EnableFeatureResponse;
  return proto.bucketeer.feature.EnableFeatureResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.EnableFeatureResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.EnableFeatureResponse}
 */
proto.bucketeer.feature.EnableFeatureResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.EnableFeatureResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.EnableFeatureResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.EnableFeatureResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EnableFeatureResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DisableFeatureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DisableFeatureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DisableFeatureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.DisableFeatureCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, ""),
    comment: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DisableFeatureRequest}
 */
proto.bucketeer.feature.DisableFeatureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DisableFeatureRequest;
  return proto.bucketeer.feature.DisableFeatureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DisableFeatureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DisableFeatureRequest}
 */
proto.bucketeer.feature.DisableFeatureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.DisableFeatureCommand;
      reader.readMessage(value,proto_feature_command_pb.DisableFeatureCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setComment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DisableFeatureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DisableFeatureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DisableFeatureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.DisableFeatureCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getComment();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DisableFeatureRequest} returns this
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional DisableFeatureCommand command = 2;
 * @return {?proto.bucketeer.feature.DisableFeatureCommand}
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.DisableFeatureCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.DisableFeatureCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.DisableFeatureCommand|undefined} value
 * @return {!proto.bucketeer.feature.DisableFeatureRequest} returns this
*/
proto.bucketeer.feature.DisableFeatureRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.DisableFeatureRequest} returns this
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DisableFeatureRequest} returns this
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string comment = 4;
 * @return {string}
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.getComment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DisableFeatureRequest} returns this
 */
proto.bucketeer.feature.DisableFeatureRequest.prototype.setComment = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DisableFeatureResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DisableFeatureResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DisableFeatureResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DisableFeatureResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DisableFeatureResponse}
 */
proto.bucketeer.feature.DisableFeatureResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DisableFeatureResponse;
  return proto.bucketeer.feature.DisableFeatureResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DisableFeatureResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DisableFeatureResponse}
 */
proto.bucketeer.feature.DisableFeatureResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DisableFeatureResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DisableFeatureResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DisableFeatureResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DisableFeatureResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ArchiveFeatureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ArchiveFeatureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ArchiveFeatureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.ArchiveFeatureCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, ""),
    comment: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ArchiveFeatureRequest}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ArchiveFeatureRequest;
  return proto.bucketeer.feature.ArchiveFeatureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ArchiveFeatureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ArchiveFeatureRequest}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.ArchiveFeatureCommand;
      reader.readMessage(value,proto_feature_command_pb.ArchiveFeatureCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setComment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ArchiveFeatureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ArchiveFeatureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ArchiveFeatureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.ArchiveFeatureCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getComment();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ArchiveFeatureRequest} returns this
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional ArchiveFeatureCommand command = 2;
 * @return {?proto.bucketeer.feature.ArchiveFeatureCommand}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.ArchiveFeatureCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.ArchiveFeatureCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.ArchiveFeatureCommand|undefined} value
 * @return {!proto.bucketeer.feature.ArchiveFeatureRequest} returns this
*/
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.ArchiveFeatureRequest} returns this
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ArchiveFeatureRequest} returns this
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string comment = 4;
 * @return {string}
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.getComment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ArchiveFeatureRequest} returns this
 */
proto.bucketeer.feature.ArchiveFeatureRequest.prototype.setComment = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ArchiveFeatureResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ArchiveFeatureResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ArchiveFeatureResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ArchiveFeatureResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ArchiveFeatureResponse}
 */
proto.bucketeer.feature.ArchiveFeatureResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ArchiveFeatureResponse;
  return proto.bucketeer.feature.ArchiveFeatureResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ArchiveFeatureResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ArchiveFeatureResponse}
 */
proto.bucketeer.feature.ArchiveFeatureResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ArchiveFeatureResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ArchiveFeatureResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ArchiveFeatureResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ArchiveFeatureResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DeleteFeatureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DeleteFeatureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteFeatureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.DeleteFeatureCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, ""),
    comment: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DeleteFeatureRequest}
 */
proto.bucketeer.feature.DeleteFeatureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DeleteFeatureRequest;
  return proto.bucketeer.feature.DeleteFeatureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DeleteFeatureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DeleteFeatureRequest}
 */
proto.bucketeer.feature.DeleteFeatureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.DeleteFeatureCommand;
      reader.readMessage(value,proto_feature_command_pb.DeleteFeatureCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setComment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DeleteFeatureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DeleteFeatureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteFeatureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.DeleteFeatureCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getComment();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DeleteFeatureRequest} returns this
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional DeleteFeatureCommand command = 2;
 * @return {?proto.bucketeer.feature.DeleteFeatureCommand}
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.DeleteFeatureCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.DeleteFeatureCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.DeleteFeatureCommand|undefined} value
 * @return {!proto.bucketeer.feature.DeleteFeatureRequest} returns this
*/
proto.bucketeer.feature.DeleteFeatureRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.DeleteFeatureRequest} returns this
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DeleteFeatureRequest} returns this
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string comment = 4;
 * @return {string}
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.getComment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DeleteFeatureRequest} returns this
 */
proto.bucketeer.feature.DeleteFeatureRequest.prototype.setComment = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DeleteFeatureResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DeleteFeatureResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DeleteFeatureResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteFeatureResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DeleteFeatureResponse}
 */
proto.bucketeer.feature.DeleteFeatureResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DeleteFeatureResponse;
  return proto.bucketeer.feature.DeleteFeatureResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DeleteFeatureResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DeleteFeatureResponse}
 */
proto.bucketeer.feature.DeleteFeatureResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DeleteFeatureResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DeleteFeatureResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DeleteFeatureResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteFeatureResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.repeatedFields_ = [4,5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateFeatureDetailsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    renameFeatureCommand: (f = msg.getRenameFeatureCommand()) && proto_feature_command_pb.RenameFeatureCommand.toObject(includeInstance, f),
    changeDescriptionCommand: (f = msg.getChangeDescriptionCommand()) && proto_feature_command_pb.ChangeDescriptionCommand.toObject(includeInstance, f),
    addTagCommandsList: jspb.Message.toObjectList(msg.getAddTagCommandsList(),
    proto_feature_command_pb.AddTagCommand.toObject, includeInstance),
    removeTagCommandsList: jspb.Message.toObjectList(msg.getRemoveTagCommandsList(),
    proto_feature_command_pb.RemoveTagCommand.toObject, includeInstance),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 6, ""),
    comment: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateFeatureDetailsRequest;
  return proto.bucketeer.feature.UpdateFeatureDetailsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.RenameFeatureCommand;
      reader.readMessage(value,proto_feature_command_pb.RenameFeatureCommand.deserializeBinaryFromReader);
      msg.setRenameFeatureCommand(value);
      break;
    case 3:
      var value = new proto_feature_command_pb.ChangeDescriptionCommand;
      reader.readMessage(value,proto_feature_command_pb.ChangeDescriptionCommand.deserializeBinaryFromReader);
      msg.setChangeDescriptionCommand(value);
      break;
    case 4:
      var value = new proto_feature_command_pb.AddTagCommand;
      reader.readMessage(value,proto_feature_command_pb.AddTagCommand.deserializeBinaryFromReader);
      msg.addAddTagCommands(value);
      break;
    case 5:
      var value = new proto_feature_command_pb.RemoveTagCommand;
      reader.readMessage(value,proto_feature_command_pb.RemoveTagCommand.deserializeBinaryFromReader);
      msg.addRemoveTagCommands(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setComment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateFeatureDetailsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRenameFeatureCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.RenameFeatureCommand.serializeBinaryToWriter
    );
  }
  f = message.getChangeDescriptionCommand();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto_feature_command_pb.ChangeDescriptionCommand.serializeBinaryToWriter
    );
  }
  f = message.getAddTagCommandsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto_feature_command_pb.AddTagCommand.serializeBinaryToWriter
    );
  }
  f = message.getRemoveTagCommandsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto_feature_command_pb.RemoveTagCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getComment();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional RenameFeatureCommand rename_feature_command = 2;
 * @return {?proto.bucketeer.feature.RenameFeatureCommand}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.getRenameFeatureCommand = function() {
  return /** @type{?proto.bucketeer.feature.RenameFeatureCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.RenameFeatureCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.RenameFeatureCommand|undefined} value
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
*/
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.setRenameFeatureCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.clearRenameFeatureCommand = function() {
  return this.setRenameFeatureCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.hasRenameFeatureCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ChangeDescriptionCommand change_description_command = 3;
 * @return {?proto.bucketeer.feature.ChangeDescriptionCommand}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.getChangeDescriptionCommand = function() {
  return /** @type{?proto.bucketeer.feature.ChangeDescriptionCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.ChangeDescriptionCommand, 3));
};


/**
 * @param {?proto.bucketeer.feature.ChangeDescriptionCommand|undefined} value
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
*/
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.setChangeDescriptionCommand = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.clearChangeDescriptionCommand = function() {
  return this.setChangeDescriptionCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.hasChangeDescriptionCommand = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * repeated AddTagCommand add_tag_commands = 4;
 * @return {!Array<!proto.bucketeer.feature.AddTagCommand>}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.getAddTagCommandsList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.AddTagCommand>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_command_pb.AddTagCommand, 4));
};


/**
 * @param {!Array<!proto.bucketeer.feature.AddTagCommand>} value
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
*/
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.setAddTagCommandsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.bucketeer.feature.AddTagCommand=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.AddTagCommand}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.addAddTagCommands = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.bucketeer.feature.AddTagCommand, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.clearAddTagCommandsList = function() {
  return this.setAddTagCommandsList([]);
};


/**
 * repeated RemoveTagCommand remove_tag_commands = 5;
 * @return {!Array<!proto.bucketeer.feature.RemoveTagCommand>}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.getRemoveTagCommandsList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.RemoveTagCommand>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_command_pb.RemoveTagCommand, 5));
};


/**
 * @param {!Array<!proto.bucketeer.feature.RemoveTagCommand>} value
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
*/
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.setRemoveTagCommandsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.bucketeer.feature.RemoveTagCommand=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.RemoveTagCommand}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.addRemoveTagCommands = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.bucketeer.feature.RemoveTagCommand, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.clearRemoveTagCommandsList = function() {
  return this.setRemoveTagCommandsList([]);
};


/**
 * optional string environment_namespace = 6;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string comment = 7;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.getComment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureDetailsRequest.prototype.setComment = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateFeatureDetailsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateFeatureDetailsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateFeatureDetailsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureDetailsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsResponse}
 */
proto.bucketeer.feature.UpdateFeatureDetailsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateFeatureDetailsResponse;
  return proto.bucketeer.feature.UpdateFeatureDetailsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateFeatureDetailsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateFeatureDetailsResponse}
 */
proto.bucketeer.feature.UpdateFeatureDetailsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateFeatureDetailsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateFeatureDetailsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateFeatureDetailsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureDetailsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateFeatureVariationsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    commandsList: jspb.Message.toObjectList(msg.getCommandsList(),
    proto_feature_command_pb.Command.toObject, includeInstance),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, ""),
    comment: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsRequest}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateFeatureVariationsRequest;
  return proto.bucketeer.feature.UpdateFeatureVariationsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsRequest}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.Command;
      reader.readMessage(value,proto_feature_command_pb.Command.deserializeBinaryFromReader);
      msg.addCommands(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setComment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateFeatureVariationsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommandsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto_feature_command_pb.Command.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getComment();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated Command commands = 2;
 * @return {!Array<!proto.bucketeer.feature.Command>}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.getCommandsList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Command>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_command_pb.Command, 2));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Command>} value
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} returns this
*/
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.setCommandsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.bucketeer.feature.Command=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Command}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.addCommands = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.bucketeer.feature.Command, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.clearCommandsList = function() {
  return this.setCommandsList([]);
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string comment = 4;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.getComment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureVariationsRequest.prototype.setComment = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateFeatureVariationsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateFeatureVariationsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateFeatureVariationsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureVariationsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsResponse}
 */
proto.bucketeer.feature.UpdateFeatureVariationsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateFeatureVariationsResponse;
  return proto.bucketeer.feature.UpdateFeatureVariationsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateFeatureVariationsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateFeatureVariationsResponse}
 */
proto.bucketeer.feature.UpdateFeatureVariationsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateFeatureVariationsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateFeatureVariationsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateFeatureVariationsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureVariationsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateFeatureTargetingRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    commandsList: jspb.Message.toObjectList(msg.getCommandsList(),
    proto_feature_command_pb.Command.toObject, includeInstance),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, ""),
    comment: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingRequest}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateFeatureTargetingRequest;
  return proto.bucketeer.feature.UpdateFeatureTargetingRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingRequest}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.Command;
      reader.readMessage(value,proto_feature_command_pb.Command.deserializeBinaryFromReader);
      msg.addCommands(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setComment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateFeatureTargetingRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommandsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto_feature_command_pb.Command.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getComment();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated Command commands = 2;
 * @return {!Array<!proto.bucketeer.feature.Command>}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.getCommandsList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Command>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_command_pb.Command, 2));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Command>} value
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} returns this
*/
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.setCommandsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.bucketeer.feature.Command=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Command}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.addCommands = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.bucketeer.feature.Command, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.clearCommandsList = function() {
  return this.setCommandsList([]);
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string comment = 4;
 * @return {string}
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.getComment = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingRequest} returns this
 */
proto.bucketeer.feature.UpdateFeatureTargetingRequest.prototype.setComment = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateFeatureTargetingResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateFeatureTargetingResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateFeatureTargetingResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureTargetingResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingResponse}
 */
proto.bucketeer.feature.UpdateFeatureTargetingResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateFeatureTargetingResponse;
  return proto.bucketeer.feature.UpdateFeatureTargetingResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateFeatureTargetingResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateFeatureTargetingResponse}
 */
proto.bucketeer.feature.UpdateFeatureTargetingResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateFeatureTargetingResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateFeatureTargetingResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateFeatureTargetingResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateFeatureTargetingResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.CreateSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.CreateSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.CreateSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    command: (f = msg.getCommand()) && proto_feature_command_pb.CreateSegmentCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.CreateSegmentRequest}
 */
proto.bucketeer.feature.CreateSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.CreateSegmentRequest;
  return proto.bucketeer.feature.CreateSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.CreateSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.CreateSegmentRequest}
 */
proto.bucketeer.feature.CreateSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_command_pb.CreateSegmentCommand;
      reader.readMessage(value,proto_feature_command_pb.CreateSegmentCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.CreateSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.CreateSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.CreateSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateSegmentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_feature_command_pb.CreateSegmentCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional CreateSegmentCommand command = 1;
 * @return {?proto.bucketeer.feature.CreateSegmentCommand}
 */
proto.bucketeer.feature.CreateSegmentRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.CreateSegmentCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.CreateSegmentCommand, 1));
};


/**
 * @param {?proto.bucketeer.feature.CreateSegmentCommand|undefined} value
 * @return {!proto.bucketeer.feature.CreateSegmentRequest} returns this
*/
proto.bucketeer.feature.CreateSegmentRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.CreateSegmentRequest} returns this
 */
proto.bucketeer.feature.CreateSegmentRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.CreateSegmentRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string environment_namespace = 2;
 * @return {string}
 */
proto.bucketeer.feature.CreateSegmentRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.CreateSegmentRequest} returns this
 */
proto.bucketeer.feature.CreateSegmentRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.CreateSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.CreateSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.CreateSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segment: (f = msg.getSegment()) && proto_feature_segment_pb.Segment.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.CreateSegmentResponse}
 */
proto.bucketeer.feature.CreateSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.CreateSegmentResponse;
  return proto.bucketeer.feature.CreateSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.CreateSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.CreateSegmentResponse}
 */
proto.bucketeer.feature.CreateSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_segment_pb.Segment;
      reader.readMessage(value,proto_feature_segment_pb.Segment.deserializeBinaryFromReader);
      msg.setSegment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.CreateSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.CreateSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.CreateSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.CreateSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegment();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_feature_segment_pb.Segment.serializeBinaryToWriter
    );
  }
};


/**
 * optional Segment segment = 1;
 * @return {?proto.bucketeer.feature.Segment}
 */
proto.bucketeer.feature.CreateSegmentResponse.prototype.getSegment = function() {
  return /** @type{?proto.bucketeer.feature.Segment} */ (
    jspb.Message.getWrapperField(this, proto_feature_segment_pb.Segment, 1));
};


/**
 * @param {?proto.bucketeer.feature.Segment|undefined} value
 * @return {!proto.bucketeer.feature.CreateSegmentResponse} returns this
*/
proto.bucketeer.feature.CreateSegmentResponse.prototype.setSegment = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.CreateSegmentResponse} returns this
 */
proto.bucketeer.feature.CreateSegmentResponse.prototype.clearSegment = function() {
  return this.setSegment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.CreateSegmentResponse.prototype.hasSegment = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetSegmentRequest}
 */
proto.bucketeer.feature.GetSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetSegmentRequest;
  return proto.bucketeer.feature.GetSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetSegmentRequest}
 */
proto.bucketeer.feature.GetSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.GetSegmentRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetSegmentRequest} returns this
 */
proto.bucketeer.feature.GetSegmentRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string environment_namespace = 2;
 * @return {string}
 */
proto.bucketeer.feature.GetSegmentRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetSegmentRequest} returns this
 */
proto.bucketeer.feature.GetSegmentRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segment: (f = msg.getSegment()) && proto_feature_segment_pb.Segment.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetSegmentResponse}
 */
proto.bucketeer.feature.GetSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetSegmentResponse;
  return proto.bucketeer.feature.GetSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetSegmentResponse}
 */
proto.bucketeer.feature.GetSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_segment_pb.Segment;
      reader.readMessage(value,proto_feature_segment_pb.Segment.deserializeBinaryFromReader);
      msg.setSegment(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegment();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_feature_segment_pb.Segment.serializeBinaryToWriter
    );
  }
};


/**
 * optional Segment segment = 1;
 * @return {?proto.bucketeer.feature.Segment}
 */
proto.bucketeer.feature.GetSegmentResponse.prototype.getSegment = function() {
  return /** @type{?proto.bucketeer.feature.Segment} */ (
    jspb.Message.getWrapperField(this, proto_feature_segment_pb.Segment, 1));
};


/**
 * @param {?proto.bucketeer.feature.Segment|undefined} value
 * @return {!proto.bucketeer.feature.GetSegmentResponse} returns this
*/
proto.bucketeer.feature.GetSegmentResponse.prototype.setSegment = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.GetSegmentResponse} returns this
 */
proto.bucketeer.feature.GetSegmentResponse.prototype.clearSegment = function() {
  return this.setSegment(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.GetSegmentResponse.prototype.hasSegment = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListSegmentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListSegmentsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pageSize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, ""),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, ""),
    orderBy: jspb.Message.getFieldWithDefault(msg, 4, 0),
    orderDirection: jspb.Message.getFieldWithDefault(msg, 5, 0),
    searchKeyword: jspb.Message.getFieldWithDefault(msg, 6, ""),
    status: (f = msg.getStatus()) && google_protobuf_wrappers_pb.Int32Value.toObject(includeInstance, f),
    isInUseStatus: (f = msg.getIsInUseStatus()) && google_protobuf_wrappers_pb.BoolValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListSegmentsRequest}
 */
proto.bucketeer.feature.ListSegmentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListSegmentsRequest;
  return proto.bucketeer.feature.ListSegmentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListSegmentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListSegmentsRequest}
 */
proto.bucketeer.feature.ListSegmentsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPageSize(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 4:
      var value = /** @type {!proto.bucketeer.feature.ListSegmentsRequest.OrderBy} */ (reader.readEnum());
      msg.setOrderBy(value);
      break;
    case 5:
      var value = /** @type {!proto.bucketeer.feature.ListSegmentsRequest.OrderDirection} */ (reader.readEnum());
      msg.setOrderDirection(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setSearchKeyword(value);
      break;
    case 7:
      var value = new google_protobuf_wrappers_pb.Int32Value;
      reader.readMessage(value,google_protobuf_wrappers_pb.Int32Value.deserializeBinaryFromReader);
      msg.setStatus(value);
      break;
    case 8:
      var value = new google_protobuf_wrappers_pb.BoolValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.BoolValue.deserializeBinaryFromReader);
      msg.setIsInUseStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListSegmentsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListSegmentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPageSize();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getOrderBy();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
  f = message.getOrderDirection();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = message.getSearchKeyword();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getStatus();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      google_protobuf_wrappers_pb.Int32Value.serializeBinaryToWriter
    );
  }
  f = message.getIsInUseStatus();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      google_protobuf_wrappers_pb.BoolValue.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.bucketeer.feature.ListSegmentsRequest.OrderBy = {
  DEFAULT: 0,
  NAME: 1,
  CREATED_AT: 2,
  UPDATED_AT: 3
};

/**
 * @enum {number}
 */
proto.bucketeer.feature.ListSegmentsRequest.OrderDirection = {
  ASC: 0,
  DESC: 1
};

/**
 * optional int64 page_size = 1;
 * @return {number}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getPageSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.setPageSize = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional OrderBy order_by = 4;
 * @return {!proto.bucketeer.feature.ListSegmentsRequest.OrderBy}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getOrderBy = function() {
  return /** @type {!proto.bucketeer.feature.ListSegmentsRequest.OrderBy} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.bucketeer.feature.ListSegmentsRequest.OrderBy} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.setOrderBy = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};


/**
 * optional OrderDirection order_direction = 5;
 * @return {!proto.bucketeer.feature.ListSegmentsRequest.OrderDirection}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getOrderDirection = function() {
  return /** @type {!proto.bucketeer.feature.ListSegmentsRequest.OrderDirection} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {!proto.bucketeer.feature.ListSegmentsRequest.OrderDirection} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.setOrderDirection = function(value) {
  return jspb.Message.setProto3EnumField(this, 5, value);
};


/**
 * optional string search_keyword = 6;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getSearchKeyword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.setSearchKeyword = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional google.protobuf.Int32Value status = 7;
 * @return {?proto.google.protobuf.Int32Value}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getStatus = function() {
  return /** @type{?proto.google.protobuf.Int32Value} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.Int32Value, 7));
};


/**
 * @param {?proto.google.protobuf.Int32Value|undefined} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
*/
proto.bucketeer.feature.ListSegmentsRequest.prototype.setStatus = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.clearStatus = function() {
  return this.setStatus(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.hasStatus = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional google.protobuf.BoolValue is_in_use_status = 8;
 * @return {?proto.google.protobuf.BoolValue}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.getIsInUseStatus = function() {
  return /** @type{?proto.google.protobuf.BoolValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.BoolValue, 8));
};


/**
 * @param {?proto.google.protobuf.BoolValue|undefined} value
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
*/
proto.bucketeer.feature.ListSegmentsRequest.prototype.setIsInUseStatus = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.ListSegmentsRequest} returns this
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.clearIsInUseStatus = function() {
  return this.setIsInUseStatus(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.ListSegmentsRequest.prototype.hasIsInUseStatus = function() {
  return jspb.Message.getField(this, 8) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.ListSegmentsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListSegmentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListSegmentsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    segmentsList: jspb.Message.toObjectList(msg.getSegmentsList(),
    proto_feature_segment_pb.Segment.toObject, includeInstance),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, ""),
    totalCount: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListSegmentsResponse}
 */
proto.bucketeer.feature.ListSegmentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListSegmentsResponse;
  return proto.bucketeer.feature.ListSegmentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListSegmentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListSegmentsResponse}
 */
proto.bucketeer.feature.ListSegmentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_segment_pb.Segment;
      reader.readMessage(value,proto_feature_segment_pb.Segment.deserializeBinaryFromReader);
      msg.addSegments(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalCount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListSegmentsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListSegmentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegmentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_feature_segment_pb.Segment.serializeBinaryToWriter
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTotalCount();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * repeated Segment segments = 1;
 * @return {!Array<!proto.bucketeer.feature.Segment>}
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.getSegmentsList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Segment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_segment_pb.Segment, 1));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Segment>} value
 * @return {!proto.bucketeer.feature.ListSegmentsResponse} returns this
*/
proto.bucketeer.feature.ListSegmentsResponse.prototype.setSegmentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.bucketeer.feature.Segment=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Segment}
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.addSegments = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.bucketeer.feature.Segment, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.ListSegmentsResponse} returns this
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.clearSegmentsList = function() {
  return this.setSegmentsList([]);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentsResponse} returns this
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 total_count = 3;
 * @return {number}
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.getTotalCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.bucketeer.feature.ListSegmentsResponse} returns this
 */
proto.bucketeer.feature.ListSegmentsResponse.prototype.setTotalCount = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DeleteSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DeleteSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.DeleteSegmentCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DeleteSegmentRequest}
 */
proto.bucketeer.feature.DeleteSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DeleteSegmentRequest;
  return proto.bucketeer.feature.DeleteSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DeleteSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DeleteSegmentRequest}
 */
proto.bucketeer.feature.DeleteSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.DeleteSegmentCommand;
      reader.readMessage(value,proto_feature_command_pb.DeleteSegmentCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DeleteSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DeleteSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.DeleteSegmentCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DeleteSegmentRequest} returns this
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional DeleteSegmentCommand command = 2;
 * @return {?proto.bucketeer.feature.DeleteSegmentCommand}
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.DeleteSegmentCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.DeleteSegmentCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.DeleteSegmentCommand|undefined} value
 * @return {!proto.bucketeer.feature.DeleteSegmentRequest} returns this
*/
proto.bucketeer.feature.DeleteSegmentRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.DeleteSegmentRequest} returns this
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DeleteSegmentRequest} returns this
 */
proto.bucketeer.feature.DeleteSegmentRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DeleteSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DeleteSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DeleteSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DeleteSegmentResponse}
 */
proto.bucketeer.feature.DeleteSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DeleteSegmentResponse;
  return proto.bucketeer.feature.DeleteSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DeleteSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DeleteSegmentResponse}
 */
proto.bucketeer.feature.DeleteSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DeleteSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DeleteSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DeleteSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.UpdateSegmentRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateSegmentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateSegmentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateSegmentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    commandsList: jspb.Message.toObjectList(msg.getCommandsList(),
    proto_feature_command_pb.Command.toObject, includeInstance),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateSegmentRequest}
 */
proto.bucketeer.feature.UpdateSegmentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateSegmentRequest;
  return proto.bucketeer.feature.UpdateSegmentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateSegmentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateSegmentRequest}
 */
proto.bucketeer.feature.UpdateSegmentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.Command;
      reader.readMessage(value,proto_feature_command_pb.Command.deserializeBinaryFromReader);
      msg.addCommands(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateSegmentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateSegmentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateSegmentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommandsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto_feature_command_pb.Command.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateSegmentRequest} returns this
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated Command commands = 2;
 * @return {!Array<!proto.bucketeer.feature.Command>}
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.getCommandsList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Command>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_command_pb.Command, 2));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Command>} value
 * @return {!proto.bucketeer.feature.UpdateSegmentRequest} returns this
*/
proto.bucketeer.feature.UpdateSegmentRequest.prototype.setCommandsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.bucketeer.feature.Command=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Command}
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.addCommands = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.bucketeer.feature.Command, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.UpdateSegmentRequest} returns this
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.clearCommandsList = function() {
  return this.setCommandsList([]);
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpdateSegmentRequest} returns this
 */
proto.bucketeer.feature.UpdateSegmentRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpdateSegmentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpdateSegmentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpdateSegmentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateSegmentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpdateSegmentResponse}
 */
proto.bucketeer.feature.UpdateSegmentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpdateSegmentResponse;
  return proto.bucketeer.feature.UpdateSegmentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpdateSegmentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpdateSegmentResponse}
 */
proto.bucketeer.feature.UpdateSegmentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpdateSegmentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpdateSegmentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpdateSegmentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpdateSegmentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.AddSegmentUserRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.AddSegmentUserRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.AddSegmentUserRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.AddSegmentUserCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.AddSegmentUserRequest}
 */
proto.bucketeer.feature.AddSegmentUserRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.AddSegmentUserRequest;
  return proto.bucketeer.feature.AddSegmentUserRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.AddSegmentUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.AddSegmentUserRequest}
 */
proto.bucketeer.feature.AddSegmentUserRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.AddSegmentUserCommand;
      reader.readMessage(value,proto_feature_command_pb.AddSegmentUserCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.AddSegmentUserRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.AddSegmentUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.AddSegmentUserRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.AddSegmentUserCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.AddSegmentUserRequest} returns this
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional AddSegmentUserCommand command = 2;
 * @return {?proto.bucketeer.feature.AddSegmentUserCommand}
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.AddSegmentUserCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.AddSegmentUserCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.AddSegmentUserCommand|undefined} value
 * @return {!proto.bucketeer.feature.AddSegmentUserRequest} returns this
*/
proto.bucketeer.feature.AddSegmentUserRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.AddSegmentUserRequest} returns this
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.AddSegmentUserRequest} returns this
 */
proto.bucketeer.feature.AddSegmentUserRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.AddSegmentUserResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.AddSegmentUserResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.AddSegmentUserResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.AddSegmentUserResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.AddSegmentUserResponse}
 */
proto.bucketeer.feature.AddSegmentUserResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.AddSegmentUserResponse;
  return proto.bucketeer.feature.AddSegmentUserResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.AddSegmentUserResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.AddSegmentUserResponse}
 */
proto.bucketeer.feature.AddSegmentUserResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.AddSegmentUserResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.AddSegmentUserResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.AddSegmentUserResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.AddSegmentUserResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DeleteSegmentUserRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DeleteSegmentUserRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.DeleteSegmentUserCommand.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DeleteSegmentUserRequest}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DeleteSegmentUserRequest;
  return proto.bucketeer.feature.DeleteSegmentUserRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DeleteSegmentUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DeleteSegmentUserRequest}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto_feature_command_pb.DeleteSegmentUserCommand;
      reader.readMessage(value,proto_feature_command_pb.DeleteSegmentUserCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DeleteSegmentUserRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DeleteSegmentUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto_feature_command_pb.DeleteSegmentUserCommand.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DeleteSegmentUserRequest} returns this
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional DeleteSegmentUserCommand command = 2;
 * @return {?proto.bucketeer.feature.DeleteSegmentUserCommand}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.DeleteSegmentUserCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.DeleteSegmentUserCommand, 2));
};


/**
 * @param {?proto.bucketeer.feature.DeleteSegmentUserCommand|undefined} value
 * @return {!proto.bucketeer.feature.DeleteSegmentUserRequest} returns this
*/
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.DeleteSegmentUserRequest} returns this
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string environment_namespace = 3;
 * @return {string}
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.DeleteSegmentUserRequest} returns this
 */
proto.bucketeer.feature.DeleteSegmentUserRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.DeleteSegmentUserResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.DeleteSegmentUserResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.DeleteSegmentUserResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentUserResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.DeleteSegmentUserResponse}
 */
proto.bucketeer.feature.DeleteSegmentUserResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.DeleteSegmentUserResponse;
  return proto.bucketeer.feature.DeleteSegmentUserResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.DeleteSegmentUserResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.DeleteSegmentUserResponse}
 */
proto.bucketeer.feature.DeleteSegmentUserResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.DeleteSegmentUserResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.DeleteSegmentUserResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.DeleteSegmentUserResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.DeleteSegmentUserResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetSegmentUserRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetSegmentUserRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentUserRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    segmentId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    userId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    state: jspb.Message.getFieldWithDefault(msg, 3, 0),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetSegmentUserRequest}
 */
proto.bucketeer.feature.GetSegmentUserRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetSegmentUserRequest;
  return proto.bucketeer.feature.GetSegmentUserRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetSegmentUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetSegmentUserRequest}
 */
proto.bucketeer.feature.GetSegmentUserRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    case 3:
      var value = /** @type {!proto.bucketeer.feature.SegmentUser.State} */ (reader.readEnum());
      msg.setState(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetSegmentUserRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetSegmentUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentUserRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getState();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string segment_id = 1;
 * @return {string}
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetSegmentUserRequest} returns this
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.setSegmentId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string user_id = 2;
 * @return {string}
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetSegmentUserRequest} returns this
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.setUserId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional SegmentUser.State state = 3;
 * @return {!proto.bucketeer.feature.SegmentUser.State}
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.getState = function() {
  return /** @type {!proto.bucketeer.feature.SegmentUser.State} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.bucketeer.feature.SegmentUser.State} value
 * @return {!proto.bucketeer.feature.GetSegmentUserRequest} returns this
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.setState = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional string environment_namespace = 4;
 * @return {string}
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetSegmentUserRequest} returns this
 */
proto.bucketeer.feature.GetSegmentUserRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetSegmentUserResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetSegmentUserResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetSegmentUserResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentUserResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    user: (f = msg.getUser()) && proto_feature_segment_pb.SegmentUser.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetSegmentUserResponse}
 */
proto.bucketeer.feature.GetSegmentUserResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetSegmentUserResponse;
  return proto.bucketeer.feature.GetSegmentUserResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetSegmentUserResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetSegmentUserResponse}
 */
proto.bucketeer.feature.GetSegmentUserResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_segment_pb.SegmentUser;
      reader.readMessage(value,proto_feature_segment_pb.SegmentUser.deserializeBinaryFromReader);
      msg.setUser(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetSegmentUserResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetSegmentUserResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetSegmentUserResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetSegmentUserResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUser();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_feature_segment_pb.SegmentUser.serializeBinaryToWriter
    );
  }
};


/**
 * optional SegmentUser user = 1;
 * @return {?proto.bucketeer.feature.SegmentUser}
 */
proto.bucketeer.feature.GetSegmentUserResponse.prototype.getUser = function() {
  return /** @type{?proto.bucketeer.feature.SegmentUser} */ (
    jspb.Message.getWrapperField(this, proto_feature_segment_pb.SegmentUser, 1));
};


/**
 * @param {?proto.bucketeer.feature.SegmentUser|undefined} value
 * @return {!proto.bucketeer.feature.GetSegmentUserResponse} returns this
*/
proto.bucketeer.feature.GetSegmentUserResponse.prototype.setUser = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.GetSegmentUserResponse} returns this
 */
proto.bucketeer.feature.GetSegmentUserResponse.prototype.clearUser = function() {
  return this.setUser(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.GetSegmentUserResponse.prototype.hasUser = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListSegmentUsersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListSegmentUsersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentUsersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pageSize: jspb.Message.getFieldWithDefault(msg, 1, 0),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, ""),
    segmentId: jspb.Message.getFieldWithDefault(msg, 3, ""),
    state: (f = msg.getState()) && google_protobuf_wrappers_pb.Int32Value.toObject(includeInstance, f),
    userId: jspb.Message.getFieldWithDefault(msg, 5, ""),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 6, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListSegmentUsersRequest;
  return proto.bucketeer.feature.ListSegmentUsersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListSegmentUsersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPageSize(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
      break;
    case 4:
      var value = new google_protobuf_wrappers_pb.Int32Value;
      reader.readMessage(value,google_protobuf_wrappers_pb.Int32Value.deserializeBinaryFromReader);
      msg.setState(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListSegmentUsersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListSegmentUsersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentUsersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPageSize();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getState();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_wrappers_pb.Int32Value.serializeBinaryToWriter
    );
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * optional int64 page_size = 1;
 * @return {number}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.getPageSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.setPageSize = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string segment_id = 3;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.setSegmentId = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Int32Value state = 4;
 * @return {?proto.google.protobuf.Int32Value}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.getState = function() {
  return /** @type{?proto.google.protobuf.Int32Value} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.Int32Value, 4));
};


/**
 * @param {?proto.google.protobuf.Int32Value|undefined} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest} returns this
*/
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.setState = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.clearState = function() {
  return this.setState(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.hasState = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string user_id = 5;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.setUserId = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string environment_namespace = 6;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.ListSegmentUsersRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.ListSegmentUsersResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.ListSegmentUsersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.ListSegmentUsersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentUsersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    usersList: jspb.Message.toObjectList(msg.getUsersList(),
    proto_feature_segment_pb.SegmentUser.toObject, includeInstance),
    cursor: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.ListSegmentUsersResponse}
 */
proto.bucketeer.feature.ListSegmentUsersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.ListSegmentUsersResponse;
  return proto.bucketeer.feature.ListSegmentUsersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.ListSegmentUsersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.ListSegmentUsersResponse}
 */
proto.bucketeer.feature.ListSegmentUsersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_segment_pb.SegmentUser;
      reader.readMessage(value,proto_feature_segment_pb.SegmentUser.deserializeBinaryFromReader);
      msg.addUsers(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCursor(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.ListSegmentUsersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.ListSegmentUsersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.ListSegmentUsersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_feature_segment_pb.SegmentUser.serializeBinaryToWriter
    );
  }
  f = message.getCursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * repeated SegmentUser users = 1;
 * @return {!Array<!proto.bucketeer.feature.SegmentUser>}
 */
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.getUsersList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.SegmentUser>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_segment_pb.SegmentUser, 1));
};


/**
 * @param {!Array<!proto.bucketeer.feature.SegmentUser>} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersResponse} returns this
*/
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.setUsersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.bucketeer.feature.SegmentUser=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.SegmentUser}
 */
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.addUsers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.bucketeer.feature.SegmentUser, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.ListSegmentUsersResponse} returns this
 */
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.clearUsersList = function() {
  return this.setUsersList([]);
};


/**
 * optional string cursor = 2;
 * @return {string}
 */
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.getCursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.ListSegmentUsersResponse} returns this
 */
proto.bucketeer.feature.ListSegmentUsersResponse.prototype.setCursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.BulkUploadSegmentUsersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    command: (f = msg.getCommand()) && proto_feature_command_pb.BulkUploadSegmentUsersCommand.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.BulkUploadSegmentUsersRequest;
  return proto.bucketeer.feature.BulkUploadSegmentUsersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
      break;
    case 3:
      var value = new proto_feature_command_pb.BulkUploadSegmentUsersCommand;
      reader.readMessage(value,proto_feature_command_pb.BulkUploadSegmentUsersCommand.deserializeBinaryFromReader);
      msg.setCommand(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.BulkUploadSegmentUsersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getCommand();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto_feature_command_pb.BulkUploadSegmentUsersCommand.serializeBinaryToWriter
    );
  }
};


/**
 * optional string environment_namespace = 1;
 * @return {string}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.setSegmentId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional BulkUploadSegmentUsersCommand command = 3;
 * @return {?proto.bucketeer.feature.BulkUploadSegmentUsersCommand}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.getCommand = function() {
  return /** @type{?proto.bucketeer.feature.BulkUploadSegmentUsersCommand} */ (
    jspb.Message.getWrapperField(this, proto_feature_command_pb.BulkUploadSegmentUsersCommand, 3));
};


/**
 * @param {?proto.bucketeer.feature.BulkUploadSegmentUsersCommand|undefined} value
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest} returns this
*/
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.setCommand = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.clearCommand = function() {
  return this.setCommand(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersRequest.prototype.hasCommand = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.BulkUploadSegmentUsersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.BulkUploadSegmentUsersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkUploadSegmentUsersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersResponse}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.BulkUploadSegmentUsersResponse;
  return proto.bucketeer.feature.BulkUploadSegmentUsersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.BulkUploadSegmentUsersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.BulkUploadSegmentUsersResponse}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.BulkUploadSegmentUsersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.BulkUploadSegmentUsersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.BulkUploadSegmentUsersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkUploadSegmentUsersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
    segmentId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    state: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.BulkDownloadSegmentUsersRequest;
  return proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegmentId(value);
      break;
    case 3:
      var value = /** @type {!proto.bucketeer.feature.SegmentUser.State} */ (reader.readEnum());
      msg.setState(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSegmentId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getState();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional string environment_namespace = 1;
 * @return {string}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string segment_id = 2;
 * @return {string}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.getSegmentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.setSegmentId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional SegmentUser.State state = 3;
 * @return {!proto.bucketeer.feature.SegmentUser.State}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.getState = function() {
  return /** @type {!proto.bucketeer.feature.SegmentUser.State} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.bucketeer.feature.SegmentUser.State} value
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersRequest} returns this
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersRequest.prototype.setState = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.BulkDownloadSegmentUsersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: msg.getData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersResponse}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.BulkDownloadSegmentUsersResponse;
  return proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.BulkDownloadSegmentUsersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersResponse}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.BulkDownloadSegmentUsersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes data = 1;
 * @return {!(string|Uint8Array)}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes data = 1;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.bucketeer.feature.BulkDownloadSegmentUsersResponse} returns this
 */
proto.bucketeer.feature.BulkDownloadSegmentUsersResponse.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    user: (f = msg.getUser()) && proto_user_user_pb.User.toObject(includeInstance, f),
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.EvaluateOnAllFeaturesRequest;
  return proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_user_user_pb.User;
      reader.readMessage(value,proto_user_user_pb.User.deserializeBinaryFromReader);
      msg.setUser(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUser();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_user_user_pb.User.serializeBinaryToWriter
    );
  }
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bucketeer.user.User user = 1;
 * @return {?proto.bucketeer.user.User}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.getUser = function() {
  return /** @type{?proto.bucketeer.user.User} */ (
    jspb.Message.getWrapperField(this, proto_user_user_pb.User, 1));
};


/**
 * @param {?proto.bucketeer.user.User|undefined} value
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest} returns this
*/
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.setUser = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest} returns this
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.clearUser = function() {
  return this.setUser(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.hasUser = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string environment_namespace = 2;
 * @return {string}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesRequest} returns this
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.EvaluateOnAllFeaturesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    userEvaluations: (f = msg.getUserEvaluations()) && proto_feature_evaluation_pb.UserEvaluations.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesResponse}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.EvaluateOnAllFeaturesResponse;
  return proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.EvaluateOnAllFeaturesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesResponse}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_evaluation_pb.UserEvaluations;
      reader.readMessage(value,proto_feature_evaluation_pb.UserEvaluations.deserializeBinaryFromReader);
      msg.setUserEvaluations(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.EvaluateOnAllFeaturesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUserEvaluations();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto_feature_evaluation_pb.UserEvaluations.serializeBinaryToWriter
    );
  }
};


/**
 * optional UserEvaluations user_evaluations = 1;
 * @return {?proto.bucketeer.feature.UserEvaluations}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.prototype.getUserEvaluations = function() {
  return /** @type{?proto.bucketeer.feature.UserEvaluations} */ (
    jspb.Message.getWrapperField(this, proto_feature_evaluation_pb.UserEvaluations, 1));
};


/**
 * @param {?proto.bucketeer.feature.UserEvaluations|undefined} value
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesResponse} returns this
*/
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.prototype.setUserEvaluations = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.EvaluateOnAllFeaturesResponse} returns this
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.prototype.clearUserEvaluations = function() {
  return this.setUserEvaluations(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.EvaluateOnAllFeaturesResponse.prototype.hasUserEvaluations = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetUserEvaluationsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetUserEvaluationsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
    tag: jspb.Message.getFieldWithDefault(msg, 2, ""),
    userId: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetUserEvaluationsRequest}
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetUserEvaluationsRequest;
  return proto.bucketeer.feature.GetUserEvaluationsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetUserEvaluationsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetUserEvaluationsRequest}
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTag(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetUserEvaluationsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetUserEvaluationsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTag();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string environment_namespace = 1;
 * @return {string}
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetUserEvaluationsRequest} returns this
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string tag = 2;
 * @return {string}
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.getTag = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetUserEvaluationsRequest} returns this
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.setTag = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string user_id = 3;
 * @return {string}
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.GetUserEvaluationsRequest} returns this
 */
proto.bucketeer.feature.GetUserEvaluationsRequest.prototype.setUserId = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.GetUserEvaluationsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.GetUserEvaluationsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    evaluationsList: jspb.Message.toObjectList(msg.getEvaluationsList(),
    proto_feature_evaluation_pb.Evaluation.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.GetUserEvaluationsResponse}
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.GetUserEvaluationsResponse;
  return proto.bucketeer.feature.GetUserEvaluationsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.GetUserEvaluationsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.GetUserEvaluationsResponse}
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_feature_evaluation_pb.Evaluation;
      reader.readMessage(value,proto_feature_evaluation_pb.Evaluation.deserializeBinaryFromReader);
      msg.addEvaluations(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.GetUserEvaluationsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.GetUserEvaluationsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEvaluationsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_feature_evaluation_pb.Evaluation.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Evaluation evaluations = 1;
 * @return {!Array<!proto.bucketeer.feature.Evaluation>}
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.prototype.getEvaluationsList = function() {
  return /** @type{!Array<!proto.bucketeer.feature.Evaluation>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_feature_evaluation_pb.Evaluation, 1));
};


/**
 * @param {!Array<!proto.bucketeer.feature.Evaluation>} value
 * @return {!proto.bucketeer.feature.GetUserEvaluationsResponse} returns this
*/
proto.bucketeer.feature.GetUserEvaluationsResponse.prototype.setEvaluationsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.bucketeer.feature.Evaluation=} opt_value
 * @param {number=} opt_index
 * @return {!proto.bucketeer.feature.Evaluation}
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.prototype.addEvaluations = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.bucketeer.feature.Evaluation, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.bucketeer.feature.GetUserEvaluationsResponse} returns this
 */
proto.bucketeer.feature.GetUserEvaluationsResponse.prototype.clearEvaluationsList = function() {
  return this.setEvaluationsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpsertUserEvaluationRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpsertUserEvaluationRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    environmentNamespace: jspb.Message.getFieldWithDefault(msg, 1, ""),
    tag: jspb.Message.getFieldWithDefault(msg, 2, ""),
    evaluation: (f = msg.getEvaluation()) && proto_feature_evaluation_pb.Evaluation.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationRequest}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpsertUserEvaluationRequest;
  return proto.bucketeer.feature.UpsertUserEvaluationRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpsertUserEvaluationRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationRequest}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnvironmentNamespace(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTag(value);
      break;
    case 3:
      var value = new proto_feature_evaluation_pb.Evaluation;
      reader.readMessage(value,proto_feature_evaluation_pb.Evaluation.deserializeBinaryFromReader);
      msg.setEvaluation(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpsertUserEvaluationRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpsertUserEvaluationRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEnvironmentNamespace();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTag();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEvaluation();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto_feature_evaluation_pb.Evaluation.serializeBinaryToWriter
    );
  }
};


/**
 * optional string environment_namespace = 1;
 * @return {string}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.getEnvironmentNamespace = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationRequest} returns this
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.setEnvironmentNamespace = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string tag = 2;
 * @return {string}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.getTag = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationRequest} returns this
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.setTag = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional Evaluation evaluation = 3;
 * @return {?proto.bucketeer.feature.Evaluation}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.getEvaluation = function() {
  return /** @type{?proto.bucketeer.feature.Evaluation} */ (
    jspb.Message.getWrapperField(this, proto_feature_evaluation_pb.Evaluation, 3));
};


/**
 * @param {?proto.bucketeer.feature.Evaluation|undefined} value
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationRequest} returns this
*/
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.setEvaluation = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationRequest} returns this
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.clearEvaluation = function() {
  return this.setEvaluation(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.bucketeer.feature.UpsertUserEvaluationRequest.prototype.hasEvaluation = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.bucketeer.feature.UpsertUserEvaluationResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.bucketeer.feature.UpsertUserEvaluationResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.bucketeer.feature.UpsertUserEvaluationResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpsertUserEvaluationResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationResponse}
 */
proto.bucketeer.feature.UpsertUserEvaluationResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.bucketeer.feature.UpsertUserEvaluationResponse;
  return proto.bucketeer.feature.UpsertUserEvaluationResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.bucketeer.feature.UpsertUserEvaluationResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.bucketeer.feature.UpsertUserEvaluationResponse}
 */
proto.bucketeer.feature.UpsertUserEvaluationResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.bucketeer.feature.UpsertUserEvaluationResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.bucketeer.feature.UpsertUserEvaluationResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.bucketeer.feature.UpsertUserEvaluationResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.bucketeer.feature.UpsertUserEvaluationResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


goog.object.extend(exports, proto.bucketeer.feature);
