import { SegmentUsersCache } from '../segmentUsers';
import { GRPCClient } from '../../grpc/client';
import { ProcessorEventsEmitter } from '../../processorEventsEmitter';
import { Cache } from '../cache';
import { ApiId } from '../../objects/apiId';
import { SegmentUsers } from '@bucketeer/evaluation';
import { createSchedule, removeSchedule } from '../../schedule';
import { Clock } from '../../utils/clock';
import { InvalidStatusError } from '../../objects/errors';
import { SourceId } from '../../objects/sourceId';
import { InitializationPromise } from '../../utils/initializationPromise';

interface SegementUsersCacheProcessor {
  start(): void;
  stop(): void;
  waitForInitialization(options: { timeout: number }): Promise<void>;
}

type SegementUsersCacheProcessorOptions = {
  cache: Cache;
  segmentUsersCache: SegmentUsersCache;
  pollingInterval: number;
  grpc: GRPCClient;
  eventEmitter: ProcessorEventsEmitter;
  clock: Clock;
  sourceId: SourceId;
  sdkVersion: string;
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
  private sourceId: SourceId;
  private sdkVersion: string;
  private initializationPromise = new InitializationPromise();

  constructor(options: SegementUsersCacheProcessorOptions) {
    this.cache = options.cache;
    this.segmentUsersCache = options.segmentUsersCache;
    this.pollingInterval = options.pollingInterval;
    this.grpc = options.grpc;
    this.eventEmitter = options.eventEmitter;
    this.clock = options.clock;
    this.sourceId = options.sourceId;
    this.sdkVersion = options.sdkVersion;
  }

  start() {
    // Execute immediately
    this.runUpdateCache();
    this.pollingScheduleID = createSchedule(() => this.runUpdateCache(), this.pollingInterval);
  }

  stop() {
    if (this.pollingScheduleID) removeSchedule(this.pollingScheduleID);
  }

  async runUpdateCache() {
    const isFirstTime = !this.initializationPromise.isComplete();
    
    try {
      await this.updateCache();

      if (isFirstTime) {
        this.initializationPromise.markAsInitialized();
      }
    } catch (error) {
      if (isFirstTime) {
        this.initializationPromise.markAsFailed(error);
      }
      // Always log the error regardless of initialization state
      this.pushErrorMetricsEvent(error);
    }
  }

  async waitForInitialization(options: { timeout: number }): Promise<void> {
    return this.initializationPromise.waitForInitialization(options.timeout);
  }

  private async updateCache() {
    const segmentIds = await this.segmentUsersCache.getIds();
    const requestedAt = await this.getSegmentUsersRequestedAt();
    const sourceId = this.sourceId;
    const sdkVersion = this.sdkVersion;
    
    const startTime: number = this.clock.getTime();

    const resp = await this.grpc.getSegmentUsers({
      segmentIdsList: segmentIds,
      requestedAt: requestedAt,
      sourceId: sourceId,
      sdkVersion: sdkVersion,
    });

    const endTime: number = this.clock.getTime();
    const latency = (endTime - startTime) / 1000;

    this.pushLatencyMetricsEvent(latency);
    this.pushSizeMetricsEvent(resp.serializeBinary().length);

    if (resp.getForceUpdate()) {
      await this.deleteAllAndSaveLocalCache(resp.getRequestedAt(), resp.getSegmentUsersList());
    } else {
      await this.updateLocalCache(
        resp.getRequestedAt(),
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
    for (const deletedSegmentId of deletedSegmentIds) {
      await this.segmentUsersCache.delete(deletedSegmentId);
    }
    for (const segmentUsers of segmentUsersList) {
      await this.segmentUsersCache.put(segmentUsers);
    }
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

export {
  SegementUsersCacheProcessor,
  SegementUsersCacheProcessorOptions,
  NewSegementUserCacheProcessor,
  DefaultSegementUserCacheProcessor,
  SEGEMENT_USERS_CACHE_TTL,
  SEGEMENT_USERS_REQUESTED_AT,
};
