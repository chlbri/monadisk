import type { ToSimple_F, ToSimpleOne_F } from './types';

export const toSimpleOne: ToSimpleOne_F = func => {
  const fn = (arg: unknown) => {
    const out1 = func(arg);
    if (out1 === false) return false;

    return out1.check;
  };

  return fn;
};

export const toSimple: ToSimple_F = entries => {
  const out: any[] = [];

  entries.forEach(([key, func]) => {
    const fn = toSimpleOne(func);

    out.push([key, fn]);
  });

  return out as any;
};
