export type Target = {
  variation: string;
  users: string[];
};

export type FixedStrategy = {
  variation: string;
};

export type RolloutStrategyVariation = {
  variation: string;
  weight: number;
};

export type RolloutStrategy = {
  variations: RolloutStrategyVariation[];
};

export type Strategy = {
  type: string;
  fixedStrategy?: FixedStrategy;
  rolloutStrategy?: RolloutStrategy;
};

export type Clause = {
  id: string;
  attribute: string;
  operator: string;
  values: string[];
};

export type Rule = {
  id: string;
  strategy?: Strategy;
  clauses: Clause[];
};

export type Variation = {
  id?: string;
  value?: string;
  name?: string;
  description?: string;
};

export type Prerequisite = {
  featureId: string;
  variationId: string;
};

export type FeatureLastUsedInfo = {
  featureId: string;
  version: number;
  lastUsedAt: string;
  createdAt: string;
  clientOldestVersion: string;
  clientLatestVersion: string;
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  deleted: boolean;
  ttl: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  variations: Variation[];
  targets: Target[];
  rules: Rule[];
  defaultStrategy?: Strategy;
  offVariation: string;
  tags: string[];
  lastUsedInfo?: FeatureLastUsedInfo;
  maintainer: string;
  variationType: string;
  archived: boolean;
  prerequisites?: Prerequisite[];
  samplingSeed: string;
};
