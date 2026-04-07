import { User } from '../bootstrap';
import https from 'https';
import { Event } from '../objects/event';
import { SourceId } from '../objects/sourceId';
import {
  GetEvaluationRequest,
  GetFeatureFlagsRequest,
  GetSegmentUsersRequest,
  RegisterEventsRequest,
} from '../objects/request';
import {
  GetEvaluationResponse,
  GetFeatureFlagsResponse,
  GetSegmentUsersResponse,
  RegisterEventsResponse,
} from '../objects/response';
import { InvalidStatusError } from '../objects/errors';

const scheme = 'https://';
const evaluationAPI = '/get_evaluation';
const featureFlagsAPI = '/get_feature_flags';
const segmentUsersAPI = '/get_segment_users';
const eventsAPI = '/register_events';

export class APIClient {
  private readonly host: string;
  private readonly apiKey: string;

  constructor(host: string, apiKey: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  getFeatureFlags(
    tag: string,
    featureFlagsId: string,
    requestedAt: number,
    sourceId: SourceId,
    sdkVersion: string,
  ): Promise<[GetFeatureFlagsResponse, number]> {
    const req: GetFeatureFlagsRequest = {
      tag,
      featureFlagsId,
      requestedAt,
      sourceId,
      sdkVersion,
    };
    const url = scheme.concat(this.host, featureFlagsAPI);
    return this.postRequest<GetFeatureFlagsResponse>(url, req);
  }

  getSegmentUsers(
    segmentIds: string[],
    requestedAt: number,
    sourceId: SourceId,
    sdkVersion: string,
  ): Promise<[GetSegmentUsersResponse, number]> {
    const req: GetSegmentUsersRequest = {
      segmentIds,
      requestedAt,
      sourceId,
      sdkVersion,
    };
    const url = scheme.concat(this.host, segmentUsersAPI);
    return this.postRequest<GetSegmentUsersResponse>(url, req);
  }

  getEvaluation(
    tag: string,
    user: User,
    featureId: string,
    sourceId: SourceId,
    sdkVersion: string,
  ): Promise<[GetEvaluationResponse, number]> {
    const req: GetEvaluationRequest = {
      tag,
      user,
      featureId,
      sourceId: sourceId,
      sdkVersion: sdkVersion,
    };
    const url = scheme.concat(this.host, evaluationAPI);
    return this.postRequest<GetEvaluationResponse>(url, req);
  }

  registerEvents(
    events: Array<Event>,
    sourceId: SourceId,
    sdkVersion: string,
  ): Promise<[RegisterEventsResponse, number]> {
    const req: RegisterEventsRequest = {
      events,
      sdkVersion: sdkVersion,
      sourceId: sourceId,
    };
    const url = scheme.concat(this.host, eventsAPI);
    return this.postRequest<RegisterEventsResponse>(url, req);
  }

  private postRequest<T>(url: string, req: unknown): Promise<[T, number]> {
    const chunk = JSON.stringify(req);
    const opts: https.RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.apiKey,
      },
      timeout: 10000,
    };
    return new Promise((resolve, reject) => {
      const clientReq = https.request(url, opts, (res) => {
        if (res.statusCode != 200) {
          reject(
            new InvalidStatusError(
              `bucketeer/api: send HTTP request failed: ${res.statusCode}`,
              res.statusCode,
            ),
          );
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk: Buffer) => {
          rawData += chunk.toString();
        });
        res.on('end', () => {
          const headerContentLength = res.headers['content-length'];
          try {
            const result = JSON.parse(rawData) as T;
            resolve([result, Number(headerContentLength || 0)]);
          } catch (e) {
            reject(e);
          }
        });
      });
      clientReq.on('error', (e) => {
        reject(e);
      });
      clientReq.write(chunk);
      clientReq.end();
      clientReq.on('timeout', () => {
        clientReq.destroy();
      });
    });
  }
}
