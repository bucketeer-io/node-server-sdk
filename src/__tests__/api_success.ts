import anyTest, { TestFn } from 'ava';
import https from 'https';
import fs from 'fs';
import { APIClient } from '../api/client';
import { User } from '../bootstrap';
import path from 'path';
import { v4 } from 'uuid';
import { GetEvaluationResponse, RegisterEventsResponse } from '../objects/response';
import { BaseRequest } from '../objects/request';
import { SourceId } from '../objects/sourceId';

const evaluationAPI = '/get_evaluation';
const eventsAPI = '/register_events';
const apiKey = '';

const port = 9990;
const host = `localhost:${port}`;

const test = anyTest as TestFn<{ server: https.Server }>;
const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');
const defaultSourceId = SourceId.OPEN_FEATURE_NODE;
const sdkVersion = '3.0.1-test';

const dummyEvalResponse: GetEvaluationResponse = {
  evaluation: {
    id: v4(),
    featureId: 'feature_id',
    featureVersion: 2,
    userId: 'user_id',
    variationId: v4(),
    reason: {
      type: 'DEFAULT',
    },
    variationValue: 'value-1',
    variationName: 'name',
  },
};

const dummpyRegisterEvtsResponse: RegisterEventsResponse = {
  errors: { key: { message: 'Invalid message type', retriable: false } },
};

test.before((t) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const opts = {
    key: fs.readFileSync(serverKey),
    cert: fs.readFileSync(serverCrt),
  };
  t.context = {
    server: https
      .createServer(opts, (req, res) => {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            let jsonBody = JSON.parse(body) as BaseRequest;
            // Verify the request needs to include `sdkVersion` and `sourceId`
            t.is(jsonBody.sdkVersion, sdkVersion);
            t.is(jsonBody.sourceId, defaultSourceId);
          } catch (error) {
            t.fail('Invalid JSON or data structure');
          }
          switch (req.url) {
            case evaluationAPI:
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(dummyEvalResponse));
              break;
            case eventsAPI:
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(dummpyRegisterEvtsResponse));
              break;
            default:
              res.writeHead(400);
              res.end();
              break;
          }
        });
      })
      .listen(port),
  };
});

test.after.always((t) => {
  t.context.server.close();
});

test('getEvaluation: success', async (t) => {
  const client = new APIClient(host, apiKey);
  const user: User = {
    id: '',
    data: {
      '': '',
    },
  };
  const [res] = await client.getEvaluation('', user, '', defaultSourceId, sdkVersion);
  t.deepEqual(res.evaluation, dummyEvalResponse.evaluation);
});

test('registerEvents', async (t) => {
  const client = new APIClient(host, apiKey);
  const [res] = await client.registerEvents([], defaultSourceId, sdkVersion);
  t.is(res.errors.key.message, dummpyRegisterEvtsResponse.errors.key.message);
  t.is(res.errors.key.retriable, dummpyRegisterEvtsResponse.errors.key.retriable);
});
