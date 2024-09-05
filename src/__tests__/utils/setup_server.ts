import { RequestHandler } from 'msw';
import { SetupServer, setupServer } from 'msw/node';

export function setupServerAndListen(...handlers: Array<RequestHandler>): SetupServer {
  const server = setupServer(...handlers);
  server.listen({ onUnhandledRequest: 'error' });
  return server;
}
