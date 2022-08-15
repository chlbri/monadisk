import { sleep } from './helpers';
import { Def, History, Mapper, Param, Subscriber } from './types';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};

export class Monad<T extends Def = Def> {
  constructor(private def: T, public current?: Param<T>) {}

  #history: History[] = [];

  #subscribers: Subscriber<Param<T>>[] = [];

  #mapper?: Mapper<T, unknown>;

  #mapped: any;

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

  #map = <R = any>(mapper: Mapper<T, R>): R => {
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

  setMapper = <R = any>(mapper: Mapper<T, R>) => {
    this.#mapper = mapper;
  };

  transform<R = any>(mapper: Mapper<T, R>, flush = true) {
    this.setMapper(mapper);
    this.#mapped = this.#map(this.#mapper!);
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
      this.transform(this.#mapper!);
    });
  };
}

const testMonad = new Monad({
  string: (data: string) => typeof data === 'string',
  positive: (data: number) => typeof data === 'number' && data > 0,
  negative: (data: number) => typeof data === 'number' && data < 0,
  zero: (data: number) => typeof data === 'number' && data === 0,
  boolean: (data: boolean) => typeof data === 'boolean',
  date: (data: Date) => data instanceof Date,
});

const map = testMonad.createMap({
  positive: () => 'positif',
  negative: () => 'négatif',
  boolean: () => 'booléen',
  zero: () => 'nul',
  string: () => 'string',
  date: () => 'date',
  else: () => 'inconnu',
});

export async function main() {
  const datas = [
    undefined,
    1,
    -1,
    0,
    'empty',
    'another string',
    true,
    45,
    new Date(),
    new Set(),
  ];
  testMonad.subscribe((input, output) => {
    console.log(`${input} => ${output}`);
  });

  testMonad.setMapper(map);

  for (const data of datas) {
    await sleep(300);
    testMonad.next(data as any);
  }

  console.log(testMonad.history);
}

main();
