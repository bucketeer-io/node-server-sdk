import { Rule } from './feature';

export type SegmentUser = {
  id: string;
  segmentId: string;
  userId: string;
  state: string;
  deleted: boolean;
};

export type SegmentUsers = {
  segmentId: string;
  users: SegmentUser[];
  updatedAt: string;
  // Rule-based segment rules. Available since Bucketeer server 2.3.0.
  // Older servers do not send this field.
  rules?: Rule[];
};
