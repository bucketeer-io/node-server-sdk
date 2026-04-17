import { User } from '../bootstrap';
import https from 'https';
import { Event } from '../objects/event';
import { SourceId } from '../objects/sourceId';
import { GetEvaluationRequest, RegisterEventsRequest } from '../objects/request';
import { GetEvaluationResponse, RegisterEventsResponse } from '../objects/response';
import { InvalidStatusError, parseRetryAfter } from '../objects/errors';
import { RetryPolicy, promiseRetriable, isRetryable } from '../utils/promiseRetriable';

const scheme = 'https://';
const evaluationAPI = '/get_evaluation';
const eventsAPI = '/register_events';

const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
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
    const chunk = JSON.stringify(req);
    const url = scheme.concat(this.host, evaluationAPI);
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
    const chunk = JSON.stringify(req);
    const url = scheme.concat(this.host, eventsAPI);
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
        clientReq.destroy();
      });
    });
  }
}
