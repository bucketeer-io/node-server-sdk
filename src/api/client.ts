import { User } from '../bootstrap';
import https from 'https';
import { Event } from '../objects/event';
import { SourceId } from '../objects/sourceId';
import { GetEvaluationRequest, RegisterEventsRequest } from '../objects/request';
import { GetEvaluationResponse, RegisterEventsResponse } from '../objects/response';

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
    user: User,
    featureId: string,
  ): Promise<[GetEvaluationResponse, number]> {
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
          let header = res.headers['content-length'];
          if (header === undefined) {
            header = '0';
          }
          resolve([rawData, Number(header)]);
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

export class InvalidStatusError extends Error {
  readonly code: number | undefined;
  constructor(message: string, code: number | undefined) {
    super(message);
    this.code = code;
  }
}
