import { Monad } from './Monad2';
import {
  GetRFromPlans,
  History2,
  PlanReturns,
  Plans,
  Subscriber,
} from './types';

export class Interpreter<
  T extends Plans = Plans,
  Merged extends boolean = false,
> {
  static #getOptionsPlan<P extends Plans>(plans: P) {
    return Object.values(plans.options);
  }

  static #map = (value: unknown, plans: Plans) => {
    const optionsPlan = Interpreter.#getOptionsPlan(plans);
    for (const plan of optionsPlan) {
      const validated = plan.check(value);
      if (validated) {
        return plan.transform(value);
      }
    }

    return plans.else(value);
  };

  constructor(private monad: Monad<T, Merged>) {}

  #history: History2<T>[] = [];
  #current?: T;
  #mapped?: any;
  #subscribers: Subscriber<unknown, GetRFromPlans<T>>[] = [];

  get isUsed() {
    return this.#history.length > 0;
  }

  get history() {
    return this.#history;
  }

  get #plan() {
    return this.monad.plan;
  }

  get #options() {
    return this.monad.options;
  }

  get #keepHistory() {
    return this.#options?.keepHistory ?? false;
  }

  get #subcribable() {
    return this.#options?.subscribable ?? false;
  }

  get subscribed() {
    return this.#subscribers.length > 0;
  }

  get cached() {
    return this.#keepHistory;
  }

  addSubscribers = (
    ...subscribers: Subscriber<unknown, GetRFromPlans<T>>[]
  ) => {
    if (this.#subcribable) {
      subscribers.forEach(subscriber =>
        this.#subscribers.push(subscriber),
      );
    }
  };

  #addHistory = () => {
    if (this.#keepHistory) {
      const hist: History2 = {
        input: this.#current,
        output: this.#mapped,
      };
      this.#history.push(hist);
    }
  };

  #flushSubcribers = () => {
    this.#subscribers.forEach(subscriber =>
      subscriber(this.#current, this.#mapped),
    );
  };

  #doFunctions = () => {
    this.#addHistory();
    this.#flushSubcribers();
  };

  #next = (value: unknown) => {
    this.#mapped = Interpreter.#map(value, this.#plan);
    this.#doFunctions();
    return this.#mapped;
  };

  next = <V>(value: V): PlanReturns<T, V, Merged> => {
    this.#current = value as unknown as T;
    const previous = this.monad.previous;

    if (previous) {
      const plan = previous.plan;
      const temp = Interpreter.#map(value, plan);
      return this.#next(temp) as PlanReturns<T, V, Merged>;
    }

    return this.#next(value) as PlanReturns<T, V, Merged>;
  };
}
