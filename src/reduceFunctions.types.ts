import type { LengthOf, TupleOf } from '@bemedev/types';
import type { Checker_F } from './types';

export type ReduceFunctions_F = <const T extends Checker_F[]>(
  ...functions: T
) => (...args: TupleOf<unknown, LengthOf<T>>) => boolean;

export type ReduceFunction_F = <const T extends Checker_F>(
  func: T,
) => (arg: unknown) => boolean;
