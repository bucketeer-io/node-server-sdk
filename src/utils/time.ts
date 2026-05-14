export function createTimestamp(): number {
  const millisec = Date.now();
  // It is necessary for validation at backend.
  const sec = Math.floor(millisec / 1000);
  return sec;
}

// Returns a high-resolution monotonic start mark in nanoseconds, suitable as
// the input to `latencySecondsSince`. Use this (not `Date.now()`) for
// measuring latency: `Date.now()` has 1ms resolution and produces 0 for
// sub-millisecond operations such as local in-memory evaluation, which the
// backend then rejects as "duration is nil and latencySecond is 0".
export function latencyStart(): bigint {
  return process.hrtime.bigint();
}

// Returns elapsed seconds since `start` as a `number`, with sub-microsecond
// resolution. Subtraction happens in `bigint` first to avoid losing precision
// on long-lived processes (`process.hrtime.bigint()` is monotonic and grows
// without bound).
export function latencySecondsSince(start: bigint): number {
  return Number(process.hrtime.bigint() - start) / 1e9;
}
