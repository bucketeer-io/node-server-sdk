import test from 'ava';
import sinon from 'sinon';

import * as timeUtils from '../utils/time';
import { Clock } from '../utils/clock';

test('Clock.latencyStart returns the current hrtime bigint mark', (t) => {
  const expectedStartMark = BigInt(456);
  const latencyStartStub = sinon.stub(timeUtils, 'latencyStart').returns(expectedStartMark);
  t.teardown(() => {
    latencyStartStub.restore();
  });

  const clock = new Clock();

  t.is(clock.latencyStart(), expectedStartMark);
  t.true(latencyStartStub.calledOnce);
});

test('Clock.latencySecondsSince delegates to the helper contract', (t) => {
  const startMark = BigInt(100);
  const latencySecondsSinceStub = sinon.stub(timeUtils, 'latencySecondsSince').returns(1.5);
  t.teardown(() => {
    latencySecondsSinceStub.restore();
  });

  const clock = new Clock();

  t.is(clock.latencySecondsSince(startMark), 1.5);
  t.true(latencySecondsSinceStub.calledOnceWith(startMark));
});