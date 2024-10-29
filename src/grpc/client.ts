import {
  GatewayClient,
  GetFeatureFlagsRequest,
  GetFeatureFlagsResponse,
  GetSegmentUsersRequest,
  GetSegmentUsersResponse,
} from '@bucketeer/node-evaluation';
import { grpc } from '@improbable-eng/grpc-web';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import { SourceId } from '../objects/sourceId';
import { version } from '../objects/version';

interface GRPCClient {
  getSegmentUsers(
    options: {
      segmentIdsList: Array<string>,
      requestedAt: number,
    }
  ): Promise<GetSegmentUsersResponse> 

  getFeatureFlags(
    options: {
      tag: string,
      featureFlagsId: string,
      requestedAt: number,
    }
  ): Promise<GetFeatureFlagsResponse>
}

class DefaultGRPCClient {
  private readonly apiKey: string;
  private client: GatewayClient;

  constructor(host: string, apiKey: string) {
    this.apiKey = apiKey;
    this.client = new GatewayClient(host, {
      transport: NodeHttpTransport(),
    })
  }

  getMetadata() {
    const metadata = new grpc.Metadata();
    metadata.set('authorization', this.apiKey);
    return metadata;
  }

  getSegmentUsers(
    options: {
      segmentIdsList: Array<string>,
      requestedAt: number,
    }
  ): Promise<GetSegmentUsersResponse> {
    const req = new GetSegmentUsersRequest();
    req.setSegmentIdsList(options.segmentIdsList);
    req.setRequestedAt(options.requestedAt);

    req.setSourceId(SourceId.NODE_SERVER);
    req.setSdkVersion(version);

    return new Promise((resolve, reject) => {
      this.client.getSegmentUsers(req, this.getMetadata(), (err, res) => {
        if (err) {
          return reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject(new Error('Response is null'));
        }
      });
    });
  }

  getFeatureFlags(
    options: {
      tag: string,
      featureFlagsId: string,
      requestedAt: number,
    }
  ): Promise<GetFeatureFlagsResponse> {
    const req = new GetFeatureFlagsRequest();
    req.setTag(options.tag);
    req.setFeatureFlagsId(options.featureFlagsId);
    req.setRequestedAt(options.requestedAt);

    req.setSourceId(SourceId.NODE_SERVER);
    req.setSdkVersion(version);

    return new Promise((resolve, reject) => {
      this.client.getFeatureFlags(req, this.getMetadata(), (err, res) => {
        if (err) {
          return reject(err);
        }
        if (res) {
          resolve(res);
        } else {
          reject(new Error('Response is null'));
        }
      });
    });
  }
}

export { GRPCClient, DefaultGRPCClient };