import { EventEmitter } from 'events';
import { NodeApiIds } from './objects/apiId';
import { User } from './objects/user';
import { Evaluation } from './objects/evaluation';

// Define event types with specific data types.
interface ProcessorEvents {
  pushEvaluationEvent: { user: User, evaluation: Evaluation };
  pushLatencyMetricsEvent: { latency: number, apiId: NodeApiIds };
  pushSizeMetricsEvent: { size: number, apiId: NodeApiIds };
  error: { error: any, apiId: NodeApiIds };
  pushDefaultEvaluationEvent: { user: User, featureId: string };
}

// Create a strongly-typed EventEmitter.
class ProcessorEventsEmitter extends EventEmitter {
  emit<K extends keyof ProcessorEvents>(event: K, data: ProcessorEvents[K]): boolean {
    return super.emit(event, data);
  }

  on<K extends keyof ProcessorEvents>(event: K, listener: (data: ProcessorEvents[K]) => void): this {
    return super.on(event, listener);
  }
  
  close() {
    this.removeAllListeners();
  }
}

export { ProcessorEventsEmitter };