import type { Transform_F } from './types';

export const transform: Transform_F = (monad, transformers) => {
  return arg => {
    const key = monad.parse(arg);
    const check1 = key !== undefined;

    if (check1) {
      const func = transformers[key];

      if (func) return func(arg as any);
      return transformers.else(arg as any);
    }

    return undefined;
  };
};
