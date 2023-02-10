import { Reason } from './reason';

export type Evaluation = {
  id: string;
  featureId: string;
  featureVersion: number;
  userId: string;
  variationId: string;
  reason?: Reason;
  variationValue: string;
};
