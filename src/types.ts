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

export type ToSimple<T extends CheckerMap> = {
  [key in keyof T]: (arg: unknown) => boolean;
};

export type Add_F = <S extends string, F extends Checker_F>(
  arg: [S, F] | { key: S; checker: F },
) => void;

export type ToSimple_F = <T extends CheckerMap>(map: T) => ToSimple<T>;

type TrueKey<T> = T extends number | string ? T : never;

export type Merge<
  Prev extends CheckerMap,
  Next extends CheckerMap,
  AndOr extends boolean = true,
> = {
  [key in keyof Next as `${TrueKey<keyof Prev>}${AndOr extends true ? '&' : '||'}${TrueKey<key>}`]: Next[key];
};

export type Transform<T extends CheckerMap, Tr = any> =
  | ({
      [key in keyof T]?: (arg: ResultFrom<T[key]>) => Tr;
    } & { else: (arg: unknown) => Tr })
  | {
      [key in keyof T]: (arg: ResultFrom<T[key]>) => Tr;
    };

export type Transform_F = <T extends CheckerMap, Tr = any>(
  monad: Monad<T>,
  transformers: Transform<T, Tr>,
) => (arg: unknown) => Tr | undefined;
