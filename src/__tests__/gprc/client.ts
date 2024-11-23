import test from 'ava';
import { InvalidStatusError } from '../../api/client';
import { convertSerivceError, DefaultGRPCClient, grpcToRestStatus } from '../../grpc/client';
import { ServiceError } from '@kenji71089/evaluation';
import { grpc } from '@improbable-eng/grpc-web';

test('grpcToRestStatus should return correct HTTP status for known gRPC codes', t => {
  t.is(grpcToRestStatus(0), 200); // OK
  t.is(grpcToRestStatus(1), 499); // CANCELLED
  t.is(grpcToRestStatus(2), 500); // UNKNOWN
  t.is(grpcToRestStatus(3), 400); // INVALID_ARGUMENT
  t.is(grpcToRestStatus(4), 504); // DEADLINE_EXCEEDED
  t.is(grpcToRestStatus(5), 404); // NOT_FOUND
  t.is(grpcToRestStatus(6), 409); // ALREADY_EXISTS
  t.is(grpcToRestStatus(7), 403); // PERMISSION_DENIED
  t.is(grpcToRestStatus(8), 429); // RESOURCE_EXHAUSTED
  t.is(grpcToRestStatus(9), 400); // FAILED_PRECONDITION
  t.is(grpcToRestStatus(10), 409); // ABORTED
  t.is(grpcToRestStatus(11), 400); // OUT_OF_RANGE
  t.is(grpcToRestStatus(12), 501); // UNIMPLEMENTED
  t.is(grpcToRestStatus(13), 500); // INTERNAL
  t.is(grpcToRestStatus(14), 503); // UNAVAILABLE
  t.is(grpcToRestStatus(15), 500); // DATA_LOSS
  t.is(grpcToRestStatus(16), 401); // UNAUTHENTICATED
});

test('grpcToRestStatus should return 500 for unknown gRPC codes', t => {
  t.is(grpcToRestStatus(999), 500); // Unknown gRPC code
  t.is(grpcToRestStatus(-1), 500); // Invalid gRPC code
});

test('convertSerivceError should convert ServiceError to InvalidStatusError', t => {
  const serviceError: ServiceError = {
    message: 'Test error message',
    code: 500,
    metadata: new grpc.Metadata(),
  };

  const result = convertSerivceError(serviceError);

  t.true(result instanceof InvalidStatusError);
  t.is(result.message, serviceError.message);
  t.is(result.code, serviceError.code);
});

test('GRPCClient should convert ServiceError to InvalidStatusError', async t => {
  // there is not gprc server running on this port, error is expected
  const client = new DefaultGRPCClient('https://localhost:26948', 'apiKey');

  try {
    await client.getFeatureFlags({featureFlagsId: 'featureFlagsId', requestedAt: 123, tag: 'tag'});
  } catch (error) {
    t.true(error instanceof InvalidStatusError);
    t.is(error.code, 500);
  }
});