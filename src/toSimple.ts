import type { ToSimple_F } from './types';

export const toSimple: ToSimple_F = map => {
  const out: any = {};
  const entries = Object.entries(map);

  entries.forEach(([key, func]) => {
    out[key] = (arg: unknown) => {
      const out1 = func(arg);
      if (out1 === false) return false;

      return out1.check;
    };
  });

  return out;
};
