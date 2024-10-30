import test from 'ava';
import { Cache } from '../../../cache/cache';
import { NewFeatureCache } from '../../../cache/features';
import {
  NewFeatureFlagProcessor,
} from '../../../cache/processor/featureFlagCacheProcessor';
import { ProcessorEventsEmitter } from '../../../cache/processor/processorEvents';
import {
  GetFeatureFlagsResponse,
  GetSegmentUsersResponse,
  creatFeature,
} from '@bucketeer/node-evaluation';
import sino from 'sinon';
import { GRPCClient } from '../../../grpc/client';

class MockGRPCClient implements GRPCClient {
  getFeatureFlags(_options: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
  }): Promise<GetFeatureFlagsResponse> {
    throw new Error('Method not implemented.');
  }
  getSegmentUsers(_options: {
    segmentIdsList: Array<string>;
    requestedAt: number;
  }): Promise<GetSegmentUsersResponse> {
    throw new Error('Method not implemented.');
  }
}

class MockCache implements Cache {
  get(_key: string): Promise<any | null> {
    throw new Error('Method not implemented.');
  }
  put(_key: string, _value: any, _ttl: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(_key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  scan(_keyPrefix: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  deleteAll(): Promise<void> {
    throw new Error('Method not implemented.');
  }

}

test('polling cache', async (_t) => {
  var cache = new MockCache();
  sino.stub(cache);

  var gRPCClient = new MockGRPCClient();
  var mockGRPCClient = sino.mock(gRPCClient);

  var eventEmitter = new ProcessorEventsEmitter();
  var mockProcessorEventsEmitter = sino.mock(eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .atLeast(1)
    .withArgs('pushLatencyMetricsEvent', sino.match.any);
  mockProcessorEventsEmitter
    .expects('emit')
    .atLeast(1)
    .withArgs('pushSizeMetricsEvent', sino.match.any);
  mockProcessorEventsEmitter.expects('emit').never().withArgs('error', sino.match.any);

  const featureFlag = 'nodejs';
  const featuresResponse = new GetFeatureFlagsResponse();
  featuresResponse.setFeatureFlagsId('featureFlagsId');
  const featureList = featuresResponse.getFeaturesList();
  const feature1 = creatFeature({ id: 'feature1' });
  const feature2 = creatFeature({ id: 'feature2' });

  featureList.push(feature1);
  featureList.push(feature2);

  mockGRPCClient
    .expects('getFeatureFlags')
    .atLeast(1)
    .withArgs({
      tag: featureFlag,
      featureFlagsId: 'featureFlagsId',
      requestedAt: 0,
    })
    .resolves(featuresResponse);

  mockGRPCClient
    .expects('getFeatureFlags')
    .atLeast(1)
    .withArgs({
      tag: featureFlag,
      featureFlagsId: '',
      requestedAt: 0,
    })
    .resolves(featuresResponse);
  mockGRPCClient.expects('getSegmentUsers').never();

  const processor = NewFeatureFlagProcessor({
    cache: cache,
    featureFlagCache: NewFeatureCache({ cache: cache, ttl: 0 }),
    pollingInterval: 10,
    grpc: gRPCClient,
    eventEmitter: eventEmitter,
    featureTag: featureFlag,
  });
});
