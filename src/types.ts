/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Monad } from './monad';

export type Result<T = any> = { check: true; value: T } | false;

export type CheckerB_F = (arg: unknown) => boolean;
export type Checker_F<T = any> = (arg: unknown) => Result<T>;

export type CheckerA<T> =
  | ((arg: unknown) => arg is T)
  | ((arg: unknown) => boolean);

export type CreateCheck_F = <T = any>(fn: CheckerA<T>) => Checker_F<T>;

type Fn = (...args: any[]) => any;

export type Checker = [string | number, Checker_F];

export type CheckerMap = Checker[];

export type ToObject<T extends CheckerMap> = T extends [
  infer U extends Checker,
  ...infer Rest extends CheckerMap,
]
  ? {
      [key in U[0]]: CheckerB_F;
    } & (Rest['length'] extends 0 ? {} : ToObject<Rest>)
  : {};

type ToObject2<T extends CheckerMap> = T extends [
  infer U extends Checker,
  ...infer Rest extends CheckerMap,
]
  ? {
      [key in U[0]]: U[1];
    } & (Rest['length'] extends 0 ? {} : ToObject2<Rest>)
  : {};

export type ToObject_F = <const T extends CheckerMap>(
  ...map: T
) => ToObject<T>;

export type ResultFrom<T> =
  ReturnType<Extract<T, Fn>> extends
    | { value: infer R; check: true }
    | false
    ? R
    : never;

export type CreateMonad_F = <T extends CheckerMap>(
  checkers: T,
) => Monad<T>;

export type ToRawFunction_F = <T>(
  arg: [string, Checker_F<T>],
) => Checker_F<T>;

export type ToKey_F = (arg: [string, Fn]) => string;

export type ToFunction_F = (
  arg: [string, (arg: unknown) => boolean],
) => (arg: unknown) => boolean;

type _ToSimple<T extends CheckerMap> = T extends [
  infer U extends Checker,
  ...infer Rest extends CheckerMap,
]
  ? [
      [U[0], CheckerB_F],
      ...(Rest['length'] extends 0 ? [] : _ToSimple<Rest>),
    ]
  : never;

export type ToSimple<T extends CheckerMap> = Extract<_ToSimple<T>, any[]>;

export type Add_F<T extends CheckerMap> = <
  K extends string | number,
  F extends Checker_F,
>(
  key: K,
  checker: F,
) => Monad<[...T, [K, F]]>;

export type ToSimple_F = <T extends CheckerMap>(map: T) => ToSimple<T>;

export type ToSimpleOne_F = (fn: Checker_F) => CheckerB_F;

type TrueKey<T> = T extends number | string ? T : never;

export type ToB<T extends boolean = true> = T extends true ? '&' : '||';

type Merge2<
  T extends Checker,
  U extends Checker,
  B extends boolean = true,
> = [`${TrueKey<T[0]>}${ToB<B>}${TrueKey<U[0]>}`, U[1]];

type Merge3<
  T extends Checker,
  M extends CheckerMap,
  B extends boolean = true,
> = M extends [infer U extends Checker, ...infer Rest extends CheckerMap]
  ? [
      Merge2<T, U, B>,
      ...(Rest['length'] extends 0 ? [] : Merge3<T, Rest, B>),
    ]
  : never;

export type Merge<
  Prev extends CheckerMap,
  Next extends CheckerMap,
  B extends boolean = true,
> = Prev extends [
  infer U1 extends Checker,
  ...infer Rest extends CheckerMap,
]
  ? [
      ...Merge3<U1, Next, B>,
      ...(Rest['length'] extends 0 ? [] : Merge<Rest, Next>),
    ]
  : never;

export type Transform<
  C extends CheckerMap,
  Tr = any,
  T extends ToObject2<C> = ToObject2<C>,
> =
  | ({
      [key in keyof T]?: (arg: ResultFrom<T[key]>) => Tr;
    } & { else: (arg: unknown) => Tr })
  | ({
      [key in keyof T]: (arg: ResultFrom<T[key]>) => Tr;
    } & { else?: (arg: unknown) => Tr });

export type Transform_F = <const T extends CheckerMap, Tr = any>(
  monad: Monad<T>,
  transformers: Transform<T, Tr>,
) => (arg: unknown) => Tr;

export type RawCheckersFrom<T extends Monad<any>> = T['rawCheckers'];
export type CheckersFrom<T extends Monad> = T['checkers'];
