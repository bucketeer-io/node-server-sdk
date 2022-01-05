import { credentials, Metadata, ServiceError } from '@grpc/grpc-js';
import { GatewayClient } from '../proto/gateway/service_grpc_pb';
import {
  GetEvaluationRequest,
  GetEvaluationResponse,
  RegisterEventsRequest,
  RegisterEventsResponse,
} from '../proto/gateway/service_pb';
import { Event, SourceId } from '../proto/event/client/event_pb';
import { UserAsPlainObject } from '../objects/User';
import { User } from '../proto/user/user_pb';

export class Client {
  private client: GatewayClient;
  private metadata: Metadata;

  constructor(host: string, port: string, apiKey: string) {
    this.client = new GatewayClient(`${host}:${port}`, credentials.createSsl(), {});
    this.metadata = new Metadata();
    this.metadata.set('authorization', apiKey);
  }

  getEvaluation(
    tag: string,
    user: UserAsPlainObject,
    featureId: string,
  ): Promise<GetEvaluationResponse> {
    const request = new GetEvaluationRequest();
    request.setTag(tag);
    request.setFeatureId(featureId);
    request.setSourceId(SourceId.NODE_SERVER);
    const u = new User();
    u.setId(user.id);
    Object.entries(user.data).forEach(([key, value]) => {
      const m = u.getDataMap().set(key, value);
    });
    request.setUser(u);
    return new Promise((resolve, reject): void => {
      this.client.getEvaluation(
        request,
        this.metadata,
        (error: ServiceError | null, response: GetEvaluationResponse): void => {
          if (error != null) {
            reject(error);
          } else {
            resolve(response);
          }
        },
      );
    });
  }

  registerEvents(events: Array<Event>): Promise<RegisterEventsResponse.AsObject> {
    const request = new RegisterEventsRequest();
    request.setEventsList(events);
    return new Promise((resolve, reject): void => {
      this.client.registerEvents(
        request,
        this.metadata,
        (error: ServiceError | null, response: RegisterEventsResponse): void => {
          if (error != null) {
            reject(error);
          } else {
            resolve(response.toObject());
          }
        },
      );
    });
  }
}
