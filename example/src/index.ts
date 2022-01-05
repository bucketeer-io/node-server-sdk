import express from 'express';

/* webpackChunkName: "bucketeer" */

// NOTE: If you want to use SDK published on npm,
// replace the line below with the following.
// import { initialize } from '@bucketeer/node-server-sdk';
import { initialize } from '../../lib';

const PORT = 3000;

/**
 *  Public API
 *  Initialize bucketeer.
 *  Returned instance is the body of the bucketeer.
 *
 *  host:   Api request destination.
 *  port(optional):
 *          Api request destination port.
 *  token:  Authentication token when requesting.
 *  tag:    Grouping set by bucketeer.
 *  pollingIntervalForRegisterEvents(optional):
 *          Interval for registering track events in internal API.
 *          Specify in milliseconds.
 */
const bucketeer = initialize({
  host: '<API_ENDPOINT>', // e.g. api-media.bucketeer.jp
  token: '<TOKEN>',
  tag: 'node',
});

/**
 *  Public API
 *  Useful for trouble shooting.
 *  Return GIT_REVISION and BUILD_DATE.
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
    const label = await bucketeer.getStringVariation(
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
  console.log(`App listening on port ${PORT}.`);
});
process.on('SIGINT', () => {
  server.close(async () => {
    /**
     *  Public API
     *  Use to destroy bucketeer sdk.
     *  User must call destory() in an arbitrary point.
     */
    await bucketeer.destroy();
    console.log('Process terminated.');
    return;
  });
});
