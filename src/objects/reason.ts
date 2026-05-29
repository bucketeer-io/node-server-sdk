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