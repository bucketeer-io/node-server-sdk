import test from 'ava';
import sinon from 'sinon';
import https from 'https';
import { EventEmitter } from 'events';
import { APIClient } from '../api/client';

const host = 'api.example.com:443';
const apiKey = 'test-api-key';

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

function makeFakeClientReq() {
  return Object.assign(new EventEmitter(), {
    write: sinon.stub(),
    end: sinon.stub(),
    destroy: sinon.stub(),
  });
}

function makeFakeResponse(statusCode: number, headers: Record<string, string>) {
  return Object.assign(new EventEmitter(), {
    statusCode,
    headers,
    setEncoding: sinon.stub(),
  });
}

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
