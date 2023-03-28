import { CreateMonadOptions, CreateMonadParams, Params } from './types';

export function createMonad<T extends Params = Params, R = unknown>(
  plan: CreateMonadParams<T, R>,
  options?: CreateMonadOptions<typeof plan>,
) {
  const strict = plan.strict ?? false;
  
}
