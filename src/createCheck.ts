import { CreateCheck_F } from './types';

export const createCheck: CreateCheck_F = fn => {
  return arg => {
    const check = fn(arg);

    const value = arg as any;
    if (check) return { check, value };
    return false;
  };
};
