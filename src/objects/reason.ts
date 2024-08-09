export type Reason = {
  type: ReasonType;
  ruleId?: string;
};

const ReasonTypeValue = [
  'TARGET',
  'RULE',
  'DEFAULT',
  'CLIENT',
  'OFF_VARIATION',
  'PREREQUISITE',
] as const;

export type ReasonType = (typeof ReasonTypeValue)[number];
