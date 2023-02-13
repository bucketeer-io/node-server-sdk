export enum ApiId {
  UNKNOWN_API = 0,
  GET_EVALUATION = 1,
  GET_EVALUATIONS = 2,
  REGISTER_EVENTS = 3,
}

export type NodeApiIds = ApiId.GET_EVALUATION | ApiId.REGISTER_EVENTS;
