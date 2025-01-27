import { CreateCheck_F } from './types';

export const createCheck: CreateCheck_F = <T>(fn: any) => {
  return arg => {
    const check = fn(arg);

    const value = arg as T;
    if (check) return { check, value };
    return false;
  };
};
