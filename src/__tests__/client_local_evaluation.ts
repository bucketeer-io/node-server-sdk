import anyTest, { TestFn } from 'ava';
import sinon from 'sinon';
import {
  createFeature,
  Feature,
  SegmentUser,
  SegmentUsers,
  User,
  createPrerequisite,
  Strategy,
  Clause,
  createUser,
  createSegmentUser,
} from '@bucketeer/evaluation';

import { LocalEvaluator } from '../evaluator/local';
import {
  NewSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SegementUsersCacheProcessor,
} from '../cache/processor/segmentUsersCacheProcessor';
import {
  FEATURE_FLAG_CACHE_TTL,
  FeatureFlagProcessor,
  NewFeatureFlagProcessor,
} from '../cache/processor/featureFlagCacheProcessor';
import { MockCache } from './mocks/cache';

import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { Clock } from '../utils/clock';
import { NewSegmentUsersCache, SegmentUsersCache } from '../cache/segmentUsers';
import { NewFeatureCache, FeaturesCache } from '../cache/features';
import { ApiId } from '@bucketeer/evaluation/lib/proto/event/client/event_pb';
import { DefaultLogger, defineBKTConfig } from '../index';
import { APIClient } from '../api/client';
import { MockAPIClient } from './mocks/api';
import { EventStore } from '../stores/EventStore';
import { Evaluation } from '../objects/evaluation';
import { BKTEvaluationDetails } from '../evaluationDetails';
import { BKTValue } from '../types';
import { BKTClientImpl } from '../client';
import { IllegalStateError } from '../objects/errors';
import { requiredInternalConfig } from '../internalConfig';

const test = anyTest as TestFn<{
  sandbox: sinon.SinonSandbox;
  evaluator: LocalEvaluator;
  cache: MockCache;
  eventEmitter: ProcessorEventsEmitter;
  clock: Clock;
  segmentUsersCache: SegmentUsersCache;
  featureFlagCache: FeaturesCache;

  featureFlagProcessor: FeatureFlagProcessor;
  segementUsersCacheProcessor: SegementUsersCacheProcessor;

  sdkInstance: BKTClientImpl;

  data: {
    feature3: Feature;
    feature4: Feature;
    ftBoolean: Feature;
    ftInt: Feature;
    ftFloat: Feature;
    ftString: Feature;
    ftJSON: Feature;

    segmentUser2: SegmentUsers;

    user1: User;
    user2: User;
  };
}>;

test.beforeEach((t) => {
  const sandbox = sinon.createSandbox();
  t.context.sandbox = sandbox;

  const user1 = createUser('user-id-1', {});
  const user2 = createUser('user-id-2', {});

  const sgUser2 = createSegmentUser('user-id-2', 'segment-id-2', SegmentUser.State.INCLUDED);
  const sgUser3 = createSegmentUser('user-id-3', 'segment-id-2', SegmentUser.State.INCLUDED);

  const segmentUsers2 = new SegmentUsers();
  segmentUsers2.setSegmentId('segment-id-2');
  segmentUsers2.setUsersList([sgUser2, sgUser3]);

  const feature3 = createFeature({
    id: 'feature-id-3',
    version: 0,
    name: 'feature3',
    enabled: true,
    tagList: ['server'],
    prerequisitesList: [createPrerequisite('feature-id-4', 'variation-true-id')],
    rules: [
      {
        id: '',
        attribute: '',
        fixedVariation: '',
        operator: Clause.Operator.SEGMENT,
        values: [segmentUsers2.getSegmentId()],
      },
    ],
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const feature4 = createFeature({
    id: 'feature-id-4',
    version: 0,
    name: 'feature4',
    enabled: true,
    tagList: ['server'],
    variationType: Feature.VariationType.BOOLEAN,
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const ftBoolean = createFeature({
    id: 'feature-id-boolean',
    version: 0,
    name: 'feature-boolean',
    enabled: true,
    tagList: ['server'],
    variationType: Feature.VariationType.BOOLEAN,
    variations: [
      {
        id: 'variation-true-id',
        name: 'true-name',
        value: 'true',
        description: 'variation-true-id',
      },
      {
        id: 'variation-false-id',
        name: 'false-name',
        value: 'false',
        description: 'variation-false-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-true-id',
    },
    offVariation: 'variation-false-id',
  });

  const ftInt = createFeature({
    id: 'feature-id-int',
    version: 0,
    name: 'feature-int',
    enabled: true,
    tagList: ['server'],
    variationType: Feature.VariationType.NUMBER,
    variations: [
      {
        id: 'variation-int10-id',
        name: 'int10-name',
        value: '10',
        description: 'variation-int10-id',
      },
      {
        id: 'variation-int20-id',
        name: 'int20-name',
        value: '20',
        description: 'variation-int20-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-int10-id',
    },
    offVariation: 'variation-int20-id',
  });

  const ftFloat = createFeature({
    id: 'feature-id-float',
    version: 0,
    name: 'feature-float',
    enabled: true,
    tagList: ['server'],
    variationType: Feature.VariationType.NUMBER,
    variations: [
      {
        id: 'variation-float10-id',
        name: 'float10-name',
        value: '10.11',
        description: 'variation-float10-id',
      },
      {
        id: 'variation-float20-id',
        name: 'float20-name',
        value: '20.11',
        description: 'variation-float20-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-float10-id',
    },
    offVariation: 'variation-float20-id',
  });

  const ftString = createFeature({
    id: 'feature-id-string',
    version: 0,
    name: 'feature-string',
    enabled: true,
    tagList: ['server'],
    variationType: Feature.VariationType.STRING,
    variations: [
      {
        id: 'variation-string10-id',
        name: 'string10-name',
        value: 'value 10',
        description: 'variation-string10-id',
      },
      {
        id: 'variation-string20-id',
        name: 'string20-name',
        value: 'value 20',
        description: 'variation-string20-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-string10-id',
    },
    offVariation: 'variation-string20-id',
  });

  const ftJSON = createFeature({
    id: 'feature-id-json',
    version: 0,
    name: 'feature-json',
    enabled: true,
    tagList: ['server'],
    variationType: Feature.VariationType.JSON,
    variations: [
      {
        id: 'variation-json1-id',
        name: 'json1-name',
        value: '{"Str": "str1", "Int": 1}',
        description: 'variation-json1-id',
      },
      {
        id: 'variation-json2-id',
        name: 'json2-name',
        value: '{"Str": "str2", "Int": 2}',
        description: 'variation-json2-id',
      },
    ],
    defaultStrategy: {
      type: Strategy.Type.FIXED,
      variation: 'variation-json1-id',
    },
    //TODO: is this correct? I think it should be a string `variation-json2-id`
    offVariation: '{"Str": "str2", "Int": 2}',
  });

  const tag = 'server';
  const cache = new MockCache();
  const eventEmitter = new ProcessorEventsEmitter();
  const clock = new Clock();
  const segmentUsersCache = NewSegmentUsersCache({ cache: cache, ttl: SEGEMENT_USERS_CACHE_TTL });
  const featureFlagCache = NewFeatureCache({ cache: cache, ttl: FEATURE_FLAG_CACHE_TTL });

  const config = requiredInternalConfig(
    defineBKTConfig({
      apiEndpoint: 'api.bucketeer.io',
      apiKey: 'api_key_value',
      featureTag: 'server',
      logger: new DefaultLogger('error'),
      cachePollingInterval: 1000,
      enableLocalEvaluation: true,
    }),
  );

  const apiClient = new MockAPIClient();

  const featureFlagProcessor = NewFeatureFlagProcessor({
    cache: cache,
    featureFlagCache: featureFlagCache,
    pollingInterval: config.cachePollingInterval!,
    apiClient: apiClient,
    eventEmitter: eventEmitter,
    featureTag: config.featureTag,
    clock: new Clock(),
    sourceId: config.sourceId,
    sdkVersion: config.sdkVersion,
  });

  const segementUsersCacheProcessor = NewSegementUserCacheProcessor({
    cache: cache,
    segmentUsersCache: segmentUsersCache,
    pollingInterval: config.cachePollingInterval!,
    apiClient: apiClient,
    eventEmitter: eventEmitter,
    clock: new Clock(),
    sourceId: config.sourceId,
    sdkVersion: config.sdkVersion,
  });

  const evaluator = new LocalEvaluator({
    tag: tag,
    featuresCache: featureFlagCache,
    segementUsersCache: segmentUsersCache,
  });

  const bktOptions = {
    cache: cache,
    apiClient: new APIClient(config.apiEndpoint, config.apiKey),
    eventStore: new EventStore(),
    localEvaluator: evaluator,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    eventEmitter: eventEmitter,
  };

  const sdkInstance = new BKTClientImpl(config, bktOptions);

  t.context = {
    data: {
      feature3: feature3,
      feature4: feature4,
      ftBoolean: ftBoolean,
      ftInt: ftInt,
      ftFloat: ftFloat,
      ftString: ftString,
      ftJSON: ftJSON,

      segmentUser2: segmentUsers2,
      user1: user1,
      user2: user2,
    },
    evaluator: evaluator,
    cache: cache,
    eventEmitter: eventEmitter,
    clock: clock,
    segmentUsersCache: segmentUsersCache,
    featureFlagCache: featureFlagCache,
    featureFlagProcessor: featureFlagProcessor,
    segementUsersCacheProcessor: segementUsersCacheProcessor,
    sandbox: sandbox,
    sdkInstance: sdkInstance,
  };
});

test.afterEach(async (t) => {
  t.context.sandbox.restore();
  await t.context.sdkInstance.destroy();
});

test('boolVariation - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftBoolean } = data;

  const internalErr = new Error('internal error');

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftBoolean.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftBoolean.getId() });

  const result = await sdkInstance.booleanVariation(sdkUser, ftBoolean.getId(), false);
  t.is(result, false);

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('boolVariation - success: boolean variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftBoolean } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftBoolean.getId()).resolves(ftBoolean);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-boolean:0:user-id-1',
    featureId: ftBoolean.getId(),
    featureVersion: ftBoolean.getVersion(),
    userId: 'user-id-1',
    variationId: ftBoolean.getVariationsList()[0].getId(),
    variationName: ftBoolean.getVariationsList()[0].getName(),
    variationValue: ftBoolean.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const result = await sdkInstance.booleanVariation(sdkUser, ftBoolean.getId(), false);
  t.is(result, true);

  featureFlagCacheMock.verify();
  t.pass();
});

test('booleanVariationDetails - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftBoolean } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftBoolean.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftBoolean.getId() });

  const evaluationDetails = {
    featureId: ftBoolean.getId(),
    featureVersion: ftBoolean.getVersion(),
    userId: 'user-id-1',
    variationId: '',
    variationName: '',
    variationValue: false,
    reason: 'CLIENT',
  } satisfies BKTEvaluationDetails<boolean>;

  const result = await sdkInstance.booleanVariationDetails(sdkUser, ftBoolean.getId(), false);
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('booleanVariationDetails - success: boolean variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftBoolean } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftBoolean.getId()).resolves(ftBoolean);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-boolean:0:user-id-1',
    featureId: ftBoolean.getId(),
    featureVersion: ftBoolean.getVersion(),
    userId: 'user-id-1',
    variationId: ftBoolean.getVariationsList()[0].getId(),
    variationName: ftBoolean.getVariationsList()[0].getName(),
    variationValue: ftBoolean.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const evaluationDetails = {
    featureId: ftBoolean.getId(),
    featureVersion: ftBoolean.getVersion(),
    userId: 'user-id-1',
    variationId: ftBoolean.getVariationsList()[0].getId(),
    variationName: ftBoolean.getVariationsList()[0].getName(),
    variationValue: true,
    reason: 'DEFAULT',
  } satisfies BKTEvaluationDetails<boolean>;

  const result = await sdkInstance.booleanVariationDetails(sdkUser, ftBoolean.getId(), false);
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  t.pass();
});

test('numberVariation - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftInt } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftInt.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftInt.getId() });

  const result = await sdkInstance.numberVariation(sdkUser, ftInt.getId(), 1);
  t.is(result, 1);

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('numberVariation - success: number variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftInt } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftInt.getId()).resolves(ftInt);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-int:0:user-id-1',
    featureId: ftInt.getId(),
    featureVersion: ftInt.getVersion(),
    userId: 'user-id-1',
    variationId: ftInt.getVariationsList()[0].getId(),
    variationName: ftInt.getVariationsList()[0].getName(),
    variationValue: ftInt.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const result = await sdkInstance.numberVariation(sdkUser, ftInt.getId(), 1);
  t.is(result, 10);

  featureFlagCacheMock.verify();
  t.pass();
});

test('numberVariation - success: number variation (float)', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftFloat } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftFloat.getId()).resolves(ftFloat);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-float:0:user-id-1',
    featureId: ftFloat.getId(),
    featureVersion: ftFloat.getVersion(),
    userId: 'user-id-1',
    variationId: ftFloat.getVariationsList()[0].getId(),
    variationName: ftFloat.getVariationsList()[0].getName(),
    variationValue: ftFloat.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const result = await sdkInstance.numberVariation(sdkUser, ftFloat.getId(), 1);
  t.is(result, 10.11);

  featureFlagCacheMock.verify();
  t.pass();
});

test('numberVariationDetails - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftInt } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftInt.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftInt.getId() });

  const evaluationDetails = {
    featureId: ftInt.getId(),
    featureVersion: ftInt.getVersion(),
    userId: 'user-id-1',
    variationId: '',
    variationName: '',
    variationValue: 1,
    reason: 'CLIENT',
  } satisfies BKTEvaluationDetails<number>;

  const result = await sdkInstance.numberVariationDetails(sdkUser, ftInt.getId(), 1);
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('numberVariationDetails - success: number variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftInt } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftInt.getId()).resolves(ftInt);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-int:0:user-id-1',
    featureId: ftInt.getId(),
    featureVersion: ftInt.getVersion(),
    userId: 'user-id-1',
    variationId: ftInt.getVariationsList()[0].getId(),
    variationName: ftInt.getVariationsList()[0].getName(),
    variationValue: ftInt.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const evaluationDetails = {
    featureId: ftInt.getId(),
    featureVersion: ftInt.getVersion(),
    userId: 'user-id-1',
    variationId: ftInt.getVariationsList()[0].getId(),
    variationName: ftInt.getVariationsList()[0].getName(),
    variationValue: 10,
    reason: 'DEFAULT',
  } satisfies BKTEvaluationDetails<number>;

  const result = await sdkInstance.numberVariationDetails(sdkUser, ftInt.getId(), 1);
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  t.pass();
});

test('numberVariationDetails - success: number variation (float)', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftFloat } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftFloat.getId()).resolves(ftFloat);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-float:0:user-id-1',
    featureId: ftFloat.getId(),
    featureVersion: ftFloat.getVersion(),
    userId: 'user-id-1',
    variationId: ftFloat.getVariationsList()[0].getId(),
    variationName: ftFloat.getVariationsList()[0].getName(),
    variationValue: ftFloat.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const evaluationDetails = {
    featureId: ftFloat.getId(),
    featureVersion: ftFloat.getVersion(),
    userId: 'user-id-1',
    variationId: ftFloat.getVariationsList()[0].getId(),
    variationName: ftFloat.getVariationsList()[0].getName(),
    variationValue: 10.11,
    reason: 'DEFAULT',
  } satisfies BKTEvaluationDetails<number>;

  const result = await sdkInstance.numberVariationDetails(sdkUser, ftFloat.getId(), 1);
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  t.pass();
});

test('stringVariation - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftString } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftString.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftString.getId() });

  const result = await sdkInstance.stringVariation(sdkUser, ftString.getId(), 'default');
  t.is(result, 'default');

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('stringVariation - success: string variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftString } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftString.getId()).resolves(ftString);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-string:0:user-id-1',
    featureId: ftString.getId(),
    featureVersion: ftString.getVersion(),
    userId: 'user-id-1',
    variationId: ftString.getVariationsList()[0].getId(),
    variationName: ftString.getVariationsList()[0].getName(),
    variationValue: ftString.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const result = await sdkInstance.stringVariation(sdkUser, ftString.getId(), 'default');
  t.is(result, 'value 10');

  featureFlagCacheMock.verify();
  t.pass();
});

test('stringVariationDetails - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftString } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftString.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftString.getId() });

  const evaluationDetails = {
    featureId: ftString.getId(),
    featureVersion: ftString.getVersion(),
    userId: 'user-id-1',
    variationId: '',
    variationName: '',
    variationValue: 'default',
    reason: 'CLIENT',
  } satisfies BKTEvaluationDetails<string>;

  const result = await sdkInstance.stringVariationDetails(sdkUser, ftString.getId(), 'default');
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('stringVariationDetails - success: string variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftString } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftString.getId()).resolves(ftString);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-string:0:user-id-1',
    featureId: ftString.getId(),
    featureVersion: ftString.getVersion(),
    userId: 'user-id-1',
    variationId: ftString.getVariationsList()[0].getId(),
    variationName: ftString.getVariationsList()[0].getName(),
    variationValue: ftString.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const evaluationDetails = {
    featureId: ftString.getId(),
    featureVersion: ftString.getVersion(),
    userId: 'user-id-1',
    variationId: ftString.getVariationsList()[0].getId(),
    variationName: ftString.getVariationsList()[0].getName(),
    variationValue: 'value 10',
    reason: 'DEFAULT',
  } satisfies BKTEvaluationDetails<string>;

  const result = await sdkInstance.stringVariationDetails(sdkUser, ftString.getId(), 'default');
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  t.pass();
});

test('jsonVariation - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftJSON } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftJSON.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftJSON.getId() });

  const result = await sdkInstance.getJsonVariation(sdkUser, ftJSON.getId(), {});
  t.deepEqual(result, {});

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('jsonVariation - success: json variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftJSON } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftJSON.getId()).resolves(ftJSON);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-json:0:user-id-1',
    featureId: ftJSON.getId(),
    featureVersion: ftJSON.getVersion(),
    userId: 'user-id-1',
    variationId: ftJSON.getVariationsList()[0].getId(),
    variationName: ftJSON.getVariationsList()[0].getName(),
    variationValue: ftJSON.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const result = await sdkInstance.getJsonVariation(sdkUser, ftJSON.getId(), {});
  t.deepEqual(result, { Str: 'str1', Int: 1 });

  featureFlagCacheMock.verify();
  t.pass();
});

test('objectVariation - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftJSON } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftJSON.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftJSON.getId() });

  const result = await sdkInstance.objectVariation(sdkUser, ftJSON.getId(), { test: 'test1' });
  t.deepEqual(result, { test: 'test1' });

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('objectVariation - success: json variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftJSON } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftJSON.getId()).resolves(ftJSON);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-json:0:user-id-1',
    featureId: ftJSON.getId(),
    featureVersion: ftJSON.getVersion(),
    userId: 'user-id-1',
    variationId: ftJSON.getVariationsList()[0].getId(),
    variationName: ftJSON.getVariationsList()[0].getName(),
    variationValue: ftJSON.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const result = await sdkInstance.objectVariation(sdkUser, ftJSON.getId(), { test: 'test1' });
  t.deepEqual(result, { Str: 'str1', Int: 1 });

  featureFlagCacheMock.verify();
  t.pass();
});

test('objectVariationDetail - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftJSON } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftJSON.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushDefaultEvaluationEvent', { user: sdkUser, featureId: ftJSON.getId() });

  const evaluationDetails = {
    featureId: ftJSON.getId(),
    featureVersion: ftJSON.getVersion(),
    userId: 'user-id-1',
    variationId: '',
    variationName: '',
    variationValue: { test: 'test1' },
    reason: 'CLIENT',
  } satisfies BKTEvaluationDetails<BKTValue>;

  const result = await sdkInstance.objectVariationDetails(sdkUser, ftJSON.getId(), {
    test: 'test1',
  });
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('objectVariationDetail - success: object variation', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter } = t.context;
  const { user1, ftJSON } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftJSON.getId()).resolves(ftJSON);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-json:0:user-id-1',
    featureId: ftJSON.getId(),
    featureVersion: ftJSON.getVersion(),
    userId: 'user-id-1',
    variationId: ftJSON.getVariationsList()[0].getId(),
    variationName: ftJSON.getVariationsList()[0].getName(),
    variationValue: ftJSON.getVariationsList()[0].getValue(),
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushEvaluationEvent', { user: sdkUser, evaluation: evaluation });

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const evaluationDetails = {
    featureId: ftJSON.getId(),
    featureVersion: ftJSON.getVersion(),
    userId: 'user-id-1',
    variationId: ftJSON.getVariationsList()[0].getId(),
    variationName: ftJSON.getVariationsList()[0].getName(),
    variationValue: { Str: 'str1', Int: 1 },
    reason: 'DEFAULT',
  } satisfies BKTEvaluationDetails<BKTValue>;

  const result = await sdkInstance.objectVariationDetails(sdkUser, ftJSON.getId(), {
    test: 'test1',
  });
  t.deepEqual(result, evaluationDetails);

  featureFlagCacheMock.verify();
  t.pass();
});

test('getEvaluation - err: internal error', async (t) => {
  const { data, featureFlagCache, eventEmitter, sdkInstance } = t.context;
  const { user1, ftBoolean } = data;

  const internalErr = new Error('internal error');
  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(ftBoolean.getId()).rejects(internalErr);

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs(
      'error',
      sinon.match({
        error: sinon.match
          .instanceOf(IllegalStateError)
          .and(sinon.match.has('message', 'Failed to get feature: internal error')),
        apiId: ApiId.SDK_GET_VARIATION,
      }),
    );

  const result = await sdkInstance.getEvaluation(sdkUser, ftBoolean.getId());
  t.is(result, null);

  featureFlagCacheMock.verify();
  eventProcessorMock.verify();
  t.pass();
});

test('getEvaluation - success', async (t) => {
  const { data, featureFlagCache, sdkInstance, eventEmitter, segmentUsersCache } = t.context;
  const { user1, feature3, feature4, segmentUser2 } = data;

  const featureFlagCacheMock = t.context.sandbox.mock(featureFlagCache);
  featureFlagCacheMock.expects('get').once().withExactArgs(feature3.getId()).resolves(feature3);
  featureFlagCacheMock.expects('get').once().withExactArgs(feature4.getId()).resolves(feature4);

  const segementUsersCacheMock = t.context.sandbox.mock(segmentUsersCache);
  segementUsersCacheMock
    .expects('get')
    .once()
    .withExactArgs(segmentUser2.getSegmentId())
    .resolves(segmentUser2);

  const sdkUser = {
    id: user1.getId(),
    data: {},
  };

  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  const evaluation = {
    id: 'feature-id-3:0:user-id-1',
    featureId: 'feature-id-3',
    featureVersion: 0,
    userId: 'user-id-1',
    variationId: 'variation-true-id',
    variationName: feature3.getVariationsList()[0].getName(),
    variationValue: 'true',
    reason: { type: 'DEFAULT', ruleId: '' },
  } satisfies Evaluation;

  eventProcessorMock
    .expects('emit')
    .once()
    .withArgs('pushLatencyMetricsEvent', {
      latency: sinon.match.any,
      apiId: ApiId.SDK_GET_VARIATION,
    });

  const result = await sdkInstance.getEvaluation(sdkUser, feature3.getId());
  t.deepEqual(result, evaluation);

  featureFlagCacheMock.verify();
  t.pass();
});

test('sdk destroy - success', async (t) => {
  const { sdkInstance, eventEmitter, featureFlagProcessor, segementUsersCacheProcessor } =
    t.context;
  const eventProcessorMock = t.context.sandbox.mock(eventEmitter);
  eventProcessorMock.expects('close').once();

  const featureFlagProcessorCacheMock = t.context.sandbox.mock(featureFlagProcessor);
  const featureFlagProcessorStop = featureFlagProcessor.stop.bind(featureFlagProcessor);
  featureFlagProcessorCacheMock
    .expects('stop')
    .once()
    .callsFake(async () => {
      // Call the real stop method to clean up timers
      await featureFlagProcessorStop();
    });

  const segmentUsersCacheProcessorMock = t.context.sandbox.mock(segementUsersCacheProcessor);
  const segmentUsersCacheProcessorStop =
    segementUsersCacheProcessor.stop.bind(segementUsersCacheProcessor);
  segmentUsersCacheProcessorMock
    .expects('stop')
    .once()
    .callsFake(async () => {
      // Call the real stop method to clean up timers
      await segmentUsersCacheProcessorStop();
    });

  await sdkInstance.destroy();
  eventProcessorMock.verify();
  featureFlagProcessorCacheMock.verify();
  segmentUsersCacheProcessorMock.verify();
  t.pass();
});
