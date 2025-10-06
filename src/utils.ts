import type { Primitive } from '@bemedev/core/lib/globals/types.js';
import type { ToString_F } from './types';

export const toString: ToString_F = (value: Primitive) => {
  const check1 = typeof value === 'string' || typeof value === 'number';
  if (check1) return value;

  const check2 = value === null;

  if (check2) return 'null';

  const check3 = value === undefined;
  if (check3) return 'undefined';

  return String(value) as any;
};
