import express from 'express';

/* webpackChunkName: "bucketeer" */

// NOTE: If you want to use SDK published on npm,
// replace the line below with the following.
// import { initialize } from '@bucketeer/node-server-sdk';
import { initializeBKTClient, defineBKTConfig } from '../../lib';

const PORT = 3000;
const SHUTDOWN_TIMEOUT = 30000;

/**
 *  Initialize bucketeer.
 */
const config = defineBKTConfig({
  apiEndpoint: '<API_ENDPOINT>', // e.g. https://api-media.bucketeer.jp or api-media.bucketeer.jp
  apiKey: '<TOKEN>',
  featureTag: 'node',
  // scheme: 'http', // Optional: explicitly set scheme for local development (defaults to 'https')
});
const bucketeer = initializeBKTClient(config);

/**
 *  Useful for trouble shooting.
 */
console.table(bucketeer.getBuildInfo());

const html = ({ label }: { label: string }) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>bucketeer web-server-sdk example</title>
    </head>
    <body>
      <button id=btn type="button">${label}</button>
      <script>
      async function butotnClick(event){
          const response = await fetch('http://localhost:3000', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({value: 1})
          })
          const text = await response.text();
          console.log(text);
      }
      let button = document.getElementById('btn');
      button.addEventListener('click', function (e) { butotnClick(e) });
      </script>
    </body>
  </html>
`;

const controller = (_: express.Request, res: express.Response, next: express.NextFunction) => {
  (async () => {
    const label = await bucketeer.stringVariation(
      { id: 'uid', data: {} },
      'node-server-debug',
      'defaultValue',
    );
    res.send(html({ label: label }));
  })().catch(next);
};

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', controller);

app.post('/', (req, res) => {
  bucketeer.track({ id: 'uid', data: {} }, 'goal-debug', req.body.value);
  res.status(200).send('Track is called.');
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

/**
 * Graceful shutdown handler
 * This ensures all events are flushed before the process exits
 */
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received, starting graceful shutdown...`);
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      /**
       * IMPORTANT: Always call destroy() before your application exits
       * This flushes all remaining events to the server and stops background workers
       */
      await bucketeer.destroy();
      console.log('Bucketeer SDK shutdown complete');
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force exit if graceful shutdown takes too long (30 seconds)
  setTimeout(() => {
    console.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
};

// Handle SIGTERM (Docker, Kubernetes, systemd)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
