// The API IDs must match the IDs defined on the main repository
// https://github.com/bucketeer-io/bucketeer/blob/main/proto/event/client/event.proto
export enum ApiId {
  UNKNOWN_API = 0,
  GET_EVALUATION = 1,
  GET_EVALUATIONS = 2,
  REGISTER_EVENTS = 3,
  GET_FEATURE_FLAGS = 4,
  GET_SEGMENT_USERS = 5,
  SDK_GET_VARIATION = 100,
}

export type NodeApiIds =
  | ApiId.GET_EVALUATION
  | ApiId.REGISTER_EVENTS
  | ApiId.GET_FEATURE_FLAGS
  | ApiId.GET_SEGMENT_USERS
  | ApiId.SDK_GET_VARIATION;
