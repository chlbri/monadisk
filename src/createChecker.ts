import { createCheck } from './createCheck';
import type {
  CreateChecker_F,
  CreateCheckerSN_F,
  CreatePrimeChecker_F,
} from './types';
import { toString } from './utils';

export const createChecker: CreateChecker_F = (key, ...functions) => {
  return [key, ...functions.map(createCheck)] as any;
};

export const createPrimeChecker: CreatePrimeChecker_F = key => {
  return createChecker(toString(key), arg => arg === key) as any;
};

export const createCheckerSN: CreateCheckerSN_F = key => {
  return createPrimeChecker(key) as any;
};
