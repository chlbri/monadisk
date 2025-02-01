import { createPrimeChecker } from './createChecker';
import { createMonad } from './monad';
import type { CreateMonadSN_F, CreatePrimitiveMonad_F } from './types';

export const createPrimeMonad: CreatePrimitiveMonad_F = (...params) => {
  const checkers = params.map(createPrimeChecker);
  const out = createMonad(...checkers) as any;

  return out;
};

export const createMonadSN: CreateMonadSN_F = createPrimeMonad;
