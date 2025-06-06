import test from 'ava'
import { initialize, DefaultLogger } from '../lib';
import { HOST, TOKEN, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN } from './constants/constants';
import { MetricsEvent, isMetricsEvent } from '../lib/objects/metricsEvent';
import { ApiId } from '../lib/objects/apiId';
import { BKTClientImpl } from '../lib/client';

const FORBIDDEN_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.ForbiddenErrorMetricsEvent';
const NOT_FOUND_ERROR_METRICS_EVENT_NAME =
  'type.googleapis.com/bucketeer.event.client.NotFoundErrorMetricsEvent';

//Note: There is a different compared to other SDK clients.
test('Using a random string in the api key setting should not throw exception', async (t) => {
  const bktClient = initialize({
    host: HOST,
    token: "TOKEN_RANDOM",
    tag: FEATURE_TAG,
    logger: new DefaultLogger("error")
  });
  const user = { id: TARGETED_USER_ID, data: {} }
  // The client can not load the evaluation, we will received the default value `true`
  // Other SDK clients e2e test will expect the value is `false`
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, true));
  t.true(result);

  const bktClientImpl = bktClient as BKTClientImpl
  const events = bktClientImpl.eventStore.getAll()
  // The SDK skips generating error events for unauthorized errors, so no error events should be present
  t.false(events.some((e) => {
    if (isMetricsEvent(e.event)) {
      const metrics = e.event as MetricsEvent
      return metrics.event?.['@type'] === FORBIDDEN_ERROR_METRICS_EVENT_NAME && metrics.event?.apiId === ApiId.GET_EVALUATION
    }
    return false;
  }));

  bktClient.destroy()
});

test('altering featureTag should not affect api request', async (t) => {
  const config = {
    host: HOST,
    token: TOKEN,
    tag: FEATURE_TAG,
    logger: new DefaultLogger("error")
  }
  const bktClient = initialize(config);
  const user = { id: TARGETED_USER_ID, data: {} }
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false));
  t.true(result);
  config.tag = "RANDOME"

  const resultAfterAlterAPIKey = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false));
  t.true(resultAfterAlterAPIKey);

  bktClient.destroy()
});

test('Altering the api key should not affect api request', async (t) => {
  const config = {
    host: HOST,
    token: TOKEN,
    tag: FEATURE_TAG,
    logger: new DefaultLogger("error")
  }
  const bktClient = initialize(config);
  const user = { id: TARGETED_USER_ID, data: {} }
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false));
  t.true(result);
  config.token = "RANDOME"

  const resultAfterAlterAPIKey = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, false));
  t.true(resultAfterAlterAPIKey);

  bktClient.destroy()
});

//Note: There is a different compared to other SDK clients.
test('Using a random string in the featureTag setting should affect api request', async (t) => {
  const bktClient = initialize({
    host: HOST,
    token: TOKEN,
    tag: "RANDOM",
    logger: new DefaultLogger("error")
  });
  const user = { id: TARGETED_USER_ID, data: {} }
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, true));
  // The client can not load the evaluation, we will received the default value `true`
  // Other SDK clients e2e test will expect the value is `false`
  t.true(result);

  const bktClientImpl = bktClient as BKTClientImpl
  const events = bktClientImpl.eventStore.getAll()
  t.true(events.some((e) => {
    if (isMetricsEvent(e.event)) {
      const metrics = e.event as MetricsEvent
      return metrics.event?.['@type'] === NOT_FOUND_ERROR_METRICS_EVENT_NAME && metrics.event?.apiId === ApiId.GET_EVALUATION
    }
    return false;
  }));

  bktClient.destroy()
});