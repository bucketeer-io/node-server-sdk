import test from 'ava';
import { APIClient } from '../lib/api/client';
import {
  API_ENDPOINT,
  SERVER_API_KEY,
  CLIENT_API_KEY,
  FEATURE_TAG,
  FEATURE_ID_BOOLEAN,
  FEATURE_ID_STRING,
  FEATURE_ID_INT,
  FEATURE_ID_FLOAT,
  FEATURE_ID_JSON,
  TARGETED_USER_ID,
} from './constants/constants';
import { SourceId } from '../lib/objects/sourceId';
import { nodeSDKVersion } from '../lib/objects/version';

test('getFeatureFlags: response contains expected fields with meaningful values', async (t) => {
  const client = new APIClient(API_ENDPOINT, SERVER_API_KEY);
  const requestedAt = 1;

  const [res] = await client.getFeatureFlags(
    FEATURE_TAG,
    '',
    requestedAt,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.true(res.features.length >= 1);
  t.is(typeof res.featureFlagsId, 'string');
  t.true(res.featureFlagsId.length > 0);
  t.true(Number(res.requestedAt) > requestedAt);
  // forceUpdate should be true on the first request to ensure clients fetch the latest flags
  t.true(res.forceUpdate);
  t.true(res.features.some((f) => f.id === FEATURE_ID_BOOLEAN));
  t.true(res.features.some((f) => f.id === FEATURE_ID_STRING));
  t.true(res.features.some((f) => f.id === FEATURE_ID_INT));
  t.true(res.features.some((f) => f.id === FEATURE_ID_FLOAT));
  t.true(res.features.some((f) => f.id === FEATURE_ID_JSON));
});

test('getFeatureFlags: second request with same featureFlagsId returns empty features', async (t) => {
  const client = new APIClient(API_ENDPOINT, SERVER_API_KEY);

  const [first] = await client.getFeatureFlags(
    FEATURE_TAG,
    '',
    1,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  const requestedAt = Number(first.requestedAt);
  const [second] = await client.getFeatureFlags(
    FEATURE_TAG,
    first.featureFlagsId,
    requestedAt,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.is(second.featureFlagsId, first.featureFlagsId);
  t.is(second.features.length, 0);
  t.false(second.forceUpdate);
});

test('getSegmentUsers: response contains expected fields with meaningful values', async (t) => {
  const client = new APIClient(API_ENDPOINT, SERVER_API_KEY);
  const requestedAt = 1;

  const [res] = await client.getSegmentUsers(
    [],
    requestedAt,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.true(res.segmentUsers.length > 0);
  t.is(res.deletedSegmentIds.length, 0);
  t.true(Number(res.requestedAt) > requestedAt);
  // forceUpdate should be true on the first request to ensure clients fetch the latest segments
  t.true(res.forceUpdate);
});

test('getSegmentUsers: second request with updated requestedAt returns empty response', async (t) => {
  const client = new APIClient(API_ENDPOINT, SERVER_API_KEY);

  const [first] = await client.getSegmentUsers(
    [],
    1,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  const requestedAt = Number(first.requestedAt);
  t.true(first.segmentUsers.length > 0);

  const segmentIds = [first.segmentUsers[0].segmentId, 'random-id'];
  const [second] = await client.getSegmentUsers(
    segmentIds,
    requestedAt,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.is(second.segmentUsers.length, 0);
  t.false(second.forceUpdate);
});

test('getEvaluation: response contains evaluation for known feature', async (t) => {
  const client = new APIClient(API_ENDPOINT, CLIENT_API_KEY);
  const user = { id: TARGETED_USER_ID, data: {} };

  const [res] = await client.getEvaluation(
    FEATURE_TAG,
    user,
    FEATURE_ID_BOOLEAN,
    SourceId.NODE_SERVER,
    nodeSDKVersion,
  );

  t.truthy(res.evaluation);
  t.is(res.evaluation?.featureId, FEATURE_ID_BOOLEAN);
});
