import { toSimple } from './toSimple';
import type { Checker_F, CheckerMap, Merge, ToSimple } from './types';

class Monad<const T extends CheckerMap = CheckerMap> {
  #rawCheckers: T;
  #checkers: ToSimple<T>;
  readonly #entries: [string, (arg: unknown) => boolean][];
  readonly order: (keyof T)[];

  constructor(checkers: T) {
    this.#rawCheckers = checkers;
    this.#checkers = toSimple(checkers);
    this.#entries = Object.entries(this.#checkers).sort(this.#sorter);
    this.order = Object.keys(checkers);
  }

  /**
   * @deprecated
   * Used for typings
   */
  readonly rawCheckers: T = undefined as any;

  get checkers() {
    return this.#checkers;
  }

  #andOr(monad: this | T, and = true) {
    const check2 = monad instanceof Monad;

    const keys = Object.keys(check2 ? monad.#rawCheckers : monad);

    const out: any = {};

    keys.forEach(key => {
      const func1 = this.#rawCheckers[key];
      const func2 = check2 ? monad.#rawCheckers[key] : monad[key];

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

      out[key] = func;
    });

    const out2 = new Monad<T>(out);

    return out2;
  }

  or = (monad: this | T) => {
    return this.#andOr(monad, false);
  };

  and = (monad: this | T) => {
    return this.#andOr(monad, true);
  };

  add = <K extends Exclude<string, keyof K>, F extends Checker_F>(
    key: K,
    checker: F,
  ) => {
    const checkers: T & { [key in K]: F } = {
      ...this.#rawCheckers,
      [key]: checker,
    };

    return new Monad(checkers);
  };

  #sorter = ([key1]: [string, any], [key2]: [string, any]) =>
    key1.localeCompare(key2);

  #mergeAndOr = <U extends CheckerMap, AndOr extends boolean = true>(
    monad: Monad<U> | U,
    and?: AndOr,
  ) => {
    const check1 = and === undefined || and === true;
    const check2 = monad instanceof Monad;
    const out: any = {};

    const entriesThis = Object.entries(this.#rawCheckers).sort(
      this.#sorter,
    );

    const entriesNext = Object.entries(
      check2 ? monad.#rawCheckers : monad,
    ).sort(this.#sorter);

    entriesThis.forEach(([key1, func1]) => {
      entriesNext.forEach(([key2, func2]) => {
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

        out[key] = func;
      });
    });

    const checkers = out as Merge<T, U, AndOr>;

    return new Monad(checkers);
  };

  mergeAnd = <U extends CheckerMap>(monad: Monad<U> | U) => {
    return this.#mergeAndOr(monad);
  };

  mergeOr = <U extends CheckerMap>(monad: Monad<U> | U) => {
    return this.#mergeAndOr(monad, false);
  };

  parse = (arg: unknown) => {
    for (const [key, func] of this.#entries) {
      const actual = func(arg);
      if (actual) return key;
    }

    return undefined;
  };
}

export type { Monad };

export const createMonad = <T extends CheckerMap = CheckerMap>(
  checkers: T,
) => {
  const out = new Monad(checkers);

  return out;
};
