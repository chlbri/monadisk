import { createCheck } from './createCheck';
import type { CreateChecker_F, CreateCheckerSN_F } from './types';

export const createChecker: CreateChecker_F = (key, ...functions) => {
  return [key, ...functions.map(createCheck)] as any;
};

export const createCheckerSN: CreateCheckerSN_F = key => {
  return [key, createCheck(arg => arg === key)];
};
