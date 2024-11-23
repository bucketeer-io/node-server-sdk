import {
  GetSegmentUsersResponse,
  GetFeatureFlagsResponse,
} from '@kenji71089/evaluation';
import { GRPCClient } from '../../grpc/client';

class MockGRPCClient implements GRPCClient {
  getFeatureFlags(_options: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
  }): Promise<GetFeatureFlagsResponse> {
    throw new Error('Method not implemented.');
  }
  getSegmentUsers(_options: {
    segmentIdsList: Array<string>;
    requestedAt: number;
  }): Promise<GetSegmentUsersResponse> {
    throw new Error('Method not implemented.');
  }
}

export { MockGRPCClient };