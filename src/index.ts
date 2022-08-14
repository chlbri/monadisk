export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};

type Def = {
  [key: string]: (data: any) => boolean;
};

type Param<T extends Def = Def, K extends keyof T = keyof T> = Parameters<
  T[K]
>[0];

// type Subscriber = (data: unknown) => unknown;

type _Mapp<T extends Def = Def, R = any> = {
  [key in keyof T]: (data: Param<T, key>) => R;
};

type Mapp<T extends Def = Def, R = any> =
  | (_Mapp<T, R> & { else?: undefined })
  | (Partial<_Mapp<T, R>> & { else: (data?: Param<T>) => R });

class Monad<T extends Def = Def> {
  private history: any[] = [];

  map = <R = any>(mapp: Mapp<T, R>) => {
    const entries = Object.entries(this.def);
    const _else = mapp.else;
    if (this.value === undefined) {
      if (_else) return _else(this.value);
      return undefined;
    }
    for (const [key, cond] of entries) {
      const func = mapp[key];
      if (func) {
        const mapped = func(this.value);
        const validated = cond(this.value);
        if (validated) return mapped;
      }
    }

    if (_else) return _else(this.value);
    return undefined;
  };

  add = (...datas: Param<T>[]) => {
    datas.forEach(data => {
      this.value = data;
      this.history.push(this.value);
    });
  };

  createMap = <R>(mapp: Mapp<T, R>) => mapp;

  constructor(private def: T, private value?: Param<T>) {}
}

function sleep(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function* gen() {
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
  ];
  for (const data of datas) {
    await sleep(/* 500 */);
    yield data;
  }
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
  // else: () => 'inconnu',
});

function tester(data: any) {
  testMonad.add(data);
  console.log(data, ' => ', testMonad.map(map));
}

async function main() {
  console.log('************************');
  console.log('Async iteration');
  console.log('************************\n');

  for await (const x of gen()) {
    tester(x);
  }

  console.log('\n************************');
}

main();
