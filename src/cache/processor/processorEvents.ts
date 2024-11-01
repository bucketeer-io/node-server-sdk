import { EventEmitter } from 'events';
import { NodeApiIds } from '../../objects/apiId';

// Define event types with specific data types.
interface ProcessorEvents {
  pushLatencyMetricsEvent: {latency: number, apiId: NodeApiIds};
  pushSizeMetricsEvent: {size: number, apiId: NodeApiIds};
  error: {error: any, apiId: NodeApiIds};
}

// Create a strongly-typed EventEmitter.
class ProcessorEventsEmitter extends EventEmitter {
  emit<K extends keyof ProcessorEvents>(event: K, data: ProcessorEvents[K]): boolean {
    return super.emit(event, data);
  }

  on<K extends keyof ProcessorEvents>(event: K, listener: (data: ProcessorEvents[K]) => void): this {
    return super.on(event, listener);
  }
}

export { ProcessorEventsEmitter };