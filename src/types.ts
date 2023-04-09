/* eslint-disable @typescript-eslint/no-explicit-any */

export type Plan<T = any, R = any> = {
  check: (data?: T) => boolean;
  transform: (data?: T) => R;
};

export type Plans<T = any, R = any> = {
  options: { [key: string]: Plan<T, R> };
  else: (data: unknown) => R;
};

export type GetT<T extends Plans> = Parameters<
  T['options'][keyof T['options']]['check']
>[0];

type __PlanReturns<T extends Plans = Plans, V = any> = {
  options: NotSubType<
    {
      [key in keyof T['options']]: Parameters<
        T['options'][key]['transform']
      >[0] extends V
        ? ReturnType<T['options'][key]['transform']>
        : never;
    },
    never
  >;
}['options'];

type _PlanReturns<
  TPlans extends Plans = Plans,
  Value = any,
> = __PlanReturns<TPlans, Value>[keyof __PlanReturns<TPlans, Value>];

type ReturnTransform<T extends Plans = Plans> =
  | ReturnType<T['else']>
  | ReturnType<T['options'][keyof T['options']]['transform']>;

export type PlanReturns<
  TPlans extends Plans = Plans,
  Value = any,
  Merged extends boolean = false,
> = Merged extends false
  ? _PlanReturns<TPlans, Value> extends never
    ? ReturnType<TPlans['else']>
    : _PlanReturns<TPlans, Value>
  : ReturnTransform<TPlans>;

export type GetParam<
  T extends Plans = Plans,
  K extends keyof T['options'] = keyof T['options'],
> = Parameters<T['options'][K]['transform']>[0];

export type Subscriber<C = unknown, M = unknown> = (
  current?: C,
  mapped?: M,
) => unknown;

export type History<T extends Plans = Plans, O = unknown> = {
  input: GetParam<T>;
  output: O;
};

export type LastOf<T extends ReadonlyArray<unknown>> = T['length'] extends
  | 0
  | 1
  ? T[0]
  : T extends [unknown, infer U]
  ? U
  : never;

export type Options<Merged extends boolean> = {
  keepHistory?: boolean;
  subscribable?: boolean;
  merged?: Merged;
};

// #region SubType
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type SubType<Base, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;

export type NotSubType<Base, Condition> = Omit<
  Base,
  AllowedNames<Base, Condition>
>;
//#endregion

export type Params = {
  [key: string]: [any, any];
};

export type CreateMonadParams<T extends Params = Params, R = unknown> = {
  options: {
    [key in keyof T]: {
      check: string;
      transform: string;
      weight?: number;
    };
  };
  types?: T;
  strict?: boolean;
  default?: R;
};

export type GetTFromMonadParams<T extends CreateMonadParams> = T['types'];

type GetRFromMonadParams<T extends CreateMonadParams> =
  T extends CreateMonadParams<any, infer A> ? A : unknown;

export type GetCreateMonadParamsCheck<T extends CreateMonadParams> =
  T['options'][keyof T['options']]['check'];

type GetCreateMonadParamsTransform<T extends CreateMonadParams> =
  | T['options'][keyof T['options']]['transform'];

type GetParentKeyFromTransform<
  T extends CreateMonadParams,
  K extends GetCreateMonadParamsTransform<T>,
> = keyof SubType<T['options'], { transform: K }>;

export type GetTransformSignature<
  T extends CreateMonadParams,
  K extends GetCreateMonadParamsTransform<T>,
> = GetTFromMonadParams<T> extends infer TT
  ? TT extends undefined
    ? [unknown, GetRFromMonadParams<T>]
    : GetParentKeyFromTransform<T, K> extends infer PT
    ? PT extends keyof TT
      ? TT[PT] extends [any, any]
        ? TT[PT]
        : [unknown, GetRFromMonadParams<T>]
      : [unknown, GetRFromMonadParams<T>]
    : [unknown, GetRFromMonadParams<T>]
  : [unknown, GetRFromMonadParams<T>];

export type CreateMonadOptions<T extends CreateMonadParams> = {
  keepHistory?: boolean;
  subscribable?: boolean;
  guards?: {
    [key in GetCreateMonadParamsCheck<T>]?: (data: unknown) => boolean;
  };
  transforms?: {
    [key in GetCreateMonadParamsTransform<T>]?: (
      data: GetTransformSignature<T, key>[0],
    ) => GetTransformSignature<T, key>[1];
  };
  else?: (data: unknown) => GetRFromMonadParams<T>;
};

export type TransformParamsToPlans<T extends CreateMonadParams> = {
  options: {
    [key in keyof T['options']]: {
      check: (data: unknown) => boolean;
      transform: GetTFromMonadParams<T> extends infer TT
        ? TT extends undefined
          ? (data: unknown) => GetRFromMonadParams<T>
          : key extends keyof TT
          ? TT[key] extends infer HT
            ? HT extends [any, any]
              ? (data: HT[0]) => HT[1]
              : (data: unknown) => GetRFromMonadParams<T>
            : (data: unknown) => GetRFromMonadParams<T>
          : (data: unknown) => GetRFromMonadParams<T>
        : (data: unknown) => GetRFromMonadParams<T>;
    };
  };
  else: (data: unknown) => GetRFromMonadParams<T>;
};

export type GetRFromPlans<T extends Plans = Plans> = T extends Plans<
  any,
  infer A
>
  ? A
  : unknown;

export type InterpreterOptions<T extends Plans = Plans> = {
  keepHistory?: boolean;
  subscribers?: Subscriber<unknown, GetRFromPlans<T>>[];
};
