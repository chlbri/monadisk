export type Def = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (data: any) => boolean;
};

export type Param<
  T extends Def = Def,
  K extends keyof T = keyof T,
> = Parameters<T[K]>[0];

export type Subscriber<I = unknown, O = unknown> = (
  input: I,
  output: O,
) => unknown;

type _Mapper<T extends Def = Def, R = unknown> = {
  [key in keyof T]: (data: Param<T, key>) => R;
};

export type Mapper<T extends Def = Def, R = unknown> = (
  | _Mapper<T, R>
  | Partial<_Mapper<T, R>>
) & { else: (data?: Param<T>) => R };

export type History<T extends Def = Def, O = unknown> = {
  input: Param<T>;
  output: O;
};

export type LastOf<T extends ReadonlyArray<unknown>> = T['length'] extends
  | 0
  | 1
  ? T[0]
  : T extends [unknown, infer U]
  ? U
  : never;
