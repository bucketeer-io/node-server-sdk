/**
 * Integration test: mid-response stall handling in APIClient.
 *
 * Proves that when a real HTTPS server sends a 200 response with partial body
 * and then stalls, the APIClient promise rejects instead of hanging forever.
 *
 * How the bug manifested (before the res.on('error') fix):
 *   1. Server sends HTTP 200 headers + partial JSON body, then stalls.
 *   2. Socket inactivity timer fires after REQUEST_TIMEOUT_MS (5000ms).
 *   3. clientReq.on('timeout') -> clientReq.destroy() is called.
 *   4. Once response headers are received, Node.js routes the resulting ECONNRESET
 *      to the *response* (IncomingMessage) stream, NOT back to clientReq.on('error').
 *   5. Without res.on('error'), the error was silently dropped: res.on('end') never
 *      fired, clientReq.on('error') never fired, and the promise hung forever.
 *      The deadline AbortSignal in opts.signal also could not rescue it — once
 *      destroy() runs on an already-destroyed socket, later abort signals are no-ops.
 *
 * This test currently PASSES because postRequest now wires res.on('error').
 * Removing that handler causes this test to reach STALL_BUDGET_MS and fail.
 *
 * Note: this test takes ~10s because it waits for the real socket inactivity
 * timeout (10000ms in src/api/client.ts) to fire.
 */
import anyTest, { TestFn } from 'ava';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { APIClient } from '../api/client';
import { User } from '../bootstrap';
import { SourceId } from '../objects/sourceId';

const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');

interface Ctx {
  stallPort: number;
}

const test = anyTest as TestFn<Ctx>;

test.before(async (t) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // Stall server: immediately sends HTTP 200 + a partial JSON body, then
  // never calls res.end(). The socket goes idle after the write, causing
  // the client's REQUEST_TIMEOUT_MS inactivity timer to fire.
  const stallServer = https.createServer(
    { key: fs.readFileSync(serverKey), cert: fs.readFileSync(serverCrt) },
    (_req: http.IncomingMessage, res: http.ServerResponse) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write('{"partial":'); // partial body — socket idles here
      // intentionally never calls res.end()
    },
  );
  await new Promise<void>((r) => stallServer.listen(0, '127.0.0.1', r));
  t.context.stallPort = (stallServer.address() as any).port;
  (t.context as any).stallServer = stallServer;
});

test.after.always((t) => {
  (t.context as any).stallServer?.close();
});

const user: User = { id: 'user-1', data: {} };

// Must exceed the socket inactivity timeout (src/api/client.ts: timeout option) by a safe margin.
// Current socket timeout: 10000ms → budget: 13000ms.
// If the socket timeout value changes, update this constant to stay ~3000ms above it.
const STALL_BUDGET_MS = 13000;

type StallOutcome =
  | { kind: 'resolved' }
  | { kind: 'rejected'; error: NodeJS.ErrnoException }
  | { kind: 'hung' };

async function raceStall(p: Promise<unknown>): Promise<StallOutcome> {
  return Promise.race([
    p.then(
      (): StallOutcome => ({ kind: 'resolved' }),
      (e: NodeJS.ErrnoException): StallOutcome => ({ kind: 'rejected', error: e }),
    ),
    new Promise<StallOutcome>((r) =>
      setTimeout(() => r({ kind: 'hung' }), STALL_BUDGET_MS),
    ),
  ]);
}

test('getEvaluation: server sends headers + partial body then stalls — rejects with ECONNRESET, not hangs', async (t) => {
  const client = new APIClient(
    `127.0.0.1:${t.context.stallPort}`,
    'test-api-key',
  );

  const outcome = await raceStall(
    client.getEvaluation('tag', user, 'feat-1', SourceId.NODE_SERVER, '1.0.0'),
  );

  // 'hung' means res.on('error') is missing: Node routed the socket-timeout
  // ECONNRESET to the response stream but nothing caught it, so the promise
  // never settled. See the file-level comment for the full failure chain.
  t.not(outcome.kind, 'hung', 'promise must settle; res.on("error") must be wired in postRequest');
  t.is(outcome.kind, 'rejected');
  if (outcome.kind === 'rejected') {
    t.is(outcome.error.code, 'ECONNRESET');
  }
});
