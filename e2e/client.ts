import test from 'ava'
import { initialize, DefaultLogger } from '../lib';
import { HOST, TOKEN, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN } from './constants/constants';

//Note: This is different compared to other SDK clients.
test('Using a random string in the api key setting should not throw exception', async (t) => {
  const bktClient = initialize({
    host: HOST,
    token: "TOKEN_RANDOM",
    tag: FEATURE_TAG,
    logger: new DefaultLogger("error")
  });
  const user = { id: TARGETED_USER_ID, data: {} }
  // Can not load the evaluation (the correct value should be `false`, but we will received the default value `true`)
  const result = await t.notThrowsAsync(bktClient.getBoolVariation(user, FEATURE_ID_BOOLEAN, true));
  t.true(result);
});

test('altering featureTag should not affect api request', async (t) => {
  const config = {
    host: HOST,
    token: "TOKEN_RANDOM",
    tag: FEATURE_TAG,
    logger: new DefaultLogger("error")
  }
  const bktClient = initialize(config);
  const user = { id: TARGETED_USER_ID, data: {} }
  const result = await t.notThrowsAsync(bktClient.getBoolVariation(user, FEATURE_ID_BOOLEAN, true));
  t.true(result);
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
  const result = await t.notThrowsAsync(bktClient.getBoolVariation(user, FEATURE_ID_BOOLEAN, false));
  t.true(result);
  config.token = "RANDOME"

  const resultAfterAlterAPIKey = await t.notThrowsAsync(bktClient.getBoolVariation(user, FEATURE_ID_BOOLEAN, false));
  t.true(resultAfterAlterAPIKey);
});

//Note: This is different compared to other SDK clients.
test('Using a random string in the featureTag setting should affect api request', async (t) => {
  const bktClient = initialize({
    host: HOST,
    token: TOKEN,
    tag: "RANDOM",
    logger: new DefaultLogger("error")
  });
  const user = { id: TARGETED_USER_ID, data: {} }
  const result = await t.notThrowsAsync(bktClient.getBoolVariation(user, FEATURE_ID_BOOLEAN, true));
  // Can not load the evaluation (the correct value should be `false`, but we will received the default value `true`)
  t.true(result);
});