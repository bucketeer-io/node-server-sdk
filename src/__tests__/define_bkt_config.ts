import test from 'ava';
import { defineBKTConfig } from '../config';
import { IllegalArgumentError } from '../objects/errors';
import { InternalConfig } from '../internalConfig';
import { SourceId } from '../objects/sourceId';
import { version } from '../objects/version';
import { DefaultLogger } from '../logger';

test('should return a valid config with defaults (featureTag can be empty)', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  });
  t.is(config.apiKey, 'key');
  t.is(config.apiEndpoint, 'endpoint');
  t.is(config.appVersion, '1.2.3');
  t.is(config.featureTag, ''); // default
  t.true(config.eventsFlushInterval >= 60000);
  t.is(config.eventsMaxQueueSize, 50);
  t.true(config.pollingInterval >= 60000);
  t.truthy(config.logger);
  t.is(config.enableLocalEvaluation, false);
});

test('should throw if apiKey is missing', t => {
  t.throws(() => defineBKTConfig({
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  }), { instanceOf: IllegalArgumentError });
});

test('should throw if apiKey is empty string', t => {
  t.throws(() => defineBKTConfig({
    apiKey: '',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  }), { instanceOf: IllegalArgumentError });
});

test('should throw if apiEndpoint is missing', t => {
  t.throws(() => defineBKTConfig({
    apiKey: 'key',
    appVersion: '1.2.3',
  }), { instanceOf: IllegalArgumentError });
});

test('should throw if apiEndpoint is empty string', t => {
  t.throws(() => defineBKTConfig({
    apiKey: 'key',
    appVersion: '1.2.3',
    apiEndpoint: '',
  }), { instanceOf: IllegalArgumentError });
});

test('allow feature tag to be empty string', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    appVersion: '1.2.3',
    apiEndpoint: 'endpoint',
    featureTag: '',
  });
  t.is(config.featureTag, ''); // empty string is allowed
});

test('should not throw if appVersion is missing (default 1.0.0)', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    eventsFlushInterval: 1000, // too low
    eventsMaxQueueSize: 0, // invalid
    pollingInterval: 1000, // too low
  });
  t.is(config.appVersion, '1.0.0'); // default value
});

test('should use provided values and not defaults when set', t => {
  const logger = new DefaultLogger();
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    featureTag: 'tag',
    eventsFlushInterval: 120000,
    eventsMaxQueueSize: 99,
    pollingInterval: 120000,
    enableLocalEvaluation: true,
    logger: logger,
  });
  t.is(config.featureTag, 'tag');
  t.is(config.eventsFlushInterval, 120000);
  t.is(config.eventsMaxQueueSize, 99);
  t.is(config.pollingInterval, 120000);
  t.is(config.enableLocalEvaluation, true);
  t.is(config.logger, logger);
});

test('should correct invalid intervals and queue size', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    eventsFlushInterval: 1000, // too low
    eventsMaxQueueSize: 0, // invalid
    pollingInterval: 1000, // too low
  });
  t.true(config.eventsFlushInterval >= 60000);
  t.is(config.eventsMaxQueueSize, 50);
  t.true(config.pollingInterval >= 60000);
});

// Error message validation tests
test('should throw with correct message if apiKey is missing', t => {
  const error = t.throws(() => defineBKTConfig({
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  }), { instanceOf: IllegalArgumentError });
  t.is(error.message, 'apiKey is required');
});

test('should throw with correct message if apiEndpoint is missing', t => {
  const error = t.throws(() => defineBKTConfig({
    apiKey: 'key',
    appVersion: '1.2.3',
  }), { instanceOf: IllegalArgumentError });
  t.is(error.message, 'apiEndpoint is required');
});

test('should throw with correct message if appVersion is empty', t => {
  const error = t.throws(() => defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '',
  }), { instanceOf: IllegalArgumentError });
  t.is(error.message, 'appVersion is required');
});

// Internal fields validation
test('should set sourceId and sdkVersion internally', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  }) as InternalConfig;
  t.truthy(config.sourceId); // Should be set
  t.truthy(config.sdkVersion); // Should be set
  t.is(typeof config.sourceId, 'number'); // SourceId is a number
  t.is(typeof config.sdkVersion, 'string'); // Version is a string
  t.is(config.sdkVersion, version); // Should match appVersion
  t.is(config.sourceId, SourceId.NODE_SERVER); // Default SourceId.NODE_SERVER
});

// Wrapper SDK tests
test('should handle valid wrapperSdkSourceId', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    wrapperSdkSourceId: SourceId.OPEN_FEATURE_NODE, // OPEN_FEATURE_NODE
    wrapperSdkVersion: '2.0.0',
  }) as InternalConfig;
  t.is(config.wrapperSdkSourceId, 104);
  t.is(config.wrapperSdkVersion, '2.0.0');
  t.is(config.sourceId, SourceId.OPEN_FEATURE_NODE); // Should use wrapper sourceId
  t.is(config.sdkVersion, '2.0.0'); // Should use wrapper version
});

test('should throw on invalid wrapperSdkSourceId', t => {
  const error = t.throws(() => defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    wrapperSdkSourceId: 999, // Invalid sourceId
    wrapperSdkVersion: '2.0.0',
  }), { instanceOf: IllegalArgumentError });
  t.is(error.message, 'Unsupported wrapperSdkSourceId: 999');
});

test('should throw if wrapperSdkVersion is missing when wrapperSdkSourceId is provided', t => {
  const error = t.throws(() => defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    wrapperSdkSourceId: 104, // OPEN_FEATURE_NODE
    // wrapperSdkVersion missing
  }), { instanceOf: IllegalArgumentError });
  t.is(error.message, 'Config is missing wrapperSdkVersion');
});

// Boundary value tests
test('should handle negative eventsMaxQueueSize', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    eventsMaxQueueSize: -1,
  });
  t.is(config.eventsMaxQueueSize, 50); // Should be corrected to default
});

test('should not include wrapperSdkVersion when not provided', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  });
  t.is(config.wrapperSdkVersion, undefined);
  t.is(config.wrapperSdkSourceId, undefined);
});

// Edge case: extremely large values
test('should handle very large queue size', t => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    eventsMaxQueueSize: 999999,
  });
  t.is(config.eventsMaxQueueSize, 999999); // Should keep large valid values
});