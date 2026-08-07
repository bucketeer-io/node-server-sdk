import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, defineBKTConfig, initializeBKTClient } from '../../lib';
import {
  API_ENDPOINT,
  SCHEME,
  FEATURE_TAG,
  FEATURE_ID_RULE_SEGMENT,
  FEATURE_ID_RULE_SEGMENT_AND_ATTRIBUTE,
  FEATURE_ID_STRING,
  RULE_SEGMENT_LIST_ONLY_USER_ID,
  TARGETED_SEGMENT_USER_ID,
  SERVER_API_KEY,
} from '../constants/constants';

/**
 * E2E tests for rule-based segments (Bucketeer server 2.3.0+) on the
 * local-evaluation path. A segment carries attribute-based rules in addition
 * to its uploaded included-user list; a user belongs to the segment if they
 * are in the list OR match any rule. Clauses within a rule are AND-ed,
 * rules are OR-ed.
 *
 * Required fixtures in the test environment:
 *
 * Segment `nodejs-server-e2e-rule-based-segment`:
 *   - Uploaded included-user list: [RULE_SEGMENT_LIST_ONLY_USER_ID]
 *   - Rule 1 (clauses AND-ed):
 *       `plan`    EQUALS      `premium`
 *       `country` IN          [`japan`, `vietnam`]
 *   - Rule 2 (clauses AND-ed):
 *       `tier`    STARTS_WITH `gold`
 *       `age`     GREATER     `18`
 *       `age`     LESS        `65`
 *
 * Flag FEATURE_ID_RULE_SEGMENT (string flag, tag `nodejs`, enabled):
 *   - Variations: `value-1` (name `variation 1`), `value-2` (name `variation 2`)
 *   - Rule: user is included in segment `nodejs-server-e2e-rule-based-segment`
 *       -> serve `value-2`
 *   - Default strategy: serve `value-1`
 *
 * Flag FEATURE_ID_RULE_SEGMENT_AND_ATTRIBUTE (string flag, tag `nodejs`, enabled):
 *   - Variations: `value-1` (name `variation 1`), `value-2` (name `variation 2`)
 *   - Rule with TWO clauses in the SAME rule (AND-ed):
 *       user is included in segment `nodejs-server-e2e-rule-based-segment`
 *       AND `country` EQUALS `japan`
 *       -> serve `value-2`
 *   - Default strategy: serve `value-1`
 *
 * Variation IDs are environment-generated UUIDs, so assertions check the
 * variation value and the evaluation reason instead.
 */

const test = anyTest as TestFn<{ bktClient: Bucketeer }>;

test.before(async (t) => {
  const config = defineBKTConfig({
    apiEndpoint: API_ENDPOINT,
    scheme: SCHEME,
    apiKey: SERVER_API_KEY,
    featureTag: FEATURE_TAG,
    logger: new DefaultLogger('error'),
    enableLocalEvaluation: true,
    cachePollingInterval: 15000,
  });
  t.context = {
    bktClient: initializeBKTClient(config),
  };
  // Waiting for the cache available
  await t.context.bktClient.waitForInitialization({ timeout: 5000 });
});

test.after(async (t) => {
  const { bktClient } = t.context;
  bktClient.destroy();
});

test('segment rule match: all AND clauses of rule 1 satisfied (equals + in)', async (t) => {
  const { bktClient } = t.context;
  const user = {
    id: 'nodejs-server-e2e-rule-segment-user-rule-1',
    data: { plan: 'premium', country: 'japan' },
  };
  t.is(await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT, ''), 'value-2');
  const details = await bktClient.stringVariationDetails(user, FEATURE_ID_RULE_SEGMENT, '');
  t.is(details.reason, 'RULE');
});

test('segment rule match: rule 2 satisfied (starts-with + numeric greater/less)', async (t) => {
  const { bktClient } = t.context;
  const user = {
    id: 'nodejs-server-e2e-rule-segment-user-rule-2',
    data: { tier: 'gold-plus', age: '30' },
  };
  t.is(await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT, ''), 'value-2');
  const details = await bktClient.stringVariationDetails(user, FEATURE_ID_RULE_SEGMENT, '');
  t.is(details.reason, 'RULE');
});

test('mixed segment: user matches by uploaded list only (no rule matches)', async (t) => {
  const { bktClient } = t.context;
  const user = {
    id: RULE_SEGMENT_LIST_ONLY_USER_ID,
    data: { plan: 'free' },
  };
  t.is(await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT, ''), 'value-2');
  const details = await bktClient.stringVariationDetails(user, FEATURE_ID_RULE_SEGMENT, '');
  t.is(details.reason, 'RULE');
});

test('mixed segment: user matching neither the list nor any rule gets the default', async (t) => {
  const { bktClient } = t.context;
  const user = {
    id: 'nodejs-server-e2e-rule-segment-user-no-match',
    data: { plan: 'free', country: 'usa', tier: 'silver', age: '30' },
  };
  t.is(await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT, ''), 'value-1');
  const details = await bktClient.stringVariationDetails(user, FEATURE_ID_RULE_SEGMENT, '');
  t.is(details.reason, 'DEFAULT');
});

test('AND within a rule: satisfying only one clause of rule 1 does not match', async (t) => {
  const { bktClient } = t.context;
  const user = {
    id: 'nodejs-server-e2e-rule-segment-user-partial',
    data: { plan: 'premium', country: 'usa' },
  };
  t.is(await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT, ''), 'value-1');
  const details = await bktClient.stringVariationDetails(user, FEATURE_ID_RULE_SEGMENT, '');
  t.is(details.reason, 'DEFAULT');
});

test('user missing the rule attributes entirely does not match', async (t) => {
  const { bktClient } = t.context;
  const user = {
    id: 'nodejs-server-e2e-rule-segment-user-no-attributes',
    data: {},
  };
  t.is(await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT, ''), 'value-1');
  const details = await bktClient.stringVariationDetails(user, FEATURE_ID_RULE_SEGMENT, '');
  t.is(details.reason, 'DEFAULT');
});

test('flag rule combining SEGMENT clause AND attribute clause: both satisfied', async (t) => {
  const { bktClient } = t.context;
  // In the segment via rule 1 AND country=japan satisfies the extra clause.
  const user = {
    id: 'nodejs-server-e2e-rule-segment-attr-user-match',
    data: { plan: 'premium', country: 'japan' },
  };
  t.is(
    await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT_AND_ATTRIBUTE, ''),
    'value-2',
  );
  const details = await bktClient.stringVariationDetails(
    user,
    FEATURE_ID_RULE_SEGMENT_AND_ATTRIBUTE,
    '',
  );
  t.is(details.reason, 'RULE');
});

test('flag rule combining SEGMENT clause AND attribute clause: in segment but attribute clause fails', async (t) => {
  const { bktClient } = t.context;
  // In the segment via rule 2, but country is not japan, so the AND-ed
  // attribute clause of the flag rule fails.
  const user = {
    id: 'nodejs-server-e2e-rule-segment-attr-user-no-attr-match',
    data: { tier: 'gold-plus', age: '30', country: 'usa' },
  };
  t.is(
    await bktClient.stringVariation(user, FEATURE_ID_RULE_SEGMENT_AND_ATTRIBUTE, ''),
    'value-1',
  );
  const details = await bktClient.stringVariationDetails(
    user,
    FEATURE_ID_RULE_SEGMENT_AND_ATTRIBUTE,
    '',
  );
  t.is(details.reason, 'DEFAULT');
});

test('backward compat: list-only segment (no rules) still evaluates as before', async (t) => {
  const { bktClient } = t.context;
  // FEATURE_ID_STRING targets a segment that only has an uploaded user list.
  const user = { id: TARGETED_SEGMENT_USER_ID, data: {} };
  t.is(await bktClient.stringVariation(user, FEATURE_ID_STRING, ''), 'value-3');
  const details = await bktClient.stringVariationDetails(user, FEATURE_ID_STRING, '');
  t.is(details.reason, 'RULE');
});
