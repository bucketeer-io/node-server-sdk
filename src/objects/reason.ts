import { Reason as ProtoReason } from '@bucketeer/evaluation';

type Reason = {
  type: ReasonType;
  ruleId?: string;
};

type ReasonType =
  | 'TARGET'
  | 'RULE'
  | 'DEFAULT'
  | 'CLIENT'
  | 'OFF_VARIATION'
  | 'PREREQUISITE'

export { Reason, ReasonType };