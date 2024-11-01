import { SegmentUsersCache } from '../segementUsers';
import { GRPCClient } from '../../grpc/client';
import { ProcessorEventsEmitter } from './processorEvents';
import { Cache } from '../cache';
import { ApiId } from '../../objects/apiId';
import { SegmentUsers } from '@bucketeer/node-evaluation';
import { createSchedule, removeSchedule } from '../../schedule';
import { Clock } from '../../utils/clock';

interface SegementUsersCacheProcessor {
  start(): void;
  stop(): void;
}

type SegementUsersCacheProcessorOptions = {
  cache: Cache;
  segmentUsersCache: SegmentUsersCache;
  pollingInterval: number;
  grpc: GRPCClient;
  eventEmitter: ProcessorEventsEmitter;
  featureTag: string;
  clock: Clock;
};

const SEGEMENT_USERS_REQUESTED_AT = 'bucketeer_segment_users_requested_at';
const SEGEMENT_USERS_CACHE_TTL = 0;

function NewSegementUserCacheProcessor(
  options: SegementUsersCacheProcessorOptions,
): SegementUsersCacheProcessor {
  return new DefaultSegementUserCacheProcessor(options);
}

class DefaultSegementUserCacheProcessor implements SegementUsersCacheProcessor {
  private cache: Cache;
  private segmentUsersCache: SegmentUsersCache;
  private pollingInterval: number;
  private grpc: GRPCClient;
  private eventEmitter: ProcessorEventsEmitter;
  private pollingScheduleID?: NodeJS.Timeout;
  private clock: Clock;

  constructor(options: SegementUsersCacheProcessorOptions) {
    this.cache = options.cache;
    this.segmentUsersCache = options.segmentUsersCache;
    this.pollingInterval = options.pollingInterval;
    this.grpc = options.grpc;
    this.eventEmitter = options.eventEmitter;
    this.clock = options.clock;
  }

  start() {
    this.pollingScheduleID = createSchedule(() => this.runUpdateCache(), this.pollingInterval);
  }

  stop() {
    if (this.pollingScheduleID) removeSchedule(this.pollingScheduleID);
  }

  private internalError(error: any): Error {
    return new Error(`internal error while updating segment users: ${error}`);
  }

  private runUpdateCache() {
    try {
      this.updateCache();
    } catch (error) {
      this.pushErrorMetricsEvent(this.internalError(error));
    }
  }

  private async updateCache() {
    const requestedAt = await this.getSegmentUsersRequestedAt();
    const segmentIds = await this.segmentUsersCache.getIds();
    const startTime: number = this.clock.getTime();

    const resp = await this.grpc.getSegmentUsers({segmentIdsList: segmentIds, requestedAt: requestedAt});

    const latency = (this.clock.getTime() - startTime) / 1000;

    this.pushLatencyMetricsEvent(latency);
    this.pushSizeMetricsEvent(resp.serializeBinary().length);

    if (resp.getForceUpdate()) {
      this.deleteAllAndSaveLocalCache(requestedAt, resp.getSegmentUsersList());
    } else {
      this.updateLocalCache(
        requestedAt,
        resp.getSegmentUsersList(),
        resp.getDeletedSegmentIdsList(),
      );
    }
  }

  async deleteAllAndSaveLocalCache(requestedAt: number, segmentUsersList: SegmentUsers[]) {
    await this.segmentUsersCache.deleteAll();
    await this.updateLocalCache(requestedAt, segmentUsersList, []);
  }

  async updateLocalCache(
    requestedAt: number,
    segmentUsersList: SegmentUsers[],
    deletedSegmentIds: string[],
  ) {
    deletedSegmentIds.forEach(async (deletedSegmentId) => {
      await this.segmentUsersCache.delete(deletedSegmentId);
    });
    segmentUsersList.forEach(async (segmentUsers) => {
      await this.segmentUsersCache.put(segmentUsers);
    });
    await this.putSegmentUsersRequestedAt(requestedAt);
  }

  private async getSegmentUsersRequestedAt(): Promise<number> {
    const requestedAt = await this.cache.get(SEGEMENT_USERS_REQUESTED_AT);
    return requestedAt ? Number(requestedAt) : 0;
  }

  putSegmentUsersRequestedAt(requestedAt: number): Promise<void> {
    return this.cache.put(SEGEMENT_USERS_REQUESTED_AT, requestedAt, SEGEMENT_USERS_CACHE_TTL);
  }

  async pushLatencyMetricsEvent(latency: number) {
    this.eventEmitter.emit('pushLatencyMetricsEvent', {
      latency: latency,
      apiId: ApiId.GET_SEGMENT_USERS,
    });
  }

  async pushErrorMetricsEvent(error: any) {
    this.eventEmitter.emit('error', { error: error, apiId: ApiId.GET_SEGMENT_USERS });
  }

  async pushSizeMetricsEvent(size: number) {
    this.eventEmitter.emit('pushSizeMetricsEvent', { size: size, apiId: ApiId.GET_SEGMENT_USERS });
  }
}

export { SegementUsersCacheProcessor, NewSegementUserCacheProcessor, SEGEMENT_USERS_CACHE_TTL };