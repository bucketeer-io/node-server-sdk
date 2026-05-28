import test from 'ava';
import {
  normalizeEnumName,
  getUnsupportedEnumValue,
  getUnsupportedEnumValues,
} from '../../../cache/processor/enumUtils';

// normalizeEnumName

test('normalizeEnumName: parameterized cases', (t) => {
  const testCases: Array<{ name: string; input: string; expected: string }> = [
    {
      name: 'already uppercase',
      input: 'STRING',
      expected: 'STRING',
    },
    {
      name: 'all lowercase',
      input: 'string',
      expected: 'STRING',
    },
    {
      name: 'mixed case',
      input: 'VariationType',
      expected: 'VARIATIONTYPE',
    },
    {
      name: 'empty string',
      input: '',
      expected: '',
    },
  ];

  for (const tc of testCases) {
    t.is(normalizeEnumName(tc.input), tc.expected, tc.name);
  }
});

// getUnsupportedEnumValue

test('getUnsupportedEnumValue: parameterized cases', (t) => {
  const testCases: Array<{ name: string; input: object; expected: number }> = [
    {
      name: 'empty object returns 0',
      input: {},
      expected: 0,
    },
    {
      name: 'single value { A: 0 } returns 1',
      input: { A: 0 },
      expected: 1,
    },
    {
      name: 'multiple values returns max + 1',
      input: { A: 0, B: 3, C: 1 },
      expected: 4,
    },
    {
      name: 'non-contiguous values picks correct max',
      input: { A: 0, B: 10, C: 5 },
      expected: 11,
    },
  ];

  for (const tc of testCases) {
    t.is(getUnsupportedEnumValue(tc.input), tc.expected, tc.name);
  }
});

// getUnsupportedEnumValues

test('getUnsupportedEnumValues: parameterized cases', (t) => {
  const testCases: Array<{
    name: string;
    input: Record<string, object>;
    expected: Record<string, number>;
  }> = [
    {
      name: 'empty input returns empty result',
      input: {},
      expected: {},
    },
    {
      name: 'single key delegates to getUnsupportedEnumValue',
      input: { variationType: { A: 0, B: 1, C: 2 } },
      expected: { variationType: 3 },
    },
    {
      name: 'multiple keys each get their own sentinel',
      input: {
        variationType: { A: 0, B: 1, C: 2 },
        operator: { EQ: 0, GE: 1, LE: 2, GT: 3, LT: 4 },
        strategyType: {},
      },
      expected: {
        variationType: 3,
        operator: 5,
        strategyType: 0,
      },
    },
  ];

  for (const tc of testCases) {
    t.deepEqual(getUnsupportedEnumValues(tc.input), tc.expected, tc.name);
  }
});
