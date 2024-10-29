import {
  GetSegmentUsersResponse,
  GetFeatureFlagsResponse,
} from '@bucketeer/node-evaluation';
import { GRPCClient } from '../../grpc/client';

export class MockGRPCClient implements GRPCClient {
  segmentUsersRes: GetSegmentUsersResponse | null;
  featureFlags: GetFeatureFlagsResponse | null;
  getSegmentUsersError: Error | null;
  getFeatureFlagsError: Error | null;

  getSegementUsersRequest: {
    segmentIdsList: Array<string>;
    requestedAt: number;
    version: string;
  } | null;

  getFeatureFlagsRequest: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
    version: string;
  } | null;

  getSegmentUsers(options: {
    segmentIdsList: Array<string>;
    requestedAt: number;
    version: string;
  }): Promise<GetSegmentUsersResponse> {

    this.getSegementUsersRequest = options

    if (this.getSegmentUsersError) {
      return Promise.reject(this.getSegmentUsersError);
    }
    if (this.segmentUsersRes) {
      return Promise.resolve(this.segmentUsersRes);
    }
    throw new Error('Missing response');
  }

  getFeatureFlags(options: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
    version: string;
  }): Promise<GetFeatureFlagsResponse> {

    this.getFeatureFlagsRequest = options

    if (this.getFeatureFlagsError) {
      return Promise.reject(this.getFeatureFlagsError);
    }
    if (this.featureFlags) {
      return Promise.resolve(this.featureFlags);
    }
    throw new Error('Missing response');
  }
}
