import { Def, History, Mapper, Param, Subscriber } from './types';

export class Monad<T extends Def = Def> {
  constructor(private def: T, public current?: Param<T>) {}

  #history: History[] = [];

  #subscribers: Subscriber<Param<T>>[] = [];

  #mapper?: Mapper<T, unknown>;

  #mapped: unknown;

  get isUndefined() {
    return this.current === undefined;
  }

  get _mapped() {
    return this.#mapped;
  }

  get history() {
    return this.#history;
  }

  #addHistory = () => {
    const hist: History = { input: this.current, output: this.#mapped };
    this.#history.push(hist);
  };

  #flushSubcribers = () => {
    this.#subscribers.forEach(subscriber =>
      subscriber(this.current, this.#mapped),
    );
  };

  #map = <R = unknown>(mapper: Mapper<T, R>): R => {
    const _else = mapper.else;
    if (this.isUndefined) {
      return _else(this.current);
    } else {
      const entries = Object.entries(this.def);
      for (const [key, cond] of entries) {
        const func = mapper[key];
        const validated = cond(this.current);
        if (func && validated) {
          return func(this.current);
        }
      }
      return _else(this.current);
    }
  };

  createMap = <R>(mapper: Mapper<T, R>) => mapper;

  subscribe = (subscriber: Subscriber<Param<T>>) => {
    this.#subscribers.push(subscriber);
  };

  setMapper = <R = unknown>(mapper: Mapper<T, R>) => {
    this.#mapper = mapper;
  };

  transform<R = unknown>(mapper: Mapper<T, R>, flush = true) {
    this.setMapper(mapper);
    if (!this.#mapper) throw new Error('No mapper');
    this.#mapped = this.#map(this.#mapper);
    this.#addHistory();
    flush && this.#flushSubcribers();
    return this.#mapped as R;
  }

  merge = <R extends Def = Def>(
    other: Monad<R>,
    mapper?: Mapper<T, Param<R>>,
  ) => {
    const current = mapper ? this.#map(mapper) : other.current;
    return new Monad<R>(other.def, current);
  };

  next = (...datas: Param<T>[]) => {
    datas.forEach(data => {
      this.current = data;
      if (!this.#mapper) throw new Error('No mapper');
      this.transform(this.#mapper);
    });
  };
}
