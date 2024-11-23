import test from 'ava';
import { stringToBoolConverter, stringToNumberConverter } from '../../converter';

type StringToNumConvertTestCase = {
  input: string;
  expected: number | null;
};

// List of test cases
const stringConvertTestCases: StringToNumConvertTestCase[] = [
  { input: 'default true', expected: null },
  { input: 'default false', expected: null },
  { input: ' ', expected: null },
  { input: '', expected: null },
  { input: '1', expected: 1 },
  { input: '2', expected: 2 },
  { input: '0.1', expected: 0.1 },
  { input: '12.1', expected: 12.1 },
  { input: '12.0', expected: 12 },
  { input: '1', expected: 1 },
  { input: '[]', expected: null },
  { input: '{"key1": "value1"}', expected: null },
  { input: 'true', expected: null },
  { input: 'false', expected: null },
];

stringConvertTestCases.forEach(({ input, expected }, index) => {
  test(`stringToNumberConverter test case ${index + 1} input: ${input} - expected: ${expected}`, (t) => {
    try {
      const output = stringToNumberConverter(input);
      t.is(output, expected);
    } catch (err) {
      t.is(expected, null);
    }
  });
});
