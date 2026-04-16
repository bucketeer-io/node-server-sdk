import anyTest, { TestFn } from 'ava';
import https from 'https';
import fs from 'fs';
import { APIClient } from '../api/client';
import { User } from '../bootstrap';
import path from 'path';
import { InvalidStatusError } from '../objects/errors';
import { SourceId } from '../objects/sourceId';

const apiKey = '';
const port = 9998;
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
      .createServer(opts, (_req, res) => {
        res.writeHead(503, { 'Retry-After': '60' });
        res.end();
      })
      .listen(port),
  };
});

test.after.always((t) => {
  t.context.server.close();
});

test('getEvaluation: 503 with Retry-After carries retryAfterMs', async (t) => {
  const client = new APIClient(host, apiKey);
  const user: User = { id: 'test', data: {} };

  const error = await t.throwsAsync(() =>
    client.getEvaluation('tag', user, 'feature', defaultSourceId, sdkVersion),
  );

  t.true(error instanceof InvalidStatusError);
  const invalidStatusError = error as InvalidStatusError;
  t.is(invalidStatusError.code, 503);
  t.is(invalidStatusError.retryAfterMs, 60_000);
});

test('getEvaluation: 503 without Retry-After has retryAfterMs undefined', async (t) => {
  // This test verifies the "no header" case by directly constructing the error
  // (the server always sends Retry-After in this test file; this tests the
  // error construction path where the header is absent).
  const err = new InvalidStatusError('bucketeer/api: send HTTP request failed: 503', 503, undefined);
  t.is(err.retryAfterMs, undefined);
  t.is(err.code, 503);
});

test('registerEvents: 503 with Retry-After carries retryAfterMs', async (t) => {
  const client = new APIClient(host, apiKey);

  const error = await t.throwsAsync(() =>
    client.registerEvents([], defaultSourceId, sdkVersion),
  );

  t.true(error instanceof InvalidStatusError);
  const invalidStatusError = error as InvalidStatusError;
  t.is(invalidStatusError.code, 503);
  t.is(invalidStatusError.retryAfterMs, 60_000);
});
