export declare type Def = {
  [key: string]: (data: any) => boolean;
};
export declare type Param<
  T extends Def = Def,
  K extends keyof T = keyof T,
> = Parameters<T[K]>[0];
export declare type Subscriber<I = unknown, O = unknown> = (
  input: I,
  output: O,
) => unknown;
declare type _Mapper<T extends Def = Def, R = unknown> = {
  [key in keyof T]: (data: Param<T, key>) => R;
};
export declare type Mapper<T extends Def = Def, R = unknown> = (
  | _Mapper<T, R>
  | Partial<_Mapper<T, R>>
) & {
  else: (data?: Param<T>) => R;
};
export declare type History<T extends Def = Def, O = unknown> = {
  input: Param<T>;
  output: O;
};
export declare type LastOf<T extends ReadonlyArray<unknown>> =
  T['length'] extends 0 | 1
    ? T[0]
    : T extends [unknown, infer U]
    ? U
    : never;
export {};
