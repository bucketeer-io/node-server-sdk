import anyTest, { TestInterface } from 'ava';
import https from 'https';
import fs from 'fs';
import { Client } from '../api/client';
import { User } from '../bootstrap';
import path from 'path';

const apiKey = '';

const port = 9999;
const host = `localhost:${port}`;

const test = anyTest as TestInterface<{ server: https.Server }>;
const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');

test.before((t) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const opts = {
    key: fs.readFileSync(serverKey),
    cert: fs.readFileSync(serverCrt),
  };
  t.context = {
    server: https
      .createServer(opts, (req, res) => {
        switch (req.url) {
          default:
            res.writeHead(500);
            res.end();
            break;
        }
      })
      .listen(port),
  };
});

test.after.always((t) => {
  t.context.server.close();
});

test('getEvaluation: 500', async (t) => {
  const client = new Client(host, apiKey);
  const user: User = {
    id: '',
    data: {
      '': '',
    },
  };
  let err = '';
  try {
    await client.getEvaluation('', user, '');
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'bucketeer/api: send HTTP request failed: 500');
});

test('registerEvents: 500', async (t) => {
  const client = new Client(host, apiKey);
  let err = '';
  try {
    await client.registerEvents([]);
  } catch (error) {
    err = error.message;
  }
  t.is(err, 'bucketeer/api: send HTTP request failed: 500');
});
