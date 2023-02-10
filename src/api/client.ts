import { UserAsPlainObject } from '../bootstrap';
import https from 'https';
import { Event } from '../newObjects/event';
import { SourceId } from '../newObjects/sourceId';
import { GetEvaluationRequest, RegisterEventsRequest } from '../newObjects/request';
import { GetEvaluationResponse, RegisterEventsResponse } from '../newObjects/response';

const scheme = 'https://';
const evaluationAPI = '/get_evaluation';
const eventsAPI = '/register_events';

export class Client {
  private readonly host: string;
  private readonly apiKey: string;

  constructor(host: string, apiKey: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  getEvaluation(
    tag: string,
    user: UserAsPlainObject,
    featureId: string,
  ): Promise<GetEvaluationResponse> {
    const req: GetEvaluationRequest = {
      tag,
      user,
      featureId,
      sourceId: SourceId.NODE_SERVER,
    };
    const chunk = JSON.stringify(req);
    const url = scheme.concat(this.host, evaluationAPI);
    return new Promise((resolve, reject) => {
      this.postRequest(url, chunk)
        .then((res) => {
          try {
            const msg = JSON.parse(res) as GetEvaluationResponse;
            resolve(msg);
          } catch (error) {
            reject(error);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  registerEvents(events: Array<Event>): Promise<RegisterEventsResponse> {
    const req: RegisterEventsRequest = {
      events,
    };
    const chunk = JSON.stringify(req);
    const url = scheme.concat(this.host, eventsAPI);
    return new Promise((resolve, reject) => {
      this.postRequest(url, chunk)
        .then((res) => {
          try {
            const msg = JSON.parse(res) as RegisterEventsResponse;
            resolve(msg);
          } catch (error) {
            reject(error);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  private postRequest(url: string, chunk: string): Promise<string> {
    const opts: https.RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.apiKey,
      },
    };
    return new Promise((resolve, reject) => {
      const clientReq = https.request(url, opts, (res) => {
        if (res.statusCode != 200) {
          reject(new Error(`bucketeer/api: send HTTP request failed: ${res.statusCode}`));
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk: Buffer) => {
          rawData += chunk.toString();
        });
        res.on('end', () => {
          try {
            resolve(rawData);
          } catch (error) {
            reject(error);
          }
        });
      });
      clientReq.on('error', (e) => {
        reject(e);
      });
      clientReq.write(chunk);
      clientReq.end();
    });
  }
}
