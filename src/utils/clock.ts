import {
  latencyStart as monotonicLatencyStart,
  latencySecondsSince as monotonicLatencySecondsSince,
} from './time';

class Clock {
  latencyStart(): bigint {
    return monotonicLatencyStart();
  }

  latencySecondsSince(start: bigint): number {
    return monotonicLatencySecondsSince(start);
  }
}

export { Clock };