import test from 'ava';
import { InMemoryCache } from '../../../../cache/inMemoryCache';
import { NewFeatureCache } from '../../../../cache/features';
import {
  FEATURE_FLAG_ID,
  FEATURE_FLAG_REQUESTED_AT,
  NewFeatureFlagProcessor,
} from '../../../../cache/processor/featureFlagCacheProcessor';

import { Clock } from '../../../../utils/clock';
import { GetFeatureFlagsResponse, GetSegmentUsersResponse, createFeature } from '@kenji71089/evaluation';
import { GRPCClient } from '../../../../grpc/client';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';

class SpyGRPCCLient implements GRPCClient {
  segmentUsersRes: GetSegmentUsersResponse | null;
  featureFlags: GetFeatureFlagsResponse | null;
  getSegmentUsersError: Error | null;
  getFeatureFlagsError: Error | null;

  getSegementUsersRequest: {
    segmentIdsList: Array<string>;
    requestedAt: number;
    version: string;
  } | null;

  getFeatureFlagsRequest: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
    version: string;
  } | null;

  getSegmentUsers(options: {
    segmentIdsList: Array<string>;
    requestedAt: number;
    version: string;
  }): Promise<GetSegmentUsersResponse> {

    this.getSegementUsersRequest = options

    if (this.getSegmentUsersError) {
      return Promise.reject(this.getSegmentUsersError);
    }
    if (this.segmentUsersRes) {
      return Promise.resolve(this.segmentUsersRes);
    }
    throw new Error('Missing response');
  }

  getFeatureFlags(options: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
    version: string;
  }): Promise<GetFeatureFlagsResponse> {

    this.getFeatureFlagsRequest = options

    if (this.getFeatureFlagsError) {
      return Promise.reject(this.getFeatureFlagsError);
    }
    if (this.featureFlags) {
      return Promise.resolve(this.featureFlags);
    }
    throw new Error('Missing response');
  }
}

test('polling cache - using InMemoryCache()', async (t) => {
  const clock = new Clock();

  const cache = new InMemoryCache();
  const featureCache = NewFeatureCache({ cache, ttl: 1000 });
  const eventEmitter = new ProcessorEventsEmitter();
  const featureFlag = 'nodejs';
  const grpc = new SpyGRPCCLient();

  const featuresResponse = new GetFeatureFlagsResponse();
  featuresResponse.setFeatureFlagsId('featureFlagsId');
  featuresResponse.setRequestedAt(1000);
  const featureList = featuresResponse.getFeaturesList();
  const feature1 = createFeature({ id: 'feature1' });
  const feature2 = createFeature({ id: 'feature2' });

  featureList.push(feature1);
  featureList.push(feature2);

  grpc.featureFlags = featuresResponse;

  const processor = NewFeatureFlagProcessor({
    cache: cache,
    featureFlagCache: featureCache,
    pollingInterval: 10,
    grpc: grpc,
    eventEmitter: eventEmitter,
    featureTag: featureFlag,
    clock: clock,
  });

  processor.start();

  // Wait for 2 seconds before continuing the test
  await new Promise((resolve) => setTimeout(resolve, 2000));

  processor.stop();

  t.deepEqual(await featureCache.get('feature1'), feature1);
  t.deepEqual(await featureCache.get('feature2'), feature2);

  const featureFlagId = await cache.get(FEATURE_FLAG_ID);
  t.is(featureFlagId, 'featureFlagsId');

  const requestedAt = await cache.get(FEATURE_FLAG_REQUESTED_AT);
  t.true(requestedAt == 1000);

  t.deepEqual(grpc.getFeatureFlagsRequest, {
    tag: featureFlag,
    featureFlagsId: 'featureFlagsId',
    requestedAt: 1000,
  });
});