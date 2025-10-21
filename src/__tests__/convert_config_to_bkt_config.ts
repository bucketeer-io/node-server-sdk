import test from 'ava';
import { convertConfigToBKTConfig } from '../config';
import { DefaultLogger } from '../logger';
import { SourceId } from '../objects/sourceId';
import { nodeSDKVersion } from '../objects/version';

test('should convert Config to BKTConfig with defaults', (t) => {
  const config = {
    host: 'https://api.example.com',
    token: 'test-token',
    tag: 'test-tag',
  };

  const bktConfig = convertConfigToBKTConfig(config);

  t.is(bktConfig.apiKey, 'test-token');
  t.is(bktConfig.apiEndpoint, 'https://api.example.com');
  t.is(bktConfig.featureTag, 'test-tag');
  t.is(bktConfig.eventsFlushInterval, 10000); // Default value
  t.is(bktConfig.eventsMaxQueueSize, 50); // Default value
  t.is(bktConfig.cachePollingInterval, 60000); // Default value
  t.is(bktConfig.appVersion, '1.0.0'); // Default value
  t.true(bktConfig.logger instanceof DefaultLogger); // Default logger
  t.false(bktConfig.enableLocalEvaluation); // Default value
  t.is(bktConfig.cachePollingInterval, 60000); // Default value
});

test('should override defaults with provided values', (t) => {
  const logger = new DefaultLogger();
  const config = {
    host: 'https://api.example.com',
    token: 'test-token',
    tag: 'test-tag',
    pollingIntervalForRegisterEvents: 30000,
    logger: logger,
    enableLocalEvaluation: true,
    cachePollingInterval: 120000,
  };

  const bktConfig = convertConfigToBKTConfig(config);

  t.is(bktConfig.apiKey, 'test-token');
  t.is(bktConfig.apiEndpoint, 'https://api.example.com');
  t.is(bktConfig.featureTag, 'test-tag');
  t.is(bktConfig.eventsFlushInterval, 30000); // Overridden value
  t.is(bktConfig.eventsMaxQueueSize, 50); // Default value
  t.is(bktConfig.appVersion, '1.0.0'); // Default value
  t.true(bktConfig.logger === logger); // Overridden logger
  t.true(bktConfig.enableLocalEvaluation); // Overridden value
  t.is(bktConfig.cachePollingInterval, 120000); // Overridden value
});

test('should include sourceId and sdkVersion in the converted config', (t) => {
  const config = {
    host: 'https://api.example.com',
    token: 'test-token',
    tag: 'test-tag',
  };

  const bktConfig = convertConfigToBKTConfig(config);

  t.is(bktConfig.sourceId, SourceId.NODE_SERVER); // Default sourceId
  t.is(bktConfig.sdkVersion, nodeSDKVersion); // Default SDK version
});
