import { type TupleOf } from '@bemedev/types';
import { toObject } from './toObject';
import { toSimple } from './toSimple';
import {
  AND_LITERAL,
  CONCAT_LITERAL,
  OR_LITERAL,
  type Add_F,
  type CheckerMap,
  type CheckerMapHeritage,
  type Concat,
  type MapLength,
  type Merge,
  type SimpleMap,
  type ToObject,
  type ToSimple,
} from './types';

class Monad<const T extends CheckerMap = CheckerMap> {
  readonly #rawCheckers: T;
  readonly #simpleCheckers: ToSimple<T>;
  readonly #checkers: ToObject<T>;
  readonly #order: (keyof ToObject<T>)[];

  constructor(...checkers: T) {
    this.#rawCheckers = checkers;
    this.#simpleCheckers = toSimple(checkers);

    this.#checkers = toObject(...this.#simpleCheckers);
    this.#order = checkers.map(([key]) => key) as any;
  }

  get rawCheckers() {
    return this.#rawCheckers;
  }

  get checkers() {
    return this.#checkers;
  }

  get order() {
    return this.#order;
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

    this.#rawCheckers.forEach(([key1, func1]) => {
      (check2 ? monad.#rawCheckers : monad).forEach(([key2, func2]) => {
        const key = check1
          ? `${key1}${AND_LITERAL}${key2}`
          : `${key1}${OR_LITERAL}${key2}`;

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

        out.push([key, func]);
      });
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

    return new Monad(...checkers);
  };

  parse = (...args: TupleOf<unknown, MapLength<T>>) => {
    const checkers = this.#simpleCheckers as SimpleMap;
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];

      for (const [key, ...funcs] of checkers) {
        const map: any[] = funcs.map(func => {
          return func(arg);
        });
        const check = map.every(val => val === true);
        if (check) return key;
      }
    }

    return undefined;
  };
}

export type { Monad };

export const createMonad = <const T extends CheckerMap = CheckerMap>(
  ...checkers: T
) => {
  const out = new Monad(...checkers);

  return out;
};
