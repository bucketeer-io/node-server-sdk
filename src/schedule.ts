export function createSchedule(fn: () => void, interval: number): NodeJS.Timeout {
  return setInterval(fn, interval);
}

export function removeSchedule(timeout: NodeJS.Timeout): void {
  clearInterval(timeout);
}
