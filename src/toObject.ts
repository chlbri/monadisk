import type { ToObject_F } from './types';

export const toObject: ToObject_F = (...map) => {
  const out: any = {};
  map.forEach(([key, func]) => (out[key] = func));
  return out;
};
