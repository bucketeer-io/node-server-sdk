export type Reason = {
  type: ReasonType;
  ruleId?: string;
};

export enum ReasonType {
  TARGET = 0,
  RULE = 1,
  DEFAULT = 3,
  CLIENT = 4,
  OFF_VARIATION = 5,
  PREREQUISITE = 6,
}
