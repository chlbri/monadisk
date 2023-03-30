import { createMonad } from './createMonad';
import { Interpreter } from './Interpreter';
import { Monad } from './Monad2';
import { Plans, Subscriber } from './types';

export function interpret<
  T extends Plans = Plans,
  Merged extends boolean = false,
>(monad: Monad<T, Merged>, ...subscribers: Subscriber[]) {
  const interpreter = new Interpreter(monad);
  interpreter.addSubscribers(...subscribers);
  return interpreter.next;
}

const monad1 = createMonad({
  options: {
    string: {
      check: 'isString',
      transform: 'toString',
    },
    number: {
      check: 'isNumber',
      transform: 'toNumber',
    },
  },
  else: 'toString',
  types: {} as {
    string: [string, number];
    number: [number, number];
  },
  default: {} as unknown as null,
});

const sub = interpret(monad1);

const t = sub(45);

type Test1 = typeof t;
