import anyTest, { TestFn } from 'ava';
import { Bucketeer, DefaultLogger, User, defineBKTConfig, initializeBKTClient } from '../../lib';
import {
  API_ENDPOINT,
  SCHEME,
  FEATURE_TAG,
  FEATURE_ID_RULE_BASED_SEGMENT,
  FEATURE_ID_SEGMENT_AND_ATTRIBUTE,
  FEATURE_ID_STRING,
  RULE_BASED_SEGMENT_DEFAULT_VARIATION,
  RULE_BASED_SEGMENT_MATCHED_VARIATION,
  RULE_BASED_SEGMENT_LISTED_USER_ID,
  TARGETED_SEGMENT_USER_ID,
  SERVER_API_KEY,
} from '../constants/constants';

/**
 * E2E tests for rule-based segments on the local-evaluation path.
 * A segment carries attribute-based rules in addition to its uploaded
 * included-user list; a user belongs to the segment if they are in the list
 * OR match any rule. Clauses within a rule are AND-ed, rules are OR-ed.
 *
 * These tests require the following fixtures to be configured in the
 * test environment:
 *
 * Segment "nodejs-server-e2e-rule-based" (mixed: uploaded user list AND rules):
 *   - Uploaded included-user list: RULE_BASED_SEGMENT_LISTED_USER_ID
 *   - Rule 1 (clauses are AND-ed):
 *       country EQUALS "japan"
 *       AND age GREATER "19"
 *       AND age LESS "60"
 *   - Rule 2 (clauses are AND-ed):
 *       email STARTS_WITH "test@"
 *       AND plan IN ["premium", "enterprise"]
 *   (Rules are OR-ed: a user matching either rule is in the segment)
 *
 * Flag FEATURE_ID_RULE_BASED_SEGMENT (string, tag `nodejs`, enabled):
 *   - Variations: value-1, value-2
 *   - Targeting rule: user is included in segment "nodejs-server-e2e-rule-based" -> value-2
 *   - Default strategy: value-1
 *
 * Flag FEATURE_ID_SEGMENT_AND_ATTRIBUTE (string, tag `nodejs`, enabled):
 *   - Variations: value-1, value-2
 *   - Targeting rule (single rule, two AND-ed clauses):
 *       user is included in segment "nodejs-server-e2e-rule-based"
 *       AND region EQUALS "tokyo"
 *     -> value-2
 *   - Default strategy: value-1
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

// Verifies the segment rule evaluation semantics: rules are OR-ed,
// and the clauses within a rule are AND-ed.
const multipleRulesTestCases: { desc: string; user: User; expected: string }[] = [
  {
    desc: 'match rule 1: country equals AND age within the greater/less bounds',
    user: { id: 'rule-based-user-1', data: { country: 'japan', age: '30' } },
    expected: RULE_BASED_SEGMENT_MATCHED_VARIATION,
  },
  {
    desc: 'match rule 2: email starts-with AND plan in',
    user: { id: 'rule-based-user-2', data: { email: 'test@bucketeer.io', plan: 'premium' } },
    expected: RULE_BASED_SEGMENT_MATCHED_VARIATION,
  },
  {
    desc: 'no match: age is out of the less bound (clauses are AND-ed)',
    user: { id: 'rule-based-user-3', data: { country: 'japan', age: '65' } },
    expected: RULE_BASED_SEGMENT_DEFAULT_VARIATION,
  },
  {
    desc: 'no match: plan is not in the values (clauses are AND-ed)',
    user: { id: 'rule-based-user-4', data: { email: 'test@bucketeer.io', plan: 'free' } },
    expected: RULE_BASED_SEGMENT_DEFAULT_VARIATION,
  },
  {
    desc: "no match: the rule's attribute is missing entirely",
    user: {
      id: 'rule-based-user-5',
      // The age attribute required by rule 1 is missing,
      // and no attribute required by rule 2 is set
      data: { country: 'japan' },
    },
    expected: RULE_BASED_SEGMENT_DEFAULT_VARIATION,
  },
];

for (const tc of multipleRulesTestCases) {
  test(`rule-based segment multiple rules: ${tc.desc}`, async (t) => {
    const { bktClient } = t.context;
    t.is(
      await bktClient.stringVariation(tc.user, FEATURE_ID_RULE_BASED_SEGMENT, 'default'),
      tc.expected,
    );
  });
}

// Verifies that a user belongs to a mixed segment (uploaded user list AND rules)
// when the user is in the list OR matches any rule.
const mixedListAndRulesTestCases: { desc: string; user: User; expected: string }[] = [
  {
    desc: "match by the uploaded user list only (attributes don't match the rules)",
    user: { id: RULE_BASED_SEGMENT_LISTED_USER_ID, data: { country: 'france' } },
    expected: RULE_BASED_SEGMENT_MATCHED_VARIATION,
  },
  {
    desc: 'match by the rules only (user is not in the uploaded user list)',
    user: { id: 'rule-based-user-not-listed', data: { country: 'japan', age: '25' } },
    expected: RULE_BASED_SEGMENT_MATCHED_VARIATION,
  },
  {
    desc: "no match: user is not in the uploaded user list and doesn't match the rules",
    user: { id: 'rule-based-user-no-match', data: { country: 'france' } },
    expected: RULE_BASED_SEGMENT_DEFAULT_VARIATION,
  },
];

for (const tc of mixedListAndRulesTestCases) {
  test(`rule-based segment mixed list and rules: ${tc.desc}`, async (t) => {
    const { bktClient } = t.context;
    t.is(
      await bktClient.stringVariation(tc.user, FEATURE_ID_RULE_BASED_SEGMENT, 'default'),
      tc.expected,
    );
  });
}

// Verifies a flag rule that combines a SEGMENT clause with an additional
// attribute clause in the same rule (segment membership AND region equals "tokyo").
const segmentAndAttributeTestCases: { desc: string; user: User; expected: string }[] = [
  {
    desc: 'match: in the segment by rules AND the region attribute matches',
    user: {
      id: 'segment-attribute-user-1',
      data: { country: 'japan', age: '30', region: 'tokyo' },
    },
    expected: RULE_BASED_SEGMENT_MATCHED_VARIATION,
  },
  {
    desc: "no match: in the segment by rules but the region attribute doesn't match",
    user: {
      id: 'segment-attribute-user-2',
      data: { country: 'japan', age: '30', region: 'osaka' },
    },
    expected: RULE_BASED_SEGMENT_DEFAULT_VARIATION,
  },
  {
    desc: 'no match: the region attribute matches but the user is not in the segment',
    user: { id: 'segment-attribute-user-3', data: { country: 'france', region: 'tokyo' } },
    expected: RULE_BASED_SEGMENT_DEFAULT_VARIATION,
  },
];

for (const tc of segmentAndAttributeTestCases) {
  test(`rule-based segment with attribute clause: ${tc.desc}`, async (t) => {
    const { bktClient } = t.context;
    t.is(
      await bktClient.stringVariation(tc.user, FEATURE_ID_SEGMENT_AND_ATTRIBUTE, 'default'),
      tc.expected,
    );
  });
}

// Verifies that a segment configured only with an uploaded user list (no rules)
// still evaluates as before.
const listOnlyBackwardCompatibilityTestCases: { desc: string; user: User; expected: string }[] = [
  {
    desc: 'match by the uploaded user list',
    user: { id: TARGETED_SEGMENT_USER_ID, data: {} },
    expected: 'value-3',
  },
  {
    desc: 'no match: user is not in the uploaded user list',
    user: { id: 'list-only-segment-user-no-match', data: {} },
    expected: 'value-1',
  },
];

for (const tc of listOnlyBackwardCompatibilityTestCases) {
  test(`list-only segment backward compatibility: ${tc.desc}`, async (t) => {
    const { bktClient } = t.context;
    t.is(await bktClient.stringVariation(tc.user, FEATURE_ID_STRING, 'default'), tc.expected);
  });
}
