import test from 'ava';
import { InMemoryCache } from '../../../../cache/inMemoryCache';
import { NewFeatureCache } from '../../../../cache/features';
import {
  FEATURE_FLAG_ID,
  FEATURE_FLAG_REQUESTED_AT,
  NewFeatureFlagProcessor,
} from '../../../../cache/processor/featureFlagCacheProcessor';
import { Clock } from '../../../../utils/clock';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';
import { Feature } from '../../../../objects/feature';
import { GetFeatureFlagsResponse, GetSegmentUsersResponse } from '../../../../objects/response';
import { APIClient } from '../../../../api/client';
import { toProtoFeature } from '../../../../evaluator/converter';

const minimalFeature = (id: string): Feature => ({
  id,
  name: '',
  description: '',
  enabled: false,
  deleted: false,
  ttl: 0,
  version: 0,
  createdAt: '0',
  updatedAt: '0',
  variationType: 'STRING',
  offVariation: '',
  tags: [],
  maintainer: '',
  archived: false,
  samplingSeed: '',
  variations: [],
  targets: [],
  rules: [],
});

class SpyAPIClient implements Pick<APIClient, 'getFeatureFlags' | 'getSegmentUsers'> {
  featureFlagsRes: GetFeatureFlagsResponse | null = null;
  getFeatureFlagsError: Error | null = null;

  capturedTag: string | null = null;
  capturedFeatureFlagsId: string | null = null;
  capturedRequestedAt: number | null = null;

  getFeatureFlags(
    tag: string,
    featureFlagsId: string,
    requestedAt: number,
    _sourceId: SourceId,
    _sdkVersion: string,
  ): Promise<[GetFeatureFlagsResponse, number]> {
    this.capturedTag = tag;
    this.capturedFeatureFlagsId = featureFlagsId;
    this.capturedRequestedAt = requestedAt;

    if (this.getFeatureFlagsError) {
      return Promise.reject(this.getFeatureFlagsError);
    }
    if (this.featureFlagsRes) {
      return Promise.resolve([this.featureFlagsRes, 0]);
    }
    return Promise.reject(new Error('Missing response'));
  }

  getSegmentUsers(
    _segmentIds: string[],
    _requestedAt: number,
    _sourceId: SourceId,
    _sdkVersion: string,
  ): Promise<[GetSegmentUsersResponse, number]> {
    return Promise.reject(new Error('Not expected in this test'));
  }
}

test('polling cache - using InMemoryCache()', async (t) => {
  const clock = new Clock();
  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });
  const eventEmitter = new ProcessorEventsEmitter();
  const featureFlag = 'nodejs';
  const sourceId = SourceId.NODE_SERVER;
  const apiClient = new SpyAPIClient();

  const feature1 = minimalFeature('feature1');
  const feature2 = minimalFeature('feature2');

  apiClient.featureFlagsRes = {
    featureFlagsId: 'featureFlagsId',
    requestedAt: '1000',
    forceUpdate: false,
    features: [feature1, feature2],
    archivedFeatureFlagIds: [],
  };

  const processor = NewFeatureFlagProcessor({
    cache: cache,
    featureFlagCache: featureCache,
    pollingInterval: 10,
    apiClient: apiClient,
    eventEmitter: eventEmitter,
    featureTag: featureFlag,
    clock: clock,
    sourceId: sourceId,
    sdkVersion: '2.0.1',
  });

  await processor.start();

  // Features are stored as proto objects after toProtoFeature conversion
  t.deepEqual(await featureCache.get('feature1'), toProtoFeature(feature1));
  t.deepEqual(await featureCache.get('feature2'), toProtoFeature(feature2));

  const featureFlagId = await cache.get(FEATURE_FLAG_ID);
  t.is(featureFlagId, 'featureFlagsId');

  const requestedAt = await cache.get(FEATURE_FLAG_REQUESTED_AT);
  t.true(requestedAt == 1000);

  t.is(apiClient.capturedTag, featureFlag);
  t.is(apiClient.capturedFeatureFlagsId, '');
  t.is(apiClient.capturedRequestedAt, 0);

  // Wait for 2 seconds before continuing the test
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await processor.stop();

  t.is(apiClient.capturedTag, featureFlag);
  t.is(apiClient.capturedFeatureFlagsId, 'featureFlagsId');
  t.is(apiClient.capturedRequestedAt, 1000);
});
