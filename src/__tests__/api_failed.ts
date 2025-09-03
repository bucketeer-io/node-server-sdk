import anyTest, { TestFn } from 'ava';
import https from 'https';
import fs from 'fs';
import { APIClient } from '../api/client';
import { User } from '../bootstrap';
import path from 'path';
import { InvalidStatusError } from '../objects/errors';
import { SourceId } from '../objects/sourceId';

const apiKey = '';

const port = 9999;
const host = `localhost:${port}`;

const test = anyTest as TestFn<{ server: https.Server }>;
const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');
const defaultSourceId = SourceId.OPEN_FEATURE_NODE;
const sdkVersion = '1.2.10';

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
          default:
            res.writeHead(500);
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

test('getEvaluation: 500', async (t) => {
  const client = new APIClient(host, apiKey);
  const user: User = {
    id: '',
    data: {
      '': '',
    },
  };
  let err = '';
  let code: number | undefined;
  try {
    await client.getEvaluation('', user, '', defaultSourceId, sdkVersion);
  } catch (error) {
    t.true(error instanceof InvalidStatusError);
    const invalidStatusError = error as InvalidStatusError;
    err = invalidStatusError.message;
    code = invalidStatusError.code;
  }

  t.is(err, 'bucketeer/api: send HTTP request failed: 500');
  t.is(code, 500);
});

test('registerEvents: 500', async (t) => {
  const client = new APIClient(host, apiKey);
  let err = '';
  try {
    await client.registerEvents([], defaultSourceId, sdkVersion);
  } catch (error) {
    t.true(error instanceof InvalidStatusError);
    const invalidStatusError = error as InvalidStatusError;
    err = invalidStatusError.message;
  }
  t.is(err, 'bucketeer/api: send HTTP request failed: 500');
});
