import { User } from '../bootstrap';
import https from 'https';
import { Event } from '../objects/event';
import { SourceId } from '../objects/sourceId';
import { GetEvaluationRequest, RegisterEventsRequest } from '../objects/request';
import { GetEvaluationResponse, RegisterEventsResponse } from '../objects/response';
import { version } from '../objects/version';
import { InvalidStatusError } from '../objects/errors';

const scheme = 'https://';
const evaluationAPI = '/get_evaluation';
const eventsAPI = '/register_events';

export class APIClient {
  private readonly host: string;
  private readonly apiKey: string;

  constructor(host: string, apiKey: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  getEvaluation(
    tag: string,
    user: User,
    featureId: string,
  ): Promise<[GetEvaluationResponse, number]> {
    const req: GetEvaluationRequest = {
      tag,
      user,
      featureId,
      sourceId: SourceId.NODE_SERVER,
      sdkVersion: version,
    };
    const chunk = JSON.stringify(req);
    const url = scheme.concat(this.host, evaluationAPI);
    return new Promise((resolve, reject) => {
      this.postRequest(url, chunk)
        .then(([res, size]) => {
          try {
            const msg = JSON.parse(res) as GetEvaluationResponse;
            resolve([msg, size]);
          } catch (error) {
            reject(error);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  registerEvents(events: Array<Event>): Promise<[RegisterEventsResponse, number]> {
    const req: RegisterEventsRequest = {
      events,
      sdkVersion: version,
      sourceId: SourceId.NODE_SERVER,
    };
    const chunk = JSON.stringify(req);
    const url = scheme.concat(this.host, eventsAPI);
    return new Promise((resolve, reject) => {
      this.postRequest(url, chunk)
        .then(([res, size]) => {
          try {
            const msg = JSON.parse(res) as RegisterEventsResponse;
            resolve([msg, size]);
          } catch (error) {
            reject(error);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  private postRequest(url: string, chunk: string): Promise<[string, number]> {
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
          const header = res.headers['content-length'];
          resolve([rawData, Number(header || 0)]);
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