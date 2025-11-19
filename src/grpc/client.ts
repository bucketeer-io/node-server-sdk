import {
  GatewayClient,
  GetFeatureFlagsRequest,
  GetFeatureFlagsResponse,
  GetSegmentUsersRequest,
  GetSegmentUsersResponse,
  ServiceError,
} from '@bucketeer/evaluation';
import { grpc } from '@improbable-eng/grpc-web';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import { SourceId } from '../objects/sourceId';
import { InvalidStatusError } from '../objects/errors';

interface GRPCClient {
  getSegmentUsers(options: {
    segmentIdsList: Array<string>;
    requestedAt: number;
    sourceId: SourceId;
    sdkVersion: string;
  }): Promise<GetSegmentUsersResponse>;

  getFeatureFlags(options: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
    sourceId: SourceId;
    sdkVersion: string;
  }): Promise<GetFeatureFlagsResponse>;
}

class DefaultGRPCClient {
  private readonly apiKey: string;
  private client: GatewayClient;

  constructor(apiEndpoint: string, apiKey: string, scheme: string = 'https') {
    this.apiKey = apiKey;

    // Validate scheme
    if (scheme !== 'http' && scheme !== 'https') {
      throw new Error(`Invalid scheme: ${scheme}. Must be http or https`);
    }

    // Build the full service URL: scheme://endpoint
    const serviceHost = `${scheme}://${apiEndpoint}`;

    this.client = new GatewayClient(serviceHost, {
      transport: NodeHttpTransport(),
    });
  }

  getMetadata() {
    const metadata = new grpc.Metadata();
    metadata.set('authorization', this.apiKey);
    return metadata;
  }

  getSegmentUsers(options: {
    segmentIdsList: Array<string>;
    requestedAt: number;
    sourceId: SourceId;
    sdkVersion: string;
  }): Promise<GetSegmentUsersResponse> {
    const req = new GetSegmentUsersRequest();
    req.setSegmentIdsList(options.segmentIdsList);
    req.setRequestedAt(options.requestedAt);
    req.setSourceId(options.sourceId);
    req.setSdkVersion(options.sdkVersion);

    return new Promise((resolve, reject) => {
      this.client.getSegmentUsers(req, this.getMetadata(), (err, res) => {
        if (err) {
          const invalidStatusError = convertSerivceError(err);
          return reject(invalidStatusError);
        }
        if (res) {
          resolve(res);
        } else {
          reject(new Error('Response is null'));
        }
      });
    });
  }

  getFeatureFlags(options: {
    tag: string;
    featureFlagsId: string;
    requestedAt: number;
    sourceId: SourceId;
    sdkVersion: string;
  }): Promise<GetFeatureFlagsResponse> {
    const req = new GetFeatureFlagsRequest();
    req.setTag(options.tag);
    req.setFeatureFlagsId(options.featureFlagsId);
    req.setRequestedAt(options.requestedAt);
    req.setSourceId(options.sourceId);
    req.setSdkVersion(options.sdkVersion);

    return new Promise((resolve, reject) => {
      this.client.getFeatureFlags(req, this.getMetadata(), (err, res) => {
        if (err) {
          const invalidStatusError = convertSerivceError(err);
          return reject(invalidStatusError);
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

function convertSerivceError(err: ServiceError): InvalidStatusError {
  return new InvalidStatusError(err.message, grpcToRestStatus(err.code));
}

function grpcToRestStatus(grpcCode: number): number {
  // https://grpc.github.io/grpc/core/md_doc_statuscodes.html
  const grpcToRestMap: { [key: number]: number } = {
    0: 200, // OK
    1: 499, // CANCELLED
    2: 500, // UNKNOWN
    3: 400, // INVALID_ARGUMENT
    4: 504, // DEADLINE_EXCEEDED
    5: 404, // NOT_FOUND
    6: 409, // ALREADY_EXISTS
    7: 403, // PERMISSION_DENIED
    8: 429, // RESOURCE_EXHAUSTED
    9: 400, // FAILED_PRECONDITION
    10: 409, // ABORTED
    11: 400, // OUT_OF_RANGE
    12: 501, // UNIMPLEMENTED
    13: 500, // INTERNAL
    14: 503, // UNAVAILABLE
    15: 500, // DATA_LOSS
    16: 401, // UNAUTHENTICATED
  };

  return grpcToRestMap[grpcCode] || 500; // Default to 500 if gRPC code is unrecognized
}

export { GRPCClient, DefaultGRPCClient, convertSerivceError, grpcToRestStatus };
