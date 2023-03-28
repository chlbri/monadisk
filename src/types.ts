/* eslint-disable @typescript-eslint/no-explicit-any */
export type Def = {
  [key: string]: (data: any) => boolean;
};

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

export type Param<
  T extends Def = Def,
  K extends keyof T = keyof T,
> = Parameters<T[K]>[0];

export type Param2<
  T extends Plans = Plans,
  K extends keyof T['options'] = keyof T['options'],
> = Parameters<T['options'][K]['transform']>[0];

export type Subscriber<C = unknown, M = unknown> = (
  current?: C,
  mapped?: M,
) => unknown;

type _Mapper<T extends Def = Def, R = unknown> = {
  [key in keyof T]: (data: Param<T, key>) => R;
};

export type Mapper<T extends Def = Def, R = unknown> =
  | _Mapper<T, R>
  | (Partial<_Mapper<T, R>> & { else: (data: Param<T>) => R });

export type History<T extends Def = Def, O = unknown> = {
  input: Param<T>;
  output: O;
};
export type History2<T extends Plans = Plans, O = unknown> = {
  input: Param2<T>;
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
  subcribable?: boolean;
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
// #endregion
