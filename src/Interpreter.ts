import { Monad } from './Monad2';
import { History2, PlanReturns, Plans, Subscriber } from './types';

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
  #mapped?: unknown;
  #subscribers: Subscriber[] = [];

  get isUsed() {
    return this.#history.length > 0;
  }

  get current() {
    return this.#current;
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
    return this.#options?.subcribable ?? false;
  }

  addSubscribers = (...subscribers: Subscriber[]) => {
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

  next = <V>(value: unknown): PlanReturns<T, V, Merged> => {
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