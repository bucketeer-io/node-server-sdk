import { Reason as ProtoReason } from '@kenji71089/evaluation';

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