import test from 'ava';
import { defaultStringToTypeConverter } from '../../converter';

type StringConvertTestCase = {
  input: string;
  expected: string;
};

// List of test cases
const stringConvertTestCases: StringConvertTestCase[] = [
  { input: 'default true', expected: 'default true' },
  { input: 'default false', expected: 'default false' },
  { input: ' ', expected: ' ' },
  { input: '', expected: '' },
  { input: '1', expected: '1' },
  { input: '2', expected: '2' },
  { input: '2.0', expected: '2.0' },
  { input: '12.1', expected: '12.1' },
  { input: '[]', expected: '[]' },
  { input: '{"key1": "value1"}', expected: '{"key1": "value1"}' },
];

stringConvertTestCases.forEach(({ input, expected }, index) => {
  test(`defaultStringToTypeConverter test case ${index + 1}`, (t) => {
    const output = defaultStringToTypeConverter(input);
    t.is(output, expected);
  });
});
