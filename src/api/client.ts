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
import { AbortError, InvalidStatusError, TimeoutError, parseRetryAfter } from '../objects/errors';
import {
  RetryPolicy,
  promiseRetriable as defaultPromiseRetriable,
  isRetryable,
} from '../utils/promiseRetriable';
import { isOperationAbortedError, isOperationTimedOutError } from '../utils/pollController';

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
  private readonly promiseRetriable: typeof defaultPromiseRetriable;

  constructor(
    host: string,
    apiKey: string,
    retryPolicy: RetryPolicy = DEFAULT_RETRY_POLICY,
    promiseRetriable: typeof defaultPromiseRetriable = defaultPromiseRetriable,
  ) {
    this.host = host;
    this.apiKey = apiKey;
    this.retryPolicy = retryPolicy;
    this.promiseRetriable = promiseRetriable;
  }

  getFeatureFlags(
    tag: string,
    featureFlagsId: string,
    requestedAt: number,
    sourceId: SourceId,
    sdkVersion: string,
    signal?: AbortSignal,
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
    return this.postRequestWithRetry<GetFeatureFlagsResponse>(url, chunk, signal);
  }

  getSegmentUsers(
    segmentIds: string[],
    requestedAt: number,
    sourceId: SourceId,
    sdkVersion: string,
    signal?: AbortSignal,
  ): Promise<[GetSegmentUsersResponse, number]> {
    const req: GetSegmentUsersRequest = {
      segmentIds,
      requestedAt,
      sourceId,
      sdkVersion,
    };
    const url = scheme.concat(this.host, segmentUsersAPI);
    const chunk = JSON.stringify(req);
    return this.postRequestWithRetry<GetSegmentUsersResponse>(url, chunk, signal);
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
    return this.postRequestWithRetry<GetEvaluationResponse>(url, chunk, signal);
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
    return this.postRequestWithRetry<RegisterEventsResponse>(url, chunk, signal);
  }

  private postRequestWithRetry<T>(
    url: string,
    chunk: string,
    signal?: AbortSignal,
  ): Promise<[T, number]> {
    return this.promiseRetriable(
      (s) => this.postRequest<T>(url, chunk, s),
      this.retryPolicy,
      isRetryable,
      signal,
    );
  }

  private postRequest<T>(
    url: string,
    chunk: string,
    signal?: AbortSignal,
  ): Promise<[T, number]> {
    const REQUEST_TIMEOUT_MS = 5000;
    const opts: https.RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.apiKey,
      },
      timeout: REQUEST_TIMEOUT_MS,
      signal: signal,
    };
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        const reason = signal.reason;
        if (isOperationTimedOutError(reason))
          return reject(reason instanceof TimeoutError ? reason : new TimeoutError(REQUEST_TIMEOUT_MS));
        if (isOperationAbortedError(reason)) return reject(new AbortError());
        return reject(reason);
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
          try {
            resolve([JSON.parse(rawData) as T, Number(res.headers['content-length'] || 0)]);
          } catch (e) {
            reject(e);
          }
        });
      });
      clientReq.on('error', (e) => {
        if (isOperationTimedOutError(e)) {
          reject(e instanceof TimeoutError ? e : new TimeoutError(REQUEST_TIMEOUT_MS));
        } else if (isOperationAbortedError(e)) {
          reject(new AbortError());
        } else {
          reject(e);
        }
      });
      clientReq.on('timeout', () => {
        // No error arg: Node.js emits ECONNRESET on clientReq (pre-response phase)
        // or on res (post-headers phase). Both paths are handled — clientReq.on('error')
        // and res.on('error') above — so the promise always rejects. 
        // ECONNRESET is retriable.
        clientReq.destroy();
      });
      clientReq.write(chunk);
      clientReq.end();
    });
  }
}
