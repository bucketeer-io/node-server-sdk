import test from 'ava';
import { defineBKTConfig } from '../config';
import { IllegalArgumentError } from '../objects/errors';
import { InternalConfig } from '../internalConfig';
import { SourceId } from '../objects/sourceId';
import { DefaultLogger } from '../logger';
import { nodeSDKVersion } from '../objects/version';

const DEFAULT_MAX_RETRIES = 3;

// 1. Validation error tests
test('should throw if apiKey is missing', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiEndpoint: 'endpoint',
        appVersion: '1.2.3',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.is(error.message, 'apiKey is required');
});
test('should throw if apiKey is empty string', (t) => {
  t.throws(
    () =>
      defineBKTConfig({
        apiKey: '',
        apiEndpoint: 'endpoint',
        appVersion: '1.2.3',
      }),
    { instanceOf: IllegalArgumentError },
  );
});
test('should throw if apiEndpoint is missing', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        appVersion: '1.2.3',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.is(error.message, 'apiEndpoint is required');
});
test('should throw if apiEndpoint is empty string', (t) => {
  t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        appVersion: '1.2.3',
        apiEndpoint: '',
      }),
    { instanceOf: IllegalArgumentError },
  );
});
test('should throw with correct message if appVersion is empty', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        apiEndpoint: 'endpoint',
        appVersion: '',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.is(error.message, 'appVersion is required');
});
test('should throw on invalid wrapperSdkSourceId', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        apiEndpoint: 'endpoint',
        appVersion: '1.2.3',
        wrapperSdkSourceId: 999, // Invalid sourceId
        wrapperSdkVersion: '2.0.0',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.is(error.message, 'Unsupported wrapperSdkSourceId: 999');
});
test('should throw if wrapperSdkVersion is missing when wrapperSdkSourceId is provided', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        apiEndpoint: 'endpoint',
        appVersion: '1.2.3',
        wrapperSdkSourceId: 104, // OPEN_FEATURE_NODE
        // wrapperSdkVersion missing
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.is(error.message, 'Config is missing wrapperSdkVersion');
});

// 2. Defaults and allowed values
test('should return a valid config with defaults (featureTag can be empty)', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  });
  t.is(config.apiKey, 'key');
  t.is(config.apiEndpoint, 'endpoint');
  t.is(config.appVersion, '1.2.3');
  t.is(config.featureTag, ''); // default
  t.true(config.eventsFlushInterval >= 10000);
  t.is(config.eventsMaxQueueSize, 50);
  t.true(config.cachePollingInterval >= 60000);
  t.truthy(config.logger);
  t.is(config.enableLocalEvaluation, false);
});
test('allow feature tag to be empty string', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    appVersion: '1.2.3',
    apiEndpoint: 'endpoint',
    featureTag: '',
  });
  t.is(config.featureTag, ''); // empty string is allowed
});
test('should not throw if appVersion is missing (default 1.0.0)', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    eventsFlushInterval: 1000, // too low
    eventsMaxQueueSize: 0, // invalid
    cachePollingInterval: 1000, // too low
  });
  t.is(config.appVersion, '1.0.0'); // default value
});

// 3. Custom values
test('should use provided values and not defaults when set', (t) => {
  const logger = new DefaultLogger();
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    featureTag: 'tag',
    eventsFlushInterval: 120000,
    eventsMaxQueueSize: 99,
    cachePollingInterval: 120000,
    enableLocalEvaluation: true,
    logger: logger,
  });
  t.is(config.featureTag, 'tag');
  t.is(config.eventsFlushInterval, 120000);
  t.is(config.eventsMaxQueueSize, 99);
  t.is(config.cachePollingInterval, 120000);
  t.is(config.enableLocalEvaluation, true);
  t.is(config.logger, logger);
});
test('should correct invalid intervals and queue size', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    eventsFlushInterval: 1000, // too low
    eventsMaxQueueSize: 0, // invalid
    cachePollingInterval: 1000, // too low
  });
  t.true(config.eventsFlushInterval >= 10000);
  t.is(config.eventsMaxQueueSize, 50);
  t.true(config.cachePollingInterval >= 60000);
});

// 4. Internal fields
test('should set sourceId and sdkVersion internally', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  }) as InternalConfig;
  t.truthy(config.sourceId); // Should be set
  t.truthy(config.sdkVersion); // Should be set
  t.is(typeof config.sourceId, 'number'); // SourceId is a number
  t.is(typeof config.sdkVersion, 'string'); // Version is a string
  t.is(config.sdkVersion, nodeSDKVersion); // Should match appVersion
  t.is(config.sourceId, SourceId.NODE_SERVER); // Default SourceId.NODE_SERVER
});

// 5. Wrapper SDK
test('should handle valid wrapperSdkSourceId', (t) => {
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
test('should not include wrapperSdkVersion when not provided', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  });
  t.is(config.wrapperSdkVersion, undefined);
  t.is(config.wrapperSdkSourceId, undefined);
});

// 6. Boundary and edge cases
test('should handle negative eventsMaxQueueSize', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    eventsMaxQueueSize: -1,
  });
  t.is(config.eventsMaxQueueSize, 50); // Should be corrected to default
});
test('should handle very large queue size', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    eventsMaxQueueSize: 999999,
  });
  t.is(config.eventsMaxQueueSize, 999999); // Should keep large valid values
});

// 7. URL scheme validation tests
test('should accept apiEndpoint with https scheme and extract it', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'https://api.example.com',
    appVersion: '1.2.3',
  });
  t.is(config.apiEndpoint, 'api.example.com'); // scheme extracted
  t.is(config.scheme, 'https'); // scheme stored separately
});

test('should accept apiEndpoint with http scheme and extract it', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'http://localhost:9000',
    appVersion: '1.2.3',
  });
  t.is(config.apiEndpoint, 'localhost:9000'); // scheme extracted
  t.is(config.scheme, 'http'); // scheme stored separately
});

test('should use bare hostname with default https scheme', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'api.example.com',
    appVersion: '1.2.3',
  });
  t.is(config.apiEndpoint, 'api.example.com');
  t.is(config.scheme, 'https'); // default scheme
});

test('should use explicit scheme config when no scheme in apiEndpoint', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'localhost:9000',
    appVersion: '1.2.3',
    scheme: 'http',
  });
  t.is(config.apiEndpoint, 'localhost:9000');
  t.is(config.scheme, 'http'); // explicit scheme used
});

test('should override explicit scheme when apiEndpoint contains scheme', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'http://localhost:9000',
    appVersion: '1.2.3',
    scheme: 'https', // This should be ignored
  });
  t.is(config.apiEndpoint, 'localhost:9000');
  t.is(config.scheme, 'http'); // scheme from apiEndpoint takes precedence
});

test('should accept apiEndpoint with port', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'https://api.example.com:8443',
    appVersion: '1.2.3',
  });
  t.is(config.apiEndpoint, 'api.example.com:8443'); // port preserved for non-default port
  t.is(config.scheme, 'https');
});

test('should accept apiEndpoint with default port (port omitted)', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'https://api.example.com:443',
    appVersion: '1.2.3',
  });
  t.is(config.apiEndpoint, 'api.example.com'); // default port omitted
  t.is(config.scheme, 'https');
});

test('should reject apiEndpoint with invalid scheme (ftp)', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        apiEndpoint: 'ftp://api.example.com',
        appVersion: '1.2.3',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.true(error.message.includes('Invalid scheme'));
  t.true(error.message.includes('ftp:'));
});

test('should reject apiEndpoint with invalid scheme (ws)', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        apiEndpoint: 'ws://api.example.com',
        appVersion: '1.2.3',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.true(error.message.includes('Invalid scheme'));
  t.true(error.message.includes('ws:'));
});

test('should reject invalid explicit scheme config', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        apiEndpoint: 'api.example.com',
        appVersion: '1.2.3',
        scheme: 'ftp',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.true(error.message.includes('Invalid scheme'));
  t.true(error.message.includes('ftp'));
});

test('should reject malformed URL in apiEndpoint', (t) => {
  const error = t.throws(
    () =>
      defineBKTConfig({
        apiKey: 'key',
        apiEndpoint: 'ht!tp://invalid url',
        appVersion: '1.2.3',
      }),
    { instanceOf: IllegalArgumentError },
  );
  t.true(error.message.includes('Invalid apiEndpoint URL'));
});

// 8. Retry configuration defaults and validation
test('should use default retry config when not provided', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
  });
  t.is(config.maxRetries, DEFAULT_MAX_RETRIES);
  t.is(config.retryInitialInterval, 1000);
  t.is(config.retryMaxInterval, 10000);
  t.is(config.retryMultiplier, 2.0);
});

test('should accept custom retry config', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    maxRetries: 5,
    retryInitialInterval: 500,
    retryMaxInterval: 20000,
    retryMultiplier: 1.5,
  });
  t.is(config.maxRetries, 5);
  t.is(config.retryInitialInterval, 500);
  t.is(config.retryMaxInterval, 20000);
  t.is(config.retryMultiplier, 1.5);
});

test('should accept maxRetries = 0 to disable retries', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    maxRetries: 0,
  });
  t.is(config.maxRetries, 0);
});

test('should reset negative maxRetries to default', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    maxRetries: -1,
  });
  t.is(config.maxRetries, DEFAULT_MAX_RETRIES);
});

test('should reset negative retryInitialInterval to default', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    retryInitialInterval: -100,
    retryMultiplier: -1,
  });
  t.is(config.retryInitialInterval, 1000);
  t.is(config.retryMultiplier, 2.0);
});

test('should reset zero retryInitialInterval to default', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    retryInitialInterval: 0,
  });
  t.is(config.retryInitialInterval, 1000);
});

test('should reset retryMaxInterval to default when less than retryInitialInterval', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    retryInitialInterval: 5000,
    retryMaxInterval: 1000,
    retryMultiplier: 0,
  });
  // Math.max(5000, DEFAULT=10000) = 10000
  t.is(config.retryMaxInterval, 10000);
  t.is(config.retryMultiplier, 2.0);
});

test('should adjust retryMaxInterval to retryInitialInterval when retryInitialInterval exceeds default max', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    retryInitialInterval: 15000,
    retryMaxInterval: 5000,
  });
  // Math.max(15000, DEFAULT=10000) = 15000
  t.is(config.retryMaxInterval, 15000);
});

test('should accept retryMaxInterval = 0 (no cap)', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    retryMaxInterval: 0,
  });
  t.is(config.retryMaxInterval, 0);
});

test('retry config coexists correctly with other options', (t) => {
  const config = defineBKTConfig({
    apiKey: 'key',
    apiEndpoint: 'endpoint',
    appVersion: '1.2.3',
    maxRetries: 5,
    retryInitialInterval: 500,
    retryMaxInterval: 15000,
    retryMultiplier: 3.0,
    eventsFlushInterval: 30000,
    cachePollingInterval: 120000,
  });
  t.is(config.maxRetries, 5);
  t.is(config.retryInitialInterval, 500);
  t.is(config.retryMaxInterval, 15000);
  t.is(config.retryMultiplier, 3.0);
  t.is(config.eventsFlushInterval, 30000);
  t.is(config.cachePollingInterval, 120000);
});
