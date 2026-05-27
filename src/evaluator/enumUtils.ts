// These helpers approximate protobuf unknown-enum behavior for the REST
// converter path.
//
// Proto3 natively preserves unknown enum values as their original numeric wire
// value. This converter never receives that number — the REST API delivers enum
// names as plain strings, so the original proto numeric value is already lost
// by the time we get here. Exact proto3 behavior is therefore impossible.
//
// The closest approximation is to produce a numeric sentinel that is outside
// the currently known enum range (`max + 1`). This ensures "unknown stays
// unknown" and prevents silent coercion to a valid known meaning such as
// STRING, EQUALS, FIXED, or INCLUDED. The sentinel automatically adjusts when
// the @bucketeer/evaluation package is updated with new enum values, because
// the generated enum map is inspected at startup.
export function normalizeEnumName(value: string): string {
  return value.toUpperCase();
}

export function getUnsupportedEnumValue(enumMap: object): number {
  const numericValues = Object.values(enumMap as Record<string, unknown>).filter(
    (value): value is number => typeof value === 'number',
  );

  return (numericValues.length > 0 ? Math.max(...numericValues) : -1) + 1;
}

export function getUnsupportedEnumValues<T extends Record<string, object>>(
  enumMaps: T,
): { [K in keyof T]: number } {
  const unsupportedEnumValues = {} as { [K in keyof T]: number };

  for (const [key, value] of Object.entries(enumMaps) as [keyof T, T[keyof T]][]) {
    unsupportedEnumValues[key] = getUnsupportedEnumValue(value);
  }

  return unsupportedEnumValues;
}