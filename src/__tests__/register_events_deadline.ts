import test from 'ava';
import { computeRegisterEventsDeadline } from '../client';

test('default flush interval (30s) -> 10s deadline (capped)', (t) => {
  t.is(computeRegisterEventsDeadline(30_000), 10_000);
});

test('large flush interval (60s) -> 10s deadline (capped)', (t) => {
  t.is(computeRegisterEventsDeadline(60_000), 10_000);
});

test('flush interval at cap boundary (12.5s) -> 10s deadline', (t) => {
  t.is(computeRegisterEventsDeadline(12_500), 10_000);
});

test('flush interval just above boundary (13s) -> 10s deadline', (t) => {
  t.is(computeRegisterEventsDeadline(13_000), 10_000);
});

test('minimum flush interval (10s) -> 8s deadline', (t) => {
  t.is(computeRegisterEventsDeadline(10_000), 8_000);
});

test('flush interval at floor boundary (6.25s) -> 5s deadline', (t) => {
  t.is(computeRegisterEventsDeadline(6_250), 5_000);
});

test('flush interval below floor (5s) -> 5s deadline (floor applied)', (t) => {
  t.is(computeRegisterEventsDeadline(5_000), 5_000);
});

test('degenerate zero interval -> 5s deadline (floor applied)', (t) => {
  t.is(computeRegisterEventsDeadline(0), 5_000);
});
