import { reduceFunction } from './reduceFunctions';
import type { ToObject_F } from './types';

export const toObject: ToObject_F = (...map) => {
  const out: any = {};
  map.forEach(([key, ...funcs]) => {
    const len = funcs.length;

    if (len === 1) {
      out[key] = reduceFunction(funcs[0]);
    } else {
      out[key] = funcs.map(reduceFunction);
    }
  });

  return out;
};
