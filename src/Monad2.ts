import { Options, Plans } from './types';

export class Monad<
  T extends Plans = Plans,
  Merged extends boolean = false,
> {
  constructor(private _plan: T, public options?: Options<Merged>) {}

  withOptions(options?: Options<Merged>) {
    return new Monad(this.plan, { ...this.options, ...options });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previous?: Monad<any, boolean>;
  #addPrevious = <P extends Plans, Merged extends boolean>(
    previous: Monad<P, Merged>,
  ) => {
    this.previous = previous;
  };

  get plan() {
    return this._plan;
  }

  #removePrevious = () => {
    this.previous = undefined;
  };

  merge = <P extends Plans>(monad: Monad<P>) => {
    const temp = new Monad(monad._plan, {
      ...monad.options,
      merged: true,
    });
    temp.#addPrevious(this);
    return temp;
  };

  get unMerge() {
    this.#removePrevious();
    return this;
  }

  static #mergePlan<P extends Plans>(
    plan1: P,
    plan2: P,
    type: 'and' | 'or' = 'and',
  ) {
    const entries = Object.entries(plan2.options);

    const mergedEntries = entries.map(([key, value]) => {
      const check2 = value.check;
      const check1 = plan1.options[key].check;

      const transform = value.transform;

      const check = (data?: unknown) =>
        type === 'and'
          ? check1(data) && check2(data)
          : check1(data) || check2(data);

      return [key, { transform, check }] as const;
    });

    return mergedEntries.reduce((acc, [key, value]) => {
      return { ...acc, [key]: value };
    }, {} as P['options']);
  }

  #andOr = (monad: Monad<T, false>, type: 'and' | 'or' = 'and') => {
    const options = Monad.#mergePlan(this._plan, monad._plan, type);

    const mergedPlan = {
      options,
      else: monad._plan.else,
    } as T;

    const monadOptions: Options<false> = {
      ...this.options,
      merged: false,
    };

    return new Monad(mergedPlan, monadOptions);
  };

  and = (monad: Monad<T, false>) => this.#andOr(monad);

  or = (monad: Monad<T, false>) => this.#andOr(monad, 'or');
}

export type GetPlanFromMonad<T extends Monad> = T extends Monad<infer P>
  ? P
  : never;
