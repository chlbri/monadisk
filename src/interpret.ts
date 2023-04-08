import { Interpreter } from './Interpreter';
import { Monad } from './Monad';
import {
  GetRFromPlans,
  InterpreterOptions,
  Plans,
  Subscriber,
} from './types';

export function _interpret<
  T extends Plans = Plans,
  Merged extends boolean = false,
>(monad: Monad<T, Merged>, options?: InterpreterOptions<T>) {
  const interpreter = new Interpreter(
    monad.withOptions({
      keepHistory: options?.keepHistory,
      subscribable: true,
    }),
  );
  const subscribers = options?.subscribers;
  if (subscribers) {
    interpreter.addSubscribers(...(subscribers as any));
  }
  const getOptions = {
    history: interpreter.history,
    cached: interpreter.cached,
    subcribed: interpreter.subscribed,
    isUsed: interpreter.isUsed,
  };
  return [interpreter.next, getOptions] as const;
}

export function interpret<
  T extends Plans = Plans,
  Merged extends boolean = false,
>(
  monad: Monad<T, Merged>,
  ...subscribers: Subscriber<unknown, GetRFromPlans<T>>[]
) {
  return _interpret(monad, { keepHistory: false, subscribers })[0];
}
