import anyTest, { TestFn } from 'ava';
import https from 'https';
import fs from 'fs';
import { APIClient } from '../api/client';
import { User } from '../bootstrap';
import path from 'path';
import { v4 } from 'uuid';
import {
  GetEvaluationResponse,
  GetFeatureFlagsResponse,
  GetSegmentUsersResponse,
  RegisterEventsResponse,
} from '../objects/response';
import { BaseRequest } from '../objects/request';
import { SourceId } from '../objects/sourceId';

const evaluationAPI = '/get_evaluation';
const eventsAPI = '/register_events';
const featureFlagsAPI = '/get_feature_flags';
const segmentUsersAPI = '/get_segment_users';
const apiKey = '';

const port = 9990;
const host = `localhost:${port}`;

const test = anyTest as TestFn<{ server: https.Server }>;
const projectRoot = path.join(__dirname, '..', '..');
const serverKey = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.key');
const serverCrt = path.join(projectRoot, 'src', '__tests__', 'testdata', 'server.crt');
const defaultSourceId = SourceId.OPEN_FEATURE_NODE;
const sdkVersion = '3.0.1-test';

const dummyEvalResponse: GetEvaluationResponse = {
  evaluation: {
    id: v4(),
    featureId: 'feature_id',
    featureVersion: 2,
    userId: 'user_id',
    variationId: v4(),
    reason: {
      type: 'DEFAULT',
    },
    variationValue: 'value-1',
    variationName: 'name',
  },
};

const dummpyRegisterEvtsResponse: RegisterEventsResponse = {
  errors: { key: { message: 'Invalid message type', retriable: false } },
};

const dummyFeatureFlagsResponse: GetFeatureFlagsResponse = {
  featureFlagsId: 'feature_flags_id',
  features: [
    {
      id: 'feature_id_1',
      name: 'feature_name_1',
      description: 'feature_description_1',
      enabled: true,
      deleted: false,
      ttl: 3600,
      version: 1,
      createdAt: '1690000000',
      updatedAt: '1690000000',
      variations: [
        {
          id: 'var_id_1',
          value: 'var_value_1',
          name: 'var_name_1',
          description: 'var_desc_1',
        },
      ],
      targets: [
        {
          variation: 'var_id_1',
          users: ['user_id_1'],
        },
      ],
      rules: [
        {
          id: 'rule_id_1',
          strategy: {
            type: 'FIXED',
            fixedStrategy: {
              variation: 'var_id_1',
            },
          },
          clauses: [
            {
              id: 'clause_id_1',
              attribute: 'attr_1',
              operator: 'EQUALS',
              values: ['val_1'],
            },
          ],
        },
      ],
      defaultStrategy: {
        type: 'FIXED',
        fixedStrategy: {
          variation: 'var_id_1',
        },
      },
      offVariation: 'var_id_1',
      tags: ['tag_1'],
      lastUsedInfo: {
        featureId: 'feature_id_1',
        version: 1,
        lastUsedAt: '1690000000',
        createdAt: '1690000000',
        clientOldestVersion: '1.0.0',
        clientLatestVersion: '1.0.0',
      },
      maintainer: 'maintainer_1',
      variationType: 'STRING',
      archived: false,
      prerequisites: [
        {
          featureId: 'pre_feature_id_1',
          variationId: 'pre_var_id_1',
        },
      ],
      samplingSeed: 'seed_1',
    },
  ],
  archivedFeatureFlagIds: ['archived_id_1'],
  requestedAt: '12345',
  forceUpdate: false,
};

const dummySegmentUsersResponse: GetSegmentUsersResponse = {
  segmentUsers: [
    {
      segmentId: 'segment_id_1',
      users: [
        {
          id: 'seg_user_id_1',
          segmentId: 'segment_id_1',
          userId: 'user_id_1',
          state: 'INCLUDED',
          deleted: false,
        },
      ],
      updatedAt: '1690000000',
    },
  ],
  deletedSegmentIds: ['deleted_segment_id_1'],
  requestedAt: '12345',
  forceUpdate: false,
};

test.before((t) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const opts = {
    key: fs.readFileSync(serverKey),
    cert: fs.readFileSync(serverCrt),
  };
  t.context = {
    server: https
      .createServer(opts, (req, res) => {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            let jsonBody = JSON.parse(body) as BaseRequest;
            // Verify the request needs to include `sdkVersion` and `sourceId`
            t.is(jsonBody.sdkVersion, sdkVersion);
            t.is(jsonBody.sourceId, defaultSourceId);
          } catch (error) {
            t.fail('Invalid JSON or data structure');
          }
          switch (req.url) {
            case evaluationAPI:
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(dummyEvalResponse));
              break;
            case eventsAPI:
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(dummpyRegisterEvtsResponse));
              break;
            case featureFlagsAPI:
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(dummyFeatureFlagsResponse));
              break;
            case segmentUsersAPI:
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(dummySegmentUsersResponse));
              break;
            default:
              res.writeHead(400);
              res.end();
              break;
          }
        });
      })
      .listen(port),
  };
});

test.after.always((t) => {
  t.context.server.close();
});

test('getEvaluation: success', async (t) => {
  const client = new APIClient(host, apiKey);
  const user: User = {
    id: '',
    data: {
      '': '',
    },
  };
  const [res] = await client.getEvaluation('', user, '', defaultSourceId, sdkVersion);
  t.deepEqual(res.evaluation, dummyEvalResponse.evaluation);
});

test('getFeatureFlags: success', async (t) => {
  const client = new APIClient(host, apiKey);
  const [res] = await client.getFeatureFlags('', '', 0, defaultSourceId, sdkVersion);
  t.deepEqual(res, dummyFeatureFlagsResponse);
});

test('getSegmentUsers: success', async (t) => {
  const client = new APIClient(host, apiKey);
  const [res] = await client.getSegmentUsers([], 0, defaultSourceId, sdkVersion);
  t.deepEqual(res, dummySegmentUsersResponse);
});

test('registerEvents', async (t) => {
  const client = new APIClient(host, apiKey);
  const [res] = await client.registerEvents([], defaultSourceId, sdkVersion);
  t.is(res.errors.key.message, dummpyRegisterEvtsResponse.errors.key.message);
  t.is(res.errors.key.retriable, dummpyRegisterEvtsResponse.errors.key.retriable);
});
