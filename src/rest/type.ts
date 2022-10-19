// These codes are designed to hide the snake case in JSON so that developers
// who write codes in other file don't have to be aware of it.
// By this design, developers can write codes in camel case consistently.

import { UserAsPlainObject } from '../bootstrap';

interface Evaluation {
  id: string;
  featureId: string;
  featureVersion: number;
  userId: string;
  variationId: string;
  reason?: Reason;
  variationValue: string;
}

interface RawEvaluation {
  id: string;
  feature_id: string;
  feature_version: number;
  user_id: string;
  variation_id: string;
  reason?: RawReason;
  variation_value: string;
}

interface Reason {
  type: ReasonType;
  ruleId?: string;
}

interface RawReason {
  type: ReasonType;
  rule_id?: string;
}

enum ReasonType {
  TARGET = 0,
  RULE = 1,
  DEFAULT = 3,
  CLIENT = 4,
  OFF_VARIATION = 5,
}

export enum SourceId {
  UNKNOWN = 0,
  ANDROID = 1,
  IOS = 2,
  WEB = 3,
  GOAL_BATCH = 4,
  GO_SERVER = 5,
  NODE_SERVER = 6,
}

interface RawGetEvaluationResponse {
  evaluation?: RawEvaluation;
}

enum EventType {
  GOAL = 1,
  GOAL_BATCH = 2,
  EVALUATION = 3,
  METRICS = 4,
}

export interface Event {
  id: string;
  type: EventType;
  environmentNamespace: string;
  event: string;
}

export interface RawEvent {
  id: string;
  type: EventType;
  environment_namespace: string;
  event: string;
}

interface RegisterEventsResponseError {
  retriable: boolean;
  message: string;
}

interface RawRegisterEventsResponse {
  errors: { [key: string]: RegisterEventsResponseError };
}

interface RawRegisterEventsRequest {
  events: RawEvent[];
}

export class RegisterEventsRequest {
  public events: Event[] = [];
  static fromJSON(json: string): RegisterEventsRequest {
    const obj = JSON.parse(json);
    const rawReq = obj as RawRegisterEventsRequest;
    const res = new RegisterEventsRequest();
    for (const event of rawReq.events) {
      res.events.push({
        id: event.id,
        type: event.type,
        environmentNamespace: event.environment_namespace,
        event: event.event,
      });
    }
    return res;
  }

  toJSON() {
    const req: RawRegisterEventsRequest = {
      events: [],
    };
    for (const event of this.events) {
      req.events.push({
        id: event.id,
        type: event.type,
        environment_namespace: event.environmentNamespace,
        event: event.event,
      });
    }
    return req;
  }
}

export class RegisterEventsResponse {
  public errors: { [key: string]: RegisterEventsResponseError } = {};
  static fromJSON(json: string): RegisterEventsResponse {
    const obj = JSON.parse(json);
    if (obj.data === undefined) {
      throw new Error('invalid object');
    }
    const rawRes = obj.data as RawRegisterEventsResponse;
    const res = new RegisterEventsResponse();
    res.errors = rawRes.errors;
    return res;
  }

  toJSON() {
    const res: RawRegisterEventsResponse = {
      errors: {},
    };
    for (const [key, err] of Object.entries(this.errors)) {
      res.errors[key] = { retriable: err.retriable, message: err.message };
    }
    return { data: res };
  }
}

interface RawGetEvaluationRequest {
  tag: string;
  user?: UserAsPlainObject;
  feature_id: string;
  source_id: SourceId;
}

export class GetEvaluationRequest {
  public tag: string = '';
  public user?: UserAsPlainObject;
  public featureId: string = '';
  public sourceId: SourceId = 0;

  static fromJSON(json: string): GetEvaluationRequest {
    const obj = JSON.parse(json);
    const rawReq = obj as RawGetEvaluationRequest;
    const req = new GetEvaluationRequest();
    req.tag = rawReq.tag;
    req.featureId = rawReq.feature_id;
    req.sourceId = rawReq.source_id;
    if (rawReq.user) {
      req.user = {
        id: rawReq.user.id,
        data: rawReq.user.data,
      };
    }
    return req;
  }

  toJSON() {
    const req: RawGetEvaluationRequest = {
      tag: this.tag,
      user: this.user,
      feature_id: this.featureId,
      source_id: this.sourceId,
    };
    return req;
  }
}

export class GetEvaluationResponse {
  public evaluation?: Evaluation;

  static fromJSON(json: string): GetEvaluationResponse {
    const obj = JSON.parse(json);
    if (obj.data === undefined) {
      throw new Error('invalid object');
    }
    const rawRes = obj.data as RawGetEvaluationResponse;
    const res = new GetEvaluationResponse();
    if (rawRes.evaluation) {
      res.evaluation = {
        id: rawRes.evaluation.id,
        featureId: rawRes.evaluation.feature_id,
        featureVersion: rawRes.evaluation.feature_version,
        userId: rawRes.evaluation.user_id,
        variationId: rawRes.evaluation.variation_id,
        variationValue: rawRes.evaluation.variation_value,
      };
      if (rawRes.evaluation.reason) {
        res.evaluation.reason = {
          type: rawRes.evaluation.reason.type,
          ruleId: rawRes.evaluation.reason.rule_id,
        };
      }
    }
    return res;
  }

  toJSON() {
    if (this.evaluation === undefined) {
      return {};
    }
    const res: RawGetEvaluationResponse = {
      evaluation: {
        id: this.evaluation.id,
        feature_id: this.evaluation.featureId,
        feature_version: this.evaluation.featureVersion,
        user_id: this.evaluation.userId,
        variation_id: this.evaluation.variationId,
        variation_value: this.evaluation.variationValue,
      },
    };
    if (res.evaluation && this.evaluation.reason) {
      res.evaluation.reason = {
        type: this.evaluation.reason.type,
        rule_id: this.evaluation.reason.ruleId,
      };
    }
    return { data: res };
  }
}
