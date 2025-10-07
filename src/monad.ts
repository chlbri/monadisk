import { transform } from './transform';
import { type TupleOf } from '@bemedev/core/lib/globals/types.js';
import { PARSE_ERROR } from './constants';
import { reduceFunctions } from './reduceFunctions';
import { toObject } from './toObject';
import {
  AND_LITERAL,
  CONCAT_LITERAL,
  OR_LITERAL,
  type Add_F,
  type Checker_F,
  type CheckerMap,
  type CheckerMapHeritage,
  type Concat,
  type MapLength,
  type Merge,
  type ToObject,
  type Transform,
} from './types';

class Monad<const T extends CheckerMap = CheckerMap> {
  readonly #rawCheckers: T;
  readonly #checkers: ToObject<T>;
  readonly #order: (string | number)[];

  constructor(...checkers: T) {
    this.#rawCheckers = checkers;
    this.#checkers = toObject(...checkers);
    this.#order = checkers.map(([key]) => key);
  }

  /**
   * @deprecated
   * For typings
   */
  get rawCheckers() {
    return this.#rawCheckers;
  }

  get checkers() {
    return this.#checkers;
  }

  get order() {
    return this.#order;
  }

  get copy() {
    return new Monad(...this.#rawCheckers);
  }

  #andOr(monad: this | T, and = true) {
    const check2 = monad instanceof Monad;

    const out: T = [] as any;

    this.#order.forEach(key => {
      const search1 = this.#rawCheckers.find(([key1]) => key1 === key);
      const search2 = (check2 ? monad.#rawCheckers : monad).find(
        ([key1]) => key1 === key,
      );
      const check3 = search1 && search2;
      if (check3) {
        const func1 = search1[1];
        const func2 = search2[1];

        let func = (arg: unknown) => {
          const out1 = func1(arg);
          if (out1 === false) return false;

          const out2 = func2(out1.value);
          return out2;
        };

        if (!and) {
          func = (arg: unknown) => {
            const out1 = func1(arg);
            if (out1 === false) return func2(arg);
            return out1;
          };
        }

        out.push([key as any, func]);
      }
    });

    const out2 = new Monad<T>(...out);

    return out2;
  }

  or = (monad: this | T) => {
    return this.#andOr(monad, false);
  };

  and = (monad: this | T) => {
    return this.#andOr(monad, true);
  };

  add: Add_F<T> = (key, checker) => {
    const checkers: any = [...this.#rawCheckers, [key, checker]];

    return new Monad(...checkers);
  };

  #mergeAndOr = <
    U extends CheckerMapHeritage<T>,
    AndOr extends boolean = true,
  >(
    monad: Monad<U> | U,
    and?: AndOr,
  ) => {
    const check1 = and === undefined || and === true;
    const check2 = monad instanceof Monad;
    const out: any[] = [];

    this.#rawCheckers.forEach(([key1, ...funcs1]) => {
      (check2 ? monad.#rawCheckers : monad).forEach(
        ([key2, ...funcs2]) => {
          const key = check1
            ? `${key1}${AND_LITERAL}${key2}`
            : `${key1}${OR_LITERAL}${key2}`;

          const funcs: Checker_F[] = [];

          for (let index = 0; index < funcs1.length; index++) {
            const func1 = funcs1[index];
            const func2 = funcs2[index];

            const func = check1
              ? (arg: unknown) => {
                  const out1 = func1(arg);
                  if (out1 === false) return false;

                  const out2 = func2(out1.value);
                  return out2;
                }
              : (arg: unknown) => {
                  const out1 = func1(arg);
                  if (out1 === false) {
                    return func2(arg);
                  }
                  return out1;
                };

            funcs.push(func);
          }

          out.push([key, ...funcs]);
        },
      );
    });

    const checkers = out as Merge<T, U, AndOr>;

    return new Monad(...checkers);
  };

  mergeAnd = <const U extends CheckerMapHeritage<T>>(
    monad: Monad<U> | U,
  ) => {
    return this.#mergeAndOr(monad);
  };

  mergeOr = <const U extends CheckerMapHeritage<T>>(
    monad: Monad<U> | U,
  ) => {
    return this.#mergeAndOr(monad, false);
  };

  concat = <const U extends CheckerMap>(monad: Monad<U> | U) => {
    const check1 = monad instanceof Monad;
    const raw1 = this.#rawCheckers;
    const raw2 = check1 ? monad.#rawCheckers : monad;

    const out: any[] = [];

    raw1.forEach(([key1, ...funcs1]) => {
      raw2.forEach(([key2, ...funcs2]) => {
        const key = `${key1}${CONCAT_LITERAL}${key2}`;

        out.push([key, ...funcs1, ...funcs2]);
      });
    });

    const checkers = out as Concat<T, U>;
    const out1 = new Monad(...checkers);

    return out1;
  };

  safeParse = (...args: TupleOf<unknown, MapLength<T>>) => {
    for (const [key, ...functions] of this.#rawCheckers) {
      const func = reduceFunctions(...functions);
      const actual = func(...args);

      if (actual) return key;
    }

    return undefined;
  };

  parse = (...args: TupleOf<unknown, MapLength<T>>) => {
    const out = this.safeParse(...args);
    const check = out === undefined;

    if (check) throw new Error(PARSE_ERROR);
    return out;
  };

  transform = <const Transformers extends Transform<T>>(
    transformers: Transformers,
  ) => {
    return transform(this, transformers);
  };
}

export type { Monad };

export const createMonad = <
  const T extends CheckerMap<any> = CheckerMap<any>,
>(
  ...checkers: T
) => {
  const out = new Monad(...checkers);

  return out;
};
