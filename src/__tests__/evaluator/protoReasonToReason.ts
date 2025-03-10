import test from 'ava';
import { protoReasonToReason } from '../../evaluator/local';
import {
  Reason as ProtoReason,
} from '@bucketeer/evaluation';

const testCases = [
  {
    input: undefined,
    expected: { type: 'DEFAULT' },
  },
  {
    input: {
      getType: () => ProtoReason.Type.RULE,
      getRuleId: () => 'rule-123',
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
    } as ProtoReason,
    expected: {
      type: 'PREREQUISITE',
      ruleId: 'rule-1233',
    },
  },
];

testCases.forEach(({ input, expected }, index) => {
  test(`protoReasonToReason test case ${index + 1}`, (t) => {
    const result = protoReasonToReason(input);
    t.deepEqual(result, expected);
  });
});