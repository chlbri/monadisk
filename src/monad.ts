import { toObject } from './toObject';
import { toSimple } from './toSimple';
import type {
  Add_F,
  CheckerMap,
  Merge,
  ToObject,
  ToSimple,
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

  /**
   * @deprecated
   * Used for typings and tests
   */
  readonly rawCheckers: T = undefined as any;

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

  #mergeAndOr = <U extends CheckerMap, AndOr extends boolean = true>(
    monad: Monad<U> | U,
    and?: AndOr,
  ) => {
    const check1 = and === undefined || and === true;
    const check2 = monad instanceof Monad;
    const out = [] as any;

    this.#rawCheckers.forEach(([key1, func1]) => {
      (check2 ? monad.#rawCheckers : monad).forEach(([key2, func2]) => {
        const key = check1 ? `${key1}&${key2}` : `${key1}||${key2}`;

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

    return new Monad<Merge<T, U, AndOr>>(...checkers);
  };

  mergeAnd = <const U extends CheckerMap>(monad: Monad<U> | U) => {
    return this.#mergeAndOr(monad);
  };

  mergeOr = <const U extends CheckerMap>(monad: Monad<U> | U) => {
    return this.#mergeAndOr(monad, false);
  };

  parse = (arg: unknown) => {
    const checkers = this.#simpleCheckers as any[];
    for (const [key, func] of checkers) {
      const actual = func(arg);
      if (actual) return key;
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
