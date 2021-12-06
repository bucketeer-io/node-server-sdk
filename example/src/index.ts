import express from 'express';
import https from 'https';

/* webpackChunkName: "bucketeer" */

// NOTE: If you want to use SDK published on npm,
// replace the path below with the following.
// '@bucketeer/sdk'
import { Bucketeer, FetchLike, FetchRequestLike, FetchResponseLike, initialize } from '../../lib';

const PORT = 3000;

// The user project chooses what to use for http request.
function fetchLike(url: string, request: FetchRequestLike): Promise<FetchResponseLike> {
  return new Promise((resolve) => {
    const { method, headers, body } = request;
    const options = {
      method: method,
      headers: headers,
    };
    const req = https.request(url, options, (resp) => {
      let body = '';
      resp.on('data', (chunk) => {
        body += chunk;
      });
      resp.on('end', () => {
        resolve({
          ok: true,
          json() {
            return Promise.resolve(JSON.parse(body));
          },
        });
      });
    });
    req.on('error', () => {
      resolve({
        ok: false,
        json() {
          return Promise.resolve({});
        },
      });
    });
    req.write(body);
    req.end();
  });
}

/**
 *  Public API
 *  Initialize bucketeer.
 *  Returned instance is the body of the bucketeer.
 *
 *  host:   Api request destination.
 *  token:  Authentication token when requesting.
 *  tag:    Grouping set by bucketeer.
 *  fetch:  Implement logic close to ES2015's Fetch and specify it.
 *          Of course, it is okay to specify ES2015's Fetch as it is.
 *  pollingIntervalForGetEvaluations:
 *          Interval for registering track events in internal API.
 *          Specify in milliseconds.
 */
const bucketeer = initialize({
  host: 'https://api-dev.bucketeer.jp:443', // e.g. api-media.bucketeer.jp:443
  token: '12a1251e8ffe64792b4c5bd9c4f5268b79fe093911835c08bfb2c677021a5e52',
  tag: 'node',
  fetch: fetchLike,
  // tslint:disable-next-line no-magic-numbers
  pollingIntervalForRegisterEvents: 1 * 60 * 1000,
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
      'node-server-test',
      'defaultValue',
    );
    console.log(label);
    res.send(html({ label: label }));
  })().catch(next);
};

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', controller);

app.post('/', (req, res) => {
  console.log('Track is called.');
  bucketeer.track({ id: 'uid', data: {} }, 'kozuka-goal', req.body.value);
  res.status(200).send('Track is called.');
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
process.on('SIGINT', () => {
  server.close(() => {
    /**
     *  Public API
     *  Use to destroy bucketeer sdk.
     *  User must call destory() in an arbitrary point.
     */
    bucketeer.destroy();
    console.log('Process terminated.');
    return;
  });
});
