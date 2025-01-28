import type { Transform_F } from './types';

export const transform: Transform_F = (monad, transformers) => {
  return arg => {
    const key = monad.parse(arg);
    const check1 = key !== undefined;

    if (check1) {
      const func = (transformers as any)[key];

      if (func) return func(arg as any);
      return (transformers as any).else(arg as any);
    }
    const _else = (transformers as any).else;
    if (_else) {
      return _else(arg);
    }

    throw new Error(`Case for "${arg}" is not handled`);
  };
};
