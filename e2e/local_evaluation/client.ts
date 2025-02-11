import test from 'ava'
import { initialize, DefaultLogger } from '../../lib';
import { HOST, TOKEN, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN, SERVER_ROLE_TOKEN } from '../constants/constants';
import { isMetricsEvent } from '../../lib/objects/metricsEvent';
import { BKTClientImpl } from '../../lib/client';

test('Using a random string in the api key setting should not throw exception', async (t) => {
  const bktClient = initialize({
    host: HOST,
    token: "TOKEN_RANDOM",
    tag: FEATURE_TAG,
    cachePollingInterval: 1000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger("error")
  });

  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

  const user = { id: TARGETED_USER_ID, data: {} }
  // The client can not load the evaluation, we will received the default value `true`
  // Other SDK clients e2e test will expect the value is `false`
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, true));
  t.true(result);

  const bktClientImpl = bktClient as BKTClientImpl
  const events = bktClientImpl.eventStore.getAll()
  t.true(events.some((e) => {
    return isMetricsEvent(e.event);
  }));

  bktClient.destroy()
});

test('altering featureTag should not affect api request', async (t) => {
  const config = {
    host: HOST,
    token: SERVER_ROLE_TOKEN,
    tag: FEATURE_TAG,
    cachePollingInterval: 1000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger("error")
  }

  const bktClient = initialize(config);
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

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
    token: SERVER_ROLE_TOKEN,
    tag: FEATURE_TAG,
    cachePollingInterval: 1000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger("error")
  }

  const bktClient = initialize(config);
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

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
    token: SERVER_ROLE_TOKEN,
    tag: "RANDOM",
    cachePollingInterval: 1000,
    enableLocalEvaluation: true,
    logger: new DefaultLogger("error")
  });

  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

  const user = { id: TARGETED_USER_ID, data: {} }
  const result = await t.notThrowsAsync(bktClient.booleanVariation(user, FEATURE_ID_BOOLEAN, true));
  // The client can not load the evaluation, we will received the default value `true`
  // Other SDK clients e2e test will expect the value is `false`
  t.true(result);

  const bktClientImpl = bktClient as BKTClientImpl
  const events = bktClientImpl.eventStore.getAll()
  t.true(events.some((e) => {
    return isMetricsEvent(e.event);
  }));

  bktClient.destroy()
});