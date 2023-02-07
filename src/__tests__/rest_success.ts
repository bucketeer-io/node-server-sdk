import anyTest, { TestInterface } from 'ava';
import https from 'https';
import fs from 'fs';
import { Client } from '../api/client';
import { UserAsPlainObject } from '../bootstrap';
import path from 'path';
import { v4 } from 'uuid';
import { GetEvaluationResponse, RegisterEventsResponse } from '../api/type';

const evaluationAPI = '/get_evaluation';
const eventsAPI = '/register_events';
const apiKey = '';

const port = 9990;
const host = `localhost:${port}`;

const test = anyTest as TestInterface<{ server: https.Server }>;
const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');

const dummyEvalResponse: GetEvaluationResponse = {
  evaluation: {
    id: v4(),
    featureId: 'feature_id',
    featureVersion: 2,
    userId: 'user_id',
    variationId: v4(),
    reason: {
      type: 3,
    },
    variationValue: 'value-1',
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
      })
      .listen(port),
  };
});

test.after.always((t) => {
  t.context.server.close();
});

test('getEvaluation: success', async (t) => {
  const client = new Client(host, apiKey);
  const user: UserAsPlainObject = {
    id: '',
    data: {
      '': '',
    },
  };
  const res = await client.getEvaluation('', user, '');
  t.deepEqual(res.evaluation, dummyEvalResponse.evaluation);
});

test('registerEvents', async (t) => {
  const client = new Client(host, apiKey);
  const res = await client.registerEvents([]);
  t.is(res.errors.key.message, dummpyRegisterEvtsResponse.errors.key.message);
  t.is(res.errors.key.retriable, dummpyRegisterEvtsResponse.errors.key.retriable);
});
