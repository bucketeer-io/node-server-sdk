import test from 'ava';
import { protoReasonToReason } from '../../evaluator/local';
import { Reason as ProtoReason, createReason } from '@bucketeer/evaluation';

const testCases = [
  {
    input: undefined,
    expected: { type: 'DEFAULT' },
  },
  {
    input: {
      getType: () => ProtoReason.Type.RULE,
      getRuleId: () => 'rule-123',
      getHoldoutGroupId: () => '',
    } as ProtoReason,
    expected: {
      type: 'RULE',
      ruleId: 'rule-123',
    },
  },
  {
    input: {
      getType: () => ProtoReason.Type.TARGET,
      getRuleId: () => 'rule-123',
      getHoldoutGroupId: () => '',
    } as ProtoReason,
    expected: {
      type: 'TARGET',
      ruleId: 'rule-123',
    },
  },
  {
    input: {
      getType: () => ProtoReason.Type.ERROR_EXCEPTION,
      getRuleId: () => 'rule-123',
      getHoldoutGroupId: () => '',
    } as ProtoReason,
    expected: {
      type: 'DEFAULT',
      ruleId: 'rule-123',
    },
  },
  {
    input: {
      getType: () => ProtoReason.Type.DEFAULT,
      getRuleId: () => 'rule-123',
      getHoldoutGroupId: () => '',
    } as ProtoReason,
    expected: {
      type: 'DEFAULT',
      ruleId: 'rule-123',
    },
  },
  {
    input: {
      getType: () => ProtoReason.Type.CLIENT,
      getRuleId: () => 'rule-1235',
      getHoldoutGroupId: () => '',
    } as ProtoReason,
    expected: {
      type: 'CLIENT',
      ruleId: 'rule-1235',
    },
  },
  {
    input: {
      getType: () => ProtoReason.Type.OFF_VARIATION,
      getRuleId: () => 'rule-1234',
      getHoldoutGroupId: () => '',
    } as ProtoReason,
    expected: {
      type: 'OFF_VARIATION',
      ruleId: 'rule-1234',
    },
  },
  {
    input: {
      getType: () => ProtoReason.Type.PREREQUISITE,
      getRuleId: () => 'rule-1233',
      getHoldoutGroupId: () => '',
    } as ProtoReason,
    expected: {
      type: 'PREREQUISITE',
      ruleId: 'rule-1233',
    },
  },
  {
    input: {
      getType: () => ProtoReason.Type.HOLDOUT,
      getRuleId: () => '',
      getHoldoutGroupId: () => 'holdout-group-id-1',
    } as ProtoReason,
    expected: {
      type: 'HOLDOUT',
      ruleId: '',
      holdoutGroupId: 'holdout-group-id-1',
    },
  },
];

testCases.forEach(({ input, expected }, index) => {
  test(`protoReasonToReason test case ${index + 1}`, (t) => {
    const result = protoReasonToReason(input);
    t.deepEqual(result, expected);
  });
});

test('protoReasonToReason maps the HOLDOUT reason the evaluator creates', (t) => {
  const result = protoReasonToReason(
    createReason('', ProtoReason.Type.HOLDOUT, 'holdout-group-id-1'),
  );

  t.deepEqual(result, { type: 'HOLDOUT', ruleId: '', holdoutGroupId: 'holdout-group-id-1' });
});

test('protoReasonToReason leaves holdoutGroupId out of a reason without a group', (t) => {
  const result = protoReasonToReason(createReason('rule-123', ProtoReason.Type.RULE));

  t.deepEqual(result, { type: 'RULE', ruleId: 'rule-123' });
  t.false('holdoutGroupId' in result);
});
