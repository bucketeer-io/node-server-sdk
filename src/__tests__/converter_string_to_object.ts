import test from 'ava';
import { stringToObjectConverter } from '../converter';
import { BKTValue } from '../types';

type StringToJSonValueConvertTestCase = {
  input: string;
  expected: BKTValue | null;
};

// List of test cases
const stringConvertTestCases: StringToJSonValueConvertTestCase[] = [
  { input: 'default true', expected: null },
  { input: 'default false', expected: null },
  { input: ' ', expected: null },
  { input: '', expected: null },
  { input: '1', expected: null },
  { input: '2', expected: null },
  { input: '0.1', expected: null },
  { input: '12.1', expected: null },
  { input: '12.0', expected: null },
  { input: '1', expected: null },
  { input: '[]', expected: [] },
  { input: '{}', expected: {} },
  { input: '{"key1": "value1"}', expected: { key1: 'value1' } },
  {
    input: JSON.stringify({ key1: 'value1', key2: 'value1', key3: 'value1' }),
    expected: { key1: 'value1', key2: 'value1', key3: 'value1' },
  },
  {
    input: JSON.stringify({ key1: [1, 2, 3], key2: 'value1', key3: 'value1' }),
    expected: { key1: [1, 2, 3], key2: 'value1', key3: 'value1' },
  },
  {
    input: JSON.stringify([1, 2, 3]),
    expected: [1, 2, 3],
  },
  { input: 'true', expected: null },
  { input: 'false', expected: null },
];

stringConvertTestCases.forEach(({ input, expected }, index) => {
  test(`stringToObjectConverter test case ${index + 1} input: ${input} - expected: ${expected}`, (t) => {
    try {
      const output = stringToObjectConverter(input);
      t.deepEqual(output, expected);
    } catch (err) {
      t.deepEqual(expected, null);
    }
  });
});
