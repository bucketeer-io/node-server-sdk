import { APIClient } from '../../api/client';
import {
  GetFeatureFlagsResponse,
  GetSegmentUsersResponse,
} from '../../objects/response';
import { SourceId } from '../../objects/sourceId';

class MockAPIClient implements Pick<APIClient, 'getFeatureFlags' | 'getSegmentUsers'> {
  getFeatureFlags(
    _tag: string,
    _featureFlagsId: string,
    _requestedAt: number,
    _sourceId: SourceId,
    _sdkVersion: string,
  ): Promise<[GetFeatureFlagsResponse, number]> {
    throw new Error('Method not implemented.');
  }

  getSegmentUsers(
    _segmentIds: string[],
    _requestedAt: number,
    _sourceId: SourceId,
    _sdkVersion: string,
  ): Promise<[GetSegmentUsersResponse, number]> {
    throw new Error('Method not implemented.');
  }
}

export { MockAPIClient };
