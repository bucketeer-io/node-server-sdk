"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
/* webpackChunkName: "bucketeer" */
// NOTE: If you want to use SDK published on npm,
// replace the path below with the following.
// '@bucketeer/sdk'
const lib_1 = require("../../lib");
const PORT = 3000;
// The user project chooses whether to use fetch or XMLHttpRequest.
// We used XMLHttpRequest here, but you can use simple fetch() as it is.
function fetchLike(url, request) {
    return new Promise((resolve) => {
        const { method, headers, body } = request;
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // tslint:disable-next-line no-magic-numbers
                if (xhr.status === 200) {
                    resolve({
                        ok: true,
                        json() {
                            return Promise.resolve(JSON.parse(xhr.responseText));
                        },
                    });
                }
                else {
                    resolve({
                        ok: false,
                        json() {
                            return Promise.resolve({});
                        },
                    });
                }
            }
        };
        xhr.send(body);
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
 *  user:   Users using services.
 *          Set user attribute in data.
 *  fetch:  Implement logic close to ES2015's Fetch and specify it.
 *          Of course, it is okay to specify ES2015's Fetch as it is.
 *  pollingIntervalForGetEvaluations:
 *          Interval for getting feature flags in internal API.
 *          Specify in milliseconds.
 *  pollingIntervalForGetEvaluations:
 *          Interval for registering track events in internal API.
 *          Specify in milliseconds.
 */
const bucketeer = lib_1.initialize({
    host: 'https://api-dev.bucketeer.jp',
    token: '12a1251e8ffe64792b4c5bd9c4f5268b79fe093911835c08bfb2c677021a5e52',
    tag: 'node',
    fetch: fetchLike,
    // tslint:disable-next-line no-magic-numbers
    pollingIntervalForRegisterEvents: 2 * 60 * 1000,
});
/**
 *  Public API
 *  Useful for trouble shooting.
 *  Return GIT_REVISION and BUILD_DATE.
 */
console.table(bucketeer.getBuildInfo());
// window.addEventListener('beforeunload', () => {
//   /**
//    *  Public API
//    *  Use to destroy bucketeer sdk.
//    *  User must call destory() in an arbitrary point (e.g. beforeunload timing).
//    */
//   bucketeer.destroy();
// });
const html = ({ label }) => `
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
          console.log(event);
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
          console.log(response);
      }
      let button = document.getElementById('btn');
      button.addEventListener('click', function (e) { butotnClick(e) });
      </script>
    </body>
  </html>
`;
const controller = (_, res, next) => {
    (async () => {
        const label = await bucketeer.getStringVariation({ id: 'uid', data: {} }, 'node-server-test', 'defaultValue');
        console.log(label);
        res.send(html({ label: label }));
    })().catch(next);
};
const app = express_1.default();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../assets')));
app.get('/', controller);
app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Goal is triggered');
});
// app.get('/', (_, res) => {
//   res.sendFile(path.join(__dirname, '../../views/index.html'));
// });
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}.`);
});
