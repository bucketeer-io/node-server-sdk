import anyTest, { TestFn } from 'ava';
import { NewFeatureCache } from '../../../../cache/features';
import {
  FEATURE_FLAG_CACHE_TTL,
  FEATURE_FLAG_ID,
  FEATURE_FLAG_REQUESTED_AT,
  FeatureFlagProcessorOptions,
  DefaultFeatureFlagProcessor,
} from '../../../../cache/processor/featureFlagCacheProcessor';
import { Feature } from '../../../../objects/feature';
import { GetFeatureFlagsResponse } from '../../../../objects/response';
import sino from 'sinon';
import { Clock } from '../../../../utils/clock';
import { MockCache } from '../../../mocks/cache';
import { MockAPIClient } from '../../../mocks/api';
import { ApiId } from '../../../../objects/apiId';
import { ProcessorEventsEmitter } from '../../../../processorEventsEmitter';
import { SourceId } from '../../../../objects/sourceId';
import { toProtoFeature } from '../../../../evaluator/converter';

const test = anyTest as TestFn<{
  featureTag: string;
  processor: DefaultFeatureFlagProcessor;
  options: FeatureFlagProcessorOptions;
  sandbox: sino.SinonSandbox;
  feature: Feature;
  archivedFeatureIds: string[];
}>;

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

test.beforeEach((t) => {
  const sandbox = sino.createSandbox();
  const cache = new MockCache();
  const apiClient = new MockAPIClient();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const featureFlagCache = NewFeatureCache({ cache: cache, ttl: FEATURE_FLAG_CACHE_TTL });
  const sourceId = SourceId.NODE_SERVER;
  const sdkVersion = '5.3.1';
  const options = {
    cache,
    featureFlagCache,
    pollingInterval: 1000,
    apiClient,
    eventEmitter,
    featureTag: 'nodejs',
    clock,
    sourceId,
    sdkVersion,
  };
  const processor = new DefaultFeatureFlagProcessor(options);
  t.context = {
    featureTag: 'nodejs',
    processor,
    options,
    sandbox,
    feature: minimalFeature('feature-flag-id-2'),
    archivedFeatureIds: ['feature-flags-id-3', 'feature-flags-id-4'],
  };
});

test.afterEach((t) => {
  t.context.sandbox.restore();
});

// Helper to build a plain REST response for feature flags
function buildFeatureResponse(
  featureFlagsId: string,
  requestedAt: string,
  forceUpdate: boolean,
  features: Feature[],
  archivedFeatureFlagIds: string[],
): GetFeatureFlagsResponse {
  return { featureFlagsId, requestedAt, forceUpdate, features, archivedFeatureFlagIds };
}

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
  t.pass();
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
  t.pass();
});

test('err: failed while requesting cache from the server', async (t) => {
  const { featureTag, processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(null);
  const error = new Error('Internal error');
  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, '', 0, options.sourceId, options.sdkVersion)
    .rejects(error);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: error, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('err: failed while putting featureFlagsID, and the forceUpdate is true', async (t) => {
  const { featureTag, processor, options, sandbox, feature } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = buildFeatureResponse('feature-flags-id-2', '20', true, [feature], []);
  const responseSize = 512;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 10, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  mockCache
    .expects('put')
    .withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL)
    .throws(internalError);
  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(toProtoFeature(feature));
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockFeatureFlagCache.verify();
  t.pass();
});

test('err: failed while putting requestedAt, and the forceUpdate is true', async (t) => {
  const { featureTag, processor, options, sandbox, feature } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);
  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);

  const response = buildFeatureResponse('feature-flags-id-2', '20', true, [feature], []);
  const responseSize = 512;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 10, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  mockCache
    .expects('put')
    .withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL)
    .throws(internalError);
  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(toProtoFeature(feature));
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockFeatureFlagCache.verify();
  t.pass();
});

test('err: failed while putting featureFlagsID, and the forceUpdate is false', async (t) => {
  const { featureTag, processor, options, sandbox, feature, archivedFeatureIds } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = buildFeatureResponse(
    'feature-flags-id-2',
    '20',
    false,
    [feature],
    archivedFeatureIds,
  );
  const responseSize = 512;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 10, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  mockCache
    .expects('put')
    .withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL)
    .throws(internalError);
  mockFeatureFlagCache.expects('deleteAll').never();
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[0]);
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[1]);
  mockFeatureFlagCache.expects('put').withArgs(toProtoFeature(feature));
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockFeatureFlagCache.verify();
  t.pass();
});

test('err: failed while putting requestedAt, and the forceUpdate is false', async (t) => {
  const { featureTag, processor, options, sandbox, feature, archivedFeatureIds } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);
  const internalError = new Error('Internal error');

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = buildFeatureResponse(
    'feature-flags-id-2',
    '20',
    false,
    [feature],
    archivedFeatureIds,
  );
  const responseSize = 512;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 10, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  mockFeatureFlagCache.expects('deleteAll').never();
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[0]);
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[1]);
  mockFeatureFlagCache.expects('put').withArgs(toProtoFeature(feature));

  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL).throws(internalError);
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('error', { error: internalError, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockFeatureFlagCache.verify();
  t.pass();
});

test('success: featureFlagsID not found', async (t) => {
  const { featureTag, processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns(null);
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);
  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, '', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 0, FEATURE_FLAG_CACHE_TTL);

  const response = buildFeatureResponse('', '0', false, [], []);
  const responseSize = 0;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, '', 10, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('success: requestedAt not found', async (t) => {
  const { featureTag, processor, options, sandbox } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(null);
  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, '', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 0, FEATURE_FLAG_CACHE_TTL);

  const response = buildFeatureResponse('', '0', false, [], []);
  const responseSize = 0;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 0, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  t.pass();
});

test('success: forceUpdate is true', async (t) => {
  const { featureTag, processor, options, sandbox, feature } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = buildFeatureResponse('feature-flags-id-2', '20', true, [feature], []);
  const responseSize = 512;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 10, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL);
  mockFeatureFlagCache.expects('deleteAll').once();
  mockFeatureFlagCache.expects('put').withArgs(toProtoFeature(feature));

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockFeatureFlagCache.verify();
  t.pass();
});

test('success: forceUpdate is false', async (t) => {
  const { featureTag, processor, options, sandbox, feature, archivedFeatureIds } = t.context;
  const mockCache = sandbox.mock(options.cache);
  const mockAPIClient = sandbox.mock(options.apiClient);
  const mockProcessorEventsEmitter = sandbox.mock(options.eventEmitter);
  const mockFeatureFlagCache = sandbox.mock(options.featureFlagCache);

  mockCache.expects('get').withArgs(FEATURE_FLAG_ID).returns('feature-flags-id-1');
  mockCache.expects('get').withArgs(FEATURE_FLAG_REQUESTED_AT).returns(10);

  const response = buildFeatureResponse(
    'feature-flags-id-2',
    '20',
    false,
    [feature],
    archivedFeatureIds,
  );
  const responseSize = 512;

  mockAPIClient
    .expects('getFeatureFlags')
    .once()
    .withArgs(featureTag, 'feature-flags-id-1', 10, options.sourceId, options.sdkVersion)
    .returns([response, responseSize]);

  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sino.match.any,
      apiId: ApiId.GET_FEATURE_FLAGS,
    });
  mockProcessorEventsEmitter
    .expects('emit')
    .once()
    .withArgs('pushSizeMetricsEvent', { size: responseSize, apiId: ApiId.GET_FEATURE_FLAGS });

  mockCache.expects('put').withArgs(FEATURE_FLAG_ID, 'feature-flags-id-2', FEATURE_FLAG_CACHE_TTL);
  mockCache.expects('put').withArgs(FEATURE_FLAG_REQUESTED_AT, 20, FEATURE_FLAG_CACHE_TTL);
  mockFeatureFlagCache.expects('deleteAll').never();
  mockFeatureFlagCache.expects('put').withArgs(toProtoFeature(feature));
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[0]);
  mockFeatureFlagCache.expects('delete').withArgs(archivedFeatureIds[1]);

  await processor.runUpdateCache();
  mockCache.verify();
  mockAPIClient.verify();
  mockProcessorEventsEmitter.verify();
  mockFeatureFlagCache.verify();
  t.pass();
});
