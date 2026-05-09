import test from 'ava';
import sinon from 'sinon';
import { Clock } from '../utils/clock';

test('Clock.latencyStart returns the current hrtime bigint mark', (t) => {
  const expectedStartMark = BigInt(456);
  const hrtimeBigintStub = sinon.stub(process.hrtime, 'bigint').returns(expectedStartMark);
  t.teardown(() => {
    hrtimeBigintStub.restore();
  });

  const clock = new Clock();

  t.is(clock.latencyStart(), expectedStartMark);
});

test('Clock.latencySecondsSince delegates to the helper contract', (t) => {
  const startMark = BigInt(100);
  const hrtimeBigintStub = sinon
    .stub(process.hrtime, 'bigint')
    .returns(BigInt(1_500_000_100));
  t.teardown(() => {
    hrtimeBigintStub.restore();
  });

  const clock = new Clock();

  t.is(clock.latencySecondsSince(startMark), 1.5);
});