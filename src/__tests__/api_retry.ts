import anyTest, { TestFn } from 'ava';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { APIClient } from '../api/client';
import { User } from '../bootstrap';
import { InvalidStatusError, TimeoutError, UnauthorizedError } from '../objects/errors';
import { RetryPolicy } from '../utils/promiseRetriable';
import { SourceId } from '../objects/sourceId';

const port = 9997;
const host = `localhost:${port}`;
const apiKey = '';
const defaultSourceId = SourceId.OPEN_FEATURE_NODE;
const sdkVersion = '1.0.0';
const user: User = { id: 'user-1', data: {} };

const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');

// Mutable handler — each serial test sets this before making requests.
let currentHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void = (_req, res) => {
  res.writeHead(500);
  res.end();
};

const dummyEvalResponse = {
  evaluation: {
    id: 'eval-id',
    featureId: 'feature-id',
    featureVersion: 1,
    userId: 'user-1',
    variationId: 'var-id',
    reason: { type: 'DEFAULT' },
    variationValue: 'value-1',
    variationName: 'name-1',
  },
};

const test = anyTest as TestFn<{ server: https.Server }>;

test.before((t) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const opts = {
    key: fs.readFileSync(serverKey),
    cert: fs.readFileSync(serverCrt),
  };
  t.context = {
    server: https
      .createServer(opts, (req, res) => currentHandler(req, res))
      .listen(port),
  };
});

test.after.always((t) => {
  t.context.server.close();
});

// Test 1: retry succeeds (503 -> 200) 

test.serial('getEvaluation: retries on 503 and succeeds on second attempt', async (t) => {
  let requestCount = 0;
  currentHandler = (_req, res) => {
    requestCount++;
    if (requestCount === 1) {
      res.writeHead(503);
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dummyEvalResponse));
    }
  };

  const retryPolicy: RetryPolicy = { maxRetries: 1, initialInterval: 10, maxInterval: 100 };
  const client = new APIClient(host, apiKey, retryPolicy);

  const [res] = await client.getEvaluation('tag', user, 'feature-id', defaultSourceId, sdkVersion);

  t.deepEqual(res.evaluation, dummyEvalResponse.evaluation);
  t.is(requestCount, 2);
});

// Test 2: non-retryable status is not retried 

test.serial('getEvaluation: 401 is not retried', async (t) => {
  let requestCount = 0;
  currentHandler = (_req, res) => {
    requestCount++;
    res.writeHead(401);
    res.end();
  };

  const retryPolicy: RetryPolicy = { maxRetries: 3, initialInterval: 10, maxInterval: 100 };
  const client = new APIClient(host, apiKey, retryPolicy);

  const error = await t.throwsAsync(() =>
    client.getEvaluation('tag', user, 'feature-id', defaultSourceId, sdkVersion),
  );

  t.true(error instanceof UnauthorizedError);
  t.is(requestCount, 1);
});

// Test 3: Retry-After:0 wiring (end-to-end) 

test.serial('getEvaluation: Retry-After:0 threads through to promiseRetriable (immediate retry)', async (t) => {
  let requestCount = 0;
  currentHandler = (_req, res) => {
    requestCount++;
    if (requestCount === 1) {
      // Retry-After: 0 -> retryAfterMs: 0 -> no extra delay, retry immediately
      res.writeHead(503, { 'Retry-After': '0' });
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dummyEvalResponse));
    }
  };

  const retryPolicy: RetryPolicy = { maxRetries: 1, initialInterval: 10_000, maxInterval: 60_000 };
  const client = new APIClient(host, apiKey, retryPolicy);

  const start = Date.now();
  const [res] = await client.getEvaluation('tag', user, 'feature-id', defaultSourceId, sdkVersion);
  const elapsed = Date.now() - start;

  t.deepEqual(res.evaluation, dummyEvalResponse.evaluation);
  t.is(requestCount, 2);
  // Retry-After:0 overrides the 10s initialInterval — should complete well under 1 second
  t.true(elapsed < 1000, `expected elapsed < 1000ms, got ${elapsed}ms`);
});

// Test 4: AbortSignal cancels mid-retry backoff 

test.serial('getEvaluation: AbortSignal cancels mid-retry backoff', async (t) => {
  let requestCount = 0;
  currentHandler = (_req, res) => {
    requestCount++;
    res.writeHead(503);
    res.end();
  };

  // Long backoff so the abort fires while we are sleeping, not before
  const retryPolicy: RetryPolicy = { maxRetries: 3, initialInterval: 60_000, maxInterval: 0 };
  const controller = new AbortController();
  const client = new APIClient(host, apiKey, retryPolicy);

  const resultPromise = client.getEvaluation(
    'tag',
    user,
    'feature-id',
    defaultSourceId,
    sdkVersion,
    controller.signal,
  );

  // Wait long enough for the first HTTP response to arrive and the backoff to start,
  // but short enough that the 60-second sleep has not elapsed.
  await new Promise((resolve) => setTimeout(resolve, 30));
  const abortReason = new Error('test aborted');
  controller.abort(abortReason);

  // Pass an explicit abort reason so the rejection message is predictable.
  await t.throwsAsync(() => resultPromise);
  // Only one HTTP request should have been made before abort cancelled the backoff
  t.is(requestCount, 1);
});

// Tests: API boundary normalises abort errors to TimeoutError

test.serial('getEvaluation: AbortSignal.timeout on hanging request throws TimeoutError', async (t) => {
  currentHandler = (_req, _res) => { /* hang — never respond */ };

  const client = new APIClient(host, apiKey, { maxRetries: 0, initialInterval: 0, maxInterval: 0 });
  const err = await t.throwsAsync(
    client.getEvaluation('tag', user, 'feature-id', defaultSourceId, sdkVersion, AbortSignal.timeout(50)),
  );
  t.true(err instanceof TimeoutError);
});

test.serial('getEvaluation: explicit AbortController.abort() on in-flight request throws TimeoutError', async (t) => {
  currentHandler = (_req, _res) => { /* hang — never respond */ };

  const controller = new AbortController();
  const client = new APIClient(host, apiKey, { maxRetries: 0, initialInterval: 0, maxInterval: 0 });

  const resultPromise = client.getEvaluation('tag', user, 'feature-id', defaultSourceId, sdkVersion, controller.signal);
  await new Promise((resolve) => setTimeout(resolve, 20));
  controller.abort();

  const err = await t.throwsAsync(() => resultPromise);
  t.true(err instanceof TimeoutError);
});
