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
