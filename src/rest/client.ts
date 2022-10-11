import { UserAsPlainObject } from '../bootstrap';
import https from 'https';
import {
  Event,
  GetEvaluationRequest,
  GetEvaluationResponse,
  RegisterEventsRequest,
  RegisterEventsResponse,
  SourceId,
} from './type';

const scheme = 'https://';
const version = '/v1';
const service = '/gateway';
const evaluationAPI = '/evaluation';
const eventsAPI = '/events';

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
    const req = new GetEvaluationRequest();
    req.tag = tag;
    req.user = user;
    req.featureId = featureId;
    req.sourceId = SourceId.NODE_SERVER;
    const chunk = JSON.stringify(req);
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.apiKey,
      },
    };
    const url = scheme.concat(this.host, version, service, evaluationAPI);
    return new Promise((resolve, reject) => {
      this.sendRequest(url, chunk, opts)
        .then((res) => {
          try {
            const ger = GetEvaluationResponse.fromJSON(res);
            this.validateGetEvaluation(ger);
            resolve(ger);
          } catch (error) {
            reject(error);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  private toString = Object.prototype.toString;

  private validateGetEvaluation(res: GetEvaluationResponse) {
    if (res.evaluation == undefined) return;

    if (this.IsInvalid(res.evaluation.id, '[object String]')) this.throwValidationError('id');
    if (this.IsInvalid(res.evaluation.featureId, '[object String]'))
      this.throwValidationError('featureId');
    if (this.IsInvalid(res.evaluation.featureVersion, '[object Number]'))
      this.throwValidationError('featureVersion');
    if (this.IsInvalid(res.evaluation.userId, '[object String]'))
      this.throwValidationError('userId');
    if (res.evaluation.reason) {
      if (this.IsInvalid(res.evaluation.reason.type, '[object Number]'))
        this.throwValidationError('reason type');
      if (res.evaluation.reason.ruleId) {
        if (this.IsInvalid(res.evaluation.reason.ruleId, '[object String]'))
          this.throwValidationError('reason ruleId');
      }
    }
    if (this.IsInvalid(res.evaluation.variationId, '[object String]', false))
      this.throwValidationError('variationId');
    if (this.IsInvalid(res.evaluation.variationValue, '[object String]'))
      this.throwValidationError('variationValue');
  }

  private throwValidationError(field: string) {
    throw new Error(`${field} is invalid`);
  }

  private IsInvalid(value: any, expectedType: string, required = true): boolean {
    if (required) {
      return value === undefined || this.toString.call(value) !== expectedType;
    }
    return this.toString.call(value) !== expectedType;
  }

  registerEvents(events: Array<Event>): Promise<RegisterEventsResponse> {
    const req = new RegisterEventsRequest();
    req.events = events;
    const chunk = JSON.stringify(req);
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: this.apiKey,
      },
    };
    const url = scheme.concat(this.host, version, service, eventsAPI);
    return new Promise((resolve, reject) => {
      this.sendRequest(url, chunk, opts)
        .then((res) => {
          try {
            const rer = RegisterEventsResponse.fromJSON(res);
            this.validateRegisterEvents(rer);
            resolve(rer);
          } catch (error) {
            reject(error);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  private validateRegisterEvents(res: RegisterEventsResponse) {
    if (this.IsInvalid(res.errors, '[object Object]')) this.throwValidationError('errors');

    for (const [eventId, err] of Object.entries(res.errors)) {
      if (this.IsInvalid(eventId, '[object String]')) this.throwValidationError('eventId');
      if (this.IsInvalid(err.message, '[object String]'))
        this.throwValidationError('error message');
      if (this.IsInvalid(err.retriable, '[object Boolean]'))
        this.throwValidationError('error retriable');
    }
  }

  private sendRequest(url: string, chunk: string, opts: https.RequestOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const clientReq = https.request(url, opts, (res) => {
        if (res.statusCode != 200) {
          reject(new Error(`bucketeer/api: send HTTP request failed: ${res.statusCode}`));
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
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
