import { BKTValue } from './types';

export interface BKTEvaluationDetails<T extends BKTValue> {
  readonly featureId: string;
  readonly featureVersion: number;
  readonly userId: string;
  readonly variationId: string;
  readonly variationName: string;
  readonly variationValue: T;
  readonly reason: 'TARGET' | 'RULE' | 'DEFAULT' | 'CLIENT' | 'OFF_VARIATION' | 'PREREQUISITE';
}

export const newDefaultBKTEvaluationDetails = <T extends BKTValue>(
  userId: string,
  featureId: string,
  defaultValue: T,
  reason: 'DEFAULT' | 'CLIENT' = 'CLIENT'
): BKTEvaluationDetails<T> => {
  return {
    featureId: featureId,
    featureVersion: 0,
    userId: userId,
    variationId: '',
    variationName: '',
    variationValue: defaultValue,
    reason: reason,
  } satisfies BKTEvaluationDetails<T>;
};
