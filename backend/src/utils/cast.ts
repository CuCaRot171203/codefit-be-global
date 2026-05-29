/**
 * Helper utilities for type casting
 */

export const str = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? v[0] ?? '' : v ?? '';

export const strOpt = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;
