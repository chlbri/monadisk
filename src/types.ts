import type { Monad } from './monad';

export type Result<T = any> = { check: true; value: T } | false;

export type Checker_F<T = any> = (arg: unknown) => Result<T>;

export type CheckerA<T> =
  | ((arg: unknown) => arg is T)
  | ((arg: unknown) => boolean);

export type CreateCheck_F = <T = any>(fn: CheckerA<T>) => Checker_F<T>;

export type CheckerMap = Record<string | number, Checker_F>;

export type ResultFrom<T extends Checker_F> =
  ReturnType<T> extends { value: infer R } ? R : never;

export type CreateMonad_F = <T extends CheckerMap>(
  checkers: T,
) => Monad<T>;

type ToSimple<T extends CheckerMap> = {
  [key in keyof T]: (arg: unknown) => boolean;
};

export type ToSimple_F = <T extends CheckerMap>(map: T) => ToSimple<T>;
