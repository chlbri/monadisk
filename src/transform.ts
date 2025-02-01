import type { Transform_F } from './types';

export const transform: Transform_F = (_monad, transformers) => {
  const monad = _monad.copy;

  return (...args) => {
    const key = monad.safeParse(...args);
    const check1 = key !== undefined;

    if (check1) {
      const func = (transformers as any)[key];

      if (func) return func(...args);
      return (transformers as any).else(...args);
    }
    const _else = (transformers as any).else;
    if (_else) {
      return _else(...args);
    }

    throw new Error(`Case for "${args}" is not handled`);
  };
};
