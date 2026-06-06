import test from 'ava';
import sinon from 'sinon';
import https from 'https';
import { EventEmitter } from 'events';
import { APIClient } from '../api/client';
import { User } from '../bootstrap';
import { InvalidStatusError } from '../objects/errors';
import { isRetryable, RetryPolicy } from '../utils/promiseRetriable';
import { SourceId } from '../objects/sourceId';

const host = 'api.example.com:443';
const apiKey = 'test-api-key';
const defaultSourceId = SourceId.OPEN_FEATURE_NODE;
const sdkVersion = '1.0.0';
const user: User = { id: 'user-1', data: {} };

const retryPolicy: RetryPolicy = { maxRetries: 2, initialInterval: 100, maxInterval: 500 };

const mockEvalResponse = {
  evaluation: {
    id: 'eval-id',
    featureId: 'feat-1',
    featureVersion: 1,
    userId: 'user-1',
    variationId: 'var-1',
    reason: { type: 'DEFAULT' },
    variationValue: 'v',
    variationName: 'n',
  },
};

function makeFakeResponse(statusCode: number, headers: Record<string, string>) {
  return Object.assign(new EventEmitter(), {
    statusCode,
    headers,
    setEncoding: sinon.stub(),
  });
}

function makeFakeClientReq() {
  return Object.assign(new EventEmitter(), {
    write: sinon.stub(),
    end: sinon.stub(),
    destroy: sinon.stub(),
  });
}

// Group 1: mid-response stall handling
//
// Empirically verified Node.js behavior
// confirmed on Node v18.18.2 and v20.19.0):
//
// When the server sends HTTP 200 headers + a partial body and then stalls,
// the socket inactivity timer fires:
//   clientReq.on('timeout') -> clientReq.destroy()
//
// Once response headers have been received, Node.js routes the resulting
// ECONNRESET to the *response* (IncomingMessage) stream via res.on('error'),
// NOT back to clientReq.on('error'). Additionally, the deadline AbortSignal
// set in opts.signal does NOT rescue the promise: once destroy() has run,
// a later signal abort is a no-op on the already-destroyed socket.
//
// Root cause: postRequest has no res.on('error') handler.
// The ECONNRESET is silently dropped, res.on('end') never fires, and the
// promise hangs forever — ignoring both the socket timeout and the deadline.


const HANG_DETECT_MS = 300;

test.serial('postRequest: socket timeout fires mid-response - promise must reject not hang', async (t) => {
  const fakeResponse = makeFakeResponse(200, {});

  const fakeReq = Object.assign(new EventEmitter(), {
    write: sinon.stub(),
    end: sinon.stub(),
    // Simulate Node.js behavior: once response headers have been received,
    // clientReq.destroy() routes the error to the response stream (IncomingMessage),
    // not back to clientReq. The try/catch mirrors the real stream behavior where
    // an unhandled res 'error' event is silently dropped (not thrown) — causing
    // the promise to hang rather than crash when no res.on('error') is registered.
    destroy: sinon.stub().callsFake(() => {
      try {
        fakeResponse.emit(
          'error',
          Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' }),
        );
      } catch (_) {
        // Plain EventEmitter throws on unhandled 'error' events; swallow here
        // to match Node.js IncomingMessage stream behavior where the error is
        // silently dropped when no res.on('error') handler is registered.
      }
    }),
  });

  const httpsRequestStub = sinon.stub(https, 'request').callsFake(
    (_url: any, _opts: any, callback: any) => {
      // Fire the response callback synchronously so res.on('data'/'end'/'error')
      // listeners are registered before the timeout sequence below.
      callback(fakeResponse);
      // Defer the timeout event until after https.request returns: the Promise
      // constructor registers clientReq.on('timeout') only after this call
      // returns, so emitting synchronously here would miss that listener.
      setImmediate(() => {
        fakeResponse.emit('data', '{"partial":');
        fakeReq.emit('timeout'); // -> clientReq.destroy() -> res.emit('error', ECONNRESET)
      });
      return fakeReq as any;
    },
  );
  t.teardown(() => httpsRequestStub.restore());

  const client = new APIClient(host, apiKey);
  const requestPromise: Promise<unknown> = (client as any).postRequest(
    `https://${host}/get_evaluation`,
    '{}',
  );

  type Outcome = 'resolved' | 'rejected' | 'hung';
  const outcome: Outcome = await Promise.race([
    requestPromise.then(() => 'resolved' as const, () => 'rejected' as const),
    new Promise<'hung'>((r) => setTimeout(() => r('hung'), HANG_DETECT_MS)),
  ]);

  // Regression guard: removing res.on('error') from postRequest causes the ECONNRESET
  // to be silently dropped and the promise to hang — outcome becomes 'hung'.
  // See api_client_stall.ts for end-to-end proof with a real HTTPS server.
  t.is(
    outcome,
    'rejected',
    'postRequest hung instead of rejecting: res.on("error") must be wired inside the response callback',
  );
});

// Group 2: promiseRetriable wiring

test('postRequestWithRetry: passes retryPolicy to promiseRetriable', async (t) => {
  const promiseRetriableSpy = sinon.stub().resolves([mockEvalResponse, 0]);
  const client = new APIClient(host, apiKey, retryPolicy, promiseRetriableSpy);

  await client.getEvaluation('tag', user, 'feat-1', defaultSourceId, sdkVersion);

  const [, receivedRetryPolicy] = promiseRetriableSpy.firstCall.args;
  t.true(promiseRetriableSpy.calledOnce);
  t.deepEqual(receivedRetryPolicy, retryPolicy);
});

test('postRequestWithRetry: passes isRetryable as the shouldRetry predicate', async (t) => {
  const promiseRetriableSpy = sinon.stub().resolves([mockEvalResponse, 0]);
  const client = new APIClient(host, apiKey, retryPolicy, promiseRetriableSpy);

  await client.getEvaluation('tag', user, 'feat-1', defaultSourceId, sdkVersion);

  const [, , receivedShouldRetry] = promiseRetriableSpy.firstCall.args;
  t.is(receivedShouldRetry, isRetryable);
});

test('postRequestWithRetry: forwards the AbortSignal to promiseRetriable', async (t) => {
  const promiseRetriableSpy = sinon.stub().resolves([mockEvalResponse, 0]);
  const client = new APIClient(host, apiKey, retryPolicy, promiseRetriableSpy);
  const controller = new AbortController();

  await client.getEvaluation('tag', user, 'feat-1', defaultSourceId, sdkVersion, controller.signal);

  const [, , , receivedSignal] = promiseRetriableSpy.firstCall.args;
  t.is(receivedSignal, controller.signal);
});

// Group 3: postRequest URL and body wiring
//
// Each test uses a passthrough promiseRetriable that immediately invokes fn so that
// postRequest is actually called, letting us assert the URL and body it received.

function makePassthroughRetriable(): sinon.SinonStub {
  return sinon.stub().callsFake((fn: (s: AbortSignal | undefined) => Promise<unknown>) => fn(undefined));
}

test('getEvaluation: builds correct URL and request body', async (t) => {
  const sandbox = sinon.createSandbox();
  t.teardown(() => sandbox.restore());

  const client = new APIClient(host, apiKey, retryPolicy, makePassthroughRetriable());
  const postRequestSpy = sandbox.stub(client as any, 'postRequest').resolves([mockEvalResponse, 0]);

  await client.getEvaluation('my-tag', user, 'feat-1', defaultSourceId, sdkVersion);

  const [receivedUrl, receivedBody] = postRequestSpy.firstCall.args;
  t.true(postRequestSpy.calledOnce);
  t.is(receivedUrl, `https://${host}/get_evaluation`);
  t.is(receivedBody, JSON.stringify({ tag: 'my-tag', user, featureId: 'feat-1', sourceId: defaultSourceId, sdkVersion }));
});

test('registerEvents: builds correct URL and request body', async (t) => {
  const sandbox = sinon.createSandbox();
  t.teardown(() => sandbox.restore());

  const client = new APIClient(host, apiKey, retryPolicy, makePassthroughRetriable());
  const postRequestSpy = sandbox.stub(client as any, 'postRequest').resolves([{}, 0]);

  const events = [] as any[];
  await client.registerEvents(events, defaultSourceId, sdkVersion);

  const [receivedUrl, receivedBody] = postRequestSpy.firstCall.args;
  t.true(postRequestSpy.calledOnce);
  t.is(receivedUrl, `https://${host}/register_events`);
  t.is(receivedBody, JSON.stringify({ events, sdkVersion, sourceId: defaultSourceId }));
});

test('getFeatureFlags: builds correct URL and request body', async (t) => {
  const sandbox = sinon.createSandbox();
  t.teardown(() => sandbox.restore());

  const client = new APIClient(host, apiKey, retryPolicy, makePassthroughRetriable());
  const postRequestSpy = sandbox.stub(client as any, 'postRequest').resolves([{}, 0]);

  await client.getFeatureFlags('my-tag', 'flags-id-1', 12345, defaultSourceId, sdkVersion);

  const [receivedUrl, receivedBody] = postRequestSpy.firstCall.args;
  t.true(postRequestSpy.calledOnce);
  t.is(receivedUrl, `https://${host}/get_feature_flags`);
  t.is(receivedBody, JSON.stringify({ tag: 'my-tag', featureFlagsId: 'flags-id-1', requestedAt: 12345, sourceId: defaultSourceId, sdkVersion }));
});

test('getSegmentUsers: builds correct URL and request body', async (t) => {
  const sandbox = sinon.createSandbox();
  t.teardown(() => sandbox.restore());

  const client = new APIClient(host, apiKey, retryPolicy, makePassthroughRetriable());
  const postRequestSpy = sandbox.stub(client as any, 'postRequest').resolves([{}, 0]);

  await client.getSegmentUsers(['seg-1', 'seg-2'], 99999, defaultSourceId, sdkVersion);

  const [receivedUrl, receivedBody] = postRequestSpy.firstCall.args;
  t.true(postRequestSpy.calledOnce);
  t.is(receivedUrl, `https://${host}/get_segment_users`);
  t.is(receivedBody, JSON.stringify({ segmentIds: ['seg-1', 'seg-2'], requestedAt: 99999, sourceId: defaultSourceId, sdkVersion }));
});

test('postRequestWithRetry: fn forwards signal from promiseRetriable to postRequest', async (t) => {
  const sandbox = sinon.createSandbox();
  t.teardown(() => sandbox.restore());

  const innerSignal = AbortSignal.timeout(9999);
  const passthroughRetriable = sinon.stub().callsFake(
    (fn: (s: AbortSignal | undefined) => Promise<unknown>) => fn(innerSignal),
  );
  const client = new APIClient(host, apiKey, retryPolicy, passthroughRetriable);
  const postRequestSpy = sandbox.stub(client as any, 'postRequest').resolves([mockEvalResponse, 0]);

  await client.getEvaluation('tag', user, 'feat-1', defaultSourceId, sdkVersion);

  const [, , receivedSignal] = postRequestSpy.firstCall.args;
  t.is(receivedSignal, innerSignal);
});

// Group 4: Retry-After header capture in postRequest

test.serial('postRequest: Retry-After delta-seconds header is captured as retryAfterMs', async (t) => {
  const fakeResponse = makeFakeResponse(503, { 'retry-after': '60' });
  const httpsRequestStub = sinon.stub(https, 'request').callsFake((_url, _opts, callback: any) => {
    callback(fakeResponse);
    fakeResponse.emit('end');
    return makeFakeClientReq() as any;
  });
  t.teardown(() => httpsRequestStub.restore());

  const client = new APIClient(host, apiKey);
  const error = await t.throwsAsync<InvalidStatusError>(() =>
    (client as any).postRequest(`https://${host}/get_evaluation`, '{}'),
  );

  t.true(error instanceof InvalidStatusError);
  t.is(error.retryAfterMs, 60_000);
});

test.serial('postRequest: absent Retry-After header leaves retryAfterMs undefined', async (t) => {
  const fakeResponse = makeFakeResponse(503, {});
  const httpsRequestStub = sinon.stub(https, 'request').callsFake((_url, _opts, callback: any) => {
    callback(fakeResponse);
    fakeResponse.emit('end');
    return makeFakeClientReq() as any;
  });
  t.teardown(() => httpsRequestStub.restore());

  const client = new APIClient(host, apiKey);
  const error = await t.throwsAsync<InvalidStatusError>(() =>
    (client as any).postRequest(`https://${host}/get_evaluation`, '{}'),
  );

  t.true(error instanceof InvalidStatusError);
  t.is(error.retryAfterMs, undefined);
});

test.serial('postRequest: Retry-After: 0 is captured as retryAfterMs === 0', async (t) => {
  const fakeResponse = makeFakeResponse(429, { 'retry-after': '0' });
  const httpsRequestStub = sinon.stub(https, 'request').callsFake((_url, _opts, callback: any) => {
    callback(fakeResponse);
    fakeResponse.emit('end');
    return makeFakeClientReq() as any;
  });
  t.teardown(() => httpsRequestStub.restore());

  const client = new APIClient(host, apiKey);
  const error = await t.throwsAsync<InvalidStatusError>(() =>
    (client as any).postRequest(`https://${host}/get_evaluation`, '{}'),
  );

  t.true(error instanceof InvalidStatusError);
  t.is(error.retryAfterMs, 0);
});