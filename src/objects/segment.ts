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
};
