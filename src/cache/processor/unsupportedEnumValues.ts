import {
  Clause as ProtoClause,
  Feature as ProtoFeature,
  SegmentUser as ProtoSegmentUser,
  Strategy as ProtoStrategy,
} from '@bucketeer/evaluation';
import { getUnsupportedEnumValues } from './enumUtils';

// Precompute one unsupported numeric sentinel per proto enum so converter.ts can
// preserve unknown REST enum strings as unsupported values instead of coercing
// them to known semantics.
export const UNSUPPORTED_PROTO_ENUM_VALUES = getUnsupportedEnumValues({
  variationType: ProtoFeature.VariationType,
  operator: ProtoClause.Operator,
  strategyType: ProtoStrategy.Type,
  segmentUserState: ProtoSegmentUser.State,
});
