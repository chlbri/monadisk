export type Def = {
  [key: string]: (data: any) => boolean;
};

export type Param<
  T extends Def = Def,
  K extends keyof T = keyof T,
> = Parameters<T[K]>[0];

export type Subscriber<I = any, O = any> = (
  input: I,
  output: O,
) => unknown;

type _Mapper<T extends Def = Def, R = any> = {
  [key in keyof T]: (data: Param<T, key>) => R;
};

export type Mapper<T extends Def = Def, R = any> = (
  | _Mapper<T, R>
  | Partial<_Mapper<T, R>>
) & { else: (data?: Param<T>) => R };

export type History<T extends Def = Def, O = any> = {
  input: Param<T>;
  output: O;
};

export type LastOf<T extends ReadonlyArray<any>> = T['length'] extends
  | 0
  | 1
  ? T[0]
  : T extends [any, infer U]
  ? U
  : never;
