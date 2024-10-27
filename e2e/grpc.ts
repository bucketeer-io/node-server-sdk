import test from 'ava';
import { GRPCClient } from '../../grpc/client';

test('getfeatureFlags', async (t) => {
  // Do this first, before you make any grpc requests!
  const client = new GRPCClient(
    '',
    '',
  );
  /*
  {
    "requested_at": "0",
    "sdk_version": "non labore ea",
    "source_id": "NODE_SERVER",
    "tag": "android"
}
  */
  try {
    const result = await client.getFeatureFlags({
      requestedAt: 0,
      version: '1.0.0',
      tag: 'android',
      featureFlagsId:'',
    })
    t.is(result.getFeatureFlagsId(), '189622019847430578');
  } catch(ex) {
    console.log(ex);
    t.fail();
  }
});
