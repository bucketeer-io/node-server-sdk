import test from 'ava';
import {
  requiredInternalConfig,
  resolveSourceId,
  resolveSDKVersion,
  InternalConfig,
} from '../internalConfig';
import { BKTConfig } from '../config';
import { SourceId } from '../objects/sourceId';
import { IllegalArgumentError } from '../objects/errors';

// Helper function to create a valid BKTConfig with minimal required fields
const baseConfig: Partial<BKTConfig> = {
  apiKey: 'test-key',
  apiEndpoint: 'https://api.test.com',
  featureTag: 'test-tag',
  appVersion: '1.0.0',
  eventsFlushInterval: 10000,
  eventsMaxQueueSize: 50,
  cachePollingInterval: 600000,
};

// requiredInternalConfig should throw error when config is not a InternalConfig
test('requiredInternalConfig should throw error when config is not a InternalConfig', (t) => {
  const config: Partial<BKTConfig> = baseConfig;
  // Cast to any to bypass type checking
  const error = t.throws(() => requiredInternalConfig(config as BKTConfig), {
    instanceOf: IllegalArgumentError,
  });
  t.is(error?.message, 'Config is missing sourceId. Must be processed by defineBKTConfig first.');
});

// Test cases for requiredInternalConfig
test('requiredInternalConfig should throw error when sourceId is undefined', (t) => {
  const config = baseConfig as BKTConfig;

  const error = t.throws(() => requiredInternalConfig(config), {
    instanceOf: IllegalArgumentError,
  });

  t.true(error.message.includes('Config is missing sourceId'));
});

test('requiredInternalConfig should throw error when sdkVersion is undefined', (t) => {
  const config: Partial<InternalConfig> = {
    ...baseConfig,
    sourceId: SourceId.NODE_SERVER,
    // sdkVersion is undefined
  };

  const error = t.throws(() => requiredInternalConfig(config as BKTConfig), {
    instanceOf: IllegalArgumentError,
  });

  t.true(error.message.includes('Config is missing sdkVersion'));
});

test('requiredInternalConfig should throw error when sdkVersion is empty string', (t) => {
  const config: Partial<InternalConfig> = {
    ...baseConfig,
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '', // empty string should be invalid
  };

  const error = t.throws(() => requiredInternalConfig(config as BKTConfig), {
    instanceOf: IllegalArgumentError,
  });

  t.true(error.message.includes('Config is missing sdkVersion'));
});

test('requiredInternalConfig should accept sourceId = 0 (SourceId.UNKNOWN)', (t) => {
  const config: Partial<InternalConfig> = {
    ...baseConfig,
    sourceId: SourceId.UNKNOWN, // 0 should be valid
    sdkVersion: '1.0.0',
  };

  const result = requiredInternalConfig(config as BKTConfig);
  t.is(result.sourceId, SourceId.UNKNOWN);
  t.is(result.sdkVersion, '1.0.0');
});

test('requiredInternalConfig should return InternalConfig when all required fields are present', (t) => {
  const config: Partial<InternalConfig> = {
    ...baseConfig,
    sourceId: SourceId.NODE_SERVER,
    sdkVersion: '1.2.3',
  };

  const result = requiredInternalConfig(config as BKTConfig);

  t.is(result.sourceId, SourceId.NODE_SERVER);
  t.is(result.sdkVersion, '1.2.3');
  t.is(result.apiKey, 'test-key');
  t.is(result.apiEndpoint, 'https://api.test.com');
  t.is(result.appVersion, '1.0.0');
});

// Test cases for resolveSourceId
test('resolveSourceId should return NODE_SERVER by default', (t) => {
  const config = baseConfig as BKTConfig;

  const result = resolveSourceId(config);
  t.is(result, SourceId.NODE_SERVER);
});

test('resolveSourceId should return wrapper SDK sourceId when valid', (t) => {
  const config: Partial<BKTConfig> = {
    ...baseConfig,
    wrapperSdkSourceId: SourceId.OPEN_FEATURE_NODE,
  };

  const result = resolveSourceId(config as BKTConfig);
  t.is(result, SourceId.OPEN_FEATURE_NODE);
});

test('resolveSourceId should throw error for unsupported wrapper SDK sourceId', (t) => {
  const config: Partial<BKTConfig> = {
    ...baseConfig,
    wrapperSdkSourceId: SourceId.ANDROID, // Not in supportedWrapperSdkSourceIds
  };
  const error = t.throws(() => resolveSourceId(config as BKTConfig), {
    instanceOf: IllegalArgumentError,
  });

  t.true(error.message.includes('Unsupported wrapperSdkSourceId'));
});

// Test cases for resolveSDKVersion
test('resolveSDKVersion should return version for NODE_SERVER sourceId', (t) => {
  const config = baseConfig as BKTConfig;

  const result = resolveSDKVersion(config, SourceId.NODE_SERVER);
  t.is(typeof result, 'string');
  t.true(result.length > 0);
});

test('resolveSDKVersion should return wrapperSdkVersion for non-NODE_SERVER sourceId', (t) => {
  const config: Partial<BKTConfig> = {
    ...baseConfig,
    wrapperSdkVersion: '2.1.0',
  };
  const result = resolveSDKVersion(config as BKTConfig, SourceId.OPEN_FEATURE_NODE);
  t.is(result, '2.1.0');
});

test('resolveSDKVersion should throw error when wrapperSdkVersion is missing for non-NODE_SERVER', (t) => {
  const config = baseConfig as BKTConfig;
  // wrapperSdkVersion is missing

  const error = t.throws(() => resolveSDKVersion(config, SourceId.OPEN_FEATURE_NODE), {
    instanceOf: IllegalArgumentError,
  });

  t.true(error.message.includes('Config is missing wrapperSdkVersion'));
});
