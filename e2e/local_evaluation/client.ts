import test from 'ava';
import { DefaultLogger, initializeBKTClient, defineBKTConfig } from '../../lib';
import {
  HOST,
  TOKEN,
  FEATURE_TAG,
  TARGETED_USER_ID,
  FEATURE_ID_BOOLEAN,
  SERVER_ROLE_TOKEN,
} from '../constants/constants';
import { isMetricsEvent, MetricsEvent } from '../../lib/objects/metricsEvent';
import { BKTClientImpl } from '../../lib/client';
import { InvalidStatusError } from '../../lib/objects/errors';
import { ApiId } from '../../lib/objects/apiId';

const FORBIDDEN_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ForbiddenErrorMetricsEvent';
const NOT_FOUND_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NotFoundErrorMetricsEvent';

test('Using a random string in the api key setting should not throw exception', async (t) => {
  const config = defineBKTConfig({
    apiEndpoint: HOST,
    apiKey: 'TOKEN_RANDOM',
    featureTag: FEATURE_TAG,
    cachePollingInterval: 15000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger('error'),
  });
  const bktClient = initializeBKTClient(config);
  // waitForInitialization will throw exception if the client initialization fails
  // due to invalid api key
  // We will check the exception below
  const error = (await t.throwsAsync(
    bktClient.waitForInitialization({ timeout: 5000 }),
  )) as InvalidStatusError;
  t.true(error instanceof InvalidStatusError);
  t.is(error.code, 403);

  // Even if the initialization fails, other methods should work and return the default value
  const user = { id: TARGETED_USER_ID, data: {} };
  // The client can not load the evaluation, we will received the default value `true`
  // Other SDK clients e2e test will expect the value is `false`
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, true));
  t.true(result);

  const bktClientImpl = bktClient as BKTClientImpl;
  const events = bktClientImpl.eventStore.getAll();
  // The SDK skips generating error events for unauthorized errors, so no error events should be present
  t.false(
    events.some((e) => {
      if (isMetricsEvent(e.event)) {
        const metrics = e.event as MetricsEvent;
        return (
          metrics.event?.['@type'] === FORBIDDEN_ERROR_METRICS_EVENT_NAME &&
          metrics.event?.apiId === ApiId.GET_EVALUATION
        );
      }
      return false;
    }),
  );

  bktClient.destroy();
});

test('altering featureTag should not affect api request', async (t) => {
  const config = defineBKTConfig({
    apiEndpoint: HOST,
    apiKey: SERVER_ROLE_TOKEN,
    featureTag: FEATURE_TAG,
    cachePollingInterval: 15000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger('error'),
  });

  const bktClient = initializeBKTClient(config);
  await bktClient.waitForInitialization({ timeout: 5000 });

  const user = { id: TARGETED_USER_ID, data: {} };
  const result = await t.notThrowsAsync(
    bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false),
  );
  t.true(result);
  config.featureTag = 'RANDOME';

  const resultAfterAlterAPIKey = await t.notThrowsAsync(
    bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false),
  );
  t.true(resultAfterAlterAPIKey);

  bktClient.destroy();
});

test('Altering the api key should not affect api request', async (t) => {
  const config = defineBKTConfig({
    apiEndpoint: HOST,
    apiKey: SERVER_ROLE_TOKEN,
    featureTag: FEATURE_TAG,
    cachePollingInterval: 15000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger('error'),
  });

  const bktClient = initializeBKTClient(config);
  await bktClient.waitForInitialization({ timeout: 5000 });

  const user = { id: TARGETED_USER_ID, data: {} };
  const result = await t.notThrowsAsync(
    bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false),
  );
  t.true(result);
  config.apiKey = 'RANDOME';

  const resultAfterAlterAPIKey = await t.notThrowsAsync(
    bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false),
  );
  t.true(resultAfterAlterAPIKey);

  bktClient.destroy();
});

// local evaluation mode is using GPRC API, 
// its different from the REST API v1 is using for none local evaluation mode
// So the behavior of this test is same with other SDK clients
test('Using a random string in the featureTag setting should not affect api request', async (t) => {
  const config = defineBKTConfig({
    apiEndpoint: HOST,
    apiKey: SERVER_ROLE_TOKEN,
    featureTag: 'RANDOM',
    cachePollingInterval: 15000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger('error'),
  });
  const bktClient = initializeBKTClient(config);

  await bktClient.waitForInitialization({ timeout: 5000 });

  const user = { id: TARGETED_USER_ID, data: {} };
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, true));
  // The client can not load the evaluation, we will received the default value `true`
  // Other SDK clients e2e test will expect the value is `false`
  t.true(result);

  const bktClientImpl = bktClient as BKTClientImpl;
  const events = bktClientImpl.eventStore.getAll();
  t.false(
    events.some((e) => {
      if (isMetricsEvent(e.event)) {
        const metrics = e.event as MetricsEvent;
        return (
          metrics.event?.['@type'] === NOT_FOUND_ERROR_METRICS_EVENT_NAME &&
          metrics.event?.apiId === ApiId.GET_EVALUATION
        );
      }
      return false;
    }),
  );

  bktClient.destroy();
});
