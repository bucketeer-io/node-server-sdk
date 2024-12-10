import { Evaluation } from './evaluation';

export type RegisterEventsResponseError = {
  retriable: boolean;
  message: string;
};

export type RegisterEventsResponse = {
  errors: { [key: string]: RegisterEventsResponseError };
};

export type GetEvaluationResponse = {
  evaluation?: Evaluation;
};