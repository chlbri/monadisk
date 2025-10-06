/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  Primitive,
  TupleOf,
} from '@bemedev/core/lib/globals/types.js';
import type { Monad } from './monad';

export type LengthOf<T extends any[]> = T['length'];

export type ToString_F = <T extends Primitive>(value: T) => PTS<T>;

export type PrimeToString<T extends Primitive> = T extends number
  ? T
  : `${T}`;

export type PTS<T extends Primitive> = PrimeToString<T>;

export type PrimesToStrings<T extends Primitive[]> = T extends [
  infer U extends Primitive,
  ...infer Rest extends Primitive[],
]
  ? [PTS<U>, ...(LengthOf<Rest> extends 0 ? [] : PrimesToStrings<Rest>)]
  : never;

export type Result<T = unknown> = { check: true; value: T } | false;

export type CheckerB_F = (arg: unknown) => boolean;
export type Checker_F<T = any> = (arg: unknown) => Result<T>;

export type CheckerA<T = any> = ((arg: unknown) => arg is T) | CheckerB_F;

export type CreateCheck_F = <T = any>(fn: CheckerA<T>) => Checker_F<T>;

export type TransformCheckA<T extends CheckerA> =
  T extends CheckerA<infer A> ? Checker_F<A> : never;

export type TransformChecksA<T extends CheckerA[]> = T extends [
  infer U extends CheckerA,
  ...infer Rest extends CheckerA[],
]
  ? [
      TransformCheckA<U>,
      ...(LengthOf<Rest> extends 0 ? [] : TransformChecksA<Rest>),
    ]
  : [];

export type CreateChecker_F = <
  K extends string | number,
  T extends CheckerA<any>[],
>(
  key: K,
  ...functions: T
) => [K, ...TransformChecksA<T>];

export type CreateCheckerSN_F = <K extends string | number>(
  key: K,
) => CheckerSN<K>;

export type CreatePrimeChecker_F = <K extends Primitive>(
  key: K,
) => [PTS<K>, Checker_F<K>];

export type CheckerSN<K extends string | number> = [K, Checker_F<K>];

export type TransformChecksSN<T extends (string | number)[]> = T extends [
  infer U extends string | number,
  ...infer Rest extends (string | number)[],
]
  ? [
      CheckerSN<U>,
      ...(LengthOf<Rest> extends 0 ? [] : TransformChecksSN<Rest>),
    ]
  : [];

export type CreateMonadSN_F = <const T extends (string | number)[]>(
  ...keys: T
) => Monad<TransformChecksSN<T>>;

export type CreatePrimitiveMonad_F = <const T extends Primitive[]>(
  ...keys: T
) => Monad<TransformChecksSN<PrimesToStrings<T>>>;

type Fn = (...args: any[]) => any;

export type Checker<N extends number = number> = [
  string | number,
  ...TupleOf<Checker_F, N>,
];

export type GetFunctionsFrom<T extends Checker> = T extends [
  any,
  ...infer Rest,
]
  ? Rest
  : never;

export type DisplayChecker<T extends Checker> = {
  key: T[0];
  functions: GetFunctionsFrom<T>;
};

export type CheckerMap<N extends number = number> = Checker<N>[];

export type SimpleMap = [string, ...CheckerB_F[]][];
export type MapLength<T extends CheckerMap> = LengthOf<
  GetFunctionsFrom<T[0]>
>;

export type CheckerHeritage<T extends Checker> =
  T extends Checker<infer N> ? Checker<N> : never;

export type CheckerMapHeritage<T extends CheckerMap> = CheckerMap<
  MapLength<T>
>;

export type MaybeArray<T extends any[]> = LengthOf<T> extends 1 ? T[0] : T;

export type ToObject<T extends CheckerMap> = T extends [
  infer U extends Checker,
  ...infer Rest extends CheckerMapHeritage<T>,
]
  ? {
      [key in U[0]]: MaybeArray<
        TupleOf<CheckerB_F, LengthOf<GetFunctionsFrom<U>>>
      >;
    } & (Rest['length'] extends 0 ? {} : ToObject<Rest>)
  : {};

type ToObject2<T extends CheckerMap> = T extends [
  infer U extends Checker,
  ...infer Rest extends CheckerMap,
]
  ? {
      [key in U[0]]: GetFunctionsFrom<U>;
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

export type ResultsFrom<T> = T extends [infer U, ...infer R extends any[]]
  ? [ResultFrom<U>, ...(LengthOf<R> extends 0 ? [] : ResultsFrom<R>)]
  : [];

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
      [U[0], ...TupleOf<CheckerB_F, LengthOf<GetFunctionsFrom<U>>>],
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

// #region CONSTANTS
export const AND_LITERAL = '&&';
export type AndLiteral = typeof AND_LITERAL;

export const OR_LITERAL = '||';
export type OrLiteral = typeof OR_LITERAL;

export const CONCAT_LITERAL = '::';
export type ConcatLiteral = typeof CONCAT_LITERAL;
export type CL = ConcatLiteral;
// #endregion

export type ToB<T extends boolean = true> = T extends true
  ? AndLiteral
  : OrLiteral;

type Merge2<
  T extends Checker,
  U extends CheckerHeritage<T>,
  B extends boolean = true,
> = [`${TrueKey<T[0]>}${ToB<B>}${TrueKey<U[0]>}`, U[1]];

type Merge3<
  T extends Checker,
  M extends CheckerMap,
  B extends boolean = true,
> = M extends [
  infer U extends CheckerHeritage<T>,
  ...infer Rest extends CheckerMap,
]
  ? [
      Merge2<T, U, B>,
      ...(Rest['length'] extends 0 ? [] : Merge3<T, Rest, B>),
    ]
  : never;

export type Merge<
  Prev extends CheckerMap,
  Next extends CheckerMapHeritage<Prev>,
  B extends boolean = true,
> = Prev extends [
  infer U1 extends Checker,
  ...infer Rest extends CheckerMapHeritage<Prev>,
]
  ? [
      ...Merge3<U1, Next, B>,
      ...(Rest['length'] extends 0
        ? []
        : Next extends CheckerMapHeritage<Rest>
          ? Merge<Rest, Next, B>
          : []),
    ]
  : never;

type Concat2<T extends Checker, U extends Checker> = [
  `${TrueKey<T[0]>}${CL}${TrueKey<U[0]>}`,
  ...GetFunctionsFrom<T>,
  ...GetFunctionsFrom<U>,
];

type Concat3<T extends Checker, M extends CheckerMap> = M extends [
  infer U extends Checker,
  ...infer Rest extends CheckerMap,
]
  ? [Concat2<T, U>, ...(Rest['length'] extends 0 ? [] : Concat3<T, Rest>)]
  : never;

export type Concat<
  Prev extends CheckerMap,
  Next extends CheckerMap,
> = Prev extends [
  infer U1 extends Checker,
  ...infer Rest extends CheckerMap,
]
  ? [
      ...Concat3<U1, Next>,
      ...(Rest['length'] extends 0 ? [] : Concat<Rest, Next>),
    ]
  : never;

export type Parser_F<T extends CheckerMap, Tr = any> = (
  ...args: TupleOf<unknown, MapLength<T>>
) => Tr;

export type Transform<
  C extends CheckerMap,
  Tr = any,
  T extends ToObject2<C> = ToObject2<C>,
> =
  | ({
      [key in keyof T]?: (...args: ResultsFrom<T[key]>) => Tr;
    } & { else: Parser_F<C, Tr> })
  | ({
      [key in keyof T]: (...args: ResultsFrom<T[key]>) => Tr;
    } & { else?: Parser_F<C, Tr> });

export type Transform_F = <const T extends CheckerMap, Tr = any>(
  monad: Monad<T>,
  transformers: Transform<T, Tr>,
) => Parser_F<T, Tr>;

export type RawCheckersFrom<T extends Monad<any>> = T['rawCheckers'];
export type CheckersFrom<T extends Monad> = T['checkers'];
