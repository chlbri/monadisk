import { reduceFunction } from './reduceFunctions';
import type { ToSimple_F } from './types';

export const toSimple: ToSimple_F = entries => {
  const out: any[] = [];

  entries.forEach(([key, ...funcs]) => {
    const reFuncs = funcs.map(reduceFunction);

    out.push([key, ...reFuncs]);
  });

  return out as any;
};
