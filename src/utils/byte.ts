export function lengthInUtf8Bytes(str: string): number {
  return unescape(encodeURIComponent(str)).length;
}
