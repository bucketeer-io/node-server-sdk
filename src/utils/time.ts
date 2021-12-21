export function createTimestamp(): number {
  const millisec = Date.now();
  // It is necessary for validation at backend.
  const sec = Math.floor(millisec / 1000);
  return sec;
}
