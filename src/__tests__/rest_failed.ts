import anyTest, { TestInterface } from 'ava';
import https from 'https';
import fs from 'fs';
import { Client } from '../rest/client';
import { UserAsPlainObject } from '../bootstrap';
import path from 'path';
import { v4 } from 'uuid';

const version = '/v1';
const service = '/gateway';
const evaluationAPI = '/evaluation';
const eventsAPI = '/events';
const apiKey = '';

const port = 9999;
const host = `localhost:${port}`;

const test = anyTest as TestInterface<{ server: https.Server }>;

const dummyEvalResponse = {
  data: {
    evaluation: {
      id: v4(),
      feature_id: 'feature_id',
      feature_version: '2',
      user_id: 'user_id',
      variation_id: v4(),
      variation: {
        id: v4(),
        value: 'value-1',
      },
      reason: {
        type: 3,
      },
      variation_value: 'value-1',
    },
  },
};

const dummpyRegisterEvtsResponse = {
  data: { errors: { key: { message: 'Invalid message type', retriable: false } } },
};

test.before((t) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const opts = {
    key: fs.readFileSync(path.join(__dirname, 'testdata/server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'testdata/server.crt')),
  };
  const eventsUrl = ''.concat(version, service, eventsAPI);
  const evalUrl = ''.concat(version, service, evaluationAPI);
  t.context = {
    server: https
      .createServer(opts, (req, res) => {
        switch (req.url) {
          case evalUrl:
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(dummyEvalResponse));
            break;
          case eventsUrl:
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

test('getEvaluation: validation failed', async (t) => {
  const client = new Client(host, apiKey);
  const user: UserAsPlainObject = {
    id: '',
    data: {
      '': '',
    },
  };
  let err = '';
  try {
    const res = await client.getEvaluation('', user, '');
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'featureVersion is invalid');
});
