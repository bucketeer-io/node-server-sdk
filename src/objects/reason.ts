type Reason = {
  type: ReasonType;
  ruleId?: string;
  // Set when type is HOLDOUT. Identifies the holdout group that served the variation.
  holdoutGroupId?: string;
};

type ReasonType =
  | 'TARGET'
  | 'RULE'
  | 'DEFAULT'
  | 'CLIENT'
  | 'OFF_VARIATION'
  | 'PREREQUISITE'
  | 'HOLDOUT';

export { Reason, ReasonType };