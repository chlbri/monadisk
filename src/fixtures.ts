import { createCheck } from './createCheck';
import { createMonad } from './monad';

// #region Parameters
export const monad1 = createMonad({
  string: createCheck(data => typeof data === 'string'),
  number: createCheck(data => typeof data === 'number'),
  45: createCheck(data => data === 45),
});

export const monad2 = createMonad({
  string: createCheck(data => typeof data === 'string'),
  number: createCheck(data => typeof data === 'number'),
}).add(
  '45',
  createCheck(data => data === 45),
);

export const monad3 = monad1.or(monad2).or({
  string: createCheck(data => typeof data === 'string'),
  number: createCheck(data => typeof data === 'number'),
  45: createCheck(data => data === 45),
});

export const monad4 = createMonad({
  boolean: createCheck(data => typeof data === 'boolean'),
  exist: createCheck(data => data === 'exist'),
});

export const monad5 = monad2.mergeAnd(monad4);
export const monad6 = monad2.mergeOr({
  boolean: createCheck(data => typeof data === 'boolean'),
  exist: createCheck(data => data === 'exist'),
});

export const monad7 = monad1.and(monad2);

export const monad8 = createMonad({
  strict45: createCheck(data => data === 45),
  string: createCheck(data => typeof data === 'string'),
  number: createCheck(data => typeof data === 'number'),
});

export const monad9 = createMonad({
  number: createCheck(data => typeof data === 'number'),
  string: createCheck(data => typeof data === 'string'),
  strict45: createCheck(data => data === 45),
});

export const monad10 = monad3.mergeAnd({
  true: createCheck(data => data === true),
  64: createCheck(data => data === 64),
  45: createCheck(data => data === 45),
  exist: createCheck(data => data === 'exist'),
});

// #endregion
