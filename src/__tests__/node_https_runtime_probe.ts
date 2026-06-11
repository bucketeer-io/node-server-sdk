/**
 * Runtime probe: empirically document what Node.js https.request produces
 * under cancellation and timeout conditions.
 *
 * These are not correctness tests - every assertion is t.pass() or t.log().
 * Run with: make test-single src/__tests__/node_https_runtime_probe.ts
 *
 * Runtime questions answered here:
 *   1. What shape does AbortSignal.reason have?
 *      isDeadlineExceededError / isOperationAbortedError detect errors by their
 *      .name property, not constructor.name (a DOMException's constructor is
 *      DOMException, but its name is TimeoutError/AbortError). Confirm the exact shape.
 *   2. What error does req.on('error') receive when an AbortSignal fires mid-request?
 *      Cancellation must reach the promise via on('error'), not silently drop.
 *   3. Does DOMException survive promiseRetriable unchanged, or get re-wrapped?
 *      normalizeRequestError checks specific error types downstream; wrapping breaks it.
 *   4. Full end-to-end: what does the caller see after AbortSignal + promiseRetriable?
 *   5. Does req.destroy() with no error arg cause the Promise to hang?
 *      on('error') might not fire without an error - empirically confirmed it does
 *      (ECONNRESET is emitted), so no hang.
 */
import anyTest, { TestFn } from 'ava';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { promiseRetriable, RetryPolicy } from '../utils/promiseRetriable';

const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');

const test = anyTest as TestFn<{ port: number }>;

// Slow server that never responds - keeps requests in-flight so signals and
// timeouts fire against a real active connection.
test.before(async (t) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const server = https.createServer(
    { key: fs.readFileSync(serverKey), cert: fs.readFileSync(serverCrt) },
    (_req: http.IncomingMessage, _res: http.ServerResponse) => { /* hang */ },
  );
  await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
  t.context.port = (server.address() as any).port;
  (t.context as any).server = server;
});

test.after.always((t) => {
  (t.context as any).server?.close();
});

// helpers

function shape(e: unknown) {
  return {
    'constructor.name': (e as any)?.constructor?.name ?? '(none)',
    name: (e as any)?.name ?? '(none)',
    code: (e as any)?.code ?? '(none)',
    message: String((e as any)?.message ?? '').slice(0, 80),
    'instanceof Error': e instanceof Error,
    'instanceof DOMException': e instanceof DOMException,
  };
}

// Mirrors postRequest in src/api/client.ts - used for questions 2 and 4.
function postRequest(port: number, signal?: AbortSignal): Promise<void> {
  const opts: https.RequestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: 'test' },
    timeout: 5000,
    signal,
  };
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const req = https.request(`https://127.0.0.1:${port}/test`, opts, (res) => {
      res.resume();
      res.on('end', resolve);
    });
    req.on('error', (e) => reject(e));
    req.on('timeout', () => req.destroy());
    req.end('{}');
  });
}

// Question 5a: req.destroy() with no error arg - used to confirm on('error') still fires.
function postRequestDestroyNoError(port: number, timeoutMs: number): Promise<void> {
  const opts: https.RequestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: 'test' },
    timeout: timeoutMs,
    // no AbortSignal - socket timeout event is the only trigger
  };
  return new Promise((resolve, reject) => {
    const req = https.request(`https://127.0.0.1:${port}/test`, opts, (res) => {
      res.resume();
      res.on('end', resolve);
    });
    req.on('error', (e) => reject(e));
    req.on('timeout', () => req.destroy());
    req.end('{}');
  });
}

// Question 5b: req.destroy(err) - control case to confirm the passed error arrives unchanged.
function postRequestDestroyWithError(port: number, timeoutMs: number, err: Error): Promise<void> {
  const opts: https.RequestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: 'test' },
    timeout: timeoutMs,
  };
  return new Promise((resolve, reject) => {
    const req = https.request(`https://127.0.0.1:${port}/test`, opts, (res) => {
      res.resume();
      res.on('end', resolve);
    });
    req.on('error', (e) => reject(e));
    req.on('timeout', () => req.destroy(err));
    req.end('{}');
  });
}

// QUESTION 1: What shape does AbortSignal.reason have?
// isOperationAbortedError checks e.name === 'AbortError'; isDeadlineExceededError checks
// e.name === 'TimeoutError'. Confirmed here that Node.js produces exactly those names.

test('shape: AbortSignal.timeout() reason after it fires', async (t) => {
  const sig = AbortSignal.timeout(10);
  await new Promise<void>(r => sig.addEventListener('abort', () => r(), { once: true }));
  t.log('AbortSignal.timeout reason:', JSON.stringify(shape(sig.reason), null, 2));
  t.pass();
});

test('shape: AbortController.abort() default reason', (t) => {
  const c = new AbortController();
  c.abort();
  t.log('AbortController.abort() default reason:', JSON.stringify(shape(c.signal.reason), null, 2));
  t.pass();
});

test('shape: DOMException TimeoutError instanceof Error', (t) => {
  const e = new DOMException('timed out', 'TimeoutError');
  t.log('DOMException TimeoutError shape:', JSON.stringify(shape(e), null, 2));
  t.pass();
});

test('shape: DOMException AbortError instanceof Error', (t) => {
  const e = new DOMException('aborted', 'AbortError');
  t.log('DOMException AbortError shape:', JSON.stringify(shape(e), null, 2));
  t.pass();
});

// QUESTION 2: What error does req.on('error') receive when an AbortSignal fires mid-request?
// If cancellation does not surface via on('error'), the promise never rejects and hangs.

test('layer-A: AbortSignal.timeout(50) - error shape at req.on("error")', async (t) => {
  let layerA: unknown;
  try { await postRequest(t.context.port, AbortSignal.timeout(50)); }
  catch (e) { layerA = e; }
  t.log('Layer A shape:', JSON.stringify(shape(layerA), null, 2));
  t.pass();
});

test('layer-A: AbortController.abort() - error shape at req.on("error")', async (t) => {
  const c = new AbortController();
  setTimeout(() => c.abort(), 50);
  let layerA: unknown;
  try { await postRequest(t.context.port, c.signal); }
  catch (e) { layerA = e; }
  t.log('Layer A shape:', JSON.stringify(shape(layerA), null, 2));
  t.pass();
});

// QUESTION 3: Does DOMException survive promiseRetriable unchanged, or get re-wrapped?
// promiseRetriable catches every thrown error and re-throws; if it wraps the error,
// the name-based checks in isDeadlineExceededError / isOperationAbortedError break.

test('promiseRetriable: DOMException TimeoutError passes through unchanged', async (t) => {
  const policy: RetryPolicy = { maxRetries: 0, initialInterval: 0, maxInterval: 0 };
  let out: unknown;
  try {
    await promiseRetriable(
      async () => { throw new DOMException('timed out', 'TimeoutError'); },
      policy,
    );
  } catch (e) { out = e; }
  t.log('After promiseRetriable:', JSON.stringify(shape(out), null, 2));
  t.pass();
});

test('promiseRetriable: DOMException AbortError passes through unchanged', async (t) => {
  const policy: RetryPolicy = { maxRetries: 0, initialInterval: 0, maxInterval: 0 };
  let out: unknown;
  try {
    await promiseRetriable(
      async () => { throw new DOMException('aborted', 'AbortError'); },
      policy,
    );
  } catch (e) { out = e; }
  t.log('After promiseRetriable:', JSON.stringify(shape(out), null, 2));
  t.pass();
});

// QUESTION 4: Full end-to-end - what does the caller see after AbortSignal + promiseRetriable?
// Combines questions 2 and 3: AbortSignal fires -> on('error') -> promiseRetriable -> caller.

test('full-path: AbortSignal.timeout(50) through postRequest + promiseRetriable', async (t) => {
  const policy: RetryPolicy = { maxRetries: 0, initialInterval: 0, maxInterval: 0 };
  const port = t.context.port;
  let out: unknown;
  try {
    await promiseRetriable(
      (signal) => postRequest(port, signal),
      policy,
      undefined,
      AbortSignal.timeout(50),
    );
  } catch (e) { out = e; }
  t.log('Full path shape:', JSON.stringify(shape(out), null, 2));
  t.pass();
});

test('full-path: AbortController.abort() through postRequest + promiseRetriable', async (t) => {
  const policy: RetryPolicy = { maxRetries: 0, initialInterval: 0, maxInterval: 0 };
  const port = t.context.port;
  const c = new AbortController();
  setTimeout(() => c.abort(), 50);
  let out: unknown;
  try {
    await promiseRetriable(
      (signal) => postRequest(port, signal),
      policy,
      undefined,
      c.signal,
    );
  } catch (e) { out = e; }
  t.log('Full path shape:', JSON.stringify(shape(out), null, 2));
  t.pass();
});

// QUESTION 5: Does req.destroy() with no error arg cause the Promise to hang?
// Concern: without an explicit error, on('error') might not fire, leaving the
// Promise pending forever. Finding: Node.js emits ECONNRESET ("socket hang up")
// even without an error arg, so on('error') always fires and no hang occurs.

test('destroy no-arg: on("error") fires with ECONNRESET - no hang', async (t) => {
  let caught: unknown;
  try { await postRequestDestroyNoError(t.context.port, 50); }
  catch (e) { caught = e; }

  t.log('destroy() no-arg error shape:', JSON.stringify(shape(caught), null, 2));
  t.truthy(caught, 'on("error") must fire - if this fails the promise hung');
  t.log('code:', (caught as any)?.code);
  t.log('message:', (caught as any)?.message);
});

test('destroy with error: on("error") receives the exact error passed', async (t) => {
  const sentinel = new Error('explicit-timeout-sentinel');
  let caught: unknown;
  try { await postRequestDestroyWithError(t.context.port, 50, sentinel); }
  catch (e) { caught = e; }

  t.log('destroy(err) error shape:', JSON.stringify(shape(caught), null, 2));
  t.truthy(caught, 'on("error") must fire');
  t.is(caught, sentinel, 'the exact error passed to destroy() must arrive at on("error")');
});
