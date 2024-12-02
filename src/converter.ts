import { IllegalArgumentError } from './objects/errors';
import { BKTValue } from './types';

export type StringToTypeConverter<T> = (input: string) => T | null;

export const defaultStringToTypeConverter: StringToTypeConverter<string> = (input: string) => input;

export const stringToBoolConverter: StringToTypeConverter<boolean> = (input: string) => {
  assetNonBlankString(input);

  const lowcaseValue = input.toLowerCase();
  if (lowcaseValue === 'true') {
    return true;
  } else if (lowcaseValue === 'false') {
    return false;
  } else {
    return null;
  }
};

export const stringToNumberConverter: StringToTypeConverter<number> = (input: string) => {
  assetNonBlankString(input);
  const parsedNumber = Number(input);
  return isNaN(parsedNumber) ? null : parsedNumber;
};

export const stringToObjectConverter: StringToTypeConverter<BKTValue> = (input: string) => {
  assetNonBlankString(input);
  return parseJsonObjectOrArray(input);
};

function assetNonBlankString(input: string) {
  if (input.trim().length == 0) {
    throw new IllegalArgumentError('Input string must be non-blank');
  }
}

function parseJsonObjectOrArray(input: string) {
  const primitiveTypes = ['number', 'string', 'boolean', 'null'];
  const parsed = JSON.parse(input);

  if (primitiveTypes.includes(typeof parsed) || parsed === null) {
    throw new IllegalArgumentError('Only JSON objects or array are allowed');
  }

  return parsed;
}
