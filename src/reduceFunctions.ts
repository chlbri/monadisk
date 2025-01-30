import type {
  ReduceFunction_F,
  ReduceFunctions_F,
} from './reduceFunctions.types';

export const reduceFunctions: ReduceFunctions_F = (...functions) => {
  return (...args) => {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const func = reduceFunction(functions[index]);

      const out1 = func(arg);
      if (!out1) return false;
    }

    return true;
  };
};

export const reduceFunction: ReduceFunction_F = checker => {
  return arg => {
    const out = checker(arg);

    if (!out) return false;
    return out.check;
  };
};
