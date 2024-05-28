import test from 'ava'
import { initialize, DefaultLogger } from '../lib';
import { HOST, TOKEN, FEATURE_TAG, TARGETED_USER_ID, FEATURE_ID_BOOLEAN } from './constants/constants';

test('Using a random string in the api key setting should not throw exception', async (t) => {
    const bktClient = initialize({
        host: HOST,
        token: "TOKEN_RANDOM",
        tag: FEATURE_TAG,
        logger: new DefaultLogger("error")
      });
    const user = { id: TARGETED_USER_ID, data: {} }
    const result = await t.notThrowsAsync(bktClient.getBoolVariation(user, FEATURE_ID_BOOLEAN, true));
    t.true(result);
  });