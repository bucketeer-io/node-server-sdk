import test from 'ava';
import { stringToBoolConverter } from '../../converter';

type StringToBoolConvertTestCase = {
  input: string;
  expected: boolean | null;
};

// List of test cases
const stringConvertTestCases: StringToBoolConvertTestCase[] = [
  { input: 'default true', expected: null },
  { input: 'default false', expected: null },
  { input: ' ', expected: null },
  { input: '', expected: null },
  { input: '1', expected: null },
  { input: '2', expected: null },
  { input: '[]', expected: null },
  { input: '{"key1": "value1"}', expected: null },
  { input: 'true', expected: true },
  { input: 'false', expected: false },
];

stringConvertTestCases.forEach(({ input, expected }, index) => {
  test(`stringToBoolConverter test case ${index + 1} input: ${input} - expected: ${expected}`, (t) => {
    try {
      const output = stringToBoolConverter(input);
      t.is(output, expected);
    } catch (err) {
      t.is(expected, null);
    }
  });
});
