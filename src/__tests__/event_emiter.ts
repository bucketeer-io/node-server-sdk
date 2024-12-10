import test from 'ava';
import sinon from 'sinon';
import { ProcessorEventsEmitter } from '../processorEventsEmitter';
import { User } from '../objects/user';
import { Evaluation } from '../objects/evaluation';
import { ApiId } from '../objects/apiId';

test('should emit pushEvaluationEvent', (t) => {
  const emitter = new ProcessorEventsEmitter();
  const user: User = { id: 'user1', data: {} };

  const evaluation: Evaluation = {
    id: 'eval1',
    featureId: 'feature1',
    featureVersion: 1,
    userId: 'user1',
    variationId: 'var1',
    variationName: 'variation1',
    variationValue: 'value1',
  } satisfies Evaluation;
  const listener = sinon.spy();

  emitter.on('pushEvaluationEvent', listener);
  emitter.emit('pushEvaluationEvent', { user, evaluation });

  t.true(listener.calledOnce);
  t.deepEqual(listener.firstCall.args[0], { user, evaluation });
});

test('should emit pushLatencyMetricsEvent', (t) => {
  const emitter = new ProcessorEventsEmitter();
  const latency = 123;
  const apiId = ApiId.GET_EVALUATION;
  const listener = sinon.spy();

  emitter.on('pushLatencyMetricsEvent', listener);
  emitter.emit('pushLatencyMetricsEvent', { latency, apiId });

  t.true(listener.calledOnce);
  t.deepEqual(listener.firstCall.args[0], { latency, apiId });
});

test('should emit pushSizeMetricsEvent', (t) => {
  const emitter = new ProcessorEventsEmitter();
  const size = 456;
  const apiId = ApiId.GET_EVALUATION;
  const listener = sinon.spy();

  emitter.on('pushSizeMetricsEvent', listener);
  emitter.emit('pushSizeMetricsEvent', { size, apiId });

  t.true(listener.calledOnce);
  t.deepEqual(listener.firstCall.args[0], { size, apiId });
});

test('should emit error event', (t) => {
  const emitter = new ProcessorEventsEmitter();
  const error = new Error('Test error');
  const apiId = ApiId.GET_EVALUATION;
  const listener = sinon.spy();

  emitter.on('error', listener);
  emitter.emit('error', { error, apiId });

  t.true(listener.calledOnce);
  t.deepEqual(listener.firstCall.args[0], { error, apiId });
});

test('should emit pushDefaultEvaluationEvent', (t) => {
  const emitter = new ProcessorEventsEmitter();
  const user: User = { id: 'user2', data: {} };
  const featureId = 'feature1';
  const listener = sinon.spy();

  emitter.on('pushDefaultEvaluationEvent', listener);
  emitter.emit('pushDefaultEvaluationEvent', { user, featureId });

  t.true(listener.calledOnce);
  t.deepEqual(listener.firstCall.args[0], { user, featureId });
});

test('should remove all listeners on close', (t) => {
  const emitter = new ProcessorEventsEmitter();
  const listener = sinon.spy();

  emitter.on('pushEvaluationEvent', listener);
  emitter.close();
  emitter.emit('pushEvaluationEvent', {
    user: { id: 'user3', data: {} },
    evaluation: {
      id: 'eval1',
      featureId: 'feature1',
      featureVersion: 1,
      userId: 'user1',
      variationId: 'var1',
      variationName: 'variation1',
      variationValue: 'value1',
    } satisfies Evaluation,
  });
  t.false(listener.called);
});
