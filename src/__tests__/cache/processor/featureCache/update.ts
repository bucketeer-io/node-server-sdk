import anyTest, { TestFn } from 'ava';
import { NewFeatureCache } from '../../../../cache/features';
import {
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
  FeatureFlagProcessorOptions,
  DefaultFeatureFlagProcessor,
} from '../../../../cache/processor/featureFlagCacheProcessor';

import {
  Feature,
  GetFeatureFlagsResponse,
  createFeature,
} from '@bucketeer/evaluation';
import sino from 'sinon';
import { FEATURE_FLAG_REQUESTED_AT } from '../../../../../__test/cache/processor/featureFlagCacheProcessor';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockGRPCClient } from '../../../mocks/gprc';
import { ApiId } from '../../../../objects/apiId';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';

const test = anyTest as TestFn<{
  featureTag: string;
  processor: DefaultFeatureFlagProcessor;
  options: FeatureFlagProcessorOptions;
  sandbox: sino.SinonSandbox;
  feature: Feature;
  archivedFeatureIds: string[];
}>;

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const grpc = new MockGRPCClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const featureFlagCache = NewFeatureCache({ cache: cache, ttl: FEATURE_FLAG_CACHE_TTL });
  const sourceId = SourceId.NODE_SERVER;
  const options = {
    cache: cache,
    featureFlagCache: featureFlagCache,
    pollingInterval: 1000,
    grpc: grpc,
    eventEmitter: eventEmitter,
    featureTag: 'nodejs',
    clock: clock,
    sourceId: sourceId,
  };
  const singleFeature = createFeature({ id: 'feature-flag-id-2' });
  const archivedFeatureIds = ['feature-flags-id-3',
    'feature-flags-id-4',]
  const processor = new DefaultFeatureFlagProcessor(options);
  t.context = {
    featureTag: 'nodejs',
    processor: processor,
    options: options,
    sandbox: sandbox,
    feature: singleFeature,
    archivedFeatureIds: archivedFeatureIds,
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

test('err: failed while getting featureFlagsID', async (t) => {
  const { processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);

  const error = new Error('Internal error');
  mockCache.expects('get').once().withArgs(FEATURE_FLAG_ID).throws(error);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: error, apiId: ApiId.GET_FEATURE_FLAGS });
  await processor.runUpdateCache();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
});

test('err: failed while getting requestedAt', async (t) => {
  const { processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const error = new Error('Internal error');
  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).throws(error);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: error, apiId: ApiId.GET_FEATURE_FLAGS });
  await processor.runUpdateCache();
  mockCache.verify();
  mockProcessorEventsEmitter.verify();
});

test('err: failed while requesting cache from the server', async (t) => {
  const { featureTag, processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(null);
  const error = new Error('Internal error');
  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: '',
      requestedAt: 0,
      sourceId: options.sourceId,
    })
    .throws(error);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: error, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('err: failed while putting featureFlagsID, and the forceUpdate is true', async (t) => {
  const { featureTag, processor, options, sandbox, feature } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = new GetFeatureFlagsResponse();
  response.setFeatureFlagsId('feature-flags-id-2');
  response.setRequestedAt(20);
  response.setForceUpdate(true);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList([]);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 10,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: responseSize,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  // err: failed while putting featureFlagsID, and the forceUpdate is true
  mockCache
    .expects('put')
    .withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL)
    .throws(internalError);
  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(feature);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('err: failed while putting requestedAt, and the forceUpdate is true', async (t) => {
  const { featureTag, processor, options, sandbox, feature } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);
  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);

  const response = new GetFeatureFlagsResponse();
  response.setFeatureFlagsId('feature-flags-id-2');
  response.setRequestedAt(20);
  response.setForceUpdate(true);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList([]);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 10,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: responseSize,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  // err: failed while putting requestedAt, and the forceUpdate is true
  mockCache
    .expects('put')
    .withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL)
    .throws(internalError);
  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(feature);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('err: failed while putting featureFlagsID, and the forceUpdate is false', async (t) => {
  const { featureTag, processor, options, sandbox, feature, archivedFeatureIds } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = new GetFeatureFlagsResponse();
  response.setFeatureFlagsId('feature-flags-id-2');
  response.setRequestedAt(20);
  response.setForceUpdate(false);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList(archivedFeatureIds);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 10,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: responseSize,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  // err: failed while putting featureFlagsID, and the forceUpdate is false
  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL).throws(internalError);
  mockFeatureFlagCache.expects('deleteAll').never();
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[0]);
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[1]);
  mockFeatureFlagCache.expects('put').withArgs(feature);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('err: failed while putting requestedAt, and the forceUpdate is false', async (t) => {
  const { featureTag, processor, options, sandbox, feature, archivedFeatureIds } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = new GetFeatureFlagsResponse();
  response.setFeatureFlagsId('feature-flags-id-2');
  response.setRequestedAt(20);
  response.setForceUpdate(false);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList(archivedFeatureIds);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 10,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: responseSize,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  // err: failed while putting requestedAt, and the forceUpdate is false
  mockFeatureFlagCache.expects('deleteAll').never();
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[0]);
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[1]);
  mockFeatureFlagCache.expects('put').withArgs(feature);

  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT).throws(internalError);
  
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('success: featureFlagsID not found', async (t) => {
  const { featureTag, processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns(null);
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  // success: featureFlagsID not found
  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, '', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 0, FEATURE_FLAG_CACHE_TTL);

  const response = new GetFeatureFlagsResponse();

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: '',
      requestedAt: 10,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('success: requestedAt not found', async (t) => {
  const { featureTag, processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(null);

  // success: requestedAt not found
  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, '', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 0, FEATURE_FLAG_CACHE_TTL);

  const response = new GetFeatureFlagsResponse();

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 0,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: response.serializeBinary().length,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('success: forceUpdate is true', async (t) => {
  const { featureTag, processor, options, sandbox, feature } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = new GetFeatureFlagsResponse();
  response.setFeatureFlagsId('feature-flags-id-2');
  response.setRequestedAt(20);
  response.setForceUpdate(true);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList([]);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 10,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: responseSize,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL);

  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(feature);

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});

test('success: forceUpdate is false', async (t) => {
  const { featureTag, processor, options, sandbox, feature, archivedFeatureIds } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockGRPCClient = sandbox.mock(options.grpc);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = new GetFeatureFlagsResponse();
  response.setFeatureFlagsId('feature-flags-id-2');
  response.setRequestedAt(20);
  response.setForceUpdate(false);
  response.setFeaturesList([feature]);
  response.setArchivedFeatureFlagIdsList(archivedFeatureIds);

  const responseSize = response.serializeBinary().length;

  mockGRPCClient
    .expects('getFeatureFlags')
    .once()
    .withArgs({
      tag: featureTag,
      featureFlagsId: 'feature-flags-id-1',
      requestedAt: 10,
      sourceId: options.sourceId,
    })
    .returns(response);

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushLatencyMetricsEvent', {
    latency: sino.match.any,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockProcessorEventsEmitter.expects('emit').once().withArgs('pushSizeMetricsEvent', {
    size: responseSize,
    apiId: ApiId.GET_FEATURE_FLAGS,
  });

  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL);

  mockFeatureFlagCache.expects('deleteAll').never();
  mockFeatureFlagCache.expects('put').withArgs(feature);
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[0]);
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[1]);

  await processor.runUpdateCache();

  mockCache.verify();
  mockGRPCClient.verify();
  mockProcessorEventsEmitter.verify();
});