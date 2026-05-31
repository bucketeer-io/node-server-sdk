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
import { InvalidStatusError, parseRetryAfter } from '../objects/errors';
import { RetryPolicy, promiseRetriable, isRetryable } from '../utils/promiseRetriable';

const scheme = 'https://';
const evaluationAPI = '/get_evaluation';
const featureFlagsAPI = '/get_feature_flags';
const segmentUsersAPI = '/get_segment_users';
const eventsAPI = '/register_events';

const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 0,
  initialInterval: 1000,
  maxInterval: 10000,
  multiplier: 2.0,
};

export class APIClient {
  private readonly host: string;
  private readonly apiKey: string;
  private readonly retryPolicy: RetryPolicy;

  constructor(host: string, apiKey: string, retryPolicy: RetryPolicy = DEFAULT_RETRY_POLICY) {
    this.host = host;
    this.apiKey = apiKey;
    this.retryPolicy = retryPolicy;
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
    const chunk = JSON.stringify(req);
    return this.postRequestWithRetry(url, chunk).then(([res, size]) => {
      const msg = JSON.parse(res) as GetFeatureFlagsResponse;
      return [msg, size];
    });
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
    const chunk = JSON.stringify(req);
    return this.postRequestWithRetry(url, chunk).then(([res, size]) => {
      const msg = JSON.parse(res) as GetSegmentUsersResponse;
      return [msg, size];
    });
  }

  getEvaluation(
    tag: string,
    user: User,
    featureId: string,
    sourceId: SourceId,
    sdkVersion: string,
    signal?: AbortSignal,
  ): Promise<[GetEvaluationResponse, number]> {
    const req: GetEvaluationRequest = {
      tag,
      user,
      featureId,
      sourceId: sourceId,
      sdkVersion: sdkVersion,
    };
    const url = scheme.concat(this.host, evaluationAPI);
    const chunk = JSON.stringify(req);
    return this.postRequestWithRetry(url, chunk, signal).then(([res, size]) => {
      const msg = JSON.parse(res) as GetEvaluationResponse;
      return [msg, size];
    });
  }

  registerEvents(
    events: Array<Event>,
    sourceId: SourceId,
    sdkVersion: string,
    signal?: AbortSignal,
  ): Promise<[RegisterEventsResponse, number]> {
    const req: RegisterEventsRequest = {
      events,
      sdkVersion: sdkVersion,
      sourceId: sourceId,
    };
    const url = scheme.concat(this.host, eventsAPI);
    const chunk = JSON.stringify(req);
    return this.postRequestWithRetry(url, chunk, signal).then(([res, size]) => {
      const msg = JSON.parse(res) as RegisterEventsResponse;
      return [msg, size];
    });
  }

  private postRequestWithRetry(
    url: string,
    chunk: string,
    signal?: AbortSignal,
  ): Promise<[string, number]> {
    return promiseRetriable(
      (s) => this.postRequestOnce(url, chunk, s),
      this.retryPolicy,
      isRetryable,
      signal,
    );
  }

  private postRequestOnce(
    url: string,
    chunk: string,
    signal?: AbortSignal,
  ): Promise<[string, number]> {
    const opts: https.RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.apiKey,
      },
      timeout: 10000,
      signal: signal as AbortSignal | undefined,
    };
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject(signal.reason);
      }
      const clientReq = https.request(url, opts, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk: Buffer) => {
          rawData += chunk.toString();
        });
        res.on('error', (e) => {
          reject(e);
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            const retryAfterMs = parseRetryAfter(res.headers['retry-after'] as string | undefined);
            reject(
              new InvalidStatusError(
                `bucketeer/api: send HTTP request failed: ${res.statusCode}`,
                res.statusCode,
                retryAfterMs,
              ),
            );
            return;
          }
          resolve([rawData, Number(res.headers['content-length'] || 0)]);
        });
      });
      clientReq.on('error', (e) => {
        reject(e);
      });
      clientReq.write(chunk);
      clientReq.end();
      clientReq.on('timeout', () => {
        // No error arg: Node.js emits ECONNRESET on clientReq (pre-response phase)
        // or on res (post-headers phase). Both paths are handled — clientReq.on('error')
        // and res.on('error') above — so the promise always rejects. 
        // ECONNRESET is retriable.
        clientReq.destroy();
      });
    });
  }
}
