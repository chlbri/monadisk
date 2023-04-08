import { Monad } from './Monad';
import {
  CreateMonadOptions,
  CreateMonadParams,
  TransformParamsToPlans,
} from './types';

export const DEFAULT_GUARD = () => true;
export const DEFAULT_TRANSFORM = <T>(data: T) => data;

export function getGuard<T extends CreateMonadParams>(
  value: keyof CreateMonadOptions<T>['guards'],
  guards?: CreateMonadOptions<T>['guards'],
  strict = false,
) {
  if (strict) {
    if (!guards) {
      throw new Error('No guards');
    }

    const guard = guards[value];
    if (!guard) throw new Error(`Guard "${value}" not found`);
    return guard;
  }
  if (!guards) {
    return DEFAULT_GUARD;
  }
  const guard = guards[value] ?? DEFAULT_GUARD;
  return guard;
}

export function getTransform<T extends CreateMonadParams>(
  value: keyof CreateMonadOptions<T>['transforms'],
  transforms?: CreateMonadOptions<T>['transforms'],
  strict = false,
) {
  if (strict) {
    if (!transforms) {
      throw new Error('No transforms');
    }

    const transform = transforms[value];
    if (!transform) throw new Error(`Transform "${value}" not found`);
    return transform;
  }
  if (!transforms) {
    return DEFAULT_TRANSFORM;
  }
  const transform = transforms[value] ?? DEFAULT_TRANSFORM;
  return transform;
}

export function getOptions<T extends CreateMonadParams>(
  params: T,
  optionsM?: CreateMonadOptions<T>,
) {
  const entries = Object.entries(params.options);
  const strict = params.strict ?? false;

  const mapper = entries.map(([key, { check, transform }]) => {
    return {
      [key]: {
        check: getGuard(check, optionsM?.guards, strict),
        transform: getTransform(transform, optionsM?.transforms, strict),
      },
    };
  });

  const _options = mapper.reduce((acc, current) => {
    return Object.assign(acc, current);
  });

  return _options;
}

export function createMonad<const T extends CreateMonadParams>(
  params: T,
  optionsM?: CreateMonadOptions<T>,
) {
  const keepHistory = optionsM?.keepHistory;
  const subscribable = optionsM?.subscribable;

  const options = getOptions(params, optionsM);

  const _else = optionsM?.else ?? DEFAULT_TRANSFORM;

  const plan = {
    options,
    else: _else,
  } as TransformParamsToPlans<T>;

  return new Monad(plan, { keepHistory, subscribable });
}
